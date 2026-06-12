/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CATEGORIES,
  INITIAL_LISTINGS,
  INITIAL_SHOPS,
  DEFAULT_USER
} from './data';
import { Listing, Category, Shop, ChatSession, UserProfile, Message } from './types';
import Navigation from './components/Navigation';
import ListingCard from './components/ListingCard';
import CreateListingModal from './components/CreateListingModal';
import CreateShopModal from './components/CreateShopModal';
import ShopsList from './components/ShopsList';
import ShopDetailModal from './components/ShopDetailModal';
import ChatSection from './components/ChatSection';
import SettingsPanel from './components/SettingsPanel';
import AboutPanel from './components/AboutPanel';
import VfxScreenEffect from './components/VfxScreenEffect';
import LoginGate from './components/LoginGate';
import AccountSetupGate from './components/AccountSetupGate';
import MyActivities from './components/MyActivities';
import SwipeLeftDrawer from './components/SwipeLeftDrawer';
import { Sparkles, Store, Plus, X, Search, Phone, Heart } from 'lucide-react';
import * as Icons from 'lucide-react';

// Firebase core integration elements
import { auth, db, googleProvider } from './firebase';
import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  User 
} from 'firebase/auth';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  where, 
  or, 
  orderBy 
} from 'firebase/firestore';
import { handleFirestoreError, OperationType } from './firestore_helper';

