'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from './navbar';
import { useNavbar } from './navbar-context';

export function NavbarWrapper() {
  const { indicatorLabel } = useNavbar();
  const pathname = usePathname();
  const isMapPage = pathname === '/map';
  const isHomePage = pathname === '/';
  const isDataPage = pathname === '/data';
  const isFAQPage = pathname === '/faq';
  const isMethodsPage = pathname?.startsWith('/information/methods');
  const showStandardNavbar = isHomePage || isDataPage || isFAQPage || isMethodsPage;

  const scrollTo = (id: string) => {
    if (isHomePage) {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Navigate to homepage and scroll to section
      window.location.href = `/#${id}`;
    }
  };

  const standardNavLinks = showStandardNavbar ? [
    { label: 'Home', onClick: () => isHomePage ? scrollTo('home') : window.location.href = '/' },
    { label: 'Motivation', onClick: () => scrollTo('motivation') },
    { label: 'About', onClick: () => scrollTo('about') },
    { label: 'Contact', onClick: () => scrollTo('contact') },
    { label: 'Reference Citing', onClick: () => scrollTo('citation') },
    { label: 'Acknowledgements', onClick: () => scrollTo('acknowledgement') },
  ] : undefined;

  return (
    <Navbar 
      title="Climate-Fisheries" 
      indicatorLabel={isMapPage ? (indicatorLabel || undefined) : undefined}
      navLinks={standardNavLinks}
      showMapButton={showStandardNavbar}
    />
  );
}

