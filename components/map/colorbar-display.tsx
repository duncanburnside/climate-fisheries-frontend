'use client';

import type { ClimateIndicator } from '@/lib/models/ClimateTypes';

interface ColorbarDisplayProps {
  units: string;
}

export default function ColorbarDisplay({ units }: ColorbarDisplayProps) {
  return (
    <div className="fixed bottom-[70px] left-[324px] z-40 flex items-center gap-2">
      <div id="color-bar-svg" className="bg-neutral-300 pt-3" style={{ width: 'auto', height: '60px' }}></div>
      <div className="text-white text-sm flex items-center">
        <span dangerouslySetInnerHTML={{ __html: units }} />
      </div>
    </div>
  );
}