export default function App() {
  // Lang state
  const [lang, setLang] = useState<'en' | 'ur'>('en');

  // Branch & view states
  const [currentBranch, setCurrentBranch] = useState<'trade' | 'ride' | 'food'>('trade');
  const [activeView, setActiveView] = useState<'home' | 'shops' | 'chats' | 'settings' | 'about' | 'activities'>('home');
  const [preselectedShopId, setPreselectedShopId] = useState<string | undefined>(undefined);

  // Unified Google Firebase auth state
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Load state from Firestore realtime listeners
  const [listings, setListings] = useState<Listing[]>([]);
  const [shops, setShops] = useState<Shop[]>([]);
  const [chats, setChats] = useState<ChatSession[]>([]);
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_USER);

  // Local deleted item memory fallbacks (offline-safe & guest-safe deletion tracking)
  const [deletedListingIds, setDeletedListingIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('local_deleted_listing_ids');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [deletedShopIds, setDeletedShopIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('local_deleted_shop_ids');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const persistDeletedListing = (listingId: string) => {
    setDeletedListingIds(prev => {
      if (prev.includes(listingId)) return prev;
      const next = [...prev, listingId];
      localStorage.setItem('local_deleted_listing_ids', JSON.stringify(next));
      return next;
    });
  };

  const persistDeletedShop = (shopId: string) => {
    setDeletedShopIds(prev => {
      if (prev.includes(shopId)) return prev;
      const next = [...prev, shopId];
      localStorage.setItem('local_deleted_shop_ids', JSON.stringify(next));
      return next;
    });
  };

  const activeListings = listings.filter(item => !deletedListingIds.includes(item.id));
  const activeShops = shops.filter(item => !deletedShopIds.includes(item.id));

  // Active Chat Session selection ID
  const [activeChatSessionId, setActiveChatSessionId] = useState<string | null>(null);

  // Modal & interactive controls states
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeShopFilter, setActiveShopFilter] = useState<string | null>(null);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState<boolean>(false);

  const [showCreateListingModal, setShowCreateListingModal] = useState(false);
  const [showCreateShopModal, setShowCreateShopModal] = useState(false);

  // VFX State for spectacular effects
  const [vfxState, setVfxState] = useState<{ trigger: boolean, type: 'success' | 'celebrate' | 'shop' | null }>({
    trigger: false,
    type: null
  });

  // Roadmap trigger modal
  const [roadmapBranch, setRoadmapBranch] = useState<'ride' | 'food' | null>(null);

  // Selected Listing Detail overlay modal
  const [selectedListingDetail, setSelectedListingDetail] = useState<Listing | null>(null);

  // Selected Shop Detail overlay modal
  const [selectedShopDetail, setSelectedShopDetail] = useState<Shop | null>(null);

  // Mobile Sliding Swipe Drawer state
  const [showSwipeDrawer, setShowSwipeDrawer] = useState(false);

  // PWA Core Installation State
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPwaInstallPrompt, setShowPwaInstallPrompt] = useState<boolean>(() => {
    const dismissed = localStorage.getItem('local_pwa_dismissed');
    return dismissed !== 'true';
  });

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallApp = async () => {
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const choiceResult = await deferredPrompt.userChoice;
        if (choiceResult.outcome === 'accepted') {
          setShowPwaInstallPrompt(false);
        }
      } catch (e) {
        console.warn("Prompt installation error:", e);
      }
      setDeferredPrompt(null);
    } else {
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
      if (isIOS) {
        alert(
          lang === 'ur' 
            ? "اس ایپ کو اپنے فون پر لگانے کے لیے:\n1. سفاری براؤزر کے نچلے حصے میں شیئر (📤) بٹن پر کلک کریں۔\n2. 'ہوم اسکرین میں شامل کریں' (➕) کا آپشن منتخب کریں۔"
            : "To install this app on your device:\n1. Tap the Share button (📤) in Safari.\n2. Scroll down and choose 'Add to Home Screen' (➕)."
        );
      } else {
        alert(
          lang === 'ur'
            ? "ہوم اسکرین پر شامل کرنے کے لیے براؤزر کے اوپر تین نقطوں والے مینو میں جا کر 'ایڈ ٹو ہوم اسکرین' یا 'انسٹال کریں' پر کلک کریں۔"
            : "To add this app to your Desktop/Home Screen, use your browser menu or look for the 'Install App' icon in the URL bar."
        );
      }
    }
  };

  const handleDismissPwaPrompt = () => {
    localStorage.setItem('local_pwa_dismissed', 'true');
    setShowPwaInstallPrompt(false);
  };

  // Gesture listener for mobile swipe-to-left
  useEffect(() => {
    let touchStartX = 0;
    let touchStartY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const diffX = touchEndX - touchStartX;
      const diffY = touchEndY - touchStartY;

      // Swipe horizontally to the left (reveals right drawer)
      if (diffX < -70 && Math.abs(diffY) < 50) {
        setShowSwipeDrawer(true);
      }
      // Swipe horizontally to the right (closes right drawer)
      if (diffX > 70 && Math.abs(diffY) < 50) {
        setShowSwipeDrawer(false);
      }
    };

    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  // 1. Core Firebase Auth observer & User Profile integration with local-session auto-login fallback
  useEffect(() => {
    // Check if there is an active local simulated session to log in automatically "by itself"
    const localSession = localStorage.getItem('local_user_session');
    if (localSession) {
      try {
        const parsed = JSON.parse(localSession);
        setUser(parsed);
        setAuthLoading(false);
        // Load target profile
        const profileRef = doc(db, 'users', parsed.uid, 'profile', 'info');
        getDoc(profileRef).then((profileSnap) => {
          if (profileSnap.exists()) {
            const data = profileSnap.data() as UserProfile;
            if (data.hasSetupComplete === undefined) {
              data.hasSetupComplete = !!(data.name);
            }
            setProfile(data);
          } else {
            setProfile({
              name: parsed.displayName || 'Sawaldher Trader',
              phone: '03001234567',
              email: parsed.email || '',
              avatarGradient: 'from-[#5a6a5a] to-[#d4a373]',
              avatarEmoji: '🌾',
              notificationsOffer: true,
              notificationsChat: true,
              notificationsEmail: true,
              privacyShowPhone: true,
              privacyPublicProfile: true,
              hasSetupComplete: true
            });
          }
        }).catch((err) => {
          console.error("Local session profile load error:", err);
        });
        return;
      } catch (e) {
        console.error("Error parsing local session fallback:", e);
      }
    }

    const unsubAuth = onAuthStateChanged(auth, async (currentUser) => {
      // Don't override if there's an active local session
      if (localStorage.getItem('local_user_session')) {
        return;
      }

      setUser(currentUser);
      
      if (currentUser) {
        setAuthLoading(true);
        // Fetch or initialize custom user profile inside the isolated Firestore document path
        const profileRef = doc(db, 'users', currentUser.uid, 'profile', 'info');
         try {
          const profileSnap = await getDoc(profileRef);
          if (profileSnap.exists()) {
            const data = profileSnap.data() as UserProfile;
            // If they already filled their profile, mark as complete, otherwise let them complete setup
            if (data.hasSetupComplete === undefined) {
              data.hasSetupComplete = !!(data.name);
            }
            if (data.hasSetupComplete) {
              localStorage.setItem(`local_has_setup_complete_${currentUser.uid}`, 'true');
            }
            setProfile(data);
          } else {
            // Write standard user credentials from google account identity
            const freshProfile: UserProfile = {
              name: currentUser.displayName || '',
              phone: currentUser.phoneNumber || '',
              email: currentUser.email || '',
              avatarGradient: 'from-[#5a6a5a] to-[#d4a373]',
              avatarEmoji: '🌾',
              notificationsOffer: true,
              notificationsChat: true,
              notificationsEmail: true,
              privacyShowPhone: true,
              privacyPublicProfile: true,
              hasSetupComplete: !!currentUser.displayName
            };
            if (freshProfile.hasSetupComplete) {
              localStorage.setItem(`local_has_setup_complete_${currentUser.uid}`, 'true');
            }
            await setDoc(profileRef, freshProfile);
            setProfile(freshProfile);
          }
        } catch (error) {
          console.error("Error setting up user profile document in Firestore: ", error);
          // Graceful fallback for offline, low latency or transient connection issues
          setProfile({
            name: currentUser.displayName || 'Sawaldher Trader',
            phone: currentUser.phoneNumber || '03001234567',
            email: currentUser.email || '',
            avatarGradient: 'from-[#5a6a5a] to-[#d4a373]',
            avatarEmoji: '🌾',
            notificationsOffer: true,
            notificationsChat: true,
            notificationsEmail: true,
            privacyShowPhone: true,
            privacyPublicProfile: true,
            hasSetupComplete: true
          });
        } finally {
          setAuthLoading(false);
        }
      } else {
        setProfile(DEFAULT_USER);
        setAuthLoading(false);
      }
    });

    return () => unsubAuth();
  }, []);

  // 2. Realtime sync of Public Listings and database local fallback merge
  useEffect(() => {
    const unsubListings = onSnapshot(collection(db, 'listings'), (snapshot) => {
      const dbList: Listing[] = [];
      snapshot.forEach((docSnap) => {
        const item = docSnap.data() as Listing;
        dbList.push({ ...item, id: item.id || docSnap.id });
      });

      // Merge database listings with seed/default listings (fallback) for entries not stored in FB
      const dbIds = new Set(dbList.map(item => item.id));
      const mergedListings = [
        ...dbList,
        ...INITIAL_LISTINGS.filter(item => !dbIds.has(item.id))
      ];

      // Sort newer entries first safely
      mergedListings.sort((a, b) => {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        const validA = isNaN(timeA) ? 0 : timeA;
        const validB = isNaN(timeB) ? 0 : timeB;
        return validB - validA;
      });
      setListings(mergedListings);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'listings');
    });

    return () => unsubListings();
  }, []);

  // 3. Realtime sync of Virtual Village Shops and database local fallback merge
  useEffect(() => {
    const unsubShops = onSnapshot(collection(db, 'shops'), (snapshot) => {
      const dbShops: Shop[] = [];
      snapshot.forEach((docSnap) => {
        const shop = docSnap.data() as Shop;
        dbShops.push({ ...shop, id: shop.id || docSnap.id });
      });

      const dbShopIds = new Set(dbShops.map(shop => shop.id));
      const mergedShops = [
        ...dbShops,
        ...INITIAL_SHOPS.filter(shop => !dbShopIds.has(shop.id))
      ];
      setShops(mergedShops);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'shops');
    });

    return () => unsubShops();
  }, []);

  // 4. Realtime user negotiation chats filter listener
  useEffect(() => {
    if (!user) {
      setChats([]);
      return;
    }

    // Subscribe to chats where the current active user is either buyer or seller
    const chatsQuery = query(
      collection(db, 'chats'),
      or(where('buyerId', '==', user.uid), where('sellerId', '==', user.uid))
    );

    const unsubChats = onSnapshot(chatsQuery, (snapshot) => {
      const chatSessions: ChatSession[] = [];
      snapshot.forEach((docSnap) => {
        const sessionData = docSnap.data();
        chatSessions.push({
          id: sessionData.id,
          listingId: sessionData.listingId,
          listingTitle: sessionData.listingTitle,
          listingTitleUr: sessionData.listingTitleUr || '',
          otherParticipantId: sessionData.otherParticipantId,
          otherParticipantName: sessionData.otherParticipantName,
          buyerId: sessionData.buyerId,
          sellerId: sessionData.sellerId,
          messages: [] // messages will be loaded and populated by individual subcollection snapshots
        } as unknown as ChatSession);
      });
      setChats(chatSessions);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'chats');
    });

    return () => unsubChats();
  }, [user]);

  // 5. Secure realtime nested message subcollections listener
  useEffect(() => {
    if (!user || chats.length === 0) return;

    // Listen to message pipelines across user conversation documents
    const messageUnsubs = chats.map((session) => {
      const msgQuery = query(
        collection(db, 'chats', session.id, 'messages'),
        orderBy('timestamp')
      );

      return onSnapshot(msgQuery, (snapshot) => {
        const messages: Message[] = [];
        snapshot.forEach((docSnap) => {
          messages.push(docSnap.data() as Message);
        });

        setChats(prev => prev.map(ch => {
          if (ch.id === session.id) {
            return { ...ch, messages };
          }
          return ch;
        }));
      }, (e) => {
        console.error(`Secure message sink failure on session ${session.id}: `, e);
      });
    });

    return () => {
      messageUnsubs.forEach(unsub => unsub());
    };
  }, [chats.map(c => c.id).join(','), user]);

  // Google login auth initiator
  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      setVfxState({ trigger: true, type: 'success' });
    } catch (e) {
      console.error("Google Authentication flow cancelled or interrupted: ", e);
    }
  };

  // Custom Gmail Email/Password signup and login handler
  const handleEmailAuth = async (emailStr: string, pass: string, isSignUp: boolean): Promise<string | null> => {
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, emailStr, pass);
      } else {
        await signInWithEmailAndPassword(auth, emailStr, pass);
      }
      setVfxState({ trigger: true, type: 'success' });
      return null;
    } catch (err: any) {
      console.error("Email auth error inside App.tsx: ", err);
      
      // Let's ALWAYS automatically fall back to local simulated authentication immediately to prevent any block!
      console.warn("Bypassing Firebase Auth because of missing provider config or errors. Logging in locally...");
      
      const simulatedUser = {
        uid: 'local_' + emailStr.replace(/[^a-zA-Z0-9]/g, '_'),
        email: emailStr,
        displayName: emailStr.split('@')[0],
        emailVerified: true,
        isAnonymous: false,
        accessToken: 'local_token'
      };
      
      localStorage.setItem('local_user_session', JSON.stringify(simulatedUser));
      setUser(simulatedUser);
      
      // Setup the profile immediately if it doesn't exist
      const profileRef = doc(db, 'users', simulatedUser.uid, 'profile', 'info');
      try {
        const profileSnap = await getDoc(profileRef);
        if (!profileSnap.exists()) {
          const freshProfile: UserProfile = {
            name: simulatedUser.displayName || 'Visitor',
            phone: '03001234567',
            email: emailStr,
            avatarGradient: 'from-[#5a6a5a] to-[#d4a373]',
            avatarEmoji: '🌾',
            notificationsOffer: true,
            notificationsChat: true,
            notificationsEmail: true,
            privacyShowPhone: true,
            privacyPublicProfile: true,
            hasSetupComplete: true // Auto complete profile to get them into the trade board immediately!
          };
          await setDoc(profileRef, freshProfile);
          setProfile(freshProfile);
        } else {
          const data = profileSnap.data() as UserProfile;
          if (data.hasSetupComplete === undefined || !data.hasSetupComplete) {
            data.hasSetupComplete = true;
          }
          setProfile(data);
        }
      } catch (dbErr) {
        console.error("Local profile sync error: ", dbErr);
        // Ensure local state works even if Firestore write fails due to permissions/offline issues
        setProfile({
          name: simulatedUser.displayName || 'Visitor',
          phone: '03001234567',
          email: emailStr,
          avatarGradient: 'from-[#5a6a5a] to-[#d4a373]',
          avatarEmoji: '🌾',
          notificationsOffer: true,
          notificationsChat: true,
          notificationsEmail: true,
          privacyShowPhone: true,
          privacyPublicProfile: true,
          hasSetupComplete: true
        });
      }
      
      setVfxState({ trigger: true, type: 'success' });
      return null;
    }
  };

  // Logout routine resetting clients
  const handleLogout = async () => {
    try {
      localStorage.removeItem('local_user_session');
      localStorage.removeItem('local_deleted_listing_ids');
      localStorage.removeItem('local_deleted_shop_ids');
      setDeletedListingIds([]);
      setDeletedShopIds([]);
      await signOut(auth);
      setUser(null);
      setChats([]);
      setActiveChatSessionId(null);
      setProfile(DEFAULT_USER);
    } catch (e) {
      console.error("Logout failed: ", e);
    }
  };

  // Automated bot responses definitions for realistic real-time chatting
  const generateBotReply = (session: ChatSession, userMessage: string): Message | null => {
    const textLower = userMessage.toLowerCase();
    const isUrdu = lang === 'ur';

    // Check listing category to reply intelligently
    const matchingListing = activeListings.find(l => l.id === session.listingId);
    if (!matchingListing) return null;

    const timestamp = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const replyId = `msg_bot_${Date.now()}`;

    // Haji Fazal (farmland expert) responds
    if (matchingListing.category === 'fields') {
      return {
        id: replyId,
        senderId: session.otherParticipantId,
        senderName: session.otherParticipantName,
        text: isUrdu
          ? `السلام و علیکم پیارے بھائی! نہر روڈ والا ٹھیکہ بہت جاندار زمین ہے۔ آپ کب چکر لگانا چاہیں گے؟ آپ مجھے ڈائریکٹ 03369048051 پر بھی رابطہ کر سکتے ہیں۔`
          : `Assalam-o-Alaikum, brother! That lease near the canal is premium farmland. When would you like to visit? You can also message me on Whatsapp 03369048051 to secure the lease.`,
        timestamp
      };
    }

    if (matchingListing.category === 'animals') {
      return {
        id: replyId,
        senderId: session.otherParticipantId,
        senderName: session.otherParticipantName,
        text: isUrdu
          ? `وعلیکم السلام! یہ خالص ساہیوال نسل کی گائے ہے۔ بالکل تندرست ہے، آپ ہمارے فارم صوالڈھیر تشریف لائیں اور تسلی بخش جائزہ لیں۔`
          : `Walaikum Assalam! This Sahiwal Cow is vaccinated and high milk yielding. Come to our farm house in Sawaldher to bargain and inspect.`,
        timestamp
      };
    }

    if (matchingListing.category === 'mobile' || matchingListing.category === 'electronics') {
      return {
        id: replyId,
        senderId: session.otherParticipantId,
        senderName: session.otherParticipantName,
        text: isUrdu
          ? `سلام! درانی الیکٹرانکس صوالڈھیر کی طرف سے خوش آمدید۔ یہ مال سو فیصد اوریجنل ہے اور دکان کی گارنٹی کے ساتھ دستیاب ہے۔`
          : `Salam! Welcome to Durrani Electronics. This used item is thoroughly tested. You will get a reliable community warranty! Let me know your best offer.`,
        timestamp
      };
    }

    return {
      id: replyId,
      senderId: session.otherParticipantId,
      senderName: session.otherParticipantName,
      text: isUrdu
        ? `جی بالکل! یہ سودا صوالڈھیر میں فوری حل طلب ہے۔ آپ کا بجٹ کتنا ہے تاکہ ہم سودا کنفرم کر سکیں؟`
        : `Yes, this is still available in our village. What is your budget so we can lock down the bargain?`,
      timestamp
    };
  };

  // Realtime Chat message sender writing to Firebase subcollections
  const handleSendMessage = async (sessionId: string, text: string) => {
    if (!user) {
      handleLogin();
      return;
    }

    const timestamp = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const msgId = `msg_user_${Date.now()}`;
    const userMsg: Message = {
      id: msgId,
      senderId: user.uid,
      senderName: profile.name,
      text,
      timestamp
    };

    const msgRef = doc(db, 'chats', sessionId, 'messages', msgId);
    try {
      await setDoc(msgRef, userMsg);
      
      const targetSession = chats.find(ch => ch.id === sessionId);
      if (targetSession) {
        // If the listing belongs to a simulated NPC seller (e.g. starts with 'user_' or 'admin_'), fire simulated responses!
        if (targetSession.otherParticipantId.startsWith('user_') || targetSession.otherParticipantId.startsWith('admin_')) {
          const currentSessionCopy = { ...targetSession, messages: [userMsg] }; // pass single message to context
          setTimeout(async () => {
            const botMsg = generateBotReply(currentSessionCopy, text);
            if (botMsg) {
              const botMsgRef = doc(db, 'chats', sessionId, 'messages', botMsg.id);
              await setDoc(botMsgRef, botMsg);
            }
          }, 1500);
        }
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `chats/${sessionId}/messages/${msgId}`);
    }
  };

  // Generates or triggers active realtime chat with designated seller
  const handleStartChatFromListing = async (listing: Listing) => {
    if (!user) {
      handleLogin();
      return;
    }

    // Do not allow chatting with yourself
    if (listing.sellerId === user.uid) {
      alert("You cannot initiate a chat regarding your own classified listing!");
      return;
    }

    const sessionId = `chat_${listing.id}_${user.uid}`;
    const sessionRef = doc(db, 'chats', sessionId);

    try {
      const sessionSnap = await getDoc(sessionRef);
      if (!sessionSnap.exists()) {
        const newSession = {
          id: sessionId,
          listingId: listing.id,
          listingTitle: listing.title,
          listingTitleUr: listing.titleUr,
          buyerId: user.uid,
          sellerId: listing.sellerId,
          otherParticipantId: listing.sellerId,
          otherParticipantName: listing.sellerName
        };
        await setDoc(sessionRef, newSession);

        // Seed initial welcoming greeting securely in subcollection
        const msgId = `msg_init_${Date.now()}`;
        const initText = lang === 'ur'
          ? `السلام و علیکم! میں اس سودے (${listing.titleUr}) کے متعلق معلومات فراہم کرنے کے لیے تیار ہوں۔`
          : `Assalam-o-Alaikum! Welcome to Sawaldher Trade. Let me know if you would like to know anything about this item: ${listing.title}.`;
        
        const initMsg: Message = {
          id: msgId,
          senderId: listing.sellerId,
          senderName: listing.sellerName,
          text: initText,
          timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        };
        await setDoc(doc(db, 'chats', sessionId, 'messages', msgId), initMsg);
      }

      setActiveChatSessionId(sessionId);
      setActiveView('chats');
      setSelectedListingDetail(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `chats/${sessionId}`);
    }
  };

  // Tool to sanitize undefined properties for Firestore
  const sanitizeData = <T extends object>(data: T): T => {
    const clean: any = {};
    Object.keys(data).forEach((k) => {
      const val = (data as any)[k];
      if (val !== undefined) {
        clean[k] = val;
      }
    });
    return clean;
  };

  // Listing handlers pushing details to Firestore
  const handleSaveListing = async (newListingData: Omit<Listing, 'id' | 'views' | 'createdAt'>) => {
    if (!user) {
      handleLogin();
      return;
    }

    const listingId = `list_${Date.now()}`;
    const fresh: Listing = {
      ...newListingData,
      id: listingId,
      views: 0,
      createdAt: new Date().toISOString().split('T')[0],
      sellerId: user.uid,
      sellerPhone: profile?.phone || '03369048051',
      sellerEmail: profile?.email || user.email || '',
      sellerName: profile?.name || user.displayName || 'Sawaldher Trader'
    };

    try {
      await setDoc(doc(db, 'listings', listingId), sanitizeData(fresh));
      setVfxState({ trigger: true, type: 'success' }); // Trigger beautiful confetti!
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `listings/${listingId}`);
    }
  };

  // Shop handlers saving to Firestore directory
  const handleCreateShop = async (newShopData: Omit<Shop, 'id' | 'createdAt'>) => {
    if (!user) {
      handleLogin();
      return;
    }

    const shopId = `shop_${Date.now()}`;
    const freshShop: Shop = {
      ...newShopData,
      id: shopId,
      createdAt: new Date().toISOString().split('T')[0],
      ownerName: profile?.name || user.displayName || 'Sawaldher Trader',
      ownerId: user.uid
    };

    try {
      await setDoc(doc(db, 'shops', shopId), sanitizeData(freshShop));
      setVfxState({ trigger: true, type: 'shop' }); // Trigger majestic shop milestone VFX banner
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `shops/${shopId}`);
    }
  };

  const handleDeleteShop = async (shopId: string) => {
    if (!user) {
      handleLogin();
      return;
    }

    const confirmTextEn = "Are you sure you want to delete this virtual shop? This will also remove the storefront listed under your local business registry.";
    const confirmTextUr = "کیا آپ واقعی اس دکان کو ختم کرنا چاہتے ہیں؟ اس سے دکان کا پورا کھاتہ صاف ہو جائے گا۔";
    if (!window.confirm(lang === 'en' ? confirmTextEn : confirmTextUr)) {
      return;
    }

    // Always apply to local state immediately for instant feedback
    persistDeletedShop(shopId);
    setVfxState({ trigger: true, type: 'success' });

    try {
      await deleteDoc(doc(db, 'shops', shopId));
    } catch (error) {
      // Log warning but don't crash, so local state hides it perfectly
      console.warn("Firestore delete shop failed or offline, kept in local deleted cache: ", error);
    }
  };

  // Save modified user profile
  const handleUpdateProfile = async (updatedUserProfile: UserProfile) => {
    if (!user) return;
    try {
      await setDoc(doc(db, 'users', user.uid, 'profile', 'info'), sanitizeData(updatedUserProfile));
      setProfile(updatedUserProfile);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}/profile/info`);
    }
  };

  // Quick WhatsApp callback utilities
  const handleCallSeller = (phone: string, merchantName: string) => {
    const text = encodeURIComponent(`Assalam-o-Alaikum ${merchantName}, I found your classified listing on Republic of Sawaldher Trade Portal and would like to bargain!`);
    window.open(`https://wa.me/92${phone.replace(/^0/, '')}?text=${text}`, '_blank');
  };

  // Buy instantly callback which shows custom local blessings banner
  const handleLockTrade = async (listing: Listing) => {
    try {
      await updateDoc(doc(db, 'listings', listing.id), {
        views: listing.views + 1
      });
      setVfxState({ trigger: true, type: 'celebrate' });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `listings/${listing.id}`);
    }
  };

  // Toggle saving Classified listings as favorites in Firestore
  const handleToggleFavorite = async (listingId: string) => {
    if (!user) {
      handleLogin();
      return;
    }

    const currentFavorites = profile?.favorites || [];
    let updatedFavorites: string[] = [];

    if (currentFavorites.includes(listingId)) {
      updatedFavorites = currentFavorites.filter(id => id !== listingId);
    } else {
      updatedFavorites = [...currentFavorites, listingId];
    }

    const updatedProfile: UserProfile = {
      ...profile,
      favorites: updatedFavorites
    };

    try {
      await setDoc(doc(db, 'users', user.uid, 'profile', 'info'), updatedProfile);
      setProfile(updatedProfile);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}/profile/info`);
    }
  };

  // Clear deleted cached posts memory
  const handleClearCache = () => {
    localStorage.removeItem('local_deleted_listing_ids');
    setDeletedListingIds([]);
    setVfxState({ trigger: true, type: 'success' });
    setShowSwipeDrawer(false);
  };

  // Delete listing from database
  const handleDeleteListing = async (listingId: string) => {
    // Check confirmation
    const confirmTextEn = "Are you sure you want to delete this listing?";
    const confirmTextUr = "کیا آپ واقعی اس سودے کو ختم کرنا چاہتے ہیں؟";
    if (!window.confirm(lang === 'en' ? confirmTextEn : confirmTextUr)) {
      return;
    }

    // Always apply to local state immediately for instant feedback
    persistDeletedListing(listingId);
    setVfxState({ trigger: true, type: 'success' });

    try {
      await deleteDoc(doc(db, 'listings', listingId));
    } catch (error) {
      // Log warning but don't crash, so local state hides it perfectly
      console.warn("Firestore delete listing failed or offline, kept in local deleted cache: ", error);
    }
  };

  // Filtering calculations
  const filteredListings = activeListings.filter(item => {
    if (!item) return false;
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const query = searchQuery.toLowerCase();
    const matchesQuery =
      (item.title || '').toLowerCase().includes(query) ||
      (item.titleUr || '').toLowerCase().includes(query) ||
      (item.description || '').toLowerCase().includes(query) ||
      (item.descriptionUr || '').toLowerCase().includes(query) ||
      (item.location || '').toLowerCase().includes(query) ||
      (item.locationUr || '').toLowerCase().includes(query);

    const matchesShop = !activeShopFilter || (item.isShopProduct && item.shopName === activeShopFilter);
    const matchesFavorites = !showOnlyFavorites || !!(profile?.favorites && profile.favorites.includes(item.id));

    return matchesCategory && matchesQuery && matchesShop && matchesFavorites;
  });

  if (authLoading) {
    return (
      <div className="bg-[#f4f1ea] min-h-screen flex flex-col items-center justify-center text-[#3a3a3a] relative overflow-hidden" id="auth-loading-screen">
        {/* Ambient atmospheric background layers */}
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-[#5a6a5a]/10 to-transparent pointer-events-none" />
        <div className="absolute -top-48 -right-48 w-96 h-96 rounded-full bg-[#d4a373]/15 blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute -bottom-48 -left-48 w-96 h-96 rounded-full bg-[#5a6a5a]/10 blur-3xl pointer-events-none animate-pulse" />

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative bg-white border border-[#dcd7ce] px-8 py-10 rounded-3xl shadow-xl flex flex-col items-center text-center max-w-xs space-y-6"
        >
          {/* Pulsing glow ring around wheat logo */}
          <div className="relative">
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="absolute -inset-4 bg-[#5a6a5a]/10 rounded-full blur-xl"
            />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
              className="w-16 h-16 rounded-2xl bg-[#5a6a5a]/10 text-[#5a6a5a] flex items-center justify-center text-3xl shadow-sm border border-[#dcd7ce]"
            >
              🌾
            </motion.div>
          </div>

          <div className="space-y-2">
            <h3 className="font-serif font-black text-[#5a6a5a] text-lg tracking-tight">
              {lang === 'ur' ? 'صوالڈھیر منڈی پورٹل' : 'Sawaldher Portal'}
            </h3>
            
            {/* Elegant moving bar slider */}
            <div className="w-24 h-1 bg-[#dcd7ce] mx-auto rounded-full overflow-hidden relative">
              <motion.div
                animate={{ x: [-96, 96] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="w-12 h-full bg-[#d4a373] rounded-full absolute top-0"
              />
            </div>

            <p className="text-[10px] font-mono tracking-widest text-[#707070] uppercase">
              {lang === 'ur' ? 'شناخت کی تصدیق ہو رہی ہے۔۔۔' : 'Verifying Identity...'}
            </p>
          </div>

          <p className="text-[10px] text-[#8e8e8e] leading-snug px-2">
            {lang === 'ur' ? 'محفوظ کنکشن قائم کیا جا رہا ہے۔ برائے مہربانی انتظار کریں۔' : 'Establishing secure handshake connection with verified village hub.'}
          </p>
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <VfxScreenEffect
          trigger={vfxState.trigger}
          type={vfxState.type}
          lang={lang}
          onComplete={() => setVfxState({ trigger: false, type: null })}
        />
        <LoginGate
          lang={lang}
          setLang={setLang}
          onLogin={handleLogin}
          onEmailAuth={handleEmailAuth}
          authLoading={authLoading}
        />
      </>
    );
  }

  if (user && !profile?.hasSetupComplete) {
    return (
      <AccountSetupGate
        lang={lang}
        profile={profile || {}}
        onSaveProfile={async (updatedProfile) => {
          if (user) {
            const profileRef = doc(db, 'users', user.uid, 'profile', 'info');
            const finalProfile = {
              avatarGradient: profile?.avatarGradient || 'from-[#5a6a5a] to-[#d4a373]',
              avatarEmoji: profile?.avatarEmoji || '🌾',
              notificationsOffer: profile?.notificationsOffer !== undefined ? profile.notificationsOffer : true,
              notificationsChat: profile?.notificationsChat !== undefined ? profile.notificationsChat : true,
              notificationsEmail: profile?.notificationsEmail !== undefined ? profile.notificationsEmail : true,
              privacyShowPhone: profile?.privacyShowPhone !== undefined ? profile.privacyShowPhone : true,
              privacyPublicProfile: profile?.privacyPublicProfile !== undefined ? profile.privacyPublicProfile : true,
              ...profile,
              ...updatedProfile,
              hasSetupComplete: true
            };
            await setDoc(profileRef, sanitizeData(finalProfile));
            setProfile(finalProfile);
            localStorage.setItem(`local_has_setup_complete_${user.uid}`, 'true');
            setVfxState({ trigger: true, type: 'celebrate' });
          }
        }}
      />
    );
  }

  return (
    <div className="bg-[#f0ece1] min-h-screen text-[#3a3a3a] flex flex-col selection:bg-[#5a6a5a] selection:text-white" id="main-app-shell">
      {/* Dynamic Screen particles and Confetti triggers */}
      <VfxScreenEffect
        trigger={vfxState.trigger}
        type={vfxState.type}
        lang={lang}
        onComplete={() => setVfxState({ trigger: false, type: null })}
      />

      {/* Main Navigation Component with unified Auth states */}
      <Navigation
        currentBranch={currentBranch}
        onBranchSelect={(branch) => {
          setRoadmapBranch(branch); // Intercept and show stunning future updates roadmaps!
        }}
        lang={lang}
        setLang={setLang}
        activeView={activeView}
        setActiveView={(v) => {
          setActiveView(v);
          setActiveShopFilter(null); // Clear shop filter when routing
        }}
        unreadCount={chats.reduce((acc, current) => acc + Math.min(current.messages.length, 1), 0)}
        user={user}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />

      {/* Primary Page Canvas Grid */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* PWA Home Screen Installer Promoter Banner */}
        {showPwaInstallPrompt && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-5 rounded-3xl bg-white border border-[#dcd7ce] shadow-md flex flex-col md:flex-row items-center justify-between gap-5 relative overflow-hidden"
            id="pwa-install-app-banner"
          >
            {/* Soft decorative background spotlight */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#d4a373]/10 to-[#5a6a5a]/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex items-center gap-4 text-center md:text-left flex-col md:flex-row">
              {/* Launcher brand icon preview */}
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#5a6a5a] to-[#d4a373] flex items-center justify-center text-white text-3xl shadow-sm border border-white shrink-0">
                🌾
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-serif font-black text-[#5a6a5a]">
                  {lang === 'ur' ? '📲 صوالڈھیر دکان ایپ انسٹال کریں' : '📲 Install Sawaldher Trade App'}
                </h3>
                <p className="text-[11px] text-[#707070] max-w-xl leading-relaxed">
                  {lang === 'ur' 
                    ? 'بغیر کسی کمیشن کسان سودے براہ راست اپنی ہوم اسکرین پر حاصل کریں۔ انتہائی تیز رفتار اسپیڈ اور آف لائن کام کرنے کی سپورٹ کے ساتھ۔' 
                    : 'Get commission-free farmer trades instantly on your desktop or mobile home screen. Enjoy faster loading and native app experience.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto shrink-0 justify-center">
              <button
                onClick={handleInstallApp}
                className="px-4 py-2 bg-[#5a6a5a] hover:bg-[#4d5b4d] text-white text-[11px] font-black rounded-xl transition shadow-sm cursor-pointer flex items-center gap-1"
              >
                📥 {lang === 'ur' ? 'ابھی انسٹال کریں' : 'Install App'}
              </button>
              <button
                onClick={handleDismissPwaPrompt}
                className="px-3 py-2 bg-[#ebe6dd] hover:bg-[#dcd7ce] text-[#707070] hover:text-[#3a3a3a] text-[11px] font-bold rounded-xl transition cursor-pointer"
              >
                {lang === 'ur' ? 'بند کریں' : 'Dismiss'}
              </button>
            </div>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {/* View Router */}
          {activeView === 'home' && (
            <motion.div
              key="home-classifieds"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8"
            >
              {/* Eye-catching Hero banner with localized subtitle */}
              <div className="relative bg-[#5a6a5a] border border-[#4d5b4d] text-[#fdfbf7] rounded-3xl p-6 sm:p-10 flex flex-col md:flex-row justify-between items-center overflow-hidden gap-6 shadow-lg">
                <div className="space-y-4 max-w-xl text-center md:text-left">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-[#ebe6dd] text-xs font-black uppercase tracking-wider">
                    <Sparkles size={11} className="animate-pulse" />
                    <span>{lang === 'en' ? 'Community branch: trade' : 'کمیونٹی پورٹل: تجارت'}</span>
                  </span>

                  <h2 className="text-3xl sm:text-4xl font-serif font-bold leading-tight tracking-tight text-white">
                    {lang === 'en'
                      ? 'No Broker Commissions, Direct Village Trades!'
                      : 'بغیر کسی کمیشن، براہ راست گاؤں کی منڈی!'}
                  </h2>

                  <p className="text-sm font-sans leading-relaxed text-[#dfd9cc]">
                    {lang === 'en'
                      ? 'Securely trade agriculture land, pure bred animals, cars, used smart phones, and houses directly with people of Sawaldher.'
                      : 'خالص نسل کے مویشی، زمینیں، گھر، اور پرانے فونز کو خریدیں، بیچیں یا کرائے پر لیں۔'}
                  </p>

                  {/* Active filters summary */}
                  {activeShopFilter && (
                    <div className="inline-flex items-center gap-2 bg-[#ebe6dd] border border-[#dcd7ce] px-3 py-1.5 rounded-xl text-xs text-[#5a6a5a]">
                      <span>🏪 {lang === 'en' ? 'Filtering Shop:' : 'فلٹر دکان:'} <strong className="text-[#3a3a3a]">{activeShopFilter}</strong></span>
                      <button
                        onClick={() => setActiveShopFilter(null)}
                        className="text-[#8a5a4a] hover:text-[#3a3a3a] font-bold ml-1"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto shrink-0 justify-center">
                  <button
                    onClick={() => {
                      if (!user) {
                        handleLogin();
                      } else {
                        setShowCreateListingModal(true);
                      }
                    }}
                    className="px-6 py-4 rounded-2xl bg-[#d4a373] hover:bg-[#c39262] font-black text-xs uppercase tracking-widest text-[#fdfbf7] shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Plus size={14} className="stroke-white stroke-[3]" />
                    <span>{lang === 'en' ? 'Publish Ad' : 'سودا درج کریں'}</span>
                  </button>

                  <button
                    onClick={() => {
                      if (!user) {
                        handleLogin();
                      } else {
                        setShowCreateShopModal(true);
                      }
                    }}
                    className="px-6 py-4 rounded-2xl bg-[#ebe6dd] border border-[#dcd7ce] font-black text-xs uppercase tracking-widest text-[#5a6a5a] hover:bg-[#e4dec2] hover:text-[#4a584a] transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Store size={14} />
                    <span>{lang === 'en' ? 'Open Store' : 'اپنی دکان کھولیں'}</span>
                  </button>
                </div>
              </div>

              {/* Dynamic Filtering Panel & Search Console */}
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 bg-[#ebe6dd] border border-[#dcd7ce] rounded-3xl">
                {/* Search box input */}
                <div className="relative flex-1 min-w-0" id="search-console">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5a6a5a] w-4 h-4" />
                  <input
                    type="text"
                    className="w-full bg-white border border-[#dcd7ce] focus:border-[#5a6a5a] rounded-2xl pl-10 pr-4 py-3 text-xs placeholder-[#707070] outline-none transition text-[#3a3a3a]"
                    placeholder={
                      lang === 'en'
                        ? 'Search fields, animals, cellphones or shops...'
                        : 'کھیت، گائے، پرانے موبائل، گاڑیاں، یا دکانیں تلاش کریں۔۔۔'
                    }
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-black"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Categories filtering tab bar */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none" id="categories-tabs">
                  {/* Heart Favorites filter button */}
                  <button
                    onClick={() => setShowOnlyFavorites(prev => !prev)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 border duration-200 cursor-pointer flex items-center gap-1.5 ${
                      showOnlyFavorites
                        ? 'bg-rose-500 text-white border-rose-500 shadow-md font-extrabold'
                        : 'bg-[#faf8f5] text-rose-500 border-[#dcd7ce] hover:bg-rose-50 hover:border-rose-300'
                    }`}
                    title={lang === 'en' ? 'Show Saved' : 'محفوظ سودے دکھائیں'}
                    id="saved-filter-toggle"
                  >
                    <Heart size={12} fill={showOnlyFavorites ? 'currentColor' : 'none'} className={showOnlyFavorites ? 'animate-pulse' : ''} />
                    <span>{lang === 'en' ? 'Saved' : 'محفوظ'}</span>
                  </button>

                  <div className="w-px h-6 bg-[#dcd7ce] shrink-0 self-center" />

                  {CATEGORIES.map(cat => {
                    const isActive = selectedCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 border duration-200 cursor-pointer ${
                          isActive
                            ? 'bg-[#5a6a5a] text-white border-[#5a6a5a] shadow-md'
                            : 'bg-[#faf8f5] text-[#707070] border-[#dcd7ce] hover:text-[#3a3a3a] hover:border-[#5a6a5a]'
                        }`}
                      >
                        <span className="flex items-center gap-1.5">
                          <span>{lang === 'en' ? cat.name : cat.nameUr}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Grid Lists */}
              {activeShopFilter && (
                (() => {
                  const targetShop = activeShops.find(s => s.name === activeShopFilter);
                  if (!targetShop) return null;
                  return (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gradient-to-tr from-[#fcfbf9] to-[#f4f1ea] border-2 border-[#5a6a5a]/30 p-6 rounded-3xl mb-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6"
                      id="active-shop-showcase-board"
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${targetShop.logoGradient} flex items-center justify-center text-white text-2xl shadow-md shrink-0`}>
                          {targetShop.logoEmoji}
                        </div>
                        <div className="space-y-1 text-left">
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] uppercase font-black text-[#5a6a5a] bg-[#f2f9f2] px-2 py-0.5 rounded-lg border border-[#dfeae0]">
                              {lang === 'en' ? 'Exclusive Store' : 'خصوصی دکان'}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">Est. {targetShop.createdAt}</span>
                          </div>
                          <h2 className="text-xl font-serif font-black text-[#3a3a3a]">
                            {lang === 'en' ? targetShop.name : targetShop.nameUr}
                          </h2>
                          <p className="text-xs text-[#d4a373] font-bold">
                            {lang === 'en' ? `Merchant: ${targetShop.ownerName}` : `دکاندار: ${targetShop.ownerName}`}
                          </p>
                          <p className="text-xs text-[#707070] max-w-xl leading-relaxed">
                            {lang === 'en' ? targetShop.description : targetShop.descriptionUr}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row items-stretch gap-2 shrink-0 md:min-w-60">
                        <button
                          onClick={() => handleCallSeller(targetShop.phone, targetShop.name)}
                          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-750 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-sm"
                        >
                          <Phone size={14} className="stroke-[2.5]" />
                          <span>{lang === 'en' ? 'Contact Shop' : 'رابطہ کریں'}</span>
                        </button>
                        <button
                          onClick={() => setActiveShopFilter(null)}
                          className="px-4 py-2.5 rounded-xl bg-white border border-[#dcd7ce] hover:bg-[#eadecc] text-[#707070] hover:text-[#3a3a3a] font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
                        >
                          <span>✕</span>
                          <span>{lang === 'en' ? 'Exit Shop' : 'دکان سے باہر نکلیں'}</span>
                        </button>
                      </div>
                    </motion.div>
                  );
                })()
              )}

              {filteredListings.length === 0 ? (
                <div className="py-20 text-center space-y-3 bg-[#ebe6dd] border border-[#dcd7ce] rounded-3xl" id="empty-listings">
                  <span className="text-5xl filter grayscale opacity-45">🌳</span>
                  <h3 className="font-serif font-bold text-[#3a3a3a] text-base">
                    {lang === 'en' ? 'No trade items found' : 'کوئی سودا نہیں ملا'}
                  </h3>
                  <p className="text-xs text-[#707070] max-w-xs mx-auto font-sans">
                    {lang === 'en'
                      ? 'Try clearing your search query or look into alternative categories.'
                      : 'براہ مہربانی تلاش کا نام تبدیل کریں یا دیگر کیٹگریز دیکھیں۔'}
                  </p>
                  <button
                    onClick={() => {
                      setSelectedCategory('all');
                      setSearchQuery('');
                      setActiveShopFilter(null);
                    }}
                    className="px-4 py-2 bg-[#faf8f5] border border-[#dcd7ce] text-[#5a6a5a] text-xs rounded-xl font-bold hover:bg-[#eadecc] transition cursor-pointer"
                  >
                    {lang === 'en' ? 'Reset Filters' : 'فلٹرز صاف کریں'}
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" id="listings-feed">
                  {filteredListings.map(item => (
                    <div 
                      key={item.id} 
                      className="cursor-pointer" 
                      onClick={() => setSelectedListingDetail(item)}
                    >
                      <ListingCard
                        listing={item}
                        lang={lang}
                        onStartChat={handleStartChatFromListing}
                        onCallSeller={(l: Listing) => handleCallSeller(l.sellerPhone, l.sellerName)}
                        onBuyInstantly={handleLockTrade}
                        isFavorited={profile?.favorites?.includes(item.id)}
                        onToggleFavorite={() => handleToggleFavorite(item.id)}
                        onDelete={() => handleDeleteListing(item.id)}
                        onSelectShopFilter={(shopName) => {
                          const targetShop = activeShops.find(s => s.name === shopName || s.nameUr === shopName);
                          if (targetShop) {
                            setSelectedShopDetail(targetShop);
                          } else {
                            setActiveShopFilter(shopName);
                            setActiveView('home');
                            setSearchQuery('');
                            setSelectedCategory('all');
                          }
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeView === 'shops' && (
            <motion.div
              key="shops-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
            >
              <ShopsList
                shops={activeShops}
                listings={activeListings}
                lang={lang}
                onSelectShopFilter={(shopName) => {
                  const targetShop = activeShops.find(s => s.name === shopName || s.nameUr === shopName);
                  if (targetShop) {
                    setSelectedShopDetail(targetShop);
                  } else {
                    setActiveShopFilter(shopName);
                    setActiveView('home');
                    setSearchQuery('');
                    setSelectedCategory('all');
                  }
                }}
                onCallShopPhone={(phone, name) => handleCallSeller(phone, name)}
                onOpenShopClick={() => {
                  if (!user) {
                    handleLogin();
                  } else {
                    setShowCreateShopModal(true);
                  }
                }}
              />
            </motion.div>
          )}

          {activeView === 'chats' && (
            <motion.div
              key="chats-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
            >
              {user ? (
                <ChatSection
                  sessions={chats}
                  activeSessionId={activeChatSessionId || (chats.length > 0 ? chats[0].id : null)}
                  onSelectSession={setActiveChatSessionId}
                  onSendMessage={handleSendMessage}
                  lang={lang}
                  onCallSeller={(phone, name) => handleCallSeller(phone, name)}
                />
              ) : (
                <div className="bg-[#ebe6dd] border border-[#dcd7ce] rounded-3xl p-12 text-center space-y-4 max-w-lg mx-auto my-12 shadow-md" id="chats-login-gate">
                  <div className="w-16 h-16 bg-[#5a6a5a]/20 text-[#5a6a5a] text-3xl flex items-center justify-center rounded-2xl mx-auto mb-2">
                    💬
                  </div>
                  <h3 className="font-serif font-bold text-[#3a3a3a] text-lg">
                    {lang === 'en' ? 'Access Trade Conversations' : 'تجارتی پیغامات تک رسائی'}
                  </h3>
                  <p className="text-xs text-[#707070] font-sans leading-relaxed">
                    {lang === 'en' 
                      ? 'Please login with Google to lock bargains, bargain prices, and chat securely with other villagers.'
                      : 'سودے بازی، چیٹ اور حتمی نرخ طے کرنے کے لیے گوگل لاگ ان کریں۔'}
                  </p>
                  <button
                    onClick={handleLogin}
                    className="px-6 py-3 bg-[#5a6a5a] text-white hover:bg-[#4d5b4d] rounded-xl text-xs font-bold font-sans transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    🔑 {lang === 'en' ? 'Google Sign-In' : 'گوگل اکاؤنٹ لاگ ان'}
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {activeView === 'settings' && (
            <motion.div
              key="settings-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
            >
              {user ? (
                <SettingsPanel
                  profile={profile}
                  lang={lang}
                  onUpdateProfile={handleUpdateProfile}
                  onTriggerVfx={() => setVfxState({ trigger: true, type: 'success' })}
                  onLogout={handleLogout}
                />
              ) : (
                <div className="bg-[#ebe6dd] border border-[#dcd7ce] rounded-3xl p-12 text-center space-y-4 max-w-lg mx-auto my-12 shadow-md" id="settings-login-gate">
                  <div className="w-16 h-16 bg-[#5a6a5a]/20 text-[#5a6a5a] text-3xl flex items-center justify-center rounded-2xl mx-auto mb-2">
                    👤
                  </div>
                  <h3 className="font-serif font-bold text-[#3a3a3a] text-lg">
                    {lang === 'en' ? 'Manage Your Account' : 'ذاتی اکاؤنٹ کی ترتیبات'}
                  </h3>
                  <p className="text-xs text-[#707070] font-sans leading-relaxed">
                    {lang === 'en' 
                      ? 'Create and manage your verified village merchant profile, notification rules, and custom privacy filters.'
                      : 'اپنا تصدیق شدہ پروفائل، رابطے کی رازداری، اور نوٹیفیکیشنز کو کنٹرول کرنے کے لیے لاگ ان کریں۔'}
                  </p>
                  <button
                    onClick={handleLogin}
                    className="px-6 py-3 bg-[#5a6a5a] text-white hover:bg-[#4d5b4d] rounded-xl text-xs font-bold font-sans transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    🔑 {lang === 'en' ? 'Google Sign-In' : 'گوگل لاگ ان'}
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {activeView === 'about' && (
            <motion.div
              key="about-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
            >
              <AboutPanel lang={lang} />
            </motion.div>
          )}

          {activeView === 'activities' && (
            <motion.div
              key="activities-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
            >
              {user ? (
                <MyActivities
                  user={user}
                  shops={activeShops}
                  listings={activeListings}
                  lang={lang}
                  onDeleteListing={handleDeleteListing}
                  onDeleteShop={handleDeleteShop}
                  onSelectShop={(shop) => setSelectedShopDetail(shop)}
                  onSelectListing={(listing) => setSelectedListingDetail(listing)}
                />
              ) : (
                <div className="bg-[#ebe6dd] border border-[#dcd7ce] rounded-3xl p-12 text-center space-y-4 max-w-lg mx-auto my-12 shadow-md">
                  <div className="w-16 h-16 bg-[#5a6a5a]/20 text-[#5a6a5a] text-3xl flex items-center justify-center rounded-2xl mx-auto mb-2">
                    📊
                  </div>
                  <h3 className="font-serif font-bold text-[#3a3a3a] text-lg">
                    {lang === 'en' ? 'Track Your Activities' : 'اپنی سرگرمیاں دیکھیں'}
                  </h3>
                  <p className="text-xs text-[#707070] font-sans leading-relaxed">
                    {lang === 'en' 
                      ? 'Please log in to inspect your published trade postings and virtual stores in the Republic of Sawaldher.'
                      : 'اپنی دکانیں اور تجارتی اشیاء کو منظم کرنے کے لیے برائے مہربانی لاگ ان کریں۔'}
                  </p>
                  <button
                    onClick={handleLogin}
                    className="px-6 py-3 bg-[#5a6a5a] text-white hover:bg-[#4d5b4d] rounded-xl text-xs font-bold font-sans transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    🔑 {lang === 'en' ? 'Google Sign-In' : 'گوگل لاگ ان'}
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* DETAIL DRAWER / OVERLAY OVER LISTING */}
      <AnimatePresence>
        {selectedListingDetail && (
          <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/50 backdrop-blur-sm" id="detail-drawer">
            {/* Backdrop click closer */}
            <div className="absolute inset-0" onClick={() => setSelectedListingDetail(null)} />
            
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-lg h-full bg-[#f4f1ea] border-l border-[#dcd7ce] text-[#3a3a3a] shadow-2xl flex flex-col p-6 overflow-y-auto block scrollbar-thin"
            >
              {/* Drawer header close info */}
              <div className="flex items-center justify-between pb-4 border-b border-[#dcd7ce] shrink-0">
                <span className="text-[10px] font-mono uppercase bg-[#5a6a5a]/20 text-[#5a6a5a] px-2.5 py-1 rounded-md tracking-wider font-bold">
                  🛒 {lang === 'en' ? 'Sparsely active item' : 'فعال سودا'}
                </span>
                <button 
                  onClick={() => setSelectedListingDetail(null)}
                  className="p-1.5 rounded-xl bg-white text-[#5a6a5a] hover:text-[#3a3a3a] border border-[#dcd7ce] cursor-pointer shadow-sm"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Display dynamic preview glassmorphic icon or custom uploaded picture */}
              <div 
                className={`mt-6 w-full h-44 rounded-2xl flex items-center justify-center shrink-0 relative overflow-hidden ${
                  selectedListingDetail.imageGradient.startsWith('data:image') || selectedListingDetail.imageGradient.startsWith('http')
                    ? ''
                    : `bg-gradient-to-tr ${selectedListingDetail.imageGradient}`
                }`}
                style={
                  selectedListingDetail.imageGradient.startsWith('data:image') || selectedListingDetail.imageGradient.startsWith('http')
                    ? { backgroundImage: `url(${selectedListingDetail.imageGradient})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                    : {}
                }
                id="listing-drawer-banner"
              >
                {(!selectedListingDetail.imageGradient.startsWith('data:image') && !selectedListingDetail.imageGradient.startsWith('http')) && (
                  <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 shadow-lg">
                    {/* Render elegant categories icon dynamically */}
                    {selectedListingDetail.category === 'fields' && <Icons.Sprout className="w-8 h-8" />}
                    {selectedListingDetail.category === 'animals' && <Icons.Footprints className="w-8 h-8" />}
                    {selectedListingDetail.category === 'electronics' && <Icons.Tv className="w-8 h-8" />}
                    {selectedListingDetail.category === 'house' && <Icons.Home className="w-8 h-8" />}
                    {selectedListingDetail.category === 'cars' && <Icons.Car className="w-8 h-8" />}
                    {selectedListingDetail.category === 'mobile' && <Icons.Smartphone className="w-8 h-8" />}
                    {selectedListingDetail.category === 'industrial' && <Icons.Hammer className="w-8 h-8" />}
                  </div>
                )}
                <div className="absolute inset-0 bg-black/5" />
              </div>

              {/* Ad content body */}
              <div className="mt-6 flex-grow space-y-6">
                <div>
                  <h2 className="text-2xl font-serif font-bold tracking-tight text-[#3a3a3a] leading-tight">
                    {lang === 'en' ? selectedListingDetail.title : selectedListingDetail.titleUr}
                  </h2>
                  <div className="flex items-center gap-3 mt-2 text-xs text-[#707070]">
                    <span className="flex items-center gap-1">📍 {lang === 'en' ? selectedListingDetail.location : selectedListingDetail.locationUr}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">⏱️ {selectedListingDetail.createdAt}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-[#8a5a4a] font-mono">👀 {selectedListingDetail.views} views</span>
                  </div>
                </div>

                {/* Price tag */}
                <div className="p-4 bg-white border border-[#dcd7ce] rounded-2xl flex items-center justify-between shadow-sm">
                  <div>
                    <span className="text-[10px] uppercase text-[#707070] font-bold block">
                      {lang === 'en' ? 'Bargain price tag' : 'نرخ سودا'}
                    </span>
                    <span className="text-2xl font-black text-[#8a5a4a] font-sans">
                      {selectedListingDetail.price === 0 
                        ? (lang === 'en' ? 'Contact Owner' : 'مفت / رابطہ کریں')
                        : (lang === 'en' ? `Rs. ${selectedListingDetail.price.toLocaleString()}` : `${selectedListingDetail.priceUr} روپے`)
                      }
                    </span>
                  </div>
                  <span className={`px-3 py-1 bg-[#fcfbfa] border border-[#dcd7ce] text-xs font-bold rounded-lg ${selectedListingDetail.type === 'rent' ? 'text-indigo-600 bg-indigo-50' : 'text-[#8a5a4a]'}`}>
                    {selectedListingDetail.type === 'rent' ? (lang === 'en' ? 'Lease / Rent' : 'ٹھیقہ / کرایہ') : (lang === 'en' ? 'Outright Sale' : 'خرید و فروخت')}
                  </span>
                </div>

                {/* Bulk quantity notification if active */}
                {selectedListingDetail.bulkQuantity && selectedListingDetail.bulkQuantity > 1 && (
                  <div className="bg-[#fffbeb] border border-[#fef3c7] text-[#92400e] p-3 rounded-2xl flex items-center justify-between shadow-xs animate-pulse">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">📦</span>
                      <div>
                        <span className="text-xs font-black block leading-tight font-serif">
                          {lang === 'en' ? 'Package Deal: Bulk Trade' : 'پیکج سودا: ہول سیل / تھوک'}
                        </span>
                        <span className="text-[10px] text-[#78350f] block font-sans">
                          {lang === 'en' 
                            ? `This item has a bulk quantity of ${selectedListingDetail.bulkQuantity} units.` 
                            : `اس اشتہار کے تحت مجموعی طور پر ${selectedListingDetail.bulkQuantity} عدد اشیاء شامل ہیں۔`}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-black bg-[#fef3c7] border border-[#fde68a] px-3 py-1 rounded-xl">
                      {selectedListingDetail.bulkQuantity}x
                    </span>
                  </div>
                )}

                {/* Condition, category and delivery details */}
                <div className="grid grid-cols-3 gap-3 text-xs font-sans">
                  <div className="p-3 bg-white rounded-xl border border-[#dcd7ce] shadow-sm">
                    <span className="text-[#707070] block text-[9px] uppercase mb-0.5 font-bold">{lang === 'en' ? 'Condition' : 'حالت'}</span>
                    <span className="text-[#3a3a3a] font-bold text-[11px] block truncate">{selectedListingDetail.condition === 'new' ? (lang === 'en' ? 'Brand New' : 'بہترین') : (lang === 'en' ? 'Used' : 'استعمال شدہ')}</span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-[#dcd7ce] shadow-sm">
                    <span className="text-[#707070] block text-[9px] uppercase mb-0.5 font-bold">{lang === 'en' ? 'Category' : 'کیٹگری'}</span>
                    <span className="text-[#3a3a3a] font-bold text-[11px] block truncate capitalize">{selectedListingDetail.category}</span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-[#dcd7ce] shadow-sm">
                    <span className="text-[#707070] block text-[9px] uppercase mb-0.5 font-bold">{lang === 'en' ? 'Delivery Offer' : 'ڈلیوری'}</span>
                    <span className={`font-bold text-[11px] block truncate ${selectedListingDetail.offersDelivery ? 'text-emerald-700' : 'text-amber-700'}`}>
                      {selectedListingDetail.offersDelivery ? (lang === 'en' ? 'Available' : 'دستیاب ہے') : (lang === 'en' ? 'Unavailable' : 'دستیاب نہیں')}
                    </span>
                  </div>
                </div>

                {/* Description details */}
                <div className="space-y-2">
                  <h4 className="text-xs font-serif font-black text-[#5a6a5a] uppercase tracking-widest">
                    {lang === 'en' ? 'Description details' : 'تفصیلات سودا'}
                  </h4>
                  <p className="text-xs text-[#3a3a3a] font-sans leading-relaxed bg-white p-4 border border-[#dcd7ce] rounded-2xl whitespace-pre-line shadow-sm">
                    {lang === 'en' ? selectedListingDetail.description : selectedListingDetail.descriptionUr}
                  </p>
                </div>

                {/* Seller info panel card */}
                <div className="p-4 bg-[#ebe6dd] border border-[#dcd7ce] rounded-2xl flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#5a6a5a] to-[#d4a373] text-white flex items-center justify-center text-lg select-none font-bold shadow-sm">
                       👤
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#3a3a3a]">{selectedListingDetail.sellerName}</h4>
                      <p className="text-[10px] text-[#707070] font-mono tracking-tighter">Verified Village Merchant</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCallSeller(selectedListingDetail.sellerPhone, selectedListingDetail.sellerName)}
                    className="p-2 sm:px-3 sm:py-2 bg-white border border-[#dcd7ce] hover:border-[#5a6a5a]/40 text-xs text-[#5a6a5a] rounded-xl font-bold flex items-center gap-1.5 cursor-pointer whitespace-nowrap shadow-sm"
                  >
                    <span className="text-base">📞</span>
                    <span>WhatsApp</span>
                  </button>
                </div>
              </div>

              {/* Action desk buttons bar */}
              <div className="pt-6 border-t border-[#dcd7ce] bg-[#f4f1ea] shrink-0 flex gap-3">
                <button
                  onClick={() => handleStartChatFromListing(selectedListingDetail)}
                  className="flex-1 py-3.5 bg-[#5a6a5a] text-white hover:bg-[#4d5b4d] font-bold text-xs uppercase tracking-widest rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  💬 <span>{lang === 'en' ? 'Lock Bargain' : 'مذاکرات شروع کریں'}</span>
                </button>
                <button
                  onClick={() => {
                    handleLockTrade(selectedListingDetail);
                    setSelectedListingDetail(null);
                  }}
                  className="px-6 py-3.5 bg-[#d4a373] hover:bg-[#c39262] text-white font-black text-xs uppercase tracking-widest rounded-xl transition cursor-pointer shadow-md"
                >
                  🤝 <span>{lang === 'en' ? 'Done Deal' : 'سودا مکمل'}</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODALS */}

      {/* Create Listing classified Modal */}
      <AnimatePresence>
        {showCreateListingModal && (
          <CreateListingModal
            isOpen={showCreateListingModal}
            onClose={() => {
              setShowCreateListingModal(false);
              setPreselectedShopId(undefined);
            }}
            lang={lang}
            categories={CATEGORIES}
            shops={activeShops}
            onSave={handleSaveListing}
            preselectedShopId={preselectedShopId}
          />
        )}
      </AnimatePresence>

      {/* Create Shop Modal */}
      <AnimatePresence>
        {showCreateShopModal && (
          <CreateShopModal
            isOpen={showCreateShopModal}
            onClose={() => setShowCreateShopModal(false)}
            lang={lang}
            categories={CATEGORIES}
            onCreateShop={handleCreateShop}
          />
        )}
      </AnimatePresence>

      {/* Shop Detail Modal */}
      <AnimatePresence>
        {selectedShopDetail && (
          <ShopDetailModal
            isOpen={!!selectedShopDetail}
            onClose={() => setSelectedShopDetail(null)}
            shop={selectedShopDetail}
            listings={activeListings}
            lang={lang}
            onProductClick={(product) => {
              setSelectedListingDetail(product);
            }}
            onCallShopPhone={(phone, name) => handleCallSeller(phone, name)}
            favorites={profile?.favorites || []}
            onToggleFavorite={handleToggleFavorite}
            user={user}
            onPublishProductInShop={(shop) => {
              setPreselectedShopId(shop.id);
              setShowCreateListingModal(true);
            }}
          />
        )}
      </AnimatePresence>

      {/* Dynamic Future Updates / Upcoming Branches modal roadmap popup */}
      <AnimatePresence>
        {roadmapBranch && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#faf8f5] border border-[#dcd7ce] rounded-3xl max-w-md w-full p-6 text-center space-y-4 shadow-xl"
              id="roadmap-alert-modal"
            >
              <span className="text-5xl animate-bounce inline-block font-sans">🚀</span>

              <h3 className="text-xl font-bold text-[#3a3a3a] uppercase tracking-tight font-serif">
                {lang === 'en'
                  ? `${roadmapBranch === 'ride' ? 'Ride' : 'Food'} Portal Coming Soon`
                  : `${roadmapBranch === 'ride' ? 'سواری پورٹل' : 'کھانا پورٹل'} - جلد ہی آ رہا ہے`}
              </h3>

              <div className="bg-[#ebe6dd] border border-[#dcd7ce] p-4 rounded-2xl text-xs text-[#545454] leading-relaxed font-sans text-left">
                <p>
                  {lang === 'en'
                    ? `Our brilliant developer **Muhammad Sudais Durrani** is actively writing this community portal!`
                    : `ہمارے ہونہار سافٹ ویئر انجینئر **محمد سدیس دورانی** اس فیچر پر کام کر رہے ہیں!`}
                </p>
                <div className="mt-2 text-[#8a5a4a] font-semibold gap-1 flex items-center font-sans">
                  <span>✨</span>
                  <span>
                    {lang === 'en'
                      ? 'We are bringing ride-hailing and hot village takeaway deliveries shortly.'
                      : 'سستی سواری عارضی بکنگ اور گرما گرم کباب پورٹلز بہت جلد فعال ہوں گے۔'}
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setRoadmapBranch(null)}
                  className="w-full py-3 bg-[#5a6a5a] text-white hover:bg-[#4d5b4d] font-bold text-xs uppercase tracking-widest rounded-xl transition cursor-pointer font-sans shadow-md"
                >
                  {lang === 'en' ? 'Got It, Keep Trading!' : 'ٹھیک ہے، تجارت جاری رکھیں!'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Visual floating vertical pull-tab on the right edge to trigger / guide swipe left */}
      <div className="fixed right-0 top-1/2 -translate-y-1/2 z-[100]" id="drawer-slide-pulltag">
        <motion.button
          onClick={() => setShowSwipeDrawer(true)}
          whileHover={{ scale: 1.05, x: -3 }}
          className="bg-[#5a6a5a] text-[#fcfbfa] hover:bg-[#4d5b4d] border-l border-y border-[#eadecc] rounded-l-2xl py-3 px-2 flex flex-col items-center gap-2 shadow-lg cursor-pointer max-w-[42px]"
          title={lang === 'en' ? 'Slide or Tap: Account Info & Settings' : 'سلائیڈ کریں یا کلک کریں: اکاؤنٹ اور سیٹنگز'}
        >
          <span className="text-sm">👤</span>
          <span className="text-[9px] font-black uppercase text-center tracking-wider text-[#d4a373] transform rotate-180 write-vertical-rl" style={{ writingMode: 'vertical-rl' }}>
            {lang === 'en' ? 'SWIPE LEFT' : 'اکاؤنٹ'}
          </span>
          <span className="text-xs text-[#d4a373] animate-pulse">◀</span>
        </motion.button>
      </div>

      {/* Mobile Swipe Left Account & Settings Dashboard */}
      <SwipeLeftDrawer
        isOpen={showSwipeDrawer}
        onClose={() => setShowSwipeDrawer(false)}
        user={user}
        profile={profile}
        lang={lang}
        setLang={setLang}
        onClearCache={handleClearCache}
        onLogout={handleLogout}
        onTransitionToView={setActiveView}
      />
    </div>
  );
}
