import React from 'react';
import { useTranslation } from 'react-i18next';

export const Experiences: React.FC = () => {
    const { t } = useTranslation();

    return (
        <div className="pt-32 pb-40 px-8 md:px-16 max-w-[1600px] mx-auto min-h-screen">
            <h1 className="text-5xl md:text-7xl font-serif text-[#1A1A1A] mb-12">
                {t('experiences.title')} <span className="italic text-[#D4AF37]">{t('experiences.titleItalic')}</span>
            </h1>
            <p className="text-xl font-serif text-[#6C6863] max-w-3xl mb-16 leading-relaxed">
                {t('experiences.description')}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="group cursor-pointer">
                    <div className="overflow-hidden aspect-[4/3] relative mb-6">
                        <img src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=1000&auto=format&fit=crop" alt={t('experiences.items.gastronomy.title')} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                    </div>
                    <h3 className="text-3xl font-serif text-[#1A1A1A] mb-2">{t('experiences.items.gastronomy.title')}</h3>
                    <p className="text-[#6C6863] font-serif italic">{t('experiences.items.gastronomy.description')}</p>
                </div>
                <div className="group cursor-pointer relative md:top-24">
                    <div className="overflow-hidden aspect-[4/3] relative mb-6">
                        <img src="https://images.unsplash.com/photo-1599839619722-39751411ea63?q=80&w=1000&auto=format&fit=crop" alt={t('experiences.items.wellness.title')} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                    </div>
                    <h3 className="text-3xl font-serif text-[#1A1A1A] mb-2">{t('experiences.items.wellness.title')}</h3>
                    <p className="text-[#6C6863] font-serif italic">{t('experiences.items.wellness.description')}</p>
                </div>
            </div>
        </div>
    );
};
