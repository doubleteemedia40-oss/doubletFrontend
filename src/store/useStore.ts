import { create } from 'zustand';
import { persist } from 'zustand/middleware';
// Using pure backend auth; no Firebase client imports
import { sendReleaseEmail } from '../email/emailClient';

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  description: string;
  features: string[];
  image?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  isAdmin: boolean;
  active?: boolean;
}

export interface Order {
  id: string;
  userId: string;
  customer: string;
  email: string;
  items: CartItem[];
  total: number;
  status: 'Pending' | 'Processing' | 'Delivered' | 'Cancelled' | 'Completed';
  date: string;
  createdAt: string;
  reference?: string;
  delivery?: { details: string; updatedAt?: number };
}

interface Store {
  cartItems: CartItem[];
  user: User | null;
  token: string | null;
  products: Product[];
  orders: Order[];
  productsLimit: number;
  ordersCursor: string | null;
  isLoading: boolean;
  error: string | null;
  
  // Initialization
  initialize: () => () => void;
  fetchProducts: (limit?: number) => Promise<void>;
  loadMoreProducts: () => Promise<void>;

  // Cart actions
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  
  // User actions
  signup: (email: string, password: string, name: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
  
  // Category actions
  categories: string[];
  addCategory: (category: string) => void;
  deleteCategory: (category: string) => void;

  // Region actions
  regions: string[];
  addRegion: (region: string) => void;
  deleteRegion: (region: string) => void;

  // Platform actions
  platforms: string[];
  addPlatform: (platform: string) => void;
  deletePlatform: (platform: string) => void;

  // Users actions
  allUsers: User[];
  fetchAllUsers: () => Promise<void>;
  updateUserRole: (userId: string, isAdmin: boolean) => Promise<void>;
  setUserActive: (userId: string, active: boolean) => Promise<void>;

  // Product actions
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;

  // Order actions
  fetchOrders: (limit?: number, cursor?: string | null) => Promise<void>;
  loadMoreOrders: () => Promise<void>;
  fetchUserOrders: (userId: string, limit?: number, cursor?: string | null) => Promise<void>;
  loadMoreUserOrders: (userId: string) => Promise<void>;
  createOrder: (order: Omit<Order, 'id'>) => Promise<void>;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
  updateOrderDelivery: (orderId: string, details: string) => Promise<void>;
  
  // Auth helpers
  requestPasswordReset: (email: string) => Promise<string>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
}

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      cartItems: [],
      user: null,
      token: null,
      products: [],
      orders: [],
      productsLimit: 20,
      ordersCursor: null,
      categories: ['Streaming', 'Gaming', 'Software', 'VPN'],
      regions: ['Global (Worldwide)', 'United States', 'United Kingdom', 'European Union', 'Asia Pacific'],
      platforms: ['Netflix', 'Spotify', 'Steam', 'Disney+', 'Amazon Prime', 'Other'],
      allUsers: [],
      isLoading: false,
      error: null,

