'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface DocsLayoutProps {
  children: React.ReactNode;
  title: string;
  headings: Heading[];
  showNavLinks?: boolean;
}

export function DocsLayout({ children, title, headings, showNavLinks = true }: DocsLayoutProps) {
  const [activeHeading, setActiveHeading] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 120; // Account for navbar + padding
      const headingElements = headings.map(h => ({
        id: h.id,
        element: document.getElementById(h.id),
      })).filter(h => h.element !== null) as Array<{ id: string; element: HTMLElement }>;

      // Find the current active heading
      let currentActive: string | null = null;
      for (let i = headingElements.length - 1; i >= 0; i--) {
        const heading = headingElements[i];
        if (heading.element && heading.element.offsetTop <= scrollPosition) {
          currentActive = heading.id;
          break;
        }
      }
      
      if (currentActive) {
        setActiveHeading(currentActive);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, [headings]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // Account for navbar
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden lg:block fixed left-0 top-14 bottom-0 w-[300px] border-r border-gray-300 bg-gray-100 overflow-y-auto">
          <nav className="p-6">
            {showNavLinks && (
              <div className="mb-6 pb-6 border-b border-gray-300">
                <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">
                  Information
                </h2>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="/information/methods"
                      className="block px-3 py-2 text-sm text-gray-700 hover:text-primary hover:bg-gray-300 rounded-md transition-colors"
                    >
                      Methods
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/faq"
                      className="block px-3 py-2 text-sm text-gray-700 hover:text-primary hover:bg-gray-300 rounded-md transition-colors"
                    >
                      FAQ
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/data"
                      className="block px-3 py-2 text-sm text-gray-700 hover:text-primary hover:bg-gray-300 rounded-md transition-colors"
                    >
                      Data
                    </Link>
                  </li>
                </ul>
              </div>
            )}
            {headings.length > 0 && (
              <>
                <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">
                  {title}
                </h2>
                <ul className="space-y-2">
                  {headings.map((heading) => (
                    <li key={heading.id}>
                      <button
                        onClick={() => scrollToHeading(heading.id)}
                        className={cn(
                          'text-left w-full px-3 py-2 text-sm rounded-md transition-colors',
                          activeHeading === heading.id
                            ? 'bg-primary/10 text-primary font-medium'
                            : 'text-gray-700 hover:text-primary hover:bg-gray-300'
                        )}
                        style={{ paddingLeft: `${(heading.level - 1) * 12 + 12}px` }}
                      >
                        {heading.text}
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-[300px] bg-white">
          <div ref={contentRef} className="max-w-4xl mx-auto px-8 py-16">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

