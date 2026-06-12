/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Building2, Store } from 'lucide-react';
import * as Icons from 'lucide-react';
import { Listing, Category, Shop } from '../types';

interface CreateListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'en' | 'ur';
  categories: Category[];
  shops: Shop[];
  onSave: (listing: Omit<Listing, 'id' | 'views' | 'createdAt'>) => void;
  preselectedShopId?: string;
}

const PRESET_GRAPHICS = [
  { icon: 'Sprout', gradient: 'from-emerald-500 via-teal-600 to-green-700', label: 'Field/Wheat' },
  { icon: 'Footprints', gradient: 'from-amber-500 to-orange-700', label: 'Livestock/Animals' },
  { icon: 'Smartphone', gradient: 'from-sky-500 via-cyan-600 to-blue-700', label: 'Mobile/Gadgets' },
  { icon: 'Home', gradient: 'from-rose-500 via-red-600 to-orange-700', label: 'House/Shop' },
  { icon: 'Car', gradient: 'from-zinc-500 to-slate-800', label: 'Car/Transport' },
  { icon: 'Settings', gradient: 'from-indigo-600 via-purple-600 to-pink-600', label: 'Electronics/Pumps' },
];

export default function CreateListingModal({
  isOpen,
  onClose,
  lang,
  categories,
  shops,
  onSave,
  preselectedShopId
}: CreateListingModalProps) {
  const [title, setTitle] = useState('');
  const [titleUr, setTitleUr] = useState('');
  const [category, setCategory] = useState(categories[1]?.id || 'fields');
  const [customCategory, setCustomCategory] = useState('');
  const [customCategoryUr, setCustomCategoryUr] = useState('');
  const [type, setType] = useState<'sell' | 'rent'>('sell');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('Sawaldher Main Bazaar');
  const [locationUr, setLocationUr] = useState('صوالڈھیر مین بازار');
  const [description, setDescription] = useState('');
  const [descriptionUr, setDescriptionUr] = useState('');
  const [condition, setCondition] = useState<'new' | 'used'>('used');
  const [offersDelivery, setOffersDelivery] = useState(false);
  const [selectedGraphicIndex, setSelectedGraphicIndex] = useState(0);
  const [associatedShopId, setAssociatedShopId] = useState('');
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [bulkQuantity, setBulkQuantity] = useState<number>(1);

  useEffect(() => {
    if (preselectedShopId && isOpen) {
      setAssociatedShopId(preselectedShopId);
      const targetShop = shops.find(s => s.id === preselectedShopId);
      if (targetShop) {
        setCategory(targetShop.category);
      }
    } else if (isOpen) {
      setAssociatedShopId('');
      setBulkQuantity(1);
    }
  }, [preselectedShopId, isOpen, shops]);

  if (!isOpen) return null;

  const handlePhotoCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCapturedPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price) return;

    const numericPrice = parseFloat(price) || 0;
    const graphic = PRESET_GRAPHICS[selectedGraphicIndex];
    
    // Find shop if associated
    const targetShop = shops.find(s => s.id === associatedShopId);
    
    // Resolve custom category if other selected
    const resolvedCategory = category === 'other' ? (customCategory.trim() || 'Other') : category;

    onSave({
      title,
      titleUr: titleUr || `${title} (English)`,
      category: resolvedCategory,
      type,
      price: numericPrice,
      priceUr: `${numericPrice.toLocaleString('en-PK')} روپے`,
      location,
      locationUr: locationUr || 'صوالڈھیر',
      description,
      descriptionUr: descriptionUr || `${description} (Urdu Translation Upcoming)`,
      condition,
      imageGradient: capturedPhoto || graphic.gradient,
      imageEmoji: '',
      sellerName: '', 
      sellerPhone: '',
      sellerEmail: '',
      sellerId: '',
      isShopProduct: !!targetShop,
      shopName: targetShop ? targetShop.name : undefined,
      shopNameUr: targetShop ? targetShop.nameUr : undefined,
      offersDelivery,
      bulkQuantity: targetShop && bulkQuantity > 1 ? bulkQuantity : undefined
    });

    // Reset Form
    setTitle('');
    setTitleUr('');
    setCategory('fields');
    setCustomCategory('');
    setCustomCategoryUr('');
    setType('sell');
    setPrice('');
    setDescription('');
    setDescriptionUr('');
    setAssociatedShopId('');
    setOffersDelivery(false);
    setCapturedPhoto(null);
    setBulkQuantity(1);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#3a3a3a]/40 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ scale: 0.9, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, y: 20, opacity: 0 }}
        className="w-full max-w-2xl bg-white border border-[#dcd7ce] rounded-3xl shadow-xl overflow-hidden flex flex-col my-8"
        id="create-listing-form-container"
      >
        {/* Modal Header */}
        <div className="p-6 bg-[#f4f1ea] border-b border-[#dcd7ce] flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-[#5a6a5a]/10 text-[#5a6a5a]">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-xl font-serif font-bold text-[#5a6a5a]">
                {lang === 'en' ? 'Create New Trade Offer' : 'نیا تجارتی سودا شائع کریں'}
              </h2>
              <p className="text-xs text-[#707070]">
                {lang === 'en'
                  ? 'Sell or Rent items locally within the Republic of Sawaldher'
                  : 'جمہوریہ صوالڈھیر کے اندر خرید و فروخت یا کرایہ کے لیے اشتہار لگائیں'}
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
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[72vh] space-y-5 bg-white text-[#3a3a3a]">
          {/* Dual Column Core Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Title English */}
            <div>
              <label className="block text-xs font-bold text-[#3a3a3a] uppercase tracking-widest mb-1">
                {lang === 'en' ? 'Item Name (English)' : 'آئٹم کا نام (انگریزی)'} *
              </label>
              <input
                type="text"
                required
                className="w-full bg-white border border-[#dcd7ce] focus:border-[#5a6a5a] rounded-xl px-4 py-2.5 text-xs text-[#3a3a3a] placeholder-slate-400 outline-none transition"
                placeholder="e.g. Sahiwal Goat, Core-i7 Computer, Sugarcane Lease"
                value={title}
                onChange={e => setTitle(e.target.value)}
              />
            </div>

            {/* Title Urdu */}
            <div>
              <label className="block text-xs font-bold text-[#3a3a3a] uppercase tracking-widest mb-1 text-right">
                {lang === 'en' ? 'Item Name (Urdu - Optional)' : 'آئٹم کا نام (اردو - اختیاری)'}
              </label>
              <input
                type="text"
                dir="rtl"
                className="w-full bg-white border border-[#dcd7ce] focus:border-[#5a6a5a] rounded-xl px-4 py-2.5 text-xs text-[#3a3a3a] placeholder-slate-400 outline-none transition text-right"
                placeholder="مثال: ساہیوال بکرا، فرج، زمین کا ٹھیکہ"
                value={titleUr}
                onChange={e => setTitleUr(e.target.value)}
              />
            </div>
          </div>

          {/* Trade Type, Condition, and Delivery Switchers */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Trade Type Switcher */}
            <div>
              <label className="block text-xs font-bold text-[#3a3a3a] uppercase tracking-widest mb-1">
                {lang === 'en' ? 'Trade Type' : 'تجارت کی قسم'}
              </label>
              <div className="bg-[#f4f1ea] p-1 border border-[#dcd7ce] rounded-xl grid grid-cols-2">
                <button
                  type="button"
                  onClick={() => setType('sell')}
                  className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    type === 'sell'
                      ? 'bg-[#5a6a5a] text-white shadow-sm'
                      : 'text-[#707070] hover:text-[#3a3a3a]'
                  }`}
                >
                  {lang === 'en' ? 'Sell' : 'بیچیں'}
                </button>
                <button
                  type="button"
                  onClick={() => setType('rent')}
                  className={`py-2 text-[#3a3a3a] text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    type === 'rent'
                      ? 'bg-[#d4a373] text-white shadow-sm'
                      : 'text-[#707070] hover:text-[#3a3a3a]'
                  }`}
                >
                  {lang === 'en' ? 'Rent' : 'کرایہ'}
                </button>
              </div>
            </div>

            {/* Condition Switcher */}
            <div>
              <label className="block text-xs font-bold text-[#3a3a3a] uppercase tracking-widest mb-1">
                {lang === 'en' ? 'Condition' : 'مال کی حالت'}
              </label>
              <div className="bg-[#f4f1ea] p-1 border border-[#dcd7ce] rounded-xl grid grid-cols-2">
                <button
                  type="button"
                  onClick={() => setCondition('new')}
                  className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    condition === 'new'
                      ? 'bg-white text-[#3a3a3a] border border-[#dcd7ce] shadow-sm'
                      : 'text-[#707070] hover:text-[#3a3a3a]'
                  }`}
                >
                  {lang === 'en' ? 'New' : 'نیا'}
                </button>
                <button
                  type="button"
                  onClick={() => setCondition('used')}
                  className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    condition === 'used'
                      ? 'bg-white text-[#3a3a3a] border border-[#dcd7ce] shadow-sm'
                      : 'text-[#707070] hover:text-[#3a3a3a]'
                  }`}
                >
                  {lang === 'en' ? 'Used' : 'استعمال'}
                </button>
              </div>
            </div>

            {/* Delivery Switcher */}
            <div>
              <label className="block text-xs font-bold text-[#3a3a3a] uppercase tracking-widest mb-1">
                {lang === 'en' ? 'Offers Delivery?' : 'ڈلیوری کی سہولت؟'}
              </label>
              <div className="bg-[#f4f1ea] p-1 border border-[#dcd7ce] rounded-xl grid grid-cols-2">
                <button
                  type="button"
                  onClick={() => setOffersDelivery(true)}
                  className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    offersDelivery
                      ? 'bg-[#5a6a5a] text-white shadow-sm'
                      : 'text-[#707070] hover:text-[#3a3a3a]'
                  }`}
                >
                  {lang === 'en' ? 'Yes (ہاں)' : 'ہاں'}
                </button>
                <button
                  type="button"
                  onClick={() => setOffersDelivery(false)}
                  className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    !offersDelivery
                      ? 'bg-[#5a6a5a] text-white shadow-sm'
                      : 'text-[#707070] hover:text-[#3a3a3a]'
                  }`}
                >
                  {lang === 'en' ? 'No (نہیں)' : 'نہیں'}
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Category Selection Carousel */}
            <div>
              <label className="block text-xs font-bold text-[#3a3a3a] uppercase tracking-widest mb-1">
                {lang === 'en' ? 'Category' : 'کیٹیگری منتخب کریں'}
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
                <option value="other">
                  {lang === 'en' ? 'Other / Custom (دیگر)' : 'دیگر اشیاء / متفرق'}
                </option>
              </select>

              {/* Conditional Custom Inputs for Other Option */}
              {category === 'other' && (
                <div className="mt-2.5 space-y-2 p-3 bg-[#fdfbf7] rounded-xl border border-[#faecd8] animate-fadeIn">
                  <div>
                    <input
                      type="text"
                      className="w-full bg-white border border-[#dcd7ce] focus:border-[#5a6a5a] rounded-lg px-3 py-1.5 text-xs text-[#3a3a3a] placeholder:text-slate-400 outline-none"
                      placeholder={lang === 'en' ? 'Custom Category Title (e.g. Books)' : 'کیٹیگری انگریزی میں (مثلاً کتابیں)'}
                      value={customCategory}
                      onChange={e => setCustomCategory(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      className="w-full bg-white border border-[#dcd7ce] focus:border-[#5a6a5a] rounded-lg px-3 py-1.5 text-xs text-[#3a3a3a] placeholder:text-slate-400 outline-none"
                      placeholder={lang === 'en' ? 'Custom Category Urdu (e.g. کتابیں)' : 'کیٹیگری اردو میں درج کریں'}
                      value={customCategoryUr}
                      onChange={e => setCustomCategoryUr(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Price (PKR) and Urdu display */}
            <div>
              <label className="block text-xs font-bold text-[#3a3a3a] uppercase tracking-widest mb-1">
                {lang === 'en' ? 'Price (PKR Rupees)' : 'قیمت (پاکستانی روپے)'} *
              </label>
              <input
                type="number"
                required
                className="w-full bg-white border border-[#dcd7ce] focus:border-[#5a6a5a] rounded-xl px-4 py-2.5 text-xs text-[#3a3a3a] placeholder-slate-400 outline-none transition"
                placeholder="e.g. 45000"
                value={price}
                onChange={e => setPrice(e.target.value)}
              />
            </div>
          </div>

          {/* Virtual Shop Connection Selector (Allow connecting listings to virtual shops dynamically) */}
          {shops.length > 0 && (
            <div className="bg-[#f2f9f2] border border-[#dfeae0] p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-3">
              <div className="flex items-center space-x-2">
                <Store className="w-5 h-5 text-[#5a6a5a]" />
                <div>
                  <h4 className="text-xs font-bold text-[#5a6a5a]">
                    {lang === 'en' ? 'Connect to Your Virtual Shop?' : 'کیا آپ اپنے ورچوئل سٹور سے منسلک کرنا چاہتے ہیں؟'}
                  </h4>
                  <p className="text-[10px] text-[#707070] leading-tight">
                    {lang === 'en' ? 'This item will carry your custom shop branding in the feed' : 'یہ پروڈکٹ فیڈ میں آپ کی دکان کے نام کے ساتھ نظر آئے گی'}
                  </p>
                </div>
              </div>
              <select
                value={associatedShopId}
                onChange={e => setAssociatedShopId(e.target.value)}
                className="bg-white border border-[#dfeae0] text-[#5a6a5a] rounded-xl px-3 py-1.5 text-xs outline-none focus:border-[#5a6a5a] w-full md:w-48 cursor-pointer font-bold"
              >
                <option value="">{lang === 'en' ? '-- Do not link (Personal) --' : '-- الگ رکھیں (ذاتی اشتہار) --'}</option>
                {shops.map(sh => (
                  <option key={sh.id} value={sh.id}>
                    {lang === 'en' ? sh.name : sh.nameUr}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Group quantity selection for bulk products */}
          {associatedShopId && (
            <div className="bg-[#fffdf5] border border-[#f5dab1] p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-3 animate-fadeIn">
              <div className="flex items-center space-x-2">
                <span className="p-2 bg-[#fbe7c6] text-amber-800 rounded-xl text-lg">📦</span>
                <div>
                  <h4 className="text-xs font-bold text-amber-900 font-serif">
                    {lang === 'en' ? 'Sell in Bulk Quantity?' : 'تھوک مقدار میں فروخت کریں؟'}
                  </h4>
                  <p className="text-[10px] text-[#707070] leading-tight font-sans">
                    {lang === 'en' ? 'Select how many same items you want to sell in bulk' : 'منتخب کریں کہ اس تھوک سودے میں ایک ہی جیسی کتنی اشیاء شامل ہیں'}
                  </p>
                </div>
              </div>
              <select
                value={bulkQuantity}
                onChange={e => setBulkQuantity(Number(e.target.value))}
                className="bg-white border border-[#dfeae0] text-[#5a6a5a] rounded-xl px-3 py-1.5 text-xs outline-none focus:border-amber-600 w-full md:w-48 cursor-pointer font-bold font-sans"
              >
                <option value={1}>{lang === 'en' ? 'Not Bulk / Single (1 Item)' : 'کوئی تھوک نہیں (1 عدد)'}</option>
                <option value={3}>{lang === 'en' ? 'Bulk of 3' : '3 کا مجموعہ (تھوک)'}</option>
                <option value={4}>{lang === 'en' ? 'Bulk of 4' : '4 کا مجموعہ (تھوک)'}</option>
                <option value={5}>{lang === 'en' ? 'Bulk of 5' : '5 کا مجموعہ (تھوک)'}</option>
                <option value={6}>{lang === 'en' ? 'Bulk of 6' : '6 کا مجموعہ (تھوک)'}</option>
                <option value={8}>{lang === 'en' ? 'Bulk of 8' : '8 کا مجموعہ (تھوک)'}</option>
                <option value={10}>{lang === 'en' ? 'Bulk of 10' : '10 کا مجموعہ (تھوک)'}</option>
                <option value={12}>{lang === 'en' ? 'Bulk of 12 (Dozen)' : '12 کا مجموعہ (درجن تھوک)'}</option>
              </select>
            </div>
          )}

          {/* Take Product Photo Section */}
          <div className="p-4 bg-amber-50/60 border border-amber-200/80 rounded-2xl">
            <label className="block text-xs font-bold text-[#3a3a3a] uppercase tracking-widest mb-2">
              📸 {lang === 'en' ? 'Product Photo / Camera Capture' : 'رئیل آفر تصویر یا کیمرہ کھینچیں'}
            </label>
            <p className="text-[10px] text-[#707070] mb-3">
              {lang === 'en' 
                ? 'Take a photo of your product using your mobile camera or upload from your device gallery.' 
                : 'اپنے موبائل کیمرہ سے مصنوعات کی تصویر کھینچیں یا گیلری سے منتخب کریں۔'}
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <label className="px-4 py-3 bg-gradient-to-r from-[#5a6a5a] to-[#4d5b4d] hover:from-[#4d5b4d] hover:to-[#3e4a3e] text-white text-[10px] font-black tracking-widest uppercase rounded-xl cursor-pointer shadow-sm transition-all hover:scale-[1.02] flex items-center gap-2">
                <span>📷 {lang === 'en' ? 'Take Photo' : 'تصویر لیں / گیلری'}</span>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={handlePhotoCapture}
                />
              </label>

              {capturedPhoto ? (
                <div className="flex items-center gap-3 bg-white p-1.5 rounded-xl border border-[#dcd7ce] shadow-sm">
                  <img
                    src={capturedPhoto}
                    alt="Captured preview"
                    className="w-14 h-14 rounded-lg object-cover border border-[#ebe6dd]"
                  />
                  <div className="text-left">
                    <span className="text-[10px] text-emerald-700 font-bold block">✓ {lang === 'en' ? 'Photo Ready' : 'تصویر تیار ہے'}</span>
                    <button
                      type="button"
                      onClick={() => setCapturedPhoto(null)}
                      className="text-[9px] text-red-600 hover:text-red-800 font-black tracking-widest uppercase transition-colors"
                    >
                      {lang === 'en' ? 'Delete / Reset' : 'خارج کریں'}
                    </button>
                  </div>
                </div>
              ) : (
                <span className="text-[10px] text-[#8e8e8e]">
                  {lang === 'en' ? 'No custom photo captured (preset graphic below will be used instead)' : 'کوئی تصویر منتخب نہیں نئی (نیچے دیا گیا کارڈ رنگ ہی استعمال ہوگا)'}
                </span>
              )}
            </div>
          </div>

          {/* Graphic Styling & Emoji selector */}
          <div>
            <label className="block text-xs font-bold text-[#3a3a3a] uppercase tracking-widest mb-2">
              {lang === 'en' ? 'Select Visual Motif Card Gradients' : 'موزوں کارڈ کارڈ ڈیزائن یا پینل منتخب کریں'}
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {PRESET_GRAPHICS.map((g, idx) => {
                const IconComponent = (Icons as any)[g.icon] || Icons.HelpCircle;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedGraphicIndex(idx)}
                    className={`p-3 rounded-2xl bg-gradient-to-tr ${g.gradient} flex flex-col items-center justify-center border-4 relative transition-transform cursor-pointer ${
                      selectedGraphicIndex === idx
                        ? 'border-[#5a6a5a] scale-105 shadow-sm'
                        : 'border-transparent opacity-65 hover:opacity-95'
                    }`}
                  >
                    <IconComponent className="w-6 h-6 text-white" />
                    <span className="text-[8px] text-white/95 font-bold block mt-1 truncate max-w-full">
                      {g.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Location and translated location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#3a3a3a] uppercase tracking-widest mb-1">
                {lang === 'en' ? 'Area in Sawaldher (English)' : 'صوالڈھیر کا علاقہ (انگریزی)'}
              </label>
              <input
                type="text"
                className="w-full bg-white border border-[#dcd7ce] focus:border-[#5a6a5a] rounded-xl px-4 py-2.5 text-xs text-[#3a3a3a] placeholder-slate-400 outline-none transition"
                placeholder="e.g. Sawaldher Canal Road, North Sector"
                value={location}
                onChange={e => setLocation(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#3a3a3a] uppercase tracking-widest mb-1 text-right">
                {lang === 'en' ? 'Area (Urdu)' : 'صوالڈھیر کا علاقہ (اردو)'}
              </label>
              <input
                type="text"
                dir="rtl"
                className="w-full bg-white border border-[#dcd7ce] focus:border-[#5a6a5a] rounded-xl px-4 py-2.5 text-xs text-[#3a3a3a] placeholder-slate-400 outline-none transition text-right"
                placeholder="مثال: مین بائی پاس نہر چوک صوالڈھیر"
                value={locationUr}
                onChange={e => setLocationUr(e.target.value)}
              />
            </div>
          </div>

          {/* Description Textareas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#3a3a3a] uppercase tracking-widest mb-1">
                {lang === 'en' ? 'Description (English)' : 'تفصیلات (انگریزی)'}
              </label>
              <textarea
                rows={3}
                className="w-full bg-white border border-[#dcd7ce] focus:border-[#5a6a5a] rounded-xl px-4 py-2.5 text-xs text-[#3a3a3a] placeholder-slate-400 outline-none transition resize-none"
                placeholder="Tell buyers about conditions, water-access, milk yield, or mobile battery health..."
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#3a3a3a] uppercase tracking-widest mb-1 text-right">
                {lang === 'en' ? 'Description (Urdu)' : 'مزید تفصیلات (اردو)'}
              </label>
              <textarea
                rows={3}
                dir="rtl"
                className="w-full bg-white border border-[#dcd7ce] focus:border-[#5a6a5a] rounded-xl px-4 py-2.5 text-xs text-[#3a3a3a] placeholder-slate-400 outline-none transition resize-none text-right"
                placeholder="خرابی، حالت، رنگ، یا کوئی اور خاص بات جو کسٹمر کو معلوم ہونی چاہئے لکھیں۔۔۔"
                value={descriptionUr}
                onChange={e => setDescriptionUr(e.target.value)}
              />
            </div>
          </div>

          {/* Terms & Submit button */}
          <div className="pt-4 border-t border-[#dcd7ce] flex items-center justify-between gap-4">
            <span className="text-[10px] text-[#8e8e8e] leading-tight">
              {lang === 'en'
                ? 'By submitting, you represent that this trade item is located within the Sawaldher community.'
                : 'اپلوڈ کرنے کا مطلب ہے کہ آپ اس بات کی گواہی دے رہے ہیں کہ یہ مال صوالڈھیر میں موجود ہے۔'}
            </span>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-[#5a6a5a] hover:bg-[#4d5b4d] text-white font-bold text-xs uppercase tracking-widest shrink-0 transition shadow-sm cursor-pointer"
            >
              {lang === 'en' ? 'Publish Offer 🚀' : 'سودا شائع کریں 🚀'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
