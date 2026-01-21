import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';
import { useStore } from '../store/useStore';

const CreateAccount = () => {
  const navigate = useNavigate();
  const { signup } = useStore();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      await signup(formData.email, formData.password, formData.name);
      navigate('/');
    } catch {
      setErrors({ email: 'Failed to create account' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] flex items-center justify-center py-12 px-4 transition-colors duration-300">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2 transition-colors duration-300">Create Account</h1>
          <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">Join DoubleT Media today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-gray-50 dark:bg-[#161b1d] border border-gray-300 dark:border-[#27353a] rounded-xl p-8 transition-colors duration-300">
          <Input
            label="Full Name"
            placeholder="John Doe"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={errors.name}
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            error={errors.email}
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            required
            helperText="At least 8 characters"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            error={errors.password}
          />

          <Input
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            required
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            error={errors.confirmPassword}
          />

          <label className="flex items-start gap-3">
            <input type="checkbox" className="w-4 h-4 rounded mt-1" required />
            <span className="text-gray-600 dark:text-gray-400 text-sm transition-colors duration-300">
              I agree to the{' '}
              <a href="#" className="text-[#00bfff] hover:text-[#009acd] transition-colors duration-300">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-[#00bfff] hover:text-[#009acd] transition-colors duration-300">
                Privacy Policy
              </a>
            </span>
          </label>

          <Button
            type="submit"
            isLoading={isLoading}
            size="lg"
            className="w-full"
          >
            Create Account
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-[#27353a] transition-colors duration-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 dark:bg-[#161b1d] text-gray-600 dark:text-gray-400 transition-colors duration-300">Or</span>
            </div>
          </div>

          <Link to="/login">
            <Button variant="outline" size="lg" className="w-full">
              Sign In
            </Button>
          </Link>
        </form>

        <div className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="text-[#00bfff] hover:text-[#009acd] font-medium transition-colors duration-300">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreateAccount;
