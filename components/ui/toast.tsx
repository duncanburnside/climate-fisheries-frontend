import * as React from "react"
import { cn } from "@/lib/utils"

interface ToastProps {
  message: string;
  visible: boolean;
  onClose: () => void;
}

export function Toast({ message, visible, onClose }: ToastProps) {
  React.useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-in fade-in slide-in-from-bottom-5">
      <div className="bg-primary text-white px-4 py-2 rounded-md shadow-lg flex items-center gap-2">
        <span>{message}</span>
      </div>
    </div>
  );
}

