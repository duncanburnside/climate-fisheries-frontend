'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

interface NavLink {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface NavbarProps {
  title: string;
  indicatorLabel?: string;
  navLinks?: NavLink[];
  showMapButton?: boolean;
  className?: string;
}

export function Navbar({ title, indicatorLabel, navLinks, showMapButton, className }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mobileMenuOpen]);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className={cn('sticky top-0 z-50 w-full bg-primary', className)}>
      {/* Desktop layout for xl+ (1280px+) - single row */}
      <div className="hidden xl:flex h-14 items-center justify-between px-4">
        <Link
          href="/"
          className="flex items-center gap-3 text-2xl font-black text-white hover:text-color4 transition-colors"
        >
          <Image
            src="/assets/images/coru-1024-white.webp"
            alt="CORU Logo"
            width={40}
            height={40}
            className="h-8 w-auto"
          />
          {title}
        </Link>
        <div className="flex items-center gap-6">
          {/* Desktop Navigation for xl+ */}
          {navLinks && navLinks.length > 0 && (
            <nav className="flex items-center space-x-6">
              {navLinks.map((link, index) => {
                if (link.href) {
                  return (
                    <Link
                      key={index}
                      href={link.href}
                      className="nav-primary-link text-white hover:text-color4 transition-colors"
                    >
                      {link.label}
                    </Link>
                  );
                } else if (link.onClick) {
                  return (
                    <button
                      key={index}
                      onClick={link.onClick}
                      className="nav-primary-link text-white hover:text-color4 transition-colors"
                    >
                      {link.label}
                    </button>
                  );
                }
                return null;
              })}
            </nav>
          )}
          {showMapButton && (
            <DropdownMenu>
              <DropdownMenuTrigger className="nav-primary-link text-white hover:text-color4 transition-colors outline-none items-center gap-1 flex">
                Information
                <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white">
                <DropdownMenuItem asChild>
                  <Link href="/information/methods" className="cursor-pointer">
                    Methods
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/faq" className="cursor-pointer">
                    FAQ
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/data" className="cursor-pointer">
                    Data
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          {showMapButton && (
            <Link
              href="/map"
              className="bg-color4 text-primary px-4 py-2 rounded-md font-semibold hover:bg-color4/90 transition-colors"
            >
              Map
            </Link>
          )}
          {indicatorLabel && (
            <span className="text-white text-lg">{indicatorLabel}</span>
          )}
        </div>
      </div>

      {/* Tablet/Mobile layout for below xl (below 1280px) */}
      <div className="flex xl:hidden flex-col md:flex-col md:h-auto px-4">
        {/* Top row: Logo and Map button */}
        <div className="flex h-14 items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-3 text-xl md:text-2xl font-black text-white hover:text-color4 transition-colors"
          >
            <Image
              src="/assets/images/coru-1024-white.webp"
              alt="CORU Logo"
              width={40}
              height={40}
              className="h-8 w-auto"
            />
            {title}
          </Link>
          <div className="flex items-center gap-6">
            {showMapButton && (
              <Link
                href="/map"
                className="bg-color4 text-primary px-4 py-2 rounded-md font-semibold hover:bg-color4/90 transition-colors"
              >
                Map
              </Link>
            )}
            {indicatorLabel && (
              <span className="text-white text-lg">{indicatorLabel}</span>
            )}
            {/* Mobile Menu Button - only below md */}
            {showMapButton && navLinks && navLinks.length > 0 && (
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <button className="md:hidden text-white hover:text-color4 transition-colors p-2">
                    <Menu className="h-6 w-6" />
                  </button>
                </SheetTrigger>
              <SheetContent 
                side="right" 
                className="bg-primary w-[300px] sm:w-[400px] border-l-1 border-blue-900/50" 
                closeButtonClassName="text-gray-200 hover:text-color4"
              >
                <SheetHeader>
                  <SheetTitle className="text-left text-white">Menu</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col space-y-4 mt-8">
                  {navLinks.map((link, index) => {
                    if (link.href) {
                      return (
                        <Link
                          key={index}
                          href={link.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className="text-gray-200 hover:text-color4 transition-colors text-lg text-left"
                        >
                          {link.label}
                        </Link>
                      );
                    } else if (link.onClick) {
                      return (
                        <button
                          key={index}
                          onClick={() => {
                            link.onClick?.();
                            setMobileMenuOpen(false);
                          }}
                          className="text-left text-gray-200 hover:text-color4 transition-colors text-lg"
                        >
                          {link.label}
                        </button>
                      );
                    }
                    return null;
                  })}
                  <div className="pt-4 border-t border-gray-600">
                   
                    <div className="flex flex-col space-y-2">
                      <Link
                        href="/information/methods"
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-gray-200 hover:text-color4 transition-colors text-lg text-left"
                      >
                        Methods
                      </Link>
                      <Link
                        href="/faq"
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-gray-200 hover:text-color4 transition-colors text-lg text-left"
                      >
                        FAQ
                      </Link>
                      <Link
                        href="/data"
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-gray-200 hover:text-color4 transition-colors text-lg text-left"
                      >
                        Data
                      </Link>
                    </div>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          )}
          </div>
        </div>
        
        {/* Navigation links below logo/map for md-xl (768px to 1279px) */}
        {navLinks && navLinks.length > 0 && (
          <nav className="hidden md:flex items-center justify-end space-x-6 py-2 border-t border-gray-600">
            {navLinks.map((link, index) => {
              if (link.href) {
                return (
                  <Link
                    key={index}
                    href={link.href}
                    className="nav-primary-link text-white hover:text-color4 transition-colors"
                  >
                    {link.label}
                  </Link>
                );
              } else if (link.onClick) {
                return (
                  <button
                    key={index}
                    onClick={link.onClick}
                    className="nav-primary-link text-white hover:text-color4 transition-colors"
                  >
                    {link.label}
                  </button>
                );
              }
              return null;
            })}
            {showMapButton && (
              <DropdownMenu>
                <DropdownMenuTrigger className="nav-primary-link text-white hover:text-color4 transition-colors outline-none items-center gap-1 flex">
                  Information
                  <ChevronDown className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white">
                  <DropdownMenuItem asChild>
                    <Link href="/information/methods" className="cursor-pointer">
                      Methods
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/faq" className="cursor-pointer">
                      FAQ
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/data" className="cursor-pointer">
                      Data
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}

