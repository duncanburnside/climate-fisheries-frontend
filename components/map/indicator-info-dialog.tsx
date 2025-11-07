'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { ClimateIndicator } from '@/lib/models/ClimateTypes';

interface IndicatorInfoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  indicator: ClimateIndicator | null;
}

export default function IndicatorInfoDialog({
  open,
  onOpenChange,
  indicator,
}: IndicatorInfoDialogProps) {
  if (!indicator) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-primary border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-white">{indicator.label}</DialogTitle>
          <DialogDescription className="text-gray-300">
            {indicator.explanation}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}


