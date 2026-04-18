import React from 'react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useNavigate } from 'react-router-dom';

export const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="vertical-rl hidden xl:flex items-center gap-6 absolute left-8 top-32 text-[10px] uppercase font-bold tracking-[0.3em] text-[#6C6863]">
        <span className="w-12 h-px bg-[#1A1A1A]/20"></span>
        <p>Lumière / Vol. 01</p>
      </div>

      <section className="relative px-8 md:px-16 pt-16 md:pt-32 pb-24 mx-auto max-w-[1600px] w-full grid grid-cols-1 md:grid-cols-12 gap-12 isolate">
        <div className="md:col-span-8 lg:col-span-9 flex flex-col justify-end pt-[10vw]">
          <h1 className="text-6xl md:text-[8rem] lg:text-[10rem] tracking-tight leading-[0.85] font-serif mb-8 text-[#1A1A1A] z-10">
            A serene <span className="italic">refuge</span> from the daily noise.
          </h1>
          <div className="flex gap-4 md:items-center mt-12 z-20">
            <Button onClick={() => navigate('/search')} className="group shadow-[0_8px_32px_rgba(0,0,0,0.12)]">
              Discover Stays
            </Button>
            <div className="flex items-center gap-4 ml-6 hidden sm:flex">
              <span className="w-12 h-px bg-[#1A1A1A]/20"></span>
              <p className="text-[#6C6863] text-sm italic font-serif">Curated for 2026</p>
            </div>
          </div>
        </div>

        <div className="md:col-span-4 lg:col-span-3 -mt-32 md:-mt-0 hidden md:block">
           <img 
              src="https://images.unsplash.com/photo-1542314831-c6a4203251ab?q=80&w=1000&auto=format&fit=crop" 
              alt="Hotel interior" 
              className="w-full h-[600px] object-cover grayscale opacity-90 transition-all duration-[2000ms] hover:grayscale-0 hover:scale-105 shadow-[0_4px_24px_rgba(0,0,0,0.08)]"
           />
        </div>
      </section>

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
