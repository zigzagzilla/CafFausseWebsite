import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Menu", path: "/menu" },
    { name: "Reservations", path: "/reservations" },
    { name: "About Us", path: "/about" },
    { name: "Gallery", path: "/gallery" },
  ];

  return (
    <header className={cn(
      "bg-[#F5F2EA] sticky top-0 z-50 transition-shadow duration-300",
      isScrolled ? "shadow-md" : ""
    )}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <div className="text-[#8A2633] font-serif">
              <h1 className="text-3xl font-bold">Café Fausse</h1>
              <p className="text-xs tracking-widest text-[#B49A5B] mt-1">FINE DINING EXPERIENCE</p>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <Link 
                key={item.path} 
                href={item.path}
                className={cn(
                  "relative text-[#333333] hover:text-[#8A2633] transition duration-300 after:content-[''] after:absolute after:w-0 after:h-[1px] after:bottom-[-2px] after:left-0 after:bg-[#B49A5B] after:transition-[width] after:duration-300 after:ease hover:after:w-full",
                  location === item.path ? "text-[#8A2633] after:w-full" : ""
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>
          
          {/* Mobile Navigation Toggle */}
          <div className="md:hidden">
            <button 
              onClick={toggleMobileMenu} 
              className="text-[#8A2633] focus:outline-none"
              aria-label="Toggle mobile menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation Menu */}
        <div className={cn(
          "md:hidden bg-[#F5F2EA] py-4 mt-2 transition-all duration-300",
          isMobileMenuOpen ? "block" : "hidden"
        )}>
          <nav className="flex flex-col space-y-4">
            {navItems.map((item) => (
              <Link 
                key={item.path} 
                href={item.path}
                onClick={closeMobileMenu}
                className={cn(
                  "text-[#333333] hover:text-[#8A2633] px-4 py-2 transition duration-300",
                  location === item.path ? "text-[#8A2633]" : ""
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
