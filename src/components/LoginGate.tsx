/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Shield, Compass, ShoppingBag, ArrowRight, Mail, Lock, LogIn, UserPlus } from 'lucide-react';

interface LoginGateProps {
  lang: 'en' | 'ur';
  setLang: (l: 'en' | 'ur') => void;
  onLogin: () => Promise<void>;
  onEmailAuth: (email: string, pass: string, isSignUp: boolean) => Promise<string | null>;
  authLoading: boolean;
}

export default function LoginGate({ lang, setLang, onLogin, onEmailAuth, authLoading }: LoginGateProps) {
  const isUrdu = lang === 'ur';

  // State for login tabs & manual email forms
  const [activeTab, setActiveTab] = useState<'google' | 'email'>('google');
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [localLoading, setLocalLoading] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    
    const emailStr = email.trim();
    if (!emailStr.endsWith('@gmail.com')) {
      setErrorMessage(
        isUrdu 
          ? 'برائے مہربانی صرف جی میل اکاؤنٹ استعمال کریں۔' 
          : 'Please use a valid Gmail account (ending with @gmail.com).'
      );
      return;
    }

    if (password.length < 6) {
      setErrorMessage(
        isUrdu 
          ? 'پاس ورڈ کم از کم 6 ہندسوں کا ہونا چاہیے۔' 
          : 'Password must be at least 6 characters long.'
      );
      return;
    }

    setLocalLoading(true);
    try {
      const errorStr = await onEmailAuth(emailStr, password, isSignUp);
      if (errorStr) {
        setErrorMessage(errorStr);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred.');
    } finally {
      setLocalLoading(false);
    }
  };

  // Feature cards highlighting actual Sawaldher pillars (Not fake features!)
  const features = [
    {
      emoji: '🌾',
      title: 'Agricultural Land',
      titleUr: 'زرعی زمین اور ٹھیکہ',
      desc: 'Verify canal-side fields and direct lease bargains in Sawaldher.',
      descUr: 'نہر روڈ اور گاؤں کے مضافات میں زرعی زمینوں کے براہ راست سودے اور ٹھیکے حاصل کریں۔'
    },
    {
      emoji: '🐄',
      title: 'Sahiwal Livestock',
      titleUr: 'ساہیوال نسل کے مویشی',
      desc: 'Connect with livestock farmers offering milk-yielding vaccinated cows.',
      descUr: 'اعلی نسل کے صحت مند مویشیوں، بھینسوں اور بکروں کے دیسی فارم ہاؤس ریٹس۔'
    },
    {
      emoji: '🏪',
      title: 'Village Shops',
      titleUr: 'مقامی بازار اور دکانیں',
      desc: 'Browse verified village electronics and local merchants with warranty.',
      descUr: 'دکان کی گارنٹی کے ساتھ پرانے اسمارٹ فونز، بیٹریاں اور سولر سسٹم کی فہرست۔'
    },
    {
      emoji: '💬',
      title: 'Bargain & Negotiate',
      titleUr: 'سودے بازی اور گفتگو',
      desc: 'Use secure, direct chat to settle prices with zero commissions.',
      descUr: 'بغیر کسی کمیشن اور دلال کے، براہ راست گاہک اور فروخت کار کے درمیان محفوظ گفتگو۔'
    }
  ];

  return (
    <div className="min-h-screen bg-[#f0ece1] text-[#3a3a3a] flex flex-col justify-between font-sans selection:bg-[#5a6a5a] selection:text-white relative overflow-hidden" id="auth-gate-root">
      
      {/* Visual background overlay elements */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-[#5a6a5a]/5 to-transparent pointer-events-none" />
      <div className="absolute -top-48 -right-48 w-96 h-96 rounded-full bg-[#d4a373]/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-48 -left-48 w-96 h-96 rounded-full bg-[#5a6a5a]/10 blur-3xl pointer-events-none" />

      {/* HEADER BAR */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between" id="auth-header">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-[#5a6a5a] text-[#fdfbf7] flex items-center justify-center text-lg select-none shadow-md font-serif font-black">
            ST
          </div>
          <div>
            <span className="font-serif font-bold text-sm tracking-tight text-[#3a3a3a] block">
              Sawaldher Trade
            </span>
            <span className="text-[9px] font-mono tracking-widest text-[#707070] uppercase block">
              Republic of Sawaldher
            </span>
          </div>
        </div>

        {/* Dual Language Selector */}
        <div className="flex bg-white/60 backdrop-blur-sm p-1 rounded-xl border border-[#dcd7ce] shadow-sm select-none" id="auth-lang-selector">
          <button
            onClick={() => setLang('en')}
            className={`px-3 py-1.5 rounded-lg text-xs font-black tracking-wider transition ${
              lang === 'en'
                ? 'bg-[#5a6a5a] text-white shadow-sm'
                : 'text-[#707070] hover:text-[#3a3a3a]'
            }`}
          >
            EN
          </button>
          <button
            onClick={() => setLang('ur')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              lang === 'ur'
                ? 'bg-[#5a6a5a] text-white shadow-sm'
                : 'text-[#707070] hover:text-[#3a3a3a] font-serif'
            }`}
          >
            اردو
          </button>
        </div>
      </header>

      {/* HERO / SPLIT CONTENT */}
      <main className="relative z-10 w-full max-w-7xl mx-auto px-6 py-4 flex-grow flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-16">
        
        {/* Left Hand: Branding, Title, Call-to-action */}
        <div className="flex-1 w-full text-center lg:text-left space-y-8 max-w-xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#5a6a5a]/10 border border-[#5a6a5a]/20 text-[#5a6a5a] text-xs font-bold uppercase tracking-wider mx-auto lg:mx-0">
              <Sparkles size={12} className="animate-pulse" />
              <span>{isUrdu ? 'براہِ راست دیہاتی منڈی' : 'Zero Commissions • Direct Trade'}</span>
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-black tracking-tight text-[#3a3a3a] leading-tight">
              {isUrdu ? (
                <>
                  بغیر دلال کے <br />
                  <span className="text-[#8a5a4a]">اپنے گاؤں میں</span> کاروبار کریں
                </>
              ) : (
                <>
                  Trade Direct, <br />
                  <span className="text-[#8a5a4a]">No Commissions</span>
                </>
              )}
            </h1>

            <p className="text-sm sm:text-base text-[#5a5a5a] leading-relaxed font-sans font-medium">
              {isUrdu
                ? 'صوالڈھیر گاؤں کا اپنا تجارتی پورٹل جہاں آپ اپنی زمینیں، فصلیں، مویشی، نئی یا پرانی اشیاء اور دکان کی مصنوعات باآسانی اور بغیر کسی فیس کے خرید و فروخت کر سکتے ہیں۔'
                : 'Welcome to the secure village marketplace for Sawaldher. Post your agro leases, livestock details, and local shop inventory to start bargaining directly with real community merchants.'}
            </p>
          </motion.div>

          {/* Core Auth Trigger Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="bg-white border border-[#dcd7ce] p-6 sm:p-8 rounded-3xl shadow-lg space-y-5 max-w-md mx-auto lg:mx-0"
            id="login-auth-card"
          >
            <div className="space-y-2 text-center lg:text-left">
              <h3 className="text-lg font-serif font-bold text-[#3a3a3a]">
                {isUrdu ? 'تجارتی پورٹل کا حصہ بنیں' : 'Join the Trade Portal'}
              </h3>
              <p className="text-xs text-[#757575]">
                {isUrdu
                  ? 'سودے محفوظ کرنے اور خریداروں سے لائیو چیٹ کے لیے تصدیق شدہ لاگ ان کا انتخاب کریں۔'
                  : 'Get verified access to start securing your local deals today.'}
              </p>
            </div>

            {/* Custom Interactive Tab Switcher */}
            <div className="flex border-b border-[#f0ece1] text-xs">
              <button
                type="button"
                onClick={() => { setActiveTab('google'); setErrorMessage(''); }}
                className={`flex-1 pb-3 text-center font-bold tracking-wider uppercase transition-colors outline-none ${
                  activeTab === 'google' 
                    ? 'border-b-2 border-[#5a6a5a] text-[#5a6a5a]' 
                    : 'text-[#8e8e8e] hover:text-[#3a3a3a]'
                }`}
              >
                {isUrdu ? 'گوگل لاگ ان' : 'Google Access'}
              </button>
              <button
                type="button"
                onClick={() => { setActiveTab('email'); setErrorMessage(''); }}
                className={`flex-1 pb-3 text-center font-bold tracking-wider uppercase transition-colors outline-none ${
                  activeTab === 'email' 
                    ? 'border-b-2 border-[#5a6a5a] text-[#5a6a5a]' 
                    : 'text-[#8e8e8e] hover:text-[#3a3a3a]'
                }`}
              >
                {isUrdu ? 'جی میل اکاؤنٹ' : 'Gmail Login'}
              </button>
            </div>

            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-bold text-center">
                ⚠️ {errorMessage}
              </div>
            )}

            {/* TAB INTERFACES */}
            {activeTab === 'google' ? (
              <div className="space-y-4">
                {/* Main Google Login Trigger Action */}
                <button
                  onClick={onLogin}
                  disabled={authLoading}
                  className="w-full py-4 px-6 bg-[#5a6a5a] hover:bg-[#4d5b4d] active:scale-[0.99] disabled:opacity-50 text-white font-sans font-bold text-xs uppercase tracking-widest rounded-2xl shadow-md transition-all flex items-center justify-center gap-3 cursor-pointer"
                >
                  {authLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      {/* High Quality Minimalist Google Color Icon */}
                      <svg className="w-4 h-4 bg-white p-0.5 rounded-md text-[#3a3a3a]" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.61a5.64 5.64 0 0 1-2.43 3.72v3.1h3.94c2.31-2.12 3.62-5.26 3.62-8.67z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.94-3.1a7.41 7.41 0 0 1-11.41-4.14H.51v3.2A11.98 11.98 0 0 0 12 24z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M4.58 13.85a7.22 7.22 0 0 1 0-4.6v-3.2H.51a11.98 11.98 0 0 0 0 11H4.58v-3.2z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.43-3.43A11.93 11.93 0 0 0 12 0 11.98 11.98 0 0 0 .51 6.05l4.07 3.2a7.22 7.22 0 0 1 7.42-4.5z"
                        />
                      </svg>
                      <span>{isUrdu ? 'گوگل اکاؤنٹ سے داخل ہوں' : 'Quick Google Access'}</span>
                      <ArrowRight size={14} className="ml-1 shrink-0" />
                    </>
                  )}
                </button>
                <p className="text-[10px] text-center text-[#8e8e8e] leading-snug">
                  {isUrdu 
                    ? 'گوگل اکاؤنٹ لاگ ان کی مدد سے تصدیق اور پورٹل کا حصہ بنیں۔'
                    : 'Safe, standard Google pop-up integration with no password required.'}
                </p>
              </div>
            ) : (
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                {/* Email Address */}
                <div>
                  <label className="block text-[10px] font-bold text-[#3a3a3a] uppercase tracking-widest mb-1.5">
                    {isUrdu ? 'جی میل اکاؤنٹ' : 'Gmail Address'} *
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[#5a6a5a]/70 pointer-events-none">
                      <Mail size={13} />
                    </span>
                    <input
                      type="email"
                      required
                      placeholder="yourname@gmail.com"
                      className="w-full bg-white border border-[#dcd7ce] focus:border-[#5a6a5a] rounded-xl pl-9 pr-4 py-2 text-xs text-[#3a3a3a] outline-none transition"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                {/* Password field */}
                <div>
                  <label className="block text-[10px] font-bold text-[#3a3a3a] uppercase tracking-widest mb-1.5">
                    {isUrdu ? 'پاس ورڈ' : 'Password'} *
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[#5a6a5a]/70 pointer-events-none">
                      <Lock size={13} />
                    </span>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      className="w-full bg-white border border-[#dcd7ce] focus:border-[#5a6a5a] rounded-xl pl-9 pr-4 py-2 text-xs text-[#3a3a3a] outline-none transition"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                    />
                  </div>
                </div>

                {/* Actions toggling log in and signup */}
                <button
                  type="submit"
                  disabled={localLoading || authLoading}
                  className="w-full py-3 px-5 bg-[#5a6a5a] hover:bg-[#4d5b4d] active:scale-[0.99] disabled:opacity-50 text-white font-sans font-bold text-xs uppercase tracking-widest rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {localLoading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      {isSignUp ? <UserPlus size={13} /> : <LogIn size={13} />}
                      <span>
                        {isSignUp 
                          ? (isUrdu ? 'اکاؤنٹ کا اندراج کریں' : 'Register / Sign Up')
                          : (isUrdu ? 'لاگ ان کریں' : 'Log In Account')
                        }
                      </span>
                    </>
                  )}
                </button>

                {/* Mode toggle */}
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => { setIsSignUp(!isSignUp); setErrorMessage(''); }}
                    className="text-[11px] text-[#8a5a4a] hover:underline font-bold"
                  >
                    {isSignUp 
                      ? (isUrdu ? 'پہلے سے ہی اکاؤنٹ موجود ہے؟ لاگ ان کریں' : 'Already have an account? Log In Instead')
                      : (isUrdu ? 'پہلی بار آئے ہیں؟ نیا اکاؤنٹ رجسٹر کریں' : 'New to Sawaldher Trade? Create Account / Sign Up')
                    }
                  </button>
                </div>
              </form>
            )}

            {/* Quick trust metrics */}
            <div className="pt-2 border-t border-[#f0ece1] flex items-center justify-around text-[10px] text-[#707070] font-medium">
              <span className="flex items-center gap-1">🔒 {isUrdu ? 'محفوظ منڈی' : 'Direct & Secure'}</span>
              <span>•</span>
              <span className="flex items-center gap-1">💬 {isUrdu ? 'مفت چیٹ' : 'Direct Dialogue'}</span>
              <span>•</span>
              <span className="flex items-center gap-1">⏱️ {isUrdu ? 'فوری فکس' : 'Instant Setup'}</span>
            </div>
          </motion.div>
        </div>

        {/* Right Hand: Elegant Bento Grid describing village activity */}
        <div className="flex-1 w-full max-w-2xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" id="features-grid">
            {features.map((feat, index) => (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="p-5 sm:p-6 bg-[#faf8f5]/90 hover:bg-white border border-[#dcd7ce] hover:border-[#5a6a5a]/40 rounded-3xl transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#5a6a5a]/5 text-2xl flex items-center justify-center transition-all group-hover:scale-110">
                    {feat.emoji}
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-sm text-[#3a3a3a] group-hover:text-[#5a6a5a] transition-colors">
                      {isUrdu ? feat.titleUr : feat.title}
                    </h3>
                    <span className="text-[10px] text-[#8a5a4a] block font-semibold">
                      {isUrdu ? feat.title : feat.titleUr}
                    </span>
                  </div>
                </div>
                <p className="mt-3 text-xs text-[#606060] leading-relaxed">
                  {isUrdu ? feat.descUr : feat.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 border-t border-[#dcd7ce] text-center text-xs text-[#707070] font-sans flex flex-col sm:flex-row items-center justify-between gap-4">
        <p>
          © 2026 Sawaldher Trade. Built for verification & pure trading.
        </p>
        <p className="font-medium text-[#5a6a5a]">
          {isUrdu ? (
            <span>ہمارے اپنے سرسبز صوالڈھیر گاؤں کے لیے <strong className="text-[#8a5a4a]">محمد سدیس دورانی</strong> کی پیشکش ❤️</span>
          ) : (
            <span>Humbly created for our village by <strong className="text-[#8a5a4a]">Muhammad Sudais Durrani</strong> ❤️</span>
          )}
        </p>
      </footer>
    </div>
  );
}
