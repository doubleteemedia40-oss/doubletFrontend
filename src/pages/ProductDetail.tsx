import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import Button from '../components/Button';
import { useToast } from '../context/useToast';
import SEO from '../components/SEO';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, addToCart } = useStore();
  const toast = useToast();

  const product = products.find((p) => p.id === id);
  const platform = product?.features.find(f => f.toLowerCase().startsWith('platform:'))?.split(':')[1]?.trim() || '';
  const region = product?.features.find(f => f.toLowerCase().startsWith('region:'))?.split(':')[1]?.trim() || '';

  if (!product) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0a0a0a] flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-300">Product not found</h1>
          <Button onClick={() => navigate('/products')}>Back to Products</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SEO
          title={`${product.name} — DoubleT`}
          description={product.description}
          canonicalPath={`/product/${product.id}`}
          type="product"
          jsonLd={{
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: product.name,
            description: product.description,
            sku: product.id,
            category: product.category,
            offers: {
              '@type': 'Offer',
              priceCurrency: 'NGN',
              price: product.price,
              availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
            },
          }}
        />
        <div className="mb-8 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <button onClick={() => navigate('/')} className="hover:text-[#00bfff] dark:hover:text-[#00bfff]">Home</button>
          <span>/</span>
          <button onClick={() => navigate('/products')} className="hover:text-[#00bfff] dark:hover:text-[#00bfff]">Products</button>
          <span>/</span>
          <span className="text-gray-900 dark:text-white">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-xl border border-gray-300 dark:border-[#27353a] bg-gray-50 dark:bg-[#161b1d] p-6">
              <div className="flex items-start justify-between">
                <div className="rounded-lg bg-[#00bfff]/10 px-3 py-1 text-xs font-bold uppercase text-[#00bfff]">
                  {product.category}
                </div>
                <div className={`text-xs font-medium ${product.stock > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </div>
              </div>
              <h1 className="mt-4 text-3xl font-black text-gray-900 dark:text-white">{product.name}</h1>
              <p className="mt-3 text-gray-600 dark:text-gray-400">{product.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {platform && <span className="inline-flex items-center rounded-full bg-gray-200 dark:bg-[#0f1e23] px-3 py-1 text-xs font-medium text-gray-700 dark:text-gray-300">Platform: {platform}</span>}
                {region && <span className="inline-flex items-center rounded-full bg-gray-200 dark:bg-[#0f1e23] px-3 py-1 text-xs font-medium text-gray-700 dark:text-gray-300">Region: {region}</span>}
                <span className="inline-flex items-center rounded-full bg-gray-200 dark:bg-[#0f1e23] px-3 py-1 text-xs font-medium text-gray-700 dark:text-gray-300">ID: {product.id.slice(0,8)}</span>
              </div>
            </div>

            <div className="rounded-xl border border-gray-300 dark:border-[#27353a] bg-white dark:bg-[#0f1e23] p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Features</h3>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {product.features.filter(f => {
                  const lf = f.toLowerCase();
                  return !lf.startsWith('region:') && !lf.startsWith('platform:') && !lf.startsWith('age:') && !lf.startsWith('followers:');
                }).map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                    <span className="inline-block size-2 rounded-full bg-[#00bfff]"></span>
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="rounded-xl border border-gray-300 dark:border-[#27353a] bg-gray-50 dark:bg-[#161b1d] p-6 sticky top-24">
              <div className="flex items-baseline justify-between">
                <span className="text-gray-600 dark:text-gray-400">Price</span>
                <span className="text-3xl font-bold text-[#00bfff]">₦{product.price.toLocaleString()}</span>
              </div>
              <div className="mt-6 space-y-3">
                <Button
                  onClick={() => { addToCart(product); toast.success('Added to cart'); }}
                  disabled={product.stock === 0}
                  size="lg"
                  className="w-full"
                >
                  Add to Cart
                </Button>
                <Button
                  onClick={() => navigate('/products')}
                  variant="outline"
                  size="lg"
                  className="w-full"
                >
                  Continue Shopping
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
