import React from 'react';
import { useTranslation } from 'react-i18next';

export const TermsOfService: React.FC = () => {
    const { t } = useTranslation();

    return (
        <div className="pt-32 pb-40 px-8 md:px-16 max-w-[1000px] mx-auto min-h-screen font-serif text-lg leading-relaxed text-[#1A1A1A]">
            <span className="block text-[10px] uppercase font-bold tracking-[0.3em] text-[#D4AF37] mb-6">{t('terms.badge')}</span>
            <h1 className="text-5xl md:text-6xl font-serif text-[#1A1A1A] mb-12">
                {t('terms.title')} <span className="italic text-[#D4AF37]">{t('terms.titleItalic')}</span>
            </h1>
            <p className="text-[#6C6863] italic mb-16">{t('terms.lastUpdated')}</p>
            
            <section className="mb-12">
                <h2 className="text-3xl font-serif mb-6 text-[#D4AF37]">{t('terms.sections.acceptance.title')}</h2>
                <p className="text-[#6C6863] leading-loose mb-4">
                    {t('terms.sections.acceptance.content')}
                </p>
            </section>

            <section className="mb-12">
                <h2 className="text-3xl font-serif mb-6 text-[#D4AF37]">{t('terms.sections.reservations.title')}</h2>
                <p className="text-[#6C6863] leading-loose mb-4">
                    {t('terms.sections.reservations.content')}
                </p>
            </section>
            
            <section className="mb-12">
                <h2 className="text-3xl font-serif mb-6 text-[#D4AF37]">{t('terms.sections.liability.title')}</h2>
                <p className="text-[#6C6863] leading-loose mb-4">
                    {t('terms.sections.liability.content')}
                </p>
            </section>
            
            <section className="mb-12">
                <h2 className="text-3xl font-serif mb-6 text-[#D4AF37]">{t('terms.sections.cancellation.title')}</h2>
                <p className="text-[#6C6863] leading-loose">
                    {t('terms.sections.cancellation.content')}
                </p>
            </section>
        </div>
    );
};
