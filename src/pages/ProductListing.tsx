import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ProductCard from '../components/ProductCard';
import { useStore } from '../store/useStore';
import SEO from '../components/SEO';

gsap.registerPlugin(ScrollTrigger);

const ProductListing = () => {
  const { products, loadMoreProducts } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const productsContainerRef = useRef(null);

  const categories = ['all', 'Facebook', 'Instagram', 'TikTok', 'Twitter', 'VPN', 'LOGS'];

  const filteredProducts = products.filter((product) => {
    const matchCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  useEffect(() => {
    // Animate products on scroll
    const elements = gsap.utils.toArray('.product-item') as Element[];
    elements.forEach((element) => {
      gsap.fromTo(
        element as Element,
        { opacity: 0, scale: 0.9 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          ease: 'back.out',
          scrollTrigger: {
            trigger: element as Element,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [filteredProducts]);

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] py-16 transition-colors duration-300">
      <SEO
        title="Browse Products — DoubleT"
        description="Explore premium digital accounts and services across social platforms and VPN."
        canonicalPath="/products"
        type="website"
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 transition-colors duration-300">
          <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-4 transition-colors duration-300">Product Catalog</h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg transition-colors duration-300">Browse our collection of premium digital accounts and services</p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 space-y-4 md:space-y-0 md:flex md:items-center md:gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-[#27353a] bg-gray-50 dark:bg-[#161b1d] text-gray-900 dark:text-white placeholder-gray-600 dark:placeholder-gray-400 focus:outline-none focus:border-[#00bfff] focus:dark:border-[#00bfff] transition-colors duration-300"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-8 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg font-medium transition-all capitalize transition-colors duration-300 ${
                selectedCategory === cat
                  ? 'bg-[#00bfff] text-black dark:bg-[#00bfff] dark:text-black'
                  : 'border border-gray-300 dark:border-[#27353a] text-gray-600 dark:text-gray-400 hover:border-[#00bfff] dark:hover:border-[#00bfff] hover:text-[#00bfff] dark:hover:text-[#00bfff]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div ref={productsContainerRef} className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 transition-colors duration-300">
            {filteredProducts.map((product) => (
              <div key={product.id} className="product-item transition-colors duration-300">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : selectedCategory === 'all' && searchTerm.trim().length === 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div key={idx} className="rounded-xl border border-gray-300 dark:border-[#27353a] bg-gray-50 dark:bg-[#161b1d] p-4 animate-pulse">
                <div className="h-32 rounded-lg bg-gray-200 dark:bg-[#27353a]" />
                <div className="mt-4 h-4 w-2/3 rounded bg-gray-200 dark:bg-[#27353a]" />
                <div className="mt-2 h-3 w-1/2 rounded bg-gray-200 dark:bg-[#27353a]" />
                <div className="mt-4 h-8 w-24 rounded bg-gray-200 dark:bg-[#27353a]" />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-gradient-to-r from-cyan-500/5 to-purple-500/5 dark:from-cyan-500/5 dark:to-purple-500/5 rounded-xl border border-cyan-500/20 dark:border-cyan-500/20 transition-colors duration-300">
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-4 transition-colors duration-300">No products found matching your search.</p>
            <p className="text-gray-500 dark:text-gray-500 text-sm transition-colors duration-300">Try adjusting your search terms or category filters</p>
          </div>
        )}
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => loadMoreProducts()}
            className="px-5 py-2.5 rounded-lg bg-[#00bfff] hover:bg-[#00bfff]/90 text-black font-bold shadow-lg shadow-[#00bfff]/20 transition-colors"
          >
            Load More
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductListing;
