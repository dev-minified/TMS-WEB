"use client";

import { useMemo, useState } from "react";
import { useCustomers } from "@/hooks";

export default function CustomersPage() {
  const { customers, loading, error } = useCustomers();
  const [search, setSearch] = useState("");

  const filteredCustomers = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return customers;

    return customers.filter((c) => {
      const haystack = [
        c.name,
        c.mobile,
        ...c.cars.flatMap((car) => [car.carNumber, car.makeModel, car.warrantyDetails ?? ""]),
        ...c.purchasedItems.flatMap((item) => [item.tyreType, String(item.quantity)]),
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(q);
    });
  }, [customers, search]);

  if (loading) {
    return (
      <div className="flex items-center justify-center px-4 pt-24 pb-12">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Loading customers...
        </p>
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
        <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="mb-1 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
              Customers
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              View customer details and their purchased items.
            </p>
          </div>
          {customers.length > 0 && (
            <div className="w-full sm:w-80">
              <label className="sr-only" htmlFor="customer-search">
                Search customers
              </label>
              <input
                id="customer-search"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, mobile, car, or tyre type..."
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-500 dark:focus:ring-zinc-800"
              />
            </div>
          )}
        </div>

        {customers.length === 0 ? (
          <div className="rounded-lg border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              No customers found. Add a customer from the Add Customer page.
            </p>
          </div>
        ) : (
          filteredCustomers.length === 0 ? (
            <div className="rounded-lg border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-900">
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                No results found for{" "}
                <span className="font-medium text-zinc-900 dark:text-zinc-100">
                  {search.trim()}
                </span>
                .
              </p>
            </div>
          ) : (
          <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
                  <th className="px-4 py-3 font-medium text-zinc-700 dark:text-zinc-300">
                    Customer
                  </th>
                  <th className="px-4 py-3 font-medium text-zinc-700 dark:text-zinc-300">
                    Mobile
                  </th>
                  <th className="hidden px-4 py-3 font-medium text-zinc-700 dark:text-zinc-300 sm:table-cell">
                    Cars
                  </th>
                  <th className="px-4 py-3 font-medium text-zinc-700 dark:text-zinc-300">
                    Purchased items
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-zinc-700 dark:text-zinc-300">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer) => (
                  <tr
                    key={customer.id}
                    className="border-b border-zinc-100 bg-white last:border-b-0 dark:border-zinc-800/50 dark:bg-zinc-950"
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium text-zinc-900 dark:text-zinc-100">
                        {customer.name}
                      </p>
                      {customer.cars.length > 0 && (
                        <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400 sm:hidden">
                          {customer.cars.length} car
                          {customer.cars.length === 1 ? "" : "s"}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-zinc-600 dark:text-zinc-300">
                      {customer.mobile}
                    </td>
                    <td className="hidden px-4 py-3 sm:table-cell">
                      {customer.cars.length === 0 ? (
                        <span className="text-zinc-400 dark:text-zinc-500">
                          —
                        </span>
                      ) : (
                        <div className="space-y-1">
                          {customer.cars.slice(0, 2).map((car, index) => (
                            <div
                              key={`${car.carNumber}-${index}`}
                              className="text-xs text-zinc-600 dark:text-zinc-300"
                            >
                              <span className="font-medium">
                                {car.carNumber || "Car"}
                              </span>
                              {car.makeModel ? ` · ${car.makeModel}` : ""}
                              {car.warrantyDetails ? (
                                <span className="block text-zinc-500 dark:text-zinc-400">
                                  Warranty: {car.warrantyDetails}
                                </span>
                              ) : null}
                            </div>
                          ))}
                          {customer.cars.length > 2 && (
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">
                              +{customer.cars.length - 2} more
                            </p>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {customer.purchasedItems.length === 0 ? (
                        <span className="text-zinc-400 dark:text-zinc-500">
                          —
                        </span>
                      ) : (
                        <div className="space-y-1">
                          {customer.purchasedItems.slice(0, 3).map((item, index) => (
                            <div
                              key={`${item.tyreType}-${index}`}
                              className="text-xs text-zinc-600 dark:text-zinc-300"
                            >
                              <span className="font-medium">{item.tyreType}</span>{" "}
                              · {item.quantity.toLocaleString()} pcs
                            </div>
                          ))}
                          {customer.purchasedItems.length > 3 && (
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">
                              +{customer.purchasedItems.length - 3} more
                            </p>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right text-xs text-zinc-500 dark:text-zinc-400">
                      {customer.createdAt
                        ? customer.createdAt.toLocaleDateString()
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          )
        )}
      </div>
    </div>
  );
}

