"use client";

import { useState } from "react";
import { useInventory, updateTyre, deleteTyre } from "@/hooks";

export default function Dashboard() {
  const { inventory, loading, error } = useInventory();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState({ type: "", newQty: 0, usedQty: 0 });
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const totalNew = inventory.reduce((sum, item) => sum + item.newQty, 0);
  const totalUsed = inventory.reduce((sum, item) => sum + item.usedQty, 0);
  const deleteItem = inventory.find((item) => item.id === deleteId);

  function handleEdit(id: string) {
    const item = inventory.find((i) => i.id === id);
    if (!item) return;
    setEditValues({ type: item.type, newQty: item.newQty, usedQty: item.usedQty });
    setEditingId(id);
  }

  async function handleSave() {
    if (editingId === null) return;
    await updateTyre(editingId, editValues);
    setEditingId(null);
  }

  function handleCancel() {
    setEditingId(null);
  }

  async function handleDelete() {
    if (deleteId === null) return;
    await deleteTyre(deleteId);
    setDeleteId(null);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center px-4 pt-24 pb-12">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Loading inventory...</p>
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
        <div className="mb-8">
          <h1 className="mb-1 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Inventory
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Overview of all tyres in stock.
          </p>
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

        {inventory.length === 0 ? (
          <div className="rounded-lg border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              No tyres in inventory. Add some from the Add Tyre page.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
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
                  <th className="px-4 py-3 text-right font-medium text-zinc-700 dark:text-zinc-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {inventory.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-zinc-100 bg-white last:border-b-0 dark:border-zinc-800/50 dark:bg-zinc-950"
                  >
                    {editingId === item.id ? (
                      <>
                        <td className="px-4 py-2">
                          <input
                            type="text"
                            value={editValues.type}
                            onChange={(e) =>
                              setEditValues((v) => ({ ...v, type: e.target.value }))
                            }
                            className="w-full rounded-md border border-zinc-300 bg-white px-2 py-1 text-sm text-zinc-900 outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:border-zinc-500 dark:focus:ring-zinc-800"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="number"
                            value={editValues.newQty}
                            onChange={(e) =>
                              setEditValues((v) => ({ ...v, newQty: Number(e.target.value) }))
                            }
                            className="w-full rounded-md border border-zinc-300 bg-white px-2 py-1 text-right text-sm text-zinc-900 outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:border-zinc-500 dark:focus:ring-zinc-800"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="number"
                            value={editValues.usedQty}
                            onChange={(e) =>
                              setEditValues((v) => ({ ...v, usedQty: Number(e.target.value) }))
                            }
                            className="w-full rounded-md border border-zinc-300 bg-white px-2 py-1 text-right text-sm text-zinc-900 outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:border-zinc-500 dark:focus:ring-zinc-800"
                          />
                        </td>
                        <td className="px-4 py-3 text-right text-zinc-600 dark:text-zinc-400">
                          {(editValues.newQty - editValues.usedQty).toLocaleString()}
                        </td>
                        <td className="px-4 py-2 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={handleSave}
                              className="rounded-md bg-zinc-900 px-2.5 py-1 text-xs font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
                            >
                              Save
                            </button>
                            <button
                              onClick={handleCancel}
                              className="rounded-md border border-zinc-300 px-2.5 py-1 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                            >
                              Cancel
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
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
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEdit(item.id)}
                              className="rounded-md p-1 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:text-zinc-500 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
                              title="Edit"
                            >
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => setDeleteId(item.id)}
                              className="rounded-md p-1 text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:text-zinc-500 dark:hover:bg-red-950 dark:hover:text-red-400"
                              title="Delete"
                            >
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {deleteId !== null && deleteItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-sm rounded-lg border border-zinc-200 bg-white p-6 shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              Delete Tyre
            </h3>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              Are you sure you want to delete{" "}
              <span className="font-medium text-zinc-900 dark:text-zinc-100">
                {deleteItem.type}
              </span>
              ? This action cannot be undone.
            </p>
            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
