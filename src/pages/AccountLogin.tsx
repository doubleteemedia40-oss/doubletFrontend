import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';
import { useStore } from '../store/useStore';

const AccountLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user, error: storeError } = useStore();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [localError, setLocalError] = useState('');

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      const state = location.state as { from?: { pathname?: string } } | null;
      const from = state?.from?.pathname;
      if (from) {
        navigate(from, { replace: true });
      } else {
        navigate(user.isAdmin ? '/admin/dashboard' : '/order-history', { replace: true });
      }
    }
  }, [user, navigate, location.state]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    setIsLoading(true);

    try {
      await login(formData.email, formData.password);
    } catch (err: unknown) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const displayError = localError || storeError;

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] flex items-center justify-center py-12 px-4 transition-colors duration-300">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2 transition-colors duration-300">Welcome Back</h1>
          <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">Sign in to your DoubleT Media account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-gray-50 dark:bg-[#161b1d] border border-gray-300 dark:border-[#27353a] rounded-xl p-8 transition-colors duration-300">
          {displayError && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-600 dark:text-red-400 text-sm transition-colors duration-300">
              {displayError}
            </div>
          )}

          <Input
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            required
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4 rounded border-gray-300 dark:border-gray-600" />
              <span className="text-gray-600 dark:text-gray-400 transition-colors duration-300">Remember me</span>
            </label>
            <Link to="/password-recovery" className="text-[#00bfff] hover:text-[#009acd] transition-colors">
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            isLoading={isLoading}
            size="lg"
            className="w-full"
          >
            Sign In
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-[#27353a] transition-colors duration-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 dark:bg-[#161b1d] text-gray-600 dark:text-gray-400 transition-colors duration-300">Or</span>
            </div>
          </div>

          <Link to="/register">
            <Button variant="outline" size="lg" className="w-full">
              Create Account
            </Button>
          </Link>
        </form>

        {/* Additional Links */}
        <div className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
          <p>
            Don't have an account?{' '}
            <Link to="/register" className="text-[#00bfff] hover:text-[#009acd] font-medium transition-colors">
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AccountLogin;
