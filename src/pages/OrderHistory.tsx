import { useState } from 'react';
import { useStore } from '../store/useStore';
import UserSidebar from '../components/UserSidebar';
import { Search, ChevronRight, X, Eye, Package } from 'lucide-react';
import type { Order } from '../store/useStore';
import { useToast } from '../context/useToast';

const OrderHistory = () => {
  const { orders, user, loadMoreUserOrders } = useStore();
  const toast = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [showArchived, setShowArchived] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'ready' | 'partial' | 'awaiting'>('all');

  // Filter orders for the current user
  // Backend already filters by userId for non-admin users, but we filter here too for safety
  const userOrders = user?.isAdmin ? orders : orders.filter(order => order.userId === user?.id);

  const filteredOrders = userOrders
    .filter(order => order.id.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(order => {
      if (statusFilter === 'all') return true;
      if (statusFilter === 'ready') return (['Delivered', 'Completed'].includes(order.status)) && !!order.delivery?.details;
      if (statusFilter === 'partial') return order.status === 'Processing' && !!order.delivery?.details;
      if (statusFilter === 'awaiting') return order.status === 'Pending';
      return true;
    });

  return (
    <div className="bg-[#f5f8f8] dark:bg-[#0f1e23] text-slate-900 dark:text-white font-display min-h-screen flex flex-col antialiased">

      {/* Main Layout */}
      <div className="flex flex-col md:flex-row flex-1 max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <UserSidebar />

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col min-w-0">
          {/* Page Heading */}
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight mb-2">My Orders</h1>
              <p className="text-slate-600 dark:text-slate-400">View and manage your purchase history for digital assets.</p>
            </div>

            {/* Nice Custom Toggle */}
            <div className="flex items-center gap-3 bg-white dark:bg-[#16252b] px-4 py-2 rounded-xl border border-slate-200 dark:border-[#25383f] shadow-sm">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Show Archived</span>
              <div className="relative inline-block w-10 align-middle select-none transition duration-200 ease-in">
                <input
                  checked={showArchived}
                  onChange={(e) => setShowArchived(e.target.checked)}
                  className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer border-[#25383f] checked:border-[#00bfff] checked:right-0 transition-all duration-300 left-0"
                  id="archived-toggle"
                  name="toggle"
                  type="checkbox"
                />
                <label
                  className={`toggle-label block overflow-hidden h-5 rounded-full cursor-pointer border border-[#25383f] ${showArchived ? 'bg-[#00bfff]' : 'bg-[#203239]'}`}
                  htmlFor="archived-toggle"
                ></label>
              </div>
            </div>
          </div>

          {/* Content Card */}
          <div className="bg-white dark:bg-[#16252b] rounded-xl border border-slate-200 dark:border-[#25383f] shadow-sm overflow-hidden flex flex-col">
            {/* Filters / Search */}
            <div className="p-4 border-b border-slate-200 dark:border-[#25383f] flex items-center justify-between gap-4 flex-wrap">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-[#25383f] bg-slate-50 dark:bg-[#0f1e23] text-sm focus:outline-none focus:ring-2 focus:ring-[#00bfff]/50 text-slate-900 dark:text-white placeholder-slate-400"
                  placeholder="Search by Order ID..."
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`px-3 py-2 text-sm font-medium rounded-lg border transition-colors ${statusFilter === 'all' ? 'bg-[#00bfff] text-black border-[#00bfff]' : 'text-slate-600 dark:text-slate-300 border-slate-200 dark:border-[#25383f] hover:bg-slate-50 dark:hover:bg-[#0f1e23]'}`}
                >
                  All
                </button>
                <button
                  onClick={() => setStatusFilter('ready')}
                  className={`px-3 py-2 text-sm font-medium rounded-lg border transition-colors ${statusFilter === 'ready' ? 'bg-emerald-500 text-white border-emerald-500' : 'text-slate-600 dark:text-slate-300 border-slate-200 dark:border-[#25383f] hover:bg-slate-50 dark:hover:bg-[#0f1e23]'}`}
                >
                  Ready
                </button>
                <button
                  onClick={() => setStatusFilter('partial')}
                  className={`px-3 py-2 text-sm font-medium rounded-lg border transition-colors ${statusFilter === 'partial' ? 'bg-sky-500 text-white border-sky-500' : 'text-slate-600 dark:text-slate-300 border-slate-200 dark:border-[#25383f] hover:bg-slate-50 dark:hover:bg-[#0f1e23]'}`}
                >
                  Partial
                </button>
                <button
                  onClick={() => setStatusFilter('awaiting')}
                  className={`px-3 py-2 text-sm font-medium rounded-lg border transition-colors ${statusFilter === 'awaiting' ? 'bg-yellow-500 text-white border-yellow-500' : 'text-slate-600 dark:text-slate-300 border-slate-200 dark:border-[#25383f] hover:bg-slate-50 dark:hover:bg-[#0f1e23]'}`}
                >
                  Awaiting
                </button>
              </div>
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-[#111e22] border-b border-slate-200 dark:border-[#25383f]">
                    <th className="py-4 px-6 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider w-40">Order ID</th>
                    <th className="py-4 px-6 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date</th>
                    <th className="py-4 px-6 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total</th>
                    <th className="py-4 px-6 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                    <th className="py-4 px-6 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-[#25383f]">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="group hover:bg-slate-50 dark:hover:bg-[#0f1e23]/50 transition-colors">
                      <td className="py-4 px-6">
                        <span className="font-mono text-[#00bfff] font-medium text-sm">#{order.id.slice(0, 8)}</span>
                      </td>
                      <td className="py-4 px-6 text-sm text-slate-600 dark:text-slate-300">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6 text-sm font-medium text-slate-900 dark:text-white">
                        ₦{order.total}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${order.status === 'Delivered' || order.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                              order.status === 'Processing' ? 'bg-sky-500/10 text-sky-500 border-sky-500/20' :
                                order.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                                  'bg-rose-500/10 text-rose-500 border-rose-500/20'
                            }`}>
                            {order.status === 'Pending' && <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse"></span>}
                            {order.status === 'Processing' && <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse"></span>}
                            {order.status === 'Delivered' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>}
                            {order.status}
                          </span>
                          {order.delivery?.details && order.delivery.details.trim().length > 0 && (order.status === 'Delivered' || order.status === 'Completed') && (
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                              Ready
                            </span>
                          )}
                          {order.delivery?.details && order.delivery.details.trim().length > 0 && order.status === 'Processing' && (
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-sky-500/10 text-sky-500 border border-sky-500/20">
                              Partial
                            </span>
                          )}
                          {order.status === 'Pending' && (
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
                              Awaiting
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="inline-flex items-center gap-1 text-sm font-medium text-[#00bfff] hover:text-[#00bfff]/80 transition-colors"
                        >
                          View Details
                          <ChevronRight size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredOrders.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-500">
                        No orders found.
                      </td>
                    </tr>
                  )}
                  {orders.length === 0 && (
                    <>
                      {Array.from({ length: 4 }).map((_, idx) => (
                        <tr key={`sk-${idx}`}>
                          <td className="py-4 px-6">
                            <div className="h-4 w-24 rounded bg-slate-200 dark:bg-[#25383f] animate-pulse" />
                          </td>
                          <td className="py-4 px-6">
                            <div className="h-4 w-32 rounded bg-slate-200 dark:bg-[#25383f] animate-pulse" />
                          </td>
                          <td className="py-4 px-6">
                            <div className="h-4 w-20 rounded bg-slate-200 dark:bg-[#25383f] animate-pulse" />
                          </td>
                          <td className="py-4 px-6">
                            <div className="h-6 w-24 rounded bg-slate-200 dark:bg-[#25383f] animate-pulse" />
                          </td>
                          <td className="py-4 px-6 text-right">
                            <div className="h-4 w-16 rounded bg-slate-200 dark:bg-[#25383f] animate-pulse ml-auto" />
                          </td>
                        </tr>
                      ))}
                    </>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden flex flex-col divide-y divide-slate-200 dark:divide-[#25383f]">
              {filteredOrders.map((order) => (
                <div key={order.id} className="p-4 flex flex-col gap-3 hover:bg-slate-50 dark:hover:bg-[#0f1e23]/50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-mono text-[#00bfff] font-medium text-sm">#{order.id.slice(0, 8)}</span>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${order.status === 'Delivered' || order.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                          order.status === 'Processing' ? 'bg-sky-500/10 text-sky-500 border-sky-500/20' :
                            order.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                              'bg-rose-500/10 text-rose-500 border-rose-500/20'
                        }`}>
                        {order.status}
                      </span>
                      {order.delivery?.details && order.delivery.details.trim().length > 0 && (order.status === 'Delivered' || order.status === 'Completed') && (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                          Ready
                        </span>
                      )}
                      {order.delivery?.details && order.delivery.details.trim().length > 0 && order.status === 'Processing' && (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-sky-500/10 text-sky-500 border border-sky-500/20">
                          Partial
                        </span>
                      )}
                      {order.status === 'Pending' && (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
                          Awaiting
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-sm font-medium text-slate-900 dark:text-white">
                      ₦{order.total}
                    </span>
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="inline-flex items-center gap-1 text-sm font-medium text-[#00bfff] hover:text-[#00bfff]/80 transition-colors bg-[#00bfff]/10 px-3 py-1.5 rounded-lg"
                    >
                      <Eye size={14} />
                      View
                    </button>
                  </div>
                </div>
              ))}
              {filteredOrders.length === 0 && (
                <div className="py-8 text-center text-slate-500">
                  No orders found.
                </div>
              )}
            </div>

            {/* Load More */}
            <div className="p-4 border-t border-slate-200 dark:border-[#25383f] bg-slate-50 dark:bg-[#111e22] flex items-center justify-between">
              <p className="text-sm text-slate-500 dark:text-slate-400">Showing {filteredOrders.length} results</p>
              <button
                onClick={() => user?.id && loadMoreUserOrders(user.id)}
                className="px-4 py-2 bg-[#00bfff] hover:bg-[#00bfff]/90 text-white text-sm font-medium rounded-lg shadow-lg shadow-[#00bfff]/20 transition-colors"
              >
                Load More
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#16252b] w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-4 md:p-6 border-b border-slate-200 dark:border-[#25383f] flex items-center justify-between sticky top-0 bg-white dark:bg-[#16252b] z-10">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Order Details</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">ID: #{selectedOrder.id}</p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-[#0f1e23] text-slate-500 dark:text-slate-400 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 md:p-6 overflow-y-auto">
              {/* Status Banner */}
              <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${selectedOrder.status === 'Delivered' || selectedOrder.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
                  selectedOrder.status === 'Processing' ? 'bg-sky-500/10 text-sky-600 dark:text-sky-400' :
                    selectedOrder.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400' :
                      'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                }`}>
                <div className={`p-2 rounded-full ${selectedOrder.status === 'Delivered' || selectedOrder.status === 'Completed' ? 'bg-emerald-500/20' :
                    selectedOrder.status === 'Processing' ? 'bg-sky-500/20' :
                      selectedOrder.status === 'Pending' ? 'bg-yellow-500/20' :
                        'bg-rose-500/20'
                  }`}>
                  {/* Icon based on status */}
                  <div className="w-5 h-5 rounded-full border-2 border-current" />
                </div>
                <div>
                  <p className="font-semibold text-sm uppercase tracking-wide">Order {selectedOrder.status}</p>
                  <p className="text-sm opacity-90">
                    {selectedOrder.status === 'Delivered' ? 'Your order has been delivered successfully.' :
                      selectedOrder.status === 'Processing' ? 'We are currently processing your order.' :
                        'We have received your order.'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">Customer</h4>
                  <div className="bg-slate-50 dark:bg-[#0f1e23] p-4 rounded-xl border border-slate-200 dark:border-[#25383f]">
                    <p className="font-medium text-slate-900 dark:text-white">{selectedOrder.customer || 'Guest User'}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{selectedOrder.email}</p>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">Payment Summary</h4>
                  <div className="bg-slate-50 dark:bg-[#0f1e23] p-4 rounded-xl border border-slate-200 dark:border-[#25383f]">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-slate-500 dark:text-slate-400">Subtotal</span>
                      <span className="text-sm font-medium text-slate-900 dark:text-white">₦{selectedOrder.total}</span>
                    </div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-slate-500 dark:text-slate-400">Tax</span>
                      <span className="text-sm font-medium text-slate-900 dark:text-white">₦0.00</span>
                    </div>
                    <div className="border-t border-slate-200 dark:border-[#25383f] my-2 pt-2 flex justify-between">
                      <span className="font-bold text-slate-900 dark:text-white">Total</span>
                      <span className="font-bold text-[#00bfff]">₦{selectedOrder.total}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items Mockup */}
              <div>
                <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-3 uppercase tracking-wider">Order Items</h4>
                <div className="bg-slate-50 dark:bg-[#0f1e23] rounded-xl border border-slate-200 dark:border-[#25383f] overflow-hidden">
                  <div className="p-4 flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-200 dark:bg-[#16252b] rounded-lg flex items-center justify-center text-slate-400">
                      <Package size={24} />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-slate-900 dark:text-white">Digital Product Items</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Quantity: {selectedOrder.items?.length || 0}</p>
                    </div>
                    <p className="font-medium text-slate-900 dark:text-white">₦{selectedOrder.total}</p>
                  </div>
                </div>
              </div>

              {/* Delivery Details */}
              {selectedOrder.delivery?.details && (
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Delivery Details</h4>
                    <button
                      onClick={() => {
                        try {
                          navigator.clipboard.writeText(selectedOrder.delivery!.details);
                          toast.success('Copied delivery details');
                        } catch {
                          toast.error('Copy failed');
                        }
                      }}
                      className="text-xs px-3 py-1 rounded-lg border border-[#27353a] text-slate-300 hover:text-white"
                    >
                      Copy All
                    </button>
                  </div>
                  <div className="bg-slate-50 dark:bg-[#0f1e23] p-4 rounded-xl border border-slate-200 dark:border-[#25383f]">
                    <pre className="text-sm text-slate-900 dark:text-white whitespace-pre-wrap">{selectedOrder.delivery.details}</pre>
                    <div className="mt-3">
                      <button
                        onClick={() => {
                          try {
                            const blob = new Blob([selectedOrder.delivery!.details], { type: 'text/plain;charset=utf-8' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `order_${selectedOrder.id}_credentials.txt`;
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                            URL.revokeObjectURL(url);
                          } catch {
                            toast.error('Download failed');
                          }
                        }}
                        className="px-3 py-1.5 rounded-lg bg-[#00bfff] text-black text-xs font-semibold hover:bg-[#00bfff]/90 transition-colors"
                      >
                        Download Credentials
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 md:p-6 border-t border-slate-200 dark:border-[#25383f] bg-slate-50 dark:bg-[#0f1e23] flex justify-end gap-3">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                Close
              </button>
              <a href="/contact" className="px-4 py-2 text-sm font-medium rounded-lg border border-[#27353a] text-slate-600 dark:text-slate-300 hover:text-white">
                Contact Support
              </a>
              <button className="px-4 py-2 bg-[#00bfff] hover:bg-[#00bfff]/90 text-white text-sm font-medium rounded-lg shadow-lg shadow-[#00bfff]/20 transition-all">
                Download Invoice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
