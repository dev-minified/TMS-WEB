"use client";

import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface CustomerCar {
  carNumber: string;
  makeModel: string;
  warrantyDetails?: string;
}

export interface PurchasedItem {
  tyreType: string;
  quantity: number;
}

export interface Customer {
  id: string;
  name: string;
  mobile: string;
  cars: CustomerCar[];
  purchasedItems: PurchasedItem[];
  createdAt?: Date;
}

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, "customers"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items: Customer[] = snapshot.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            name: data.name,
            mobile: data.mobile,
            cars: data.cars ?? [],
            purchasedItems: data.purchasedItems ?? [],
            createdAt: data.createdAt?.toDate?.() ?? undefined,
          };
        });
        setCustomers(items);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      },
    );
    return unsubscribe;
  }, []);

  return { customers, loading, error };
}

export async function addCustomer(input: {
  name: string;
  mobile: string;
  cars: CustomerCar[];
  purchasedItems: PurchasedItem[];
}) {
  await addDoc(collection(db, "customers"), {
    ...input,
    createdAt: serverTimestamp(),
  });
}

