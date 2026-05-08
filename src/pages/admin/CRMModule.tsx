import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { AuthService } from '../../api';
import { GuestDetailModal } from '../../components/admin/GuestDetailModal';

export const CRMModule: React.FC = () => {
    const [guests, setGuests] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedGuest, setSelectedGuest] = useState<any>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    const fetchGuests = async () => {
        setIsLoading(true);
        try {
            const res = await AuthService.getAllUsers();
            // Filter for GUEST role only
            const guestList = Array.isArray(res) ? res.filter((u: any) => u.role === 'GUEST') : [];
            setGuests(guestList);
        } catch (error) {
            console.error('Failed to fetch guests', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchGuests();
    }, []);

    const filteredGuests = guests.filter(g => 
        (`${g.firstName || ''} ${g.lastName || ''}`).toLowerCase().includes(searchQuery.toLowerCase()) ||
        (g.email || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleOpenGuest = (guest: any) => {
        setSelectedGuest(guest);
        setIsDetailModalOpen(true);
    };

    return (
        <div className="animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end border-b border-[#1A1A1A]/20 pb-4 mb-8 gap-4">
                <div>
                    <h2 className="text-3xl font-serif text-[#1A1A1A]">Guest Database <span className="italic text-[#D4AF37]">CRM</span></h2>
                    <p className="text-xs font-serif italic text-[#6C6863] mt-1">Manage long-term relationships and personalized guest profiles.</p>
                </div>
                <div className="flex gap-4">
                    <button 
                        onClick={fetchGuests}
                        className="text-[10px] uppercase font-bold tracking-widest px-6 h-10 border border-[#1A1A1A]/20 hover:bg-[#F9F8F6] transition-colors"
                    >
                        Refresh Database
                    </button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card className="p-6 border border-[#1A1A1A]/10 bg-white">
                    <p className="text-[9px] uppercase font-bold text-[#6C6863] tracking-widest mb-1">Total Profiles</p>
                    <p className="text-3xl font-serif text-[#1A1A1A]">{guests.length}</p>
                </Card>
                <Card className="p-6 border border-[#1A1A1A]/10 bg-white">
                    <p className="text-[9px] uppercase font-bold text-[#6C6863] tracking-widest mb-1">VIP Collection</p>
                    <p className="text-3xl font-serif text-[#D4AF37]">{guests.filter(g => g.isVip).length}</p>
                </Card>
                <Card className="p-6 border border-[#1A1A1A]/10 bg-white">
                    <p className="text-[9px] uppercase font-bold text-[#6C6863] tracking-widest mb-1">Active This Month</p>
                    <p className="text-3xl font-serif text-[#1A1A1A]">--</p>
                </Card>
                <Card className="p-6 border-none bg-[#1A1A1A] text-white">
                    <p className="text-[9px] uppercase font-bold text-white/50 tracking-widest mb-1">Average Guest LTV</p>
                    <p className="text-3xl font-serif text-[#D4AF37]">$2,450</p>
                </Card>
            </div>

            {/* Filter Bar */}
            <div className="bg-[#F9F8F6] p-4 border border-[#1A1A1A]/10 border-b-0 flex gap-4">
                <div className="flex-1 relative">
                    <Input 
                        placeholder="Search guests by name or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 font-serif italic"
                    />
                    <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#6C6863]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>
            </div>

            {/* Guest Table */}
            <div className="overflow-x-auto border border-[#1A1A1A]/10 bg-white min-h-[50vh]">
                <table className="w-full text-left border-collapse whitespace-nowrap">
                    <thead>
                        <tr className="border-b border-[#1A1A1A]/10 text-[10px] uppercase tracking-[0.2em] text-[#6C6863] bg-[#F9F8F6]">
                            <th className="py-4 px-6 font-medium">Guest Identity</th>
                            <th className="py-4 px-6 font-medium">Contact Details</th>
                            <th className="py-4 px-6 font-medium">VIP Status</th>
                            <th className="py-4 px-6 font-medium">Internal Notes</th>
                            <th className="py-4 px-6 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan={5} className="py-20 text-center text-[#6C6863] animate-pulse font-serif italic">Synchronizing Guest Database...</td>
                            </tr>
                        ) : filteredGuests.map((guest, idx) => (
                            <tr key={idx} className="border-b border-[#1A1A1A]/5 hover:bg-[#F9F8F6]/50 transition-colors group">
                                <td className="py-4 px-6">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${guest.isVip ? 'bg-[#D4AF37] text-white' : 'bg-[#1A1A1A] text-white'}`}>
                                            {guest.firstName?.charAt(0)}{guest.lastName?.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-[#1A1A1A] font-serif">{guest.firstName} {guest.lastName}</p>
                                            <p className="text-[10px] uppercase tracking-widest text-[#6C6863]">Joined {guest.createdAt ? new Date(guest.createdAt).toLocaleDateString() : 'N/A'}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-4 px-6">
                                    <p className="text-xs text-[#1A1A1A] font-serif">{guest.email}</p>
                                    <p className="text-[10px] text-[#6C6863]">{guest.phoneNumber || 'N/A'}</p>
                                </td>
                                <td className="py-4 px-6">
                                    {guest.isVip ? (
                                        <span className="text-[9px] uppercase font-bold tracking-[0.2em] bg-[#D4AF37] text-white px-2 py-1">VIP GUEST</span>
                                    ) : (
                                        <span className="text-[9px] uppercase font-bold tracking-[0.2em] text-[#6C6863]/30">Standard</span>
                                    )}
                                </td>
                                <td className="py-4 px-6">
                                    <p className="text-xs text-[#6C6863] font-serif italic truncate max-w-[200px]">
                                        {guest.internalNotes || 'No notes maintainted.'}
                                    </p>
                                </td>
                                <td className="py-4 px-6 text-right">
                                    <button 
                                        onClick={() => handleOpenGuest(guest)}
                                        className="text-[10px] uppercase font-bold tracking-widest text-[#D4AF37] hover:text-[#1A1A1A] transition-colors"
                                    >
                                        Open Profile
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {!isLoading && filteredGuests.length === 0 && (
                            <tr>
                                <td colSpan={5} className="py-20 text-center text-[#6C6863] font-serif italic">No guests found matching your search.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <GuestDetailModal 
                guest={selectedGuest}
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                onUpdate={fetchGuests}
            />
        </div>
    );
};
