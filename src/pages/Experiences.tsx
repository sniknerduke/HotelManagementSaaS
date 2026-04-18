import React from 'react';

export const Experiences: React.FC = () => {
    return (
        <div className="pt-32 pb-40 px-8 md:px-16 max-w-[1600px] mx-auto min-h-screen">
            <h1 className="text-5xl md:text-7xl font-serif text-[#1A1A1A] mb-12">
                Curated <span className="italic text-[#D4AF37]">Experiences.</span>
            </h1>
            <p className="text-xl font-serif text-[#6C6863] max-w-3xl mb-16 leading-relaxed">
                Immerse yourself in extraordinary moments designed exclusively for our guests. From private yacht charters to personalized culinary masterclasses, elevate your stay beyond the ordinary.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="group cursor-pointer">
                    <div className="overflow-hidden aspect-[4/3] relative mb-6">
                        <img src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=1000&auto=format&fit=crop" alt="Private Dining" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                    </div>
                    <h3 className="text-3xl font-serif text-[#1A1A1A] mb-2">Private Gastronomy</h3>
                    <p className="text-[#6C6863] font-serif italic">An intimate journey for your palate.</p>
                </div>
                <div className="group cursor-pointer relative md:top-24">
                    <div className="overflow-hidden aspect-[4/3] relative mb-6">
                        <img src="https://images.unsplash.com/photo-1599839619722-39751411ea63?q=80&w=1000&auto=format&fit=crop" alt="Wellness Retreat" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                    </div>
                    <h3 className="text-3xl font-serif text-[#1A1A1A] mb-2">Holistic Wellness</h3>
                    <p className="text-[#6C6863] font-serif italic">Rejuvenate the mind, body, and soul.</p>
                </div>
            </div>
        </div>
    );
};