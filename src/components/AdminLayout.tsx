import { useState } from 'react';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-full flex-col bg-[#0f1e23] overflow-hidden text-white font-display">
      <AdminHeader onMenuClick={() => setIsSidebarOpen(true)} />
      <div className="flex flex-1 overflow-hidden relative">
        <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-[#0f1e23] w-full">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
