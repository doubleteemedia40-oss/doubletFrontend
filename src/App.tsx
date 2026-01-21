import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductListing from './pages/ProductListing';
import ProductDetail from './pages/ProductDetail';
import ShoppingCart from './pages/ShoppingCart';
import Checkout from './pages/Checkout';
import OrderConfirmed from './pages/OrderConfirmed';
import AccountLogin from './pages/AccountLogin';
import CreateAccount from './pages/CreateAccount';
import PasswordRecovery from './pages/PasswordRecovery';
import OrderHistory from './pages/OrderHistory';
import AccountSettings from './pages/AccountSettings';
import AdminDashboard from './pages/AdminDashboard';
import ManageProduct from './pages/ManageProduct';
import AdminOrdersList from './pages/AdminOrdersList';
import AdminUsersList from './pages/AdminUsersList';
import AdminLeaderboard from './pages/AdminLeaderboard';
import AdminProductsList from './pages/AdminProductsList';
import Terms from './pages/Terms';
import PrivacyPolicy from './pages/PrivacyPolicy';
import RefundPolicy from './pages/RefundPolicy';
import ContactUs from './pages/ContactUs';
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
