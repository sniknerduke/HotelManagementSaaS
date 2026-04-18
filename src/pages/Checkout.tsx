import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

export const Checkout: React.FC = () => {
    const { t } = useTranslation();
    const [step, setStep] = useState<1 | 2 | 3>(1);

    const handleNext = () => setStep(s => Math.min(s + 1, 3) as 1 | 2 | 3);
    const handlePrev = () => setStep(s => Math.max(s - 1, 1) as 1 | 2 | 3);

    return (
        <div className="max-w-[1600px] mx-auto w-full px-8 md:px-16 pt-24 pb-40">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-x-12">
                
                {/* Left Area: Stepper & Forms */}
                <div className="lg:col-span-7 space-y-16">
                    <h1 className="text-6xl md:text-7xl lg:text-8xl font-serif text-[#1A1A1A] mb-12">
                        {t('checkout.title')} <span className="italic text-[#D4AF37]">{t('checkout.titleItalic')}</span>
                    </h1>

                    {/* Progress Indicator */}
                    <div className="flex items-center gap-4 text-[10px] uppercase tracking-[0.2em] font-medium text-[#6C6863] border-b border-[#1A1A1A]/10 pb-6 mb-12">
                         <span className={step >= 1 ? "text-[#1A1A1A]" : ""}>{t('checkout.steps.details')}</span>
                         <span className="w-12 h-px bg-[#1A1A1A]/20"></span>
                         <span className={step >= 2 ? "text-[#1A1A1A]" : ""}>{t('checkout.steps.payment')}</span>
                         <span className="w-12 h-px bg-[#1A1A1A]/20 hidden sm:block"></span>
                         <span className={step >= 3 ? "text-[#1A1A1A] hidden sm:block" : "hidden sm:block"}>{t('checkout.steps.confirmation')}</span>
                    </div>

                    {step === 1 && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <h2 className="text-2xl font-serif text-[#1A1A1A] mb-8 border-b border-[#1A1A1A]/10 pb-4">{t('checkout.guestInfo.title')}</h2>
                            <div className="grid grid-cols-2 gap-6">
                                <Input label={t('checkout.guestInfo.firstName')} placeholder="John" />
                                <Input label={t('checkout.guestInfo.lastName')} placeholder="Doe" />
                            </div>
                            <Input label={t('checkout.guestInfo.email')} type="email" placeholder="john.doe@example.com" />
                            <Input label={t('checkout.guestInfo.phone')} type="tel" placeholder="+1 (555) 000-0000" />
                            
                            <div className="pt-8 flex justify-end">
                                <Button onClick={handleNext} className="w-full sm:w-auto">{t('checkout.guestInfo.continue')}</Button>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <h2 className="text-2xl font-serif text-[#1A1A1A] mb-8 border-b border-[#1A1A1A]/10 pb-4">{t('checkout.paymentDetails.title')}</h2>
                            <Card className="p-6 border border-[#1A1A1A]/20 shadow-[0_4px_16px_rgba(0,0,0,0.02)] bg-[#F9F8F6]/50">
                               <div className="space-y-6">
                                  <Input label={t('checkout.paymentDetails.cardholder')} placeholder="John Doe" />
                                  <Input label={t('checkout.paymentDetails.cardNumber')} placeholder="0000 0000 0000 0000" />
                                  <div className="grid grid-cols-2 gap-6">
                                      <Input label={t('checkout.paymentDetails.expiry')} placeholder="MM/YY" />
                                      <Input label={t('checkout.paymentDetails.cvc')} placeholder="CVC" />
                                  </div>
                               </div>
                            </Card>

                            <p className="text-[10px] text-[#6C6863] uppercase tracking-[0.1em] text-center mt-6">
                                {t('checkout.paymentDetails.secure')}
                            </p>
                            
                            <div className="pt-8 flex justify-between">
                                <Button variant="ghost" onClick={handlePrev} className="hidden sm:flex text-[#6C6863] hover:text-[#1A1A1A]">{t('checkout.paymentDetails.back')}</Button>
                                <Button onClick={handleNext} className="w-full sm:w-auto bg-[#D4AF37] hover:bg-[#1A1A1A] text-white">{t('checkout.paymentDetails.confirm')}</Button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="text-center py-16 space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-[1000ms]">
                            <p className="text-[10px] uppercase font-bold tracking-[0.3em] text-[#D4AF37] mb-6">{t('checkout.confirmation.status')}</p>
                            <h2 className="text-4xl lg:text-6xl font-serif text-[#1A1A1A] leading-[1.1]">
                                {t('checkout.confirmation.thanks')}<br/><span className="italic text-[#6C6863]">{t('checkout.confirmation.thanksItalic')}</span>
                            </h2>
                            <p className="text-[#6C6863] pt-6 font-serif italic">{t('checkout.confirmation.reference')} <strong className="font-sans not-italic text-[#1A1A1A]">#RES-10492</strong></p>
                            <div className="pt-12">
                                <Button onClick={() => window.location.href = '/profile'} variant="secondary">{t('checkout.confirmation.viewStays')}</Button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Area: Order Summary */}
                <div className="lg:col-span-4 lg:col-start-9 md:sticky md:top-36 h-max">
                    <Card variant="featured" className="py-8 bg-white/80 backdrop-blur-sm -mx-4 md:mx-0 shadow-[0_8px_32px_rgba(0,0,0,0.06)] border-t-[6px]">
                         <h3 className="text-[10px] uppercase font-bold tracking-[0.3em] text-[#1A1A1A] mb-8 pb-4 border-b border-[#1A1A1A]/10">{t('checkout.summary.title')}</h3>
                         
                         <div className="aspect-[4/3] w-full overflow-hidden mb-6 relative">
                            <img src="https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&auto=format&fit=crop&q=60" alt="The Grand Suite" className="w-full h-full object-cover grayscale opacity-90 transition-all duration-[2000ms] hover:grayscale-0 hover:scale-105" />
                            <div className="absolute inset-0 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.04)] pointer-events-none"></div>
                         </div>
                         
                         <h4 className="text-2xl font-serif text-[#1A1A1A] mb-2">The Grand Suite</h4>
                         <p className="text-xs text-[#6C6863] mb-6 pb-6 border-b border-[#1A1A1A]/10">Oct 12 - Oct 15, 2026 • 2 Guests</p>

                         <div className="space-y-4 text-sm font-medium">
                             <div className="flex justify-between items-center text-[#6C6863]">
                                 <span>{t('checkout.summary.nights', { count: 3, price: 450 })}</span>
                                 <span className="text-[#1A1A1A] font-serif">$1,350</span>
                             </div>
                             <div className="flex justify-between items-center text-[#6C6863]">
                                 <span>{t('checkout.summary.taxes')}</span>
                                 <span className="text-[#1A1A1A] font-serif">$142</span>
                             </div>
                         </div>

                         <div className="mt-8 pt-6 border-t border-[#1A1A1A]/20 flex justify-between items-end">
                             <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#1A1A1A]">{t('checkout.summary.total')}</span>
                             <span className="text-3xl font-serif text-[#D4AF37]">$1,492</span>
                         </div>
                    </Card>
                </div>

            </div>
        </div>
    );
};
