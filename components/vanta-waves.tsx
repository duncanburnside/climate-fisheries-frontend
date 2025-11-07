'use client';

import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    THREE?: any;
    VANTA?: {
      WAVES: (options: any) => any;
    };
  }
}

interface VantaWavesProps {
  className?: string;
}

export function VantaWaves({ className = '' }: VantaWavesProps) {
  const vantaRef = useRef<HTMLDivElement>(null);
  const vantaEffect = useRef<any>(null);

  useEffect(() => {
    if (!vantaRef.current) return;

    const loadVanta = async () => {
      // Load Three.js
      if (!window.THREE) {
        const threeScript = document.createElement('script');
        threeScript.src = '/vantajs/three.min';
        threeScript.async = true;
        await new Promise((resolve, reject) => {
          threeScript.onload = resolve;
          threeScript.onerror = reject;
          document.head.appendChild(threeScript);
        });
      }

      // Load Vanta.js
      if (!window.VANTA) {
        const vantaScript = document.createElement('script');
        vantaScript.src = '/vantajs/vanta.waves.min.js';
        vantaScript.async = true;
        await new Promise((resolve, reject) => {
          vantaScript.onload = resolve;
          vantaScript.onerror = reject;
          document.head.appendChild(vantaScript);
        });
      }

      // Initialize Vanta.js
      if (window.VANTA && vantaRef.current) {
        vantaEffect.current = window.VANTA.WAVES({
          el: vantaRef.current,
          mouseControls: false,
          touchControls: false,
          gyroControls: false,
          minHeight: 200.00,
          minWidth: 200.00,
          scale: 1.00,
          scaleMobile: 1.00,
          zoom: 0.65
        });
      }
    };

    loadVanta();

    // Cleanup
    return () => {
      if (vantaEffect.current && vantaEffect.current.destroy) {
        vantaEffect.current.destroy();
      }
    };
  }, []);

  return <div ref={vantaRef} className={`absolute inset-0 ${className}`} />;
}

