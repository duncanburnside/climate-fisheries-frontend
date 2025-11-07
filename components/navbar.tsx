'use client';

import { useState } from 'react';
import Link from 'next/link';
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

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className={cn('sticky top-0 z-50 w-full bg-primary', className)}>
      <div className="flex h-14 items-center justify-between px-4">
        <Link
          href="/"
          className="text-2xl font-black text-white hover:text-color4 transition-colors"
        >
          {title}
        </Link>
        <div className="flex items-center gap-6">
          {/* Desktop Navigation */}
          {navLinks && navLinks.length > 0 && (
            <nav className="hidden lg:flex lg:items-center lg:space-x-6">
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
              <DropdownMenuTrigger className="hidden lg:flex nav-primary-link text-white hover:text-color4 transition-colors outline-none items-center gap-1">
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
          {/* Mobile Menu Button */}
          {showMapButton && navLinks && navLinks.length > 0 && (
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <button className="lg:hidden text-white hover:text-color4 transition-colors p-2">
                  <Menu className="h-6 w-6" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-white w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle className="text-left text-primary">Menu</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col space-y-4 mt-8">
                  {navLinks.map((link, index) => {
                    if (link.href) {
                      return (
                        <Link
                          key={index}
                          href={link.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className="text-primary hover:text-secondary transition-colors text-lg"
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
                          className="text-left text-primary hover:text-secondary transition-colors text-lg"
                        >
                          {link.label}
                        </button>
                      );
                    }
                    return null;
                  })}
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-primary font-semibold mb-2">Information</p>
                    <div className="flex flex-col space-y-2 ml-4">
                      <Link
                        href="/information/methods"
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-primary hover:text-secondary transition-colors"
                      >
                        Methods
                      </Link>
                      <Link
                        href="/faq"
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-primary hover:text-secondary transition-colors"
                      >
                        FAQ
                      </Link>
                      <Link
                        href="/data"
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-primary hover:text-secondary transition-colors"
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
    </header>
  );
}

