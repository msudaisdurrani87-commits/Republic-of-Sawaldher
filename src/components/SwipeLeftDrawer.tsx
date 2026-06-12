/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  Globe, 
  RefreshCw, 
  LogOut, 
  Cpu, 
  Sparkles, 
  ShieldCheck, 
  MapPin, 
  BadgeHelp,
  Settings,
  Info
} from 'lucide-react';
import { UserProfile } from '../types';

interface SwipeLeftDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  profile: UserProfile | null;
  lang: 'en' | 'ur';
  setLang: (lang: 'en' | 'ur') => void;
  onClearCache: () => void;
  onLogout: () => void;
  onTransitionToView: (view: 'settings' | 'about' | 'home' | 'shops' | 'chats' | 'activities') => void;
}

export default function SwipeLeftDrawer({
  isOpen,
  onClose,
  user,
  profile,
  lang,
  setLang,
  onClearCache,
  onLogout,
  onTransitionToView
}: SwipeLeftDrawerProps) {
  
  const isUrdu = lang === 'ur';

  // Format default profile details if none loaded yet
  const displayName = profile?.name || user?.displayName || (isUrdu ? 'ترقی پسند کسان / شہری' : 'Sawaldher Citizen');
  const displayPhone = profile?.phone || (isUrdu ? 'نمبر دستیاب نہیں' : '03001234567');
  const displayEmail = profile?.email || user?.email || (isUrdu ? 'ای میل لوڈ ہو رہا ہے...' : 'guest@sawaldher.com');

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex justify-end" id="swipe-left-drawer-layer">
          {/* Blur background overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#3a3a3a]/30 backdrop-blur-xs cursor-pointer"
          />

          {/* Drawer container from right */}
          <motion.div
            initial={{ x: '100%', opacity: 0.9 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0.9 }}
            transition={{ type: 'spring', damping: 24, stiffness: 220 }}
            className="relative w-[85%] sm:w-[380px] h-full bg-[#fcfbfa] border-l border-[#eadecc] text-[#3a3a3a] shadow-2xl flex flex-col p-6 overflow-y-auto block scrollbar-none"
          >
            {/* Slide guide header handle */}
            <div className="flex items-center justify-between pb-4 border-b border-[#eadecc] shrink-0">
              <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-widest text-[#5a6a5a]">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping inline-block" />
                <span>{isUrdu ? 'موبائل کنٹرول پینل' : 'Mobile Control Hub'}</span>
              </div>
              <button 
                onClick={onClose}
                className="p-1.5 rounded-xl bg-white text-[#5a6a5a] hover:text-[#3a3a3a] border border-[#eadecc] cursor-pointer shadow-xs active:scale-95 transition-all"
                title={isUrdu ? 'بند کریں' : 'Close Dashboard'}
              >
                <X size={16} />
              </button>
            </div>

            {/* Gesture Helper Tag */}
            <div className="mt-2 text-center">
              <span className="inline-block text-[9px] font-mono text-[#aa9d8b] uppercase tracking-widest">
                👉 {isUrdu ? 'بند کرنے کے لیے دائیں جانب سلائیڈ کریں' : 'Swipe right anywhere to close'}
              </span>
            </div>

            {/* Account Details Section */}
            <div className="mt-6 space-y-4">
              <h3 className="text-xs font-serif font-black uppercase text-[#5a6a5a] tracking-wider border-b border-[#f2ebe0] pb-1.5">
                👤 {isUrdu ? 'آپ کے اکاؤنٹ کی تفصیلات' : 'My Account Profile'}
              </h3>

              <div className="p-4 bg-gradient-to-tr from-[#5a6a5a]/5 to-[#d4a373]/5 border border-[#eadecc] rounded-2xl flex items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#5a6a5a] to-[#d4a373] flex items-center justify-center text-3xl shadow-sm border border-white relative shrink-0">
                  <span>{profile?.avatarEmoji || '🌾'}</span>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center" title="Verified">
                    <span className="text-[6px] text-white">✓</span>
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-sm text-[#3a3a3a] truncate leading-tight font-serif">
                    {displayName}
                  </h4>
                  <p className="text-[10px] text-[#aa9d8b] flex items-center gap-1 mt-0.5 truncate uppercase tracking-wider font-mono">
                    <ShieldCheck size={9} className="text-emerald-600" />
                    <span>{isUrdu ? 'تصدیق شدہ شہری' : 'Verified Resident'}</span>
                  </p>
                </div>
              </div>

              {/* Identity field details */}
              <div className="space-y-2.5 text-xs">
                <div className="px-3.5 py-2 bg-white border border-[#f2ebe0] rounded-xl flex items-center justify-between shadow-xs">
                  <div className="flex items-center gap-2 text-[#707070]">
                    <Mail size={12} className="text-[#aa9d8b]" />
                    <span>{isUrdu ? 'رابطہ ای میل' : 'Email Address'}</span>
                  </div>
                  <span className="font-mono text-[10px] text-[#3a3a3a] truncate max-w-[60%]">{displayEmail}</span>
                </div>

                <div className="px-3.5 py-2 bg-white border border-[#f2ebe0] rounded-xl flex items-center justify-between shadow-xs">
                  <div className="flex items-center gap-2 text-[#707070]">
                    <Phone size={12} className="text-[#aa9d8b]" />
                    <span>{isUrdu ? 'واٹس ایپ / فون' : 'Mobile Contact'}</span>
                  </div>
                  <span className="font-mono text-[11px] text-[#3a3a3a] font-bold">{displayPhone}</span>
                </div>

                <div className="px-3.5 py-2 bg-white border border-[#f2ebe0] rounded-xl flex items-center justify-between shadow-xs">
                  <div className="flex items-center gap-2 text-[#707070]">
                    <MapPin size={12} className="text-[#aa9d8b]" />
                    <span>{isUrdu ? 'علاقہ' : 'District'}</span>
                  </div>
                  <span className="font-serif text-[11px] text-[#3a3a3a] font-bold">{isUrdu ? 'صوالڈھیر، مردان' : 'Sawaldher, Mardan'}</span>
                </div>
              </div>
            </div>

            {/* Core Views Navigation (since removed from main classifieds feed) */}
            <div className="mt-8 space-y-4">
              <h3 className="text-xs font-serif font-black uppercase text-[#8a5a4a] tracking-wider border-b border-[#f2ebe0] pb-1.5">
                🧭 {isUrdu ? 'ایپ کے اہم صفحات' : 'Core App Pages'}
              </h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => {
                    onTransitionToView('settings');
                    onClose();
                  }}
                  className="flex flex-col items-center justify-center p-4 bg-white hover:bg-[#ebe6dd] border border-[#eadecc] rounded-2xl transition shadow-xs cursor-pointer active:scale-95 space-y-1.5"
                >
                  <Settings size={20} className="text-[#5a6a5a]" />
                  <span className="font-bold text-[11px] text-[#3a3a3a]">{isUrdu ? 'سیٹنگز پینل' : 'Settings'}</span>
                  <span className="text-[8px] text-[#aa9d8b] uppercase font-bold tracking-tighter">{isUrdu ? 'پروفائل اور سیکیورٹی' : 'Profile & Security'}</span>
                </button>

                <button
                  onClick={() => {
                    onTransitionToView('about');
                    onClose();
                  }}
                  className="flex flex-col items-center justify-center p-4 bg-white hover:bg-[#ebe6dd] border border-[#eadecc] rounded-2xl transition shadow-xs cursor-pointer active:scale-95 space-y-1.5"
                >
                  <Info size={20} className="text-[#5a6a5a]" />
                  <span className="font-bold text-[11px] text-[#3a3a3a]">{isUrdu ? 'ہمارے بارے میں' : 'About App'}</span>
                  <span className="text-[8px] text-[#aa9d8b] uppercase font-bold tracking-tighter">{isUrdu ? 'ایپ اور ڈویلپر' : 'Dev Biography'}</span>
                </button>
              </div>
            </div>

            {/* Quick Settings Section */}
            <div className="mt-8 space-y-4">
              <h3 className="text-xs font-serif font-black uppercase text-[#5a6a5a] tracking-wider border-b border-[#f2ebe0] pb-1.5">
                ⚙️ {isUrdu ? 'فوری ایپ سیٹنگز' : 'Instant App Preferences'}
              </h3>

              <div className="space-y-3 font-sans text-xs">
                {/* Language quick switcher */}
                <div className="p-3.5 bg-white border border-[#f2ebe0] rounded-2xl flex items-center justify-between shadow-xs">
                  <div className="flex items-center gap-2">
                    <Globe size={13} className="text-[#5a6a5a]" />
                    <div>
                      <h4 className="font-bold text-xs text-[#3a3a3a]">{isUrdu ? 'زبان تبدیل کریں' : 'App Language'}</h4>
                      <p className="text-[9px] text-[#aa9d8b]">{isUrdu ? 'انگلش یا اردو منتخب کریں' : 'Switch English or Urdu'}</p>
                    </div>
                  </div>
                  <div className="flex bg-[#f2ebe0] p-1 rounded-xl">
                    <button
                      onClick={() => setLang('en')}
                      className={`px-3 py-1 rounded-lg text-[10px] font-black tracking-wider transition-all cursor-pointer ${
                        lang === 'en' ? 'bg-[#5a6a5a] text-white shadow-xs' : 'text-[#707070]'
                      }`}
                    >
                      EN
                    </button>
                    <button
                      onClick={() => setLang('ur')}
                      className={`px-3 py-1 rounded-lg text-[11px] font-bold tracking-wider transition-all cursor-pointer ${
                        lang === 'ur' ? 'bg-[#5a6a5a] text-white shadow-xs font-sans' : 'text-[#707070]'
                      }`}
                    >
                      اردو
                    </button>
                  </div>
                </div>

                {/* Reset App Memory (Direct Cache Fix for disappearing posts) */}
                <div className="p-3.5 bg-white border border-[#f2ebe0] rounded-2xl flex items-center justify-between shadow-xs">
                  <div className="flex items-center gap-2">
                    <RefreshCw size={13} className="text-amber-700 animate-spin-slow" />
                    <div className="pr-2">
                      <h4 className="font-bold text-xs text-amber-900">{isUrdu ? 'مخفی اشتہارات بحال کریں' : 'Restore Hidden Posts'}</h4>
                      <p className="text-[9px] text-[#aa9d8b] max-w-[200px] leading-tight">
                        {isUrdu ? 'مقامی نظرانداز/ڈیلیٹ شدہ اشیاء کی میموری صاف کریں' : 'Clear local filter cache to show all trades'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={onClearCache}
                    className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 transition-all cursor-pointer shadow-2xs active:scale-95 text-[10px] font-black uppercase"
                  >
                    {isUrdu ? 'بحال' : 'Sync'}
                  </button>
                </div>
              </div>
            </div>

            {/* Developer Credits Section */}
            <div className="mt-8 space-y-4">
              <h3 className="text-xs font-serif font-black uppercase text-[#8a5a4a] tracking-wider border-b border-[#f2ebe0] pb-1.5">
                👨‍💻 {isUrdu ? 'ایپ بنانے والے (ڈویلپر)' : 'Developer & Founders'}
              </h3>

              <div className="p-4 bg-gradient-to-tr from-[#8a5a4a]/5 to-[#d4a373]/5 border border-amber-200/40 rounded-3xl relative overflow-hidden">
                <div className="flex items-start gap-2.5">
                  <span className="p-2 bg-white/80 border border-amber-100 rounded-xl text-lg shrink-0">🤝</span>
                  <div>
                    <h4 className="text-sm font-black text-[#8a5a4a] tracking-wide font-sans leading-tight">
                      Muhammad Sudais Durrani
                    </h4>
                    <p className="text-[10px] text-[#564d41] font-bold mt-1 leading-relaxed">
                      {isUrdu 
                        ? 'چیف سوفٹ ویئر انجینئر اور بانی، جمہوریہ صوالڈھیر ڈیجیٹل مارکیٹ۔' 
                        : 'Lead Software Engineer & Founder, Republic of Sawaldher Trade Portal.'}
                    </p>
                    <p className="text-[10px] text-[#aa9d8b] mt-2 leading-relaxed italic font-sans">
                      {isUrdu 
                        ? '"ہمارا مقصد صوالڈھیر کے کسانوں اور تاجروں کو کمیشن مافیا کے بغیر براہ راست تجارتی منڈی فراہم کرنا ہے۔"'
                        : '"Empowering Sawaldher farmers and merchants with robust direct-to-consumer digital channels."'}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-amber-200/30 flex items-center justify-between text-[10px] text-[#aa9d8b]">
                  <span className="font-mono">Build v2.4.0 (Mobile Canvas)</span>
                  <span className="font-serif font-black tracking-wider text-[#8a5a4a]">S.T.P. 2026</span>
                </div>
              </div>
            </div>

            {/* Log out / Quit Section */}
            <div className="mt-auto pt-8 shrink-0">
              <button
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="w-full py-3 bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-2xl flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
              >
                <LogOut size={13} />
                <span>{isUrdu ? 'اکاؤنٹ سے لاگ آؤٹ کریں' : 'Log Out from Device'}</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
