/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Store, User, Phone, Sparkles, Heart, Eye, Star, 
  Plus, MessageSquare, Trash2, ShieldCheck, Award 
} from 'lucide-react';
import { Shop, Listing } from '../types';
import { db } from '../firebase';
import { collection, onSnapshot, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../firestore_helper';

interface Review {
  id: string;
  shopId: string;
  authorId: string;
  authorName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface ShopDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  shop: Shop;
  listings: Listing[];
  lang: 'en' | 'ur';
  onProductClick: (listing: Listing) => void;
  onCallShopPhone: (phone: string, shopName: string) => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  user: any;
  onPublishProductInShop?: (shop: Shop) => void;
}

export default function ShopDetailModal({
  isOpen,
  onClose,
  shop,
  listings,
  lang,
  onProductClick,
  onCallShopPhone,
  favorites,
  onToggleFavorite,
  user,
  onPublishProductInShop
}: ShopDetailModalProps) {
  if (!isOpen) return null;

  const isUrdu = lang === 'ur';

  // State
  const [activeTab, setActiveTab] = useState<'products' | 'reviews'>('products');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newRating, setNewRating] = useState<number>(5);
  const [newComment, setNewComment] = useState<string>('');
  const [isSubmittingReview, setIsSubmittingReview] = useState<boolean>(false);

  // Sync shop reviews in real-time
  useEffect(() => {
    if (!shop.id) return;
    const q = collection(db, 'shops', shop.id, 'reviews');
    const unsub = onSnapshot(q, (snapshot) => {
      const list: Review[] = [];
      snapshot.forEach(docSnap => {
        list.push({ id: docSnap.id, ...docSnap.data() } as Review);
      });
      // Sort: Newest first
      list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      setReviews(list);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, `shops/${shop.id}/reviews`);
    });

    return () => unsub();
  }, [shop.id]);

  // Aggregate stats
  const aggregateRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : '5.0';

  // Get only products belonging to this shop
  const shopProducts = listings.filter(
    l => l.isShopProduct && (l.shopName === shop.name || l.shopNameUr === shop.nameUr)
  );

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert(isUrdu ? "درجہ بندی اور تبصرہ کرنے کے لیے برائے مہربانی لاگ ان کریں" : "Please login to write a trust review");
      return;
    }
    if (!newComment.trim()) return;

    setIsSubmittingReview(true);
    const reviewId = `rev_${Date.now()}_${user.uid.slice(0, 5)}`;
    
    const reviewData: Review = {
      id: reviewId,
      shopId: shop.id,
      authorId: user.uid,
      authorName: user.displayName || 'Sawaldher Resident',
      rating: newRating,
      comment: newComment.trim(),
      createdAt: new Date().toISOString()
    };

    try {
      await setDoc(doc(db, 'shops', shop.id, 'reviews', reviewId), reviewData);
      setNewComment('');
      setNewRating(5);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `shops/${shop.id}/reviews/${reviewId}`);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    const confirmText = isUrdu 
      ? 'کیا آپ واقعی یہ تبصرہ حذف کرنا چاہتے ہیں؟' 
      : 'Are you sure you want to delete this rating review?';
    if (!window.confirm(confirmText)) return;

    try {
      await deleteDoc(doc(db, 'shops', shop.id, 'reviews', reviewId));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `shops/${shop.id}/reviews/${reviewId}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3a3a3a]/40 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ scale: 0.9, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, y: 20, opacity: 0 }}
        className="w-full max-w-4xl bg-white border border-[#dcd7ce] rounded-3xl shadow-2xl overflow-hidden flex flex-col my-4 md:my-8 max-h-[90vh]"
        id={`shop-detail-modal-${shop.id}`}
      >
        {/* Banner header with shop identity */}
        <div className={`p-6 bg-gradient-to-r ${shop.logoGradient} text-white relative overflow-hidden shrink-0`}>
          {/* Backdrop decorative mesh */}
          <div className="absolute -right-20 -top-20 w-60 h-60 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -left-20 -bottom-20 w-40 h-40 rounded-full bg-black/10 blur-xl" />

          <div className="flex justify-between items-start relative z-10">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white text-3xl shadow-lg border border-white/20 select-none">
                {shop.logoEmoji}
              </div>
              <div>
                <div className="flex flex-wrap gap-1.5 items-center">
                  <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 backdrop-blur-sm text-white px-2.5 py-1 rounded-md border border-white/10">
                    {shop.category === 'fields' && (isUrdu ? 'زرعی کیٹگری' : 'Farms & Land')}
                    {shop.category === 'animals' && (isUrdu ? 'مال مویشی' : 'Livestock')}
                    {shop.category === 'electronics' && (isUrdu ? 'الیکٹرانکس' : 'Electronics')}
                    {shop.category === 'house' && (isUrdu ? 'پراپرٹی' : 'Property & Real estate')}
                    {shop.category === 'cars' && (isUrdu ? 'سواری کاریں' : 'Vehicles')}
                    {shop.category === 'mobile' && (isUrdu ? 'موبائل پیلس' : 'Mobile Store')}
                    {shop.category === 'industrial' && (isUrdu ? 'تعمیراتی سٹور' : 'Industrial Supplies')}
                  </span>
                  
                  {/* High Trust Score Badge */}
                  <span className="text-[10px] bg-amber-400 text-amber-950 font-black px-2 py-1 rounded-md flex items-center gap-0.5 shadow-sm border border-amber-300">
                    <Star size={10} fill="currentColor" />
                    <span>{aggregateRating} / 5</span>
                    <span className="opacity-90 font-sans ml-0.5">({reviews.length})</span>
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-serif font-black mt-1">
                  {isUrdu ? shop.nameUr : shop.name}
                </h2>
                <div className="flex items-center space-x-2 text-xs text-white/90 mt-1">
                  <User size={12} className="text-[#ebe6dd]" />
                  <span>{isUrdu ? `دکاندار: ${shop.ownerName}` : `Merchant: ${shop.ownerName}`}</span>
                  <span>•</span>
                  <span>Est. {shop.createdAt}</span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/25 text-white transition-colors cursor-pointer border border-white/10"
              title={isUrdu ? 'بند کریں' : 'Close'}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Modal content layout split */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-4 bg-[#faf8f5] text-[#3a3a3a]">
          {/* Shop information and contacts panel (1 column) */}
          <div className="p-6 border-b md:border-b-0 md:border-r border-[#dcd7ce] bg-white space-y-5 col-span-1 flex flex-col justify-between">
            <div className="space-y-5">
              <div>
                <h3 className="text-xs font-bold text-[#3a3a3a] uppercase tracking-widest mb-2">
                  {isUrdu ? 'دکان کے بارے میں' : 'About Store'}
                </h3>
                <p className="text-xs text-[#707070] leading-relaxed">
                  {isUrdu ? shop.descriptionUr : shop.description}
                </p>
              </div>

              {/* Verified Merchant Badge */}
              <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-start gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-[11px] font-bold text-emerald-800">
                    {isUrdu ? 'تصدیق شدہ دکاندار' : 'Verified Sawaldher Merchant'}
                  </h4>
                  <p className="text-[9.5px] text-emerald-700 leading-tight">
                    {isUrdu ? 'اس دکاندار کا فون نمبر اور شناخت مقامی سطح پر تصدیق شدہ ہے۔' : 'Identity and local phone registered with Republic Trade Council.'}
                  </p>
                </div>
              </div>

              {/* Creator/Owner shortcut to publish product */}
              {onPublishProductInShop && (shop.ownerId === user?.uid || user?.email === "msudaisdurrani87@gmail.com") && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl space-y-2">
                  <div className="flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-600" />
                    <span className="text-[11px] font-bold text-amber-900">{isUrdu ? 'انتظام دکان' : 'Owner Control Board'}</span>
                  </div>
                  <p className="text-[10px] text-amber-800">
                    {isUrdu ? 'بطور مالک، آپ اس دکان کے تحت براہ راست سودے شائع کر سکتے ہیں۔' : 'As the owner, publish trade listings inside this specific shop.'}
                  </p>
                  <button
                    onClick={() => onPublishProductInShop(shop)}
                    className="w-full py-2 bg-[#d4a373] hover:bg-[#c39262] text-white text-[10px] tracking-wider uppercase font-black rounded-xl cursor-pointer flex items-center justify-center gap-1 shadow-sm transition-all"
                  >
                    <Plus size={11} />
                    <span>{isUrdu ? 'دکان میں آئٹم ڈالیں' : 'Add Item to Shop'}</span>
                  </button>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-[#eeebe3] space-y-3">
              <h3 className="text-xs font-bold text-[#3a3a3a] uppercase tracking-widest">
                {isUrdu ? 'رابطہ کا کونسل' : 'Contact Channel'}
              </h3>
              
              <button
                onClick={() => onCallShopPhone(shop.phone, shop.name)}
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-transform hover:scale-[1.01] cursor-pointer"
              >
                <Phone size={14} />
                <span>{isUrdu ? 'واٹس ایپ پر ڈیل کریں' : 'WhatsApp Deal'}</span>
              </button>

              <div className="text-[10px] text-[#8e8e8e] leading-snug bg-[#faf8f5] p-3 rounded-xl border border-[#ebe6dd]">
                {isUrdu 
                  ? 'رابطہ کرنے سے پہلے اپنی مطلوبہ مصنوعات کو نوٹ کر لیں۔ یہاں کوئی پوشیدہ کمیشن نہیں ہے۔'
                  : 'Contact merchants directly. Negotiate bargains transparently with zero commission fees.'}
              </div>
            </div>
          </div>

          {/* Product list catalog and User Trust Reviews Tab component (3 columns) */}
          <div className="p-6 md:col-span-3 flex flex-col min-h-0">
            {/* Elegant Selector Tabs */}
            <div className="flex items-center justify-between border-b border-[#eeebe3] pb-1 shrink-0 mb-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setActiveTab('products')}
                  className={`py-2 px-4 text-sm font-serif font-black flex items-center gap-1.5 border-b-2 transition-all cursor-pointer ${
                    activeTab === 'products'
                      ? 'border-[#5a6a5a] text-[#5a6a5a]'
                      : 'border-transparent text-[#707070] hover:text-[#3a3a3a]'
                  }`}
                >
                  <Store className="w-4 h-4" />
                  <span>{isUrdu ? 'اشیاء کیٹلاگ' : 'Catalog Products'}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#5a6a5a]/10 font-sans font-bold">
                    {shopProducts.length}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`py-2 px-4 text-sm font-serif font-black flex items-center gap-1.5 border-b-2 transition-all cursor-pointer ${
                    activeTab === 'reviews'
                      ? 'border-[#5a6a5a] text-[#5a6a5a]'
                      : 'border-transparent text-[#707070] hover:text-[#3a3a3a]'
                  }`}
                  id="shop-reviews-tab"
                >
                  <Star className="w-4 h-4 text-amber-500" fill="currentColor" />
                  <span>{isUrdu ? 'تبصرے اور ساکھ' : 'Customer Reviews'}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-sans font-bold">
                    {reviews.length}
                  </span>
                </button>
              </div>
            </div>

            {/* Tab: Products List */}
            {activeTab === 'products' && (
              <div className="flex-1 min-h-0">
                {shopProducts.length === 0 ? (
                  <div className="py-16 text-center space-y-3 bg-[#ebe6dd]/30 border border-[#dcd7ce] rounded-3xl">
                    <span className="text-4xl">🏪</span>
                    <h4 className="font-serif font-bold text-[#3a3a3a] text-sm">
                      {isUrdu ? 'اس دکان میں کوئی مصنوعات نہیں ہیں' : 'No items listed yet'}
                    </h4>
                    <p className="text-[11px] text-[#707070] max-w-xs mx-auto">
                      {isUrdu 
                        ? 'دکاندار نے ابھی تک اس دکان کے تحت کوئی سودا یا پروڈکٹ اپلوڈ نہیں کی ہے۔'
                        : 'The merchant has not linked any active trade offers to this virtual store yet.'}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[52vh] overflow-y-auto pr-1">
                    {shopProducts.map(p => {
                      const isFav = favorites.includes(p.id);
                      return (
                        <div
                          key={p.id}
                          onClick={() => onProductClick(p)}
                          className="p-4 bg-white border border-[#e5e0d8] rounded-2xl hover:border-[#5a6a5a]/40 hover:shadow-md transition-all flex gap-3 cursor-pointer group"
                        >
                          {/* Miniature display cover */}
                          <div className={`w-16 h-16 rounded-xl bg-gradient-to-tr ${p.imageGradient} shrink-0 overflow-hidden relative flex items-center justify-center text-white text-xl shadow-inner`}>
                            {p.imageGradient.startsWith('data:image') || p.imageGradient.startsWith('http') ? (
                              <img
                                src={p.imageGradient}
                                alt={p.title}
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <span className="opacity-75 font-bold">📦</span>
                            )}
                          </div>

                          {/* Text Metadata summary */}
                          <div className="flex-1 min-w-0 flex flex-col justify-between">
                            <div>
                              <div className="flex justify-between items-start gap-1">
                                <h4 className="text-xs font-bold text-[#3a3a3a] truncate group-hover:text-[#5a6a5a] transition-colors">
                                  {isUrdu ? p.titleUr : p.title}
                                </h4>
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    onToggleFavorite(p.id);
                                  }}
                                  className={`p-1 rounded-full ${isFav ? 'text-rose-500' : 'text-[#8e8e8e] hover:text-[#5a6a5a]'}`}
                                >
                                  <Heart size={10} fill={isFav ? 'currentColor' : 'none'} />
                                </button>
                              </div>
                              <span className="text-xs font-black text-[#d4a373] mt-0.5 block font-sans">
                                {isUrdu ? p.priceUr : p.price.toLocaleString('en-PK', { style: 'currency', currency: 'PKR', maximumFractionDigits: 0 })}
                              </span>
                            </div>

                            <div className="flex items-center justify-between text-[9px] text-[#8e8e8e] pt-1">
                              <span className="truncate max-w-[70%]">📍 {isUrdu ? p.locationUr : p.location}</span>
                              <span className="flex items-center gap-0.5 font-mono"><Eye size={9} />{p.views}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Tab: Reviews & Feedback */}
            {activeTab === 'reviews' && (
              <div className="flex-1 min-h-0 flex flex-col space-y-4">
                {/* Form to post a review and rate the store */}
                <form onSubmit={handleSubmitReview} className="bg-amber-50/50 p-4 rounded-2xl border border-amber-200/60 shrink-0 space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <h4 className="text-xs font-bold text-amber-900 flex items-center gap-1">
                      <MessageSquare size={13} className="text-[#d4a373]" />
                      <span>{isUrdu ? 'دکان کی درجہ بندی کریں اور تبصرہ لکھیں' : 'Rate & Review this Shop'}</span>
                    </h4>
                    
                    {/* Interactive Star Selection */}
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewRating(star)}
                          className="text-amber-500 hover:scale-110 transition cursor-pointer"
                        >
                          <Star 
                            size={16} 
                            fill={star <= newRating ? 'currentColor' : 'none'} 
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="flex-1 bg-white border border-[#dcd7ce] focus:border-[#5a6a5a] rounded-xl px-3 py-2 text-xs text-[#3a3a3a] placeholder:text-slate-400 outline-none"
                      placeholder={isUrdu ? 'کیا یہ دکاندار قابل اعتماد ہے؟ اپنی رائے لکھیں۔۔۔' : 'Is this seller reliable? Write honest review...'}
                      value={newComment}
                      onChange={e => setNewComment(e.target.value)}
                      maxLength={500}
                    />
                    <button
                      type="submit"
                      disabled={isSubmittingReview || !newComment.trim()}
                      className="px-4 py-2 bg-[#5a6a5a] hover:bg-[#4d5b4d] disabled:opacity-50 text-white font-bold text-xs rounded-xl transition cursor-pointer shrink-0"
                    >
                      {isSubmittingReview ? '...' : (isUrdu ? 'شائع کریں' : 'Post')}
                    </button>
                  </div>
                </form>

                {/* List of customer reviews */}
                <div className="flex-1 overflow-y-auto max-h-[35vh] space-y-3 pr-1">
                  {reviews.length === 0 ? (
                    <div className="py-12 text-center text-[#707070] space-y-2 bg-white rounded-2xl border border-[#e5e0d8]">
                      <span className="text-3xl text-[#d4a373]">⭐</span>
                      <p className="text-xs font-bold">
                        {isUrdu ? 'ابھی تک کوئی درجہ بندی نہیں کی گئی' : 'No ratings yet'}
                      </p>
                      <p className="text-[10px] text-[#8e8e8e]">
                        {isUrdu ? 'پہلی رائے لکھیں اور اس دکاندار کی ساکھ قائم کریں!' : 'Be the first to review this virtual merchant to build local trust.'}
                      </p>
                    </div>
                  ) : (
                    reviews.map((rev) => (
                      <div key={rev.id} className="p-4 bg-white border border-[#e5e0d8] rounded-2xl space-y-2 relative group hover:border-amber-200 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-[#f4f1ea] flex items-center justify-center text-amber-600 text-xs font-bold">
                              👤
                            </div>
                            <span className="text-xs font-bold text-[#3a3a3a]">{rev.authorName}</span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            {/* Stars badge */}
                            <div className="flex items-center text-amber-500">
                              {Array.from({ length: 5 }).map((_, idx) => (
                                <Star 
                                  key={idx} 
                                  size={10} 
                                  fill={idx < rev.rating ? 'currentColor' : 'none'} 
                                />
                              ))}
                            </div>

                            {/* Delete Option for Author or Admin */}
                            {user && (rev.authorId === user.uid || user.email === "msudaisdurrani87@gmail.com") && (
                              <button
                                onClick={() => handleDeleteReview(rev.id)}
                                className="text-[#8e8e8e] hover:text-red-600 transition p-1 rounded-lg"
                                title={isUrdu ? 'حذف کریں' : 'Delete'}
                              >
                                <Trash2 size={12} />
                              </button>
                            )}
                          </div>
                        </div>

                        <p className="text-xs text-[#525252] leading-relaxed pl-1 italic">
                          "{rev.comment}"
                        </p>
                        
                        <div className="text-[9px] text-[#8e8e8e] text-right font-mono">
                          {new Date(rev.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
