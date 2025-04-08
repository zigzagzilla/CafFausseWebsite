import React, { useEffect } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X } from "lucide-react";

interface LightboxProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  imageAlt: string;
}

export function Lightbox({ isOpen, onClose, imageSrc, imageAlt }: LightboxProps) {
  // Close on escape key press
  useEffect(() => {
    const handleEscapeKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscapeKeyPress);
    
    return () => {
      document.removeEventListener('keydown', handleEscapeKeyPress);
    };
  }, [isOpen, onClose]);

  // Prevent scrolling when lightbox is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-3xl max-w-[90vw] max-h-[90vh] p-0 bg-transparent border-none">
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full bg-black bg-opacity-50 p-2 text-white hover:bg-opacity-70 transition-all z-10"
          aria-label="Close"
        >
          <X className="h-6 w-6" />
        </button>
        <div className="flex items-center justify-center w-full h-full">
          <img 
            src={imageSrc} 
            alt={imageAlt} 
            className="max-w-full max-h-[85vh] object-contain rounded-md" 
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}