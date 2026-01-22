import SEO from '../components/SEO';

const RefundPolicy = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <SEO title="Refund Policy — DoubleT" canonicalPath="/refund" type="article" />
        <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-6">Refund Policy</h1>
        <div className="space-y-6 text-gray-700 dark:text-gray-300">
          <p>All sales are final once credentials are delivered. Refunds are not provided for change of mind.</p>
          <p>If an account is invalid on delivery, contact support within 24 hours for a replacement.</p>
          <p>We may refuse refunds for misuse, policy violations, or failure to follow provided instructions.</p>
          <p>For any issues, reach out to support and we’ll work with you to resolve promptly.</p>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;
