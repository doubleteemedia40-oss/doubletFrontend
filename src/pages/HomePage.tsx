import { Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Zap, Lock, Headphones, ShoppingBag } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import vpnLogo from '../assets/vpn.svg';
import logsLogo from '../assets/logs.svg';
import { useStore } from '../store/useStore';
import SEO from '../components/SEO';

gsap.registerPlugin(ScrollTrigger);

const HomePage = () => {
  const { products, user } = useStore();
  const featuredProducts = products.slice(0, 8);
  const heroRef = useRef(null);

  useEffect(() => {
    // Hero animations
    const heroTimeline = gsap.timeline();
    
    heroTimeline.fromTo(
      '.hero-title',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
    )
    .fromTo(
      '.hero-subtitle',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
      '-=0.6'
    )
    .fromTo(
      '.hero-buttons',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
      '-=0.6'
    );

    // Feature cards scroll animation
    const featureEls = gsap.utils.toArray('.feature-card') as Element[];
    featureEls.forEach((element) => {
      gsap.fromTo(
        element as Element,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: element as Element,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );
    });

    // Product cards scroll animation
    const productEls = gsap.utils.toArray('.product-card-item') as Element[];
    productEls.forEach((element) => {
      gsap.fromTo(
        element as Element,
        { opacity: 0, scale: 0.9 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: 'back.out',
          scrollTrigger: {
            trigger: element as Element,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
    });

    // Category cards scroll animation
    const categoryEls = gsap.utils.toArray('.category-card') as Element[];
    categoryEls.forEach((element, index) => {
      gsap.fromTo(
        element as Element,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          delay: index * 0.05,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: element as Element,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div className="bg-[#0a0a0a] overflow-hidden">
      <SEO
        title="DoubleT — Premium Digital Accounts & Services"
        description="Instant access to verified social media assets, ad accounts, and digital real estate."
        canonicalPath="/"
        type="website"
      />
      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen w-full border-b border-[#27353a] bg-[#0a0a0a] overflow-hidden flex items-center justify-center">
        {/* Animated Hue Background Gradient Orbs */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Top-left animated cyan orb */}
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full blur-3xl opacity-30 animate-hue"></div>
          
          {/* Bottom-right animated magenta orb */}
          <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-gradient-to-tl from-purple-500 to-pink-500 rounded-full blur-3xl opacity-30 animate-hue" style={{ animationDelay: '2s' }}></div>
          
          {/* Center animated gradient */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-b from-cyan-500/50 via-purple-500/30 to-pink-500/50 rounded-full blur-3xl opacity-20 animate-gradient-bg"></div>
        </div>

        {/* Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none"></div>
        
        {/* Hero Content */}
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center">
            {/* Main Title */}
            <h1 className="hero-title mx-auto max-w-4xl text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-7xl text-glow">
              Premium Digital <br className="hidden sm:block" />
              <span className="text-[#00bfff]">Accounts & Services</span>
            </h1>

            {/* Subtitle */}
            <p className="hero-subtitle mx-auto mt-6 max-w-2xl text-lg text-[#9ca3af]">
              Instant access to verified social media assets, ad accounts, and digital real estate. Secure, anonymous, and ready to scale your business.
            </p>

            {/* CTA Buttons */}
            <div className="hero-buttons mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link
                to="/products"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-[#00bfff] px-8 text-sm font-bold text-black transition-all duration-300 hover:bg-[#009acd] hover:text-white hover:shadow-lg hover:shadow-[#00bfff]/50 hover:scale-110"
              >
                <ShoppingBag size={20} />
                Browse Products
              </Link>
              {!user && (
                <Link
                  to="/register"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-[#00bfff] px-8 text-sm font-bold text-[#00bfff] transition-all duration-300 hover:bg-[#009acd] hover:text-white"
                >
                  Create Account
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-b border-gray-200 dark:border-[#27353a] bg-gray-50 dark:bg-[#161b1d] py-12 transition-colors duration-300">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="feature-card flex flex-col items-center text-center p-4 rounded-xl border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:border-cyan-500 hover:shadow-lg hover:shadow-cyan-500/20 hover:scale-105">
              <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 transition-all duration-300 group-hover:bg-cyan-500/20 group-hover:scale-110">
                <Zap size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white transition-colors duration-300">Instant Delivery</h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-[#9ca3af] transition-colors duration-300">Receive account credentials immediately via email after your payment is confirmed.</p>
            </div>

            <div className="feature-card flex flex-col items-center text-center p-4 rounded-xl border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/20 hover:scale-105">
              <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 transition-all duration-300 group-hover:bg-blue-500/20 group-hover:scale-110">
                <Lock size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white transition-colors duration-300">Secure Checkout</h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-[#9ca3af] transition-colors duration-300">Encrypted transactions via cryptocurrency and major cards ensuring your safety.</p>
            </div>

            <div className="feature-card flex flex-col items-center text-center p-4 rounded-xl border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:border-purple-500 hover:shadow-lg hover:shadow-purple-500/20 hover:scale-105">
              <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 transition-all duration-300 group-hover:bg-purple-500/20 group-hover:scale-110">
                <Headphones size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white transition-colors duration-300">24/7 Support</h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-[#9ca3af] transition-colors duration-300">Expert technical assistance available round the clock to help you get started.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 border-t border-gray-200 dark:border-cyan-500/20 transition-colors duration-300">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl transition-colors duration-300">Browse by Platform</h2>
              <p className="mt-2 text-gray-600 dark:text-gray-400 transition-colors duration-300">Explore our curated collections of premium digital assets</p>
            </div>
            <Link to="/products" className="hidden text-sm font-medium text-cyan-600 dark:text-[#00bfff] hover:text-cyan-700 dark:hover:text-[#009acd] transition-colors duration-300 sm:block">
              View All Categories →
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {/* Facebook */}
            <button className="category-card flex flex-col items-center gap-3 rounded-xl border border-gray-300 dark:border-[#27353a] bg-white dark:bg-[#161b1d] p-6 text-center transition-all duration-300">
              <div className="flex size-16 items-center justify-center">
                <img src="https://www.facebook.com/images/fb_icon_325x325.png" alt="Facebook" className="w-14 h-14 object-contain" />
              </div>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">Facebook</span>
            </button>

            {/* Instagram */}
            <button className="category-card flex flex-col items-center gap-3 rounded-xl border border-gray-300 dark:border-[#27353a] bg-white dark:bg-[#161b1d] p-6 text-center transition-all duration-300">
              <div className="flex size-16 items-center justify-center">
                <img src="https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg" alt="Instagram" className="w-14 h-14 object-contain" />
              </div>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">Instagram</span>
            </button>

            {/* TikTok */}
            <button className="category-card flex flex-col items-center gap-3 rounded-xl border border-gray-300 dark:border-[#27353a] bg-white dark:bg-[#161b1d] p-6 text-center transition-all duration-300">
              <div className="flex size-16 items-center justify-center">
                <img src="https://www.tiktok.com/favicon.ico" alt="TikTok" className="w-14 h-14 object-contain rounded" />
              </div>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">TikTok</span>
            </button>

            {/* Twitter/X */}
            <button className="category-card flex flex-col items-center gap-3 rounded-xl border border-gray-300 dark:border-[#27353a] bg-white dark:bg-[#161b1d] p-6 text-center transition-all duration-300">
              <div className="flex size-16 items-center justify-center">
                <img src="https://www.x.com/favicon.ico" alt="Twitter X" className="w-14 h-14 object-contain rounded" />
              </div>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">Twitter</span>
            </button>

            {/* VPN */}
            <button className="category-card flex flex-col items-center gap-3 rounded-xl border border-gray-300 dark:border-[#27353a] bg-white dark:bg-[#161b1d] p-6 text-center transition-all duration-300">
              <div className="flex size-16 items-center justify-center">
                <img src={vpnLogo} alt="VPN" className="w-14 h-14 object-contain" />
              </div>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">VPN</span>
            </button>

            {/* LOGS */}
            <button className="category-card flex flex-col items-center gap-3 rounded-xl border border-gray-300 dark:border-[#27353a] bg-white dark:bg-[#161b1d] p-6 text-center transition-all duration-300">
              <div className="flex size-16 items-center justify-center">
                <img src={logsLogo} alt="Logs" className="w-14 h-14 object-contain" />
              </div>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">LOGS</span>
            </button>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="bg-gray-100 dark:bg-[#0a0a0a]/30 py-16 border-t border-gray-200 dark:border-[#27353a] transition-colors duration-300">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl transition-colors duration-300">Featured Accounts</h2>
            <p className="mt-2 text-gray-600 dark:text-[#9ca3af] transition-colors duration-300">Hand-picked premium assets ready for transfer.</p>
          </div>

          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {featuredProducts.map((product) => (
                <div key={product.id} className="product-card-item">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-[#9ca3af]">No featured products available yet.</p>
              <Link to="/products" className="text-[#00bfff] hover:text-[#009acd] mt-4 inline-block">
                Browse all products →
              </Link>
            </div>
          )}

          <div className="mt-12 flex justify-center">
            <Link
              to="/products"
              className="group flex items-center gap-2 rounded-lg border-2 border-cyan-500/50 bg-transparent px-6 py-3 text-sm font-bold text-gray-900 dark:text-white transition-all duration-300 hover:border-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-600 dark:hover:text-cyan-400 hover:shadow-lg hover:shadow-cyan-500/30"
            >
              View Full Catalog
              <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
