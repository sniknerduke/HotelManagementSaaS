import React from 'react';

export const TermsOfService: React.FC = () => {
    return (
        <div className="pt-32 pb-40 px-8 md:px-16 max-w-[1000px] mx-auto min-h-screen font-serif text-lg leading-relaxed text-[#1A1A1A]">
            <span className="block text-[10px] uppercase font-bold tracking-[0.3em] text-[#D4AF37] mb-6">Legal Agreement</span>
            <h1 className="text-5xl md:text-6xl font-serif text-[#1A1A1A] mb-12">
                Terms of <span className="italic text-[#D4AF37]">Service.</span>
            </h1>
            <p className="text-[#6C6863] italic mb-16">Last updated: April 2026</p>
            
            <section className="mb-12">
                <h2 className="text-3xl font-serif mb-6 text-[#D4AF37]">1. Acceptance of Terms</h2>
                <p className="text-[#6C6863] leading-loose mb-4">
                    By booking a reservation with The Lumière Estate, accessing our digital platforms, or partaking in our services, you expressly agree to abide by and be bound by the forthcoming terms. Failure to adhere to these terms grants our management the right to terminate your reservation without refund.
                </p>
            </section>

            <section className="mb-12">
                <h2 className="text-3xl font-serif mb-6 text-[#D4AF37]">2. Reservations & Payment Policies</h2>
                <p className="text-[#6C6863] leading-loose mb-4">
                    A valid credit card is strictly required to guarantee all reservations. A pre-authorization charge equivalent to the first night's room and tax will be processed 72 hours prior to arrival. Should this authorization fail, our luxury concierge will attempt to contact you; otherwise, the reservation may be respectfully released.
                </p>
            </section>
            
            <section className="mb-12">
                <h2 className="text-3xl font-serif mb-6 text-[#D4AF37]">3. Liability Protocol</h2>
                <p className="text-[#6C6863] leading-loose mb-4">
                    The Lumière assumes no responsibility for lost, damaged, or stolen personal items left unattended inside guest quarters or public areas. We strongly encourage the use of our in-room complimentary secure safe deposit boxes for all luxury goods, cash, and significant documentation. 
                </p>
            </section>
            
            <section className="mb-12">
                <h2 className="text-3xl font-serif mb-6 text-[#D4AF37]">4. Cancellation Architecture</h2>
                <p className="text-[#6C6863] leading-loose">
                    To avoid a cancellation penalty equivalent to one full room night plus tax, reservations must exclusively be canceled or modified by 4:00 PM local property time at least 48 hours prior to your scheduled arrival. Peak luxury season non-refundable bookings are an exception to this leniency.
                </p>
            </section>
        </div>
    );
};