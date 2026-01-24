import { useState } from 'react';
import { useStore } from '../store/useStore';
import AdminLayout from '../components/AdminLayout';
import { Upload, Download, Tag, User, ChevronDown, MoreVertical, Eye, Check, Trash2, Key, X, Save, Send } from 'lucide-react';

const AdminOrdersList = () => {
  const { orders, loadMoreOrders, updateOrderDelivery, updateOrderStatus, resendReleaseEmail, resendPartialEmail } = useStore();
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState('All Statuses');
  const [searchTerm, setSearchTerm] = useState('');
  const [deliveryOpen, setDeliveryOpen] = useState(false);
  const [deliveryText, setDeliveryText] = useState('');
  const [deliveryOrderId, setDeliveryOrderId] = useState<string | null>(null);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedOrders(orders.map(o => o.id));
    } else {
      setSelectedOrders([]);
    }
  };

  const handleSelectOrder = (id: string) => {
    if (selectedOrders.includes(id)) {
      setSelectedOrders(selectedOrders.filter(o => o !== id));
    } else {
      setSelectedOrders([...selectedOrders, id]);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus = filterStatus === 'All Statuses' || order.status === filterStatus;
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          order.customer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <AdminLayout>
      <div className="p-6 lg:p-10 custom-scrollbar">
        <div className="max-w-7xl mx-auto flex flex-col gap-6">
          
          {/* Page Heading */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">Orders Management</h2>
                <p className="text-[#9ab3bc] text-sm mt-1">Manage and track all customer digital account orders.</p>
              </div>
              <div className="flex gap-3">
                <button className="flex items-center justify-center gap-2 px-4 py-2 bg-[#27353a] hover:bg-[#364950] text-white text-sm font-medium rounded-lg transition-colors border border-[#394f56]">
                  <Upload size={18} />
                  Import
                </button>
                <button className="flex items-center justify-center gap-2 px-4 py-2 bg-[#00bfff] hover:bg-[#00bfff]/90 text-[#0f1e23] text-sm font-bold rounded-lg transition-colors shadow-lg shadow-[#00bfff]/20">
                  <Download size={18} />
                  Export Orders
                </button>
              </div>
            </div>

            {/* Filters Section */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-[#1b2428] p-4 rounded-xl border border-[#27353a]">
              <div className="md:col-span-3">
                <label className="block text-xs font-medium text-[#9ab3bc] mb-1.5 ml-1">Order ID</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Tag size={18} className="text-[#56686e]" />
                  </span>
                  <input 
                    className="w-full bg-[#101618] border border-[#394f56] text-white text-sm rounded-lg focus:ring-[#00bfff] focus:border-[#00bfff] block pl-9 p-2.5 placeholder-[#56686e]" 
                    placeholder="e.g. ORD-2491" 
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="md:col-span-4">
                <label className="block text-xs font-medium text-[#9ab3bc] mb-1.5 ml-1">Customer</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={18} className="text-[#56686e]" />
                  </span>
                  <input 
                    className="w-full bg-[#101618] border border-[#394f56] text-white text-sm rounded-lg focus:ring-[#00bfff] focus:border-[#00bfff] block pl-9 p-2.5 placeholder-[#56686e]" 
                    placeholder="Search by name or email" 
                    type="text"
                    // In a real app, this might be a separate state or combined with search
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="md:col-span-3">
                <label className="block text-xs font-medium text-[#9ab3bc] mb-1.5 ml-1">Status</label>
                <div className="relative">
                  <select 
                    className="w-full bg-[#101618] border border-[#394f56] text-white text-sm rounded-lg focus:ring-[#00bfff] focus:border-[#00bfff] block p-2.5 appearance-none"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option>All Statuses</option>
                    <option>Delivered</option>
                    <option>Processing</option>
                    <option>Pending</option>
                    <option>Failed</option>
                    <option>Refunded</option>
                  </select>
                  <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <ChevronDown size={20} className="text-[#56686e]" />
                  </span>
                </div>
              </div>
              <div className="md:col-span-2 flex items-end">
                <button className="w-full bg-[#27353a] hover:bg-[#364950] text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-colors h-[42px]">
                  Filter
                </button>
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-[#1b2428] border border-[#27353a] rounded-xl overflow-hidden shadow-sm flex flex-col">
              {/* Bulk Actions Header */}
              {selectedOrders.length > 0 && (
                <div className="bg-[#00bfff]/10 border-b border-[#00bfff]/20 px-6 py-3 flex items-center justify-between">
                  <span className="text-sm text-[#00bfff] font-medium">{selectedOrders.length} items selected</span>
                  <div className="flex gap-3">
                    <button className="text-xs font-medium text-white hover:text-[#00bfff] transition-colors flex items-center gap-1">
                      <Check size={14} />
                      Mark as Completed
                    </button>
                    <button className="text-xs font-medium text-red-400 hover:text-red-300 transition-colors flex items-center gap-1">
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                </div>
              )}
              
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm text-left text-[#9ab3bc]">
                  <thead className="text-xs text-[#9ab3bc] uppercase bg-[#27353a] border-b border-[#394f56]">
                    <tr>
                      <th className="p-4 w-4" scope="col">
                        <div className="flex items-center">
                          <input 
                            className="w-4 h-4 text-[#00bfff] bg-[#101618] border-[#56686e] rounded focus:ring-[#00bfff] focus:ring-2 focus:ring-offset-0" 
                            type="checkbox"
                            onChange={handleSelectAll}
                            checked={selectedOrders.length === orders.length && orders.length > 0}
                          />
                        </div>
                      </th>
                      <th className="px-6 py-3 font-semibold" scope="col">Order ID</th>
                      <th className="px-6 py-3 font-semibold" scope="col">Date</th>
                      <th className="px-6 py-3 font-semibold" scope="col">Customer</th>
                      <th className="px-6 py-3 font-semibold" scope="col">Product</th>
                      <th className="px-6 py-3 font-semibold text-right" scope="col">Total</th>
                      <th className="px-6 py-3 font-semibold text-center" scope="col">Payment</th>
                      <th className="px-6 py-3 font-semibold text-center" scope="col">Status</th>
                      <th className="px-6 py-3 font-semibold text-right" scope="col">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#27353a]">
                    {filteredOrders.map((order) => (
                      <tr key={order.id} className="bg-[#1b2428] hover:bg-[#202b30] transition-colors group">
                        <td className="w-4 p-4">
                          <div className="flex items-center">
                            <input 
                              className="w-4 h-4 text-[#00bfff] bg-[#101618] border-[#56686e] rounded focus:ring-[#00bfff] focus:ring-2 focus:ring-offset-0" 
                              type="checkbox"
                              checked={selectedOrders.includes(order.id)}
                              onChange={() => handleSelectOrder(order.id)}
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4 font-mono text-white font-medium group-hover:text-[#00bfff] transition-colors cursor-pointer">
                          #{order.id.slice(0, 8)}
                        </td>
                        <td className="px-6 py-4">
                          {new Date(order.createdAt).toLocaleDateString()} 
                          <br/><span className="text-xs opacity-70">{new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-white font-medium">{order.customer}</span>
                            <span className="text-xs">{order.email}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-white">Digital Product</td>
                        <td className="px-6 py-4 text-right font-medium text-white">₦{order.total}</td>
                        <td className="px-6 py-4 text-center">
                          <span className="bg-green-500/10 text-green-400 text-xs font-medium px-2.5 py-0.5 rounded border border-green-500/20">Paid</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded border text-xs font-medium justify-center gap-1 w-fit mx-auto ${
                            order.status === 'Delivered' ? 'bg-[#00bfff]/10 text-[#00bfff] border-[#00bfff]/20' :
                            order.status === 'Processing' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                            order.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                            'bg-red-500/10 text-red-400 border-red-500/20'
                          }`}>
                            {order.status === 'Pending' && <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse"></span>}
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="inline-flex gap-2">
                            <button
                              className="text-[#9ab3bc] hover:text-white p-1 rounded hover:bg-[#27353a]"
                              title="Add Credentials"
                              onClick={async () => {
                                setDeliveryOrderId(order.id);
                                setDeliveryText(order.delivery?.details || '');
                                setDeliveryOpen(true);
                              }}
                            >
                              <Key size={20} />
                            </button>
                            <button
                              className="text-[#9ab3bc] hover:text-white p-1 rounded hover:bg-[#27353a]"
                              title="Mark Delivered"
                              onClick={async () => {
                                try {
                                  await updateOrderStatus(order.id, 'Delivered');
                                } catch (e) {
                                  console.error(e);
                                }
                              }}
                            >
                              <Check size={20} />
                            </button>
                            {(order.status === 'Delivered' || order.status === 'Completed') && (
                              <button
                                className="text-[#9ab3bc] hover:text-white p-1 rounded hover:bg-[#27353a]"
                                title="Resend Release Email"
                                onClick={async () => {
                                  try {
                                    await resendReleaseEmail(order.id);
                                  } catch (e) {
                                    console.error(e);
                                  }
                                }}
                              >
                                <Send size={20} />
                              </button>
                            )}
                            {order.status === 'Processing' && (
                              <button
                                className="text-[#9ab3bc] hover:text-white p-1 rounded hover:bg-[#27353a]"
                                title="Resend Partial Email"
                                onClick={async () => {
                                  try {
                                    await resendPartialEmail(order.id);
                                  } catch (e) {
                                    console.error(e);
                                  }
                                }}
                              >
                                <Send size={20} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredOrders.length === 0 && (
                      <tr>
                        <td colSpan={9} className="px-6 py-8 text-center text-slate-500">
                          No orders found matching your criteria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden flex flex-col divide-y divide-[#27353a]">
                {filteredOrders.map((order) => (
                    <div key={order.id} className="p-4 flex flex-col gap-3 hover:bg-[#202b30] transition-colors">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                                <input 
                                  className="w-4 h-4 text-[#00bfff] bg-[#101618] border-[#56686e] rounded focus:ring-[#00bfff] focus:ring-2 focus:ring-offset-0" 
                                  type="checkbox"
                                  checked={selectedOrders.includes(order.id)}
                                  onChange={() => handleSelectOrder(order.id)}
                                />
                                <div>
                                    <span className="font-mono text-[#00bfff] font-medium text-sm">#{order.id.slice(0, 8)}</span>
                                    <p className="text-xs text-[#9ab3bc] mt-0.5">{new Date(order.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded border text-[10px] font-medium justify-center gap-1 ${
                                order.status === 'Delivered' ? 'bg-[#00bfff]/10 text-[#00bfff] border-[#00bfff]/20' :
                                order.status === 'Processing' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                order.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                                'bg-red-500/10 text-red-400 border-red-500/20'
                              }`}>
                                {order.status}
                            </span>
                        </div>
                        <div className="flex justify-between items-center pl-7">
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-white">{order.customer}</span>
                                <span className="text-xs text-[#9ab3bc]">{order.email}</span>
                            </div>
                            <span className="text-sm font-bold text-white">₦{order.total}</span>
                        </div>
                        <div className="flex justify-end gap-2 pl-7 mt-1">
                            <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#27353a] text-xs font-medium text-white hover:bg-[#364950] transition-colors">
                                <Eye size={14} />
                                View
                            </button>
                            <button className="p-1.5 rounded-lg text-[#9ab3bc] hover:text-white hover:bg-[#27353a] transition-colors">
                                <MoreVertical size={16} />
                            </button>
                        </div>
                    </div>
                ))}
                {filteredOrders.length === 0 && (
                     <div className="py-8 text-center text-[#9ab3bc]">No orders found matching your criteria.</div>
                )}
              </div>
              {/* Load More */}
              <div className="flex items-center justify-between p-4 bg-[#1b2428] border-t border-[#27353a]">
                <span className="text-sm text-[#9ab3bc]">Showing {filteredOrders.length} orders</span>
                <button
                  onClick={() => loadMoreOrders()}
                  className="px-4 py-2 bg-[#00bfff] hover:bg-[#00bfff]/90 text-[#0f1e23] text-sm font-bold rounded-lg transition-colors shadow-lg shadow-[#00bfff]/20"
                >
                  Load More
                </button>
              </div>
            </div>
            
            {deliveryOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
                <div className="w-full max-w-lg bg-[#1b2428] border border-[#27353a] rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-white">Add Delivery Credentials</h3>
                    <button
                      className="p-2 rounded hover:bg-[#27353a] text-[#9ab3bc]"
                      onClick={() => { setDeliveryOpen(false); setDeliveryOrderId(null); }}
                    >
                      <X size={18} />
                    </button>
                  </div>
                  <textarea
                    className="w-full h-40 bg-[#101618] border border-[#394f56] text-white text-sm rounded-lg p-3 focus:ring-[#00bfff] focus:border-[#00bfff]"
                    placeholder="Paste credentials or delivery instructions"
                    value={deliveryText}
                    onChange={(e) => setDeliveryText(e.target.value)}
                  />
                  <div className="mt-4 flex justify-end gap-2">
                    <button
                      className="px-4 py-2 bg-[#27353a] hover:bg-[#364950] text-white text-sm font-medium rounded-lg"
                      onClick={() => { setDeliveryOpen(false); setDeliveryOrderId(null); }}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-4 py-2 bg-[#00bfff] hover:bg-[#00bfff]/90 text-[#0f1e23] text-sm font-bold rounded-lg inline-flex items-center gap-2"
                      onClick={async () => {
                        if (!deliveryOrderId) return;
                        const trimmed = deliveryText.trim();
                        if (!trimmed) return;
                        try {
                          await updateOrderDelivery(deliveryOrderId, trimmed);
                          setDeliveryOpen(false);
                          setDeliveryOrderId(null);
                          setDeliveryText('');
                        } catch (e) {
                          console.error(e);
                        }
                      }}
                    >
                      <Save size={16} />
                      Save
                    </button>
                  </div>
                </div>
              </div>
            )}
            
          </div>
        </div>
    </AdminLayout>
  );
};

export default AdminOrdersList;
