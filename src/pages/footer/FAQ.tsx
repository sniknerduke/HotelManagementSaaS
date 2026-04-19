import React from 'react';
import { useTranslation } from 'react-i18next';

export const FAQ: React.FC = () => {
    const { t } = useTranslation();

    const faqs = [
        {
            q: t('faq.questions.checkInOut.q'),
            a: t('faq.questions.checkInOut.a')
        },
        {
            q: t('faq.questions.parking.q'),
            a: t('faq.questions.parking.a')
        },
        {
            q: t('faq.questions.pets.q'),
            a: t('faq.questions.pets.a')
        },
        {
            q: t('faq.questions.shuttle.q'),
            a: t('faq.questions.shuttle.a')
        }
    ];

    return (
        <div className="pt-32 pb-40 px-8 md:px-16 max-w-[1200px] mx-auto min-h-screen">
            <span className="block text-[10px] uppercase font-bold tracking-[0.3em] text-[#D4AF37] mb-6">{t('faq.badge')}</span>
            <h1 className="text-5xl md:text-7xl font-serif text-[#1A1A1A] mb-16">
                {t('faq.title')} <span className="italic text-[#D4AF37]">{t('faq.titleItalic')}</span>
            </h1>
            
            <div className="divide-y divide-[#1A1A1A]/10">
                {faqs.map((faq, i) => (
                    <div key={i} className="py-12 flex flex-col md:flex-row gap-8">
                        <div className="md:w-1/3">
                            <h3 className="text-xl font-serif text-[#1A1A1A] leading-relaxed">{faq.q}</h3>
                        </div>
                        <div className="md:w-2/3">
                            <p className="text-lg text-[#6C6863] font-serif italic leading-loose">
                                {faq.a}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
