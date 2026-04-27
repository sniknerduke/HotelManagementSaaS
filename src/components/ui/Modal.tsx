import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
    useEffect(() => {
        if (isOpen) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = 'unset';
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white border border-[#1A1A1A]/10 shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-6 border-b border-[#1A1A1A]/10 flex justify-between items-center bg-[#F9F8F6]">
                    <h2 className="text-xl font-serif text-[#1A1A1A]">{title}</h2>
                    <button onClick={onClose} className="p-2 text-[#6C6863] hover:text-[#1A1A1A] hover:bg-black/5 transition-colors">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                <div className="p-6 max-h-[80vh] overflow-y-auto font-sans">
                    {children}
                </div>
            </div>
        </div>,
        document.body
    );
};
