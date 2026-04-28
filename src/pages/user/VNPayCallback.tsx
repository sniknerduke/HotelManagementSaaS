import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/ui/Button';

export const VNPayCallback: React.FC = () => {
    const [searchParams] = useSearchParams();
    const { toast } = useToast();
    const navigate = useNavigate();
    const [status, setStatus] = useState<'processing' | 'success' | 'failed'>('processing');

    useEffect(() => {
        // Normally, in a real application you would take the callback params
        // and send them to your backend to verify the signature and update the payment status.
        // For demonstration, we simply check a generic success code or just assume success.
        // E.g., vnp_ResponseCode === '00' is typically success in VNPay
        
        const responseCode = searchParams.get('vnp_ResponseCode');

        if (responseCode === '00') {
            setStatus('success');
            toast('Payment completed successfully!', 'success');
        } else if (responseCode) {
            setStatus('failed');
            toast('Payment failed or cancelled.', 'error');
        } else {
            // No response code, might be an invalid visit
            setStatus('failed');
            toast('Invalid payment callback.', 'error');
        }
    }, [searchParams, toast]);

    return (
        <div className="max-w-[1600px] mx-auto w-full px-8 md:px-16 pt-32 pb-40 min-h-[60vh] flex flex-col items-center justify-center">
            {status === 'processing' && (
                <div className="text-center space-y-6">
                    <h2 className="text-4xl font-serif text-[#1A1A1A]">Processing Payment...</h2>
                    <p className="text-[#6C6863]">Please wait while we verify your transaction.</p>
                </div>
            )}
            
            {status === 'success' && (
                <div className="text-center py-16 space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-[1000ms]">
                    <p className="text-[10px] uppercase font-bold tracking-[0.3em] text-[#D4AF37] mb-6">Payment Successful</p>
                    <h2 className="text-4xl lg:text-6xl font-serif text-[#1A1A1A] leading-[1.1]">
                        Thank you for your reservation.<br/><span className="italic text-[#6C6863]">We look forward to seeing you.</span>
                    </h2>
                    <div className="pt-12">
                        <Button onClick={() => navigate('/profile')} variant="secondary">View Your Stays</Button>
                    </div>
                </div>
            )}

            {status === 'failed' && (
                <div className="text-center py-16 space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-[1000ms]">
                    <p className="text-[10px] uppercase font-bold tracking-[0.3em] text-red-500 mb-6">Payment Failed</p>
                    <h2 className="text-4xl lg:text-6xl font-serif text-[#1A1A1A] leading-[1.1]">
                        We could not process your payment.<br/><span className="italic text-[#6C6863]">Please try again.</span>
                    </h2>
                    <div className="pt-12">
                        <Button onClick={() => navigate('/checkout')} variant="secondary">Return to Checkout</Button>
                    </div>
                </div>
            )}
        </div>
    );
};
