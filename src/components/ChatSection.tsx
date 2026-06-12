/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChatSession, Message, Listing } from '../types';
import { Send, User, Store, Phone, MessageSquare, AlertCircle } from 'lucide-react';

interface ChatSectionProps {
  sessions: ChatSession[];
  activeSessionId: string | null;
  onSelectSession: (id: string) => void;
  onSendMessage: (sessionId: string, text: string) => void;
  lang: 'en' | 'ur';
  onCallSeller: (phone: string, name: string) => void;
}

export default function ChatSection({
  sessions,
  activeSessionId,
  onSelectSession,
  onSendMessage,
  lang,
  onCallSeller
}: ChatSectionProps) {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeSession = sessions.find(s => s.id === activeSessionId) || null;

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeSession?.messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeSessionId) return;

    onSendMessage(activeSessionId, inputText.trim());
    setInputText('');
  };

  return (
    <div className="bg-white border border-[#dcd7ce] rounded-3xl overflow-hidden shadow-xl h-[600px] flex flex-col md:flex-row" id="chat-system">
      {/* Left Sidebar: Session List */}
      <div className="w-full md:w-80 border-r border-[#dcd7ce] flex flex-col bg-[#fcfbfa] shrink-0">
        <div className="p-4 border-b border-[#dcd7ce] bg-[#f4f1ea] flex items-center justify-between">
          <h3 className="font-bold text-[#3a3a3a] text-sm flex items-center gap-1.5 font-serif">
            <MessageSquare size={16} className="text-[#5a6a5a]" />
            <span>{lang === 'en' ? 'Active Offers Chat' : 'تجارتی پیام رساں'}</span>
          </h3>
          <span className="px-2 py-0.5 rounded bg-white text-[10px] font-mono text-[#5a6a5a] border border-[#dcd7ce]">
            {sessions.length} {lang === 'en' ? 'Chats' : 'رابطے'}
          </span>
        </div>

        {/* List scrollarea */}
        <div className="flex-1 overflow-y-auto divide-y divide-[#e5e0d8] p-2 space-y-1">
          {sessions.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#707070] flex flex-col items-center justify-center space-y-2 h-full">
              <span className="text-3xl filter grayscale opacity-45">💬</span>
              <p className="font-serif text-[#5a6a5a] font-bold">{lang === 'en' ? 'No active messages yet' : 'کوئی فعال پیغام نہیں ہے'}</p>
              <p className="text-[10px] text-[#8e8e8e]">
                {lang === 'en' ? 'Click "Chat with Seller" on classified items' : 'چیزیں خریدنے کے لیے "پیغام" پر کلک کریں'}
              </p>
            </div>
          ) : (
            sessions.map(session => (
              <button
                key={session.id}
                onClick={() => onSelectSession(session.id)}
                className={`w-full text-left p-3 rounded-2xl flex items-start gap-3 transition-all cursor-pointer ${
                  activeSessionId === session.id
                    ? 'bg-[#f4f1ea] border border-[#dcd7ce] shadow-sm'
                    : 'hover:bg-[#f4f1ea]/50 border border-transparent'
                }`}
              >
                {/* Seed Avatar */}
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#5a6a5a] to-[#7a8a7a] text-white font-bold flex items-center justify-center text-sm uppercase shadow-sm shrink-0">
                  {session.otherParticipantName.substring(0, 2)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h4 className="font-bold text-[#3a3a3a] text-xs truncate">
                      {session.otherParticipantName}
                    </h4>
                  </div>
                  {/* Subject Item Reference */}
                  <p className="text-[10.5px] text-[#5a6a5a] font-serif font-bold truncate mb-1">
                    🏷️ {lang === 'en' ? session.listingTitle : session.listingTitleUr}
                  </p>
                  {/* Last Message preview */}
                  <p className="text-[11px] text-[#707070] truncate leading-tight">
                    {session.messages.length > 0
                      ? session.messages[session.messages.length - 1].text
                      : 'No messages yet'}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Right Content: Active Conversation pane */}
      <div className="flex-1 flex flex-col bg-[#faf6f0]">
        {activeSession ? (
          <>
            {/* Chat header area */}
            <div className="p-4 bg-[#f4f1ea] border-b border-[#dcd7ce] flex items-center justify-between">
              <div className="flex items-center space-x-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#5a6a5a] to-[#7a8a7a] flex items-center justify-center text-white text-sm font-bold shadow-sm">
                  {activeSession.otherParticipantName.substring(0, 2)}
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-[#3a3a3a] text-sm truncate">
                    {activeSession.otherParticipantName}
                  </h4>
                  <p className="text-[10px] text-[#5a6a5a] font-serif font-bold truncate">
                    {lang === 'en'
                      ? `Regarding: ${activeSession.listingTitle}`
                      : `سودا: ${activeSession.listingTitleUr}`}
                  </p>
                </div>
              </div>

              {/* Call Direct Action button */}
              <button
                onClick={() => onCallSeller('03369048051', activeSession.otherParticipantName)}
                className="px-3 py-1.5 rounded-xl bg-[#5a6a5a]/10 hover:bg-[#5a6a5a]/20 text-[#5a6a5a] font-bold text-xs flex items-center gap-1 transition cursor-pointer"
              >
                <Phone size={13} />
                <span className="hidden sm:inline">{lang === 'en' ? 'Direct Call' : 'کال کریں'}</span>
              </button>
            </div>

            {/* Live Message Bubble Stream */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 flex flex-col bg-[#faf6f0]">
              {activeSession.messages.map((msg, index) => {
                const isMe = msg.senderId === 'user_me';
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className={`max-w-[75%] rounded-2xl p-3.5 shadow-sm flex flex-col ${
                      isMe
                        ? 'bg-[#5a6a5a] text-white rounded-br-none self-end'
                        : 'bg-white text-[#3a3a3a] rounded-bl-none self-start border border-[#dcd7ce]'
                    }`}
                  >
                    <p className="text-xs leading-relaxed font-sans">{msg.text}</p>
                    <span className={`text-[9px] mt-1.5 font-mono text-right block ${
                      isMe ? 'text-white/60' : 'text-[#8e8e8e]'
                    }`}>
                      {msg.timestamp}
                    </span>
                  </motion.div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input Console Form */}
            <form onSubmit={handleSend} className="p-3 bg-[#f4f1ea] border-t border-[#dcd7ce] flex items-center gap-2">
              <input
                type="text"
                required
                className="flex-1 bg-white border border-[#dcd7ce] focus:border-[#5a6a5a] rounded-xl px-4 py-2.5 text-xs text-[#3a3a3a] placeholder-[#707070] outline-none transition"
                placeholder={
                  lang === 'en'
                    ? 'Write offer details or ask for meeting...'
                    : 'مال کی ادائیگی اور تفصیلات پوچھیں ۔۔۔'
                }
                value={inputText}
                onChange={e => setInputText(e.target.value)}
              />
              <button
                type="submit"
                className="p-3 bg-[#5a6a5a] text-white rounded-xl hover:bg-[#4dd3ad]/0 hover:bg-[#4d5b4d] transition transform hover:scale-105 cursor-pointer"
              >
                <Send size={14} className="h-4 w-4" />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-3 bg-[#faf6f0]">
            <span className="text-5xl filter opacity-45 select-none text-[#5a6a5a] animate-bounce">💬</span>
            <h4 className="font-bold text-[#5a6a5a] text-base font-serif">
              {lang === 'en' ? 'Select a Merchant Chat' : 'صوالڈھیر ٹریڈ چیٹ منتخب کریں'}
            </h4>
            <p className="text-xs text-[#707070] max-w-xs leading-relaxed">
              {lang === 'en'
                ? 'Negotiate, bid, and trade directly with local villagers of Sawaldher using this real-time secure messaging client.'
                : 'دکانداروں کے ساتھ براہ راست ریٹ طے کریں اور باہمی رضامندی سے مال کی خرید و فروخت کریں۔'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
