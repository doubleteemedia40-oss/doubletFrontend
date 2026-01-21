import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';
import { useStore } from '../store/useStore';
import { useToast } from '../context/useToast';
import { sendResetEmail } from '../email/emailClient';

const PasswordRecovery = () => {
  const navigate = useNavigate();
  const { requestPasswordReset, resetPassword } = useStore();
  const toast = useToast();
  const [step, setStep] = useState<'email' | 'otp' | 'reset'>('email');
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [passwords, setPasswords] = useState({ new: '', confirm: '' });
  const [serverToken, setServerToken] = useState<string>('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenParam = params.get('token') || '';
    const emailParam = params.get('email') || '';
    if (tokenParam) {
      setOtp(tokenParam);
      if (emailParam) setEmail(emailParam);
      setStep('reset');
    }
  }, []);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const token = await requestPasswordReset(email);
      setServerToken(token);
      try {
        const origin = window.location.origin;
        const link = `${origin}/password-recovery?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`;
        await sendResetEmail({ to_email: email, email, link, token });
      } catch (mailErr) {
        console.warn('Reset email could not be sent via EmailJS:', mailErr);
      }
      toast.success('Recovery email sent. Check your inbox/spam.', { position: 'top-right' });
      setStep('otp');
    } catch (err: unknown) {
      console.error(err);
      toast.error('Failed to request recovery');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStep('reset');
    setIsLoading(false);
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const tokenToUse = otp || serverToken;
      await resetPassword(tokenToUse, passwords.new);
      toast.success('Password reset successful', { position: 'top-right' });
      navigate('/login');
    } catch (err: unknown) {
      console.error(err);
      toast.error('Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] flex items-center justify-center py-12 px-4 transition-colors duration-300">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 transition-colors duration-300">
          <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2">Reset Password</h1>
          <p className="text-gray-600 dark:text-gray-400">Recover access to your account</p>
        </div>

        <div className="bg-gray-50 dark:bg-[#161b1d] border border-gray-300 dark:border-[#27353a] rounded-xl p-8 transition-colors duration-300">
          {/* Step Indicator */}
          <div className="flex items-center justify-between mb-8">
            {['email', 'otp', 'reset'].map((s, idx) => (
              <div key={s} className="flex items-center">
                <div
                   className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors duration-300 ${
                     step === s || (
                       (step === 'otp' && s === 'email') ||
                       (step === 'reset' && ['email', 'otp'].includes(s))
                     )
                       ? 'bg-[#00bfff] text-black'
                       : 'bg-gray-300 dark:bg-[#27353a] text-gray-600 dark:text-gray-400'
                   }`}
                 >
                   {idx + 1}
                 </div>
                {idx < 2 && (
                   <div
                     className={`h-1 w-12 mx-2 transition-colors duration-300 ${
                       (step === 'otp' && s === 'email') ||
                       (step === 'reset' && ['email', 'otp'].includes(s))
                         ? 'bg-[#00bfff]'
                         : 'bg-gray-300 dark:bg-[#27353a]'
                     }`}
                   ></div>
                 )}
              </div>
            ))}
          </div>

          {/* Email Step */}
          {step === 'email' && (
            <form onSubmit={handleEmailSubmit} className="space-y-6">
              <div className="transition-colors duration-300">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Enter your email address and we'll send you a code to reset your password.
                </p>
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="you@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <Button type="submit" isLoading={isLoading} size="lg" className="w-full">
                Send Recovery Code
              </Button>
            </form>
          )}

          {/* OTP Step */}
          {step === 'otp' && (
            <form onSubmit={handleOtpSubmit} className="space-y-6">
              <div className="transition-colors duration-300">
                <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
                  Enter the recovery token you received via email.
                </p>
                <Input
                  label="Recovery Code"
                  type="text"
                  placeholder="000000"
                  maxLength={6}
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                />
              </div>
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="flex-1"
                  onClick={() => setStep('email')}
                >
                  Back
                </Button>
                <Button type="submit" isLoading={isLoading} size="lg" className="flex-1">
                  Verify Code
                </Button>
              </div>
            </form>
          )}

          {/* Reset Password Step */}
          {step === 'reset' && (
            <form onSubmit={handleResetSubmit} className="space-y-6">
              <div className="transition-colors duration-300">
                <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">Enter your new password below.</p>
                <Input
                  label="New Password"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={passwords.new}
                  onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                  helperText="At least 8 characters"
                />
              </div>
              <Input
                label="Confirm Password"
                type="password"
                placeholder="••••••••"
                required
                value={passwords.confirm}
                onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
              />
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="flex-1"
                  onClick={() => setStep('otp')}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  isLoading={isLoading}
                  disabled={passwords.new !== passwords.confirm || passwords.new.length < 8}
                  size="lg"
                  className="flex-1"
                >
                  Reset Password
                </Button>
              </div>
            </form>
          )}
        </div>

        <div className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
          <p>
            Remember your password?{' '}
            <Link to="/login" className="text-[#00bfff] hover:text-[#009acd] font-medium transition-colors duration-300">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PasswordRecovery;
