import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/ui/Button';

export const VNPayCallback: React.FC = () => {
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const { toast } = useToast();
    const navigate = useNavigate();
    const location = useLocation();
    const [status, setStatus] = useState<'processing' | 'success' | 'failed'>('processing');

    useEffect(() => {
        // Simulate a checking process before showing the final result
        const timer = setTimeout(() => {
            const isSuccess = location.pathname.includes('/payment/success');
            const isFailed = location.pathname.includes('/payment/failed');
            
            if (isSuccess) {
                setStatus('success');
                toast(t('vnpay.successBadge'), 'success');
            } else if (isFailed) {
                setStatus('failed');
                toast(t('vnpay.failedBadge'), 'error');
            } else {
                setStatus('failed');
                toast(t('vnpay.invalidToast'), 'error');
            }
        }, 2000); // 2 second mock verification delay

        return () => clearTimeout(timer);
    }, [location.pathname, toast]);

    return (
        <div className="max-w-[1600px] mx-auto w-full px-8 md:px-16 pt-32 pb-40 min-h-[60vh] flex flex-col items-center justify-center">
            {status === 'processing' && (
                <div className="text-center space-y-6">
                    <h2 className="text-4xl font-serif text-[#1A1A1A]">{t('vnpay.processing')}</h2>
                    <p className="text-[#6C6863]">{t('vnpay.wait')}</p>
                </div>
            )}
            
            {status === 'success' && (
                <div className="text-center py-16 space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-[1000ms]">
                    <p className="text-[10px] uppercase font-bold tracking-[0.3em] text-[#D4AF37] mb-6">{t('vnpay.successBadge')}</p>
                    <h2 className="text-4xl lg:text-6xl font-serif text-[#1A1A1A] leading-[1.1]">
                        {t('vnpay.successTitle')}<br/><span className="italic text-[#6C6863]">{t('vnpay.successSubtitle')}</span>
                    </h2>
                    {searchParams.get('reservationId') && (
                        <p className="text-[#6C6863] pt-6 font-serif italic">
                            {t('vnpay.reference')} <strong className="font-sans not-italic text-[#1A1A1A]">#RES-{searchParams.get('reservationId')}</strong>
                        </p>
                    )}
                    <div className="pt-12">
                        <Button onClick={() => navigate('/profile')} variant="secondary">{t('vnpay.viewStays')}</Button>
                    </div>
                </div>
            )}

            {status === 'failed' && (
                <div className="text-center py-16 space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-[1000ms]">
                    <p className="text-[10px] uppercase font-bold tracking-[0.3em] text-red-500 mb-6">{t('vnpay.failedBadge')}</p>
                    <h2 className="text-4xl lg:text-6xl font-serif text-[#1A1A1A] leading-[1.1]">
                        {t('vnpay.failedTitle')}<br/><span className="italic text-[#6C6863]">{t('vnpay.failedSubtitle')}</span>
                    </h2>
                    <div className="pt-12">
                        <Button onClick={() => navigate('/checkout')} variant="secondary">{t('vnpay.returnToCheckout')}</Button>
                    </div>
                </div>
            )}
        </div>
    );
};
