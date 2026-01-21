import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import Input from '../components/Input';
import Button from '../components/Button';
import { useToast } from '../context/useToast';
import PaystackLogo from '../components/PaystackLogo';

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
  const paystackKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || '';

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';

  // Prefill from user once; fields are editable by user

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (paymentMethod === 'card') {
        if (!paystackKey) {
          toast.error('Payment configuration missing');
          setIsLoading(false);
          return;
        }
        const reference = `DT-${Date.now()}`;
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
        } catch {
          toast.error('Order creation failed');
          setIsLoading(false);
          return;
        }
        const res = await fetch(`${API_BASE}/api/payments/paystack/initiate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
          body: JSON.stringify({ amount: Math.round(total * 100), email: formData.email, reference, metadata: { customer: formData.fullName } }),
        });
        if (!res.ok) {
          toast.error('Failed to initiate payment');
          setIsLoading(false);
          return;
        }
        const data = await res.json();
        const url = data?.data?.authorization_url;
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
                    <PaystackLogo className="h-6 w-auto" />
                    <div className="flex flex-col">
                      <span className="text-white font-bold tracking-wide">Paystack</span>
                      <span className="text-slate-300 text-xs">Secure Card Payment</span>
                    </div>
                  </div>
                  <span className="text-[#00bfff] text-xs font-bold uppercase">Selected</span>
                </div>

                {paymentMethod === 'card' && (
                  <div className="mt-6 space-y-2 p-4 bg-[#0f1e23] border border-[#27353a] rounded-lg text-sm text-slate-300">
                    <p>You will be redirected via Paystack to complete your secure card payment.</p>
                    {!paystackKey && (
                      <p className="text-red-400">Paystack public key is not configured.</p>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-md bg-[#0f1e23] border border-[#27353a] rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-2">200 Confirmation</h3>
            <p className="text-slate-300 text-sm">Payment successful. Reference: <span className="text-white font-mono">{confirmRef}</span></p>
            <div className="mt-6 flex justify-end gap-3">
              <Button
                onClick={() => { setConfirmOpen(false); clearCart(); navigate('/order-confirmed'); }}
                size="md"
              >
                Continue
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
