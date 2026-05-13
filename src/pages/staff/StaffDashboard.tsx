import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { BookingService, AuthService, PaymentService, AnalyticsService } from '../../api';
import { useToast } from '../../context/ToastContext';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CRMModule } from '../admin/CRMModule';

type StaffTab = 'overview' | 'reservations' | 'crm' | 'payments';

export const StaffDashboard: React.FC = () => {
    const { toast } = useToast();
    const [activeTab, setActiveTab] = useState<StaffTab>('overview');
    
    const [bookings, setBookings] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [payments, setPayments] = useState<any[]>([]);

    const [analyticsOverview, setAnalyticsOverview] = useState<any>(null);
    const [todayStats, setTodayStats] = useState<any>(null);
    const [revenueData, setRevenueData] = useState<any[]>([]);
    const [occupancyData, setOccupancyData] = useState<any[]>([]);

    const [isWalkInModalOpen, setWalkInModalOpen] = useState(false);
    const [walkInForm, setWalkInForm] = useState({ userId: '', roomId: '', checkInDate: '', checkOutDate: '', totalPrice: 0 });
    
    const [editingBooking, setEditingBooking] = useState<any>(null);
    const [viewingPayment, setViewingPayment] = useState<any>(null);

    // Search and Filter states
    const [resSearchQuery, setResSearchQuery] = useState('');
    const [resStatusFilter, setResStatusFilter] = useState('All');

    const refreshData = async () => {
        try {
            const [bookingsRes, usersRes, paymentsRes] = await Promise.all([
                BookingService.getAllBookings(),
                AuthService.getAllUsers(),
                PaymentService.getAllPayments()
            ]);
            setBookings(bookingsRes);
            setUsers(usersRes);
            setPayments(paymentsRes);
            
            try {
                const [overview, today, revenueChart, occupancyChart] = await Promise.all([
                    AnalyticsService.getOverview(),
                    AnalyticsService.getTodayStats(),
                    AnalyticsService.getRevenue('30d'),
                    AnalyticsService.getOccupancy()
                ]);
                setAnalyticsOverview(overview);
                setTodayStats(today);
                setRevenueData(revenueChart);
                setOccupancyData(occupancyChart);
            } catch (analyticsError) {
                console.error('Analytics fetching error', analyticsError);
            }
        } catch (error) {
            console.error('Error fetching staff data', error);
        }
    };

    useEffect(() => {
        refreshData();
    }, []);

    // Calculate metrics
    const totalRooms = 24; // fallback value for staff view
    const bookedRooms = bookings.filter(b => ['CONFIRMED', 'CHECKED_IN'].includes(b.status)).length;
    
    const displayOccupancy = analyticsOverview ? Math.round(analyticsOverview.occupancyRate) : (totalRooms > 0 ? Math.round((bookedRooms / totalRooms) * 100) : 0);
    const displayRevenue = analyticsOverview ? analyticsOverview.totalRevenue.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : bookings.reduce((acc, curr) => acc + (Number(curr.totalPrice) || 0), 0).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    const displayAdr = analyticsOverview ? analyticsOverview.adr.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : '$0.00';
    const displayRevPar = analyticsOverview ? analyticsOverview.revPar.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : '$0.00';
    
    const expectedCheckins = todayStats ? todayStats.arrivals : bookings.filter(b => b.status === 'CONFIRMED').length;
    const expectedCheckouts = todayStats ? todayStats.departures : bookings.filter(b => b.status === 'CHECKED_IN').length;
    const inHouseGuests = todayStats ? todayStats.inHouseGuests : bookings.filter(b => b.status === 'CHECKED_IN').length;

    const getUserName = (userId: string) => {
        const u = users.find(u => u.id === userId);
        return u ? `${u.firstName} ${u.lastName}` : userId.substring(0, 8);
    };

    const getUserPrefs = (userId: string) => {
        const u = users.find(u => u.id === userId);
        if (u?.guestPreferences) {
            try {
                const prefs = JSON.parse(u.guestPreferences);
                let text = [];
                if (prefs.roomReqs?.length) text.push(`Reqs: ${prefs.roomReqs.join(', ')}`);
                if (prefs.dietary) text.push(`Dietary: ${prefs.dietary}`);
                return text.join(' | ');
            } catch (e) {
                return u.guestPreferences;
            }
        }
        return '';
    };

    const getPaymentForBooking = (bookingId: number) => {
        return payments.find((p: any) => p.reservationId === bookingId);
    };

    const formatPaymentDate = (bookingId: number) => {
        const payment = getPaymentForBooking(bookingId);
        if (!payment || !payment.createdAt) return '—';
        return new Date(payment.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const handleCheckIn = async (bookingId: number) => {
        try {
            await BookingService.checkIn(bookingId);
            toast('Guest checked in successfully. Room updated to OCCUPIED.', 'success');
            refreshData();
        } catch (err: any) {
            toast(err.message || 'Failed to check in.', 'error');
        }
    };

    const handleCheckOut = async (bookingId: number) => {
        try {
            await BookingService.checkOut(bookingId);
            toast('Guest checked out successfully. Room requires CLEANING.', 'success');
            refreshData();
        } catch (err: any) {
            toast(err.message || 'Failed to check out.', 'error');
        }
    };

    const handleWalkInSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (!walkInForm.userId || !walkInForm.roomId) throw new Error("User and Room must be selected.");
            const newBooking = await BookingService.createBooking({
                userId: walkInForm.userId,
                roomId: Number(walkInForm.roomId),
                checkInDate: walkInForm.checkInDate,
                checkOutDate: walkInForm.checkOutDate,
                totalPrice: Number(walkInForm.totalPrice)
            });
            await BookingService.checkIn(newBooking.id);
            toast('Walk-In booking created successfully!', 'success');
            setWalkInModalOpen(false);
            refreshData();
        } catch (err: any) {
            toast(err.message || 'Failed to create Walk-In booking.', 'error');
        }
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await BookingService.updateBooking(editingBooking.id, {
                checkInDate: editingBooking.checkInDate,
                checkOutDate: editingBooking.checkOutDate,
                roomId: Number(editingBooking.roomId),
                status: editingBooking.status
            });
            toast('Booking updated successfully.', 'success');
            setEditingBooking(null);
            refreshData();
        } catch (err: any) {
            toast(err.message || 'Failed to update booking.', 'error');
        }
    };

    const handleCancelBooking = async (bookingId: number) => {
        if (!window.confirm("Are you sure you want to cancel this booking?")) return;
        try {
            await BookingService.cancelBooking(bookingId);
            toast('Booking cancelled successfully.', 'success');
            refreshData();
        } catch (err: any) {
            toast(err.message || 'Failed to cancel booking.', 'error');
        }
    };

    const filteredBookings = bookings.filter(b => {
        const guestName = getUserName(b.userId).toLowerCase();
        const bkgId = `BKG-${b.id}`.toLowerCase();
        const roomNum = `Room ${b.roomId}`.toLowerCase();
        const query = resSearchQuery.toLowerCase();
        
        const matchesSearch = guestName.includes(query) || bkgId.includes(query) || roomNum.includes(query);
        const matchesStatus = resStatusFilter === 'All' || b.status === resStatusFilter.toUpperCase().replace(/\s/g, '_');
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="max-w-[1600px] mx-auto w-full pt-16 md:pt-32 pb-40 px-8 flex flex-col lg:flex-row gap-12">
            
            {/* Sidebar Nav */}
            <div className="lg:w-1/4 border-r border-[#1A1A1A]/10 pr-8 min-h-screen">
                <h1 className="text-3xl md:text-5xl font-serif text-[#1A1A1A] mb-12 mt-8">
                    <span className="italic">Lumière</span><br />
                    Staff Portal
                </h1>
                
                <nav className="flex flex-col space-y-2 text-xs uppercase tracking-[0.2em] font-medium text-[#6C6863]">
                    <button onClick={() => setActiveTab('overview')} className={`text-left py-4 border-t border-[#1A1A1A]/20 transition-colors relative ${activeTab === 'overview' ? 'text-[#1A1A1A] after:-left-4 after:top-1/2 after:-translate-y-1/2 after:absolute after:h-px after:w-2 after:bg-[#D4AF37]' : 'hover:text-[#D4AF37]'}`}>Overview</button>
                    <button onClick={() => setActiveTab('reservations')} className={`text-left py-4 border-t border-[#1A1A1A]/5 transition-colors relative ${activeTab === 'reservations' ? 'text-[#1A1A1A] after:-left-4 after:top-1/2 after:-translate-y-1/2 after:absolute after:h-px after:w-2 after:bg-[#D4AF37]' : 'hover:text-[#D4AF37]'}`}>Reservations</button>
                    <button onClick={() => setActiveTab('payments')} className={`text-left py-4 border-t border-[#1A1A1A]/5 transition-colors relative ${activeTab === 'payments' ? 'text-[#1A1A1A] after:-left-4 after:top-1/2 after:-translate-y-1/2 after:absolute after:h-px after:w-2 after:bg-[#D4AF37]' : 'hover:text-[#D4AF37]'}`}>Payments</button>
                    <button onClick={() => setActiveTab('crm')} className={`text-left py-4 border-t border-[#1A1A1A]/5 transition-colors relative ${activeTab === 'crm' ? 'text-[#1A1A1A] after:-left-4 after:top-1/2 after:-translate-y-1/2 after:absolute after:h-px after:w-2 after:bg-[#D4AF37]' : 'hover:text-[#D4AF37]'}`}>Guest CRM</button>
                </nav>
            </div>

            {/* Dynamic Content Pane */}
            <div className="flex-1 w-full pt-8 min-w-0">
                
                {/* 1. Global Overview */}
                {activeTab === 'overview' && (
                    <div className="animate-in fade-in duration-500">
                        <div className="flex justify-between items-end border-b border-[#1A1A1A]/20 pb-4 mb-8">
                            <h2 className="text-3xl font-serif text-[#1A1A1A]">Operations <span className="italic text-[#D4AF37]">Dashboard</span></h2>
                            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#6C6863]">Key Metrics</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                            <Card className="p-8 border border-[#1A1A1A]/10 bg-white">
                                <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#6C6863] mb-2">Occupancy Rate</p>
                                <p className="text-4xl font-serif text-[#1A1A1A]">{displayOccupancy}%</p>
                                <p className="text-xs text-green-600 mt-3 flex items-center gap-1 font-medium"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeWidth="2" d="M5 15l7-7 7 7"></path></svg> 2.5% increase</p>
                            </Card>
                            <Card className="p-8 border border-[#1A1A1A]/10 bg-white">
                                <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#6C6863] mb-2">RevPAR</p>
                                <p className="text-4xl font-serif text-[#1A1A1A]">{displayRevPar}</p>
                                <p className="text-xs text-[#6C6863] mt-3 font-serif italic">Per available room</p>
                            </Card>
                            <Card className="p-8 border border-[#1A1A1A]/10 bg-white">
                                <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#6C6863] mb-2">ADR</p>
                                <p className="text-4xl font-serif text-[#1A1A1A]">{displayAdr}</p>
                                <p className="text-xs text-[#6C6863] mt-3 font-serif italic">Average Daily Rate</p>
                            </Card>
                            <Card className="p-8 border-none bg-[#1A1A1A] text-white">
                                <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/50 mb-2">Total Revenue</p>
                                <p className="text-4xl font-serif text-[#D4AF37]">{displayRevenue || "$0.00"}</p>
                                <p className="text-xs text-green-400 mt-3 font-medium">5.2% growth</p>
                            </Card>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
                            <div>
                                <h3 className="text-[10px] uppercase font-bold tracking-[0.3em] text-[#1A1A1A] mb-6">Operations Status</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center border-b border-[#1A1A1A]/10 pb-4">
                                        <div>
                                            <span className="text-sm font-serif text-[#6C6863] block">Expected Check-ins Today</span>
                                            <span className="text-[10px] uppercase tracking-[0.1em] text-[#D4AF37]">{expectedCheckins} Pending</span>
                                        </div>
                                        <span className="text-2xl font-serif text-[#1A1A1A]">{expectedCheckins}</span>
                                    </div>
                                    <div className="flex justify-between items-center border-b border-[#1A1A1A]/10 pb-4">
                                        <div>
                                            <span className="text-sm font-serif text-[#6C6863] block">Expected Check-outs</span>
                                            <span className="text-[10px] uppercase tracking-[0.1em] text-[#D4AF37]">0 Completed</span>
                                        </div>
                                        <span className="text-2xl font-serif text-[#1A1A1A]">{expectedCheckouts}</span>
                                    </div>
                                    <div className="flex justify-between items-center border-b border-[#1A1A1A]/10 pb-4">
                                        <div>
                                            <span className="text-sm font-serif text-[#6C6863] block">In-House Guests</span>
                                        </div>
                                        <span className="text-2xl font-serif text-[#1A1A1A]">{inHouseGuests}</span>
                                    </div>
                                    <div className="flex justify-between items-center border-b border-[#1A1A1A]/10 pb-4">
                                        <div>
                                            <span className="text-sm font-serif text-[#6C6863] block">Booked Rooms</span>
                                        </div>
                                        <span className="text-2xl font-serif text-[#1A1A1A]">{bookedRooms}</span>
                                    </div>
                                    <div className="flex justify-between items-center pb-4">
                                        <div>
                                            <span className="text-sm font-serif text-[#6C6863] block">Available Rooms</span>
                                        </div>
                                        <span className="text-2xl font-serif text-[#1A1A1A]">{totalRooms - bookedRooms}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div>
                                <h3 className="text-[10px] uppercase font-bold tracking-[0.3em] text-[#1A1A1A] mb-6 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> Action Required</h3>
                                <div className="space-y-4">
                                    <Card className="p-4 border-l-4 border-l-red-500 bg-red-50/50 border-y-0 border-r-0 rounded-r-lg">
                                        <p className="text-sm font-bold text-[#1A1A1A] mb-1">Overbooked Dates</p>
                                        <p className="text-xs text-red-900/70 font-serif">Monitor conflicting reservations</p>
                                    </Card>
                                    <Card className="p-4 border-l-4 border-l-yellow-500 bg-yellow-50/50 border-y-0 border-r-0 rounded-r-lg">
                                        <p className="text-sm font-bold text-[#1A1A1A] mb-1">Payment Alerts</p>
                                        <p className="text-xs text-yellow-900/70 font-serif">Review pending confirmations</p>
                                    </Card>
                                    <Card className="p-4 border-l-4 border-l-blue-500 bg-blue-50/50 border-y-0 border-r-0 rounded-r-lg">
                                        <p className="text-sm font-bold text-[#1A1A1A] mb-1">Pending Requests</p>
                                        <p className="text-xs text-blue-900/70 font-serif">Guest inquiries await response</p>
                                    </Card>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            <div>
                                <h3 className="text-[10px] uppercase font-bold tracking-[0.3em] text-[#1A1A1A] mb-6">Revenue Trend (30 Days)</h3>
                                <div className="h-64 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={revenueData}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E5E5" />
                                            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6C6863' }} />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6C6863' }} tickFormatter={(val) => `$${val}`} />
                                            <Tooltip cursor={{ fill: '#F9F8F6' }} contentStyle={{ borderRadius: '0px', border: '1px solid #E5E5E5' }} />
                                            <Bar dataKey="value" fill="#1A1A1A" radius={[2, 2, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-[10px] uppercase font-bold tracking-[0.3em] text-[#1A1A1A] mb-6">Occupancy History</h3>
                                <div className="h-64 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={occupancyData}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E5E5" />
                                            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6C6863' }} />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6C6863' }} tickFormatter={(val) => `${val}%`} domain={[0, 100]} />
                                            <Tooltip contentStyle={{ borderRadius: '0px', border: '1px solid #E5E5E5' }} />
                                            <Line type="step" dataKey="value" stroke="#D4AF37" strokeWidth={2} dot={{ r: 3, fill: '#D4AF37' }} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 2. Reservation Management */}
                {activeTab === 'reservations' && (
                    <div className="animate-in fade-in duration-500">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end border-b border-[#1A1A1A]/20 pb-4 mb-8 gap-4">
                            <h2 className="text-3xl font-serif text-[#1A1A1A]">Reservations <span className="italic text-[#D4AF37]">Management</span></h2>
                            <div className="flex gap-4">
                                <Button onClick={() => refreshData()} variant="ghost" className="border border-[#1A1A1A]/20 text-[10px] uppercase font-bold tracking-[0.1em] h-10 px-4 whitespace-nowrap">Refresh</Button>
                                <Button onClick={() => setWalkInModalOpen(true)} variant="ghost" className="border border-[#1A1A1A]/20 text-[10px] uppercase font-bold tracking-[0.1em] h-10 px-4 whitespace-nowrap">Walk-In</Button>
                                <Button onClick={() => toast('Calendar View loading...', 'info')} variant="primary" className="bg-[#1A1A1A] text-white hover:bg-[#D4AF37] transition-colors text-[10px] uppercase font-bold tracking-[0.1em] h-10 px-4 whitespace-nowrap">Calendar</Button>
                            </div>
                        </div>

                        {/* Searchable Directory */}
                        <div className="mb-0 flex flex-col md:flex-row gap-4 bg-[#F9F8F6] p-4 border border-[#1A1A1A]/10 border-b-0">
                            <input 
                                type="text" 
                                placeholder="Search by guest name, booking ID, or room..." 
                                className="flex-1 p-3 border border-[#1A1A1A]/10 bg-white text-sm focus:border-[#D4AF37] outline-none font-serif italic" 
                                value={resSearchQuery}
                                onChange={(e) => setResSearchQuery(e.target.value)}
                            />
                            <select 
                                className="p-3 border border-[#1A1A1A]/10 bg-white text-sm focus:border-[#D4AF37] outline-none uppercase tracking-widest text-[10px] font-bold text-[#6C6863]"
                                value={resStatusFilter}
                                onChange={(e) => setResStatusFilter(e.target.value)}
                            >
                                <option value="All">All Statuses</option>
                                <option value="CHECKED_IN">Checked In</option>
                                <option value="CONFIRMED">Confirmed</option>
                                <option value="CHECKED_OUT">Checked Out</option>
                                <option value="CANCELLED">Cancelled</option>
                                <option value="PENDING">Pending</option>
                            </select>
                        </div>

                        <div className="overflow-x-auto border border-[#1A1A1A]/10 bg-white min-h-[50vh]">
                            <table className="w-full text-left border-collapse whitespace-nowrap">
                                <thead>
                                    <tr className="border-b border-[#1A1A1A]/20 text-[10px] uppercase tracking-[0.2em] text-[#6C6863] bg-[#F9F8F6]">
                                        <th className="py-4 px-6 font-medium">Guest Name</th>
                                        <th className="py-4 px-6 font-medium">Confirmation</th>
                                        <th className="py-4 px-6 font-medium">Room</th>
                                        <th className="py-4 px-6 font-medium">Dates</th>
                                        <th className="py-4 px-6 font-medium">Payment Date</th>
                                        <th className="py-4 px-6 font-medium">Status</th>
                                        <th className="py-4 px-6 font-medium text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredBookings.map((booking: any, index: number) => (
                                        <tr key={booking.id || index} className="border-b border-[#1A1A1A]/5 hover:bg-[#F9F8F6]/50 transition-colors group">
                                            <td className="py-4 px-6 relative group/tooltip">
                                                <div className="text-sm font-bold text-[#1A1A1A] font-serif">{getUserName(booking.userId)}</div>
                                                {getUserPrefs(booking.userId) && (
                                                    <>
                                                        <div className="inline-block mt-1 px-2 py-0.5 bg-[#D4AF37]/10 text-[#D4AF37] text-[9px] uppercase tracking-widest font-bold rounded cursor-help">
                                                            View Prefs
                                                        </div>
                                                        <div className="absolute z-10 left-6 top-full mt-1 w-64 p-4 bg-white border border-[#1A1A1A]/10 shadow-[0_8px_32px_rgba(0,0,0,0.08)] opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-300">
                                                            <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#1A1A1A] mb-3 border-b border-[#1A1A1A]/10 pb-2">Guest Preferences</div>
                                                            <div className="text-xs text-[#6C6863] whitespace-pre-wrap leading-relaxed normal-case tracking-normal">
                                                                {getUserPrefs(booking.userId).split(' | ').join('\n\n')}
                                                            </div>
                                                        </div>
                                                    </>
                                                )}
                                            </td>
                                            <td className="py-4 px-6 text-xs text-[#6C6863]">BKG-{booking.id}</td>
                                            <td className="py-4 px-6 text-sm text-[#1A1A1A] font-serif italic text-[#D4AF37]">Room {booking.roomId}</td>
                                            <td className="py-4 px-6 text-xs text-[#6C6863]">{booking.checkInDate} to {booking.checkOutDate}</td>
                                            <td className="py-4 px-6 text-xs text-[#6C6863]">{formatPaymentDate(booking.id)}</td>
                                            <td className="py-4 px-6">
                                                <span className={`text-[9px] uppercase font-bold tracking-widest px-2 py-1 border ${
                                                    booking.status === 'PENDING' ? 'bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/20' : 
                                                    booking.status === 'CONFIRMED' ? 'bg-blue-100/50 text-blue-700 border-blue-200' :
                                                    booking.status === 'CHECKED_IN' ? 'bg-green-100/50 text-green-700 border-green-200' :
                                                    booking.status === 'CHECKED_OUT' ? 'bg-gray-100/50 text-gray-700 border-gray-200' :
                                                    booking.status === 'CANCELLED' ? 'bg-red-100/50 text-red-700 border-red-200' :
                                                    'bg-orange-100/50 text-orange-700 border-orange-200'
                                                }`}>
                                                    {booking.status}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-xs text-right space-x-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => setEditingBooking(booking)} className="text-[#D4AF37] hover:text-[#1A1A1A] uppercase tracking-widest font-bold text-[9px]">Edit</button>
                                                <button onClick={() => handleCancelBooking(booking.id)} className="text-red-500 hover:text-red-800 uppercase tracking-widest font-bold text-[9px]">Cancel</button>
                                                {booking.status === 'CHECKED_IN' ? (
                                                    <button onClick={() => handleCheckOut(booking.id)} className="text-[#1A1A1A] hover:text-red-600 uppercase tracking-widest font-bold text-[9px]">Check Out</button>
                                                ) : booking.status === 'CONFIRMED' || booking.status === 'PENDING' ? (
                                                    <button onClick={() => handleCheckIn(booking.id)} className="text-[#1A1A1A] hover:text-green-600 uppercase tracking-widest font-bold text-[9px]">Check In</button>
                                                ) : null}
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredBookings.length === 0 && (
                                        <tr>
                                            <td colSpan={7} className="py-8 text-center text-[#6C6863] font-serif italic">
                                                No reservations found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* 3. CRM Module */}
                {activeTab === 'crm' && (
                    <CRMModule />
                )}

                {/* 4. Payments (View-only, no refunds) */}
                {activeTab === 'payments' && (
                    <div className="animate-in fade-in duration-500">
                        <div className="flex justify-between items-end border-b border-[#1A1A1A]/20 pb-4 mb-8">
                            <h2 className="text-3xl font-serif text-[#1A1A1A]">Payment Overview <span className="italic text-[#D4AF37]">Ledger</span></h2>
                        </div>
                        <div className="overflow-x-auto border border-[#1A1A1A]/10 bg-white">
                            <table className="w-full text-left border-collapse whitespace-nowrap">
                                <thead>
                                    <tr className="border-b border-[#1A1A1A]/10 text-[10px] uppercase tracking-[0.2em] text-[#6C6863] bg-[#F9F8F6]">
                                        <th className="py-4 px-6 font-medium">Payment ID</th>
                                        <th className="py-4 px-6 font-medium">Reservation</th>
                                        <th className="py-4 px-6 font-medium">Amount</th>
                                        <th className="py-4 px-6 font-medium">Method</th>
                                        <th className="py-4 px-6 font-medium">Status</th>
                                        <th className="py-4 px-6 font-medium text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {payments.length > 0 ? (
                                        payments.map((p, i) => (
                                            <tr key={i} className="border-b border-[#1A1A1A]/5 hover:bg-[#F9F8F6] transition-colors group">
                                                <td className="py-4 px-6 text-xs text-[#6C6863] font-serif">PAY-{p.id}</td>
                                                <td className="py-4 px-6 text-sm text-[#1A1A1A] font-serif italic text-[#D4AF37]">RES-{p.reservationId}</td>
                                                <td className="py-4 px-6 text-sm font-bold text-[#1A1A1A]">${p.amount}</td>
                                                <td className="py-4 px-6 text-xs text-[#6C6863]">{p.paymentMethod}</td>
                                                <td className="py-4 px-6">
                                                    <span className={`text-[10px] uppercase tracking-widest font-bold px-2 py-1 ${p.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : p.status === 'REFUNDED' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{p.status}</span>
                                                </td>
                                                <td className="py-4 px-6 text-xs text-right opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => setViewingPayment(p)} className="text-[#D4AF37] hover:text-[#1A1A1A] uppercase tracking-widest font-bold text-[9px]">View</button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className="py-8 text-center text-sm font-serif italic text-[#6C6863]">
                                                No payments found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Modals */}
            <Modal isOpen={isWalkInModalOpen} onClose={() => setWalkInModalOpen(false)} title="Create Walk-In Booking">
                <form onSubmit={handleWalkInSubmit} className="space-y-4">
                    <div>
                        <label className="text-[10px] uppercase font-bold text-[#6C6863] block mb-1">Select Guest User</label>
                        <select className="w-full p-3 border border-[#1A1A1A]/20 bg-[#F9F8F6] text-sm" value={walkInForm.userId} onChange={(e) => setWalkInForm({ ...walkInForm, userId: e.target.value })} required>
                            <option value="">-- Choose User --</option>
                            {users.map(u => <option key={u.id} value={u.id}>{u.firstName} {u.lastName} ({u.email})</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-[10px] uppercase font-bold text-[#6C6863] block mb-1">Select Available Room</label>
                        <select className="w-full p-3 border border-[#1A1A1A]/20 bg-[#F9F8F6] text-sm" value={walkInForm.roomId} onChange={(e) => setWalkInForm({ ...walkInForm, roomId: e.target.value })} required>
                            <option value="">-- Choose Room --</option>
                            {/* Room options would be populated from rooms state if available */}
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Input type="date" label="Check In" value={walkInForm.checkInDate} onChange={(e) => setWalkInForm({ ...walkInForm, checkInDate: e.target.value })} required />
                        <Input type="date" label="Check Out" value={walkInForm.checkOutDate} onChange={(e) => setWalkInForm({ ...walkInForm, checkOutDate: e.target.value })} required />
                    </div>
                    <Input type="number" label="Calculated Total Price (USD)" value={walkInForm.totalPrice} disabled className="bg-gray-100" required />
                    <Button type="submit" variant="primary" className="w-full mt-4 bg-[#1A1A1A] text-white">Create Walk-In Booking</Button>
                </form>
            </Modal>

            <Modal isOpen={!!editingBooking} onClose={() => setEditingBooking(null)} title="Edit Booking">
                {editingBooking && (
                    <form onSubmit={handleEditSubmit} className="space-y-4">
                        <div>
                            <label className="text-[10px] uppercase font-bold text-[#6C6863] block mb-1">Reassign Room</label>
                            <select className="w-full p-3 border border-[#1A1A1A]/20 bg-[#F9F8F6] text-sm" value={editingBooking.roomId} onChange={(e) => setEditingBooking({ ...editingBooking, roomId: e.target.value })} required>
                                <option value={editingBooking.roomId}>Current Room {editingBooking.roomId}</option>
                            </select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <Input type="date" label="Modify Check In" value={editingBooking.checkInDate} onChange={(e) => setEditingBooking({ ...editingBooking, checkInDate: e.target.value })} required />
                            <Input type="date" label="Modify Check Out" value={editingBooking.checkOutDate} onChange={(e) => setEditingBooking({ ...editingBooking, checkOutDate: e.target.value })} required />
                        </div>
                        <div>
                            <label className="text-[10px] uppercase font-bold text-[#6C6863] block mb-1">Status</label>
                            <select className="w-full p-3 border border-[#1A1A1A]/20 bg-[#F9F8F6] text-sm" value={editingBooking.status} onChange={(e) => setEditingBooking({ ...editingBooking, status: e.target.value })} required>
                                <option value="PENDING">Pending</option>
                                <option value="CONFIRMED">Confirmed</option>
                                <option value="CHECKED_IN">Checked In</option>
                                <option value="CHECKED_OUT">Checked Out</option>
                                <option value="CANCELLED">Cancelled</option>
                            </select>
                        </div>
                        <Button type="submit" variant="primary" className="w-full mt-4 bg-[#1A1A1A] text-white">Save Changes</Button>
                    </form>
                )}
            </Modal>

            <Modal isOpen={!!viewingPayment} onClose={() => setViewingPayment(null)} title="Payment Details">
                {viewingPayment && (
                    <div className="space-y-4 font-serif text-sm">
                        <p><strong>Payment ID:</strong> {viewingPayment.id}</p>
                        <p><strong>Reservation ID:</strong> {viewingPayment.reservationId}</p>
                        <p><strong>Amount:</strong> ${viewingPayment.amount}</p>
                        <p><strong>Method:</strong> {viewingPayment.paymentMethod}</p>
                        <p><strong>Status:</strong> {viewingPayment.status}</p>
                        <p><strong>Created At:</strong> {viewingPayment.createdAt || 'N/A'}</p>
                    </div>
                )}
            </Modal>
        </div>
    );
};
