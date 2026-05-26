import { useEffect } from 'react';

export const siteUrl = 'https://myzemedia.com';

export function setMetaTag(selector, attr, value) {
  let tag = document.head.querySelector(selector);
  if (!tag) {
    tag = document.createElement('meta');
    const match = selector.match(/\[(name|property)="([^"]+)"\]/);
    if (match) tag.setAttribute(match[1], match[2]);
    document.head.appendChild(tag);
  }
  tag.setAttribute(attr, value);
}

export function usePageMeta(page) {
  useEffect(() => {
    document.title = page.title;
    setMetaTag('meta[name="description"]',        'content', page.description);
    setMetaTag('meta[property="og:title"]',       'content', page.ogTitle || page.title);
    setMetaTag('meta[property="og:description"]', 'content', page.description);
    setMetaTag('meta[property="og:url"]',         'content', page.url);
    setMetaTag('meta[property="og:type"]',        'content', page.type || 'website');
    setMetaTag('meta[property="og:image"]',       'content', page.image || `${siteUrl}/OG_image.png`);
    setMetaTag('meta[name="twitter:title"]',      'content', page.ogTitle || page.title);
    setMetaTag('meta[name="twitter:description"]','content', page.description);
    setMetaTag('meta[name="twitter:image"]',      'content', page.image || `${siteUrl}/OG_image.png`);

    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', page.url);
  }, [page]);
}

export function buildArticleSchema(article) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline:      article.title,
    description:   article.meta,
    image:         `${siteUrl}${article.image}`,
    datePublished: article.isoDate,
    dateModified:  article.isoDate,
    author:    { '@type': 'Organization', name: 'MYZE Media', url: siteUrl },
    publisher: {
      '@type': 'Organization',
      name: 'MYZE Media',
      logo: { '@type': 'ImageObject', url: `${siteUrl}/logo.png` },
    },
    mainEntityOfPage: `${siteUrl}/insights/${article.slug}`,
  };
}
