'use client';

import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    katex?: {
      render: (latex: string, element: HTMLElement, options?: { throwOnError?: boolean; displayMode?: boolean }) => void;
    };
  }
}

interface MathRendererProps {
  children: string;
  display?: boolean;
}

export function MathRenderer({ children, display = false }: MathRendererProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !ref.current) return;

    const renderMath = () => {
      if (!ref.current) return;
      
      // If KaTeX is already loaded, render directly
      if (window.katex) {
        try {
          window.katex.render(children, ref.current, {
            throwOnError: false,
            displayMode: display,
          });
        } catch (error) {
          // If rendering fails, show the original text
          if (ref.current) {
            ref.current.textContent = children;
          }
        }
        return;
      }

      // Load KaTeX from CDN
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js';
      script.async = true;
      
      script.onload = () => {
        // Load CSS
        if (!document.querySelector('link[href*="katex"]')) {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css';
          document.head.appendChild(link);
        }
        
        // Render math after a short delay to ensure CSS is loaded
        setTimeout(() => {
          if (ref.current && window.katex) {
            try {
              window.katex.render(children, ref.current, {
                throwOnError: false,
                displayMode: display,
              });
            } catch (error) {
              if (ref.current) {
                ref.current.textContent = children;
              }
            }
          }
        }, 100);
      };
      
      script.onerror = () => {
        // If script fails to load, show the original text
        if (ref.current) {
          ref.current.textContent = children;
        }
      };
      
      document.head.appendChild(script);
    };

    renderMath();
  }, [children, display]);

  return <div ref={ref} className={display ? 'my-4 overflow-x-auto' : 'inline'} />;
}

