"use client";

import { useMemo, useState } from "react";
import { addStock, useStock, useInventory } from "@/hooks";
import { TyreTypeSelect } from "@/components/tyre-type-select";
import { BrandSelect } from "@/components/brand-select";

type Tab = "add" | "use";

export default function AddTyre() {
  const [tab, setTab] = useState<Tab>("add");
  const [brand, setBrand] = useState("");
  const [type, setType] = useState("");
  const [qty, setQty] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { inventory } = useInventory();

  const tyreTypes = useMemo(
    () => Array.from(new Set(inventory.map((item) => item.type))).sort(),
    [inventory],
  );

  const brands = useMemo(
    () => Array.from(new Set(inventory.map((item) => item.brand).filter(Boolean))).sort(),
    [inventory],
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!brand.trim() || !type.trim() || !qty || (tab === "add" && !unitPrice)) return;
    setFeedback(null);

    setSubmitting(true);
    try {
      if (tab === "add") {
        await addStock(brand.trim(), type.trim(), Number(qty), Number(unitPrice));
        setFeedback({
          type: "success",
          message: `Added ${qty} of "${brand.trim()} - ${type.trim()}" to inventory.`,
        });
      } else {
        await useStock(brand.trim(), type.trim(), Number(qty));
        setFeedback({
          type: "success",
          message: `Used ${qty} of "${brand.trim()} - ${type.trim()}" from inventory.`,
        });
      }
      setBrand("");
      setType("");
      setQty("");
      setUnitPrice("");
    } catch (err) {
      setFeedback({
        type: "error",
        message: err instanceof Error ? err.message : "Operation failed.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="px-4 pt-12 pb-12 font-sans sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-4xl">
        <div className="mb-8">
          <h1 className="mb-1 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Manage Tyres
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Add new stock or record tyre usage.
          </p>
        </div>

        <div className="mb-6 flex gap-2">
          <button
            onClick={() => {
              setTab("add");
              setFeedback(null);
            }}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              tab === "add"
                ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                : "border border-zinc-300 text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            }`}
          >
            Add Tyre
          </button>
          <button
            onClick={() => {
              setTab("use");
              setFeedback(null);
            }}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              tab === "use"
                ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                : "border border-zinc-300 text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            }`}
          >
            Use Tyre
          </button>
        </div>

        {feedback && (
          <div
            className={`mb-6 rounded-lg border px-4 py-3 text-sm ${
              feedback.type === "success"
                ? "border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-300"
                : "border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-300"
            }`}
          >
            {feedback.message}
          </div>
        )}

        <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="mb-4 text-sm font-medium text-zinc-900 dark:text-zinc-100">
            {tab === "add" ? "Add Stock" : "Use Stock"}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className={`grid grid-cols-1 gap-3 ${tab === "add" ? "sm:grid-cols-5" : "sm:grid-cols-3"}`}>
              <div>
                <label
                  htmlFor="tyre-brand"
                  className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Brand
                </label>
                {tab === "use" ? (
                  <BrandSelect
                    id="tyre-brand"
                    options={brands}
                    value={brand}
                    onChange={setBrand}
                    placeholder="Select brand"
                    disabled={submitting}
                  />
                ) : (
                  <input
                    id="tyre-brand"
                    type="text"
                    placeholder="e.g. Dunlop"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    disabled={submitting}
                    className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-500 dark:focus:ring-zinc-800"
                  />
                )}
              </div>
              <div>
                <label
                  htmlFor="tyre-type"
                  className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Tyre Type
                </label>
                {tab === "use" ? (
                  <TyreTypeSelect
                    id="tyre-type"
                    options={tyreTypes}
                    value={type}
                    onChange={setType}
                    placeholder="Select tyre type"
                    disabled={submitting}
                  />
                ) : (
                  <input
                    id="tyre-type"
                    type="text"
                    placeholder="e.g. 275/55 R20"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    disabled={submitting}
                    className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-500 dark:focus:ring-zinc-800"
                  />
                )}
              </div>
              <div>
                <label
                  htmlFor="tyre-qty"
                  className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Quantity
                </label>
                <input
                  id="tyre-qty"
                  type="number"
                  min="1"
                  placeholder="e.g. 10"
                  value={qty}
                  onChange={(e) => setQty(e.target.value)}
                  disabled={submitting}
                  className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-500 dark:focus:ring-zinc-800"
                />
              </div>
              {tab === "add" && (
                <>
                  <div>
                    <label
                      htmlFor="tyre-unit-price"
                      className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                    >
                      Per Unit Price
                    </label>
                    <input
                      id="tyre-unit-price"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="e.g. 250"
                      value={unitPrice}
                      onChange={(e) => setUnitPrice(e.target.value)}
                      disabled={submitting}
                      className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-500 dark:focus:ring-zinc-800"
                    />
                  </div>
                  <div>
                    <label
                      className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                    >
                      Total Price
                    </label>
                    <div className="flex h-[38px] items-center rounded-lg border border-zinc-200 bg-zinc-50 px-3 text-sm text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-300">
                      {qty && unitPrice
                        ? (Number(qty) * Number(unitPrice)).toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })
                        : "—"}
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="mt-4 flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center justify-center rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
              >
                {submitting && (
                  <svg
                    className="mr-2 h-4 w-4 animate-spin text-white"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                )}
                {submitting
                  ? tab === "add"
                    ? "Adding..."
                    : "Processing..."
                  : tab === "add"
                    ? "Add Stock"
                    : "Use Stock"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setBrand("");
                  setType("");
                  setQty("");
                  setUnitPrice("");
                  setFeedback(null);
                }}
                className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
