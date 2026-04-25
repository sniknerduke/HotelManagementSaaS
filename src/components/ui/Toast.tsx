import React from 'react';

export const Toast: React.FC<{ message: string; type?: 'success' | 'error' | 'info' }> = ({ message, type = 'info' }) => {
  const bgColors = {
    success: 'bg-[#D4AF37] text-white',
    error: 'bg-red-600 text-white',
    info: 'bg-[#1A1A1A] text-white'
  };

  return (
    <div className={`px-6 py-4 shadow-[0_8px_32px_rgba(0,0,0,0.1)] flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300 font-serif ${bgColors[type]}`}>
      {type === 'success' && (
        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
      )}
      {type === 'error' && (
        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
      )}
      {type === 'info' && (
        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
      )}
      <p className="text-sm tracking-wide">{message}</p>
    </div>
  );
};
