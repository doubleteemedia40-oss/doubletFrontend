import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useStore } from '../store/useStore';
import UserSidebar from '../components/UserSidebar';
import { User, Mail, Lock, Save, Camera } from 'lucide-react';
 

const AccountSettings = () => {
  const { user } = useStore();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(() => (location.pathname === '/settings' ? 'security' : 'profile'));
  
  // Form states
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement update logic
    alert('Profile updated successfully!');
  };

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    // Implement password update logic
    alert('Password updated successfully!');
  };

  return (
    <div className="bg-[#f5f8f8] dark:bg-[#0f1e23] text-slate-900 dark:text-white font-display min-h-screen flex flex-col antialiased">
      <div className="flex flex-col md:flex-row flex-1 max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <UserSidebar />
        
        <main className="flex-1 flex flex-col min-w-0">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight mb-2">Account Settings</h1>
            <p className="text-slate-600 dark:text-slate-400">Manage your profile information and security settings.</p>
          </div>

          <div className="bg-white dark:bg-[#16252b] rounded-xl border border-slate-200 dark:border-[#25383f] shadow-sm overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-slate-200 dark:border-[#25383f]">
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex-1 py-4 text-sm font-medium text-center transition-colors ${
                  activeTab === 'profile'
                    ? 'text-[#00bfff] border-b-2 border-[#00bfff] bg-slate-50 dark:bg-[#0f1e23]/50'
                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                Profile Information
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`flex-1 py-4 text-sm font-medium text-center transition-colors ${
                  activeTab === 'security'
                    ? 'text-[#00bfff] border-b-2 border-[#00bfff] bg-slate-50 dark:bg-[#0f1e23]/50'
                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                Security
              </button>
            </div>

            <div className="p-6 md:p-8">
              {activeTab === 'profile' ? (
                <form onSubmit={handleProfileUpdate} className="max-w-xl space-y-6">
                  {/* Avatar Upload */}
                  <div className="flex items-center gap-6">
                    <div className="relative group cursor-pointer">
                      <div className="size-20 rounded-full bg-slate-200 dark:bg-[#25383f] flex items-center justify-center text-xl font-bold text-slate-500 dark:text-slate-400 overflow-hidden">
                        {user?.name?.slice(0, 2).toUpperCase() || 'US'}
                      </div>
                      <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Camera className="text-white" size={24} />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium text-slate-900 dark:text-white">Profile Photo</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Click to upload a new photo. Max size 2MB.</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 dark:border-[#25383f] bg-white dark:bg-[#0f1e23] text-slate-900 dark:text-white focus:ring-2 focus:ring-[#00bfff]/50 focus:border-[#00bfff] outline-none transition-all"
                          placeholder="Enter your name"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 dark:border-[#25383f] bg-white dark:bg-[#0f1e23] text-slate-900 dark:text-white focus:ring-2 focus:ring-[#00bfff]/50 focus:border-[#00bfff] outline-none transition-all"
                          placeholder="Enter your email"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      className="flex items-center gap-2 px-6 py-2.5 bg-[#00bfff] hover:bg-[#00bfff]/90 text-white font-medium rounded-lg transition-colors shadow-lg shadow-[#00bfff]/20"
                    >
                      <Save size={18} />
                      Save Changes
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handlePasswordUpdate} className="max-w-xl space-y-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Current Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                          type="password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 dark:border-[#25383f] bg-white dark:bg-[#0f1e23] text-slate-900 dark:text-white focus:ring-2 focus:ring-[#00bfff]/50 focus:border-[#00bfff] outline-none transition-all"
                          placeholder="Enter current password"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">New Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 dark:border-[#25383f] bg-white dark:bg-[#0f1e23] text-slate-900 dark:text-white focus:ring-2 focus:ring-[#00bfff]/50 focus:border-[#00bfff] outline-none transition-all"
                          placeholder="Enter new password"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Confirm New Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 dark:border-[#25383f] bg-white dark:bg-[#0f1e23] text-slate-900 dark:text-white focus:ring-2 focus:ring-[#00bfff]/50 focus:border-[#00bfff] outline-none transition-all"
                          placeholder="Confirm new password"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      className="flex items-center gap-2 px-6 py-2.5 bg-[#00bfff] hover:bg-[#00bfff]/90 text-white font-medium rounded-lg transition-colors shadow-lg shadow-[#00bfff]/20"
                    >
                      <Save size={18} />
                      Update Password
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AccountSettings;
