import { useState, useEffect } from "react";
import { Link } from "@heroui/link";
import { motion } from "framer-motion";
import { Navbar } from "@/components/navbar";
import { siteConfig } from "@/config/site";
import { Helmet } from "react-helmet";

export default function DefaultLayout({
  children,
  title,
  description,
  image,
  keywords,
  type = "website",
}: {
  children: React.ReactNode;
  title?: string;
  description?: string;
  image?: string;
  keywords?: string;
  type?: string;
}) {
  const [scrollY, setScrollY] = useState(0);
  
  // Meta tags defaults
  const pageTitle = title ? `${title} | ${siteConfig.name}` : `${siteConfig.name} - Where Average Voices Echo Loudest`;
  const pageDescription = description || "Unheard is a safe space for sharing anonymous confessions, stories, and thoughts. Express yourself freely without judgment.";
  const pageImage = image || "/unheard-social-preview.jpg";
  const pageKeywords = keywords || "confessions, anonymous, mental health, stories, community, support, self-expression";

  // Parallax effect based on scroll - throttled for better performance
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Determine if we're on a mobile device for performance optimizations
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Check initially
    checkMobile();
    
    // Throttled resize listener
    let resizeTimeout: number | null = null;
    const handleResize = () => {
      if (resizeTimeout === null) {
        resizeTimeout = window.setTimeout(() => {
          resizeTimeout = null;
          checkMobile();
        }, 200); // Throttle to once every 200ms
      }
    };
    
    window.addEventListener('resize', handleResize, { passive: true });
    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeTimeout) window.clearTimeout(resizeTimeout);
    };
  }, []);

  // JSON-LD structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": type === "article" ? "Article" : "WebSite",
    "name": pageTitle,
    "description": pageDescription,
    "url": typeof window !== 'undefined' ? window.location.href : "https://unheardd.netlify.app",
    "image": pageImage,
    "author": {
      "@type": "Organization",
      "name": "Unheard App"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Unheard App",
      "logo": {
        "@type": "ImageObject",
        "url": "https://unheardd.netlify.app/unheard.svg"
      }
    }
  };

  return (
    <div className="relative flex flex-col min-h-screen">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={pageKeywords} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={pageImage} />
        <meta property="og:type" content={type} />
        <meta property="og:url" content={typeof window !== 'undefined' ? window.location.href : "https://unheardd.netlify.app"} />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content={pageTitle} />
        <meta property="twitter:description" content={pageDescription} />
        <meta property="twitter:image" content={pageImage} />
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : "https://unheardd.netlify.app"} />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      {/* Animated background gradient - conditionally rendered for mobile */}
      <div className="fixed inset-0 z-[-2]">
        <div className="absolute inset-0 bg-gradient-to-b from-violet-800/20 via-indigo-700/10 to-background/5 animate-gradient"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,90,240,0.3),transparent_40%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(90,110,240,0.3),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_80%,rgba(210,90,240,0.2),transparent_40%)]"></div>
      </div>
      
      {/* Animated floating elements - only show on desktop for performance */}
      {!isMobile && (
        <div className="fixed inset-0 z-[-1] overflow-hidden">
          {/* Floating shapes with parallax effect */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ duration: 1.5 }}
            className="absolute top-[5%] left-[10%] w-64 h-64 rounded-full bg-gradient-to-br from-purple-600/20 to-blue-500/20 blur-3xl animate-pulse-slow"
            style={{ transform: `translate3d(0, ${scrollY * 0.1}px, 0)` }}
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ duration: 1.5, delay: 0.2 }}
            className="absolute top-[20%] right-[10%] w-72 h-72 rounded-full bg-gradient-to-bl from-blue-500/20 to-pink-500/20 blur-3xl animate-pulse-slow"
            style={{ transform: `translate3d(0, ${scrollY * 0.15}px, 0)` }}
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ duration: 1.5, delay: 0.4 }}
            className="absolute bottom-[10%] left-[15%] w-80 h-80 rounded-full bg-gradient-to-tr from-indigo-600/20 to-violet-500/20 blur-3xl animate-pulse-slow"
            style={{ transform: `translate3d(0, ${scrollY * -0.08}px, 0)` }}
          />
        </div>
      )}
      
      {/* Subtle noise texture overlay - conditionally loaded */}
      <div 
        className="fixed inset-0 z-[-1] mix-blend-soft-light opacity-30"
        style={{ 
          backgroundImage: !isMobile ? "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iLjA1IiBkPSJNMCAwaDMwMHYzMDBIMHoiLz48L3N2Zz4=')" : "none"
        }}
      />
      
      <Navbar />
      <main className="container relative mx-auto max-w-7xl px-6 flex-grow pt-16 z-10">
        {children}
      </main>
      <footer className="relative w-full z-10">
        <div className="glass backdrop-blur-md bg-background/30 border-t border-zinc-200/30 dark:border-zinc-800/30 mobile-no-blur">
          <div className="container mx-auto max-w-7xl px-6 py-8">
            <div className="text-center">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                &copy; {new Date().getFullYear()} Unheard | A safe space for anonymous confessions
              </p>
              <div className="flex items-center justify-center gap-4 mt-2">
                <Link
                  isExternal
                  className="text-sm text-zinc-500 hover:text-violet-500 transition-colors"
                  href="/about"
                >
                  About
                </Link>
                <Link
                  isExternal
                  className="text-sm text-zinc-500 hover:text-violet-500 transition-colors"
                  href="/support"
                >
                  Support
                </Link>
                
                <Link
                  isExternal
                  className="text-sm text-zinc-500 hover:text-violet-500 transition-colors"
                  href="/guidelines"
                >
                  Guidelines
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
