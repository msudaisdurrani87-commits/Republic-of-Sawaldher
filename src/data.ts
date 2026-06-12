/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Listing, Category, Shop, ChatSession, UserProfile } from './types';

export const CATEGORIES: Category[] = [
  {
    id: 'all',
    name: 'All Items',
    nameUr: 'تمام چیزیں',
    iconName: 'LayoutGrid',
    color: 'from-amber-500 to-orange-600',
    bgLight: 'bg-amber-50 text-amber-900 border-amber-200'
  },
  {
    id: 'fields',
    name: 'Fields & Agriculture',
    nameUr: 'زرعی کھیت اور زراعت',
    iconName: 'Sprout',
    color: 'from-emerald-600 to-teal-700',
    bgLight: 'bg-emerald-50 text-emerald-900 border-emerald-200'
  },
  {
    id: 'animals',
    name: 'Animals & Livestock',
    nameUr: 'مال مویشی اور جانور',
    iconName: 'Cow',
    color: 'from-amber-600 to-amber-800',
    bgLight: 'bg-amber-50 text-amber-950 border-amber-200'
  },
  {
    id: 'electronics',
    name: 'Electronics',
    nameUr: 'الیکٹرانکس',
    iconName: 'Tv',
    color: 'from-blue-500 to-indigo-600',
    bgLight: 'bg-blue-50 text-blue-900 border-blue-200'
  },
  {
    id: 'house',
    name: 'House & Property',
    nameUr: 'مکان اور پراپرٹی',
    iconName: 'Home',
    color: 'from-rose-500 to-pink-600',
    bgLight: 'bg-rose-50 text-rose-900 border-rose-200'
  },
  {
    id: 'cars',
    name: 'Cars & Vehicles',
    nameUr: 'گاڑیاں اور موٹر سائیکل',
    iconName: 'Car',
    color: 'from-violet-500 to-purple-600',
    bgLight: 'bg-violet-50 text-violet-900 border-violet-200'
  },
  {
    id: 'mobile',
    name: 'Mobile & Used Items',
    nameUr: 'موبائل اور پرانی چیزیں',
    iconName: 'Smartphone',
    color: 'from-cyan-500 to-sky-600',
    bgLight: 'bg-cyan-50 text-cyan-900 border-cyan-200'
  },
  {
    id: 'industrial',
    name: 'Industrial & Materials',
    nameUr: 'تعمیراتی سامان اور میٹریل',
    iconName: 'Hammer',
    color: 'from-orange-700 to-amber-900',
    bgLight: 'bg-stone-100 text-stone-900 border-stone-300'
  }
];

export const INITIAL_SHOPS: Shop[] = [];

export const INITIAL_LISTINGS: Listing[] = [];

export const INITIAL_CHATS: ChatSession[] = [
  {
    id: 'chat_list_3_admin_sudais',
    listingId: 'list_3',
    listingTitle: 'Xiaomi Redmi Note 12 - 8GB / 128GB (10/10 Condition)',
    listingTitleUr: 'موبائل فون ژیومی ریڈمی نوٹ 12 - عمدہ حالت',
    otherParticipantId: 'admin_sudais',
    otherParticipantName: 'Muhammad Sudais Durrani',
    messages: [
      {
        id: 'msg_1',
        senderId: 'user_me',
        senderName: 'You',
        text: 'Assalam-o-Alaikum, is this phone still available?',
        timestamp: '10:15 AM'
      },
      {
        id: 'msg_2',
        senderId: 'admin_sudais',
        senderName: 'Muhammad Sudais Durrani',
        text: 'Walaikum Assalam! Yes, the Redmi Note 12 is available in my shop. You can visit or Whatsapp me at 03369048051.',
        timestamp: '10:18 AM'
      }
    ]
  }
];

export const DEFAULT_USER: UserProfile = {
  name: 'Sawaldher Trader',
  phone: '03001234567',
  email: 'trader@sawaldher.com',
  avatarGradient: 'from-orange-500 to-amber-600',
  avatarEmoji: '👤',
  notificationsOffer: true,
  notificationsChat: true,
  notificationsEmail: false,
  privacyShowPhone: true,
  privacyPublicProfile: false
};
