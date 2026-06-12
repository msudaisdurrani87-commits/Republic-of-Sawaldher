/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Listing {
  id: string;
  title: string;
  titleUr: string;
  category: string;
  type: 'sell' | 'rent';
  price: number;
  priceUr: string;
  location: string;
  locationUr: string;
  description: string;
  descriptionUr: string;
  condition: 'new' | 'used';
  imageGradient: string;
  imageEmoji: string;
  sellerName: string;
  sellerPhone: string;
  sellerEmail: string;
  sellerId: string;
  isShopProduct?: boolean;
  shopName?: string;
  shopNameUr?: string;
  offersDelivery?: boolean;
  bulkQuantity?: number;
  createdAt: string;
  views: number;
}

export interface Category {
  id: string;
  name: string;
  nameUr: string;
  iconName: string; // Lucide icon identification
  color: string;    // Tailwind color class
  bgLight: string;  // Tailwind light background
}

export interface Shop {
  id: string;
  name: string;
  nameUr: string;
  ownerName: string;
  ownerId?: string;
  category: string;
  description: string;
  descriptionUr: string;
  logoGradient: string;
  logoEmoji: string;
  phone: string;
  createdAt: string;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
}

export interface ChatSession {
  id: string;       // Typically same as listingId + sellerId
  listingId: string;
  listingTitle: string;
  listingTitleUr: string;
  otherParticipantId: string;
  otherParticipantName: string;
  messages: Message[];
}

export interface UserProfile {
  name: string;
  phone: string;
  email: string;
  avatarGradient: string;
  avatarEmoji: string;
  notificationsOffer: boolean;
  notificationsChat: boolean;
  notificationsEmail: boolean;
  privacyShowPhone: boolean;
  privacyPublicProfile: boolean;
  hasSetupComplete?: boolean;
  favorites?: string[]; // list of favorited listing IDs
}
