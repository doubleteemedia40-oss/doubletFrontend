
import type { Product } from '../store/useStore';
import { useStore } from '../store/useStore';

const API_BASE = (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_API_URL || 'http://localhost:4000';

export const initialProducts: Omit<Product, 'id'>[] = [
  {
    name: '1 year+ Instagram | 500 Followers | No post',
    price: 15000,
    stock: 20,
    category: 'Instagram',
    description: 'Aged Instagram account with ~500 followers, no posts.',
    features: ['Age: 1+ year', 'Followers: ~500', 'No posts', 'Email Verified']
  },
  {
    name: '1yr+ Instagram | 1k Followers | No post',
    price: 25000,
    stock: 15,
    category: 'Instagram',
    description: 'Aged Instagram account with ~1k followers, no posts.',
    features: ['Age: 1+ year', 'Followers: ~1k', 'No posts', 'Email Verified']
  },
  {
    name: '2012-2019 Instagram | 1k Followers | With post',
    price: 35000,
    stock: 10,
    category: 'Instagram',
    description: 'Older Instagram with posts and ~1k followers.',
    features: ['Age: 2012-2019', 'Followers: ~1k', 'With posts']
  },
  {
    name: '2012-2019 Instagram | With Post | 2k Followers',
    price: 45000,
    stock: 8,
    category: 'Instagram',
    description: 'Older Instagram with posts and ~2k followers.',
    features: ['Age: 2012-2019', 'Followers: ~2k', 'With posts']
  },
  {
    name: '2012-2019 Instagram | With Post | 5k Followers',
    price: 70000,
    stock: 6,
    category: 'Instagram',
    description: 'Older Instagram with posts and ~5k followers.',
    features: ['Age: 2012-2019', 'Followers: ~5k', 'With posts']
  },
  {
    name: '2012-2019 Instagram | With Post | 15k Followers',
    price: 150000,
    stock: 3,
    category: 'Instagram',
    description: 'Older Instagram with posts and ~15k followers.',
    features: ['Age: 2012-2019', 'Followers: ~15k', 'With posts']
  },
  {
    name: '2012-2019 Instagram | With Post | 20k Followers',
    price: 180000,
    stock: 2,
    category: 'Instagram',
    description: 'Older Instagram with posts and ~20k followers.',
    features: ['Age: 2012-2019', 'Followers: ~20k', 'With posts']
  },
  {
    name: '2012-2019 Instagram | With Post | 30k Followers',
    price: 220000,
    stock: 2,
    category: 'Instagram',
    description: 'Older Instagram with posts and ~30k followers.',
    features: ['Age: 2012-2019', 'Followers: ~30k', 'With posts']
  },
  {
    name: '1year+ Empty Instagram | Without Post',
    price: 12000,
    stock: 25,
    category: 'Instagram',
    description: 'Aged Instagram with no posts, empty profile.',
    features: ['Age: 1+ year', 'No posts', 'Empty profile']
  },
  {
    name: '2012-2020 Empty Instagram With Post | Strong | Old',
    price: 40000,
    stock: 10,
    category: 'Instagram',
    description: 'Strong old Instagram, minimal posts.',
    features: ['Age: 2012-2020', 'Strong', 'Old']
  },
  {
    name: 'High Quality Indonesia Facebook | 30+ Friends | Good Marketplace',
    price: 15000,
    stock: 20,
    category: 'Facebook',
    description: 'Indonesian FB with 30+ friends and marketplace enabled.',
    features: ['Region: Indonesia', 'Friends: 30+', 'Marketplace: Good']
  },
  {
    name: '5-12 years USA Facebook | has few friends and good marketplace | 80% can create another profile',
    price: 55000,
    stock: 10,
    category: 'Facebook',
    description: 'Aged USA FB with marketplace; high chance to create another profile.',
    features: ['Age: 5-12 years', 'Region: USA', 'Marketplace: Good', 'Profile creation: ~80%']
  },
  {
    name: '5-12 years Random Countries Facebook | 0-100 Friends | good Marketplace |80% Create Profile',
    price: 35000,
    stock: 15,
    category: 'Facebook',
    description: 'Aged FB from random countries with marketplace.',
    features: ['Age: 5-12 years', 'Friends: 0-100', 'Marketplace: Good', 'Profile creation: ~80%']
  },
  {
    name: 'High Quality Germany Facebook Account |30-1k Friends | Most have Dating Function',
    price: 65000,
    stock: 8,
    category: 'Facebook',
    description: 'German FB with many friends; dating function often available.',
    features: ['Region: Germany', 'Friends: 30-1k', 'Dating: Available']
  },
  {
    name: 'Foreign 2k+ Followers Tiktok Account | Unlock mail with SMS',
    price: 80000,
    stock: 6,
    category: 'TikTok',
    description: 'TikTok account with 2k+ followers, mail unlock via SMS.',
    features: ['Followers: 2k+', 'Unlock: SMS', 'Region: US/Foreign']
  },
  {
    name: 'Foreign 1k+ Followers Tiktok Account | Unlock mail with SMS',
    price: 50000,
    stock: 10,
    category: 'TikTok',
    description: 'TikTok account with 1k+ followers, mail unlock via SMS.',
    features: ['Followers: 1k+', 'Unlock: SMS', 'Region: US/Foreign']
  },
  {
    name: 'Foreign 500+ Followers Tiktok Account | Unlock mail with SMS',
    price: 30000,
    stock: 12,
    category: 'TikTok',
    description: 'TikTok account with 500+ followers, mail unlock via SMS.',
    features: ['Followers: 500+', 'Unlock: SMS', 'Region: US/Foreign']
  },
  {
    name: 'Foreign 100+ Followers Tiktok Account | Unlock mail with SMS',
    price: 15000,
    stock: 15,
    category: 'TikTok',
    description: 'TikTok account with 100+ followers, mail unlock via SMS.',
    features: ['Followers: 100+', 'Unlock: SMS', 'Region: US/Foreign']
  },
  {
    name: '1yr+ TikTok | Empty | Male and Female Profile',
    price: 10000,
    stock: 20,
    category: 'TikTok',
    description: 'Aged TikTok, empty profile (male/female).',
    features: ['Age: 1+ year', 'Empty profile']
  },
  {
    name: 'Twitter | 11-15 years | 0-50 followers',
    price: 45000,
    stock: 8,
    category: 'Twitter',
    description: 'Aged Twitter account with low followers.',
    features: ['Age: 11-15 years', 'Followers: 0-50']
  },
  {
    name: 'NORD VPN',
    price: 8000,
    stock: 100,
    category: 'VPN',
    description: 'Premium VPN with global servers, fast speeds, and strong encryption.',
    features: ['VPN: NordVPN', 'Global servers', 'High-speed', 'Encryption', 'No-logs']
  },
  {
    name: 'EXPRESS VPN',
    price: 9000,
    stock: 100,
    category: 'VPN',
    description: 'Trusted VPN with best-in-class speeds and streaming support.',
    features: ['VPN: ExpressVPN', 'Global servers', 'High-speed', 'Streaming-friendly', 'Encryption']
  },
  {
    name: 'IPVANISH',
    price: 7000,
    stock: 100,
    category: 'VPN',
    description: 'Secure VPN service with multi-device support and strong privacy.',
    features: ['VPN: IPVanish', 'Multi-device', 'No-logs', 'Encryption']
  },
  {
    name: 'PIA',
    price: 6000,
    stock: 100,
    category: 'VPN',
    description: 'Reliable VPN offering robust privacy controls and configurable security.',
    features: ['VPN: PIA', 'Privacy controls', 'Encryption', 'Global servers']
  },
  {
    name: 'TEXTPLUS',
    price: 3000,
    stock: 200,
    category: 'LOGS',
    description: 'US virtual numbers from TextPlus for SMS verification and messaging.',
    features: ['Logs: TextPlus', 'Region: US mix', 'Use: SMS/OTP', 'Instant delivery']
  },
  {
    name: 'GOOGLE VOICE',
    price: 5000,
    stock: 200,
    category: 'LOGS',
    description: 'Google Voice accounts/numbers for US verification, calling, and messaging.',
    features: ['Logs: Google Voice', 'Region: US', 'Use: OTP/verification', 'Instant delivery']
  },
  {
    name: 'EMAILS',
    price: 2000,
    stock: 500,
    category: 'LOGS',
    description: 'Fresh email accounts with login credentials for verification and recovery.',
    features: ['Logs: Emails', 'Domains: mixed', 'Format: email:password', 'Instant delivery']
  },
  {
    name: 'REDDITCH',
    price: 2500,
    stock: 300,
    category: 'LOGS',
    description: 'Reddit accounts/logs suitable for verification and community participation.',
    features: ['Logs: Redditch', 'Use: verification', 'Instant delivery']
  }
];

export const seedProducts = async () => {
  try {
    const resDb = await fetch(`${API_BASE}/api/products?limit=50`);
    if (!resDb.ok) throw new Error('Failed to check products');
    const dbData = await resDb.json();
    if (Array.isArray(dbData.items) && dbData.items.length > 0) {
      return { success: false, message: 'Products already present' };
    }
    const sourceItems = initialProducts;
    const token = useStore.getState().token;
    for (const item of sourceItems) {
      const payload = {
        name: item.name,
        category: item.category,
        price: item.price,
        stock: item.stock,
        description: item.description || '',
        ...(Array.isArray(item.features) ? { features: item.features } : {}),
      };
      const resp = await fetch(`${API_BASE}/api/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify(payload),
      });
      if (!resp.ok) throw new Error(`Failed to create product (${resp.status})`);
    }
    return { success: true, message: 'Seeded from file products' };
  } catch (error) {
    console.error('Error seeding products:', error);
    throw error;
  }
};
