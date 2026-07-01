import Script from "next/script";

export default function GoogleTagManager() {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID || "G-XXXXXXXXXX";

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gtmId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gtmId}');
        `}
      </Script>
    </>
  );
}
