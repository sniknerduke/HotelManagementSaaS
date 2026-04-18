import React from 'react';

export const PrivacyPolicy: React.FC = () => {
    return (
        <div className="pt-32 pb-40 px-8 md:px-16 max-w-[1000px] mx-auto min-h-screen font-serif text-lg leading-relaxed text-[#1A1A1A]">
            <h1 className="text-5xl md:text-6xl font-serif text-[#1A1A1A] mb-12">
                Privacy <span className="italic text-[#D4AF37]">Policy.</span>
            </h1>
            <p className="text-[#6C6863] italic mb-16">Last updated: April 2026</p>
            
            <section className="mb-12">
                <h2 className="text-3xl font-serif mb-6 text-[#D4AF37]">Information We Collect</h2>
                <p className="text-[#6C6863] leading-loose mb-4">
                    The Lumière Estate is committed to safeguarding your privacy. We meticulously collect and process only the fundamental personal information necessary to offer unparalleled hospitality. This includes your contact details to secure your reservation, government-issued identification upon arrival, and any special preferences you share with our concierge team.
                </p>
                <p className="text-[#6C6863] leading-loose">
                    In addition to securing your stay, we gather payment data, which is heavily encrypted and tokenized.
                </p>
            </section>
            
            <section className="mb-12">
                <h2 className="text-3xl font-serif mb-6 text-[#D4AF37]">How Your Data Is Secured</h2>
                <p className="text-[#6C6863] leading-loose mb-4">
                    Your luxury experience seamlessly extends to the digital realm. We implement robust, military-grade encryption procedures and strictly restrict internal access to guest data strictly to authorized personnel. We do not sell or rent our guest rosters to third parties.
                </p>
            </section>

            <section className="mb-12">
                <h2 className="text-3xl font-serif mb-6 text-[#D4AF37]">Cookies & Tracking</h2>
                <p className="text-[#6C6863] leading-loose">
                    Our digital platform utilizes minimal cookies aimed primarily at streamlining performance and tracking analytics for continuous improvement of our guest-facing interfaces.
                </p>
            </section>
        </div>
    );
};
