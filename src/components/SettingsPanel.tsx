/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile } from '../types';
import { User, Phone, Mail, Bell, Shield, ToggleLeft, ToggleRight, Check } from 'lucide-react';

interface SettingsPanelProps {
  profile: UserProfile;
  lang: 'en' | 'ur';
  onUpdateProfile: (profile: UserProfile) => void;
  onTriggerVfx: () => void;
  onLogout: () => void;
}

export default function SettingsPanel({
  profile,
  lang,
  onUpdateProfile,
  onTriggerVfx,
  onLogout
}: SettingsPanelProps) {
  const [name, setName] = useState(profile.name);
  const [phone, setPhone] = useState(profile.phone);
  const [email, setEmail] = useState(profile.email);
  const [notificationsOffer, setNotificationsOffer] = useState(profile.notificationsOffer);
  const [notificationsChat, setNotificationsChat] = useState(profile.notificationsChat);
  const [notificationsEmail, setNotificationsEmail] = useState(profile.notificationsEmail);
  const [privacyShowPhone, setPrivacyShowPhone] = useState(profile.privacyShowPhone);
  const [privacyPublicProfile, setPrivacyPublicProfile] = useState(profile.privacyPublicProfile);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      name,
      phone,
      email,
      avatarGradient: profile.avatarGradient,
      avatarEmoji: profile.avatarEmoji,
      notificationsOffer,
      notificationsChat,
      notificationsEmail,
      privacyShowPhone,
      privacyPublicProfile,
    });

    setIsSaved(true);
    onTriggerVfx(); // Celebrate saving profile and settings!

    setTimeout(() => {
      setIsSaved(false);
    }, 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8" id="profile-settings-panel">
      {/* Settings Panel Header */}
      <div className="bg-[#f4f1ea] border border-[#dcd7ce] p-6 rounded-3xl">
        <h2 className="text-xl font-serif font-bold text-[#5a6a5a] flex items-center gap-2">
          <span>⚙️</span>
          <span>{lang === 'en' ? 'Profile & Security Dashboard' : 'سیٹنگز اور پروفائل کنٹرول'}</span>
        </h2>
        <p className="text-xs text-[#707070] mt-1 leading-relaxed">
          {lang === 'en'
            ? 'Manage your community trading presence, notification triggers, and user privacy in Republic of Sawaldher'
            : 'جمہوریہ صوالڈھیر ٹریڈ مارکیٹ کے لیے اپنی پروفائل، اکاؤنٹ نوٹیفیکیشنز اور پرائیویسی سیٹنگز تبدیل کریں'}
        </p>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Grid: Avatar & Profile card */}
        <div className="bg-[#f4f1ea] border border-[#dcd7ce] p-6 rounded-3xl flex flex-col items-center justify-center text-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#d4a373] to-[#8a5a4a] flex items-center justify-center text-5xl mb-4 shadow-sm ring-4 ring-[#ebe6dd] relative">
            <span>👤</span>
            <span className="absolute bottom-1 right-1 bg-[#5a6a5a] w-4 h-4 rounded-full border-2 border-[#ebe6dd] animate-pulse" />
          </div>

          <h3 className="font-bold text-[#3a3a3a] text-base truncate max-w-full">
            {name || 'Sawaldher Resident'}
          </h3>
          <p className="text-[10px] font-mono text-[#5a6a5a] uppercase tracking-widest mt-1 font-bold">
            {lang === 'en' ? 'Verified Citizen' : 'تصدیق شدہ شہری'}
          </p>

          <div className="w-full h-px bg-[#dcd7ce] my-4" />

          <p className="text-[11px] text-[#707070] leading-normal mb-4">
            {lang === 'en'
              ? 'Your profile is securely hosted inside the Sawaldher village database. Connected securely via device cookies.'
              : 'آپ کا اکاؤنٹ صوالڈھیر ڈیٹا بیس میں محفوظ ہے۔ سیکیورٹی پروٹوکول فعال ہے۔'}
          </p>

          <button
            type="button"
            onClick={onLogout}
            className="w-full py-2.5 bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition shadow-sm cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
            id="account-logout-btn"
          >
            <span>🚪</span>
            <span>{lang === 'en' ? 'Logout from Account' : 'لاگ آؤٹ کریں'}</span>
          </button>
        </div>

        {/* Right Grid: Form Controls */}
        <div className="md:col-span-2 space-y-6">
          {/* Section 1: Profile fields */}
          <div className="bg-[#f4f1ea] border border-[#dcd7ce] p-6 rounded-3xl space-y-4">
            <h4 className="text-xs font-bold text-[#d4a373] uppercase tracking-widest flex items-center gap-1.5 mb-2">
              <User size={13} />
              <span>{lang === 'en' ? '1. Core Profile Details' : '۱۔ بنیادی پروفائل ترتیبات'}</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-[#3a3a3a] uppercase mb-1">
                  {lang === 'en' ? 'Your Full Name' : 'آپ کا پورا نام'}
                </label>
                <input
                  type="text"
                  required
                  className="w-full bg-white border border-[#dcd7ce] focus:border-[#5a6a5a] rounded-xl px-4 py-2.5 text-xs text-[#3a3a3a] outline-none transition"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#3a3a3a] uppercase mb-1">
                  {lang === 'en' ? 'Mobile Number (WhatsApp)' : 'فون یا واٹس ایپ نمبر'}
                </label>
                <input
                  type="text"
                  required
                  className="w-full bg-white border border-[#dcd7ce] focus:border-[#5a6a5a] rounded-xl px-4 py-2.5 text-xs text-[#3a3a3a] outline-none transition"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#3a3a3a] uppercase mb-1">
                {lang === 'en' ? 'Email Address' : 'ای میل ایڈریس'}
              </label>
              <input
                type="email"
                required
                className="w-full bg-white border border-[#dcd7ce] focus:border-[#5a6a5a] rounded-xl px-4 py-2.5 text-xs text-[#3a3a3a] outline-none"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Section 2: Notification Toggles */}
          <div className="bg-[#f4f1ea] border border-[#dcd7ce] p-6 rounded-3xl space-y-4">
            <h4 className="text-xs font-bold text-[#5a6a5a] uppercase tracking-widest flex items-center gap-1.5 mb-2">
              <Bell size={13} />
              <span>{lang === 'en' ? '2. Commmunity Alerts & Updates' : '۲۔ نوٹیفیکیشنز کنٹرول'}</span>
            </h4>

            <div className="space-y-3.5">
              {/* Option A */}
              <div className="flex justify-between items-center gap-4">
                <div>
                  <h5 className="text-xs font-bold text-[#3a3a3a]">
                    {lang === 'en' ? 'Instantly Alert Trade Offers' : 'خرید وفروخت کے نئے سودوں کی الرٹ'}
                  </h5>
                  <p className="text-[10px] text-[#707070]">
                    {lang === 'en' ? 'Receive popups when a new used item or livestock is listed in Sawaldher' : 'صوالڈھیر کے لوگوں کی نئی شائع اشیاء کے بارے میں گاہ بگاہ جانیے'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setNotificationsOffer(!notificationsOffer)}
                  className="text-[#5a6a5a] hover:text-[#4d5b4d] transition cursor-pointer"
                >
                  {notificationsOffer ? <ToggleRight size={28} /> : <ToggleLeft className="text-[#a49a8b]" size={28} />}
                </button>
              </div>

              {/* Option B */}
              <div className="flex justify-between items-center gap-4">
                <div>
                  <h5 className="text-xs font-bold text-[#3a3a3a]">
                    {lang === 'en' ? 'Real-Time Messaging Sound alerts' : 'ریئل ٹائم میسجز اور گاہک کی آواز'}
                  </h5>
                  <p className="text-[10px] text-[#707070]">
                    {lang === 'en' ? 'Play micro-chime sound whenever sound alert chat is triggered' : 'رابطہ کرنے پر دلکش بیپ اور چیٹ نوٹیفیکیشن بجائیں'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setNotificationsChat(!notificationsChat)}
                  className="text-[#5a6a5a] hover:text-[#4d5b4d] transition cursor-pointer"
                >
                  {notificationsChat ? <ToggleRight size={28} /> : <ToggleLeft className="text-[#a49a8b]" size={28} />}
                </button>
              </div>

              {/* Option C */}
              <div className="flex justify-between items-center gap-4">
                <div>
                  <h5 className="text-xs font-bold text-[#3a3a3a]">
                    {lang === 'en' ? 'Weekly Digest Newsletter Digests' : 'ہفتہ وار سمری بذریعہ ای میل'}
                  </h5>
                  <p className="text-[10px] text-[#707070]">
                    {lang === 'en' ? 'Email me summarizing top fields and crop yields leased this week' : 'اس ہفتے کرایہ یا فروخت ہونے والی زمینوں کا خلاصہ ای میل حاصل کریں'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setNotificationsEmail(!notificationsEmail)}
                  className="text-[#5a6a5a] hover:text-[#4d5b4d] transition cursor-pointer"
                >
                  {notificationsEmail ? <ToggleRight size={28} /> : <ToggleLeft className="text-[#a49a8b]" size={28} />}
                </button>
              </div>
            </div>
          </div>

          {/* Section 3: Privacy Switches */}
          <div className="bg-[#f4f1ea] border border-[#dcd7ce] p-6 rounded-3xl space-y-4">
            <h4 className="text-xs font-bold text-[#8a5a4a] uppercase tracking-widest flex items-center gap-1.5 mb-2">
              <Shield size={13} />
              <span>{lang === 'en' ? '3. Buyer Visibility & Privacy' : '۳۔ شہری پرائیویسی اور گمنامی'}</span>
            </h4>

            <div className="space-y-3.5">
              {/* Option D */}
              <div className="flex justify-between items-center gap-4">
                <div>
                  <h5 className="text-xs font-bold text-[#3a3a3a]">
                    {lang === 'en' ? 'Expose Phone Number to Public View' : 'فون نمبر ہر خاص و عام کو ظاہر کریں'}
                  </h5>
                  <p className="text-[10px] text-[#707070]">
                    {lang === 'en' ? 'Enable calling buttons publicly so customers can reach your phone instantly' : 'گاہکوں کے لیے کال یا واٹس ایپ بٹن کو کھلا رکھیں ورنہ صرف چیٹ کی جائے گی'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setPrivacyShowPhone(!privacyShowPhone)}
                  className="text-[#5a6a5a] hover:text-[#4d5b4d] transition cursor-pointer"
                >
                  {privacyShowPhone ? <ToggleRight size={28} /> : <ToggleLeft className="text-[#a49a8b]" size={28} />}
                </button>
              </div>

              {/* Option E */}
              <div className="flex justify-between items-center gap-4">
                <div>
                  <h5 className="text-xs font-bold text-[#3a3a3a]">
                    {lang === 'en' ? 'Maintain Private Classified listings' : 'خلاصی اشتہارات نجی رکھیں'}
                  </h5>
                  <p className="text-[10px] text-[#707070]">
                    {lang === 'en' ? 'Do not allow strangers from outer Mardan district to search your offers' : 'مردان کے علاوہ باہر کے علاقوں کے لوگوں سے اشتہار مخفی رکھیں'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setPrivacyPublicProfile(!privacyPublicProfile)}
                  className="text-[#5a6a5a] hover:text-[#4d5b4d] transition cursor-pointer"
                >
                  {privacyPublicProfile ? <ToggleRight size={28} /> : <ToggleLeft className="text-[#a49a8b]" size={28} />}
                </button>
              </div>
            </div>
          </div>

          {/* Submit Save changes buttons */}
          <div className="flex justify-end gap-3 items-center pt-2 pb-6">
            <AnimatePresence>
              {isSaved && (
                <motion.span
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-xs text-[#5a6a5a] font-bold flex items-center gap-1 bg-[#f2f9f2] border border-[#dfeae0] px-3 py-1.5 rounded-xl"
                >
                  <Check size={12} />
                  <span>{lang === 'en' ? 'Settings Saved Securely!' : 'ترتیبات کامیابی سے محفوظ ہو گئیں!'}</span>
                </motion.span>
              )}
            </AnimatePresence>

            <button
               type="submit"
               className="px-6 py-3 rounded-xl bg-[#5a6a5a] hover:bg-[#4d5b4d] text-white font-bold text-xs uppercase tracking-widest transition shadow-md cursor-pointer"
            >
              {lang === 'en' ? 'Save Configurations' : 'سیٹنگز محفوظ کریں'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
