import { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';

const AUTO_HIDE_MS = 12000;
const STORAGE_KEY = 'doublet_disclaimer_seen';

const DisclaimerModal = () => {
  const { user } = useStore();
  const [open] = useState(() => {
    const seen = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : '1';
    return !user && !seen;
  });

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, '1');
      const el = document.getElementById('doublet-disclaimer');
      if (el && el.parentNode) el.parentNode.removeChild(el);
    }, AUTO_HIDE_MS);
    return () => clearTimeout(t);
  }, [open]);

  // Don't render if already seen or user is logged in
  if (!open) return null;

  return (
    <div id="doublet-disclaimer" className="fixed bottom-4 left-4 z-[60] pointer-events-none">
      <div className="pointer-events-auto w-[22rem] max-w-[90vw] rounded-2xl border border-[#27353a] bg-[#0f1e23]/95 shadow-xl backdrop-blur-sm">
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-white text-sm font-bold tracking-wide">DISCLAIMER</h3>
            <button
              onClick={() => {
                localStorage.setItem(STORAGE_KEY, '1');
                const el = document.getElementById('doublet-disclaimer');
                if (el && el.parentNode) el.parentNode.removeChild(el);
              }}
              className="text-slate-300 hover:text-white transition-colors"
              aria-label="Close"
            >
              ×
            </button>
          </div>
          <p className="text-slate-300 text-xs leading-relaxed">
            All accounts are sold for the sole purpose of business/private use. We do not encourage and take responsibility for any Instagram/Twitter/Facebook account purchased from us and is subsequently used by clients for shady acts and/or activities that go against Their policies
          </p>
          <div className="mt-3 flex justify-end">
            <button
              onClick={() => {
                localStorage.setItem(STORAGE_KEY, '1');
                const el = document.getElementById('doublet-disclaimer');
                if (el && el.parentNode) el.parentNode.removeChild(el);
              }}
              className="px-3 py-1.5 rounded-lg bg-[#00bfff] text-black text-xs font-semibold hover:bg-[#00bfff]/90 transition-colors"
            >
              I Understand
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisclaimerModal;
