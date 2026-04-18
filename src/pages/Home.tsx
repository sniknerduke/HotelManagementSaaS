import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/Button';
// import { Card } from '../components/ui/Card';
import { useNavigate } from 'react-router-dom';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [activeDatePicker, setActiveDatePicker] = useState<'sticky' | 'normal' | null>(null);
  const [checkIn, setCheckIn] = useState<number | null>(null);
  const [checkOut, setCheckOut] = useState<number | null>(null);
  
  const [activeGuestPicker, setActiveGuestPicker] = useState<'sticky' | 'normal' | null>(null);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > window.innerHeight * 0.7;
      setIsScrolled(scrolled);
      
      setActiveDatePicker(prev => prev ? (scrolled ? 'sticky' : 'normal') : null);
      setActiveGuestPicker(prev => prev ? (scrolled ? 'sticky' : 'normal') : null);
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
            setActiveDatePicker(activeDatePicker === (isSticky ? 'sticky' : 'normal') ? null : (isSticky ? 'sticky' : 'normal'));
            setActiveGuestPicker(null);
          }}
        >
          <span className={`font-serif transition-colors ${isSticky ? 'text-lg xl:text-xl' : 'text-xl xl:text-3xl'} ${!checkIn ? 'text-[#1A1A1A]/30' : 'text-[#1A1A1A]'}`}>
            {!checkIn ? 'Add dates' : !checkOut ? `May ${checkIn} - Checkout` : `May ${checkIn} - May ${checkOut}`}
          </span>
          <svg className={`w-4 h-4 text-[#1A1A1A]/40 transition-transform duration-500 transform ${activeDatePicker === (isSticky ? 'sticky' : 'normal') ? 'rotate-180 text-[#1A1A1A]' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="1.5" d="M19 9l-7 7-7-7"></path>
          </svg>
        </div>

        {/* Simulated Luxury Calendar Dropdown */}
        {activeDatePicker === (isSticky ? 'sticky' : 'normal') && (
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
                            setActiveDatePicker(null);
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
            setActiveGuestPicker(activeGuestPicker === (isSticky ? 'sticky' : 'normal') ? null : (isSticky ? 'sticky' : 'normal'));
            setActiveDatePicker(null);
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
          <svg className={`w-4 h-4 text-[#1A1A1A]/40 transition-transform duration-500 transform ${activeGuestPicker === (isSticky ? 'sticky' : 'normal') ? 'rotate-180 text-[#1A1A1A]' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="1.5" d="M19 9l-7 7-7-7"></path>
          </svg>
        </div>

        {/* Guest Matrix Dropdown */}
        {activeGuestPicker === (isSticky ? 'sticky' : 'normal') && (
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
      <div className={`fixed top-16 lg:top-20 left-0 w-full z-[100] bg-[#F9F8F6] shadow-[0_16px_40px_rgba(0,0,0,0.1)] border-b border-[#1A1A1A]/10 transition-transform duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${isScrolled ? 'translate-y-0' : '-translate-y-[150%]'}`}>
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

      {/* 2. Introduction / Value Proposition */}
      <section className="bg-[#F9F8F6] py-24 md:py-32 px-8 md:px-16 text-center w-full">
        <div className="max-w-4xl mx-auto">
          <span className="block text-[10px] uppercase font-bold tracking-[0.3em] text-[#D4AF37] mb-6">The Lumière Experience</span>
          <h2 className="text-4xl md:text-5xl font-serif text-[#1A1A1A] mb-8 leading-tight">Where Heritage Meets Contemporary Luxury</h2>
          <p className="text-lg md:text-xl text-[#6C6863] font-serif italic leading-relaxed">
            Nestled in the heart of the historic district, The Lumière stands as a beacon of refined elegance. 
            Our design philosophy embraces the architectural grandeur of the past while offering the intuitive, 
            bespoke service of tomorrow. Every detail is a testament to our dedication to the art of hospitality.
          </p>
        </div>
      </section>

      {/* 3. Featured Rooms & Suites */}
      <section className="bg-[#1A1A1A] py-24 md:py-32 px-8 md:px-16 w-full text-[#F9F8F6]">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
            <div>
              <span className="block text-[10px] uppercase font-bold tracking-[0.3em] text-[#D4AF37] mb-4">A Curated Stay</span>
              <h2 className="text-4xl md:text-5xl font-serif">Featured <span className="italic text-[#D4AF37]">Accommodations.</span></h2>
            </div>
            <Button onClick={() => navigate('/search')} className="bg-transparent border border-[#F9F8F6]/20 text-[#F9F8F6] hover:bg-[#F9F8F6] hover:text-[#1A1A1A] transition-colors rounded-none px-8 py-4 text-xs tracking-[0.2em] uppercase shadow-none ring-0">View All Rooms</Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="group cursor-pointer">
              <div className="overflow-hidden aspect-[4/5] relative mb-6">
                <img src="https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=1000&auto=format&fit=crop" alt="Deluxe Ocean View" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-90 group-hover:opacity-100" />
              </div>
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-2xl font-serif">Deluxe Ocean View</h3>
                <span className="text-[#D4AF37] font-serif whitespace-nowrap ml-4">From $450</span>
              </div>
              <div className="flex justify-between items-end">
                <p className="text-sm text-[#F9F8F6]/60">Up to 2 Guests • 45 sqm</p>
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold border-b border-[#D4AF37] text-[#D4AF37] pb-1 group-hover:text-[#F9F8F6] group-hover:border-[#F9F8F6] transition-colors">View Details</span>
              </div>
            </div>
            
            {/* Card 2 */}
            <div className="group cursor-pointer">
              <div className="overflow-hidden aspect-[4/5] relative mb-6">
                <img src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1000&auto=format&fit=crop" alt="Signature Suite" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-90 group-hover:opacity-100" />
              </div>
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-2xl font-serif">Signature Suite</h3>
                <span className="text-[#D4AF37] font-serif whitespace-nowrap ml-4">From $850</span>
              </div>
              <div className="flex justify-between items-end">
                <p className="text-sm text-[#F9F8F6]/60">Up to 3 Guests • 65 sqm</p>
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold border-b border-[#D4AF37] text-[#D4AF37] pb-1 group-hover:text-[#F9F8F6] group-hover:border-[#F9F8F6] transition-colors">View Details</span>
              </div>
            </div>

            {/* Card 3 */}
            <div className="group cursor-pointer">
              <div className="overflow-hidden aspect-[4/5] relative mb-6">
                <img src="https://images.unsplash.com/photo-1631049307264-da0ec4d70104?q=80&w=1000&auto=format&fit=crop" alt="The Grand Penthouse" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-90 group-hover:opacity-100" />
              </div>
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-2xl font-serif">The Grand Penthouse</h3>
                <span className="text-[#D4AF37] font-serif whitespace-nowrap ml-4">From $2,200</span>
              </div>
              <div className="flex justify-between items-end">
                <p className="text-sm text-[#F9F8F6]/60">Up to 4 Guests • 120 sqm</p>
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold border-b border-[#D4AF37] text-[#D4AF37] pb-1 group-hover:text-[#F9F8F6] group-hover:border-[#F9F8F6] transition-colors">View Details</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Core Amenities Overview */}
      <section className="bg-[#F9F8F6] py-24 px-8 md:px-16 w-full border-b border-[#1A1A1A]/10">
        <div className="max-w-[1600px] mx-auto">
          <h2 className="text-3xl md:text-4xl font-serif text-center mb-16 text-[#1A1A1A]">Curated <span className="italic text-[#D4AF37]">Amenities</span></h2>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-center pt-8">
              <div className="flex flex-col items-center">
                  <svg className="w-8 h-8 mb-4 text-[#1A1A1A]/80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="1.5" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>
                  <h4 className="text-xs uppercase tracking-[0.1em] font-bold text-[#1A1A1A]">Spa & Wellness</h4>
              </div>
              <div className="flex flex-col items-center">
                  <svg className="w-8 h-8 mb-4 text-[#1A1A1A]/80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="1.5" d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z"></path></svg>
                  <h4 className="text-xs uppercase tracking-[0.1em] font-bold text-[#1A1A1A]">Fine Dining</h4>
              </div>
              <div className="flex flex-col items-center">
                  <svg className="w-8 h-8 mb-4 text-[#1A1A1A]/80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                  <h4 className="text-xs uppercase tracking-[0.1em] font-bold text-[#1A1A1A]">Infinity Pool</h4>
              </div>
              <div className="flex flex-col items-center">
                  <svg className="w-8 h-8 mb-4 text-[#1A1A1A]/80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="1.5" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"></path></svg>
                  <h4 className="text-xs uppercase tracking-[0.1em] font-bold text-[#1A1A1A]">High-Speed Wi-Fi</h4>
              </div>
              <div className="flex flex-col items-center">
                  <svg className="w-8 h-8 mb-4 text-[#1A1A1A]/80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                  <h4 className="text-xs uppercase tracking-[0.1em] font-bold text-[#1A1A1A]">Fitness Center</h4>
              </div>
          </div>
        </div>
      </section>

      {/* 5. Guest Testimonials / Social Proof */}
      <section className="bg-[#F4F3F0] py-24 md:py-32 px-8 md:px-16 w-full">
        <div className="max-w-[1600px] mx-auto text-center border-t border-[#1A1A1A]/5 pt-32">
          <span className="block text-[10px] uppercase font-bold tracking-[0.3em] text-[#D4AF37] mb-4">Guest Experience</span>
          <h2 className="text-4xl md:text-5xl font-serif text-[#1A1A1A] mb-16">Words from our <span className="italic text-[#D4AF37]">Guests.</span></h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-left">
             {[
               { name: "Eleanor", excerpt: "An absolutely breathtaking experience. The attention to detail in the suite was unmatched, and the staff anticipated our every need before we even asked.", rating: 5 },
               { name: "Marcus", excerpt: "From the moment we arrived, we were treated like royalty. The infinity pool at sunset is a core memory I will cherish forever.", rating: 5 },
               { name: "Sophia", excerpt: "A true sanctuary in the city. The fine dining restaurant offered one of the most exquisite culinary journeys we've ever documented.", rating: 5 }
             ].map((review, i) => (
               <div key={i} className="bg-[#F9F8F6] p-10 relative shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-[#1A1A1A]/5 flex flex-col">
                  <div className="flex gap-1 text-[#D4AF37] mb-6">
                    {[...Array(review.rating)].map((_, j) => <svg key={j} className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>)}
                  </div>
                  <p className="font-serif italic text-lg text-[#1A1A1A] mb-8 leading-relaxed flex-grow">"{review.excerpt}"</p>
                  <div>
                     <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#6C6863]">— {review.name}</p>
                  </div>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* 6. Location & Accessibility */}
      <section className="bg-[#1A1A1A] py-24 md:py-32 px-8 md:px-16 w-full text-[#F9F8F6]">
        <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row gap-16 items-center">
          <div className="flex-1 w-full order-2 lg:order-1">
             <div className="aspect-square md:aspect-video lg:aspect-square w-full relative bg-[#F9F8F6]/10 overflow-hidden group">
                <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1000&auto=format&fit=crop" alt="Map Location Placeholder" className="w-full h-full object-cover mix-blend-luminosity opacity-60 group-hover:scale-105 transition-transform duration-1000" />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                   {/* Map Pin UI */}
                   <div className="w-16 h-16 bg-[#D4AF37] rounded-full flex items-center justify-center shadow-[0_0_0_10px_rgba(212,175,55,0.2)]">
                     <svg className="w-8 h-8 text-[#1A1A1A]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                   </div>
                </div>
             </div>
          </div>
          <div className="flex-1 w-full order-1 lg:order-2 px-0 lg:px-8">
             <span className="block text-[10px] uppercase font-bold tracking-[0.3em] text-[#D4AF37] mb-4">Discover the Area</span>
             <h2 className="text-4xl md:text-5xl font-serif mb-12">Location & <span className="italic text-[#D4AF37]">Accessibility.</span></h2>
             
             <div className="mb-10">
               <h4 className="text-xs uppercase tracking-[0.1em] font-bold mb-4 border-b border-[#F9F8F6]/20 pb-2 text-[#D4AF37]">Address</h4>
               <p className="font-serif text-lg text-[#F9F8F6]/80 leading-relaxed">124 Luxury Avenue<br/>Historic District, Metropolis 10001</p>
             </div>
             
             <div className="mb-10">
               <h4 className="text-xs uppercase tracking-[0.1em] font-bold mb-4 border-b border-[#F9F8F6]/20 pb-2 text-[#D4AF37]">Transit Hubs</h4>
               <ul className="font-serif text-lg text-[#F9F8F6]/80 space-y-4">
                 <li className="flex flex-col md:flex-row justify-between md:items-center gap-2"><span>Metropolis International Airport</span> <span className="text-sm font-sans tracking-wide text-[#F9F8F6]/50">25 miles / 40 min</span></li>
                 <li className="flex flex-col md:flex-row justify-between md:items-center gap-2"><span>Central Grand Train Station</span> <span className="text-sm font-sans tracking-wide text-[#F9F8F6]/50">3 miles / 10 min</span></li>
               </ul>
             </div>

             <div>
               <h4 className="text-xs uppercase tracking-[0.1em] font-bold mb-4 border-b border-[#F9F8F6]/20 pb-2 text-[#D4AF37]">Nearby Landmarks</h4>
               <ul className="font-serif text-lg text-[#F9F8F6]/80 space-y-3">
                 <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]"></span> The Grand Opera House (0.5 miles)</li>
                 <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]"></span> National Museum of Art (1.2 miles)</li>
                 <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]"></span> Royal Botanical Gardens (2.0 miles)</li>
               </ul>
             </div>
          </div>
        </div>
      </section>
    </>
  );
};
