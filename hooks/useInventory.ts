"use client";

import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface Tyre {
  id: string;
  brand: string;
  type: string;
  newQty: number;
  usedQty: number;
  unitPrice: number;
}

export function useInventory() {
  const [inventory, setInventory] = useState<Tyre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "tyres"),
      (snapshot) => {
        const items: Tyre[] = snapshot.docs.map((d) => ({
          id: d.id,
          brand: d.data().brand ?? "",
          type: d.data().type,
          newQty: d.data().newQty,
          usedQty: d.data().usedQty,
          unitPrice: d.data().unitPrice ?? 0,
        }));
        setInventory(items);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      },
    );
    return unsubscribe;
  }, []);

  return { inventory, loading, error };
}

export async function addTyre(type: string, newQty: number, usedQty: number) {
  await addDoc(collection(db, "tyres"), {
    type,
    newQty,
    usedQty,
    createdAt: serverTimestamp(),
  });
}

export async function updateTyre(
  id: string,
  data: Partial<Pick<Tyre, "brand" | "type" | "newQty" | "usedQty" | "unitPrice">>,
) {
  await updateDoc(doc(db, "tyres", id), data);
}

export async function deleteTyre(id: string) {
  await deleteDoc(doc(db, "tyres", id));
}

export async function addStock(brand: string, type: string, quantity: number, unitPrice: number) {
  const q = query(
    collection(db, "tyres"),
    where("brand", "==", brand),
    where("type", "==", type),
  );
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    await addDoc(collection(db, "tyres"), {
      brand,
      type,
      newQty: quantity,
      usedQty: 0,
      unitPrice,
      createdAt: serverTimestamp(),
    });
  } else {
    const existing = snapshot.docs[0];
    await updateDoc(doc(db, "tyres", existing.id), {
      newQty: existing.data().newQty + quantity,
      unitPrice,
    });
  }
}

export async function useStock(brand: string, type: string, quantity: number) {
  const q = query(
    collection(db, "tyres"),
    where("brand", "==", brand),
    where("type", "==", type),
  );
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    throw new Error(
      `Tyre "${brand} - ${type}" is not in inventory. Please add this tyre and its quantity before using it.`,
    );
  }

  const existing = snapshot.docs[0];
  const remaining = existing.data().newQty - existing.data().usedQty;

  if (quantity > remaining) {
    throw new Error(
      `You are trying to use more "${brand} - ${type}" tyres than are available. Only ${remaining} remaining. Please add more stock or use a smaller quantity.`,
    );
  }

  await updateDoc(doc(db, "tyres", existing.id), {
    usedQty: existing.data().usedQty + quantity,
  });
}
