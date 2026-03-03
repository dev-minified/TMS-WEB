"use client";

import { useMemo, useState } from "react";
import { addCustomer, useInventory, useStock } from "@/hooks";
import { TyreTypeSelect } from "@/components/tyre-type-select";

interface CarForm {
  carNumber: string;
  makeModel: string;
  warrantyDetails: string;
}

interface ItemForm {
  tyreType: string;
  quantity: string;
}

export default function AddCustomerPage() {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [cars, setCars] = useState<CarForm[]>([
    { carNumber: "", makeModel: "", warrantyDetails: "" },
  ]);
  const [items, setItems] = useState<ItemForm[]>([{ tyreType: "", quantity: "" }]);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const { inventory } = useInventory();

  const tyreTypes = useMemo(
    () => Array.from(new Set(inventory.map((i) => i.type))).sort(),
    [inventory],
  );

  function updateCar(index: number, patch: Partial<CarForm>) {
    setCars((prev) =>
      prev.map((car, i) => (i === index ? { ...car, ...patch } : car)),
    );
  }

  function updateItem(index: number, patch: Partial<ItemForm>) {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, ...patch } : item)),
    );
  }

  function addCarRow() {
    setCars((prev) => [...prev, { carNumber: "", makeModel: "", warrantyDetails: "" }]);
  }

  function removeCarRow(index: number) {
    setCars((prev) => (prev.length === 1 ? prev : prev.filter((_, i) => i !== index)));
  }

  function addItemRow() {
    setItems((prev) => [...prev, { tyreType: "", quantity: "" }]);
  }

  function removeItemRow(index: number) {
    setItems((prev) => (prev.length === 1 ? prev : prev.filter((_, i) => i !== index)));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFeedback(null);

    if (!name.trim() || !mobile.trim()) {
      setFeedback({
        type: "error",
        message: "Name and mobile number are required.",
      });
      return;
    }

    const cleanedItems = items
      .map((it) => ({
        tyreType: it.tyreType.trim(),
        quantity: Number(it.quantity),
      }))
      .filter((it) => it.tyreType && it.quantity > 0);

    if (cleanedItems.length === 0) {
      setFeedback({
        type: "error",
        message: "Add at least one purchased item.",
      });
      return;
    }

    const cleanedCars = cars
      .map((car) => ({
        carNumber: car.carNumber.trim(),
        makeModel: car.makeModel.trim(),
        warrantyDetails: car.warrantyDetails.trim(),
      }))
      .filter((car) => car.carNumber || car.makeModel || car.warrantyDetails);

    setSubmitting(true);
    try {
      for (const item of cleanedItems) {
        // This will throw if stock is not available.
        // eslint-disable-next-line no-await-in-loop
        await useStock(item.tyreType, item.quantity);
      }

      await addCustomer({
        name: name.trim(),
        mobile: mobile.trim(),
        cars: cleanedCars,
        purchasedItems: cleanedItems,
      });

      setFeedback({
        type: "success",
        message: "Customer record saved successfully.",
      });
      setName("");
      setMobile("");
      setCars([{ carNumber: "", makeModel: "", warrantyDetails: "" }]);
      setItems([{ tyreType: "", quantity: "" }]);
    } catch (err) {
      setFeedback({
        type: "error",
        message: err instanceof Error ? err.message : "Failed to save customer.",
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
            Add Customer
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Create a customer record and record purchased items.
          </p>
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

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="customer-name"
                className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Name<span className="text-red-500">*</span>
              </label>
              <input
                id="customer-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={submitting}
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-500 dark:focus:ring-zinc-800"
                placeholder="Customer name"
              />
            </div>
            <div>
              <label
                htmlFor="customer-mobile"
                className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Mobile number<span className="text-red-500">*</span>
              </label>
              <input
                id="customer-mobile"
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                disabled={submitting}
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-500 dark:focus:ring-zinc-800"
                placeholder="e.g. 0300 1234567"
              />
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                Cars (optional)
              </h2>
              <button
                type="button"
                onClick={addCarRow}
                disabled={submitting}
                className="text-xs font-medium text-zinc-700 underline-offset-2 hover:underline dark:text-zinc-300"
              >
                Add another car
              </button>
            </div>
            <div className="space-y-3">
              {cars.map((car, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_auto]"
                >
                  <input
                    type="text"
                    placeholder="Car number"
                    value={car.carNumber}
                    onChange={(e) => updateCar(index, { carNumber: e.target.value })}
                    disabled={submitting}
                    className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-500 dark:focus:ring-zinc-800"
                  />
                  <input
                    type="text"
                    placeholder="Car make & model"
                    value={car.makeModel}
                    onChange={(e) => updateCar(index, { makeModel: e.target.value })}
                    disabled={submitting}
                    className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-500 dark:focus:ring-zinc-800"
                  />
                  <input
                    type="text"
                    placeholder="Warranty details"
                    value={car.warrantyDetails}
                    onChange={(e) =>
                      updateCar(index, { warrantyDetails: e.target.value })
                    }
                    disabled={submitting}
                    className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-500 dark:focus:ring-zinc-800"
                  />
                  <button
                    type="button"
                    onClick={() => removeCarRow(index)}
                    disabled={submitting || cars.length === 1}
                    className="self-center text-xs font-medium text-red-600 disabled:cursor-not-allowed disabled:opacity-50 dark:text-red-400"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                Purchased items
              </h2>
              <button
                type="button"
                onClick={addItemRow}
                disabled={submitting}
                className="text-xs font-medium text-zinc-700 underline-offset-2 hover:underline dark:text-zinc-300"
              >
                Add another item
              </button>
            </div>
            <div className="space-y-3">
              {items.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)_auto] gap-3"
                >
                  <TyreTypeSelect
                    options={tyreTypes}
                    value={item.tyreType}
                    onChange={(v) => updateItem(index, { tyreType: v })}
                    placeholder="Select tyre type"
                    disabled={submitting}
                  />
                  <input
                    type="number"
                    min="1"
                    placeholder="Amount"
                    value={item.quantity}
                    onChange={(e) => updateItem(index, { quantity: e.target.value })}
                    disabled={submitting}
                    className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-500 dark:focus:ring-zinc-800"
                  />
                  <button
                    type="button"
                    onClick={() => removeItemRow(index)}
                    disabled={submitting || items.length === 1}
                    className="text-xs font-medium text-red-600 disabled:cursor-not-allowed disabled:opacity-50 dark:text-red-400"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
            >
              {submitting ? "Saving..." : "Save Customer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

