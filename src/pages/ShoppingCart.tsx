import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import Button from '../components/Button';
import { useToast } from '../context/useToast';

const ShoppingCart = () => {
  const { cartItems, removeFromCart, updateCartQuantity, user } = useStore();
  const navigate = useNavigate();
  const toast = useToast();

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] py-16 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-8 transition-colors duration-300">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-4 transition-colors duration-300">Your cart is empty</p>
            <Link to="/products" className="text-[#00bfff] hover:text-[#009acd] font-medium transition-colors duration-300">
              Continue Shopping →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                  <div key={item.id} className="border border-gray-300 dark:border-[#27353a] rounded-lg p-6 bg-gray-50 dark:bg-[#161b1d] transition-colors duration-300">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <Link to={`/product/${item.id}`} className="text-lg font-bold text-gray-900 dark:text-white hover:text-[#00bfff] dark:hover:text-[#00bfff] transition-colors duration-300">
                          {item.name}
                        </Link>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mt-1 transition-colors duration-300">{item.category}</p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-400 hover:text-red-600 font-bold transition-colors duration-300"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button
                         onClick={() => updateCartQuantity(item.id, Math.max(1, item.quantity - 1))}
                         className="w-8 h-8 rounded border border-gray-300 dark:border-[#27353a] hover:border-[#00bfff] flex items-center justify-center text-gray-600 dark:text-gray-400 transition-colors duration-300"
                       >
                         -
                       </button>
                       <span className="w-8 text-center text-gray-900 dark:text-white font-bold transition-colors duration-300">{item.quantity}</span>
                       <button
                         onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                         className="w-8 h-8 rounded border border-gray-300 dark:border-[#27353a] hover:border-[#00bfff] flex items-center justify-center text-gray-600 dark:text-gray-400 transition-colors duration-300"
                       >
                         +
                       </button>
                    </div>
                    <div className="text-right">
                       <p className="text-gray-600 dark:text-gray-400 text-sm transition-colors duration-300">₦{item.price.toLocaleString()}</p>
                       <p className="text-lg font-bold text-[#00bfff] transition-colors duration-300">₦{(item.price * item.quantity).toLocaleString()}</p>
                     </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
             <div className="border border-gray-300 dark:border-[#27353a] rounded-lg p-6 bg-gray-50 dark:bg-[#161b1d] h-fit transition-colors duration-300">
               <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 transition-colors duration-300">Order Summary</h2>

               <div className="space-y-4 mb-6 border-b border-gray-300 dark:border-[#27353a] pb-6 transition-colors duration-300">
                 <div className="flex justify-between text-gray-600 dark:text-gray-400 transition-colors duration-300">
                   <span>Subtotal</span>
                   <span>₦{subtotal.toLocaleString()}</span>
                 </div>
                 <div className="flex justify-between text-gray-600 dark:text-gray-400 transition-colors duration-300">
                   <span>Tax (10%)</span>
                   <span>₦{tax.toLocaleString()}</span>
                 </div>
                 <div className="flex justify-between text-gray-900 dark:text-white font-bold text-lg transition-colors duration-300">
                   <span>Total</span>
                   <span className="text-[#00bfff] transition-colors duration-300">₦{total.toLocaleString()}</span>
                 </div>
               </div>

              {user ? (
                <Link to="/checkout" className="block w-full">
                  <Button size="lg" className="w-full">
                    Proceed to Checkout
                  </Button>
                </Link>
              ) : (
                <Button
                  size="lg"
                  className="w-full"
                  onClick={() => {
                    toast.info('Please log in to continue to checkout', { position: 'top-right' });
                    navigate('/login', { state: { from: '/checkout' } });
                  }}
                >
                  Log in to Checkout
                </Button>
              )}

              <Link to="/products" className="block mt-4 w-full">
                <Button variant="outline" size="lg" className="w-full">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShoppingCart;
