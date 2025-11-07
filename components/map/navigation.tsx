'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface NavigationProps {
  title: string;
  indicatorLabel: string;
}

export default function Navigation({ title, indicatorLabel }: NavigationProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-primary h-14 flex items-center">
      <div className="container mx-auto px-4 flex items-center justify-between w-full">
        <Button
          asChild
          variant="ghost"
          className="text-white text-xl font-bold hover:text-color4 transition-colors"
        >
          <Link href="/">{title}</Link>
        </Button>
        <div className="text-white text-lg cursor-default">
          {indicatorLabel}
        </div>
      </div>
    </nav>
  );
}

