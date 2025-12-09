import React, { ReactNode } from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  maxWidth?: string;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, maxWidth = "max-w-3xl" }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative bg-[#1a1d29] border border-[#2d2f36] w-full ${maxWidth} max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200`}>
        <button onClick={onClose} className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-white hover:text-black rounded-full transition-colors">
          <X className="w-5 h-5" />
        </button>
        <div className="overflow-y-auto custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
};