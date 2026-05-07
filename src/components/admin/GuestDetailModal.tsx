import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { BookingService, AuthService } from '../../api';
import { useToast } from '../../context/ToastContext';

interface GuestDetailModalProps {
    guest: any;
    isOpen: boolean;
    onClose: () => void;
    onUpdate: () => void;
}

export const GuestDetailModal: React.FC<GuestDetailModalProps> = ({ guest, isOpen, onClose, onUpdate }) => {
    const { toast } = useToast();
    const [stays, setStays] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [internalNotes, setInternalNotes] = useState(guest?.internalNotes || '');
    const [isVip, setIsVip] = useState(guest?.isVip || false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (isOpen && guest) {
            fetchStays();
            setInternalNotes(guest.internalNotes || '');
            setIsVip(guest.isVip || false);
        }
    }, [isOpen, guest]);

    const fetchStays = async () => {
        setIsLoading(true);
        try {
            const res = await BookingService.getUserBookings(guest.id);
            setStays(res);
        } catch (error) {
            console.error('Failed to fetch guest stays', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveCRM = async () => {
        setIsSaving(true);
        try {
            await AuthService.updateUserCRM(guest.id, {
                internalNotes,
                isVip
            });
            toast('Guest CRM profile updated.', 'success');
            onUpdate();
        } catch (error: any) {
            toast(error.message || 'Failed to update CRM profile', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const successfulStays = stays.filter(s => s.status !== 'CANCELLED' && s.status !== 'NO_SHOW');

    const totalSpend = successfulStays.reduce((acc, curr) => acc + (Number(curr.totalPrice) || 0), 0);
    const totalNights = successfulStays.reduce((acc, curr) => {
        if (!curr.checkInDate || !curr.checkOutDate) return acc;
        const start = new Date(curr.checkInDate);
        const end = new Date(curr.checkOutDate);
        if (isNaN(start.getTime()) || isNaN(end.getTime())) return acc;
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return acc + diffDays;
    }, 0);

    if (!guest) return null;

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose} 
            title={`Guest Profile: ${guest.firstName} ${guest.lastName}`}
            className="max-w-5xl"
        >
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Left Side: CRM Details */}
                <div className="lg:w-1/3 space-y-6">
                    <Card className="p-6 border border-[#1A1A1A]/10 bg-[#F9F8F6]">
                        <h3 className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#1A1A1A] mb-4 border-b border-[#1A1A1A]/10 pb-2">Core Profile</h3>
                        <div className="space-y-4">
                            <div>
                                <p className="text-[9px] uppercase font-bold text-[#6C6863] tracking-widest">Email Address</p>
                                <p className="text-sm font-serif text-[#1A1A1A]">{guest.email}</p>
                            </div>
                            <div>
                                <p className="text-[9px] uppercase font-bold text-[#6C6863] tracking-widest">Phone Number</p>
                                <p className="text-sm font-serif text-[#1A1A1A]">{guest.phoneNumber || 'Not provided'}</p>
                            </div>
                            <div>
                                <p className="text-[9px] uppercase font-bold text-[#6C6863] tracking-widest">Member Since</p>
                                <p className="text-sm font-serif text-[#1A1A1A]">{guest.createdAt ? new Date(guest.createdAt).toLocaleDateString() : 'N/A'}</p>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6 border border-[#1A1A1A]/10 bg-white">
                        <h3 className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#1A1A1A] mb-4 border-b border-[#1A1A1A]/10 pb-2">Internal Management</h3>
                        <div className="space-y-4">
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <input 
                                    type="checkbox" 
                                    checked={isVip} 
                                    onChange={(e) => setIsVip(e.target.checked)}
                                    className="w-4 h-4 accent-[#D4AF37]"
                                />
                                <span className={`text-xs uppercase font-bold tracking-widest ${isVip ? 'text-[#D4AF37]' : 'text-[#6C6863]'}`}>VIP GUEST STATUS</span>
                            </label>

                            <div>
                                <label className="text-[9px] uppercase font-bold text-[#6C6863] tracking-widest block mb-2">Staff Notes</label>
                                <textarea 
                                    value={internalNotes}
                                    onChange={(e) => setInternalNotes(e.target.value)}
                                    placeholder="Add private internal notes about guest preferences, behavior, or history..."
                                    className="w-full h-32 p-3 text-sm font-serif border border-[#1A1A1A]/10 bg-[#F9F8F6] outline-none focus:border-[#D4AF37] transition-colors resize-none"
                                />
                            </div>

                            <Button 
                                onClick={handleSaveCRM} 
                                variant="primary" 
                                className="w-full bg-[#1A1A1A] text-white h-10 text-[10px] uppercase tracking-widest"
                                disabled={isSaving}
                            >
                                {isSaving ? 'Saving...' : 'Update CRM Data'}
                            </Button>
                        </div>
                    </Card>
                </div>

                {/* Right Side: History & Stats */}
                <div className="flex-1 space-y-6">
                    <div className="grid grid-cols-3 gap-4">
                        <Card className="p-4 border border-[#1A1A1A]/10 bg-white text-center">
                            <p className="text-[9px] uppercase font-bold text-[#6C6863] tracking-widest mb-1">Lifetime Stays</p>
                            <p className="text-2xl font-serif text-[#1A1A1A]">{successfulStays.length}</p>
                        </Card>
                        <Card className="p-4 border border-[#1A1A1A]/10 bg-white text-center">
                            <p className="text-[9px] uppercase font-bold text-[#6C6863] tracking-widest mb-1">Total Nights</p>
                            <p className="text-2xl font-serif text-[#1A1A1A]">{totalNights}</p>
                        </Card>
                        <Card className="p-4 border-none bg-[#1A1A1A] text-white text-center">
                            <p className="text-[9px] uppercase font-bold text-white/50 tracking-widest mb-1">Lifetime Spend</p>
                            <p className="text-2xl font-serif text-[#D4AF37]">${totalSpend.toLocaleString()}</p>
                        </Card>
                    </div>

                    <Card className="border border-[#1A1A1A]/10 bg-white overflow-hidden">
                        <div className="p-4 bg-[#F9F8F6] border-b border-[#1A1A1A]/10 flex justify-between items-center">
                            <h3 className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#1A1A1A]">Historical Stay Records</h3>
                            {isLoading && <span className="text-[9px] animate-pulse">Loading stays...</span>}
                        </div>
                        <div className="max-h-[400px] overflow-y-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="sticky top-0 bg-white z-10">
                                    <tr className="border-b border-[#1A1A1A]/10 text-[9px] uppercase tracking-widest text-[#6C6863]">
                                        <th className="py-3 px-4 font-medium">Conf #</th>
                                        <th className="py-3 px-4 font-medium">Dates</th>
                                        <th className="py-3 px-4 font-medium">Room</th>
                                        <th className="py-3 px-4 font-medium">Total</th>
                                        <th className="py-3 px-4 font-medium">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="text-xs font-serif">
                                    {stays.map((stay, idx) => (
                                        <tr key={idx} className="border-b border-[#1A1A1A]/5 hover:bg-[#F9F8F6]/50">
                                            <td className="py-3 px-4 text-[#6C6863]">BKG-{stay.id}</td>
                                            <td className="py-3 px-4">{stay.checkInDate} to {stay.checkOutDate}</td>
                                            <td className="py-3 px-4 text-[#D4AF37]">Room {stay.roomId}</td>
                                            <td className="py-3 px-4 font-bold">${stay.totalPrice}</td>
                                            <td className="py-3 px-4">
                                                <span className={`text-[8px] font-bold px-1.5 py-0.5 border ${
                                                    stay.status === 'CHECKED_OUT' ? 'border-gray-200 text-gray-400' : 'border-[#D4AF37] text-[#D4AF37]'
                                                }`}>
                                                    {stay.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                    {stays.length === 0 && !isLoading && (
                                        <tr>
                                            <td colSpan={5} className="py-12 text-center text-[#6C6863] italic">No past stays found for this guest.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card>

                    <Card className="p-6 border border-[#1A1A1A]/10 bg-[#F9F8F6]">
                        <h3 className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#1A1A1A] mb-4 border-b border-[#1A1A1A]/10 pb-2">Guest Preferences (From Profile)</h3>
                        <p className="text-sm font-serif italic text-[#6C6863]">
                            {guest.guestPreferences || 'No preferences specified by the guest.'}
                        </p>
                    </Card>
                </div>
            </div>
        </Modal>
    );
};
