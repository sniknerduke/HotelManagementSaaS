import React, { useState, useEffect } from 'react';

export const SplashScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'initial' | 'l' | 'word' | 'move' | 'reveal' | 'done'>('initial');

  useEffect(() => {
    // Stage 1: Fade in the 'L'
    const t1 = setTimeout(() => setPhase('l'), 200);
    // Stage 2: Reveal the full brand name 'The Lumière'
    const t2 = setTimeout(() => setPhase('word'), 1500);
    // Stage 3: Move logo to top left (background stays solid)
    const t3 = setTimeout(() => setPhase('move'), 3200);
    // Stage 4: Fade out background revealing the website perfectly aligned
    const t4 = setTimeout(() => setPhase('reveal'), 4400); // 1200ms for move to finish
    // Stage 5: Unmount cleanly
    const t5 = setTimeout(() => {
      setPhase('done');
      onComplete();
    }, 5200); // 800ms reveal fade

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, [onComplete]);

  if (phase === 'done') return null;

  return (
    <div 
      className={`fixed inset-0 z-[200] flex justify-center transition-colors duration-[800ms]
        ${phase === 'reveal' ? 'bg-transparent pointer-events-none' : 'bg-[#F9F8F6] pointer-events-auto'}
      `}
    >
      <div className="w-full max-w-[1600px] relative h-full">
        <div 
          className={`absolute font-serif text-[#1A1A1A] transition-all duration-[1200ms] ease-[cubic-bezier(0.76,0,0.24,1)] flex items-baseline whitespace-nowrap
            ${['move', 'reveal'].includes(phase)
              ? 'top-[1.125rem] lg:top-[1.5rem] left-8 md:left-16 text-xl md:text-2xl transform-none tracking-tight'
              : 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-7xl md:text-[8rem] tracking-widest'
            }
            ${phase === 'reveal' ? 'opacity-0 blur-sm scale-95' : 'opacity-100'}
          `}
        >
          <span 
            className={`transition-all duration-1000 origin-right
              ${['word', 'move', 'reveal'].includes(phase) ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
              ${['move', 'reveal'].includes(phase) ? 'mr-1' : 'mr-4'}
            `}
          >
            The
          </span>
          
          <span className="italic relative flex items-baseline">
            <span 
              className={`transition-opacity duration-1000 
                ${['l', 'word', 'move', 'reveal'].includes(phase) ? 'opacity-100' : 'opacity-0'}
              `}
            >
              L
            </span>
            <span 
              className={`transition-all duration-1000 origin-left
                ${['word', 'move', 'reveal'].includes(phase) ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
              `}
            >
              umière
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};
