import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { BookingService, AuthService } from '../../api';

type AdminTab = 'overview' | 'reservations' | 'inventory' | 'users' | 'reports' | 'settings';

export const AdminDashboard: React.FC = () => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<AdminTab>('overview');
    
    const [bookings, setBookings] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [bookingsRes, usersRes] = await Promise.all([
                    BookingService.getAllBookings(),
                    AuthService.getAllUsers()
                ]);
                setBookings(bookingsRes);
                setUsers(usersRes);
            } catch (error) {
                console.error('Error fetching admin data', error);
            }
        };
        fetchData();
    }, []);

    // Calculate metrics
    const totalRooms = 24; // we can hardcode total capacity for now until inventory gets a total
    const bookedRooms = bookings.filter(b => ['CONFIRMED', 'CHECKED_IN'].includes(b.status)).length;
    const occupancyRate = totalRooms > 0 ? Math.round((bookedRooms / totalRooms) * 100) : 0;
    const availableRooms = totalRooms - bookedRooms;
    const dailyRevenue = bookings.reduce((acc, curr) => acc + (Number(curr.totalPrice) || 0), 0).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    
    // Additional Operations Metrics
    const expectedCheckins = bookings.filter(b => b.status === 'CONFIRMED').length;
    const expectedCheckouts = bookings.filter(b => b.status === 'CHECKED_IN').length; // simple approximation

    const getUserName = (userId: string) => {
        const u = users.find(u => u.id === userId);
        return u ? `${u.firstName} ${u.lastName}` : userId.substring(0, 8);
    };

    return (
        <div className="max-w-[1600px] mx-auto w-full pt-16 md:pt-32 pb-40 px-8 flex flex-col lg:flex-row gap-12">
            
            {/* Sidebar Nav */}
            <div className="lg:w-1/4 border-r border-[#1A1A1A]/10 pr-8 min-h-screen">
                <h1 className="text-3xl md:text-5xl font-serif text-[#1A1A1A] mb-12 mt-8">
                    <span className="italic">Lumière</span><br />
                    {t('admin.sidebar.title')}
                </h1>
                
                <nav className="flex flex-col space-y-2 text-xs uppercase tracking-[0.2em] font-medium text-[#6C6863]">
                    <button onClick={() => setActiveTab('overview')} className={`text-left py-4 border-t border-[#1A1A1A]/20 transition-colors relative ${activeTab === 'overview' ? 'text-[#1A1A1A] after:-left-4 after:top-1/2 after:-translate-y-1/2 after:absolute after:h-px after:w-2 after:bg-[#D4AF37]' : 'hover:text-[#D4AF37]'}`}>{t('admin.sidebar.overview')}</button>
                    <button onClick={() => setActiveTab('reservations')} className={`text-left py-4 border-t border-[#1A1A1A]/5 transition-colors relative ${activeTab === 'reservations' ? 'text-[#1A1A1A] after:-left-4 after:top-1/2 after:-translate-y-1/2 after:absolute after:h-px after:w-2 after:bg-[#D4AF37]' : 'hover:text-[#D4AF37]'}`}>{t('admin.sidebar.reservations')}</button>
                    <button onClick={() => setActiveTab('inventory')} className={`text-left py-4 border-t border-[#1A1A1A]/5 transition-colors relative ${activeTab === 'inventory' ? 'text-[#1A1A1A] after:-left-4 after:top-1/2 after:-translate-y-1/2 after:absolute after:h-px after:w-2 after:bg-[#D4AF37]' : 'hover:text-[#D4AF37]'}`}>{t('admin.sidebar.inventory')}</button>
                    <button onClick={() => setActiveTab('users')} className={`text-left py-4 border-t border-[#1A1A1A]/5 transition-colors relative ${activeTab === 'users' ? 'text-[#1A1A1A] after:-left-4 after:top-1/2 after:-translate-y-1/2 after:absolute after:h-px after:w-2 after:bg-[#D4AF37]' : 'hover:text-[#D4AF37]'}`}>{t('admin.sidebar.users')}</button>
                    <button onClick={() => setActiveTab('reports')} className={`text-left py-4 border-t border-[#1A1A1A]/5 transition-colors relative ${activeTab === 'reports' ? 'text-[#1A1A1A] after:-left-4 after:top-1/2 after:-translate-y-1/2 after:absolute after:h-px after:w-2 after:bg-[#D4AF37]' : 'hover:text-[#D4AF37]'}`}>{t('admin.sidebar.reports')}</button>
                    <button onClick={() => setActiveTab('settings')} className={`text-left py-4 border-t border-[#1A1A1A]/5 transition-colors relative ${activeTab === 'settings' ? 'text-[#1A1A1A] after:-left-4 after:top-1/2 after:-translate-y-1/2 after:absolute after:h-px after:w-2 after:bg-[#D4AF37]' : 'hover:text-[#D4AF37]'}`}>{t('admin.sidebar.settings')}</button>
                </nav>
            </div>

            {/* Dynamic Content Pane */}
            <div className="flex-1 w-full pt-8 min-w-0">
                
                {/* 1. Global Overview */}
                {activeTab === 'overview' && (
                    <div className="animate-in fade-in duration-500">
                        <div className="flex justify-between items-end border-b border-[#1A1A1A]/20 pb-4 mb-8">
                            <h2 className="text-3xl font-serif text-[#1A1A1A]">{t('admin.overview.title')} <span className="italic text-[#D4AF37]">{t('admin.overview.titleItalic')}</span></h2>
                            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#6C6863]">{t('admin.overview.metrics')}</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                            <Card className="p-8 border border-[#1A1A1A]/10 bg-white">
                                <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#6C6863] mb-2">{t('admin.overview.occupancy')}</p>
                                <p className="text-4xl font-serif text-[#1A1A1A]">{occupancyRate}%</p>
                                <p className="text-xs text-green-600 mt-3 flex items-center gap-1 font-medium"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeWidth="2" d="M5 15l7-7 7 7"></path></svg> {t('admin.overview.occupancyChange')}</p>
                            </Card>
                            <Card className="p-8 border border-[#1A1A1A]/10 bg-white">
                                <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#6C6863] mb-2">{t('admin.overview.availableRooms')}</p>
                                <p className="text-4xl font-serif text-[#1A1A1A]">{availableRooms}</p>
                                <p className="text-xs text-[#6C6863] mt-3 font-serif italic">{t('admin.overview.totalRooms')}</p>
                            </Card>
                            <Card className="p-8 border-none bg-[#1A1A1A] text-white">
                                <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/50 mb-2">{t('admin.overview.dailyRevenue')}</p>
                                <p className="text-4xl font-serif text-[#D4AF37]">{dailyRevenue || "$0.00"}</p>
                                <p className="text-xs text-green-400 mt-3 font-medium">{t('admin.overview.revenueChange')}</p>
                            </Card>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            <div>
                                <h3 className="text-[10px] uppercase font-bold tracking-[0.3em] text-[#1A1A1A] mb-6">{t('admin.overview.operations')}</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center border-b border-[#1A1A1A]/10 pb-4">
                                        <div>
                                            <span className="text-sm font-serif text-[#6C6863] block">{t('admin.overview.expectedCheckins')}</span>
                                            <span className="text-[10px] uppercase tracking-[0.1em] text-[#D4AF37]">{expectedCheckins} {t('admin.overview.pending')}</span>
                                        </div>
                                        <span className="text-2xl font-serif text-[#1A1A1A]">{expectedCheckins}</span>
                                    </div>
                                    <div className="flex justify-between items-center border-b border-[#1A1A1A]/10 pb-4">
                                        <div>
                                            <span className="text-sm font-serif text-[#6C6863] block">{t('admin.overview.expectedCheckouts')}</span>
                                            <span className="text-[10px] uppercase tracking-[0.1em] text-[#D4AF37]">0 {t('admin.overview.completed')}</span>
                                        </div>
                                        <span className="text-2xl font-serif text-[#1A1A1A]">{expectedCheckouts}</span>
                                    </div>
                                    <div className="flex justify-between items-center border-b border-[#1A1A1A]/10 pb-4">
                                        <div>
                                            <span className="text-sm font-serif text-[#6C6863] block">{t('admin.overview.stayOvers')}</span>
                                        </div>
                                        <span className="text-2xl font-serif text-[#1A1A1A]">{expectedCheckouts}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div>
                                <h3 className="text-[10px] uppercase font-bold tracking-[0.3em] text-[#1A1A1A] mb-6 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> {t('admin.overview.actionNeeded')}</h3>
                                <div className="space-y-4">
                                    <Card className="p-4 border-l-4 border-l-red-500 bg-red-50/50 border-y-0 border-r-0 rounded-r-lg">
                                        <p className="text-sm font-bold text-[#1A1A1A] mb-1">{t('admin.overview.overbooked')}</p>
                                        <p className="text-xs text-red-900/70 font-serif">{t('admin.overview.overbookedDesc')}</p>
                                    </Card>
                                    <Card className="p-4 border-l-4 border-l-yellow-500 bg-yellow-50/50 border-y-0 border-r-0 rounded-r-lg">
                                        <p className="text-sm font-bold text-[#1A1A1A] mb-1">{t('admin.overview.paymentFailure')}</p>
                                        <p className="text-xs text-yellow-900/70 font-serif">{t('admin.overview.paymentFailureDesc')}</p>
                                    </Card>
                                    <Card className="p-4 border-l-4 border-l-blue-500 bg-blue-50/50 border-y-0 border-r-0 rounded-r-lg">
                                        <p className="text-sm font-bold text-[#1A1A1A] mb-1">{t('admin.overview.pendingRequest')}</p>
                                        <p className="text-xs text-blue-900/70 font-serif">{t('admin.overview.pendingRequestDesc')}</p>
                                    </Card>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 2. Reservation Management */}
                {activeTab === 'reservations' && (
                    <div className="animate-in fade-in duration-500">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end border-b border-[#1A1A1A]/20 pb-4 mb-8 gap-4">
                            <h2 className="text-3xl font-serif text-[#1A1A1A]">{t('admin.reservations.title')} <span className="italic text-[#D4AF37]">{t('admin.reservations.titleItalic')}</span></h2>
                            <div className="flex gap-4">
                                <Button onClick={() => alert('Available in v2.0')} variant="ghost" className="border border-[#1A1A1A]/20 text-[10px] uppercase font-bold tracking-[0.1em] h-10 px-4 whitespace-nowrap">{t('admin.reservations.walkIn')}</Button>
                                <Button onClick={() => alert('Available in v2.0')} variant="primary" className="bg-[#1A1A1A] text-white hover:bg-[#D4AF37] transition-colors text-[10px] uppercase font-bold tracking-[0.1em] h-10 px-4 whitespace-nowrap">{t('admin.reservations.calendar')}</Button>
                            </div>
                        </div>

                        {/* Searchable Directory */}
                        <div className="mb-0 flex flex-col md:flex-row gap-4 bg-[#F9F8F6] p-4 border border-[#1A1A1A]/10 border-b-0">
                            <input type="text" placeholder={t('admin.reservations.searchPlaceholder')} className="flex-1 p-3 border border-[#1A1A1A]/10 bg-white text-sm focus:border-[#D4AF37] outline-none font-serif italic" />
                            <select className="p-3 border border-[#1A1A1A]/10 bg-white text-sm focus:border-[#D4AF37] outline-none uppercase tracking-widest text-[10px] font-bold text-[#6C6863]">
                                <option>{t('admin.reservations.statusAll')}</option>
                                <option>{t('admin.reservations.checkedIn')}</option>
                                <option>{t('admin.reservations.reserved')}</option>
                                <option>{t('admin.reservations.checkedOut')}</option>
                            </select>
                        </div>

                        <div className="overflow-x-auto border border-[#1A1A1A]/10 bg-white min-h-[50vh]">
                            <table className="w-full text-left border-collapse whitespace-nowrap">
                                <thead>
                                    <tr className="border-b border-[#1A1A1A]/20 text-[10px] uppercase tracking-[0.2em] text-[#6C6863] bg-[#F9F8F6]">
                                        <th className="py-4 px-6 font-medium">{t('admin.reservations.table.guest')}</th>
                                        <th className="py-4 px-6 font-medium">{t('admin.reservations.table.conf')}</th>
                                        <th className="py-4 px-6 font-medium">{t('admin.reservations.table.room')}</th>
                                        <th className="py-4 px-6 font-medium">{t('admin.reservations.table.dates')}</th>
                                        <th className="py-4 px-6 font-medium">{t('admin.reservations.table.status')}</th>
                                        <th className="py-4 px-6 font-medium text-right">{t('admin.reservations.table.actions')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bookings.map((booking: any, index: number) => (
                                        <tr key={booking.id || index} className="border-b border-[#1A1A1A]/5 hover:bg-[#F9F8F6]/50 transition-colors group">
                                            <td className="py-4 px-6 text-sm font-bold text-[#1A1A1A] font-serif">{getUserName(booking.userId)}</td>
                                            <td className="py-4 px-6 text-xs text-[#6C6863]">BKG-{booking.id}</td>
                                            <td className="py-4 px-6 text-sm text-[#1A1A1A] font-serif italic text-[#D4AF37]">Room {booking.roomId}</td>
                                            <td className="py-4 px-6 text-xs text-[#6C6863]">{booking.checkInDate} to {booking.checkOutDate}</td>
                                            <td className="py-4 px-6">
                                                <span className={`text-[9px] uppercase font-bold tracking-widest px-2 py-1 ${booking.status === 'CHECKED_IN' ? 'bg-green-100/50 border border-green-200 text-green-700' : 'bg-blue-100/50 border border-blue-200 text-blue-700'}`}>
                                                    {booking.status}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-xs text-right space-x-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => alert('Available in v2.0')} className="text-[#D4AF37] hover:text-[#1A1A1A] uppercase tracking-widest font-bold text-[9px]">{t('admin.reservations.table.edit')}</button>
                                                {booking.status === 'CHECKED_IN' ? (
                                                    <button onClick={() => alert('Available in v2.0')} className="text-[#1A1A1A] hover:text-red-600 uppercase tracking-widest font-bold text-[9px]">{t('admin.reservations.table.checkOut')}</button>
                                                ) : (
                                                    <button onClick={() => alert('Available in v2.0')} className="text-[#1A1A1A] hover:text-green-600 uppercase tracking-widest font-bold text-[9px]">{t('admin.reservations.table.checkIn')}</button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    {bookings.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="py-8 text-center text-[#6C6863] font-serif italic">
                                                {t('admin.reservations.noData', 'No reservations found.')}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* 3. Inventory & Room Management */}
                {activeTab === 'inventory' && (
                    <div className="animate-in fade-in duration-500">
                        <div className="flex justify-between items-end border-b border-[#1A1A1A]/20 pb-4 mb-8">
                            <h2 className="text-3xl font-serif text-[#1A1A1A]">{t('admin.inventory.title')} <span className="italic text-[#D4AF37]">{t('admin.inventory.titleItalic')}</span></h2>
                            <Button onClick={() => alert('Available in v2.0')} variant="primary" className="bg-[#1A1A1A] hover:bg-[#D4AF37] transition-colors text-white text-[10px] uppercase tracking-widest font-bold h-10 px-6">{t('admin.inventory.addCategory')}</Button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                            <div className="lg:col-span-8">
                                <h3 className="text-[10px] uppercase font-bold tracking-[0.3em] text-[#1A1A1A] mb-6">{t('admin.inventory.roomStatus')}</h3>
                                <div className="space-y-4">
                                    {[
                                        { num: '101', type: 'Standard King', status: t('admin.inventory.available'), statusColor: 'border-l-green-500' },
                                        { num: '102', type: 'Standard King', status: t('admin.inventory.occupied'), statusColor: 'border-l-blue-500' },
                                        { num: '201', type: 'Ocean Villa', status: t('admin.inventory.cleaning'), statusColor: 'border-l-yellow-500' },
                                        { num: '405', type: 'The Grand Suite', status: t('admin.inventory.maintenance'), statusColor: 'border-l-red-500' }
                                    ].map(room => (
                                        <Card key={room.num} className={`p-0 border border-[#1A1A1A]/10 border-l-4 bg-white ${room.statusColor} shadow-sm`}>
                                            <div className="flex flex-col sm:flex-row justify-between sm:items-center p-6 gap-4">
                                                <div className="flex items-baseline gap-4">
                                                    <span className="font-serif text-3xl text-[#1A1A1A]">{room.num}</span>
                                                    <span className="text-sm font-serif italic text-[#6C6863]">{room.type}</span>
                                                </div>
                                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                                    <span className={`text-[10px] uppercase tracking-widest font-bold`}>{room.status}</span>
                                                    <select className="text-[10px] uppercase font-bold tracking-widest border border-[#1A1A1A]/20 p-2 bg-[#F9F8F6] outline-none hover:border-[#D4AF37] transition-colors cursor-pointer">
                                                        <option>{t('admin.inventory.setStatus')}</option>
                                                        <option>{t('admin.inventory.available')}</option>
                                                        <option>{t('admin.inventory.occupied')}</option>
                                                        <option>{t('admin.inventory.cleaning')}</option>
                                                        <option>{t('admin.inventory.maintenance')}</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            </div>

                            <div className="lg:col-span-4">
                                <h3 className="text-[10px] uppercase font-bold tracking-[0.3em] text-[#1A1A1A] mb-6">{t('admin.inventory.rateControl')}</h3>
                                <Card className="p-8 border border-[#1A1A1A]/10 bg-white">
                                    <div className="space-y-6">
                                        <div>
                                            <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#6C6863] mb-2 block">{t('admin.inventory.seasonalMultipliers')}</label>
                                            <div className="flex items-center justify-between border-b border-[#1A1A1A]/10 pb-3">
                                                <div>
                                                    <span className="text-sm font-serif text-[#1A1A1A] block">{t('admin.inventory.highSeason')}</span>
                                                    <span className="text-[10px] uppercase tracking-widest text-[#D4AF37]">Dec - Mar</span>
                                                </div>
                                                <span className="font-mono bg-[#F9F8F6] px-2 py-1 border border-[#1A1A1A]/10">1.25x</span>
                                            </div>
                                        </div>

                                        <div className="pt-4">
                                            <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#6C6863] mb-2 block">{t('admin.inventory.activePromotions')}</label>
                                            <div className="flex items-center justify-between bg-[#1A1A1A] text-white p-3 mb-2 rounded-sm">
                                                <span className="font-mono text-sm tracking-widest">SUMMER20</span>
                                                <span className="text-xs font-bold text-[#D4AF37]">-20% Off</span>
                                            </div>
                                            <div className="flex items-center justify-between bg-[#F9F8F6] border border-[#1A1A1A]/10 p-3 rounded-sm">
                                                <span className="font-mono text-sm tracking-widest font-bold">VIPUPGRADE</span>
                                                <span className="text-[10px] uppercase font-bold text-[#6C6863]">Free Category Up</span>
                                            </div>
                                        </div>
                                        <Button onClick={() => alert('Available in v2.0')} variant="ghost" className="border border-[#1A1A1A]/20 w-full text-[10px] uppercase tracking-widest font-bold h-10 mt-4 border-dashed border-[#1A1A1A]/20">{t('admin.inventory.editPricing')}</Button>
                                    </div>
                                </Card>
                            </div>
                        </div>
                    </div>
                )}

                {/* 4. User & Staff Management */}
                {activeTab === 'users' && (
                    <div className="animate-in fade-in duration-500">
                        <div className="flex justify-between items-end border-b border-[#1A1A1A]/20 pb-4 mb-8">
                            <h2 className="text-3xl font-serif text-[#1A1A1A]">{t('admin.users.title')} <span className="italic text-[#D4AF37]">{t('admin.users.titleItalic')}</span></h2>
                            <Button onClick={() => alert('Available in v2.0')} variant="ghost" className="border border-[#1A1A1A]/20 text-[10px] uppercase tracking-widest font-bold h-10 px-6">{t('admin.users.addNew')}</Button>
                        </div>
                        
                        <div className="overflow-x-auto border border-[#1A1A1A]/10 bg-white">
                            <table className="w-full text-left border-collapse whitespace-nowrap">
                                <thead>
                                    <tr className="border-b border-[#1A1A1A]/10 text-[10px] uppercase tracking-[0.2em] text-[#6C6863] bg-[#F9F8F6]">
                                        <th className="py-4 px-6 font-medium">{t('admin.users.table.name')}</th>
                                        <th className="py-4 px-6 font-medium">{t('admin.users.table.role')}</th>
                                        <th className="py-4 px-6 font-medium">{t('admin.users.table.dept')}</th>
                                        <th className="py-4 px-6 font-medium text-right">{t('admin.users.table.settings')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.length > 0 ? (
                                        users.filter(u => u.role === 'ADMIN' || u.role === 'MANAGER' || u.role === 'STAFF').map((staff, i) => (
                                            <tr key={i} className="border-b border-[#1A1A1A]/5 hover:bg-[#F9F8F6] transition-colors group">
                                                <td className="py-4 px-6">
                                                    <p className="text-sm font-bold text-[#1A1A1A]">{staff.firstName} {staff.lastName}</p>
                                                    <p className="text-xs text-[#6C6863] font-serif italic">{staff.email}</p>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <span className="text-[10px] uppercase tracking-widest font-bold bg-[#1A1A1A] text-white px-2 py-1">{staff.role}</span>
                                                </td>
                                                <td className="py-4 px-6 text-sm text-[#1A1A1A] font-serif">{staff.phoneNumber || 'N/A'}</td>
                                                <td className="py-4 px-6 text-xs text-right opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => alert('Available in v2.0')} className="text-[#D4AF37] hover:text-[#1A1A1A] uppercase tracking-widest font-bold text-[9px] mr-4">{t('admin.users.actions.edit')}</button>
                                                    <button onClick={() => alert('Available in v2.0')} className="text-red-500 hover:text-red-800 uppercase tracking-widest font-bold text-[9px]">{t('admin.users.actions.suspend')}</button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="py-8 text-center text-sm font-serif italic text-[#6C6863]">
                                                {t('admin.users.actions.suspend')}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-16 pt-16 border-t border-[#1A1A1A]/10">
                            <h3 className="text-[10px] uppercase font-bold tracking-[0.3em] text-[#1A1A1A] mb-2">{t('admin.users.crm.title')}</h3>
                            <p className="text-sm text-[#6C6863] font-serif italic mb-8">{t('admin.users.crm.description')}</p>
                            <Card className="p-8 border-dashed border-2 border-[#1A1A1A]/10 bg-transparent flex flex-col items-center justify-center gap-4 hover:border-[#D4AF37]/50 hover:bg-white transition-all cursor-pointer group">
                                <svg className="w-8 h-8 text-[#1A1A1A]/30 group-hover:text-[#D4AF37] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeWidth="1.5" d="M12 4v16m8-8H4"></path></svg>
                                <span className="text-[10px] uppercase tracking-widest font-bold text-[#1A1A1A]">{t('admin.users.crm.open')}</span>
                            </Card>
                        </div>
                    </div>
                )}

                {/* 5. Reports & Analytics */}
                {/* 5. Reports & Analytics */}
                {activeTab === 'reports' && (
                    <div className="animate-in fade-in duration-500">
                        <div className="border-b border-[#1A1A1A]/20 pb-4 mb-8">
                            <h2 className="text-3xl font-serif text-[#1A1A1A]">{t('admin.reports.title')} <span className="italic text-[#D4AF37]">{t('admin.reports.titleItalic')}</span></h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <Card className="p-8 border border-[#1A1A1A]/10 bg-white">
                                <div className="border-b border-[#1A1A1A]/10 pb-6 mb-6">
                                    <h3 className="text-lg font-serif text-[#1A1A1A] mb-1">{t('admin.reports.financial')}</h3>
                                    <p className="text-xs text-[#6C6863]">{t('admin.reports.financialDesc')}</p>
                                </div>
                                <div className="space-y-4 flex flex-col">
                                    <Button onClick={() => alert('Available in v2.0')} variant="ghost" className="border border-[#1A1A1A]/20 justify-between text-[10px] h-12 uppercase tracking-widest font-bold border-[#1A1A1A]/20 hover:border-[#1A1A1A] group"><span>{t('admin.reports.revenueLedger')}</span> <span className="text-[#D4AF37] group-hover:text-[#1A1A1A]">{t('admin.reports.exportCSV')}</span></Button>
                                    <Button onClick={() => alert('Available in v2.0')} variant="ghost" className="border border-[#1A1A1A]/20 justify-between text-[10px] h-12 uppercase tracking-widest font-bold border-[#1A1A1A]/20 hover:border-[#1A1A1A] group"><span>{t('admin.reports.taxRemittance')}</span> <span className="text-red-600 group-hover:text-[#1A1A1A]">{t('admin.reports.downloadPDF')}</span></Button>
                                </div>
                            </Card>

                            <Card className="p-8 border border-[#1A1A1A]/10 bg-white">
                                <div className="border-b border-[#1A1A1A]/10 pb-6 mb-6">
                                    <h3 className="text-lg font-serif text-[#1A1A1A] mb-1">{t('admin.reports.operational')}</h3>
                                    <p className="text-xs text-[#6C6863]">{t('admin.reports.operationalDesc')}</p>
                                </div>
                                <div className="space-y-4 flex flex-col">
                                    <Button onClick={() => alert('Available in v2.0')} variant="ghost" className="border border-[#1A1A1A]/20 justify-between text-[10px] h-12 uppercase tracking-widest font-bold border-[#1A1A1A]/20 hover:border-[#1A1A1A] group"><span>{t('admin.reports.housekeepingRoute')}</span> <span className="text-red-600 group-hover:text-[#1A1A1A]">{t('admin.reports.printPDF')}</span></Button>
                                    <Button onClick={() => alert('Available in v2.0')} variant="ghost" className="border border-[#1A1A1A]/20 justify-between text-[10px] h-12 uppercase tracking-widest font-bold border-[#1A1A1A]/20 hover:border-[#1A1A1A] group"><span>{t('admin.reports.occupancyForecast')}</span> <span className="text-[#D4AF37] group-hover:text-[#1A1A1A]">{t('admin.reports.exportCSV')}</span></Button>
                                </div>
                            </Card>
                        </div>
                    </div>
                )}

                {/* 6. System Settings */}
                {activeTab === 'settings' && (
                    <div className="animate-in fade-in duration-500">
                        <div className="border-b border-[#1A1A1A]/20 pb-4 mb-8">
                            <h2 className="text-3xl font-serif text-[#1A1A1A]">{t('admin.settings.title')} <span className="italic text-[#D4AF37]">{t('admin.settings.titleItalic')}</span></h2>
                        </div>

                        <div className="max-w-3xl space-y-12">
                            {/* Property Details */}
                            <Card className="p-8 border border-[#1A1A1A]/10 bg-white">
                                <h3 className="text-[10px] uppercase font-bold tracking-[0.3em] text-[#1A1A1A] mb-8 pb-4 border-b border-[#1A1A1A]/10">{t('admin.settings.propertyMeta')}</h3>
                                <div className="space-y-6">
                                    <div>
                                        <label className="text-[10px] uppercase tracking-[0.2em] font-medium text-[#6C6863] mb-2 block">{t('admin.settings.hotelName')}</label>
                                        <input type="text" defaultValue="Lumière Hotel & Resort" className="w-full border-b border-[#1A1A1A]/20 bg-transparent outline-none focus:border-[#D4AF37] pb-2 font-serif text-xl text-[#1A1A1A]" />
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                        <div>
                                            <label className="text-[10px] uppercase tracking-[0.2em] font-medium text-[#6C6863] mb-2 block">{t('admin.settings.taxRate')}</label>
                                            <input type="text" defaultValue="8.5" className="w-full border-b border-[#1A1A1A]/20 bg-transparent outline-none focus:border-[#D4AF37] pb-2 font-mono text-lg text-[#1A1A1A]" />
                                        </div>
                                        <div>
                                            <label className="text-[10px] uppercase tracking-[0.2em] font-medium text-[#6C6863] mb-2 block">{t('admin.settings.currency')}</label>
                                            <select className="w-full border-b border-[#1A1A1A]/20 bg-transparent outline-none focus:border-[#D4AF37] pb-2 font-mono text-lg text-[#1A1A1A]">
                                                <option>USD ($)</option>
                                                <option>EUR (€)</option>
                                                <option>VND (₫)</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            {/* Integrations */}
                            <Card className="p-8 border border-[#1A1A1A]/10 bg-[#1A1A1A] text-white">
                                <h3 className="text-[10px] uppercase font-bold tracking-[0.3em] text-[#F9F8F6]/50 mb-8 pb-4 border-b border-white/10">{t('admin.settings.integrations')}</h3>
                                <div className="space-y-6">
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 bg-white/5 p-6 border border-white/10">
                                        <div>
                                            <p className="text-sm font-bold text-white mb-1">Payment Gateway (Stripe)</p>
                                            <p className="text-[10px] uppercase tracking-widest text-[#D4AF37]">● {t('admin.settings.apiActive')}</p>
                                        </div>
                                        <Button onClick={() => alert('Available in v2.0')} variant="ghost" className="border border-[#1A1A1A]/20 text-[10px] uppercase tracking-widest font-bold h-8 border-white/20 hover:border-white text-white">{t('admin.settings.renewToken')}</Button>
                                    </div>
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 bg-white/5 p-6 border border-white/10">
                                        <div>
                                            <p className="text-sm font-bold text-white mb-1">SMS Notifications (Twilio)</p>
                                            <p className="text-[10px] uppercase tracking-widest text-red-500">○ {t('admin.settings.disconnected')}</p>
                                        </div>
                                        <Button onClick={() => alert('Available in v2.0')} variant="ghost" className="border border-[#1A1A1A]/20 text-[10px] uppercase tracking-widest font-bold h-8 border-white/20 hover:border-white text-white bg-white/10">{t('admin.settings.provideKey')}</Button>
                                    </div>
                                </div>
                            </Card>

                            <div className="flex justify-end pt-4">
                                <Button onClick={() => alert('Available in v2.0')} variant="primary" className="bg-[#D4AF37] hover:bg-[#1A1A1A] text-white text-[10px] uppercase tracking-[0.2em] font-bold h-12 px-12 transition-colors">{t('admin.settings.saveChanges')}</Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
