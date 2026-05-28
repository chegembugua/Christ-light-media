export default function About() {
  return (
    <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <header className="mb-16 text-center">
        <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/5 border border-gold/30 backdrop-blur-md mb-8">
           <span className="text-xs font-mono uppercase tracking-[0.2em] text-gold">A Digital Lampstand</span>
        </div>
        <h1 className="font-serif text-5xl md:text-7xl mb-6 tracking-tight drop-shadow-lg">Mission & Vision</h1>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
        <div>
          <h2 className="text-3xl font-serif mb-6 text-gold">Shining the Light of Christ</h2>
          <p className="text-gray-300 leading-relaxed mb-6 font-light text-lg italic border-l-2 border-gold/50 pl-4 py-1">
            "In For Christ Media exists to shine the light of Christ into every digital space — proclaiming the Gospel, equipping the saints, and fostering a global community of worship, prayer, and discipleship."
          </p>
          <p className="text-gray-300 leading-relaxed font-light mt-6">
            In For Christ Media is not a church. It is a digital lampstand (<span className="text-white">Revelation 1:20</span>) — a broadcasting and discipleship platform that supports the local church and helps believers grow in faith, worship, and community.
          </p>
        </div>
        <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/10 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 z-10"></div>
          <img src="https://images.unsplash.com/photo-1510590337019-5ef8d3d32116?auto=format&fit=crop&q=80" alt="Light" className="w-full h-full object-cover grayscale opacity-80" />
        </div>
      </div>

      <div className="bg-[#121216] border border-white/5 p-12 rounded-3xl text-center">
         <h2 className="text-3xl font-serif mb-6">Contact Us</h2>
         <p className="text-gray-400 mb-8 max-w-lg mx-auto">
           Have a project in mind, a prayer request, or want to collaborate? Connect with our team.
         </p>
         <form className="max-w-md mx-auto space-y-4 text-left">
           <div>
             <input type="text" placeholder="Your Name" className="w-full bg-[#0a0a0e] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#C8A24A]" />
           </div>
           <div>
             <input type="email" placeholder="Email Address" className="w-full bg-[#0a0a0e] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#C8A24A]" />
           </div>
           <div>
             <textarea rows={4} placeholder="Message" className="w-full bg-[#0a0a0e] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#C8A24A]"></textarea>
           </div>
           <button type="button" className="w-full bg-[#C8A24A] text-black font-medium py-3 rounded-lg hover:bg-[#d4b05a] transition-colors mt-4">
             Send Message
           </button>
         </form>
      </div>
    </div>
  );
}
