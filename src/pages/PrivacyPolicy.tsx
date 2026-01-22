import SEO from '../components/SEO';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <SEO title="Privacy Policy — DoubleT" canonicalPath="/privacy" type="article" />
        <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-6">Privacy Policy</h1>
        <div className="space-y-6 text-gray-700 dark:text-gray-300">
          <p>We collect minimal data to process orders and provide support: name, email, and order details.</p>
          <p>Data is stored securely and never sold. We share only as required to fulfill services or comply with law.</p>
          <p>You may request deletion of your data by contacting support. Some records may be retained for compliance.</p>
          <p>By using DoubleT, you consent to this policy. Updates will be posted and apply upon publication.</p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
