import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../components/ui/Button';
import { motion, type Variants } from 'framer-motion';

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 1, ease: [0.25, 0.1, 0.25, 1] } 
  }
};

const staggerContainer: Variants = {
  hidden: { opacity: 1 },
  visible: {
    transition: { staggerChildren: 0.2 }
  }
};

export const Contact: React.FC = () => {
    const { t } = useTranslation();
    // Form submission handler
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Trigger API call to backend service
        console.log('Form submitted');
    };

    return (
        <div className="pt-24 pb-40 bg-[#F9F8F6]">
            {/* Hero Section */}
            <div className="relative w-full h-[50vh] min-h-[400px] flex items-center justify-center bg-[#1A1A1A]">
                <div className="absolute inset-0 z-0 overflow-hidden">
                    <img 
                        src="https://images.unsplash.com/photo-1551882547-ff40c0d5b5df?q=80&w=2560&auto=format&fit=crop" 
                        alt="Contact Us" 
                        className="w-full h-full object-cover scale-105 grayscale-[30%] opacity-40" 
                    />
                </div>
                <motion.div 
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                    className="relative z-10 text-center flex flex-col items-center justify-center w-full px-8"
                >
                    <motion.span variants={fadeInUp} className="block text-[10px] uppercase font-bold tracking-[0.3em] text-[#D4AF37] mb-6">{t('contact.hero.subtitle')}</motion.span>
                    <motion.h1 variants={fadeInUp} className="text-7xl md:text-[8rem] lg:text-[10rem] tracking-tight leading-[0.9] font-serif mb-6 text-[#F9F8F6] drop-shadow-xl">
                        {t('contact.hero.title')} <span className="italic text-[#D4AF37]">{t('contact.hero.titleItalic')}</span>
                    </motion.h1>
                </motion.div>
            </div>

            <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
                className="max-w-[1600px] mx-auto px-8 md:px-16 pt-24 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 overflow-hidden"
            >
                
                {/* Left Column: Form */}
                <motion.div variants={fadeInUp}>
                    <h2 className="text-3xl lg:text-4xl font-serif text-[#1A1A1A] mb-8">{t('contact.form.title')} <span className="italic text-[#D4AF37]">{t('contact.form.titleItalic')}</span></h2>
                    
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="flex flex-col">
                                <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#6C6863] mb-2">{t('contact.form.fullName')}</label>
                                <input type="text" required className="w-full bg-transparent border-b border-[#1A1A1A]/20 py-3 outline-none focus:border-[#D4AF37] transition-colors font-serif text-lg text-[#1A1A1A]" placeholder="Jane Doe" />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#6C6863] mb-2">{t('contact.form.email')}</label>
                                <input type="email" required className="w-full bg-transparent border-b border-[#1A1A1A]/20 py-3 outline-none focus:border-[#D4AF37] transition-colors font-serif text-lg text-[#1A1A1A]" placeholder="jane@example.com" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="flex flex-col">
                                <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#6C6863] mb-2">{t('contact.form.phone')} <span className="lowercase normal-case font-normal">{t('contact.form.optional')}</span></label>
                                <input type="tel" className="w-full bg-transparent border-b border-[#1A1A1A]/20 py-3 outline-none focus:border-[#D4AF37] transition-colors font-serif text-lg text-[#1A1A1A]" placeholder="+1 (234) 567-8900" />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#6C6863] mb-2">{t('contact.form.subject.label')}</label>
                                <div className="relative">
                                    <select required className="w-full bg-transparent border-b border-[#1A1A1A]/20 py-3 pr-8 outline-none focus:border-[#D4AF37] transition-colors font-serif text-lg text-[#1A1A1A] appearance-none cursor-pointer relative z-10">
                                        <option value="General Inquiry" className="font-serif bg-[#F9F8F6] text-[#1A1A1A] pl-4 py-2">{t('contact.form.subject.general')}</option>
                                        <option value="Reservation Modification" className="font-serif bg-[#F9F8F6] text-[#1A1A1A] pl-4 py-2">{t('contact.form.subject.modification')}</option>
                                        <option value="Feedback" className="font-serif bg-[#F9F8F6] text-[#1A1A1A] pl-4 py-2">{t('contact.form.subject.feedback')}</option>
                                        <option value="Other" className="font-serif bg-[#F9F8F6] text-[#1A1A1A] pl-4 py-2">{t('contact.form.subject.other')}</option>
                                    </select>
                                    <svg className="w-4 h-4 text-[#1A1A1A]/50 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none z-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col">
                            <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#6C6863] mb-2">{t('contact.form.message')}</label>
                            <textarea required rows={6} className="w-full bg-transparent border-b border-[#1A1A1A]/20 py-3 outline-none focus:border-[#D4AF37] transition-colors font-serif text-lg text-[#1A1A1A] resize-none" placeholder={t('contact.form.placeholder')}></textarea>
                        </div>

                        <Button type="submit" className="bg-[#1A1A1A] hover:bg-[#D4AF37] text-[#F9F8F6] hover:text-[#1A1A1A] transition-colors duration-500 shadow-none border-none tracking-[0.3em] px-12 py-5 text-xs w-full lg:w-auto mt-4">
                            {t('contact.form.submit')}
                        </Button>
                    </form>
                </motion.div>

                {/* Right Column: Info & Map */}
                <motion.div variants={fadeInUp} className="space-y-12">
                    
                    {/* Location Block */}
                    <div>
                        <h3 className="text-xs md:text-sm uppercase font-bold tracking-[0.3em] text-[#D4AF37] mb-6 pb-2 border-b border-[#1A1A1A]/10">{t('contact.info.location')}</h3>
                        
                        <div className="mb-8">
                            <h4 className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#6C6863] mb-3">{t('contact.info.addressTitle')}</h4>
                            <p className="font-serif text-xl text-[#1A1A1A] leading-relaxed">124 Luxury Avenue<br/>Historic District, Metropolis 10001</p>
                        </div>
                        
                        {/* Embedded Interactive Map (Google Maps iframe) */}
                        <div className="w-full h-[300px] bg-[#1A1A1A]/5 mb-8 relative grayscale hover:grayscale-0 transition-all duration-700 border border-[#1A1A1A]/10">
                            <iframe 
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.15830869428!2d-74.119763973046!3d40.69766374874431!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2s!4v1698263152917!5m2!1sen!2s" 
                                width="100%" 
                                height="100%" 
                                style={{ border: 0 }} 
                                allowFullScreen={true} 
                                loading="lazy" 
                                referrerPolicy="no-referrer-when-downgrade"
                                className="absolute inset-0"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h4 className="text-xs uppercase tracking-[0.1em] font-bold text-[#1A1A1A] mb-4">{t('contact.info.transitHubs')}</h4>
                                <ul className="text-[#6C6863] space-y-4 text-sm font-serif italic">
                                    <li>
                                        <strong className="font-sans not-italic uppercase text-[10px] text-[#1A1A1A] block mb-1">{t('contact.info.airport')}</strong>
                                        {t('contact.info.airportDesc')}
                                    </li>
                                    <li>
                                        <strong className="font-sans not-italic uppercase text-[10px] text-[#1A1A1A] block mb-1">{t('contact.info.train')}</strong>
                                        {t('contact.info.trainDesc')}
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="text-xs uppercase tracking-[0.1em] font-bold text-[#1A1A1A] mb-4">{t('contact.info.nearbyLandmarks')}</h4>
                                <ul className="text-[#6C6863] space-y-2 text-sm font-serif italic">
                                    <li>• {t('contact.info.landmark1')}</li>
                                    <li>• {t('contact.info.landmark2')}</li>
                                    <li>• {t('contact.info.landmark3')}</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Contact Info Block */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                        <div>
                            <h3 className="text-xs md:text-sm uppercase font-bold tracking-[0.3em] text-[#D4AF37] mb-6 pb-2 border-b border-[#1A1A1A]/10">{t('contact.info.direct')}</h3>
                            <div className="space-y-5">
                                <div>
                                    <p className="text-[10px] uppercase font-bold tracking-[0.1em] text-[#6C6863]">{t('contact.info.frontDesk')} <span className="lowercase normal-case tracking-normal">(24/7)</span></p>
                                    <a href="tel:+15551234567" className="font-serif text-lg text-[#1A1A1A] hover:text-[#D4AF37] transition-colors">+1 (555) 123-4567</a>
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase font-bold tracking-[0.1em] text-[#6C6863]">{t('contact.info.reservations')}</p>
                                    <a href="tel:+15559876543" className="font-serif text-lg text-[#1A1A1A] hover:text-[#D4AF37] transition-colors">+1 (555) 987-6543</a>
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase font-bold tracking-[0.1em] text-[#6C6863]">{t('contact.info.email')}</p>
                                    <a href="mailto:info@thelumiere.com" className="font-serif text-lg text-[#1A1A1A] hover:text-[#D4AF37] transition-colors">info@thelumiere.com</a>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xs md:text-sm uppercase font-bold tracking-[0.3em] text-[#D4AF37] mb-6 pb-2 border-b border-[#1A1A1A]/10">{t('contact.info.support')}</h3>
                            <div className="space-y-4 flex flex-col">
                                <a href="#" className="font-serif text-lg text-[#1A1A1A] hover:text-[#D4AF37] transition-colors flex items-center gap-3">
                                    <svg className="w-5 h-5 text-[#1A1A1A]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="1.5" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                    {t('contact.info.faq')}
                                </a>
                                <a href="#" className="font-serif text-lg text-[#1A1A1A] hover:text-[#D4AF37] transition-colors flex items-center gap-3">
                                    <svg className="w-5 h-5 text-[#1A1A1A]/50" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                                    {t('contact.info.instagram')}
                                </a>
                                <a href="#" className="font-serif text-lg text-[#1A1A1A] hover:text-[#D4AF37] transition-colors flex items-center gap-3">
                                    <svg className="w-5 h-5 text-[#1A1A1A]/50" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                                    {t('contact.info.twitter')}
                                </a>
                            </div>
                        </div>
                    </div>

                </motion.div>
            </motion.div>
        </div>
    );
};