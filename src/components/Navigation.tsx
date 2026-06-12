/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Store, Car, Utensils, Globe, Shield, Info, Settings, Heart } from 'lucide-react';

interface NavigationProps {
  currentBranch: 'trade' | 'ride' | 'food';
  onBranchSelect: (branch: 'trade' | 'ride' | 'food') => void;
  lang: 'en' | 'ur';
  setLang: (lang: 'en' | 'ur') => void;
  activeView: 'home' | 'shops' | 'chats' | 'settings' | 'about' | 'activities';
  setActiveView: (view: 'home' | 'shops' | 'chats' | 'settings' | 'about' | 'activities') => void;
  unreadCount: number;
  user: any;
  onLogin: () => void;
  onLogout: () => void;
}

export default function Navigation({
  currentBranch,
  onBranchSelect,
  lang,
  setLang,
  activeView,
  setActiveView,
  unreadCount,
  user,
  onLogin,
  onLogout
}: NavigationProps) {

  const handleBranchClick = (branch: 'trade' | 'ride' | 'food') => {
    if (branch !== 'trade') {
      onBranchSelect(branch);
    } else {
      setActiveView('home');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#f4f1ea] border-b border-[#dcd7ce] shadow-md text-[#3a3a3a]" id="nav-header">
      {/* Top Bar for Location, Flag and Developer Badge */}
      <div className="bg-[#5a6a5a] py-1.5 px-4 text-xs font-mono text-white/95 border-b border-[#4d5b4d] flex justify-between items-center flex-wrap gap-2">
        <div className="flex items-center space-x-2">
          <span className="animate-pulse">📍</span>
          <span>
            {lang === 'en' ? 'Mardan, KPK, Pakistan • Republic of Sawaldher' : 'مردان، خیبر پختونخوا • جمہوریہ صوالڈھیر'}
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-[10px] bg-[#4a584a] border border-[#dcd7ce]/10 px-2 py-0.5 rounded text-[#fdfbf7]">
            {lang === 'en' ? 'Dev: M. Sudais Durrani' : 'ڈویلپر: محمد سدیس دورانی'}
          </span>
          <div className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-[#d4a373] animate-ping" />
            <span className="text-[10px] uppercase text-white/90 font-bold">
              {lang === 'en' ? 'Live Network' : 'آن لائن نیٹ ورک'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Clickable Brand Logo with Custom Animated Village Crest Badge */}
        <div 
          onClick={() => setActiveView('home')} 
          className="flex items-center space-x-3 cursor-pointer group"
          id="brand-logo"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#5a6a5a] to-[#d4a373] flex items-center justify-center text-white font-black text-xl shadow-md group-hover:rotate-12 transition-transform duration-300">
            🌳
          </div>
          <div>
            <h1 className="text-xl font-serif font-bold text-[#5a6a5a] leading-none tracking-tight group-hover:text-[#4d5b4d] transition-colors">
              REPUBLIC OF SAWALDHER
            </h1>
            <p className="text-[10px] text-[#d4a373] font-bold tracking-widest uppercase mt-0.5">
              Community Trade Platform
            </p>
          </div>
        </div>

        {/* Dynamic Branch Selector Switch (English & Urdu custom styles) */}
        <nav className="flex items-center bg-[#ebe6dd] border border-[#dcd7ce] rounded-2xl p-1 shadow-inner h-12 w-full max-w-sm md:max-w-md" id="branch-nav">
          <button
            onClick={() => handleBranchClick('trade')}
            className={`flex-1 relative flex items-center justify-center space-x-2 h-full rounded-xl text-xs font-bold transition-all duration-300 ${
              currentBranch === 'trade' && activeView !== 'about' && activeView !== 'settings'
                ? 'text-white'
                : 'text-[#707070] hover:text-[#3a3a3a]'
            }`}
          >
            {currentBranch === 'trade' && activeView !== 'about' && activeView !== 'settings' && (
              <motion.div
                layoutId="active-branch"
                className="absolute inset-0 bg-[#5a6a5a] rounded-xl shadow-md"
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5 font-sans">
              <Store size={14} />
              <span>{lang === 'en' ? 'Trade' : 'تجارت'}</span>
            </span>
          </button>

          <button
            onClick={() => handleBranchClick('ride')}
            className={`flex-1 relative flex items-center justify-center space-x-2 h-full rounded-xl text-xs font-bold transition-all duration-300 ${
              currentBranch === 'ride' ? 'text-white' : 'text-[#707070] hover:text-[#3a3a3a]'
            }`}
          >
            {currentBranch === 'ride' && (
              <motion.div
                layoutId="active-branch"
                className="absolute inset-0 bg-[#d4a373] rounded-xl shadow-md"
              />
            )}
            <span className="relative z-10 flex flex-col items-center">
              <span className="flex items-center gap-1.5 font-sans">
                <Car size={14} />
                <span>{lang === 'en' ? 'Ride' : 'سواری'}</span>
              </span>
              <span className="text-[7.5px] text-[#8a5a4a] font-mono tracking-tighter block -mt-0.5">
                {lang === 'en' ? 'UPCOMING' : 'جلد ہی آ رہا ہے'}
              </span>
            </span>
          </button>

          <button
            onClick={() => handleBranchClick('food')}
            className={`flex-1 relative flex items-center justify-center space-x-2 h-full rounded-xl text-xs font-bold transition-all duration-300 ${
              currentBranch === 'food' ? 'text-white' : 'text-[#707070] hover:text-[#3a3a3a]'
            }`}
          >
            {currentBranch === 'food' && (
              <motion.div
                layoutId="active-branch"
                className="absolute inset-0 bg-[#8a5a4a] rounded-xl shadow-md"
              />
            )}
            <span className="relative z-10 flex flex-col items-center">
              <span className="flex items-center gap-1.5 font-sans">
                <Utensils size={14} />
                <span>{lang === 'en' ? 'Food' : 'کھانا'}</span>
              </span>
              <span className="text-[7.5px] text-[#8a5a4a] font-mono tracking-tighter block -mt-0.5">
                {lang === 'en' ? 'UPCOMING' : 'جلد ہی آ رہا ہے'}
              </span>
            </span>
          </button>
        </nav>

        {/* Utilities: Language Toggle, Messages, Profile & About Links */}
        <div className="flex items-center space-x-2 self-stretch md:self-auto justify-between" id="quick-utilities">
          {/* Stunning Language Switcher Slider */}
          <div className="bg-[#ebe6dd] border border-[#dcd7ce] p-0.5 rounded-xl flex items-center mr-1">
            <button
              onClick={() => setLang('en')}
              className={`px-3 py-1.5 text-[11px] font-black rounded-lg transition-all duration-300 flex items-center ${
                lang === 'en'
                  ? 'bg-[#5a6a5a] text-white shadow-md'
                  : 'text-[#707070] hover:text-[#3a3a3a]'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLang('ur')}
              className={`px-3 py-1.5 text-[11px] font-black rounded-lg transition-all duration-300 flex items-center ${
                lang === 'ur'
                  ? 'bg-[#5a6a5a] text-white shadow-md'
                  : 'text-[#707070] hover:text-[#3a3a3a]'
              }`}
            >
              اردو
            </button>
          </div>

          {/* Quick Nav Items */}
          <div className="flex items-center space-x-1 bg-[#ebe6dd] border border-[#dcd7ce] p-1 rounded-xl">
            {/* View Classifieds / Home */}
            <button
              onClick={() => setActiveView('home')}
              className={`p-1.5 sm:px-3 sm:py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1 transition-all ${
                activeView === 'home'
                  ? 'bg-[#5a6a5a] text-white border border-[#4d5b4d]'
                  : 'text-[#707070] hover:text-[#3a3a3a] border border-transparent'
              }`}
              title={lang === 'en' ? 'Classifieds' : 'شائع اشیاء'}
            >
              <span>{lang === 'en' ? 'Classifieds' : 'تمام تجارت'}</span>
            </button>

            {/* View Shops */}
            <button
              onClick={() => setActiveView('shops')}
              className={`p-1.5 sm:px-3 sm:py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1 transition-all ${
                activeView === 'shops'
                  ? 'bg-[#5a6a5a] text-white border border-[#4d5b4d]'
                  : 'text-[#707070] hover:text-[#3a3a3a] border border-transparent'
              }`}
              title={lang === 'en' ? 'Shops' : 'دکانیں'}
            >
              <span>{lang === 'en' ? 'Shops' : 'دکانیں'}</span>
            </button>

            {/* My Activities Tab for Logged-In Users */}
            {user && (
              <button
                onClick={() => setActiveView('activities')}
                className={`p-1.5 sm:px-3 sm:py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1 transition-all ${
                  activeView === 'activities'
                    ? 'bg-[#5a6a5a] text-white border border-[#4d5b4d]'
                    : 'text-[#707070] hover:text-[#3a3a3a] border border-transparent'
                }`}
                title={lang === 'en' ? 'My Activities' : 'میری سرگرمیاں'}
                id="nav-activities-btn"
              >
                <span>🚀 {lang === 'en' ? 'My Activities' : 'میری سرگرمیاں'}</span>
              </button>
            )}

            {/* Chat button with live glowing indicator badge */}
            <button
              onClick={() => setActiveView('chats')}
              className={`relative p-2 rounded-lg text-[#707070] hover:text-[#3a3a3a] hover:bg-[#e5e0d8] transition-all ${
                activeView === 'chats' ? 'text-white bg-[#5a6a5a] hover:text-white hover:bg-[#5a6a5a]' : ''
              }`}
              title={lang === 'en' ? 'Chat inbox' : 'پیام رساں'}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white ring-2 ring-[#ebe6dd] animate-bounce">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>

          {/* Google Auth Segment */}
          <div className="flex items-center">
            {user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-[#dcd7ce]">
                <img
                  src={user.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.email}`}
                  alt={user.displayName || 'User'}
                  className="w-8 h-8 rounded-full border border-[#5a6a5a] object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="hidden lg:flex flex-col text-left">
                  <span className="text-[10px] font-bold text-[#3a3a3a] leading-none truncate max-w-[80px]">
                    {user.displayName?.split(' ')[0]}
                  </span>
                  <span className="text-[8px] text-[#707070] truncate max-w-[80px]">
                    {user.email}
                  </span>
                </div>
              </div>
            ) : (
              <button
                onClick={onLogin}
                className="px-3 py-1.5 bg-[#5a6a5a] text-white hover:bg-[#4d5b4d] rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer font-sans"
              >
                <span>🔑</span>
                <span>{lang === 'en' ? 'Login' : 'لاگ ان'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
