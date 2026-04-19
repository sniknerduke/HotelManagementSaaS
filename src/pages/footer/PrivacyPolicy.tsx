import React from 'react';
import { useTranslation } from 'react-i18next';

export const PrivacyPolicy: React.FC = () => {
    const { t } = useTranslation();

    return (
        <div className="pt-32 pb-40 px-8 md:px-16 max-w-[1000px] mx-auto min-h-screen font-serif text-lg leading-relaxed text-[#1A1A1A]">
            <h1 className="text-5xl md:text-6xl font-serif text-[#1A1A1A] mb-12">
                {t('privacy.title')} <span className="italic text-[#D4AF37]">{t('privacy.titleItalic')}</span>
            </h1>
            <p className="text-[#6C6863] italic mb-16">{t('privacy.lastUpdated')}</p>
            
            <section className="mb-12">
                <h2 className="text-3xl font-serif mb-6 text-[#D4AF37]">{t('privacy.sections.collect.title')}</h2>
                <p className="text-[#6C6863] leading-loose mb-4">
                    {t('privacy.sections.collect.p1')}
                </p>
                <p className="text-[#6C6863] leading-loose">
                    {t('privacy.sections.collect.p2')}
                </p>
            </section>
            
            <section className="mb-12">
                <h2 className="text-3xl font-serif mb-6 text-[#D4AF37]">{t('privacy.sections.security.title')}</h2>
                <p className="text-[#6C6863] leading-loose mb-4">
                    {t('privacy.sections.security.content')}
                </p>
            </section>

            <section className="mb-12">
                <h2 className="text-3xl font-serif mb-6 text-[#D4AF37]">{t('privacy.sections.cookies.title')}</h2>
                <p className="text-[#6C6863] leading-loose">
                    {t('privacy.sections.cookies.content')}
                </p>
            </section>
        </div>
    );
};
