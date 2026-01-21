import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Menu, Search, Bell, LogOut } from 'lucide-react';

interface AdminHeaderProps {
  onMenuClick?: () => void;
}

const AdminHeader = ({ onMenuClick }: AdminHeaderProps) => {
  const { user, logout } = useStore();

  return (
    <header className="flex h-16 items-center justify-between border-b border-[#27353a] bg-[#0f1e23] px-4 md:px-6 sticky top-0 z-10 flex-shrink-0">
      <div className="flex items-center gap-3 md:gap-4">
        <button 
          onClick={onMenuClick}
          className="md:hidden text-slate-400 hover:text-white p-1"
        >
          <Menu size={24} />
        </button>
        <Link to="/admin/dashboard" className="flex items-center transition-opacity hover:opacity-80">
          <h2 className="text-white text-xl font-black tracking-tight">DoubleT</h2>
        </Link>
        <div className="hidden md:flex ml-8 items-center bg-[#18282e] rounded-lg px-3 py-1.5 w-64 border border-[#27353a]">
          <Search size={20} className="text-slate-400" />
          <input 
            className="bg-transparent border-none text-sm text-white focus:ring-0 w-full placeholder-slate-500 focus:outline-none ml-2" 
            placeholder="Search..." 
            type="text"
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button className="relative p-2 text-slate-400 hover:text-white transition-colors rounded-full hover:bg-[#27353a]">
          <Bell size={24} />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-[#00bfff]"></span>
        </button>
        <button 
          onClick={logout}
          className="p-2 text-slate-400 hover:text-white transition-colors rounded-full hover:bg-[#27353a]"
          title="Sign out"
          aria-label="Sign out"
        >
          <LogOut size={24} />
        </button>
        <div className="flex items-center gap-3 pl-4 border-l border-[#27353a]">
          <div className="flex flex-col items-end hidden sm:flex">
            <span className="text-sm font-semibold text-white leading-tight">{user?.name || 'Admin User'}</span>
            <span className="text-xs text-slate-400">Super Admin</span>
          </div>
          <div className="h-9 w-9 rounded-full bg-[#18282e] border border-[#27353a] flex items-center justify-center text-[#00bfff] font-bold overflow-hidden">
            {/* Simple avatar fallback or image */}
            <div 
              className="bg-center bg-no-repeat bg-cover w-full h-full" 
              style={{ backgroundImage: 'linear-gradient(135deg, #00bfff 0%, #0f1e23 100%)' }}
            ></div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
