import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="border-t border-border-color bg-background-dark py-12 text-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center">
            <span className="text-lg font-black tracking-tight text-white">DoubleT</span>
          </div>

          <div className="flex flex-wrap justify-center gap-8 text-text-muted">
            <Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
            <Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link to="/refund" className="hover:text-primary transition-colors">Refund Policy</Link>
            <Link to="/contact" className="hover:text-primary transition-colors">Contact Us</Link>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 text-center text-xs text-text-muted">
          © 2024 DoubleT Media. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
