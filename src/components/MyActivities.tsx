/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Store, ShoppingBag, Trash2, Calendar, ArrowRight } from 'lucide-react';
import { Shop, Listing } from '../types';

interface MyActivitiesProps {
  user: any;
  shops: Shop[];
  listings: Listing[];
  lang: 'en' | 'ur';
  onDeleteListing: (id: string) => void;
  onDeleteShop: (id: string) => void;
  onSelectShop: (shop: Shop) => void;
  onSelectListing: (listing: Listing) => void;
}

export default function MyActivities({
  user,
  shops,
  listings,
  lang,
  onDeleteListing,
  onDeleteShop,
  onSelectShop,
  onSelectListing
}: MyActivitiesProps) {
  const isUrdu = lang === 'ur';

  // Filter listings and shops belonging to current user
  const myListings = listings.filter(l => l.sellerId === user?.uid);
  const myShops = shops.filter(s => s.ownerId === user?.uid);

  return (
    <div className="space-y-8" id="my-activities-dashboard">
      {/* Top Banner Dashboard Card */}
      <div className="p-8 rounded-3xl bg-gradient-to-tr from-[#5a6a5a] via-[#4d5b4d] to-[#d4a373] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
        <div className="space-y-2 text-center md:text-left">
          <span className="text-[10px] bg-white/20 px-3 py-1 rounded-full font-black tracking-widest uppercase border border-white/10">
            📊 {isUrdu ? 'کاروباری رپورٹ' : 'Merchant Activity Report'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-black">
            {isUrdu ? `خوش آمدید، ${user?.displayName || 'کاشکار بھائی'}` : `Welcome, ${user?.displayName || 'Sawaldher Local'}`}
          </h2>
          <p className="text-xs text-white/85 max-w-lg leading-relaxed">
            {isUrdu 
              ? 'صوالڈھیر ورچوئل بازار میں آپ کی فعال اشیاء اور دکانیں یہاں موجود ہیں۔ اپنی مصنوعات کسٹمر کونسل کے ذریعے آسانی سے دیکھ بھال کریں۔' 
              : 'Track and prune active trades, inspect customer statistics, and manage virtual stores published under your verified local account.'}
          </p>
        </div>

        {/* Dynamic Metric Grid */}
        <div className="grid grid-cols-2 gap-3 w-full md:w-auto shrink-0">
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-center">
            <span className="text-2xl sm:text-3xl font-bold font-serif block">{myShops.length}</span>
            <span className="text-[10px] uppercase font-bold text-white/80">{isUrdu ? 'کھولی دکانیں' : 'Virtual Shops'}</span>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-center">
            <span className="text-2xl sm:text-3xl font-bold font-serif block">{myListings.length}</span>
            <span className="text-[10px] uppercase font-bold text-white/80">{isUrdu ? 'مجموعی سودے' : 'Active Offers'}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Module A: My Shops */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-[#eeebe3] pb-3">
            <h3 className="text-md font-serif font-bold text-[#5a6a5a] flex items-center gap-2">
              <Store className="w-5 h-5 text-[#5a6a5a]" />
              <span>{isUrdu ? 'میری رجسٹرڈ دکانیں' : 'My Virtual Shops'}</span>
            </h3>
            <span className="text-xs bg-[#ebe6dd] px-2.5 py-1 rounded-lg text-[#3a3a3a] font-mono font-bold">
              {myShops.length}
            </span>
          </div>

          {myShops.length === 0 ? (
            <div className="py-12 p-6 text-center space-y-3 bg-[#ebe6dd]/30 border border-dashed border-[#dcd7ce] rounded-3xl">
              <span className="text-4xl text-slate-400">🏪</span>
              <h4 className="font-serif font-bold text-sm text-[#3a3a3a]">
                {isUrdu ? 'آپ کا ابھی تک بازار میں کوئی دکان نہیں ہے' : 'You have no shops registered yet'}
              </h4>
              <p className="text-[11px] text-[#707070] max-w-xs mx-auto">
                {isUrdu 
                  ? 'ورچوئل بازار سیکشن میں جا کر اپنی دکان کھولیں تاکہ آپ ایک دائرہ کار کے اندر اپنے مال کی تشہیر کر سکیں۔'
                  : 'Open a dedicated shop front inside the Bazaar to represent your local business as a trustworthy Sawaldher trader.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {myShops.map((shop) => (
                <div 
                  key={shop.id}
                  className="bg-white border border-[#e5e0d8] p-5 rounded-3xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${shop.logoGradient} flex items-center justify-center text-white text-2xl shadow-sm`}>
                        {shop.logoEmoji}
                      </div>
                      <div>
                        <h4 className="text-sm font-serif font-bold text-[#3a3a3a]">{isUrdu ? shop.nameUr : shop.name}</h4>
                        <span className="text-[9px] uppercase font-bold text-[#d4a373] bg-[#fdfbf7] px-2 py-0.5 rounded border border-[#faecd8]">
                          {shop.category}
                        </span>
                      </div>
                    </div>

                    {/* Dangerous Action: Delete Shop */}
                    <button
                      onClick={() => onDeleteShop(shop.id)}
                      className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-colors cursor-pointer"
                      title={isUrdu ? 'دکان مستقل طور پر ختم کریں' : 'Delete Store'}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>

                  <p className="text-xs text-[#707070] mt-3 line-clamp-2 leading-relaxed">
                    {isUrdu ? shop.descriptionUr : shop.description}
                  </p>

                  <div className="mt-4 pt-4 border-t border-[#eeebe3] flex items-center justify-between gap-2 flex-wrap text-[11px] text-[#8e8e8e]">
                    <div className="flex items-center gap-1">
                      <Calendar size={11} />
                      <span>{isUrdu ? `تخلیق: ${shop.createdAt}` : `Registered: ${shop.createdAt}`}</span>
                    </div>

                    <button
                      onClick={() => onSelectShop(shop)}
                      className="px-3 py-1.5 bg-[#5a6a5a] hover:bg-[#4d5b4d] text-white text-[10px] font-bold rounded-xl transition flex items-center gap-1 cursor-pointer"
                    >
                      <span>{isUrdu ? 'کیٹلاگ دیکھیں' : 'Visit Catalog'}</span>
                      <ArrowRight size={10} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Module B: My Listings */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-[#eeebe3] pb-3">
            <h3 className="text-md font-serif font-bold text-[#5a6a5a] flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#5a6a5a]" />
              <span>{isUrdu ? 'میرے شائع کردہ سودے' : 'My Trade Listings'}</span>
            </h3>
            <span className="text-xs bg-[#ebe6dd] px-2.5 py-1 rounded-lg text-[#3a3a3a] font-mono font-bold">
              {myListings.length}
            </span>
          </div>

          {myListings.length === 0 ? (
            <div className="py-12 p-6 text-center space-y-3 bg-[#ebe6dd]/30 border border-dashed border-[#dcd7ce] rounded-3xl">
              <span className="text-4xl text-slate-400">📦</span>
              <h4 className="font-serif font-bold text-sm text-[#3a3a3a]">
                {isUrdu ? 'آپ نے ابھی تک کوئی تجارتی سودا شائع نہیں کیا ہے' : 'You have no listings active yet'}
              </h4>
              <p className="text-[11px] text-[#707070] max-w-xs mx-auto">
                {isUrdu 
                  ? 'نیا سودا اپلوڈ کریں پر کلک کر کے مویشی، موٹر سائیکل یا کوئی بھی سامان بازار میں چڑھا کر کسٹمر ڈیل کریں۔'
                  : 'Publish items for sale or rent to make them instantly viewable to the village of Sawaldher.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
              {myListings.map((item) => (
                <div 
                  key={item.id}
                  className="bg-white border border-[#e5e0d8] p-4 rounded-3xl hover:border-red-200 shadow-sm flex gap-4 transition-all"
                >
                  {/* cover preview */}
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-tr ${item.imageGradient} shrink-0 relative flex items-center justify-center text-white text-2xl overflow-hidden shadow-inner`}>
                    {item.imageGradient.startsWith('data:image') || item.imageGradient.startsWith('http') ? (
                      <img 
                        src={item.imageGradient} 
                        alt={item.title} 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <span>🌾</span>
                    )}
                  </div>

                  {/* meta details */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-xs font-bold text-[#3a3a3a] truncate">{isUrdu ? item.titleUr : item.title}</h4>
                        <span className="text-xs text-[#d4a373] font-bold block mt-0.5">
                          {isUrdu ? item.priceUr : item.price.toLocaleString('en-PK', { style: 'currency', currency: 'PKR', maximumFractionDigits: 0 })}
                        </span>
                      </div>

                      {/* Delete Individual listing */}
                      <button
                        onClick={() => onDeleteListing(item.id)}
                        className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors cursor-pointer shrink-0"
                        title={isUrdu ? 'سودا خارج کریں' : 'Remove Listing'}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-[#8e8e8e] pt-1">
                      <span className="truncate max-w-[70%]">📍 {isUrdu ? item.locationUr : item.location}</span>
                      
                      <button 
                        onClick={() => onSelectListing(item)}
                        className="text-[#5a6a5a] font-bold hover:underline"
                      >
                        {isUrdu ? 'دیکھیں' : 'Inspect'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
