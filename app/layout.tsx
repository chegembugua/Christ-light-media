import type { Metadata } from "next";
import { Inter, Cinzel } from "next/font/google";
import "./globals.css";
import { PlayerProvider } from "@/context/PlayerContext";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/layout/Navbar";
import GlobalMiniPlayer from "@/components/player/GlobalMiniPlayer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const cinzel = Cinzel({ subsets: ["latin"], variable: "--font-cinzel" });

export const metadata: Metadata = {
  title: "Christ Light Media",
  description: "A full-stack Christian media platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${cinzel.variable} font-inter bg-[#0A0A0A] text-white min-h-screen relative`}>
        <AuthProvider>
          <PlayerProvider>
            <Navbar />
            <main className="pb-24">
              {children}
            </main>
            <GlobalMiniPlayer />
            <Toaster position="bottom-right" />
          </PlayerProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
