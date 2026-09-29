import Script from "next/script";

/**
 * Ad integration points. Everything here is a no-op until
 * NEXT_PUBLIC_ADSENSE_CLIENT (e.g. "ca-pub-1234567890") is set, so the
 * site renders identically with or without ads configured.
 */
const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

/** Site-wide loader script. Rendered once from the root layout. */
export function AdScripts() {
  if (!ADSENSE_CLIENT) return null;
  return (
    <Script
      id="adsense"
      async
      strategy="afterInteractive"
      crossOrigin="anonymous"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
    />
  );
}

/**
 * Placeholder for an individual ad unit. Positioned in the layout/post
 * templates already; when you have AdSense unit IDs, render an
 * <ins className="adsbygoogle" ...> here (from a small client component
 * that pushes to window.adsbygoogle on mount).
 */
export function AdSlot({ name }: { name: string }) {
  if (!ADSENSE_CLIENT) return null;
  return <div className="ad-slot" data-ad-slot-name={name} />;
}
