import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import Input from '../components/Input';
import Button from '../components/Button';
import { useToast } from '../context/useToast';
import FlutterwaveLogo from '../components/FlutterwaveLogo';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, clearCart, user, createOrder, token } = useStore();
  const [paymentMethod] = useState<'card'>('card');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: ''
  });
  const toast = useToast();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmRef, setConfirmRef] = useState<string>('');
  const [verifying, setVerifying] = useState(false);
  const flutterwaveKey = import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY || '';

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';

  // Prefill from user once; fields are editable by user

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const checkPaymentStatus = async (reference: string) => {
    try {
      setVerifying(true);
      const res = await fetch(`${API_BASE}/api/payments/verify/${reference}`, {
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) }
      });

      if (!res.ok) {
        if (res.status === 404) {
          toast.error('Order not found');
        } else {
          toast.error('Failed to verify payment');
        }
        return;
      }

      const data = await res.json();

      if (data.paid && (data.status === 'Delivered' || data.status === 'Processing')) {
        toast.success('Payment confirmed! 🎉');
        setConfirmOpen(false);
        clearCart();
        navigate('/order-confirmed');
      } else if (data.status === 'Pending') {
        toast.info('Payment not yet confirmed. Please complete your payment or try again in a moment.');
      } else {
        toast.info('Payment status: ' + data.status);
      }
    } catch (err) {
      console.error('Payment verification error:', err);
      toast.error('Could not verify payment status');
    } finally {
      setVerifying(false);
    }
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (paymentMethod === 'card') {
        if (!flutterwaveKey) {
          toast.error('Payment configuration missing');
          setIsLoading(false);
          return;
        }
        const generateRef = () => {
          const arr = new Uint8Array(12);
          crypto.getRandomValues(arr);
          return 'DT-' + Array.from(arr).map((x) => x.toString(16).padStart(2, '0')).join('');
        };
        const reference = generateRef();

        if (import.meta.env.DEV) {
          console.log('📦 Checkout Debug:', {
            isLoggedIn: !!user,
            userId: user?.id,
            hasToken: !!token,
            customer: formData.fullName,
            email: formData.email,
            cartItemsCount: cartItems.length,
            total: total,
            reference: reference
          });
        }

        try {
          await createOrder({
            userId: user?.id || 'guest',
            customer: formData.fullName,
            email: formData.email,
            items: cartItems,
            total: total,
            status: 'Pending',
            date: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            reference,
          });
        } catch (err) {
          console.error('❌ Order creation error:', err);
          toast.error(err instanceof Error ? err.message : 'Order creation failed');
          setIsLoading(false);
          return;
        }
        const res = await fetch(`${API_BASE}/api/payments/flutterwave/initiate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
          body: JSON.stringify({ amount: total, email: formData.email, reference, metadata: { customer: formData.fullName } }),
        });
        if (!res.ok) {
          let err: Record<string, unknown> | undefined;
          try { err = await res.json(); } catch { err = undefined; }
          const msg = (err && typeof err.error === 'string' ? (err.error as string) : undefined) || 'Failed to initiate payment';
          toast.error(msg);
          const details = err && (err as Record<string, unknown>).details as Record<string, unknown> | undefined;
          if (details) {
            console.warn('Flutterwave error details:', details);
          }
          setIsLoading(false);
          return;
        }
        const data = await res.json();
        const url = data?.data?.link;
        if (!url) {
          toast.error('Payment provider error');
          setIsLoading(false);
          return;
        }
        setConfirmRef(reference);
        setConfirmOpen(true);
        toast.info('Redirecting to payment...', { position: 'top-right' });
        window.open(url, '_blank');
        setIsLoading(false);
      } else {
        await createOrder({
          userId: user?.id || 'guest',
          customer: formData.fullName,
          email: formData.email,
          items: cartItems,
          total: total,
          status: 'Pending',
          date: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        });
        toast.success('Order placed - proceed to crypto payment');
        setTimeout(() => {
          clearCart();
          navigate('/order-confirmed');
        }, 1200);
      }
    } catch (error) {
      console.error('Checkout failed:', error);
      toast.error('Failed to place order. Please try again.');
      setIsLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0a0a0a] flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Your cart is empty</h1>
          <Button onClick={() => navigate('/products')}>Continue Shopping</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] py-16 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-12">Secure Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleCheckout} className="space-y-8">
              {/* Billing Information */}
              <div className="border border-gray-300 dark:border-[#27353a] rounded-lg p-6 bg-gray-50 dark:bg-[#161b1d] transition-colors duration-300">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Billing Information</h2>
                <div className="space-y-4">
                  <Input
                    label="Full Name"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                    readOnly={!!user}
                    helperText={user ? 'Auto-filled from your account' : undefined}
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    required
                    readOnly={!!user}
                    helperText={user ? 'Auto-filled from your account' : undefined}
                  />
                  <Input
                    label="Phone Number"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1234567890"
                    required
                  />
                  <Input
                    label="Address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="123 Main Street"
                    required
                  />

                </div>
              </div>

              {/* Payment Method */}
              <div className="border border-gray-300 dark:border-[#27353a] rounded-lg p-6 bg-gray-50 dark:bg-[#161b1d] transition-colors duration-300">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Payment Method</h2>
                <div
                  className="flex items-center justify-between p-4 rounded-lg border border-[#27353a] bg-[#0f1e23] hover:border-[#00bfff] transition-all"
                >
                  <div className="flex items-center gap-3">
                    <FlutterwaveLogo className="h-6 w-auto" />
                    <div className="flex flex-col">
                      <span className="text-white font-bold tracking-wide">Flutterwave</span>
                      <span className="text-slate-300 text-xs">Secure Card Payment</span>
                    </div>
                  </div>
                  <span className="text-[#00bfff] text-xs font-bold uppercase">Selected</span>
                </div>

                {paymentMethod === 'card' && (
                  <div className="mt-6 space-y-2 p-4 bg-[#0f1e23] border border-[#27353a] rounded-lg text-sm text-slate-300">
                    <p>You will be redirected via Flutterwave to complete your secure card payment.</p>
                    {!flutterwaveKey && (
                      <p className="text-red-400">Flutterwave public key is not configured.</p>
                    )}
                  </div>
                )}
              </div>

              <Button
                type="submit"
                isLoading={isLoading}
                size="lg"
                className="w-full"
              >
                Complete Purchase
              </Button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="border border-gray-300 dark:border-[#27353a] rounded-lg p-6 bg-gray-50 dark:bg-[#161b1d] h-fit transition-colors duration-300">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Order Summary</h2>

            <div className="space-y-4 mb-6 border-b border-gray-300 dark:border-[#27353a] pb-6 max-h-96 overflow-y-auto">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    {item.name} <span className="text-[#00bfff]">x{item.quantity}</span>
                  </span>
                  <span className="text-gray-900 dark:text-white font-medium">₦{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Subtotal</span>
                <span>₦{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Tax (10%)</span>
                <span>₦{tax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-900 dark:text-white font-bold text-lg border-t border-gray-300 dark:border-[#27353a] pt-4 transition-colors duration-300">
                <span>Total</span>
                <span className="text-[#00bfff]">₦{total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#0f1e23] border border-[#27353a] rounded-xl p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-[#00bfff]/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-[#00bfff]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Payment in Progress</h3>
                <p className="text-slate-400 text-sm">Complete your payment</p>
              </div>
            </div>

            <div className="bg-[#161b1d] border border-[#27353a] rounded-lg p-4 mb-6">
              <p className="text-slate-300 text-sm mb-2">
                A payment window has been opened. Please complete your payment there.
              </p>
              <div className="flex items-center gap-2 mt-3">
                <span className="text-slate-500 text-xs">Reference:</span>
                <code className="text-white font-mono text-xs bg-[#0a0a0a] px-2 py-1 rounded">{confirmRef}</code>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                onClick={() => checkPaymentStatus(confirmRef)}
                isLoading={verifying}
                className="w-full bg-[#00bfff] hover:bg-[#00bfff]/90"
              >
                {verifying ? 'Checking...' : "I've Completed Payment - Check Status"}
              </Button>
              <button
                onClick={() => setConfirmOpen(false)}
                className="w-full text-slate-400 hover:text-white text-sm py-2 transition-colors"
                disabled={verifying}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
