import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useNavigate } from 'react-router-dom';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [checkIn, setCheckIn] = useState<number | null>(null);
  const [checkOut, setCheckOut] = useState<number | null>(null);
  
  const [isGuestPickerOpen, setIsGuestPickerOpen] = useState(false);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > window.innerHeight * 0.7);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const totalGuests = adults + children;

  const SearchBarContent = ({ isSticky = false }: { isSticky?: boolean }) => (
    <>
      {/* Location */}
      <div className={`flex-1 w-full border-b md:border-b-0 md:border-r border-[#1A1A1A]/10 ${isSticky ? 'pb-2 md:pb-0 md:pr-6 xl:pr-8' : 'pb-4 md:pb-0 md:pr-8 xl:pr-12'} group cursor-text`}>
        <label className={`block uppercase font-bold tracking-[0.2em] text-[#6C6863] group-hover:text-[#1A1A1A] transition-colors ${isSticky ? 'text-[8px] mb-1' : 'text-[10px] mb-3'}`}>Destination</label>
        <input 
          type="text" 
          placeholder="Where to?" 
          className={`w-full bg-transparent border-none outline-none text-[#1A1A1A] font-serif placeholder:text-[#1A1A1A]/30 focus:ring-0 p-0 ${isSticky ? 'text-lg xl:text-xl' : 'text-xl xl:text-3xl'}`} 
        />
      </div>

      {/* Dates / Custom Luxury Date Picker Trigger */}
      <div className={`flex-[1.5] w-full border-b md:border-b-0 md:border-r border-[#1A1A1A]/10 ${isSticky ? 'pb-2 md:pb-0 md:px-6 xl:px-8' : 'pb-4 md:pb-0 md:px-8 xl:px-12'} group cursor-pointer relative`}>
        <label className={`block uppercase font-bold tracking-[0.2em] text-[#6C6863] group-hover:text-[#1A1A1A] transition-colors ${isSticky ? 'text-[8px] mb-1' : 'text-[10px] mb-3'}`}>Check in - Check out</label>
        <div 
          className={`flex items-center justify-between w-full h-full ${isSticky ? 'py-0' : 'py-1'}`}
          onClick={() => {
            setIsDatePickerOpen(!isDatePickerOpen);
            setIsGuestPickerOpen(false);
          }}
        >
          <span className={`font-serif transition-colors ${isSticky ? 'text-lg xl:text-xl' : 'text-xl xl:text-3xl'} ${!checkIn ? 'text-[#1A1A1A]/30' : 'text-[#1A1A1A]'}`}>
            {!checkIn ? 'Add dates' : !checkOut ? `May ${checkIn} - Checkout` : `May ${checkIn} - May ${checkOut}`}
          </span>
          <svg className={`w-4 h-4 text-[#1A1A1A]/40 transition-transform duration-500 transform ${isDatePickerOpen ? 'rotate-180 text-[#1A1A1A]' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="1.5" d="M19 9l-7 7-7-7"></path>
          </svg>
        </div>

        {/* Simulated Luxury Calendar Dropdown */}
        {isDatePickerOpen && (
          <div className="absolute top-[120%] left-0 w-[400px] bg-[#F9F8F6] border border-[#1A1A1A]/10 shadow-[0_32px_64px_rgba(0,0,0,0.2)] z-50 p-8 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex justify-between items-center mb-8">
              <button onClick={(e) => e.stopPropagation()} className="text-[#1A1A1A]/40 hover:text-[#1A1A1A] transition-colors h-8 w-8 flex items-center justify-center border border-transparent hover:border-[#1A1A1A]/20">←</button>
              <span className="font-serif italic text-xl text-[#1A1A1A]">May 2026</span>
              <button onClick={(e) => e.stopPropagation()} className="text-[#1A1A1A]/40 hover:text-[#1A1A1A] transition-colors h-8 w-8 flex items-center justify-center border border-transparent hover:border-[#1A1A1A]/20">→</button>
            </div>
            <div className="grid grid-cols-7 gap-2 text-center mb-4">
              {['S','M','T','W','T','F','S'].map(d => (
                 <span key={d} className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#6C6863]/60">{d}</span>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-y-4 gap-x-0 overflow-hidden text-center font-serif text-lg">
               <span className="opacity-0 bg-transparent"></span><span className="opacity-0 bg-transparent"></span><span className="opacity-0 bg-transparent"></span><span className="opacity-0 bg-transparent"></span><span className="opacity-0 bg-transparent"></span>
               {[...Array(31)].map((_, i) => {
                 const day = i + 1;
                 const isSelected = day === checkIn || day === checkOut;
                 const isInRange = checkIn && checkOut && day > checkIn && day < checkOut;
                 
                 return (
                   <div key={i} className={`relative flex items-center justify-center h-10 ${isInRange ? 'bg-[#D4AF37]/15' : ''} ${day === checkIn && checkOut ? 'bg-gradient-to-r from-transparent to-[#D4AF37]/15' : ''} ${day === checkOut ? 'bg-gradient-to-l from-transparent to-[#D4AF37]/15' : ''}`}>
                     <button 
                       onClick={(e) => { 
                         e.stopPropagation();
                         if (!checkIn || (checkIn && checkOut)) {
                           setCheckIn(day);
                           setCheckOut(null);
                         } else if (day >= checkIn) {
                           if (day === checkIn) {
                            setCheckOut(null);
                           } else {
                            setCheckOut(day);
                            setIsDatePickerOpen(false);
                           }
                         } else {
                           setCheckIn(day);
                         }
                       }}
                       className={`w-10 h-10 rounded-none flex flex-shrink-0 items-center justify-center transition-colors relative z-10 ${isSelected ? 'bg-[#1A1A1A] text-[#F9F8F6]' : 'text-[#1A1A1A] hover:bg-[#1A1A1A]/5'}`}
                     >
                       {day}
                     </button>
                   </div>
                 );
               })}
            </div>
          </div>
        )}
      </div>

      {/* Guests Custom Luxury Selector */}
      <div className={`flex-1 w-full ${isSticky ? 'pb-2 md:pb-0 md:px-6 xl:px-8' : 'pb-4 md:pb-0 md:px-8 xl:px-12'} group cursor-pointer relative`}>
        <label className={`block uppercase font-bold tracking-[0.2em] text-[#6C6863] group-hover:text-[#1A1A1A] transition-colors ${isSticky ? 'text-[8px] mb-1' : 'text-[10px] mb-3'}`}>Guests</label>
        <div 
          className={`flex items-center justify-between w-full h-full ${isSticky ? 'py-0' : 'py-1'}`}
          onClick={() => {
            setIsGuestPickerOpen(!isGuestPickerOpen);
            setIsDatePickerOpen(false);
          }}
        >
          <div className="flex flex-col">
            <span className={`font-serif text-[#1A1A1A] transition-colors ${isSticky ? 'text-lg xl:text-xl' : 'text-xl xl:text-3xl'}`}>
              {totalGuests} {totalGuests === 1 ? 'Guest' : 'Guests'}
            </span>
            {!isSticky && (
              <span className="text-[10px] uppercase tracking-[0.1em] text-[#6C6863]/60 mt-1">
                {rooms} {rooms === 1 ? 'Room' : 'Rooms'}
              </span>
            )}
          </div>
          <svg className={`w-4 h-4 text-[#1A1A1A]/40 transition-transform duration-500 transform ${isGuestPickerOpen ? 'rotate-180 text-[#1A1A1A]' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="1.5" d="M19 9l-7 7-7-7"></path>
          </svg>
        </div>

        {/* Guest Matrix Dropdown */}
        {isGuestPickerOpen && (
          <div className="absolute top-[120%] right-0 w-[350px] bg-[#F9F8F6] border border-[#1A1A1A]/10 shadow-[0_32px_64px_rgba(0,0,0,0.2)] z-50 p-8 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="space-y-6">
              {/* Adults */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-serif text-lg text-[#1A1A1A]">Adults</p>
                  <p className="text-xs text-[#6C6863] italic">Ages 13 or above</p>
                </div>
                <div className="flex items-center gap-4">
                  <button onClick={(e) => { e.stopPropagation(); setAdults(Math.max(1, adults - 1)); }} className="w-8 h-8 rounded-full border border-[#1A1A1A]/20 flex items-center justify-center text-[#1A1A1A] hover:border-[#1A1A1A] transition-colors">−</button>
                  <span className="font-serif w-4 text-center">{adults}</span>
                  <button onClick={(e) => { e.stopPropagation(); setAdults(adults + 1); }} className="w-8 h-8 rounded-full border border-[#1A1A1A]/20 flex items-center justify-center text-[#1A1A1A] hover:border-[#1A1A1A] transition-colors">+</button>
                </div>
              </div>

              {/* Children */}
              <div className="flex items-center justify-between border-t border-[#1A1A1A]/10 pt-6">
                <div>
                  <p className="font-serif text-lg text-[#1A1A1A]">Children</p>
                  <p className="text-xs text-[#6C6863] italic">Ages 2-12</p>
                </div>
                <div className="flex items-center gap-4">
                  <button onClick={(e) => { e.stopPropagation(); setChildren(Math.max(0, children - 1)); }} className="w-8 h-8 rounded-full border border-[#1A1A1A]/20 flex items-center justify-center text-[#1A1A1A] hover:border-[#1A1A1A] transition-colors">−</button>
                  <span className="font-serif w-4 text-center">{children}</span>
                  <button onClick={(e) => { e.stopPropagation(); setChildren(children + 1); }} className="w-8 h-8 rounded-full border border-[#1A1A1A]/20 flex items-center justify-center text-[#1A1A1A] hover:border-[#1A1A1A] transition-colors">+</button>
                </div>
              </div>

              {/* Rooms */}
              <div className="flex items-center justify-between border-t border-[#1A1A1A]/10 pt-6">
                <div>
                  <p className="font-serif text-lg text-[#1A1A1A]">Rooms</p>
                </div>
                <div className="flex items-center gap-4">
                  <button onClick={(e) => { e.stopPropagation(); setRooms(Math.max(1, rooms - 1)); }} className="w-8 h-8 rounded-full border border-[#1A1A1A]/20 flex items-center justify-center text-[#1A1A1A] hover:border-[#1A1A1A] transition-colors">−</button>
                  <span className="font-serif w-4 text-center">{rooms}</span>
                  <button onClick={(e) => { e.stopPropagation(); setRooms(rooms + 1); }} className="w-8 h-8 rounded-full border border-[#1A1A1A]/20 flex items-center justify-center text-[#1A1A1A] hover:border-[#1A1A1A] transition-colors">+</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action */}
      <div className={`w-full md:w-auto mt-4 md:mt-0 shrink-0 relative z-10 ${isSticky ? 'xl:pl-6' : 'xl:pl-8'}`}>
        <Button 
          onClick={() => navigate('/search')} 
          className={`w-full md:w-auto bg-[#1A1A1A] hover:bg-[#D4AF37] text-[#F9F8F6] hover:text-[#1A1A1A] transition-colors duration-500 shadow-none border-none tracking-[0.3em] ${isSticky ? 'px-8 py-4 text-xs' : 'px-16 py-6 xl:py-8 text-sm'}`}
        >
          Search
        </Button>
      </div>
    </>
  );

  return (
    <>
      <div className="vertical-rl hidden xl:flex items-center gap-6 absolute left-8 top-32 text-[10px] uppercase font-bold tracking-[0.3em] text-[#F9F8F6] z-50 mix-blend-difference">
        <span className="w-12 h-px bg-[#F9F8F6]/40"></span>
        <p>Lumière / Vol. 01</p>
      </div>

      {/* Sticky Top Bar (Animated) */}
      <div className={`fixed top-0 left-0 w-full z-[100] bg-[#F9F8F6] shadow-[0_16px_40px_rgba(0,0,0,0.1)] border-b border-[#1A1A1A]/10 transition-transform duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${isScrolled ? 'translate-y-0' : '-translate-y-[120%]'}`}>
        <div className="max-w-[1600px] mx-auto px-8 py-3 flex flex-col md:flex-row items-center gap-4 xl:gap-6 w-full">
          <SearchBarContent isSticky={true} />
        </div>
      </div>

      <section className="relative w-full h-[85vh] min-h-[700px] flex items-center justify-center bg-[#1A1A1A]">
        {/* Background Image Banner */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1542314831-c6a4203251ab?q=80&w=2560&auto=format&fit=crop" 
            alt="Luxury Hotel Hero" 
            className="w-full h-full object-cover scale-105 grayscale-[30%] opacity-80" 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1A1A1A]/40 via-transparent to-[#1A1A1A]/80 mix-blend-multiply"></div>
        </div>

        {/* Hero Text */}
        <div className="relative z-10 text-center flex flex-col items-center justify-center w-full px-8 mt-[-10vh]">
          <h1 className="text-6xl md:text-[8rem] lg:text-[10rem] tracking-tight leading-[0.85] font-serif mb-6 text-[#F9F8F6] drop-shadow-xl text-balance">
            A serene <span className="italic text-[#D4AF37]">refuge.</span>
          </h1>
          <p className="text-[#F9F8F6]/90 text-sm md:text-lg font-serif italic max-w-xl text-center tracking-wide">
            Escape the daily noise and discover unparalleled luxury in curated destinations worldwide.
          </p>
        </div>

        {/* Normal Searching Bar Container */}
        <div className="absolute bottom-12 md:bottom-20 left-1/2 -translate-x-1/2 w-full max-w-[90%] xl:max-w-7xl px-4 md:px-8 z-40">
          <div className="bg-[#F9F8F6] p-6 md:p-8 xl:py-10 shadow-[0_32px_64px_rgba(0,0,0,0.5)] flex flex-col md:flex-row items-center gap-6 xl:gap-8 w-full relative before:absolute before:inset-0 before:border before:border-[#1A1A1A]/10 before:pointer-events-none">
            <SearchBarContent isSticky={false} />
          </div>
        </div>
      </section>
          <div className="absolute inset-0 bg-gradient-to-b from-[#1A1A1A]/40 via-transparent to-[#1A1A1A]/80 mix-blend-multiply"></div>
        </div>

        {/* Hero Text */}
        <div className="relative z-10 text-center flex flex-col items-center justify-center w-full px-8 mt-[-10vh]">
          <h1 className="text-6xl md:text-[8rem] lg:text-[10rem] tracking-tight leading-[0.85] font-serif mb-6 text-[#F9F8F6] drop-shadow-xl text-balance">
            A serene <span className="italic text-[#D4AF37]">refuge.</span>
          </h1>
          <p className="text-[#F9F8F6]/90 text-sm md:text-lg font-serif italic max-w-xl text-center tracking-wide">
            Escape the daily noise and discover unparalleled luxury in curated destinations worldwide.
          </p>
        </div>

        {/* Normal Searching Bar Container */}
        <div className="absolute bottom-12 md:bottom-20 left-1/2 -translate-x-1/2 w-full max-w-[90%] xl:max-w-7xl px-4 md:px-8 z-40">
          <div className="bg-[#F9F8F6] p-6 md:p-8 xl:py-10 shadow-[0_32px_64px_rgba(0,0,0,0.5)] flex flex-col md:flex-row items-center gap-6 xl:gap-8 w-full relative before:absolute before:inset-0 before:border before:border-[#1A1A1A]/10 before:pointer-events-none">
            <SearchBarContent isSticky={false} />
          </div>
        </div>
      </section>>

      <section className="bg-[#1A1A1A] text-[#F9F8F6] pt-32 pb-40 px-8 md:px-16 mx-auto max-w-[1600px] w-full grid grid-cols-1 md:grid-cols-12 gap-12">
        <div className="md:col-span-4 relative group cursor-pointer overflow-hidden p-1 shadow-[0_4px_24px_rgba(0,0,0,0.2)]">
            <span className="mb-4 block text-[10px] uppercase font-bold tracking-[0.3em] text-[#6C6863]/60 group-hover:text-[#D4AF37] transition-colors duration-[1500ms]">01 / Sanctuary</span>
            <img 
               src="https://images.unsplash.com/photo-1551882547-ff40c634ad5w?w=900&auto=format&fit=crop&q=60" 
               alt="Spa" 
               className="w-full aspect-[3/4] object-cover grayscale opacity-80 duration-[2000ms] group-hover:grayscale-0 group-hover:scale-105"
               onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=900&auto=format&fit=crop" }}
             />
        </div>
        
        <div className="md:col-span-6 md:col-start-6 lg:col-start-7 flex flex-col justify-center">
            <h2 className="text-5xl md:text-7xl font-serif mb-8 leading-[1.1] text-[#F9F8F6]">
               Elevated <span className="italic text-[#D4AF37]">Amenities</span>
            </h2>
            <div className="space-y-6">
                <Card className="border-t border-[#F9F8F6]/20 hover:bg-[#F9F8F6]/5 hover:shadow-none p-0 py-8 px-6 group transition-all duration-[750ms]">
                    <div className="flex justify-between items-center group-hover:pl-4 transition-all duration-500">
                        <p className="text-xl font-serif group-hover:text-[#D4AF37] transition-all duration-500">Wellness Spa & Retreat</p>
                        <span className="text-[10px] uppercase tracking-[0.2em] text-[#F9F8F6]/40 group-hover:text-[#D4AF37]/50 duration-500">Explore</span>
                    </div>
                </Card>
                <Card className="border-t border-[#F9F8F6]/20 hover:bg-[#F9F8F6]/5 hover:shadow-none p-0 py-8 px-6 group transition-all duration-[750ms]">
                    <div className="flex justify-between items-center group-hover:pl-4 transition-all duration-500">
                        <p className="text-xl font-serif group-hover:text-[#D4AF37] transition-all duration-500">Michelin-Starred Dining</p>
                        <span className="text-[10px] uppercase tracking-[0.2em] text-[#F9F8F6]/40 group-hover:text-[#D4AF37]/50 duration-500">Explore</span>
                    </div>
                </Card>
                <Card className="border-t border-[#F9F8F6]/20 hover:bg-[#F9F8F6]/5 hover:shadow-none p-0 py-8 px-6 group transition-all duration-[750ms]">
                    <div className="flex justify-between items-center group-hover:pl-4 transition-all duration-500">
                        <p className="text-xl font-serif group-hover:text-[#D4AF37] transition-all duration-500">Curated Excursions</p>
                        <span className="text-[10px] uppercase tracking-[0.2em] text-[#F9F8F6]/40 group-hover:text-[#D4AF37]/50 duration-500">Explore</span>
                    </div>
                </Card>
            </div>
            
            <Button onClick={() => navigate('/search')} variant="secondary" className="border-[#F9F8F6]/20 text-[#F9F8F6] self-start mt-12 hover:bg-[#D4AF37] hover:border-[#D4AF37] hover:text-[#1A1A1A]">
                Reserve Your Stay
            </Button>
        </div>
      </section>
    </>
  );
};
