/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Store, BadgePlus, Sparkles } from 'lucide-react';
import { Shop, Category } from '../types';

interface CreateShopModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'en' | 'ur';
  categories: Category[];
  onCreateShop: (shop: Omit<Shop, 'id' | 'createdAt'>) => void;
}

const PRESET_SHOP_LOGOS = [
  { emoji: '🏪', gradient: 'from-amber-500 via-orange-600 to-red-700' },
  { emoji: '📱', gradient: 'from-indigo-600 via-purple-600 to-pink-600' },
  { emoji: '🌾', gradient: 'from-emerald-500 via-teal-600 to-green-700' },
  { emoji: '🐄', gradient: 'from-yellow-600 to-amber-800' },
  { emoji: '🔧', gradient: 'from-blue-600 to-cyan-700' },
  { emoji: '🥩', gradient: 'from-rose-500 to-pink-700' },
];

export default function CreateShopModal({
  isOpen,
  onClose,
  lang,
  categories,
  onCreateShop
}: CreateShopModalProps) {
  const [shopName, setShopName] = useState('');
  const [shopNameUr, setShopNameUr] = useState('');
  const [ownerName, setOwnerName] = useState('Muhammad Sudais Durrani');
  const [category, setCategory] = useState(categories[1]?.id || 'fields');
  const [description, setDescription] = useState('');
  const [descriptionUr, setDescriptionUr] = useState('');
  const [shopPhone, setShopPhone] = useState('03369048051');
  const [selectedLogoIdx, setSelectedLogoIdx] = useState(0);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shopName || !ownerName || !shopPhone) return;

    const logo = PRESET_SHOP_LOGOS[selectedLogoIdx];

    onCreateShop({
      name: shopName,
      nameUr: shopNameUr || `${shopName} (Urdu)`,
      ownerName,
      category,
      description,
      descriptionUr: descriptionUr || `${description} (Urdu description)`,
      logoGradient: logo.gradient,
      logoEmoji: logo.emoji,
      phone: shopPhone
    });

    // Reset Form fields
    setShopName('');
    setShopNameUr('');
    setDescription('');
    setDescriptionUr('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3a3a3a]/40 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ scale: 0.9, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, y: 20, opacity: 0 }}
        className="w-full max-w-xl bg-white border border-[#dcd7ce] rounded-3xl shadow-xl overflow-hidden flex flex-col my-8"
        id="create-shop-form-container"
      >
        {/* Modal Header */}
        <div className="p-6 bg-[#f4f1ea] border-b border-[#dcd7ce] flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-[#5a6a5a]/10 text-[#5a6a5a]">
              <Store className="w-5 h-5 animate-pulse" />
            </span>
            <div>
              <h2 className="text-xl font-serif font-bold text-[#5a6a5a]">
                {lang === 'en' ? 'Open Virtual Village Shop' : 'صوالڈھیر بازار میں دکان کھولیں'}
              </h2>
              <p className="text-xs text-[#707070]">
                {lang === 'en'
                  ? 'Launch a virtual marketplace hub to catalog all your local trades'
                  : 'اپنی تمام تجارتی اشیاء کو ایک جگہ اکٹھا کرنے کے لیے دکان کھڑی کریں'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-[#ebe6dd] text-[#707070] hover:text-[#3a3a3a] transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Form Scroll Area */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[75vh] space-y-4 bg-white text-[#3a3a3a]">
          {/* Dual Column Core Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Shop Name English */}
            <div>
              <label className="block text-xs font-bold text-[#3a3a3a] uppercase tracking-widest mb-1">
                {lang === 'en' ? 'Shop Name (English)' : 'دکان کا نام (انگریزی)'} *
              </label>
              <input
                type="text"
                required
                className="w-full bg-white border border-[#dcd7ce] focus:border-[#5a6a5a] rounded-xl px-4 py-2.5 text-xs text-[#3a3a3a] placeholder-slate-400 outline-none transition"
                placeholder="e.g. Durrani Seeds Palace, Mardan Autos"
                value={shopName}
                onChange={e => setShopName(e.target.value)}
              />
            </div>

            {/* Shop Name Urdu */}
            <div>
              <label className="block text-xs font-bold text-[#3a3a3a] uppercase tracking-widest mb-1 text-right">
                {lang === 'en' ? 'Shop Name (Urdu - Optional)' : 'دکان کا نام (اردو - اختیاری)'}
              </label>
              <input
                type="text"
                dir="rtl"
                className="w-full bg-white border border-[#dcd7ce] focus:border-[#5a6a5a] rounded-xl px-4 py-2.5 text-xs text-[#3a3a3a] placeholder-slate-400 outline-none transition text-right"
                placeholder="مثال: درانی موبائل پیلس، چوک دکان"
                value={shopNameUr}
                onChange={e => setShopNameUr(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Owner Name */}
            <div>
              <label className="block text-xs font-bold text-[#3a3a3a] uppercase tracking-widest mb-1">
                {lang === 'en' ? 'Owner / Merchant Name' : 'مالک کا نام'} *
              </label>
              <input
                type="text"
                required
                className="w-full bg-white border border-[#dcd7ce] focus:border-[#5a6a5a] rounded-xl px-4 py-2.5 text-xs text-[#3a3a3a] placeholder-slate-400 outline-none transition"
                placeholder=""
                value={ownerName}
                onChange={e => setOwnerName(e.target.value)}
              />
            </div>

            {/* Shop Contact Phone */}
            <div>
              <label className="block text-xs font-bold text-[#3a3a3a] uppercase tracking-widest mb-1">
                {lang === 'en' ? 'WhatsApp or Phone Contact' : 'فون یا واٹس ایپ نمبر'} *
              </label>
              <input
                type="text"
                required
                className="w-full bg-white border border-[#dcd7ce] focus:border-[#5a6a5a] rounded-xl px-4 py-2.5 text-xs text-[#3a3a3a] placeholder-slate-400 outline-none transition"
                placeholder="03xxxxxxxx"
                value={shopPhone}
                onChange={e => setShopPhone(e.target.value)}
              />
            </div>
          </div>

          {/* Primary Trade Category */}
          <div>
            <label className="block text-xs font-bold text-[#3a3a3a] uppercase tracking-widest mb-1">
              {lang === 'en' ? 'Shop Core Category' : 'دکان کی بنیادی کیٹیگری'}
            </label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full bg-white border border-[#dcd7ce] focus:border-[#5a6a5a] rounded-xl px-4 py-2.5 text-xs text-[#3a3a3a] outline-none cursor-pointer"
            >
              {categories
                .filter(c => c.id !== 'all')
                .map(c => (
                  <option key={c.id} value={c.id}>
                    {lang === 'en' ? c.name : c.nameUr}
                  </option>
                ))}
            </select>
          </div>

          {/* Logo theme selection */}
          <div>
            <label className="block text-xs font-bold text-[#3a3a3a] uppercase tracking-widest mb-2">
              {lang === 'en' ? 'Select Shop Brand Theme' : 'دکان کا لوگو / گراؤنڈ تھیم منتخب کریں'}
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {PRESET_SHOP_LOGOS.map((lg, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedLogoIdx(idx)}
                  className={`p-3 rounded-2xl bg-gradient-to-tr ${lg.gradient} flex flex-col items-center justify-center border-4 relative transition-transform cursor-pointer ${
                    selectedLogoIdx === idx
                      ? 'border-[#5a6a5a] scale-105 shadow-sm'
                      : 'border-transparent opacity-65 hover:opacity-95'
                  }`}
                >
                  <span className="text-2xl">{lg.emoji}</span>
                  <span className="text-[8px] text-white/95 font-bold block mt-1">
                    {idx === 0 ? 'Store' : idx === 1 ? 'Mobile' : idx === 2 ? 'Farms' : idx === 3 ? 'Herd' : idx === 4 ? 'Tools' : 'Heavy'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Description Textareas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#3a3a3a] uppercase tracking-widest mb-1">
                {lang === 'en' ? 'Shop Description (English)' : 'دکان کا تعارف (انگریزی)'}
              </label>
              <textarea
                rows={3}
                className="w-full bg-white border border-[#dcd7ce] focus:border-[#5a6a5a] rounded-xl px-4 py-2.5 text-xs text-[#3a3a3a] placeholder-slate-400 outline-none transition resize-none"
                placeholder="Describe your items, physical location in Sawaldher bazaar, and delivery options..."
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#3a3a3a] uppercase tracking-widest mb-1 text-right">
                {lang === 'en' ? 'Shop Description (Urdu)' : 'دکان کا تعارف (اردو)'}
              </label>
              <textarea
                rows={3}
                dir="rtl"
                className="w-full bg-white border border-[#dcd7ce] focus:border-[#5a6a5a] rounded-xl px-4 py-2.5 text-xs text-[#3a3a3a] placeholder-slate-400 outline-none transition resize-none text-right"
                placeholder="اپنی دکان، صوالڈھیر بازار میں مقام، اور فروخت کے قوانین و شرائط لکھیں تاکہ گاہک مائل ہو سکیں۔۔۔"
                value={descriptionUr}
                onChange={e => setDescriptionUr(e.target.value)}
              />
            </div>
          </div>

          {/* Terms & Submit button */}
          <div className="pt-4 border-t border-[#dcd7ce] flex items-center justify-between gap-4">
            <span className="text-[10px] text-[#8e8e8e] leading-tight">
              {lang === 'en'
                ? 'Only registered village residents can set up commercial shops.'
                : 'دکان رجسٹر کرنے کے بعد آپ اپنی دیگر اپلوڈ کردہ اشیاء کو اس دکان کے ساتھ جوڑ سکیں گے۔'}
            </span>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-[#5a6a5a] hover:bg-[#4d5b4d] text-white font-bold text-xs uppercase tracking-widest shrink-0 transition shadow-sm cursor-pointer"
            >
              {lang === 'en' ? 'Launch Shop 🏪' : 'ورچوئل دکان لانچ کریں 🏪'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
