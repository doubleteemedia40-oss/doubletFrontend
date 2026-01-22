import { useEffect } from 'react';

type Props = {
  title: string;
  description?: string;
  canonicalPath?: string;
  imageUrl?: string;
  jsonLd?: Record<string, unknown>;
  type?: 'website' | 'article' | 'product';
};

const ensureTag = (selector: string, create: () => HTMLElement) => {
  let el = document.head.querySelector(selector) as HTMLElement | null;
  if (!el) {
    el = create();
    document.head.appendChild(el);
  }
  return el;
};

const SEO: React.FC<Props> = ({ title, description, canonicalPath, imageUrl, jsonLd, type = 'website' }) => {
  useEffect(() => {
    document.title = title;

    if (description) {
      const metaDesc = ensureTag('meta[name="description"]', () => {
        const m = document.createElement('meta');
        m.setAttribute('name', 'description');
        return m;
      });
      metaDesc.setAttribute('content', description);
    }

    const origin = window.location.origin;
    const url = canonicalPath ? `${origin}${canonicalPath}` : origin;

    const linkCanonical = ensureTag('link[rel="canonical"]', () => {
      const l = document.createElement('link');
      l.setAttribute('rel', 'canonical');
      return l;
    });
    linkCanonical.setAttribute('href', url);

    const ogTitle = ensureTag('meta[property="og:title"]', () => {
      const m = document.createElement('meta');
      m.setAttribute('property', 'og:title');
      return m;
    });
    ogTitle.setAttribute('content', title);

    const ogDesc = ensureTag('meta[property="og:description"]', () => {
      const m = document.createElement('meta');
      m.setAttribute('property', 'og:description');
      return m;
    });
    ogDesc.setAttribute('content', description || '');

    const ogType = ensureTag('meta[property="og:type"]', () => {
      const m = document.createElement('meta');
      m.setAttribute('property', 'og:type');
      return m;
    });
    ogType.setAttribute('content', type);

    const ogUrl = ensureTag('meta[property="og:url"]', () => {
      const m = document.createElement('meta');
      m.setAttribute('property', 'og:url');
      return m;
    });
    ogUrl.setAttribute('content', url);

    const ogImage = ensureTag('meta[property="og:image"]', () => {
      const m = document.createElement('meta');
      m.setAttribute('property', 'og:image');
      return m;
    });
    ogImage.setAttribute('content', imageUrl || `${origin}/vite.svg`);

    const twCard = ensureTag('meta[name="twitter:card"]', () => {
      const m = document.createElement('meta');
      m.setAttribute('name', 'twitter:card');
      return m;
    });
    twCard.setAttribute('content', 'summary_large_image');

    const twTitle = ensureTag('meta[name="twitter:title"]', () => {
      const m = document.createElement('meta');
      m.setAttribute('name', 'twitter:title');
      return m;
    });
    twTitle.setAttribute('content', title);

    const twDesc = ensureTag('meta[name="twitter:description"]', () => {
      const m = document.createElement('meta');
      m.setAttribute('name', 'twitter:description');
      return m;
    });
    twDesc.setAttribute('content', description || '');

    const twImage = ensureTag('meta[name="twitter:image"]', () => {
      const m = document.createElement('meta');
      m.setAttribute('name', 'twitter:image');
      return m;
    });
    twImage.setAttribute('content', imageUrl || `${origin}/vite.svg`);

    let jsonLdEl = document.head.querySelector('script[data-seo-jsonld="true"]') as HTMLScriptElement | null;
    if (jsonLd) {
      if (!jsonLdEl) {
        jsonLdEl = document.createElement('script');
        jsonLdEl.type = 'application/ld+json';
        jsonLdEl.setAttribute('data-seo-jsonld', 'true');
        document.head.appendChild(jsonLdEl);
      }
      jsonLdEl.text = JSON.stringify(jsonLd);
    } else if (jsonLdEl) {
      jsonLdEl.remove();
    }
  }, [title, description, canonicalPath, imageUrl, jsonLd, type]);

  return null;
};

export default SEO;
