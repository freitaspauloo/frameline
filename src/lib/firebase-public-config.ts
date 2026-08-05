/**
 * Firebase web app config (public by design — shipped to every browser).
 * Restrict abuse via Firebase Console → Authentication → Settings → Authorized domains.
 */
export const FIREBASE_PUBLIC_CONFIG = {
  apiKey: "AIzaSyBHFv_LKxUYkhhb_jlOjrX0l4bvBA-zE_M",
  authDomain: "frameline-b89ac.firebaseapp.com",
  projectId: "frameline-b89ac",
  storageBucket: "frameline-b89ac.firebasestorage.app",
  messagingSenderId: "891472943896",
  appId: "1:891472943896:web:276ffe15c52184aaff5c6d",
  measurementId: "G-1PN1BFNK4R",
} as const;

export type FirebasePublicConfig = typeof FIREBASE_PUBLIC_CONFIG;
