import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { lazy, Suspense } from 'react';
const HomePage = lazy(() => import('./pages/HomePage'));
const ProductListing = lazy(() => import('./pages/ProductListing'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const ShoppingCart = lazy(() => import('./pages/ShoppingCart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const OrderConfirmed = lazy(() => import('./pages/OrderConfirmed'));
const AccountLogin = lazy(() => import('./pages/AccountLogin'));
const CreateAccount = lazy(() => import('./pages/CreateAccount'));
const PasswordRecovery = lazy(() => import('./pages/PasswordRecovery'));
const OrderHistory = lazy(() => import('./pages/OrderHistory'));
const AccountSettings = lazy(() => import('./pages/AccountSettings'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const ManageProduct = lazy(() => import('./pages/ManageProduct'));
const AdminOrdersList = lazy(() => import('./pages/AdminOrdersList'));
const AdminUsersList = lazy(() => import('./pages/AdminUsersList'));
const AdminLeaderboard = lazy(() => import('./pages/AdminLeaderboard'));
const AdminProductsList = lazy(() => import('./pages/AdminProductsList'));
const Terms = lazy(() => import('./pages/Terms'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const RefundPolicy = lazy(() => import('./pages/RefundPolicy'));
const ContactUs = lazy(() => import('./pages/ContactUs'));
import DisclaimerModal from './components/DisclaimerModal';
import { useStore } from './store/useStore';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  
  // User dashboard (/order-history) should use the default homepage nav items as requested.
  // So we only hide the layout for Admin pages.
  const useCustomLayout = isAdmin;

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-[#ffffff] font-display transition-colors duration-300">
      {!useCustomLayout && <Navbar />}
      <main className="flex-grow">
        {children}
      </main>
      <DisclaimerModal />
      {!useCustomLayout && <Footer />}
    </div>
  );
};

function App() {
  const { initialize } = useStore();

  useEffect(() => {
    const unsubscribe = initialize();
    return () => unsubscribe();
  }, [initialize]);

  return (
    <Router>
      <Layout>
        <Suspense fallback={<div className="p-8 text-center text-slate-500">Loading...</div>}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductListing />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<ShoppingCart />} />
            <Route path="/checkout" element={
              <RequireAuth>
                <Checkout />
              </RequireAuth>
            } />
            <Route path="/order-confirmed" element={<OrderConfirmed />} />
            <Route path="/login" element={<AccountLogin />} />
            <Route path="/register" element={<CreateAccount />} />
            <Route path="/password-recovery" element={<PasswordRecovery />} />
            <Route path="/order-history" element={<OrderHistory />} />
            <Route path="/account" element={<AccountSettings />} />
            <Route path="/settings" element={<AccountSettings />} />
            <Route path="/admin/dashboard" element={
              <RequireAdmin>
                <AdminDashboard />
              </RequireAdmin>
            } />
            <Route path="/admin/manage-product" element={
              <RequireAdmin>
                <ManageProduct />
              </RequireAdmin>
            } />
            <Route path="/admin/manage-product/:id" element={
              <RequireAdmin>
                <ManageProduct />
              </RequireAdmin>
            } />
            <Route path="/admin/orders" element={
              <RequireAdmin>
                <AdminOrdersList />
              </RequireAdmin>
            } />
            <Route path="/admin/products" element={
              <RequireAdmin>
                <AdminProductsList />
              </RequireAdmin>
            } />
            <Route path="/admin/users" element={
              <RequireAdmin>
                <AdminUsersList />
              </RequireAdmin>
            } />
            <Route path="/admin/leaderboard" element={
              <RequireAdmin>
                <AdminLeaderboard />
              </RequireAdmin>
            } />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/refund" element={<RefundPolicy />} />
            <Route path="/contact" element={<ContactUs />} />
          </Routes>
        </Suspense>
      </Layout>
    </Router>
  );
}

const RequireAdmin = ({ children }: { children: React.ReactNode }) => {
  const { user } = useStore();
  const location = useLocation();
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (!user.isAdmin) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  const { user } = useStore();
  const location = useLocation();
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <>{children}</>;
};

export default App;
