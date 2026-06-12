/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Shop, Listing } from '../types';
import { Store, User, Phone, Calendar, ArrowRight, Bookmark } from 'lucide-react';

interface ShopsListProps {
  shops: Shop[];
  listings: Listing[];
  lang: 'en' | 'ur';
  onSelectShopFilter: (shopName: string) => void;
  onCallShopPhone: (phone: string, shopName: string) => void;
  onOpenShopClick?: () => void;
}

export default function ShopsList({
  shops,
  listings,
  lang,
  onSelectShopFilter,
  onCallShopPhone,
  onOpenShopClick
}: ShopsListProps) {
  
  const getProductCount = (shopName: string) => {
    return listings.filter(l => l.isShopProduct && l.shopName === shopName).length;
  };

  return (
    <div className="space-y-6" id="shops-list-view">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#f4f1ea] p-6 rounded-3xl border border-[#dcd7ce]">
        <div>
          <h2 className="text-xl font-serif font-bold text-[#5a6a5a] flex items-center gap-2">
            <Store className="text-[#5a6a5a]" />
            <span>
              {lang === 'en' ? 'Bazaar Virtual Shops' : 'صوالڈھیر ورچوئل بازار کی دکانیں'}
            </span>
          </h2>
          <p className="text-xs text-[#707070] mt-1">
            {lang === 'en'
              ? 'Visit dedicated shop houses owned by trustworthy locals of Sawaldher'
              : 'صوالڈھیر کے بااعتمد دکانداروں کے ورچوئل شو رومز پر جائیں اور براہ راست خریداری کریں'}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="text-[11px] font-mono text-white bg-[#5a6a5a] border border-[#4d5b4d] px-3 py-1.5 rounded-xl self-start md:self-auto">
            {shops.length} {lang === 'en' ? 'Active Merchants' : 'فعال دکاندار'}
          </div>
          {onOpenShopClick && (
            <button
              onClick={onOpenShopClick}
              className="px-4 py-1.5 bg-[#d4a373] hover:bg-[#c39262] text-white text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-sm"
              id="shops-create-btn"
            >
              <span>🏪</span>
              <span>{lang === 'en' ? 'Open Shop' : 'دکان کھولیں'}</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {shops.map((shop, index) => {
          const itemQuantity = getProductCount(shop.name);
          return (
            <motion.div
              layout
              key={shop.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white border border-[#e5e0d8] rounded-3xl p-6 flex flex-col justify-between hover:border-[#5a6a5a]/40 hover:shadow-lg transition-all group"
            >
              <div>
                {/* Logo & Category Banner */}
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${shop.logoGradient} flex items-center justify-center text-white text-2xl shadow-md`}>
                     {shop.logoEmoji}
                  </div>
                  <span className="text-[10px] uppercase font-black text-[#5a6a5a] bg-[#f2f9f2] px-2.5 py-1 rounded-lg border border-[#dfeae0]">
                    {shop.category === 'fields' && (lang === 'en' ? 'Farms' : 'زراعت')}
                    {shop.category === 'animals' && (lang === 'en' ? 'Livestock' : 'مال مویشی')}
                    {shop.category === 'electronics' && (lang === 'en' ? 'Electronics' : 'الیکٹرانکس')}
                    {shop.category === 'house' && (lang === 'en' ? 'Property' : 'مکانات')}
                    {shop.category === 'cars' && (lang === 'en' ? 'Vehicle' : 'سواری کار')}
                    {shop.category === 'mobile' && (lang === 'en' ? 'Mobile Palace' : 'موبائلز')}
                    {shop.category === 'industrial' && (lang === 'en' ? 'Industrial Supplies' : 'صنعتی سٹور')}
                  </span>
                </div>

                {/* Shop Name */}
                <h3 className="text-base font-serif font-bold text-[#3a3a3a] group-hover:text-[#5a6a5a] transition-colors line-clamp-1">
                  {lang === 'en' ? shop.name : shop.nameUr}
                </h3>

                {/* Merchant Name */}
                <div className="flex items-center space-x-1.5 text-xs text-[#707070] mt-1">
                  <User size={12} className="text-[#d4a373]" />
                  <span>{lang === 'en' ? `Merchant: ${shop.ownerName}` : `مالک دکان: ${shop.ownerName}`}</span>
                </div>

                {/* Brief custom bio description */}
                <p className="text-xs text-[#707070] mt-3 leading-relaxed line-clamp-2">
                  {lang === 'en' ? shop.description : shop.descriptionUr}
                </p>
              </div>

              {/* Footer metadata area and Action grid */}
              <div className="mt-5 pt-4 border-t border-[#eeebe3] space-y-3">
                <div className="flex items-center justify-between text-[11px] text-[#8e8e8e] font-mono">
                  <div className="flex items-center gap-1">
                    <Calendar size={11} />
                    <span>Est. {shop.createdAt}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[#5a6a5a] bg-[#f2f9f2] px-2 py-0.5 rounded border border-[#dfeae0]">
                    <Bookmark size={10} />
                    <span>{itemQuantity} {lang === 'en' ? 'Products' : 'اشیاء'}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onCallShopPhone(shop.phone, shop.name)}
                    className="p-2.5 rounded-xl bg-[#ebe6dd] hover:bg-[#dcd7ce] font-bold text-xs text-[#3a3a3a] flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  >
                    <Phone size={12} className="text-[#5a6a5a]" />
                    <span>{lang === 'en' ? 'Call Store' : 'رابطہ کریں'}</span>
                  </button>

                  <button
                    onClick={() => onSelectShopFilter(shop.name)}
                    className="p-2.5 rounded-xl bg-[#5a6a5a] hover:bg-[#4d5b4d] font-bold text-xs text-white flex items-center justify-center gap-1 transition-all cursor-pointer"
                  >
                    <span>{lang === 'en' ? 'Catalog' : 'کیٹلاگ دیکھیں'}</span>
                    <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
