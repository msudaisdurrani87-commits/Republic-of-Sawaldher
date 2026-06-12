/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User, Phone, Mail, Check, ShieldCheck, ArrowRight } from 'lucide-react';
import { UserProfile } from '../types';

interface AccountSetupGateProps {
  lang: 'en' | 'ur';
  profile: any;
  onSaveProfile: (profileData: Partial<UserProfile>) => Promise<void>;
}

export default function AccountSetupGate({ lang, profile, onSaveProfile }: AccountSetupGateProps) {
  const isUrdu = lang === 'ur';

  // Explicitly initialize with empty strings for a blank slate experience 
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Form Validation matches requirements
    if (!name.trim()) {
      setError(isUrdu ? 'براہ کرم اپنا مکمل نام درج کریں۔' : 'Please enter your full name.');
      return;
    }
    if (!phone.trim()) {
      setError(isUrdu ? 'براہ کرم اپنا واٹس ایپ نمبر درج کریں۔' : 'Please enter your whatsapp / phone number.');
      return;
    }

    setSubmitting(true);
    try {
      await onSaveProfile({
        name: name.trim(),
        phone: phone.trim(),
        hasSetupComplete: true
      });
    } catch (err) {
      setError(isUrdu ? 'کچھ غلط ہو گیا۔ دوبارہ کوشش کریں۔' : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f0ece1] text-[#3a3a3a] flex flex-col items-center justify-center p-4 relative overflow-hidden" id="account-setup-root">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-[#5a6a5a]/10 to-transparent pointer-events-none" />
      <div className="absolute -top-48 -right-48 w-96 h-96 rounded-full bg-[#d4a373]/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-48 -left-48 w-96 h-96 rounded-full bg-[#5a6a5a]/15 blur-3xl pointer-events-none" />

      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white border border-[#dcd7ce] p-6 sm:p-8 rounded-3xl shadow-xl space-y-6 relative z-10"
        id="setup-profile-card"
      >
        {/* Verification Icon Header Grid */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-[#5a6a5a]/10 text-[#5a6a5a] flex items-center justify-center mx-auto shadow-sm">
            <ShieldCheck size={32} />
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-black text-[#5a6a5a]">
            {isUrdu ? 'اکاؤنٹ مکمل سیٹ اپ کریں' : 'Verify & Set Up Profile'}
          </h2>
          <p className="text-xs text-[#707070] px-4">
            {isUrdu 
              ? 'صوالڈھیر منڈی میں محفوظ تجارت کے لیے اپنے رابطے کی معلومات درج کریں۔ یہ معلومات خریداروں سے براہ راست واٹس ایپ پر رابطے کے لیے استعمال ہوگی۔'
              : 'Please provide your verified details below to initialize direct village bargain messaging. These fields are strictly required.'}
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-bold text-center">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* USER NAME */}
          <div>
            <label className="block text-xs font-bold text-[#3a3a3a] uppercase tracking-widest mb-1">
              {isUrdu ? 'آپ کا مکمل نام' : 'Your Full Name'} *
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[#d4a373] pointer-events-none">
                <User size={14} />
              </span>
              <input
                type="text"
                required
                className="w-full bg-white border border-[#dcd7ce] focus:border-[#5a6a5a] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#3a3a3a] placeholder-slate-400 outline-none transition font-medium"
                placeholder={isUrdu ? 'اپنا نام درج کریں' : 'Enter your name'}
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
            <p className="text-[9px] text-[#8e8e8e] mt-1">
              {isUrdu ? 'آپ کا نام دیگر دیہاتی ڈیلرز اور خریداروں کو دکھایا جائے گا۔' : 'This name will represent you in the village trade directory.'}
            </p>
          </div>

          {/* WHATSAPP PHONE NUMBER */}
          <div>
            <label className="block text-xs font-bold text-[#3a3a3a] uppercase tracking-widest mb-1">
              {isUrdu ? 'رابطہ نمبر / واٹس ایپ' : 'WhatsApp/Contact Phone'} *
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[#d4a373] pointer-events-none font-bold text-xs select-none">
                🇵🇰
              </span>
              <input
                type="text"
                required
                className="w-full bg-white border border-[#dcd7ce] focus:border-[#5a6a5a] rounded-xl pl-12 pr-4 py-2.5 text-xs text-[#3a3a3a] placeholder-slate-400 outline-none transition font-mono font-bold"
                placeholder="03xxxxxxxx"
                value={phone}
                onChange={e => setPhone(e.target.value)}
              />
            </div>
            <p className="text-[9px] text-[#8e8e8e] mt-1">
              {isUrdu ? 'براہ کرم اپنا درست واٹس ایپ نمبر درج کریں تاکہ براہ کرم کمیشن کے بغیر سودا کیا جا سکے۔' : 'Enter a real Pakistan mobile number starting with 03.'}
            </p>
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-6 py-3.5 px-6 bg-[#5a6a5a] hover:bg-[#4d5b4d] active:scale-[0.99] disabled:opacity-50 text-white font-sans font-bold text-xs uppercase tracking-widest rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {submitting ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>{isUrdu ? 'درج کریں اور پورٹل میں داخل ہوں' : 'Complete Registration'}</span>
                <Check size={14} className="shrink-0" />
              </>
            )}
          </button>
        </form>

        <div className="pt-2 border-t border-[#f0ece1] flex items-center justify-around text-[9px] text-[#8e8e8e]">
          <span>🛡️ Verified Identity</span>
          <span>•</span>
          <span>🔒 Safe Storage</span>
          <span>•</span>
          <span>⚡ Direct Connect</span>
        </div>
      </motion.div>
    </div>
  );
}
