import { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import { useStore } from '../store/useStore';
import type { Product } from '../store/useStore';
import { Package, Plus, Trash2, ArrowUpDown } from 'lucide-react';
import { useToast } from '../context/useToast';

const AdminProductsList = () => {
  const navigate = useNavigate();
  const { products, deleteProduct, isLoading } = useStore();
  const toast = useToast();
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'stock'>('name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [selected, setSelected] = useState<Record<string, boolean>>({});

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
    </AdminLayout>
  );
};

export default AdminProductsList;
