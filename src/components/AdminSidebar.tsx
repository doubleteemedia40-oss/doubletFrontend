import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Trophy, Users, X } from 'lucide-react';

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const AdminSidebar = ({ isOpen = false, onClose }: AdminSidebarProps) => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Sidebar Container */}
      <aside className={`fixed md:relative top-0 left-0 z-40 h-full w-64 flex-shrink-0 bg-[#0f1e23] border-r border-[#27353a] flex flex-col transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-4 md:hidden border-b border-[#27353a]">
          <span className="text-white font-bold">Menu</span>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Main Menu</div>
          
          <Link 
            to="/admin/dashboard" 
            onClick={onClose}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${
              isActive('/admin/dashboard') 
                ? 'bg-[#00bfff]/10 text-[#00bfff]' 
                : 'text-slate-400 hover:text-white hover:bg-[#18282e]'
            }`}
          >
            <LayoutDashboard size={22} />
            <span className="font-medium">Dashboard</span>
          </Link>

          <Link 
            to="/admin/products" 
            onClick={onClose}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${
              isActive('/admin/products') 
                ? 'bg-[#00bfff]/10 text-[#00bfff]' 
                : 'text-slate-400 hover:text-white hover:bg-[#18282e]'
            }`}
          >
            <Package size={22} />
            <span className="font-medium">Products</span>
          </Link>

          <Link 
            to="/admin/orders" 
            onClick={onClose}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${
              isActive('/admin/orders') 
                ? 'bg-[#00bfff]/10 text-[#00bfff]' 
                : 'text-slate-400 hover:text-white hover:bg-[#18282e]'
            }`}
          >
            <ShoppingCart size={22} />
            <span className="font-medium">Orders</span>
          </Link>

          <Link 
            to="/admin/leaderboard" 
            onClick={onClose}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${
              isActive('/admin/leaderboard') 
                ? 'bg-[#00bfff]/10 text-[#00bfff]' 
                : 'text-slate-400 hover:text-white hover:bg-[#18282e]'
            }`}
          >
            <Trophy size={22} />
            <span className="font-medium">Leaderboard</span>
          </Link>

          <div className="my-4 border-t border-[#27353a]"></div>
          <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Settings</div>

          

          <Link 
            to="/admin/users" 
            onClick={onClose}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${
              isActive('/admin/users') 
                ? 'bg-[#00bfff]/10 text-[#00bfff]' 
                : 'text-slate-400 hover:text-white hover:bg-[#18282e]'
            }`}
          >
            <Users size={22} />
            <span className="font-medium">Users</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-[#27353a]">
          <div className="bg-[#18282e] rounded-xl p-4 border border-[#27353a]">
            <h4 className="text-white text-sm font-semibold mb-1">Server Status</h4>
            <div className="flex items-center gap-2 mb-2">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-xs text-green-500">Operational</span>
            </div>
            <div className="w-full bg-[#27353a] h-1.5 rounded-full overflow-hidden">
              <div className="bg-[#00bfff] h-full rounded-full" style={{ width: '98%' }}></div>
            </div>
            <p className="text-xs text-slate-500 mt-2">Uptime: 99.9%</p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
