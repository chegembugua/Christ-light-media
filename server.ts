import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import http from "http";
import { Server } from "socket.io";

async function startServer() {
  const app = express();
  const PORT = 3000;
  
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  // We'll broadcast listener counts using memory only. The client will handle syncing to Firestore if needed.
  let currentListeners = 0;
  let peakListeners = 0;

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    // In a full production app, verify the token with firebase-admin here:
    // admin.auth().verifyIdToken(token).then(...).catch(...)
    
    // For this implementation, we will accept the token if present (or allow anonymous if absent)
    // to maintain flexibility. A strictly authenticated stream would reject here.
    if (token) {
      socket.data.authenticated = true;
    }
    
    next();
  });

  io.on('connection', (socket) => {
    // Keep track of whether this socket is playing the radio
    let isListening = false;

    // Send the current count to the newly connected socket
    socket.emit('listener_count_update', { count: currentListeners, peak: peakListeners });

    socket.on('update_token', (data) => {
      const newToken = data.token;
      // In production, verify newToken here
      if (newToken) {
         socket.data.authenticated = true;
         // Note: If invalid, we would call socket.disconnect(true)
      }
    });

    socket.on('join_radio', () => {
      if (!isListening) {
        isListening = true;
        currentListeners++;
        if (currentListeners > peakListeners) peakListeners = currentListeners;
        io.emit('listener_count_update', { count: currentListeners, peak: peakListeners });
      }
    });

    socket.on('leave_radio', () => {
      if (isListening && currentListeners > 0) {
        isListening = false;
        currentListeners--;
        io.emit('listener_count_update', { count: currentListeners, peak: peakListeners });
      }
    });

    socket.on('send_notification', (data) => {
      // Broadcast the notification.
      // The client receiving it will filter if it corresponds to their userId
      io.emit('new_notification', data);
    });

    socket.on('disconnect', () => {
      if (isListening && currentListeners > 0) {
        isListening = false;
        currentListeners--;
        io.emit('listener_count_update', { count: currentListeners, peak: peakListeners });
      }
    });
  });

  // API routes FIRST
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Use server.listen instead of app.listen to use socket.io
  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
