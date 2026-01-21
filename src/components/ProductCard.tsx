import { Link } from 'react-router-dom';
import type { Product } from '../store/useStore';
import { useStore } from '../store/useStore';
import { Plus } from 'lucide-react';
import { useToast } from '../context/useToast';

interface ProductCardProps {
  product: Product;
  variant?: 'default' | 'compact' | 'featured';
}

const ProductCard: React.FC<ProductCardProps> = ({ product, variant = 'default' }) => {
  const { addToCart } = useStore();
  const toast = useToast();
  const regionTag = product.features.find(f => f.toLowerCase().startsWith('region:'));
  const ageTag = product.features.find(f => f.toLowerCase().startsWith('age:'));
  const followersTag = product.features.find(f => f.toLowerCase().startsWith('followers:'));
  const region = regionTag ? regionTag.split(':')[1]?.trim() : '';
  const age = ageTag ? ageTag.split(':')[1]?.trim() : '';
  const followers = followersTag ? followersTag.split(':')[1]?.trim() : '';
  const coreFeatureKeys = ['region:', 'platform:', 'age:', 'followers:'];
  const displayFeatures = product.features.filter(f => !coreFeatureKeys.some(k => f.toLowerCase().startsWith(k)));
  const extraCount = Math.max(0, displayFeatures.length - 3);

  const handleAddToCart = () => {
    addToCart(product);
    try {
      toast.success('Added to cart', { position: 'bottom-right', duration: 2000 });
    } catch (e) {
      console.error(e);
    }
  };

  if (variant === 'compact') {
    return (
      <Link
        to={`/product/${product.id}`}
        className="card-hover group flex flex-col items-center gap-3 rounded-xl border border-border-color bg-surface-dark p-6 text-center hover:border-primary hover:bg-surface-light transition-all"
      >
        <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          {product.category === 'Facebook' && (
            <svg className="size-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978 1.602 0 2.455.118 2.858.177v3.416h-2.317c-1.634 0-1.965.705-1.965 2.012v1.953h4.273l-.571 3.667h-3.702v7.98h-4.43z" /></svg>
          )}
          {product.category === 'Instagram' && (
            <svg className="size-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.012 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.019 1.347 20.351.935 19.56.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0z" /></svg>
          )}
        </div>
        <span className="text-sm font-semibold text-white group-hover:text-primary">{product.name}</span>
      </Link>
    );
  }

  return (
    <Link to={`/product/${product.id}`} className="card-hover flex flex-col justify-between rounded-xl border border-border-color bg-surface-dark p-6 hover:border-primary hover:shadow-lg hover:shadow-primary/20 transition-all">
      <div>
        <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        <p className="mt-1 text-sm text-text-muted line-clamp-2">{product.description}</p>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-[#0f1e23] border border-[#27353a] px-3 py-2 text-xs text-slate-300">
            <span className="mr-1">Country:</span>
            <span className="text-white">{region || '—'}</span>
          </div>
          <div className="rounded-lg bg-[#0f1e23] border border-[#27353a] px-3 py-2 text-xs text-slate-300">
            <span className="mr-1">Age:</span>
            <span className="text-white">{age || '—'}</span>
          </div>
          <div className="col-span-2 rounded-lg bg-[#0f1e23] border border-[#27353a] px-3 py-2 text-xs text-slate-300">
            <span className="mr-1">Followers:</span>
            <span className="text-white">{followers || '—'}</span>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {displayFeatures.slice(0, 3).map((feature, idx) => (
            <span key={idx} className="inline-flex items-center rounded-full bg-[#0f1e23] border border-[#27353a] px-3 py-1 text-xs text-slate-300">
              {feature}
            </span>
          ))}
          {extraCount > 0 && (
            <span className="inline-flex items-center rounded-full bg-[#0f1e23] border border-[#27353a] px-3 py-1 text-xs text-slate-300">
              +{extraCount}
            </span>
          )}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-border-color pt-6">
        <div className="flex flex-col">
          <span className="text-xs text-text-muted">Price</span>
          <span className="font-mono text-xl font-bold text-primary">
            ₦{product.price.toLocaleString()}
          </span>
        </div>
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleAddToCart(); }}
          disabled={product.stock === 0}
          className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-bold text-black transition-all hover:bg-[#00bfff] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add to Cart
          <Plus size={16} />
        </button>
      </div>
    </Link>
  );
};

export default ProductCard;
