import React, { useState, useEffect, useMemo } from "react";

const NavbarItem = ({ text, isActive, onClick, isMobile = false }) => {
  return (
    <button
      onClick={() => onClick(text)}
      className={`transition-all duration-300 ${
        isMobile
          ? "w-full text-left py-3 px-4 border-b border-gold-700"
          : "px-3 py-2 rounded-3xl text-lg font-medium"
      } ${
        isActive
          ? isMobile
            ? "bg-gold-700 text-black"
            : "bg-gold-800 text-black"
          : isMobile
          ? "text-white hover:bg-gold-700"
          : "text-gold-600 hover:bg-black/20"
      }`}
    >
      {text}
    </button>
  );
};

const Navbar = () => {
  const [activeSection, setActiveSection] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = useMemo(() => ["About", "Chat", "Log In"], []);

  const sectionMapping = useMemo(() => ({
    'About': 'about',
    'Chat': 'Chat',
    'Log In': 'login',
  }), []);

  const scrollToSection = (sectionId) => {
    const elementId = sectionMapping[sectionId];
    const element = document.getElementById(elementId);
    if (element) {
      const navbarHeight = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - navbarHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }

    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map(item => ({
        id: item,
        elementId: sectionMapping[item],
        element: document.getElementById(sectionMapping[item])
      }));

      const currentSection = sections.find(section => {
        if (section.element) {
          const rect = section.element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });

      if (currentSection) {
        setActiveSection(currentSection.id);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [navItems, sectionMapping]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileMenuOpen]);

  return (
    <>
      {/* Desktop Navbar - hidden on mobile, visible on md and up */}
      <div className="hidden md:block fixed top-0 p-2 w-full z-40">
        <nav className="bg-black border-2 w-4/5 mx-auto rounded-full shadow-2xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex-shrink-0 flex justify-center text-gold-500">
                {/* Logo or title can go here */}
                <h1 className="text-2xl font-bold">HMC</h1>
              </div>
              <div className="ml-auto flex items-center lg:items-baseline space-x-8 text-white">
                {navItems.map((item) => (
                  <NavbarItem
                    key={item}
                    text={item}
                    isActive={activeSection === item}
                    onClick={scrollToSection}
                  />
                ))}
              </div>
            </div>
          </div>
        </nav>
      </div>
      {/* Mobile Navbar - visible on mobile, hidden on md and up */}
      <div
        className={`md:hidden fixed top-0 left-0 right-0 z-40 ${
          isMobileMenuOpen ? "bg-black/90" : "bg-transparent"
        }`}
      >
        <nav>
          <div className="px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex-shrink-0">
                <h1 className="text-gold-500 text-xl font-bold">HMC</h1>
              </div>
              <div>
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="p-2 rounded-md text-white focus:outline-none"
                >
                  <svg
                    className="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    {isMobileMenuOpen ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    ) : (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    )}
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div
            className={`${
              isMobileMenuOpen ? "max-h-screen opacity-80" : "max-h-0 opacity-0"
            } transition-all duration-300 ease-in-out overflow-hidden`}
          >
            <div className="flex flex-col">
              {navItems.map((item) => (
                <NavbarItem
                  key={item}
                  text={item}
                  isActive={activeSection === item}
                  onClick={scrollToSection}
                  isMobile={true}
                />
              ))}
            </div>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Navbar;
