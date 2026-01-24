import SEO from '../components/SEO';

const About = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] py-16 transition-colors duration-300">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <SEO title="About — DoubleT" canonicalPath="/about" type="article" />
        <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-6">About Us</h1>
        <p className="text-gray-700 dark:text-gray-300 text-lg mb-8">
          DoubleT provides premium digital accounts and services across leading platforms. Our goal is to deliver reliable, high-quality assets with clear delivery and responsive support.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-xl border border-gray-200 dark:border-[#27353a] p-6 bg-gray-50 dark:bg-[#161b1d]">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Quality First</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Curated listings with clear descriptions and platform-specific guidance.
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 dark:border-[#27353a] p-6 bg-gray-50 dark:bg-[#161b1d]">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Instant Delivery</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Automated release after payment, with credentials available in your dashboard.
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 dark:border-[#27353a] p-6 bg-gray-50 dark:bg-[#161b1d]">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Secure & Transparent</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Clear policies and sanitization practices to keep delivery data safe.
            </p>
          </div>
        </div>
        <div className="mt-10 rounded-xl border border-gray-200 dark:border-[#27353a] p-6 bg-gray-50 dark:bg-[#161b1d]">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Our Policy</h2>
          <p className="text-gray-700 dark:text-gray-300">
            Accounts are provided for legitimate business/private use only. We do not endorse activities that violate platform terms. Please review our Terms and Privacy pages for details.
          </p>
          <div className="mt-4">
            <a href="/contact" className="inline-flex items-center px-4 py-2 rounded-lg bg-[#00bfff] text-black font-semibold hover:bg-[#00bfff]/90">
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
