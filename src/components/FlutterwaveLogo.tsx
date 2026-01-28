import { useState } from 'react';

interface Props {
  className?: string;
}

const sources = [
  'https://flutterwave.com/images/logo/full.svg',
  'https://dashboard.flutterwave.com/images/logo.svg',
];

const FlutterwaveLogo = ({ className = 'h-6 w-auto' }: Props) => {
  const [idx, setIdx] = useState(0);
  const [failed, setFailed] = useState(false);

  if (failed || idx >= sources.length) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <svg width="28" height="28" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg">
          <circle cx="14" cy="14" r="12" fill="#F5A623" />
          <path d="M8 10 L14 14 L8 18 M14 10 L20 14 L14 18" stroke="#000000" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="text-white font-bold tracking-wide">Flutterwave</span>
      </div>
    );
  }

  return (
    <img
      src={sources[idx]}
      alt="Flutterwave"
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

export default FlutterwaveLogo;
