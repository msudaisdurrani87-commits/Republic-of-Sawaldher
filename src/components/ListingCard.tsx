/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Listing } from '../types';
import * as Icons from 'lucide-react';

interface ListingCardProps {
  key?: string;
  listing: Listing;
  lang: 'en' | 'ur';
  onStartChat: (listing: Listing) => void;
  onCallSeller: (listing: Listing) => void;
  onBuyInstantly?: (listing: Listing) => void; // Trigger awesome Success visual effect!
  isFavorited?: boolean;
  onToggleFavorite?: () => void;
  onDelete?: () => void;
  onSelectShopFilter?: (shopName: string) => void;
}

export default function ListingCard({
  listing,
  lang,
  onStartChat,
  onCallSeller,
  onBuyInstantly,
  isFavorited = false,
  onToggleFavorite,
  onDelete,
  onSelectShopFilter
}: ListingCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Dynamic Lucide icon helper
  const renderIcon = (name: string, className = 'w-4 h-4') => {
    switch (name) {
      case 'fields':
        return <Icons.Sprout className={className} />;
      case 'animals':
        return <Icons.Footprints className={className} />;
      case 'electronics':
        return <Icons.Tv className={className} />;
      case 'house':
        return <Icons.Home className={className} />;
      case 'cars':
        return <Icons.Car className={className} />;
      case 'industrial':
        return <Icons.Hammer className={className} />;
      case 'mobile':
      default:
        return <Icons.Smartphone className={className} />;
    }
  };

  const formattedPrice = listing.price.toLocaleString('en-PK', {
    style: 'currency',
    currency: 'PKR',
    maximumFractionDigits: 0
  });

  return (
    <motion.div
      layout
      whileHover={{ y: -6, scale: 1.01 }}
      className="bg-white border border-[#e5e0d8] rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col group h-full"
      style={{ contentVisibility: 'auto' }}
      id={`listing-card-${listing.id}`}
    >
      {/* Dynamic Graphic Header instead of boring image - crafted with gorgeous local gradient/CSS and styled icons */}
      <div 
        className={`h-48 relative p-6 flex flex-col justify-between overflow-hidden ${
          listing.imageGradient.startsWith('data:image') || listing.imageGradient.startsWith('http')
            ? ''
            : `bg-gradient-to-tr ${listing.imageGradient}`
        }`}
        style={
          listing.imageGradient.startsWith('data:image') || listing.imageGradient.startsWith('http')
            ? { backgroundImage: `url(${listing.imageGradient})`, backgroundSize: 'cover', backgroundPosition: 'center' }
            : {}
        }
      >
        {/* Visual glass backdrop bubbles */}
        <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-white/10 blur-xl group-hover:scale-125 transition-all duration-500" />
        <div className="absolute -left-10 -bottom-10 w-24 h-24 rounded-full bg-black/10 blur-lg" />

        {/* Condition, Views, and Favorite Heart Tags */}
        <div className="flex items-center justify-between z-10 w-full">
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
            listing.type === 'rent'
              ? 'bg-[#d4a373] text-white shadow-sm'
              : 'bg-[#5a6a5a] text-white shadow-sm'
          }`}>
            {listing.type === 'rent'
              ? (lang === 'en' ? 'Rent' : 'کرایہ')
              : (lang === 'en' ? 'Buy / Sell' : 'سودا')}
          </span>

          <div className="flex items-center gap-1.5">
            <span className="px-2 py-1 rounded-md text-[10px] font-mono text-white bg-black/40 backdrop-blur-sm flex items-center gap-1">
              <Icons.Eye size={10} />
              <span>{listing.views} {lang === 'en' ? 'views' : 'مشاہدات'}</span>
            </span>

            {/* Favorite heart toggle button */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onToggleFavorite && onToggleFavorite();
              }}
              className={`p-1.5 rounded-full transition-all duration-200 outline-none flex items-center justify-center shrink-0 shadow-sm ${
                isFavorited
                  ? 'bg-rose-500 text-white scale-105 border border-rose-400'
                  : 'bg-black/40 text-white border border-white/10 hover:bg-rose-500 hover:text-white'
              }`}
              title={lang === 'en' ? 'Save Item' : 'سودا محفوظ کریں'}
              id={`fav-btn-${listing.id}`}
            >
              <Icons.Heart size={11} fill={isFavorited ? 'currentColor' : 'none'} className="transition-transform active:scale-75" />
            </button>
          </div>
        </div>

        {/* Huge Central Illustrative Category Design or Blank glass block if uploaded image exists */}
        <div className="flex flex-col items-center justify-center py-4 relative z-10 transition-transform duration-300 group-hover:scale-110">
          {(!listing.imageGradient.startsWith('data:image') && !listing.imageGradient.startsWith('http')) && (
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 shadow-lg">
              {renderIcon(listing.category, 'w-8 h-8')}
            </div>
          )}
          {listing.isShopProduct && (
            <span className="mt-2 text-[9px] bg-white text-[#5a6a5a] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest border border-[#dcd7ce] shadow-sm flex items-center gap-1">
              <Icons.Award size={8} />
              {lang === 'en' ? 'Verified Shop' : 'تصدیق شدہ دکان'}
            </span>
          )}
        </div>

        {/* Category & Condition tags */}
        <div className="flex justify-between items-center z-10">
          <div className="flex items-center space-x-1.5 bg-black/35 backdrop-blur-md px-2.5 py-1 rounded-xl text-[10px] font-bold text-white border border-white/10">
            {renderIcon(listing.category, 'w-3 h-3')}
            <span>
              {listing.category === 'fields' && (lang === 'en' ? 'Agriculture' : 'زرعی زمین')}
              {listing.category === 'animals' && (lang === 'en' ? 'Livestock' : 'مال مویشی')}
              {listing.category === 'electronics' && (lang === 'en' ? 'Electronics' : 'الیکٹرانکس')}
              {listing.category === 'house' && (lang === 'en' ? 'Property' : 'پراپرٹی')}
              {listing.category === 'cars' && (lang === 'en' ? 'Vehicle' : 'گاڑی')}
              {listing.category === 'mobile' && (lang === 'en' ? 'Mobile Store' : 'موبائلز')}
              {listing.category === 'industrial' && (lang === 'en' ? 'Industrial / Building' : 'تعمیراتی میٹریل')}
            </span>
          </div>

          <span className="text-[10px] font-black px-2.5 py-1 rounded-xl uppercase bg-white/95 text-[#3a3a3a] shadow-sm">
            {listing.condition === 'new'
              ? (lang === 'en' ? 'Brand New' : 'کورہ مال')
              : (lang === 'en' ? 'Gently Used' : 'استعمال شدہ')}
          </span>
        </div>
      </div>

      {/* Product Information Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Price Header inside a decorative tag */}
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-lg font-black text-[#d4a373] tracking-tight font-sans">
              {lang === 'en' ? formattedPrice : listing.priceUr}
            </span>
            {listing.bulkQuantity && listing.bulkQuantity > 1 ? (
              <span className="bg-[#fff9e6] text-[#b45309] border border-[#fef3c7] px-2 py-0.5 rounded-lg text-[10px] font-black flex items-center gap-1 shadow-xs animate-pulse font-sans">
                📦 {lang === 'en' ? `Bulk (${listing.bulkQuantity}x)` : `تھوک (${listing.bulkQuantity} عدد)`}
              </span>
            ) : listing.type === 'rent' ? (
              <span className="text-xs text-[#757575]">
                {lang === 'en' ? '/ month' : '/ ماہانہ'}
              </span>
            ) : null}
          </div>

          {/* Title */}
          <h3 className="text-sm font-bold text-[#3a3a3a] line-clamp-1 group-hover:text-[#5a6a5a] transition-colors">
            {lang === 'en' ? listing.title : listing.titleUr}
          </h3>

          {/* Shop Tag (if belong to virtual shop) */}
          {listing.isShopProduct && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onSelectShopFilter && listing.shopName) {
                  onSelectShopFilter(listing.shopName);
                }
              }}
              className="text-[11px] text-[#5a6a5a] hover:text-[#4d5b4d] font-semibold flex items-center gap-1 mt-1 font-serif cursor-pointer hover:underline transition-all"
              title={lang === 'en' ? `Click to visit ${listing.shopName}` : `${listing.shopName} کی دکان دیکھنے کے لیے کلک کریں`}
            >
              <span>🏪</span>
              <span>
                {lang === 'en' ? `Shop: ${listing.shopName}` : `دکان: ${listing.shopName}`}
              </span>
            </button>
          )}

          {/* Brief location and description */}
          <p className="text-xs text-[#707070] line-clamp-2 mt-2 leading-relaxed font-sans">
            {lang === 'en' ? listing.description : listing.descriptionUr}
          </p>
        </div>

        {/* Footer Area with Location, Seller & Detailed action drawer button */}
        <div className="mt-4 pt-4 border-t border-[#eeebe3]">
          <div className="flex items-center justify-between text-[11px] text-[#8e8e8e] mb-4">
            <div className="flex items-center gap-1 truncate max-w-[60%]">
              <Icons.MapPin size={11} className="text-[#d4a373] flex-shrink-0" />
              <span className="truncate">{lang === 'en' ? listing.location : listing.locationUr}</span>
            </div>
            <div className="flex items-center gap-1 font-mono">
              <Icons.User size={11} className="text-[#5a6a5a]" />
              <span>{listing.sellerName.split(' ')[0]}</span>
            </div>
          </div>

          {/* Direct Trading Console Actions */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onStartChat(listing);
              }}
              className="px-3 py-2.5 rounded-xl bg-[#ebe6dd] hover:bg-[#dcd7ce] text-[#3a3a3a] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Icons.MessageSquare size={13} className="text-[#5a6a5a]" />
              <span>{lang === 'en' ? 'Chat / پیام' : 'چیٹ کریں'}</span>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onCallSeller(listing);
              }}
              className="px-3 py-2.5 rounded-xl bg-[#5a6a5a] hover:bg-[#4d5b4d] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all hover:scale-[1.02] cursor-pointer"
            >
              <Icons.PhoneCall size={13} />
              <span>{lang === 'en' ? 'Call Seller' : 'رابطہ کریں'}</span>
            </button>
          </div>

          {/* Buy Instantly Action - Triggers stunning screenshake and localized Mubarak celebrate VFX! */}
          {onBuyInstantly && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onBuyInstantly(listing);
              }}
              className="w-full mt-2 py-2 rounded-xl bg-white border border-[#d4a373] text-[#d4a373] text-[10px] font-black uppercase tracking-widest hover:bg-[#fef7f2] hover:text-[#8a5a4a] transition-all flex items-center justify-center gap-1 cursor-pointer"
            >
              <span>🤝</span>
              <span>{lang === 'en' ? 'Lock Trade / Buy Offer' : 'سودہ کنفرم کریں'}</span>
            </button>
          )}

          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="w-full mt-2 py-2 px-3 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 text-xs font-bold font-sans flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              id={`delete-btn-${listing.id}`}
            >
              <Icons.Trash2 size={13} />
              <span>{lang === 'en' ? 'Remove Listing' : 'سودا خارج کریں'}</span>
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
