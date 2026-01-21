import { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import { useStore } from '../store/useStore';
import { Users, Shield, ShieldOff, XCircle, CheckCircle, Eye } from 'lucide-react';
import { useToast } from '../context/useToast';

const AdminUsersList = () => {
  const { allUsers, fetchAllUsers, updateUserRole, setUserActive, fetchUserOrders, orders } = useStore();
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const toast = useToast();

  useEffect(() => {
    fetchAllUsers();
  }, [fetchAllUsers]);

  return (
    <AdminLayout>
      <div className="p-6 md:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-[#00bfff]/10 p-3 rounded-lg text-[#00bfff]">
                <Users size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Users</h1>
                <p className="text-slate-400 text-sm mt-1">Manage registered users.</p>
              </div>
            </div>
            <div className="text-sm text-slate-400">Total: {allUsers.length}</div>
          </div>

          <div className="bg-[#18282e] border border-[#27353a] rounded-xl overflow-hidden">
            <div className="px-6 py-5 border-b border-[#27353a]">
              <h2 className="text-lg font-bold text-white">User List</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#1c2c32] text-slate-400 text-xs uppercase tracking-wider">
                    <th className="px-6 py-4 font-semibold">Name</th>
                    <th className="px-6 py-4 font-semibold">Email</th>
                    <th className="px-6 py-4 font-semibold">Role</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold">User ID</th>
                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#27353a]">
                  {allUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-[#1f3036] transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-white">{user.name}</td>
                      <td className="px-6 py-4 text-sm text-slate-300">{user.email}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.isAdmin ? 'bg-purple-500/10 text-purple-400' : 'bg-slate-500/10 text-slate-300'
                        }`}>
                          {user.isAdmin ? 'Admin' : 'Customer'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.active === false ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'
                        }`}>
                          {user.active === false ? <XCircle size={14} /> : <CheckCircle size={14} />}
                          {user.active === false ? 'Inactive' : 'Active'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-400">{user.id}</td>
                      <td className="px-6 py-4 text-sm text-right">
                        <button
                          onClick={async () => { await updateUserRole(user.id, !user.isAdmin); toast.success('User role updated'); }}
                          className="inline-flex items-center gap-1 text-slate-300 hover:text-white mr-3"
                          title={user.isAdmin ? 'Remove Admin' : 'Make Admin'}
                        >
                          {user.isAdmin ? <ShieldOff size={16} /> : <Shield size={16} />}
                          {user.isAdmin ? 'Remove Admin' : 'Make Admin'}
                        </button>
                        <button
                          onClick={async () => { await setUserActive(user.id, user.active === false ? true : false); toast.success('User status updated'); }}
                          className="inline-flex items-center gap-1 text-slate-300 hover:text-white mr-3"
                          title={user.active === false ? 'Activate' : 'Deactivate'}
                        >
                          {user.active === false ? <CheckCircle size={16} /> : <XCircle size={16} />}
                          {user.active === false ? 'Activate' : 'Deactivate'}
                        </button>
                        <button
                          onClick={async () => { setSelectedUser(user.id); setIsDetailOpen(true); await fetchUserOrders(user.id); }}
                          className="inline-flex items-center gap-1 text-[#00bfff] hover:text-white"
                          title="View Details"
                        >
                          <Eye size={16} />
                          Details
                        </button>
                      </td>
                    </tr>
                  ))}
                  {allUsers.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-slate-500">No users found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {isDetailOpen && selectedUser && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
              <div className="w-full max-w-2xl bg-[#0f1e23] border border-[#27353a] rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-white">User Orders</h3>
                  <button onClick={() => setIsDetailOpen(false)} className="text-slate-400 hover:text-white">Close</button>
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
                        {orders.map(o => (
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
                    <p className="text-slate-400">No orders found for this user.</p>
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

export default AdminUsersList;
