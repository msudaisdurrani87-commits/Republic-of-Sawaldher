/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, ExternalLink, Heart, Sparkles, AlertTriangle, Cpu } from 'lucide-react';

interface AboutPanelProps {
  lang: 'en' | 'ur';
}

export default function AboutPanel({ lang }: AboutPanelProps) {
  const whatsappUrl = "https://wa.me/923369048051?text=Assalam-o-Alaikum%20Sudais,%20I%20contacted%20you%20from%20the%20Republic%20of%20Sawaldher%20Trade%20Applet!";
  const emailUrl = "mailto:msudaisdurrani87@gmail.com?subject=Sawaldher%20Trade%2520Applet%20Contact";

  return (
    <div className="max-w-4xl mx-auto space-y-8" id="about-developer-panel">
      {/* Dev Card Tribute Module */}
      <div className="relative bg-[#f4f1ea] border border-[#dcd7ce] rounded-3xl p-8 overflow-hidden shadow-sm">
        {/* Floating gradient ambient blobs resembling stars */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#5a6a5a]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -right-12 -top-12 w-48 h-48 bg-[#d4a373]/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto text-[#3a3a3a]">
          {/* Developer Avatar Badge with rotating border glow */}
          <div className="relative mb-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 15, ease: 'linear' }}
              className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-[#5a6a5a] via-[#d4a373] to-[#8a5a4a] opacity-70 blur-md scale-105"
            />
            <div className="relative w-24 h-24 rounded-3xl bg-white border border-[#dcd7ce] flex items-center justify-center text-4xl shadow-md">
              👨‍💻
            </div>
          </div>

          <span className="text-[10px] font-mono font-bold text-white bg-[#5a6a5a] px-3 py-1 rounded-full border border-[#4d5b4d] uppercase tracking-widest mb-2">
            {lang === 'en' ? 'Core Lead Architect' : 'سرکردہ ڈویلپر'}
          </span>

          <h2 className="text-3xl font-serif font-bold text-[#5a6a5a] tracking-tight leading-none">
            Muhammad Sudais Durrani
          </h2>
          <p className="text-xs text-[#d4a373] font-bold tracking-wider mt-1.5 uppercase">
            {lang === 'en' ? 'Republic of Sawaldher Dev Team' : 'جمہوریہ صوالڈھیر سافٹ ویئر ڈویلپمنٹ ٹیم'}
          </p>

          <p className="text-xs text-[#555555] mt-4 leading-relaxed font-serif max-w-lg">
            {lang === 'en'
              ? 'Assalam-o-Alaikum! I am Muhammad Sudais Durrani, the developer of this platform. This software has been proudly crafted for my beautiful, historic village of Sawaldher and its hard working citizens. Our goal is to bring digitalization and unlock trade potential directly from our sugarcane fields to electronics shops!'
              : 'السلام علیکم! میں محمد سدیس دورانی، اس پلیٹ فارم کا خالق ہوں۔ یہ سافٹ ویئر فخر کے ساتھ صوالڈھیر اور اس کے باہمت باسیوں کے لیے تیار کیا گیا ہے۔ ہمارا مقصد زراعت اور کاروبار کو جدید ٹیکنالوجی سے جوڑنا ہے۔'}
          </p>

          <div className="w-24 h-1 bg-[#d4a373] rounded-full my-6 animate-pulse" />

          {/* Core Social connection points with live actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-md">
            {/* Direct Gmail */}
            <a
              href={emailUrl}
              target="_blank"
              rel="noreferrer"
              className="bg-white border border-[#dcd7ce] hover:border-[#5a6a5a]/40 hover:bg-[#fdfbf7] p-4 rounded-2xl flex items-center gap-3 transition-all text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center shrink-0">
                <Mail size={18} />
              </div>
              <div>
                <span className="text-[10px] text-[#8e8e8e] font-mono block">GMAIL ADDRESS</span>
                <span className="text-xs font-bold text-[#3a3a3a] break-all">msudaisdurrani87@gmail.com</span>
              </div>
            </a>

            {/* Direct WhatsApp Message and call */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="bg-white border border-[#dcd7ce] hover:border-[#5a6a5a]/40 hover:bg-[#fdfbf7] p-4 rounded-2xl flex items-center gap-3 transition-all text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-[#5a6a5a]/10 text-[#5a6a5a] flex items-center justify-center shrink-0">
                <Phone size={18} />
              </div>
              <div>
                <span className="text-[10px] text-[#8e8e8e] font-mono block">WHATSAPP NO</span>
                <span className="text-xs font-bold text-[#3a3a3a]">03369048051</span>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* Futuristic Roadmap Banner - "STAY TUNED! MORE FEATURES COMING!" */}
      <div className="bg-[#ebe6dd] border border-[#dcd7ce] p-6 rounded-3xl relative overflow-hidden">
        <div className="absolute right-4 bottom-4 text-6xl filter grayscale opacity-10 select-none">🚀</div>
        
        <div className="flex items-start gap-4 text-[#3a3a3a]">
          <div className="p-3 bg-[#5a6a5a]/10 text-[#5a6a5a] rounded-2xl shrink-0 mt-1">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#5a6a5a] uppercase tracking-wider flex items-center gap-2">
              <span>{lang === 'en' ? 'Stay Tuned! More Branches Coming' : 'ہمیشہ جڑے رہیں! مزید پورٹلز جلد آ رہے ہیں'}</span>
              <span className="px-2 py-0.5 rounded-full bg-[#5a6a5a] text-white font-bold text-[9px]">v1.4.2</span>
            </h4>
            <p className="text-xs text-[#555555] mt-2 leading-relaxed">
              {lang === 'en'
                ? "This is only the beginning of our integrated village portal network. We are building the next core modules like **Sawaldher Ride** (for easy taxi/chinchi/carry bookings) and **Sawaldher Food** (for ordering from local Mardan kebabs/tikka houses) as well as news feeds. Stay tuned for these feature updates in the near future!"
                : "یہ صرف شروعات ہے۔ ہم صوالڈھیر کے لیے جلد ہی **سواری پورٹل** (ٹیکسی، چنچی، کیری ڈبہ کی بکنگ کے لیے) اور **کھانا پورٹل** (علاقے کے لذیذ کباب اور کھانے آرڈر کرنے کے لیے) لانچ کر رہے ہیں۔ ہمیشہ جڑے رہیں اور اپڈیٹس چیک کرتے رہیں!"}
            </p>
          </div>
        </div>
      </div>

      {/* Developer note disclaimer */}
      <div className="text-center text-[10px] text-[#8e8e8e] leading-normal pb-6">
        <p>© 2026 Republic of Sawaldher Social Enterprise Network. Conceptualized and engineered with ❤️ in Pakistan.</p>
        <p className="mt-1 font-mono">Special thanks to Muhammad Sudais Durrani for driving rural community tech solutions.</p>
      </div>
    </div>
  );
}
