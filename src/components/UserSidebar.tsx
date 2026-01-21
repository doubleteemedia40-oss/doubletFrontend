import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { User, FileText, Settings, HelpCircle, LogOut } from 'lucide-react';

const UserSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useStore();
  
  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <aside className="w-full md:w-64 flex-shrink-0 flex flex-col md:flex-col gap-4 md:gap-8 pr-0 md:pr-8 mb-8 md:mb-0">
      <div className="md:hidden flex overflow-x-auto pb-2 gap-2 scrollbar-hide">
        {/* Mobile Horizontal Nav */}
        <Link 
          to="/account" 
          className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
            isActive('/account') 
              ? 'bg-[#00bfff] text-white border-[#00bfff]' 
              : 'bg-white dark:bg-[#16252b] text-slate-600 dark:text-slate-300 border-slate-200 dark:border-[#25383f]'
          }`}
        >
          <User size={16} />
          Account
        </Link>
        <Link 
          to="/order-history" 
          className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
            isActive('/order-history') 
              ? 'bg-[#00bfff] text-white border-[#00bfff]' 
              : 'bg-white dark:bg-[#16252b] text-slate-600 dark:text-slate-300 border-slate-200 dark:border-[#25383f]'
          }`}
        >
          <FileText size={16} />
          Orders
        </Link>
        <Link 
          to="/settings" 
          className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
            isActive('/settings') 
              ? 'bg-[#00bfff] text-white border-[#00bfff]' 
              : 'bg-white dark:bg-[#16252b] text-slate-600 dark:text-slate-300 border-slate-200 dark:border-[#25383f]'
          }`}
        >
          <Settings size={16} />
          Settings
        </Link>
        <button 
          onClick={handleLogout}
          className="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors border bg-white dark:bg-[#16252b] text-slate-600 dark:text-slate-300 border-slate-200 dark:border-[#25383f]"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>

      <div className="hidden md:block">
        <h2 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4 px-3">My Account</h2>
        <nav className="flex flex-col gap-1">
          <Link 
            to="/account" 
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group ${
              isActive('/account') 
                ? 'bg-[#00bfff]/10 text-[#00bfff]' 
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#16252b]'
            }`}
          >
            <User size={20} className={isActive('/account') ? '' : 'text-slate-400 group-hover:text-[#00bfff]'} />
            Account Details
          </Link>
          
          <Link 
            to="/order-history" 
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group ${
              isActive('/order-history') 
                ? 'bg-[#00bfff]/10 text-[#00bfff]' 
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#16252b]'
            }`}
          >
            <FileText size={20} className={isActive('/order-history') ? '' : 'text-slate-400 group-hover:text-[#00bfff]'} />
            My Orders
          </Link>

          <Link 
            to="/settings" 
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group ${
              isActive('/settings') 
                ? 'bg-[#00bfff]/10 text-[#00bfff]' 
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#16252b]'
            }`}
          >
            <Settings size={20} className={isActive('/settings') ? '' : 'text-slate-400 group-hover:text-[#00bfff]'} />
            Settings
          </Link>
        </nav>
      </div>
      <div className="hidden md:block">
        <h2 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4 px-3">Support</h2>
        <nav className="flex flex-col gap-1">
          <Link 
            to="/help-center" 
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group ${
              isActive('/help-center') 
                ? 'bg-[#00bfff]/10 text-[#00bfff]' 
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#16252b]'
            }`}
          >
            <HelpCircle size={20} className={isActive('/help-center') ? '' : 'text-slate-400 group-hover:text-[#00bfff]'} />
            Help Center
          </Link>
          
          <button 
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#16252b] transition-colors group text-left"
            onClick={handleLogout}
          >
            <LogOut size={20} className="text-slate-400 group-hover:text-[#00bfff]" />
            Log Out
          </button>
        </nav>
      </div>
    </aside>
  );
};

export default UserSidebar;
