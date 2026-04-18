import React from 'react';
import { useTranslation } from 'react-i18next';

export const Amenities: React.FC = () => {
    const { t } = useTranslation();

    return (
        <div className="pt-24 pb-40">
            {/* Hero Section */}
            <div className="relative w-full h-[60vh] min-h-[500px] flex items-center justify-center bg-[#1A1A1A]">
                <div className="absolute inset-0 z-0 overflow-hidden">
                    <img 
                        src="https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=2560&auto=format&fit=crop&q=80" 
                        alt="Luxury Amenities" 
                        className="w-full h-full object-cover scale-105 grayscale-[30%] opacity-70" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#1A1A1A]/40 via-transparent to-[#1A1A1A]/90"></div>
                </div>
                <div className="relative z-10 text-center flex flex-col items-center justify-center w-full px-8">
                    <span className="block text-[10px] uppercase font-bold tracking-[0.3em] text-[#D4AF37] mb-6">{t('amenities.hero.subtitle')}</span>
                    <h1 className="text-7xl md:text-[8rem] lg:text-[10rem] tracking-tight leading-[0.9] font-serif mb-6 text-[#F9F8F6] drop-shadow-xl">
                        {t('amenities.hero.title')} <span className="italic text-[#D4AF37]">{t('amenities.hero.titleItalic')}</span>
                    </h1>
                    <p className="text-[#F9F8F6]/90 text-sm md:text-lg font-serif italic max-w-2xl text-center tracking-wide">
                        {t('amenities.hero.description')}
                    </p>
                </div>
            </div>

            {/* Core Facilities Grid */}
            <section className="bg-[#1A1A1A] text-[#F9F8F6] pt-24 pb-32 px-8 md:px-16 mx-auto w-full flex flex-col items-center">
                <div className="max-w-[1600px] w-full">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8 lg:gap-16 pt-16">
                        
                        {/* Core Facilities */}
                        <div>
                        <h3 className="text-xs md:text-sm uppercase font-bold tracking-[0.3em] text-[#D4AF37] mb-8 pb-4 border-b border-[#F9F8F6]/10 flex items-center gap-3">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                            {t('amenities.core.title')}
                        </h3>
                        <ul className="space-y-6 font-serif text-[#F9F8F6]/80 lg:text-lg">
                            <li className="hover:text-[#F9F8F6] transition-colors">{t('amenities.core.wifi')}</li>
                            <li className="hover:text-[#F9F8F6] transition-colors">{t('amenities.core.pool')}</li>
                            <li className="hover:text-[#F9F8F6] transition-colors">{t('amenities.core.fitness')}</li>
                            <li className="hover:text-[#F9F8F6] transition-colors">{t('amenities.core.spa')}</li>
                            <li className="hover:text-[#F9F8F6] transition-colors">{t('amenities.core.restaurant')}</li>
                            <li className="hover:text-[#F9F8F6] transition-colors">{t('amenities.core.business')}</li>
                            <li className="hover:text-[#F9F8F6] transition-colors">{t('amenities.core.parking')}</li>
                        </ul>
                        </div>

                        {/* In-Room Amenities */}
                        <div>
                        <h3 className="text-xs md:text-sm uppercase font-bold tracking-[0.3em] text-[#D4AF37] mb-8 pb-4 border-b border-[#F9F8F6]/10 flex items-center gap-3">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="1.5" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>
                            {t('amenities.inRoom.title')}
                        </h3>
                        <ul className="space-y-6 font-serif text-[#F9F8F6]/80 lg:text-lg">
                            <li className="hover:text-[#F9F8F6] transition-colors">{t('amenities.inRoom.ac')}</li>
                            <li className="hover:text-[#F9F8F6] transition-colors">{t('amenities.inRoom.tv')}</li>
                            <li className="hover:text-[#F9F8F6] transition-colors">{t('amenities.inRoom.minibar')}</li>
                            <li className="hover:text-[#F9F8F6] transition-colors">{t('amenities.inRoom.bathroom')}</li>
                            <li className="hover:text-[#F9F8F6] transition-colors">{t('amenities.inRoom.safe')}</li>
                            <li className="hover:text-[#F9F8F6] transition-colors">{t('amenities.inRoom.coffee')}</li>
                        </ul>
                        </div>

                        {/* Guest Services */}
                        <div>
                        <h3 className="text-xs md:text-sm uppercase font-bold tracking-[0.3em] text-[#D4AF37] mb-8 pb-4 border-b border-[#F9F8F6]/10 flex items-center gap-3">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="1.5" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            {t('amenities.services.title')}
                        </h3>
                        <ul className="space-y-6 font-serif text-[#F9F8F6]/80 lg:text-lg">
                            <li className="hover:text-[#F9F8F6] transition-colors">{t('amenities.services.frontDesk')}</li>
                            <li className="hover:text-[#F9F8F6] transition-colors">{t('amenities.services.roomService')}</li>
                            <li className="hover:text-[#F9F8F6] transition-colors">{t('amenities.services.shuttle')}</li>
                            <li className="hover:text-[#F9F8F6] transition-colors">{t('amenities.services.laundry')}</li>
                            <li className="hover:text-[#F9F8F6] transition-colors">{t('amenities.services.housekeeping')}</li>
                        </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials & Achievements Section */}
            <section className="bg-[#F9F8F6] text-[#1A1A1A] py-32 px-8 md:px-16 w-full shadow-[inset_0_1px_0_rgba(0,0,0,0.1)]">
                <div className="max-w-[1600px] mx-auto">
                <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-end mb-20 gap-8">
                    <div>
                        <span className="block text-[10px] uppercase font-bold tracking-[0.3em] text-[#6C6863] mb-4">{t('amenities.testimonials.subtitle')}</span>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif leading-[1.1]">
                        {t('amenities.testimonials.title')} <span className="italic text-[#D4AF37]">{t('amenities.testimonials.titleItalic')}</span>
                        </h2>
                    </div>
                    
                    <div className="flex gap-12 text-[#1A1A1A]">
                        <div className="flex flex-col border-l border-[#1A1A1A]/20 pl-6">
                        <span className="text-4xl font-serif">5★</span>
                        <span className="text-[10px] uppercase tracking-[0.2em] text-[#6C6863] mt-2">Forbes Travel Guide</span>
                        </div>
                        <div className="flex flex-col border-l border-[#1A1A1A]/20 pl-6">
                        <span className="text-4xl font-serif">#1</span>
                        <span className="text-[10px] uppercase tracking-[0.2em] text-[#6C6863] mt-2">Condé Nast Gold List</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 relative before:absolute before:inset-0 before:top-1/2 before:-translate-y-1/2 before:h-px before:bg-[#1A1A1A]/10 md:before:block before:hidden">
                    
                    {/* Quote 1 */}
                    <div className="relative pt-12 md:pt-0 pr-0 md:pr-12 lg:pr-24 border-t border-[#1A1A1A]/10 md:border-none">
                    <svg className="w-8 h-8 text-[#D4AF37] mb-6 opacity-50" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" /></svg>
                    <p className="text-2xl lg:text-3xl font-serif leading-relaxed mb-8">
                        {t('amenities.testimonials.quote1')}
                    </p>
                    <div>
                        <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#1A1A1A]">{t('amenities.testimonials.author1')}</p>
                        <p className="text-xs font-serif italic text-[#6C6863] mt-1">{t('amenities.testimonials.context1')}</p>
                    </div>
                    </div>

                    {/* Quote 2 */}
                    <div className="relative pt-12 md:pt-16 pl-0 md:pl-12 lg:pl-24 border-t border-[#1A1A1A]/10 md:border-none md:border-l">
                    <svg className="w-8 h-8 text-[#D4AF37] mb-6 opacity-50" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" /></svg>
                    <p className="text-2xl lg:text-3xl font-serif leading-relaxed mb-8">
                        {t('amenities.testimonials.quote2')}
                    </p>
                    <div>
                        <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#1A1A1A]">{t('amenities.testimonials.author2')}</p>
                        <p className="text-xs font-serif italic text-[#6C6863] mt-1">{t('amenities.testimonials.context2')}</p>
                    </div>
                    </div>

                </div>
                </div>
            </section>
        </div>
    );
};