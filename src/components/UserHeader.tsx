import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Bell, ChevronDown } from 'lucide-react';

const UserHeader = () => {
  const { user } = useStore();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-[#25383f] bg-[#f5f8f8]/80 dark:bg-[#0f1e23]/80 backdrop-blur-md">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center transition-opacity hover:opacity-80">
            <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white">DoubleT</span>
          </Link>
          
          {/* Right Actions */}
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-400">
              <Link to="/products" className="hover:text-[#00bfff] transition-colors">Browse</Link>
              <Link to="/support" className="hover:text-[#00bfff] transition-colors">Support</Link>
            </nav>
            <div className="flex items-center gap-3">
              <button className="relative p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white transition-colors">
                <Bell size={20} />
                <span className="absolute top-1.5 right-1.5 size-2 bg-[#00bfff] rounded-full ring-2 ring-white dark:ring-[#0f1e23]"></span>
              </button>
              <div className="h-8 w-px bg-slate-200 dark:bg-[#25383f] mx-1"></div>
              <button className="flex items-center gap-3 group">
                <div 
                  className="size-9 rounded-full bg-cover bg-center border border-slate-200 dark:border-[#25383f] bg-slate-300" 
                  // data-alt="User profile avatar"
                  // style={{ backgroundImage: 'url("...")' }}
                >
                  {/* Placeholder if no image */}
                  <span className="flex items-center justify-center h-full w-full text-xs font-bold text-slate-600">{user?.name?.slice(0, 2).toUpperCase() || 'US'}</span>
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-slate-900 dark:text-white group-hover:text-[#00bfff] transition-colors">{user?.name || 'User'}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Standard Plan</p>
                </div>
                <ChevronDown size={20} className="text-slate-400 group-hover:text-white transition-colors" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default UserHeader;
