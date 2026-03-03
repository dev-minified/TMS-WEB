"use client";

import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export type UserRole = "admin";

export interface AppUser {
  email: string;
  role: UserRole;
  createdAt?: Date;
  lastLoginAt?: Date;
}

function userDocIdFromEmail(email: string): string {
  return encodeURIComponent(email.trim().toLowerCase());
}

export async function upsertUserLogin(input: {
  email: string;
  role: UserRole;
}): Promise<void> {
  const id = userDocIdFromEmail(input.email);
  const ref = doc(db, "users", id);

  await setDoc(
    ref,
    {
      email: input.email.trim().toLowerCase(),
      role: input.role,
      lastLoginAt: serverTimestamp(),
      createdAt: serverTimestamp(),
    },
    { merge: true },
  );
}

