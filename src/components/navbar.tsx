import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import {
  Navbar as HeroUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
} from "@heroui/navbar";
import clsx from "clsx";
import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import {
  TwitterIcon,
  GithubIcon,
  DiscordIcon,
} from "@/components/icons";
// Remove Logo import and import unheard.svg directly
import UnheardLogo from "@/components/unheard.svg";

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeItem, setActiveItem] = useState("/");
  const [isMenuOpen, setIsMenuOpen] = useState(false);


  // Update active item based on current path
  useEffect(() => {
    setActiveItem(window.location.pathname);
  }, []);

  // Handle scroll events for navbar appearance with throttling
  useEffect(() => {
    let scrollTimeout: number | null = null;
    
    const handleScroll = () => {
      if (scrollTimeout === null) {
        scrollTimeout = window.setTimeout(() => {
          scrollTimeout = null;
          setIsScrolled(window.scrollY > 10);
        }, 100); // Throttle to once every 100ms
      }
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeout) window.clearTimeout(scrollTimeout);
    };
  }, []);

  // Mobile menu animation variants
  const menuVariants = {
    closed: {
      opacity: 0,
      y: -20,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    },
    open: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.07,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    closed: { opacity: 0, y: -10 },
    open: { opacity: 1, y: 0 }
  };

  // Prevent body scrolling when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  // Close mobile menu on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, [isMenuOpen]);

  // Memoize navigation items to prevent re-renders
  const navItems = useMemo(() => siteConfig.navItems.map((item) => {
    const isActive = activeItem === item.href;
    return (
      <NavbarItem key={item.href}>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
          <Button
            as={Link}
            color={isActive ? "primary" : "default"}
            href={item.href}
            variant={isActive ? "flat" : "light"}
            radius="full"
            size="sm"
            className={clsx(
              "text-sm font-medium transition-all touch-target",
              isActive 
                ? "font-semibold bg-primary/80 backdrop-blur-md text-white" 
                : "text-default-600 hover:bg-white/10 dark:hover:bg-black/20",
            )}
            onPress={() => setActiveItem(item.href)}
          >
            {item.label}
          </Button>
        </motion.div>
      </NavbarItem>
    );
  }), [activeItem]);

  return (
    <HeroUINavbar
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      shouldHideOnScroll={false}
      isBordered={false}
      className={clsx(
        "transition-all duration-300 fixed z-50",
        isScrolled 
          ? "glass backdrop-blur-md border-b border-white/10 mobile-no-blur" 
          : "bg-transparent py-3"
      )}
      maxWidth="xl"
    >


      {/* Logo & Brand */}
      <NavbarContent className="sm:basis-[20%] md:basis-1/5" justify="start">
        <NavbarBrand as="li" className="gap-2 max-w-fit">
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Link color="foreground" href="/">
              <div className="flex items-center">
                <img src={UnheardLogo} alt="Unheard Logo" className="h-10 w-auto" />
                <p className="font-bold text-inherit hidden sm:block">UnHeard</p>
              </div>
            </Link>
          </motion.div>
        </NavbarBrand>
      </NavbarContent>

      {/* Desktop Navigation */}
      <NavbarContent className="hidden md:flex basis-[70%] md:basis-3/5" justify="center">
        <div className="flex gap-0 sm:gap-1 md:gap-2 px-3 py-1.5 rounded-full glass bg-background/20 mobile-no-blur">
          {navItems}
        </div>
      </NavbarContent>

      {/* Search, Theme & Action Buttons */}
      <NavbarContent className="sm:basis-[20%] md:basis-1/5" justify="end">
       

        {/* Theme switcher */}
        <NavbarItem className="hidden sm:flex">
          <ThemeSwitch />
        </NavbarItem>

 

        {/* Mobile Menu Toggle */}
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="md:hidden touch-target"
        />
      </NavbarContent>

      {/* Mobile Menu */}
      <NavbarMenu className={clsx(
        "pt-6 px-4 pb-8 mt-2 glass backdrop-blur-xl overflow-y-auto border-b border-t border-white/10 dark:border-zinc-800/30 mobile-no-blur",
        isScrolled ? "bg-background/50" : "bg-background/30"
      )}>
        <motion.div
          className="flex flex-col gap-6"
          variants={menuVariants}
          initial="closed"
          animate={isMenuOpen ? "open" : "closed"}
        >
       
          

          {/* Mobile Navigation */}
          <div className="flex flex-col gap-2 mt-2">
            {siteConfig.navMenuItems.map((item, index) => (
              <motion.div key={`${item.href}-${index}`} variants={itemVariants}>
                <NavbarMenuItem>
                  <Link
                    className={clsx(
                      "w-full text-lg flex items-center py-2 px-4 rounded-lg transition-all touch-target",
                      activeItem === item.href
                        ? "font-medium text-primary bg-primary/10"
                        : "text-default-700 hover:bg-white/10 dark:hover:bg-black/10"
                    )}
                    href={item.href}
                    size="lg"
                    onClick={() => {
                      setActiveItem(item.href);
                      setIsMenuOpen(false);
                    }}
                  >
                    {item.label}
                  </Link>
                </NavbarMenuItem>
              </motion.div>
            ))}
          </div>

          {/* Mobile Social & Theme */}
          <motion.div variants={itemVariants} className="flex items-center gap-4 mt-4 px-2">
            <Link isExternal href={siteConfig.links.twitter} title="Twitter" className="hover:scale-110 transition-transform">
              <TwitterIcon className="text-default-500 hover:text-blue-500 h-5 w-5" />
            </Link>
            <Link isExternal href={siteConfig.links.support} title="Support" className="hover:scale-110 transition-transform">
              <DiscordIcon className="text-default-500 hover:text-indigo-500 h-5 w-5" />
            </Link>
            <Link isExternal href={siteConfig.links.github} title="GitHub" className="hover:scale-110 transition-transform">
              <GithubIcon className="text-default-500 hover:text-zinc-800 dark:hover:text-zinc-200 h-5 w-5" />
            </Link>
            <ThemeSwitch />
          </motion.div>


         
        </motion.div>
      </NavbarMenu>
    </HeroUINavbar>
  );
};
