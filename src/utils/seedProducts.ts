
import { useStore } from '../store/useStore';

const API_BASE = (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_API_URL || 'http://localhost:4000';

export const seedProducts = async () => {
  try {
    const resDb = await fetch(`${API_BASE}/api/products?source=db&limit=1000`);
    if (!resDb.ok) throw new Error('Failed to check products');
    const dbData = await resDb.json();
    if (Array.isArray(dbData.items) && dbData.items.length > 0) {
      return { success: false, message: 'Products already present' };
    }
    const resFile = await fetch(`${API_BASE}/api/products?source=file&limit=1000`);
    if (!resFile.ok) throw new Error('Failed to load file products');
    const fileData = await resFile.json();
    const sourceItems = Array.isArray(fileData.items) ? fileData.items : [];
    if (sourceItems.length === 0) {
      return { success: false, message: 'No products found in file' };
    }
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
