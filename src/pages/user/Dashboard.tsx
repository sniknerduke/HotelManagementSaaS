import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '../../components/ui/Card';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { BookingService, PaymentService } from '../../api';

export const Dashboard: React.FC = () => {
    const { t } = useTranslation();
    const { user } = useAuth();
    const { toast } = useToast();
    
    const [bookings, setBookings] = useState<any[]>([]);
    const [isFetching, setIsFetching] = useState(false);

    useEffect(() => {
        if (user?.id && !isFetching) {
            setIsFetching(true);
            BookingService.getUserBookings(user.id)
                .then((res: any[]) => setBookings(res))
                .catch((err) => console.error('Failed to fetch bookings', err))
                .finally(() => setIsFetching(false));
        }
    }, [user]);

    const handleCancelReservation = async (id: number) => {
        if (!window.confirm("Cancel this reservation?")) return;
        try {
            await BookingService.cancelBooking(id);
            toast('Reservation cancelled successfully', 'success');
            setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'CANCELLED' } : b));
        } catch (err: any) {
            toast(err.message || 'Failed to cancel reservation.', 'error');
        }
    };

    const handleViewReceipt = async (reservationId: number) => {
        try {
            const receipt = await PaymentService.getPaymentByReservation(reservationId);
            alert(`Receipt for BKG-${reservationId}\n\nAmount: $${receipt.amount}\nStatus: ${receipt.status}\nMethod: ${receipt.paymentMethod || 'Credit Card'}\nDate: ${new Date(receipt.createdAt || Date.now()).toLocaleDateString()}`);
        } catch (err: any) {
            toast(err.message || 'Receipt not found', 'error');
        }
    };

    const totalStays = bookings.filter(b => b.status === 'COMPLETED').length;
    const upcoming = bookings.filter(b => b.status === 'PENDING' || b.status === 'CONFIRMED').length;
    const totalSpent = bookings.filter(b => b.status !== 'CANCELLED').reduce((sum, b) => sum + (b.totalPrice || 0), 0);

    return (
        <div className="max-w-[1600px] mx-auto w-full pt-16 md:pt-32 pb-40 px-8 md:px-16 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-x-12">
            
            {/* Sidebar nav for Staff Dashboard */}
            <div className="lg:col-span-3 border-r border-[#1A1A1A]/10 pr-8 min-h-screen">
                <h1 className="text-3xl md:text-5xl font-serif text-[#1A1A1A] mb-12">
                    <span className="italic">Lumière</span><br />
                    {t('dashboard.title')}
                </h1>
                
                <nav className="flex flex-col space-y-2 mt-20 text-xs uppercase tracking-[0.2em] font-medium text-[#6C6863]">
                    <a href="#" className="py-4 border-t border-[#1A1A1A]/10 text-[#1A1A1A] hover:text-[#D4AF37] transition-colors relative after:-left-4 after:top-1/2 after:-translate-y-1/2 after:absolute after:h-px after:w-2 after:bg-[#D4AF37]">{t('dashboard.nav.overview')}</a>
                    <a href="#" className="py-4 border-t border-[#1A1A1A]/10 hover:text-[#D4AF37] transition-colors">{t('dashboard.nav.reservations')}</a>
                    <a href="#" className="py-4 border-t border-[#1A1A1A]/10 hover:text-[#D4AF37] transition-colors">{t('dashboard.nav.inventory')}</a>
                    <a href="#" className="py-4 border-t border-[#1A1A1A]/10 hover:text-[#D4AF37] transition-colors hover:bg-transparent">{t('dashboard.nav.guests')}</a>
                    <a href="#" className="py-4 border-t border-[#1A1A1A]/10 hover:text-[#D4AF37] transition-colors border-b">{t('dashboard.nav.settings')}</a>
                </nav>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-8 lg:col-start-5 space-y-16">
                <div>
                    <h2 className="text-[#1A1A1A] font-serif text-3xl mb-8">{t('dashboard.metrics.title')} <span className="italic text-[#D4AF37]">{t('dashboard.metrics.titleItalic')}</span></h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                        <Card className="py-8 border-t border-[#1A1A1A]/20 shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-shadow duration-[700ms]">
                            <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#6C6863] mb-4">Total Stays</p>
                            <p className="text-4xl md:text-6xl font-serif">{totalStays}</p>
                        </Card>
                        <Card className="py-8 border-t border-[#1A1A1A]/20 shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-shadow duration-[700ms]">
                            <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#6C6863] mb-4">Upcoming</p>
                            <p className="text-4xl md:text-6xl font-serif text-[#D4AF37]">{upcoming}</p>
                        </Card>
                        <Card className="py-8 border-t border-[#1A1A1A]/20 shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-shadow duration-[700ms]">
                            <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#6C6863] mb-4">Total Spent</p>
                            <p className="text-4xl md:text-6xl font-serif">${totalSpent}</p>
                        </Card>
                    </div>
                </div>

                <div className="pt-8">
                    <div className="flex justify-between items-end mb-8 border-b border-[#1A1A1A]/20 pb-4">
                         <h3 className="font-serif text-[#1A1A1A] text-2xl">{t('dashboard.recent.title')}</h3>
                         <a href="#" className="uppercase text-[10px] tracking-[0.2em] font-medium text-[#6C6863] hover:text-[#D4AF37] transition-colors pb-1">{t('dashboard.recent.viewAll')}</a>
                    </div>
                    
                    <table className="w-full text-left font-sans text-sm text-[#1A1A1A] border-collapse">
                        <thead>
                            <tr className="border-b border-[#1A1A1A]/10 text-[10px] uppercase tracking-[0.25em] text-[#6C6863]">
                                <th className="pb-4 font-normal">Booking</th>
                                <th className="pb-4 font-normal">{t('dashboard.table.dates')}</th>
                                <th className="pb-4 font-normal">{t('dashboard.table.residence')}</th>
                                <th className="pb-4 font-normal">{t('dashboard.table.status')}</th>
                                <th className="pb-4 font-normal text-right">{t('dashboard.table.action')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#1A1A1A]/5">
                            {bookings.map(b => (
                                <tr key={b.id} className="group hover:bg-[#F9F8F6]/80 transition-colors duration-[700ms]">
                                    <td className="py-6 font-serif italic group-hover:text-[#D4AF37] transition-colors duration-500">BKG-{b.id}</td>
                                    <td className="py-6 text-[#6C6863]">{b.checkInDate} to {b.checkOutDate}</td>
                                    <td className="py-6 text-[#6C6863]">Room {b.roomId}</td>
                                    <td className="py-6"><span className={`px-3 py-1 text-[10px] uppercase tracking-[0.1em] ${b.status === 'PENDING' ? 'bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20' : 'bg-[#1A1A1A] text-white'}`}>{b.status}</span></td>
                                    <td className="py-6 text-right space-x-3">
                                        {['PENDING', 'CONFIRMED'].includes(b.status) && (
                                            <button onClick={() => handleCancelReservation(b.id)} className="text-[10px] uppercase tracking-[0.2em] text-red-600 hover:text-red-800 underline underline-offset-4">Cancel</button>
                                        )}
                                        {['COMPLETED', 'CONFIRMED', 'CHECKED_IN'].includes(b.status) && (
                                            <button onClick={() => handleViewReceipt(b.id)} className="text-[10px] uppercase tracking-[0.2em] text-[#6C6863] hover:text-[#1A1A1A] underline underline-offset-4">Receipt</button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {bookings.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="py-8 text-center text-[#6C6863] italic">No reservations found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
