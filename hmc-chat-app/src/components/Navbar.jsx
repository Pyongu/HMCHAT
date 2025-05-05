import React, { useState, useEffect, useMemo } from "react";
import { googleLogout } from "@react-oauth/google";
import { useNavigate, Routes, Route } from "react-router-dom";
import Logout from "./popup/logout.tsx";
import App from "../App.js"; // Make sure the path is correct

const NavbarItem = ({ text, isActive, onClick, isMobile = false }) => (
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

const Navbar = () => {
  const [activeSection, setActiveSection] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = useMemo(() => ["About", "Chat", "Log Out"], []);

  const sectionMapping = useMemo(() => ({
    'About': 'about',
    'Chat': 'chat',
  }), []);

  const scrollToSection = (sectionId) => {
    if (sectionId === "Log Out") {
      googleLogout();
      localStorage.removeItem("user");
      navigate("/"); // Will render <Logout /> from below
      return;
    }

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
      const sections = navItems
        .filter(item => item !== "Log Out")
        .map(item => ({
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
      {/* Navbar UI */}
      <div className="hidden md:block fixed top-0 p-2 w-full z-40">
        <nav className="bg-black border-2 w-4/5 mx-auto rounded-full shadow-2xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex-shrink-0 text-gold-500">
                <h1 className="text-2xl font-bold">HMC</h1>
              </div>
              <div className="ml-10 flex space-x-8 text-white">
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

      <div
        className={`md:hidden fixed top-0 left-0 right-0 z-40 ${
          isMobileMenuOpen ? "bg-black/90" : "bg-transparent"
        }`}
      >
        <nav>
          <div className="px-4 py-3">
            <div className="flex items-center justify-between">
              <h1 className="text-gold-500 text-xl font-bold">HMC</h1>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-white"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMobileMenuOpen ? (
                    <path d="M6 18L18 6M6 6l12 12" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  ) : (
                    <path d="M4 6h16M4 12h16M4 18h16" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  )}
                </svg>
              </button>
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

      {/* 👇 Route Definitions Inside Navbar */}
      <Routes>
        <Route path="/" element={<Logout />} />
        <Route path="/App.js" element={<App />} />
      </Routes>
    </>
  );
};

export default Navbar;
