import { useState } from 'react';

interface Props {
  className?: string;
}

const sources = [
  'https://assets.paystack.com/assets/img/logos/paystack-logo.svg',
  'https://paystack.com/assets/images/paystack-logo.svg',
  'https://www.paystack.com/assets/images/paystack-logo.svg',
];

const PaystackLogo = ({ className = 'h-6 w-auto' }: Props) => {
  const [idx, setIdx] = useState(0);
  const [failed, setFailed] = useState(false);

  if (failed || idx >= sources.length) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <svg width="28" height="28" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="3" width="10" height="4" rx="1" fill="#11C3E7" />
          <rect x="2" y="9" width="10" height="4" rx="1" fill="#11C3E7" />
          <rect x="2" y="15" width="10" height="4" rx="1" fill="#00BFFF" />
          <rect x="2" y="21" width="10" height="4" rx="1" fill="#00BFFF" />
        </svg>
        <span className="text-white font-bold tracking-wide">Paystack</span>
      </div>
    );
  }

  return (
    <img
      src={sources[idx]}
      alt="Paystack"
      className={`${className} bg-white rounded-md px-2 py-1`}
      loading="lazy"
      onError={() => {
        const next = idx + 1;
        if (next < sources.length) {
          setIdx(next);
        } else {
          setFailed(true);
        }
      }}
    />
  );
};

export default PaystackLogo;
