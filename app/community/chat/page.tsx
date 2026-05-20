'use client';

import Image from 'next/image';
import { Send, Hash, Users, Lock, Smile, Plus } from 'lucide-react';
import ScrollReveal from '@/components/animations/ScrollReveal';
import PageHeader from '@/components/layout/PageHeader';

const CHANNELS = [
  { id: '1', name: 'general', active: true, type: 'public' },
  { id: '2', name: 'prayer-warriors', active: false, type: 'public' },
  { id: '3', name: 'bible-study', active: false, type: 'public' },
  { id: '4', name: 'youth-ministry', active: false, type: 'public' },
  { id: '5', name: 'leadership', active: false, type: 'private' },
];

const MESSAGES = [
  { id: 'm1', user: 'Pastor David', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100', time: '10:23 AM', content: 'Welcome everyone! Blessed to have you all here. What scripture spoke to you this morning?' },
  { id: 'm2', user: 'Sarah Okafor', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100', time: '10:25 AM', content: 'Psalm 91 for me! "He who dwells in the shelter of the Most High will rest in the shadow of the Almighty." Such a comforting reminder of His protection.' },
  { id: 'm3', user: 'Daniel K.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100', time: '10:30 AM', content: 'Amen! I was reading Philippians 4:6-7 today. Trying to practice giving my anxieties to God instead of holding onto them.' },
  { id: 'm4', user: 'Grace M.', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100', time: '10:35 AM', content: 'That\'s so relevant Daniel. I needed that reminder today too. 🙏' },
];

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col">
      <PageHeader 
        label="FELLOWSHIP" 
        title="Community Chat" 
        description="Connect with believers in real-time. Share insights, ask questions, and build lasting friendships." 
      />

      <section className="pb-20 flex-1 flex flex-col">
        <div className="container mx-auto px-6 max-w-6xl flex-1">
          <ScrollReveal className="h-[600px] bg-card border border-white/10 rounded-3xl overflow-hidden flex shadow-2xl">
            
            {/* Sidebar */}
            <div className="w-64 bg-black/40 border-r border-white/5 flex flex-col hidden md:flex">
              <div className="p-6 border-b border-white/5">
                <h2 className="font-cinzel font-bold text-lg">Christ Light Hub</h2>
                <div className="flex items-center gap-2 text-xs text-green-500 mt-1">
                  <div className="w-2 h-2 rounded-full bg-green-500" /> 1,248 Online
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-6">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-3 px-2">Channels</p>
                  <ul className="space-y-1">
                    {CHANNELS.map(channel => (
                      <li key={channel.id}>
                        <button className={`w-full flex items-center gap-2 px-2 py-2 rounded-lg text-sm transition-colors ${
                          channel.active ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'
                        }`}>
                          {channel.type === 'private' ? <Lock size={14} className="opacity-50" /> : <Hash size={14} className="opacity-50" />}
                          {channel.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col bg-[#121212]">
              {/* Chat Header */}
              <div className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-black/20">
                <div className="flex items-center gap-2">
                  <Hash size={18} className="text-gray-500" />
                  <h3 className="font-bold">general</h3>
                </div>
                <div className="flex items-center gap-4 text-gray-500">
                  <Users size={18} />
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gold/10 text-gold rounded-full flex items-center justify-center mx-auto mb-4">
                    <Hash size={32} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Welcome to #general</h3>
                  <p className="text-sm text-gray-500">This is the start of the general discussion channel.</p>
                </div>

                {MESSAGES.map(msg => (
                  <div key={msg.id} className="flex gap-4 group">
                    <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 mt-1">
                      <Image src={msg.avatar} alt={msg.user} width={40} height={40} className="object-cover" />
                    </div>
                    <div>
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="font-semibold text-sm">{msg.user}</span>
                        <span className="text-xs text-gray-500">{msg.time}</span>
                      </div>
                      <p className="text-gray-300 text-sm font-inter leading-relaxed">{msg.content}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input */}
              <div className="p-4 bg-black/40 border-t border-white/5">
                <div className="bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 flex items-center gap-3">
                  <button className="text-gray-500 hover:text-white transition-colors">
                    <Plus size={20} />
                  </button>
                  <input 
                    type="text" 
                    placeholder="Message #general..." 
                    className="flex-1 bg-transparent border-none outline-none text-sm text-white placeholder:text-gray-600"
                    disabled
                  />
                  <button className="text-gray-500 hover:text-white transition-colors">
                    <Smile size={20} />
                  </button>
                  <button className="w-8 h-8 rounded-lg bg-gold text-black flex items-center justify-center hover:bg-gold-dark transition-colors">
                    <Send size={14} className="ml-0.5" />
                  </button>
                </div>
                <p className="text-[10px] text-center text-gray-600 mt-2">
                  Please log in to participate in the chat.
                </p>
              </div>
            </div>

          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
