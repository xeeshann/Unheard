import { Helmet } from "react-helmet";
import { siteConfig } from "@/config/site";

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  keywords?: string;
  type?: string;
  url?: string;
  noindex?: boolean;
  canonical?: string;
}

export function SEO({
  title,
  description,
  image,
  keywords,
  type = "website",
  url,
  noindex = false,
  canonical,
}: SEOProps) {
  // Meta tags defaults
  const pageTitle = title ? `${title} | ${siteConfig.name}` : `${siteConfig.name} - Where Average Voices Echo Loudest`;
  const pageDescription = description || "Unheard is a safe space for sharing anonymous confessions, stories, and thoughts. Express yourself freely without judgment.";
  const pageImage = image || `${siteConfig.url}/unheard-social-preview.jpg`;
  const pageKeywords = keywords || "confessions, anonymous, mental health, stories, community, support, self-expression";
  const pageUrl = url || siteConfig.url;
  const canonicalUrl = canonical || pageUrl;

  // JSON-LD structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": type === "article" ? "Article" : "WebSite",
    "name": pageTitle,
    "description": pageDescription,
    "url": pageUrl,
    ...(type === "article" && {
      "image": pageImage,
      "publisher": {
        "@type": "Organization",
        "name": siteConfig.name,
        "logo": {
          "@type": "ImageObject",
          "url": `${siteConfig.url}/unheard.svg`
        }
      },
      "datePublished": new Date().toISOString(),
      "dateModified": new Date().toISOString()
    })
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <meta name="keywords" content={pageKeywords} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:image" content={pageImage} />
      <meta property="og:site_name" content={siteConfig.name} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={pageUrl} />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={pageImage} />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
}