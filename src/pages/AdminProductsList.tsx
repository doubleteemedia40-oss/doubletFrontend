import { useState, useMemo, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import { useStore } from '../store/useStore';
import type { Product } from '../store/useStore';
import { Package, Plus, Trash2, ArrowUpDown, Layers } from 'lucide-react';
import { useToast } from '../context/useToast';

const AdminProductsList = () => {
  const navigate = useNavigate();
  const { products, deleteProduct, isLoading, addInventory, inventoryCounts, fetchInventoryCounts, exportInventory, importInventory, fetchInventoryHistory } = useStore();
  const toast = useToast();
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'stock'>('name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [stockOpen, setStockOpen] = useState(false);
  const [stockProduct, setStockProduct] = useState<Product | null>(null);
  const [stockText, setStockText] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [validEntries, setValidEntries] = useState<string[]>([]);
  const [invalidEntries, setInvalidEntries] = useState<string[]>([]);
  const [dedupedEntries, setDedupedEntries] = useState<string[]>([]);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyItems, setHistoryItems] = useState<Array<{ productId: string; by: string; count: number; added: number; at: number; type?: string }>>([]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.description || '').toLowerCase().includes(q)
    );
  }, [products, search]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      const dir = sortDir === 'asc' ? 1 : -1;
      if (sortBy === 'name') return a.name.localeCompare(b.name) * dir;
      if (sortBy === 'price') return (a.price - b.price) * dir;
      return (a.stock - b.stock) * dir;
    });
    return arr;
  }, [filtered, sortBy, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const paged = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, page]);

  const handleDelete = async (product: Product) => {
    if (!window.confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
    try {
      await deleteProduct(product.id);
      toast.success('Product deleted');
    } catch {
      toast.error('Failed to delete product');
    }
  };
  
  useEffect(() => {
    fetchInventoryCounts().catch(() => {});
  }, [fetchInventoryCounts]);

  const handleBulkDelete = async () => {
    const ids = Object.keys(selected).filter(id => selected[id]);
    if (ids.length === 0) return;
    if (!window.confirm(`Delete ${ids.length} product(s)? This cannot be undone.`)) return;
    for (const id of ids) {
      const p = products.find(pr => pr.id === id);
      if (p) {
        try { await deleteProduct(id); } catch (e) { console.error(e); }
      }
    }
    toast.success('Selected products deleted');
    setSelected({});
  };
  
  const openStock = (p: Product) => {
    setStockProduct(p);
    setStockText('');
    setStockOpen(true);
  };
  
  const parseEntries = (raw: string) => {
    return raw
      .split(/\r?\n/)
      .map(s => s.trim())
      .filter(s => s.length > 0);
  };
  
  const isValidEntry = (s: string) => {
    const parts = s.split(':');
    if (parts.length < 3) return false;
    return parts[0].length > 0 && parts[1].length > 0 && parts[2].length > 0;
  };
  
  const computePreview = (raw: string) => {
    const all = parseEntries(raw);
    const valids = all.filter(isValidEntry);
    const invalids = all.filter(x => !isValidEntry(x));
    const set = new Set<string>();
    const deduped: string[] = [];
    for (const v of valids) {
      const key = v.toLowerCase();
      if (!set.has(key)) {
        set.add(key);
        deduped.push(v);
      }
    }
    setValidEntries(valids);
    setInvalidEntries(invalids);
    setDedupedEntries(deduped);
  };
  
  const handleStockSave = async () => {
    if (!stockProduct) return;
    computePreview(stockText);
    const entries = dedupedEntries;
    if (entries.length === 0) {
      toast.error('Paste one or more lines to stock');
      return;
    }
    try {
      const count = await addInventory(stockProduct.id, entries);
      toast.success(`Stocked ${count} item(s) for "${stockProduct.name}"`);
      setStockOpen(false);
      setStockProduct(null);
      setStockText('');
      setPreviewOpen(false);
      setValidEntries([]);
      setInvalidEntries([]);
      setDedupedEntries([]);
    } catch {
      toast.error('Failed to stock inventory');
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 md:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-[#00bfff]/10 p-3 rounded-lg text-[#00bfff]">
                <Package size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Products</h1>
                <p className="text-slate-400 text-sm mt-1">List of all products in the store.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="hidden sm:flex items-center bg-[#18282e] rounded-lg px-3 py-1.5 w-64 border border-[#27353a]">
                <input
                  className="bg-transparent border-none text-sm text-white focus:ring-0 w-full placeholder-slate-500 focus:outline-none"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <button
                onClick={() => navigate('/admin/manage-product')}
                className="flex items-center gap-2 px-4 py-2 bg-[#18282e] hover:bg-[#27353a] text-white text-sm font-medium rounded-lg border border-[#27353a] transition-colors"
              >
                <Plus size={18} />
                Add Product
              </button>
            </div>
          </div>

          <div className="bg-[#18282e] border border-[#27353a] rounded-xl overflow-hidden">
            <div className="px-6 py-5 border-b border-[#27353a] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-bold text-white">Product List</h2>
                <button
                  onClick={() => setSortDir(sortDir === 'asc' ? 'desc' : 'asc')}
                  className="inline-flex items-center gap-1 text-slate-300 hover:text-white"
                  title="Toggle sort direction"
                >
                  <ArrowUpDown size={16} />
                </button>
                <select
                  className="bg-[#0f1e23] border border-[#27353a] rounded px-2 py-1 text-white text-sm"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'name' | 'price' | 'stock')}
                >
                  <option value="name">Name</option>
                  <option value="price">Price</option>
                  <option value="stock">Stock</option>
                </select>
              </div>
              <div className="flex items-center gap-3">
                <div className="sm:hidden w-full max-w-xs">
                  <input
                    className="w-full bg-[#203239] border border-[#2d4048] rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-[#00bfff]"
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <button
                  onClick={handleBulkDelete}
                  disabled={Object.keys(selected).filter(id => selected[id]).length === 0}
                  className="px-3 py-2 text-sm rounded-lg border border-red-500/40 text-red-400 hover:bg-red-500/10"
                >
                  Delete Selected
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#1c2c32] text-slate-400 text-xs uppercase tracking-wider">
                    <th className="px-6 py-4 font-semibold">
                      <input
                        type="checkbox"
                        checked={paged.every(p => selected[p.id]) && paged.length > 0}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          const next = { ...selected };
                          paged.forEach(p => { next[p.id] = checked; });
                          setSelected(next);
                        }}
                      />
                    </th>
                    <th className="px-6 py-4 font-semibold">Name</th>
                    <th className="px-6 py-4 font-semibold">Category</th>
                    <th className="px-6 py-4 font-semibold">Price</th>
                    <th className="px-6 py-4 font-semibold">Stock</th>
                    <th className="px-6 py-4 font-semibold">Inventory</th>
                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#27353a]">
                  {paged.map((p) => (
                    <tr key={p.id} className="hover:bg-[#1f3036] transition-colors">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={!!selected[p.id]}
                          onChange={(e) => setSelected({ ...selected, [p.id]: e.target.checked })}
                        />
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-white">
                        <Link to={`/product/${p.id}`} className="hover:text-[#00bfff] transition-colors">
                          {p.name}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-300">{p.category}</td>
                      <td className="px-6 py-4 text-sm font-medium text-white">₦{p.price.toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm text-slate-300">{p.stock}</td>
                      <td className="px-6 py-4 text-sm text-slate-300">{inventoryCounts[p.id] ?? 0}</td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          to={`/product/${p.id}`}
                          className="inline-flex items-center gap-1 text-[#00bfff] hover:text-white transition-colors mr-3"
                          title="View"
                        >
                          View
                        </Link>
                        <Link
                          to={`/admin/manage-product/${p.id}`}
                          className="inline-flex items-center gap-1 text-slate-300 hover:text-white transition-colors mr-3"
                          title="Edit"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => openStock(p)}
                          className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors mr-3"
                          title="Stock"
                        >
                          <Layers size={18} />
                          Stock
                        </button>
                        <button
                          onClick={async () => {
                            try {
                              const data = await fetchInventoryHistory(p.id);
                              setHistoryItems(data.items || []);
                              setHistoryOpen(true);
                            } catch {
                              toast.error('Failed to load history');
                            }
                          }}
                          className="inline-flex items-center gap-1 text-slate-300 hover:text-white transition-colors mr-3"
                          title="History"
                        >
                          History
                        </button>
                        <button
                          onClick={async () => {
                            try {
                              const text = await exportInventory(p.id);
                              const blob = new Blob([text], { type: 'text/csv;charset=utf-8' });
                              const url = URL.createObjectURL(blob);
                              const a = document.createElement('a');
                              a.href = url;
                              a.download = `${p.name.replace(/\\W+/g, '_')}_inventory.csv`;
                              document.body.appendChild(a);
                              a.click();
                              document.body.removeChild(a);
                              URL.revokeObjectURL(url);
                              toast.success('Exported CSV');
                            } catch {
                              toast.error('Failed to export CSV');
                            }
                          }}
                          className="inline-flex items-center gap-1 text-sky-400 hover:text-sky-300 transition-colors mr-3"
                          title="Export CSV"
                        >
                          Export
                        </button>
                        <label className="inline-flex items-center gap-1 text-sky-400 hover:text-sky-300 transition-colors cursor-pointer mr-3" title="Import CSV">
                          <input
                            type="file"
                            accept=".csv,text/csv"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              try {
                                const text = await file.text();
                                const count = await importInventory(p.id, text);
                                toast.success(`Imported. Total: ${count}`);
                                fetchInventoryCounts().catch(() => {});
                              } catch {
                                toast.error('Failed to import CSV');
                              } finally {
                                e.target.value = '';
                              }
                            }}
                          />
                          Import
                        </label>
                        <button
                          onClick={() => handleDelete(p)}
                          disabled={isLoading}
                          className="inline-flex items-center gap-1 text-red-400 hover:text-red-300 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-slate-500">No products found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-4 border-t border-[#27353a] flex items-center justify-between">
              <div className="text-slate-400 text-sm">
                Page {page} of {totalPages}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="px-3 py-1 rounded border border-[#27353a] text-slate-300 disabled:opacity-50"
                >
                  Prev
                </button>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="px-3 py-1 rounded border border-[#27353a] text-slate-300 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {stockOpen && stockProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-xl bg-[#0f1e23] border border-[#27353a] rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white text-lg font-bold">Stock Inventory</h3>
              <button onClick={() => setStockOpen(false)} className="text-slate-300 hover:text-white">×</button>
            </div>
            <p className="text-slate-300 text-sm mb-3">
              Add entries for: <span className="font-semibold">{stockProduct.name}</span>
            </p>
            <textarea
              className="w-full h-40 bg-[#18282e] border border-[#27353a] rounded-lg p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#00bfff]"
              placeholder="One item per line (e.g. user:pass:secret)..."
              value={stockText}
              onChange={(e) => setStockText(e.target.value)}
            />
            <div className="mt-3 flex items-center justify-between">
              <div className="text-xs text-slate-400">
                {previewOpen ? (
                  <span>
                    Valid: <span className="text-emerald-400">{validEntries.length}</span> · Invalid: <span className="text-rose-400">{invalidEntries.length}</span> · Unique: <span className="text-sky-400">{dedupedEntries.length}</span>
                  </span>
                ) : (
                  <span>Run preview to validate and deduplicate</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { computePreview(stockText); setPreviewOpen(true); }}
                  className="px-3 py-1.5 rounded-lg border border-[#27353a] text-slate-300 hover:text-white text-xs"
                >
                  Preview
                </button>
                <button
                  onClick={() => {
                    computePreview(stockText);
                    setPreviewOpen(true);
                    setStockText(dedupedEntries.join('\n'));
                    toast.info('Cleaned invalid and duplicates');
                  }}
                  className="px-3 py-1.5 rounded-lg border border-[#27353a] text-slate-300 hover:text-white text-xs"
                >
                  Clean
                </button>
              </div>
            </div>
            {previewOpen && invalidEntries.length > 0 && (
              <div className="mt-3 bg-[#1a2a30] border border-[#27353a] rounded-lg p-3">
                <p className="text-xs text-rose-400 mb-2">Invalid lines:</p>
                <div className="max-h-24 overflow-y-auto">
                  {invalidEntries.slice(0, 8).map((line, idx) => (
                    <div key={idx} className="text-xs text-slate-300">{line}</div>
                  ))}
                  {invalidEntries.length > 8 && (
                    <div className="text-xs text-slate-500 mt-1">+{invalidEntries.length - 8} more</div>
                  )}
                </div>
              </div>
            )}
            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => setStockOpen(false)}
                className="px-4 py-2 rounded-lg border border-[#27353a] text-slate-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleStockSave}
                className="px-4 py-2 rounded-lg bg-[#00bfff] text-black font-semibold hover:bg-[#00bfff]/90"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      
      {historyOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-xl bg-[#0f1e23] border border-[#27353a] rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white text-lg font-bold">Inventory History</h3>
              <button onClick={() => setHistoryOpen(false)} className="text-slate-300 hover:text-white">×</button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto">
              {historyItems.length === 0 && (
                <div className="text-slate-400 text-sm">No history found.</div>
              )}
              {historyItems.map((h, idx) => (
                <div key={idx} className="py-2 border-b border-[#27353a] text-sm text-slate-300">
                  <div className="flex justify-between">
                    <span>By: <span className="text-white">{h.by}</span></span>
                    <span>{new Date(h.at).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Added: <span className="text-emerald-400">+{h.added}</span></span>
                    <span>Total Count: <span className="text-sky-400">{h.count}</span></span>
                  </div>
                  {h.type && <div className="mt-1 text-xs text-slate-500">Type: {h.type}</div>}
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setHistoryOpen(false)}
                className="px-4 py-2 rounded-lg border border-[#27353a] text-slate-300 hover:text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminProductsList;