      initialize: () => {
        set({ isLoading: true });
        get().fetchProducts();
        const token = get().token;
        if (token) {
          const base = import.meta.env.VITE_API_URL || 'http://localhost:4000';
          fetch(`${base}/api/auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
          })
            .then(async (res) => {
              if (!res.ok) throw new Error('Failed to load user');
              const data = await res.json();
              set({ user: data.user });
              if (data.user?.isAdmin) {
                get().fetchOrders();
              }
            })
            .catch(() => set({ user: null }));
        } else {
          set({ user: null, orders: [] });
        }
        set({ isLoading: false });
        return () => {};
      },

      fetchProducts: async (limit) => {
        try {
          const base = import.meta.env.VITE_API_URL || 'http://localhost:4000';
          const lim = typeof limit === 'number' ? limit : get().productsLimit;
          const res = await fetch(`${base}/api/products?limit=${lim}`);
          if (!res.ok) throw new Error(`Failed to fetch products (${res.status})`);
          const data = await res.json();
          set({ products: data.items });
        } catch (error) {
          console.error("Error fetching products:", error);
          set({ error: 'Failed to fetch products' });
        }
      },
      loadMoreProducts: async () => {
        const nextLimit = get().products.length + 20;
        set({ productsLimit: nextLimit });
        await get().fetchProducts(nextLimit);
      },

      addToCart: (product, quantity = 1) =>
        set((state) => {
          const existing = state.cartItems.find((item) => item.id === product.id);
          let nextCart;
          if (existing) {
            nextCart = state.cartItems.map((item) =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            );
          } else {
            nextCart = [...state.cartItems, { ...product, quantity }];
          }
          try {
            window.dispatchEvent(new CustomEvent('app:cart-bump'));
          } catch (e) {
            console.error(e);
          }
          return { cartItems: nextCart };
        }),

      removeFromCart: (productId) =>
        set((state) => ({
          cartItems: state.cartItems.filter((item) => item.id !== productId),
        })),

      updateCartQuantity: (productId, quantity) =>
        set((state) => ({
          cartItems: state.cartItems.map((item) =>
            item.id === productId ? { ...item, quantity } : item
          ),
        })),

      clearCart: () => set({ cartItems: [] }),

      signup: async (email, password, name) => {
        set({ isLoading: true, error: null });
        try {
          const base = import.meta.env.VITE_API_URL || 'http://localhost:4000';
          const res = await fetch(`${base}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, name }),
          });
          if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.error || 'Registration failed');
          }
          const { token, user } = await res.json();
          set({ token, user });
          if (user.isAdmin) {
            await get().fetchOrders();
          }
          // Welcome email disabled per requirements

        } catch (error) {
          console.error("Signup failed:", error);
          set({ error: 'Registration failed' });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const base = import.meta.env.VITE_API_URL || 'http://localhost:4000';
          const res = await fetch(`${base}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          });
          if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.error || 'Login failed');
          }
          const { token, user } = await res.json();
          set({ token, user });
          if (user.isAdmin) {
            await get().fetchOrders();
          }
        } catch (error) {
          set({ error: 'Login failed' });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      logout: async () => {
        set({ user: null, token: null, cartItems: [], orders: [] });
      },

      setUser: (user) => set({ user }),

      addCategory: (category) =>
        set((state) => ({
          categories: [...state.categories, category],
        })),

      deleteCategory: (category) =>
        set((state) => ({
          categories: state.categories.filter((c) => c !== category),
        })),

      addRegion: (region) =>
        set((state) => ({
          regions: [...state.regions, region],
        })),

      deleteRegion: (region) =>
        set((state) => ({
          regions: state.regions.filter((r) => r !== region),
        })),

      addPlatform: (platform) =>
        set((state) => ({
          platforms: [...state.platforms, platform],
        })),

      deletePlatform: (platform) =>
        set((state) => ({
          platforms: state.platforms.filter((p) => p !== platform),
        })),

      

      addProduct: async (productData) => {
        set({ isLoading: true, error: null });
        try {
          const base = import.meta.env.VITE_API_URL || 'http://localhost:4000';
          const token = get().token;
          const res = await fetch(`${base}/api/products`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
            body: JSON.stringify(productData),
          });
          if (!res.ok) throw new Error(`Failed to create product (${res.status})`);
          const created = await res.json();
          set((state) => ({
            products: [...state.products, created],
          }));
        } catch (error) {
          set({ error: 'Failed to create product' });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      updateProduct: async (product) => {
        set({ isLoading: true, error: null });
        try {
          const base = import.meta.env.VITE_API_URL || 'http://localhost:4000';
          const { id, ...data } = product;
          const token = get().token;
          const res = await fetch(`${base}/api/products/${encodeURIComponent(id)}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
            body: JSON.stringify(data),
          });
          if (!res.ok) throw new Error(`Failed to update product (${res.status})`);
          const updated = await res.json();
          set((state) => ({
            products: state.products.map((p) => (p.id === updated.id ? updated : p)),
          }));
        } catch (error) {
          set({ error: 'Failed to update product' });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      deleteProduct: async (productId) => {
        set({ isLoading: true, error: null });
        try {
          const base = import.meta.env.VITE_API_URL || 'http://localhost:4000';
          const token = get().token;
          const res = await fetch(`${base}/api/products/${encodeURIComponent(productId)}`, {
            method: 'DELETE',
            headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
          });
          if (!res.ok && res.status !== 204) throw new Error(`Failed to delete product (${res.status})`);
          set((state) => ({
            products: state.products.filter((p) => p.id !== productId),
          }));
        } catch (error) {
          set({ error: 'Failed to delete product' });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      fetchOrders: async (limit, cursor) => {
        try {
          const base = import.meta.env.VITE_API_URL || 'http://localhost:4000';
          const token = get().token;
          const params = new URLSearchParams();
          params.set('limit', String(typeof limit === 'number' ? limit : 20));
          if (cursor) params.set('afterDate', cursor);
          const res = await fetch(`${base}/api/orders?${params.toString()}`, {
            headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
          });
          if (!res.ok) throw new Error(`Failed to fetch orders (${res.status})`);
          const data = await res.json();
          set({ orders: data.items, ordersCursor: data.nextCursor || null });
        } catch (error) {
          console.error("Error fetching orders:", error);
        }
      },
      loadMoreOrders: async () => {
        try {
          const base = import.meta.env.VITE_API_URL || 'http://localhost:4000';
          const token = get().token;
          const params = new URLSearchParams();
          params.set('limit', '20');
          if (get().ordersCursor) params.set('afterDate', get().ordersCursor as string);
          const res = await fetch(`${base}/api/orders?${params.toString()}`, {
            headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
          });
          if (!res.ok) throw new Error(`Failed to fetch orders (${res.status})`);
          const data = await res.json();
          set((state) => ({ orders: [...state.orders, ...data.items], ordersCursor: data.nextCursor || null }));
        } catch (error) {
          console.error("Error fetching more orders:", error);
        }
      },

      fetchUserOrders: async (userId: string, limit, cursor) => {
        try {
          const base = import.meta.env.VITE_API_URL || 'http://localhost:4000';
          const token = get().token;
          const params = new URLSearchParams();
          params.set('userId', userId);
          params.set('limit', String(typeof limit === 'number' ? limit : 20));
          if (cursor) params.set('afterDate', cursor);
          const res = await fetch(`${base}/api/orders?${params.toString()}`, {
            headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
          });
          if (!res.ok) throw new Error(`Failed to fetch user orders (${res.status})`);
          const data = await res.json();
          set({ orders: data.items, ordersCursor: data.nextCursor || null });
        } catch (error) {
          console.error("Error fetching user orders:", error);
        }
      },
      loadMoreUserOrders: async (userId: string) => {
        try {
          const base = import.meta.env.VITE_API_URL || 'http://localhost:4000';
          const token = get().token;
          const params = new URLSearchParams();
          params.set('userId', userId);
          params.set('limit', '20');
          if (get().ordersCursor) params.set('afterDate', get().ordersCursor as string);
          const res = await fetch(`${base}/api/orders?${params.toString()}`, {
            headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
          });
          if (!res.ok) throw new Error(`Failed to fetch user orders (${res.status})`);
          const data = await res.json();
          set((state) => ({ orders: [...state.orders, ...data.items], ordersCursor: data.nextCursor || null }));
        } catch (error) {
          console.error("Error fetching more user orders:", error);
        }
      },

      createOrder: async (orderData) => {
        try {
          const base = import.meta.env.VITE_API_URL || 'http://localhost:4000';
          const token = get().token;
          const res = await fetch(`${base}/api/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
            body: JSON.stringify(orderData),
          });
          if (!res.ok) throw new Error(`Failed to create order (${res.status})`);
          const created = await res.json();
          set((state) => ({ orders: [created, ...state.orders] }));
        } catch (error) {
          set({ error: 'Failed to create order' });
          throw error;
        }
      },

      fetchAllUsers: async () => {
        try {
          const base = import.meta.env.VITE_API_URL || 'http://localhost:4000';
          const token = get().token;
          const res = await fetch(`${base}/api/users`, {
            headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
          });
          if (!res.ok) throw new Error('Failed to fetch users');
          const data = await res.json();
          set({ allUsers: data.items });
        } catch (error) {
          console.error("Error fetching users:", error);
        }
      },

      updateUserRole: async (userId, isAdmin) => {
        try {
          const base = import.meta.env.VITE_API_URL || 'http://localhost:4000';
          const token = get().token;
          const res = await fetch(`${base}/api/users/${encodeURIComponent(userId)}/role`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
            body: JSON.stringify({ isAdmin }),
          });
          if (!res.ok) throw new Error('Failed to update user role');
          set((state) => ({
            allUsers: state.allUsers.map(u => u.id === userId ? { ...u, isAdmin } : u)
          }));
        } catch (error) {
          console.error("Error updating user role:", error);
          set({ error: 'Failed to update user role' });
          throw error;
        }
      },

      setUserActive: async (userId, active) => {
        try {
          const base = import.meta.env.VITE_API_URL || 'http://localhost:4000';
          const token = get().token;
          const res = await fetch(`${base}/api/users/${encodeURIComponent(userId)}/active`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
            body: JSON.stringify({ active }),
          });
          if (!res.ok) throw new Error('Failed to update user active');
          set((state) => ({
            allUsers: state.allUsers.map(u => u.id === userId ? { ...u, active } : u)
          }));
        } catch (error) {
          console.error("Error updating user active flag:", error);
          set({ error: 'Failed to update user active' });
          throw error;
        }
      },

      updateOrderStatus: async (orderId, status) => {
        set({ isLoading: true });
        try {
          const base = import.meta.env.VITE_API_URL || 'http://localhost:4000';
          const token = get().token;
          const res = await fetch(`${base}/api/orders/${encodeURIComponent(orderId)}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
            body: JSON.stringify({ status }),
          });
          if (!res.ok) throw new Error(`Failed to update order status (${res.status})`);
          
          set((state) => ({
            orders: state.orders.map(o => o.id === orderId ? { ...o, status } : o)
          }));

          if (status === 'Delivered') {
            const order = get().orders.find(o => o.id === orderId);
            if (order) {
              try {
                await sendReleaseEmail({
                  to_email: order.email,
                  to_name: order.customer,
                  order_id: order.id,
                  total: order.total.toString(),
                });
              } catch (emailError) {
                console.error("Failed to send release email:", emailError);
              }
            }
          }
        } catch (error) {
          set({ error: 'Failed to update order status' });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },
      
      updateOrderDelivery: async (orderId, details) => {
        const base = import.meta.env.VITE_API_URL || 'http://localhost:4000';
        const token = get().token;
        const res = await fetch(`${base}/api/orders/${encodeURIComponent(orderId)}/delivery`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
          body: JSON.stringify({ details }),
        });
        if (!res.ok) throw new Error('Failed to update delivery');
        const updated = await res.json();
        set((state) => ({
          orders: state.orders.map(o => o.id === orderId ? { ...o, delivery: updated.delivery } : o)
        }));
      },

      requestPasswordReset: async (email: string) => {
        const base = import.meta.env.VITE_API_URL || 'http://localhost:4000';
        const res = await fetch(`${base}/api/auth/request-reset`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || 'Failed to request reset');
        }
        const data = await res.json();
        return data.token as string;
      },

      resetPassword: async (tokenStr: string, newPassword: string) => {
        const base = import.meta.env.VITE_API_URL || 'http://localhost:4000';
        const res = await fetch(`${base}/api/auth/reset`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: tokenStr, newPassword }),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || 'Failed to reset password');
        }
      },

      
    }),
    {
      name: 'doublet-storage',
      partialize: (state) => ({
        cartItems: state.cartItems,
        user: state.user,
        token: state.token,
        categories: state.categories,
        regions: state.regions,
        platforms: state.platforms,
      }),
    }
  )
);
