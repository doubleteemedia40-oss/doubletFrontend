import { Link, useLocation } from 'react-router-dom';
import Button from '../components/Button';

const OrderConfirmed = () => {
  const location = useLocation();
  const state = location.state as { reference?: string } | null;
  const orderId = state?.reference || 'ORDER';

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] py-16 transition-colors duration-300">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Success Icon */}
          <div className="mb-6 flex justify-center">
            <div className="inline-flex size-24 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 transition-colors duration-300">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-4 transition-colors duration-300">Order Confirmed!</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 transition-colors duration-300">
            Thank you for your purchase. Your order has been successfully confirmed and is being processed.
          </p>

          {/* Order Details */}
          <div className="border border-gray-300 dark:border-[#27353a] rounded-lg p-8 bg-gray-50 dark:bg-[#161b1d] mb-8 transition-colors duration-300">
            <div className="mb-6 text-left">
              <p className="text-gray-600 dark:text-gray-400 text-sm transition-colors duration-300">Order Number</p>
              <p className="text-2xl font-bold text-[#00bfff] font-mono transition-colors duration-300">{orderId}</p>
            </div>

            <div className="space-y-4 text-left border-t border-gray-300 dark:border-[#27353a] pt-6 transition-colors duration-300">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400 transition-colors duration-300">Order Status</span>
                <span className="text-emerald-400 font-semibold transition-colors duration-300">Processing</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400 transition-colors duration-300">Delivery Method</span>
                <span className="text-gray-900 dark:text-white transition-colors duration-300">Email Delivery</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400 transition-colors duration-300">Estimated Delivery</span>
                <span className="text-gray-900 dark:text-white transition-colors duration-300">Within 24 hours</span>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-[#00bfff]/10 border border-[#00bfff]/20 rounded-lg p-6 mb-8 text-left transition-colors duration-300">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-300">What's Next?</h3>
            <ol className="space-y-3 text-gray-600 dark:text-gray-400 text-sm transition-colors duration-300">
              <li className="flex gap-3">
                <span className="text-[#00bfff] font-bold flex-shrink-0 transition-colors duration-300">1.</span>
                <span>Check your email (including spam folder) for order confirmation</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#00bfff] font-bold flex-shrink-0 transition-colors duration-300">2.</span>
                <span>You will receive account credentials via email shortly</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#00bfff] font-bold flex-shrink-0 transition-colors duration-300">3.</span>
                <span>Log in with the provided credentials immediately after receiving</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#00bfff] font-bold flex-shrink-0 transition-colors duration-300">4.</span>
                <span>Change your password and secure your new account</span>
              </li>
            </ol>
          </div>

          {/* Contact Support */}
          <div className="mb-8">
            <p className="text-gray-600 dark:text-gray-400 mb-4 transition-colors duration-300">Need help? Contact our support team</p>
            <a href="mailto:support@doubletmedia.com" className="text-[#00bfff] hover:text-[#009acd] font-medium transition-colors duration-300">
              support@doubletmedia.com
            </a>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <Button size="lg">Back to Home</Button>
            </Link>
            <Link to="/order-history">
              <Button variant="outline" size="lg">View Order History</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmed;
