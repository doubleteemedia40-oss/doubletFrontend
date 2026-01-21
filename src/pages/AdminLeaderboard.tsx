import { useEffect, useMemo, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import { useStore } from '../store/useStore';
import { Trophy, DollarSign, Calendar, Eye } from 'lucide-react';

const AdminLeaderboard = () => {
  const { orders, fetchOrders, allUsers, fetchAllUsers } = useStore();
  const [windowSize, setWindowSize] = useState<'all' | '30' | '90'>('all');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  useEffect(() => {
    fetchAllUsers();
    fetchOrders();
  }, [fetchAllUsers, fetchOrders]);

  const filteredOrders = useMemo(() => {
    if (windowSize === 'all') return orders;
    const days = windowSize === '30' ? 30 : 90;
    const baseline = orders.length ? new Date(orders[0].createdAt).getTime() : 0;
    const cutoff = baseline - days * 24 * 60 * 60 * 1000;
    return orders.filter(o => {
      const t = new Date(o.createdAt).getTime();
      return t >= cutoff;
    });
  }, [orders, windowSize]);

  const rankings = useMemo(() => {
    const totals: Record<string, { total: number; count: number }> = {};
    filteredOrders.forEach((o) => {
      if (!totals[o.userId]) totals[o.userId] = { total: 0, count: 0 };
      totals[o.userId].total += o.total;
      totals[o.userId].count += 1;
    });
    const rows = Object.entries(totals).map(([userId, stat]) => {
      const user = allUsers.find((u) => u.id === userId);
      return {
        userId,
        name: user?.name || 'Unknown',
        email: user?.email || '—',
        total: stat.total,
        ordersCount: stat.count,
      };
    });
    return rows.sort((a, b) => b.total - a.total);
  }, [filteredOrders, allUsers]);

  const totalRevenue = rankings.reduce((acc, r) => acc + r.total, 0);
  const ranks = useMemo(() => {
    const arr: number[] = [];
    let prevTotal: number | null = null;
    let prevRank = 0;
    rankings.forEach((r, idx) => {
      if (prevTotal !== null && r.total === prevTotal) {
        arr.push(prevRank);
      } else {
        const rank = idx + 1;
        arr.push(rank);
        prevRank = rank;
        prevTotal = r.total;
      }
    });
    return arr;
  }, [rankings]);

  return (
    <AdminLayout>
      <div className="p-6 md:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-[#00bfff]/10 p-3 rounded-lg text-[#00bfff]">
                <Trophy size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Leaderboard</h1>
                <p className="text-slate-400 text-sm mt-1">Top customers by purchase amount.</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <DollarSign size={18} className="text-[#00bfff]" />
              <span>Total Revenue: ₦{totalRevenue.toLocaleString()}</span>
            </div>
          </div>

          <div className="bg-[#18282e] border border-[#27353a] rounded-xl overflow-hidden">
            <div className="px-6 py-5 border-b border-[#27353a]">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-white">Top Buyers</h2>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <Calendar size={16} />
                  <select
                    className="bg-[#0f1e23] border border-[#27353a] rounded px-2 py-1 text-white"
                    value={windowSize}
                    onChange={(e) => setWindowSize(e.target.value as 'all' | '30' | '90')}
                  >
                    <option value="all">All time</option>
                    <option value="30">Last 30 days</option>
                    <option value="90">Last 90 days</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#1c2c32] text-slate-400 text-xs uppercase tracking-wider">
                    <th className="px-6 py-4 font-semibold">Rank</th>
                    <th className="px-6 py-4 font-semibold">Name</th>
                    <th className="px-6 py-4 font-semibold">Email</th>
                    <th className="px-6 py-4 font-semibold">Orders</th>
                    <th className="px-6 py-4 font-semibold">Total Spent</th>
                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#27353a]">
                  {rankings.map((r, idx) => (
                    <tr key={r.userId} className="hover:bg-[#1f3036] transition-colors">
                      <td className="px-6 py-4 text-sm font-bold text-white">
                        #{ranks[idx]}
                        {idx > 0 && rankings[idx - 1].total === r.total && (
                          <span className="ml-2 text-xs text-slate-400">(Tie)</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-white">{r.name}</td>
                      <td className="px-6 py-4 text-sm text-slate-300">{r.email}</td>
                      <td className="px-6 py-4 text-sm text-slate-300">{r.ordersCount}</td>
                      <td className="px-6 py-4 text-sm font-medium text-white">₦{r.total.toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm text-right">
                        <button
                          onClick={() => { setSelectedUserId(r.userId); }}
                          className="inline-flex items-center gap-1 text-[#00bfff] hover:text-white"
                          title="View Orders"
                        >
                          <Eye size={16} /> View
                        </button>
                      </td>
                    </tr>
                  ))}
                  {rankings.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-slate-500">No data available.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {selectedUserId && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
              <div className="w-full max-w-2xl bg-[#0f1e23] border border-[#27353a] rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-white">Orders</h3>
                  <button onClick={() => setSelectedUserId(null)} className="text-slate-400 hover:text-white">Close</button>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {orders.length > 0 ? (
                    <table className="w-full text-left">
                      <thead>
                        <tr className="text-slate-400 text-xs uppercase tracking-wider">
                          <th className="py-2">Order ID</th>
                          <th className="py-2">Date</th>
                          <th className="py-2">Amount</th>
                          <th className="py-2">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#27353a]">
                        {orders
                          .filter(o => o.userId === selectedUserId)
                          .filter(o => {
                            if (windowSize === 'all') return true;
                            const days = windowSize === '30' ? 30 : 90;
                            const baseline = orders.length ? new Date(orders[0].createdAt).getTime() : 0;
                            const cutoff = baseline - days * 24 * 60 * 60 * 1000;
                            return new Date(o.createdAt).getTime() >= cutoff;
                          })
                          .map(o => (
                            <tr key={o.id}>
                              <td className="py-2 text-white text-sm">#{o.id.slice(0,8)}</td>
                              <td className="py-2 text-slate-300 text-sm">{new Date(o.createdAt).toLocaleDateString()}</td>
                              <td className="py-2 text-white text-sm">₦{o.total.toLocaleString()}</td>
                              <td className="py-2 text-slate-300 text-sm">{o.status}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="text-slate-400">No orders found.</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminLeaderboard;
