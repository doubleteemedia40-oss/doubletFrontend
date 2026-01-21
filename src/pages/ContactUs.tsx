const ContactUs = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-6">Contact Us</h1>
        <div className="space-y-6 text-gray-700 dark:text-gray-300">
          <p>For support or inquiries, email our team directly:</p>
          <p>
            <a href="mailto:doubleteemedia40@gmail.com" className="text-[#00bfff] hover:text-[#009acd] font-medium">
              doubleteemedia40@gmail.com
            </a>
          </p>
          <p>We aim to respond within 24 hours.</p>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
