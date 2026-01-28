import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { seedProducts } from '../utils/seedProducts';
import { useToast } from '../context/useToast';
import AdminLayout from '../components/AdminLayout';
import { Database, Layers, TrendingUp, ShoppingCart, DollarSign, Users, MoreVertical } from 'lucide-react';
import { useEffect } from 'react';

const AdminDashboard = () => {
  const { products, orders, user, fetchProducts } = useStore();
  const toast = useToast();
  const [isSeeding, setIsSeeding] = useState(false);
  const [systemStatus, setSystemStatus] = useState<{ flutterwaveConfigured: boolean; firebaseConfigured: boolean; maintenance: boolean } | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSeed = async () => {
    if (!window.confirm('Are you sure you want to seed products? This might create duplicates if not careful.')) return;

    setIsSeeding(true);
    try {
      const result = await seedProducts();
      toast.success(result.message);
      window.location.reload();
    } catch (error) {
      console.error(error);
      toast.error('Failed to seed products');
    } finally {
      setIsSeeding(false);
    }
  };

  const stats = {
    totalProducts: products.length,
    totalOrders: orders.length,
    revenue: orders.reduce((acc, order) => acc + order.total, 0),
    activeCustomers: new Set(orders.map(o => o.email)).size,
  };

  useEffect(() => {
    const base = import.meta.env.VITE_API_URL || 'http://localhost:4000';
    fetch(`${base}/api/health`)
      .then(res => res.json())
      .then(data => setSystemStatus(data.config))
      .catch(() => setSystemStatus(null));
  }, []);

  useEffect(() => {
    if (user?.isAdmin) {
      fetchProducts(1000);
    }
  }, [user, fetchProducts]);

  const toggleMaintenance = async () => {
    try {
      setIsUpdating(true);
      const base = import.meta.env.VITE_API_URL || 'http://localhost:4000';
      const token = useStore.getState().token;
      const res = await fetch(`${base}/api/config`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ maintenance: !(systemStatus?.maintenance) }),
      });
      if (!res.ok) throw new Error('Failed to update config');
      const data = await res.json();
      setSystemStatus(data.config);
      toast.success(`Maintenance ${data.config.maintenance ? 'enabled' : 'disabled'}`);
    } catch {
      toast.error('Failed to update maintenance');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 md:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-slate-400 text-sm mt-1">Overview of DoubleT Media platform metrics.</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-500">Last updated: Just now</span>
              <button
                onClick={handleSeed}
                disabled={isSeeding}
                className="flex items-center gap-2 px-4 py-2 bg-[#18282e] hover:bg-[#27353a] text-white text-sm font-medium rounded-lg border border-[#27353a] transition-colors"
              >
                <Database size={18} />
                {isSeeding ? 'Seeding...' : 'Seed Data'}
              </button>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1 */}
            <div className="bg-[#18282e] border border-[#27353a] rounded-xl p-6 hover:border-[#00bfff]/50 transition-colors group">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-[#00bfff]/10 p-3 rounded-lg text-[#00bfff] group-hover:bg-[#00bfff] group-hover:text-[#0f1e23] transition-colors">
                  <Layers size={24} />
                </div>
                <span className="flex items-center text-xs font-medium text-green-500 bg-green-500/10 px-2 py-1 rounded">
                  +12%
                  <TrendingUp size={14} className="ml-0.5" />
                </span>
              </div>
              <p className="text-slate-400 text-sm font-medium">Total Products</p>
              <h3 className="text-2xl font-bold text-white mt-1">{stats.totalProducts}</h3>
            </div>
            {/* Card 2 */}
            <div className="bg-[#18282e] border border-[#27353a] rounded-xl p-6 hover:border-[#00bfff]/50 transition-colors group">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-[#00bfff]/10 p-3 rounded-lg text-[#00bfff] group-hover:bg-[#00bfff] group-hover:text-[#0f1e23] transition-colors">
                  <ShoppingCart size={24} />
                </div>
                <span className="flex items-center text-xs font-medium text-green-500 bg-green-500/10 px-2 py-1 rounded">
                  +5%
                  <TrendingUp size={14} className="ml-0.5" />
                </span>
              </div>
              <p className="text-slate-400 text-sm font-medium">Total Orders</p>
              <h3 className="text-2xl font-bold text-white mt-1">{stats.totalOrders}</h3>
            </div>
            {/* Card 3 */}
            <div className="bg-[#18282e] border border-[#27353a] rounded-xl p-6 hover:border-[#00bfff]/50 transition-colors group">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-[#00bfff]/10 p-3 rounded-lg text-[#00bfff] group-hover:bg-[#00bfff] group-hover:text-[#0f1e23] transition-colors">
                  <DollarSign size={24} />
                </div>
                <span className="flex items-center text-xs font-medium text-green-500 bg-green-500/10 px-2 py-1 rounded">
                  +8%
                  <TrendingUp size={14} className="ml-0.5" />
                </span>
              </div>
              <p className="text-slate-400 text-sm font-medium">Total Revenue</p>
              <h3 className="text-2xl font-bold text-white mt-1">₦{stats.revenue.toLocaleString()}</h3>
            </div>
            {/* Card 4 */}
            <div className="bg-[#18282e] border border-[#27353a] rounded-xl p-6 hover:border-[#00bfff]/50 transition-colors group">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-[#00bfff]/10 p-3 rounded-lg text-[#00bfff] group-hover:bg-[#00bfff] group-hover:text-[#0f1e23] transition-colors">
                  <Users size={24} />
                </div>
                <span className="flex items-center text-xs font-medium text-green-500 bg-green-500/10 px-2 py-1 rounded">
                  +2%
                  <TrendingUp size={14} className="ml-0.5" />
                </span>
              </div>
              <p className="text-slate-400 text-sm font-medium">Active Customers</p>
              <h3 className="text-2xl font-bold text-white mt-1">{stats.activeCustomers}</h3>
            </div>
          </div>

          {/* System Status */}
          <div className="bg-[#18282e] border border-[#27353a] rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">System Status</h2>
              <button
                onClick={toggleMaintenance}
                disabled={isUpdating || !systemStatus}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors border ${systemStatus?.maintenance ? 'bg-yellow-500 text-black border-yellow-500' : 'bg-emerald-500 text-black border-emerald-500'}`}
              >
                {isUpdating ? 'Updating...' : (systemStatus?.maintenance ? 'Disable Maintenance' : 'Enable Maintenance')}
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg border border-[#27353a] bg-[#0f1e23]">
                <p className="text-slate-400 text-xs">Flutterwave</p>
                <p className={`text-sm font-bold ${systemStatus?.flutterwaveConfigured ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {systemStatus?.flutterwaveConfigured ? 'Configured' : 'Missing'}
                </p>
              </div>
              <div className="p-4 rounded-lg border border-[#27353a] bg-[#0f1e23]">
                <p className="text-slate-400 text-xs">Firebase</p>
                <p className={`text-sm font-bold ${systemStatus?.firebaseConfigured ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {systemStatus?.firebaseConfigured ? 'Configured' : 'Missing'}
                </p>
              </div>
              <div className="p-4 rounded-lg border border-[#27353a] bg-[#0f1e23]">
                <p className="text-slate-400 text-xs">Maintenance Mode</p>
                <p className={`text-sm font-bold ${systemStatus?.maintenance ? 'text-yellow-400' : 'text-emerald-400'}`}>
                  {systemStatus?.maintenance ? 'Enabled' : 'Disabled'}
                </p>
              </div>
            </div>
          </div>

          {/* Recent Orders Table */}
          <div className="bg-[#18282e] border border-[#27353a] rounded-xl overflow-hidden">
            <div className="px-6 py-5 border-b border-[#27353a] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-lg font-bold text-white">Recent Orders</h2>
              <Link to="/admin/orders">
                <button className="text-sm text-[#00bfff] hover:text-white transition-colors font-medium">View All Orders</button>
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#1c2c32] text-slate-400 text-xs uppercase tracking-wider">
                    <th className="px-6 py-4 font-semibold">Order ID</th>
                    <th className="px-6 py-4 font-semibold">Customer</th>
                    <th className="px-6 py-4 font-semibold">Product</th>
                    <th className="px-6 py-4 font-semibold">Date</th>
                    <th className="px-6 py-4 font-semibold">Amount</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#27353a]">
                  {orders.slice(0, 5).map((order) => (
                    <tr key={order.id} className="hover:bg-[#1f3036] transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-white">#{order.id.slice(0, 8)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold">
                            {order.customer.slice(0, 2).toUpperCase()}
                          </div>
                          <span className="text-sm text-slate-300">{order.customer}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-300">
                        {/* We don't have product details directly in order summary usually, but we have total. 
                              For now showing 'Digital Product' or first item if available */}
                        Digital Product
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-400">{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-sm font-medium text-white">₦{order.total}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${order.status === 'Delivered' ? 'bg-green-500/10 text-green-500' :
                            order.status === 'Processing' ? 'bg-blue-500/10 text-blue-400' :
                              order.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-500' :
                                'bg-red-500/10 text-red-500'
                          }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-slate-400 hover:text-[#00bfff] transition-colors">
                          <MoreVertical size={20} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-6 py-8 text-center text-slate-500">
                        No orders found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
