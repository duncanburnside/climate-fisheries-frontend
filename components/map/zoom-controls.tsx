'use client';

import { Button } from '@/components/ui/button';

interface ZoomControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
}

export default function ZoomControls({ onZoomIn, onZoomOut, onResetZoom }: ZoomControlsProps) {
  return (
    <div className="fixed bottom-[200px] left-[324px] z-40">
      <div className="flex flex-col space-y-1">
        <Button
          onClick={onZoomIn}
          variant="outline"
          size="icon"
          className="w-10 h-10 bg-white"
          title="Zoom in"
        >
          <i className="fas fa-plus text-gray-700"></i>
        </Button>
        <Button
          onClick={onResetZoom}
          variant="outline"
          size="icon"
          className="w-10 h-10 bg-white"
          title="Reset zoom"
        >
          <i className="fas fa-dot-circle text-gray-700"></i>
        </Button>
        <Button
          onClick={onZoomOut}
          variant="outline"
          size="icon"
          className="w-10 h-10 bg-white"
          title="Zoom out"
        >
          <i className="fas fa-minus text-gray-700"></i>
        </Button>
      </div>
    </div>
  );
}

