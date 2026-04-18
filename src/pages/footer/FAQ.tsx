import React from 'react';

export const FAQ: React.FC = () => {
    const faqs = [
        {
            q: "What is your standard check-in and check-out time?",
            a: "Our standard check-in begins at 3:00 PM, and check-out is at 11:00 AM. Early check-in or late check-out requests are subject to availability and may incur an additional fee."
        },
        {
            q: "Is parking available on property?",
            a: "Yes, we exclusively provide a secure 24-hour valet parking service to all our guests for an additional nightly rate. Self-parking is not available."
        },
        {
            q: "Do you accommodate pets?",
            a: "We welcome well-behaved dogs under exactly 25 lbs in select rooms with a non-refundable pet cleaning fee. Service animals are exempt from restrictions."
        },
        {
            q: "Is an airport shuttle service provided?",
            a: "We offer bespoke chauffeur-driven luxury transfers from Metropolis International Airport. This service must be reserved at least 48 hours prior to arrival."
        }
    ];

    return (
        <div className="pt-32 pb-40 px-8 md:px-16 max-w-[1200px] mx-auto min-h-screen">
            <span className="block text-[10px] uppercase font-bold tracking-[0.3em] text-[#D4AF37] mb-6">Guest Policies</span>
            <h1 className="text-5xl md:text-7xl font-serif text-[#1A1A1A] mb-16">
                Frequently Asked <span className="italic text-[#D4AF37]">Questions.</span>
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
