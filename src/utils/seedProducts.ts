
import type { Product } from '../store/useStore';
import { useStore } from '../store/useStore';
 
const API_BASE = (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_API_URL || 'http://localhost:4000';

export const initialProducts: Omit<Product, 'id'>[] = [
  {
    name: 'High Quality Indonesia Facebook',
    price: 8500,
    stock: 50,
    category: 'Facebook',
    description: 'High quality Indonesian Facebook account with active marketplace access. Perfect for advertising and marketplace listing.',
    features: [
      '30+ Friends',
      'Active Marketplace',
      'Verified Email',
      'Good Activity History'
    ]
  },
  {
    name: 'Facebook Business Manager (Verified)',
    price: 45000,
    stock: 10,
    category: 'Facebook',
    description: 'Fully verified Facebook Business Manager with high daily spending limit. Ready for immediate ad campaigns.',
    features: [
      'Verified BM',
      '$250 Daily Limit',
      'ID Verified',
      'Ready to Advertise'
    ]
  },
  {
    name: 'Instagram Aged Account (2018)',
    price: 12000,
    stock: 25,
    category: 'Instagram',
    description: 'Aged Instagram account created in 2018. Higher trust score and better resistance to bans.',
    features: [
      'Created 2018',
      'Phone Verified',
      'Email Access',
      'Warm-up Ready'
    ]
  },
  {
    name: 'TikTok Ads Account (Post-Pay)',
    price: 25000,
    stock: 15,
    category: 'TikTok',
    description: 'TikTok Ads account with post-payment threshold. Run ads now and pay later.',
    features: [
      'Post-Pay Threshold',
      'No Tax',
      'Active Status',
      'Global Targeting'
    ]
  },
  {
    name: 'Twitter/X Blue Tick Account',
    price: 35000,
    stock: 5,
    category: 'Twitter',
    description: 'Twitter account with active Blue subscription. Enhanced visibility and features.',
    features: [
      'Blue Verified',
      'SMS Verified',
      'Clean History',
      'Premium Features'
    ]
  },
  {
    name: 'NordVPN Premium (1 Year)',
    price: 3500,
    stock: 100,
    category: 'VPN',
    description: 'Shared NordVPN premium account valid for 1 year. High speed and secure connection.',
    features: [
      '1 Year Validity',
      'Multiple Devices',
      'Geo-unblock',
      'No Logs'
    ]
  },
  {
    name: 'ExpressVPN Mobile Key',
    price: 4500,
    stock: 50,
    category: 'VPN',
    description: 'Key for ExpressVPN mobile application. Fast and reliable.',
    features: [
      'Mobile Only',
      '30 Days',
      'High Speed',
      'Auto-connect'
    ]
  },
  {
    name: 'USA Fullz (SSN + DOB)',
    price: 15000,
    stock: 20,
    category: 'LOGS',
    description: 'Full identity details for USA profiles. Includes SSN, DOB, and background info.',
    features: [
      'High Credit Score',
      'Background Check',
      'Full Info',
      'Fresh Data'
    ]
  },
  {
    name: 'Mixed Logs (Game + Social)',
    price: 5000,
    stock: 200,
    category: 'LOGS',
    description: 'Mixed logs containing credentials for various gaming and social platforms.',
    features: [
      'Unchecked',
      'Mixed Sources',
      'High Volume',
      'Cheap Price'
    ]
  }
];

export const seedProducts = async () => {
  try {
    // Check DB (or current mode) first; if products exist, skip
    const resDb = await fetch(`${API_BASE}/api/products?source=db&limit=50`);
    if (!resDb.ok) throw new Error('Failed to check products');
    const dbData = await resDb.json();
    if (Array.isArray(dbData.items) && dbData.items.length > 0) {
      return { success: false, message: 'Products already present' };
    }
    // Prefer file products if available
    const resFile = await fetch(`${API_BASE}/api/products?source=file&limit=1000`);
    const fileData = resFile.ok ? await resFile.json() : { items: [] };
    const sourceItems = Array.isArray(fileData.items) && fileData.items.length > 0 ? fileData.items : initialProducts;
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
    return { success: true, message: sourceItems === initialProducts ? 'Seeded default products' : 'Seeded from file products' };
  } catch (error) {
    console.error('Error seeding products:', error);
    throw error;
  }
};
