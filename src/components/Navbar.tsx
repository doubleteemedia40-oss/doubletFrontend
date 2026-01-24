import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/useTheme';
import { useStore } from '../store/useStore';
import { ShoppingCart, Moon, Sun, Menu, X, ChevronRight, ExternalLink } from 'lucide-react';

const Navbar = () => {
  const { isDark, toggleTheme } = useTheme();
  const { cartItems, user, logout } = useStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [bump, setBump] = useState(false);
  const location = useLocation();

  // Close menu when route changes
  if (isMenuOpen && location) {
      // This is a side effect in render, better to use useEffect, but for simplicity in this edit:
      // actually, let's just close it on Link click.
  }

  useEffect(() => {
    const handler = () => {
      setBump(true);
      setTimeout(() => setBump(false), 400);
    };
    window.addEventListener('app:cart-bump', handler as EventListener);
    return () => window.removeEventListener('app:cart-bump', handler as EventListener);
  }, []);

  // Dashboard link not needed with explicit Login/Logout buttons

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-[#27353a] bg-white/95 dark:bg-[#0a0a0a]/95 backdrop-blur-sm transition-colors duration-300">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center transition-opacity hover:opacity-80 z-50">
          <span className="text-xl font-black tracking-tight text-gray-900 dark:text-white">DoubleT</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex flex-1 items-center justify-center gap-6 lg:gap-8">
          {navLinks.map((link) => (
            link.path.startsWith('/') ? (
              <Link 
                key={link.name} 
                to={link.path} 
                className="text-sm font-medium text-gray-600 dark:text-[#9ca3af] hover:text-[#00bfff] transition-colors"
              >
                {link.name}
              </Link>
            ) : (
              <a 
                key={link.name} 
                href={link.path} 
                className="text-sm font-medium text-gray-600 dark:text-[#9ca3af] hover:text-[#00bfff] transition-colors"
              >
                {link.name}
              </a>
            )
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex md:hidden size-10 items-center justify-center rounded-lg border border-gray-300 dark:border-[#27353a] bg-gray-50 dark:bg-[#161b1d] text-gray-600 dark:text-[#9ca3af] transition-colors hover:border-[#00bfff] hover:text-[#00bfff] z-50"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Cart */}
          <Link
            to="/cart"
            className="relative flex size-10 items-center justify-center rounded-lg border border-gray-300 dark:border-[#27353a] bg-gray-50 dark:bg-[#161b1d] text-gray-600 dark:text-[#9ca3af] transition-colors hover:border-[#00bfff] hover:text-[#00bfff]"
          >
            <ShoppingCart size={20} />
            {cartItems.length > 0 && (
              <span className={`absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-[#00bfff] text-[10px] font-bold text-black ${bump ? 'cart-badge-bump' : ''}`}>
                {cartItems.length}
              </span>
            )}
          </Link>

          {/* Mobile Auth quick action */}
          {user ? (
            <button
              onClick={logout}
              className="flex md:hidden items-center justify-center rounded-lg border border-gray-300 dark:border-[#27353a] bg-gray-50 dark:bg-[#161b1d] px-3 h-10 text-gray-700 dark:text-[#9ca3af] hover:border-[#00bfff] hover:text-[#00bfff]"
              title={`Logged in as ${user.name}`}
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="flex md:hidden items-center justify-center rounded-lg border border-gray-300 dark:border-[#27353a] bg-gray-50 dark:bg-[#161b1d] px-3 h-10 text-gray-700 dark:text-[#9ca3af] hover:border-[#00bfff] hover:text-[#00bfff]"
              title="Login"
            >
              Login
            </Link>
          )}

          {/* Auth */}
          {user ? (
            <button
              onClick={logout}
              className="hidden sm:flex items-center justify-center rounded-lg border border-gray-300 dark:border-[#27353a] bg-gray-50 dark:bg-[#161b1d] px-4 h-10 text-gray-700 dark:text-[#9ca3af] hover:border-[#00bfff] hover:text-[#00bfff]"
              title={`Logged in as ${user.name}`}
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="hidden sm:flex items-center justify-center rounded-lg border border-gray-300 dark:border-[#27353a] bg-gray-50 dark:bg-[#161b1d] px-4 h-10 text-gray-700 dark:text-[#9ca3af] hover:border-[#00bfff] hover:text-[#00bfff]"
              title="Login"
            >
              Login
            </Link>
          )}

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="hidden sm:flex size-10 items-center justify-center rounded-lg border-2 border-gray-300 dark:border-[#27353a] bg-gray-50 dark:bg-[#161b1d] text-gray-600 dark:text-[#9ca3af] transition-all hover:border-[#00bfff] hover:text-[#00bfff] hover:scale-110"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMenuOpen(false)}
      />

      {/* Mobile Menu Drawer */}
      <div 
        className={`fixed top-0 left-0 z-40 h-screen w-[80%] max-w-sm bg-white dark:bg-[#0a0a0a] border-r border-gray-200 dark:border-[#27353a] shadow-xl transition-transform duration-300 ease-in-out md:hidden ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full pt-20 px-6 pb-6">
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => (
              link.path.startsWith('/') ? (
                <Link 
                  key={link.name} 
                  to={link.path} 
                  className="flex items-center justify-between p-3 rounded-xl text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#161b1d] hover:text-[#00bfff] transition-all"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                  <ChevronRight size={16} className="text-gray-400" />
                </Link>
              ) : (
                <a 
                  key={link.name} 
                  href={link.path} 
                  className="flex items-center justify-between p-3 rounded-xl text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#161b1d] hover:text-[#00bfff] transition-all"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                  <ExternalLink size={16} className="text-gray-400" />
                </a>
              )
            ))}
          </nav>

          <div className="mt-auto pt-6 border-t border-gray-200 dark:border-[#27353a] grid grid-cols-2 gap-3">
            {user ? (
              <button
                onClick={() => { logout(); setIsMenuOpen(false); }}
                className="flex items-center justify-center gap-2 p-3 rounded-xl border border-gray-200 dark:border-[#27353a] bg-gray-50 dark:bg-[#161b1d] text-gray-700 dark:text-[#9ca3af] hover:border-[#00bfff] hover:text-[#00bfff]"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center justify-center gap-2 p-3 rounded-xl border border-gray-200 dark:border-[#27353a] bg-gray-50 dark:bg-[#161b1d] text-gray-700 dark:text-[#9ca3af] hover:border-[#00bfff] hover:text-[#00bfff]"
              >
                Login
              </Link>
            )}

            <button
              onClick={() => {
                toggleTheme();
                // Don't close menu so user can see change
              }}
              className="flex items-center justify-center gap-2 p-3 rounded-xl border border-gray-200 dark:border-[#27353a] bg-gray-50 dark:bg-[#161b1d] text-gray-600 dark:text-[#9ca3af] transition-colors hover:border-[#00bfff] hover:text-[#00bfff]"
            >
              {isDark ? <Moon size={20} /> : <Sun size={20} />}
              <span className="text-sm font-medium">{isDark ? 'Dark' : 'Light'}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
