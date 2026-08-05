"use client";

import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut as firebaseSignOut,
  type Auth,
  type User,
} from "firebase/auth";

import { FIREBASE_PUBLIC_CONFIG } from "@/lib/firebase-public-config";

function clientConfig() {
  // Env overrides win; committed public config is the default so every env works.
  return {
    apiKey:
      process.env.NEXT_PUBLIC_FIREBASE_API_KEY || FIREBASE_PUBLIC_CONFIG.apiKey,
    authDomain:
      process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ||
      FIREBASE_PUBLIC_CONFIG.authDomain,
    projectId:
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
      FIREBASE_PUBLIC_CONFIG.projectId,
    appId:
      process.env.NEXT_PUBLIC_FIREBASE_APP_ID || FIREBASE_PUBLIC_CONFIG.appId,
    messagingSenderId:
      process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ||
      FIREBASE_PUBLIC_CONFIG.messagingSenderId,
    storageBucket:
      process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
      FIREBASE_PUBLIC_CONFIG.storageBucket,
    measurementId:
      process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ||
      FIREBASE_PUBLIC_CONFIG.measurementId,
  };
}

/** True when the browser Firebase web config is present. */
export function isFirebaseClientConfigured(): boolean {
  const c = clientConfig();
  return Boolean(c.apiKey && c.authDomain && c.projectId && c.appId);
}

let app: FirebaseApp | undefined;
let auth: Auth | undefined;

export function getFirebaseApp(): FirebaseApp | null {
  if (!isFirebaseClientConfigured()) return null;
  if (app) return app;
  if (getApps().length > 0) {
    app = getApps()[0]!;
    return app;
  }
  const c = clientConfig();
  app = initializeApp({
    apiKey: c.apiKey!,
    authDomain: c.authDomain!,
    projectId: c.projectId!,
    appId: c.appId!,
    messagingSenderId: c.messagingSenderId,
    storageBucket: c.storageBucket,
  });
  return app;
}

export function getFirebaseClientAuth(): Auth | null {
  const firebaseApp = getFirebaseApp();
  if (!firebaseApp) return null;
  if (!auth) auth = getAuth(firebaseApp);
  return auth;
}

export async function signInWithGoogle(): Promise<User> {
  const clientAuth = getFirebaseClientAuth();
  if (!clientAuth) throw new Error("Firebase client is not configured");
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(clientAuth, provider);
  return result.user;
}

export async function signInWithEmail(email: string, password: string) {
  const clientAuth = getFirebaseClientAuth();
  if (!clientAuth) throw new Error("Firebase client is not configured");
  const result = await signInWithEmailAndPassword(clientAuth, email, password);
  return result.user;
}

export async function registerWithEmail(email: string, password: string) {
  const clientAuth = getFirebaseClientAuth();
  if (!clientAuth) throw new Error("Firebase client is not configured");
  const result = await createUserWithEmailAndPassword(
    clientAuth,
    email,
    password,
  );
  return result.user;
}

export async function resetPassword(email: string) {
  const clientAuth = getFirebaseClientAuth();
  if (!clientAuth) throw new Error("Firebase client is not configured");
  await sendPasswordResetEmail(clientAuth, email);
}

export async function clientSignOut() {
  const clientAuth = getFirebaseClientAuth();
  if (!clientAuth) return;
  await firebaseSignOut(clientAuth);
}

export async function getIdToken(forceRefresh = false): Promise<string | null> {
  const clientAuth = getFirebaseClientAuth();
  const user = clientAuth?.currentUser;
  if (!user) return null;
  return user.getIdToken(forceRefresh);
}
