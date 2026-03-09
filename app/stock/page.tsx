"use client";

import { useState } from "react";
import { useInventory } from "@/hooks";

export default function StockPage() {
  const { inventory, loading, error } = useInventory();
  const [search, setSearch] = useState("");

  const totalNew = inventory.reduce((sum, item) => sum + item.newQty, 0);
  const totalUsed = inventory.reduce((sum, item) => sum + item.usedQty, 0);
  const filteredInventory = inventory.filter((item) => {
    const q = search.toLowerCase();
    return item.type.toLowerCase().includes(q) || item.brand.toLowerCase().includes(q);
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center px-4 pt-24 pb-12">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Loading stock...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center px-4 pt-24 pb-12">
        <p className="text-sm text-red-600 dark:text-red-400">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="px-4 pt-12 pb-12 font-sans sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-4xl">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="mb-1 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
              Stock
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              View current tyre stock levels.
            </p>
          </div>
          <input
            type="text"
            placeholder="Search brand or type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-64 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-zinc-400 focus:ring-1 focus:ring-zinc-200 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-600 dark:focus:ring-zinc-800"
          />
        </div>

        <div className="mb-8 grid grid-cols-3 gap-3">
          <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Total New Tyres
            </p>
            <p className="mt-1 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
              {totalNew.toLocaleString()}
            </p>
          </div>
          <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Total Used Tyres
            </p>
            <p className="mt-1 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
              {totalUsed.toLocaleString()}
            </p>
          </div>
          <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Remaining Tyres
            </p>
            <p className="mt-1 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
              {(totalNew - totalUsed).toLocaleString()}
            </p>
          </div>
        </div>

        {filteredInventory.length === 0 ? (
          <div className="rounded-lg border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {search ? "No tyres match your search." : "No tyres in stock."}
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
                  <th className="px-4 py-3 font-medium text-zinc-700 dark:text-zinc-300">
                    Brand
                  </th>
                  <th className="px-4 py-3 font-medium text-zinc-700 dark:text-zinc-300">
                    Tyre Type
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-zinc-700 dark:text-zinc-300">
                    New
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-zinc-700 dark:text-zinc-300">
                    Used
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-zinc-700 dark:text-zinc-300">
                    Remaining
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredInventory.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-zinc-100 bg-white last:border-b-0 dark:border-zinc-800/50 dark:bg-zinc-950"
                  >
                    <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-100">
                      {item.brand}
                    </td>
                    <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-100">
                      {item.type}
                    </td>
                    <td className="px-4 py-3 text-right text-zinc-600 dark:text-zinc-400">
                      {item.newQty.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right text-zinc-600 dark:text-zinc-400">
                      {item.usedQty.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right text-zinc-600 dark:text-zinc-400">
                      {(item.newQty - item.usedQty).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
