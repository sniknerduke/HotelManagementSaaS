import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { BookingService, AuthService, InventoryService, PaymentService, AnalyticsService, SettingsService, AmenityService, PromotionService } from '../../api';
import { useToast } from '../../context/ToastContext';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type AdminTab = 'overview' | 'reservations' | 'inventory' | 'users' | 'reports' | 'settings' | 'payments';

export const AdminDashboard: React.FC = () => {
    const { t } = useTranslation();
    const { toast } = useToast();
    const [activeTab, setActiveTab] = useState<AdminTab>('overview');
    
    const [bookings, setBookings] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [rooms, setRooms] = useState<any[]>([]);
    const [roomTypes, setRoomTypes] = useState<any[]>([]);
    const [payments, setPayments] = useState<any[]>([]);
    const [amenities, setAmenities] = useState<any[]>([]);
    const [isAmenityModalOpen, setAmenityModalOpen] = useState(false);
    const [addAmenityForm, setAddAmenityForm] = useState({ name: '', description: '', icon: '' });

    const [analyticsOverview, setAnalyticsOverview] = useState<any>(null);
    const [todayStats, setTodayStats] = useState<any>(null);
    const [revenueData, setRevenueData] = useState<any[]>([]);
    const [occupancyData, setOccupancyData] = useState<any[]>([]);

    const [isWalkInModalOpen, setWalkInModalOpen] = useState(false);
    const [walkInForm, setWalkInForm] = useState({ userId: '', roomId: '', checkInDate: '', checkOutDate: '', totalPrice: 0 });
    
    const [editingBooking, setEditingBooking] = useState<any>(null);

    const [isAddCategoryModalOpen, setAddCategoryModalOpen] = useState(false);
    const [addCategoryForm, setAddCategoryForm] = useState({ name: '', description: '', basePrice: 0, maxGuests: 2, imageUrl: '', amenityIds: [] as number[] });
    const [editingCategory, setEditingCategory] = useState<any>(null);

    const [isAddRoomModalOpen, setAddRoomModalOpen] = useState(false);
    const [addRoomForm, setAddRoomForm] = useState({ roomNumber: '', roomTypeId: '', imageUrl: '', description: '', amenityIds: [] as number[] });
    const [editingRoom, setEditingRoom] = useState<any>(null);

    const [isAddStaffModalOpen, setAddStaffModalOpen] = useState(false);
    const [addStaffForm, setAddStaffForm] = useState({ firstName: '', lastName: '', email: '', password: '', phoneNumber: '' });
    const [editingStaffRole, setEditingStaffRole] = useState<any>(null);
    const [editingUser, setEditingUser] = useState<any>(null);
    
    const [viewingPayment, setViewingPayment] = useState<any>(null);

    const [settings, setSettings] = useState({
        hotelName: 'Lumière Hotel & Resort',
        taxRate: '8.5',
        currency: 'USD',
        breakfastPrice: 25.00,
        minNights: 1,
        maxNights: 30,
        maxGuestsPerBooking: 8,
        checkInTime: '14:00',
        checkOutTime: '11:00'
    });

    const [coupons, setCoupons] = useState<any[]>([]);
    const [newCoupon, setNewCoupon] = useState({ code: '', discountPercentage: 0 });

    const handleAddCoupon = async () => {
        if (!newCoupon.code || newCoupon.discountPercentage <= 0) return;
        try {
            await PromotionService.createPromotion({
                code: newCoupon.code,
                discountPercentage: newCoupon.discountPercentage,
                active: true
            });
            toast('Promotion added successfully', 'success');
            setNewCoupon({ code: '', discountPercentage: 0 });
            refreshData();
        } catch (e: any) {
            toast(e.message || 'Failed to add promotion', 'error');
        }
    };

    const handleDeleteCoupon = async (id: number) => {
        try {
            await PromotionService.deletePromotion(id);
            toast('Promotion removed', 'success');
            refreshData();
        } catch (e: any) {
            toast(e.message || 'Failed to remove promotion', 'error');
        }
    };

    const refreshData = async () => {
        try {
            const [bookingsRes, usersRes, roomsRes, roomTypesRes, paymentsRes, settingsRes, amenitiesRes, promotionsRes] = await Promise.all([
                BookingService.getAllBookings(),
                AuthService.getAllUsers(),
                InventoryService.getAllRooms(),
                InventoryService.getAllRoomTypes(),
                PaymentService.getAllPayments(),
                SettingsService.getSettings(),
                AmenityService.getAllAmenities(),
                PromotionService.getAllPromotions()
            ]);
            setBookings(bookingsRes);
            setUsers(usersRes);
            setRooms(roomsRes);
            setRoomTypes(roomTypesRes);
            setPayments(paymentsRes);
            setAmenities(amenitiesRes);
            setCoupons(promotionsRes);
            if (settingsRes) {
                setSettings({
                    hotelName: settingsRes.hotelName || 'Lumière Hotel & Resort',
                    taxRate: settingsRes.taxRate !== undefined ? settingsRes.taxRate.toString() : '8.5',
                    currency: settingsRes.currency || 'USD',
                    breakfastPrice: settingsRes.breakfastPrice !== undefined ? Number(settingsRes.breakfastPrice) : 25.00,
                    minNights: settingsRes.minNights || 1,
                    maxNights: settingsRes.maxNights || 30,
                    maxGuestsPerBooking: settingsRes.maxGuestsPerBooking || 8,
                    checkInTime: settingsRes.checkInTime || '14:00',
                    checkOutTime: settingsRes.checkOutTime || '11:00'
                });
            }
            
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
            console.error('Error fetching admin data', error);
        }
    };

    useEffect(() => {
        refreshData();
    }, []);

    // Calculate metrics
    const totalRooms = rooms.length || 24; // fallback to 24 if no rooms
    const bookedRooms = bookings.filter(b => ['CONFIRMED', 'CHECKED_IN'].includes(b.status)).length;
    
    const displayOccupancy = analyticsOverview ? Math.round(analyticsOverview.occupancyRate) : (totalRooms > 0 ? Math.round((bookedRooms / totalRooms) * 100) : 0);
    const displayRevenue = analyticsOverview ? analyticsOverview.totalRevenue.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : bookings.reduce((acc, curr) => acc + (Number(curr.totalPrice) || 0), 0).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    const displayAdr = analyticsOverview ? analyticsOverview.adr.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : '$0.00';
    const displayRevPar = analyticsOverview ? analyticsOverview.revPar.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : '$0.00';
    
    // Additional Operations Metrics
    const expectedCheckins = todayStats ? todayStats.arrivals : bookings.filter(b => b.status === 'CONFIRMED').length;
    const expectedCheckouts = todayStats ? todayStats.departures : bookings.filter(b => b.status === 'CHECKED_IN').length; // simple approximation
    const inHouseGuests = todayStats ? todayStats.inHouseGuests : bookings.filter(b => b.status === 'CHECKED_IN').length;

    const getUserName = (userId: string) => {
        const u = users.find(u => u.id === userId);
        return u ? `${u.firstName} ${u.lastName}` : userId.substring(0, 8);
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

    const handleRoomStatusChange = async (roomId: number, status: string) => {
        try {
            await InventoryService.updateRoomStatus(roomId, status);
            toast(`Room ${roomId} status updated to ${status}.`, 'success');
            refreshData();
        } catch (err: any) {
            toast(err.message || 'Failed to update room status.', 'error');
        }
    };

    const handleAddCategorySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await InventoryService.createRoomType(addCategoryForm);
            toast('Room category created successfully.', 'success');
            setAddCategoryModalOpen(false);
            setAddCategoryForm({ name: '', description: '', basePrice: 0, maxGuests: 2, imageUrl: '', amenityIds: [] });
            refreshData();
        } catch (err: any) {
            toast(err.message || 'Failed to create room category.', 'error');
        }
    };

    const handleAddRoomSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await InventoryService.createRoom(addRoomForm);
            toast('Room created successfully.', 'success');
            setAddRoomModalOpen(false);
            setAddRoomForm({ roomNumber: '', roomTypeId: '', imageUrl: '', description: '', amenityIds: [] });
            refreshData();
        } catch (err: any) {
            toast(err.message || 'Failed to create room.', 'error');
        }
    };

    const handleDeleteRoom = async (roomId: number) => {
        if (!window.confirm("Delete this room forever?")) return;
        try {
            await InventoryService.deleteRoom(roomId);
            toast('Room deleted.', 'success');
            refreshData();
        } catch (err: any) {
            toast(err.message || 'Failed to delete room.', 'error');
        }
    };

    const handleEditRoomSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await InventoryService.updateRoom(editingRoom.id, {
                roomNumber: editingRoom.roomNumber,
                roomTypeId: editingRoom.roomTypeId || editingRoom.roomType?.id,
                status: editingRoom.status || 'AVAILABLE',
                floor: editingRoom.floor || 1,
                imageUrl: editingRoom.imageUrl,
                description: editingRoom.description,
                amenityIds: (editingRoom.amenities || []).map((a: any) => a.id)
            });
            toast('Room updated.', 'success');
            setEditingRoom(null);
            refreshData();
        } catch (err: any) {
            toast(err.message || 'Failed to update room.', 'error');
        }
    };

    const handleEditCategorySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                ...editingCategory,
                amenityIds: (editingCategory.amenities || []).map((a: any) => a.id)
            };
            await InventoryService.updateRoomType(editingCategory.id, payload);
            toast('Room category updated.', 'success');
            setEditingCategory(null);
            refreshData();
        } catch (err: any) {
            toast(err.message || 'Failed to update category.', 'error');
        }
    };

    const handleDeleteCategory = async (categoryId: number) => {
        if (!window.confirm("Delete this room category forever?")) return;
        try {
            await InventoryService.deleteRoomType(categoryId);
            toast('Category deleted.', 'success');
            refreshData();
        } catch (err: any) {
            toast(err.message || 'Failed to delete category.', 'error');
        }
    };

    const handleAmenityToggle = (formState: any, setFormState: any, amenityId: number, isEdit: boolean = false) => {
        if (isEdit) {
            const currentAmenities = formState.amenities || [];
            const hasAmenity = currentAmenities.some((a: any) => a.id === amenityId);
            let newAmenities;
            if (hasAmenity) {
                newAmenities = currentAmenities.filter((a: any) => a.id !== amenityId);
            } else {
                const amenityToAdd = amenities.find(a => a.id === amenityId);
                newAmenities = [...currentAmenities, amenityToAdd];
            }
            setFormState({ ...formState, amenities: newAmenities });
        } else {
            const currentIds = formState.amenityIds || [];
            const newIds = currentIds.includes(amenityId) 
                ? currentIds.filter((id: number) => id !== amenityId)
                : [...currentIds, amenityId];
            setFormState({ ...formState, amenityIds: newIds });
        }
    };

    const handleAddAmenitySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await AmenityService.createAmenity(addAmenityForm);
            toast('Amenity created.', 'success');
            setAddAmenityForm({ name: '', description: '', icon: '' });
            setAmenityModalOpen(false);
            refreshData();
        } catch (err: any) {
            toast(err.message || 'Failed to create amenity.', 'error');
        }
    };

    const handleDeleteAmenity = async (id: number) => {
        if (!window.confirm("Delete this amenity?")) return;
        try {
            await AmenityService.deleteAmenity(id);
            toast('Amenity deleted.', 'success');
            refreshData();
        } catch (err: any) {
            toast(err.message || 'Failed to delete amenity.', 'error');
        }
    };

    const handleEditUserSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await AuthService.updateProfile(editingUser.id, editingUser);
            toast('User details updated.', 'success');
            setEditingUser(null);
            refreshData();
        } catch (err: any) {
            toast(err.message || 'Failed to update user.', 'error');
        }
    };

    const handleProcessRefund = async (paymentId: number) => {
        if (!window.confirm("Are you sure you want to process a refund for this payment?")) return;
        try {
            await PaymentService.processRefund(paymentId);
            toast('Refund processed successfully.', 'success');
            setViewingPayment(null);
            refreshData();
        } catch (err: any) {
            toast(err.message || 'Failed to process refund.', 'error');
        }
    };

    const handleSuspendAccount = async (userId: string) => {
        if (!window.confirm("Are you sure you want to suspend this account?")) return;
        try {
            await AuthService.deleteUser(userId);
            toast('User account suspended.', 'success');
            refreshData();
        } catch (err: any) {
            toast(err.message || 'Failed to suspend account.', 'error');
        }
    };

    const handleEditRoleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await AuthService.updateRole(editingStaffRole.id, editingStaffRole.role);
            toast('User role updated successfully.', 'success');
            setEditingStaffRole(null);
            refreshData();
        } catch (err: any) {
            toast(err.message || 'Failed to update user role.', 'error');
        }
    };

    const handleAddStaffSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await AuthService.register(addStaffForm);
            setAddStaffForm({ firstName: '', lastName: '', email: '', password: '', phoneNumber: '' });
            toast('Account created. Please assign a specific role if needed.', 'success');
            setAddStaffModalOpen(false);
            refreshData();
        } catch (err: any) {
            toast('Failed to register staff account.', 'error');
        }
    };

    const handleSaveSettings = async () => {
        try {
            await SettingsService.updateSettings({
                ...settings,
                taxRate: Number(settings.taxRate)
            });
            toast(`Global changes committed. ${settings.hotelName} config updated.`, 'success');
        } catch (error) {
            toast('Failed to save settings.', 'error');
            console.error(error);
        }
    };

    const handleExport = (type: string, format: 'CSV' | 'PDF') => {
        toast(`Generating ${type} in ${format}...`, 'info');
        setTimeout(() => {
            toast(`${type} ${format} exported successfully.`, 'success');
        }, 1500);
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
                    <button onClick={() => setActiveTab('payments')} className={`text-left py-4 border-t border-[#1A1A1A]/5 transition-colors relative ${activeTab === 'payments' ? 'text-[#1A1A1A] after:-left-4 after:top-1/2 after:-translate-y-1/2 after:absolute after:h-px after:w-2 after:bg-[#D4AF37]' : 'hover:text-[#D4AF37]'}`}>Payments</button>
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
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                            <Card className="p-8 border border-[#1A1A1A]/10 bg-white">
                                <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#6C6863] mb-2">{t('admin.overview.occupancy')}</p>
                                <p className="text-4xl font-serif text-[#1A1A1A]">{displayOccupancy}%</p>
                                <p className="text-xs text-green-600 mt-3 flex items-center gap-1 font-medium"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeWidth="2" d="M5 15l7-7 7 7"></path></svg> {t('admin.overview.occupancyChange')}</p>
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
                                <p className="text-xs text-green-400 mt-3 font-medium">{t('admin.overview.revenueChange')}</p>
                            </Card>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
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
                                            <span className="text-sm font-serif text-[#6C6863] block">{t('admin.overview.stayOvers', 'In-House Guests')}</span>
                                        </div>
                                        <span className="text-2xl font-serif text-[#1A1A1A]">{inHouseGuests}</span>
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
                            <h2 className="text-3xl font-serif text-[#1A1A1A]">{t('admin.reservations.title')} <span className="italic text-[#D4AF37]">{t('admin.reservations.titleItalic')}</span></h2>
                            <div className="flex gap-4">
                                <Button onClick={() => refreshData()} variant="ghost" className="border border-[#1A1A1A]/20 text-[10px] uppercase font-bold tracking-[0.1em] h-10 px-4 whitespace-nowrap">Refresh</Button>
                                <Button onClick={() => setWalkInModalOpen(true)} variant="ghost" className="border border-[#1A1A1A]/20 text-[10px] uppercase font-bold tracking-[0.1em] h-10 px-4 whitespace-nowrap">{t('admin.reservations.walkIn')}</Button>
                                <Button onClick={() => toast('Calendar View loading... connecting module.', 'info')} variant="primary" className="bg-[#1A1A1A] text-white hover:bg-[#D4AF37] transition-colors text-[10px] uppercase font-bold tracking-[0.1em] h-10 px-4 whitespace-nowrap">{t('admin.reservations.calendar')}</Button>
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
                                                <button onClick={() => setEditingBooking(booking)} className="text-[#D4AF37] hover:text-[#1A1A1A] uppercase tracking-widest font-bold text-[9px]">{t('admin.reservations.table.edit')}</button>
                                                <button onClick={() => handleCancelBooking(booking.id)} className="text-red-500 hover:text-red-800 uppercase tracking-widest font-bold text-[9px]">Cancel</button>
                                                {booking.status === 'CHECKED_IN' ? (
                                                    <button onClick={() => handleCheckOut(booking.id)} className="text-[#1A1A1A] hover:text-red-600 uppercase tracking-widest font-bold text-[9px]">{t('admin.reservations.table.checkOut')}</button>
                                                ) : booking.status === 'CONFIRMED' || booking.status === 'PENDING' ? (
                                                    <button onClick={() => handleCheckIn(booking.id)} className="text-[#1A1A1A] hover:text-green-600 uppercase tracking-widest font-bold text-[9px]">{t('admin.reservations.table.checkIn')}</button>
                                                ) : null}
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
                            <div className="flex gap-4">
                                <Button onClick={() => setAmenityModalOpen(true)} variant="ghost" className="border border-[#1A1A1A]/20 text-[10px] uppercase tracking-widest font-bold h-10 px-6">Amenities</Button>
                                <Button onClick={() => setAddRoomModalOpen(true)} variant="ghost" className="border border-[#1A1A1A]/20 text-[10px] uppercase tracking-widest font-bold h-10 px-6">Add Room</Button>
                                <Button onClick={() => setAddCategoryModalOpen(true)} variant="primary" className="bg-[#1A1A1A] hover:bg-[#D4AF37] transition-colors text-white text-[10px] uppercase tracking-widest font-bold h-10 px-6">{t('admin.inventory.addCategory')}</Button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                            <div className="lg:col-span-8">
                                <h3 className="text-[10px] uppercase font-bold tracking-[0.3em] text-[#1A1A1A] mb-6">{t('admin.inventory.roomStatus')}</h3>
                                <div className="space-y-4">
                                    {rooms.slice(0, 10).map((room, idx) => {
                                        const statusColors: any = {
                                            'AVAILABLE': 'border-l-green-500 text-green-700',
                                            'OCCUPIED': 'border-l-blue-500 text-blue-700',
                                            'CLEANING': 'border-l-yellow-500 text-yellow-700',
                                            'OUT_OF_ORDER': 'border-l-red-500 text-red-700',
                                        };
                                        const colorClass = statusColors[room.status] || 'border-l-gray-500';

                                        return (
                                        <Card key={idx} className={`p-0 border border-[#1A1A1A]/10 border-l-4 bg-white ${colorClass.split(' ')[0]} shadow-sm`}>
                                            <div className="flex flex-col sm:flex-row justify-between sm:items-center p-6 gap-4">
                                                <div className="flex items-center gap-4">
                                                    {room.imageUrl && (
                                                        <div className="w-12 h-12 rounded-sm overflow-hidden shrink-0">
                                                            <img src={room.imageUrl} alt={room.roomNumber} className="w-full h-full object-cover" />
                                                        </div>
                                                    )}
                                                    <div className="flex items-baseline gap-4">
                                                        <span className="font-serif text-3xl text-[#1A1A1A]">{room.roomNumber}</span>
                                                        <span className="text-sm font-serif italic text-[#6C6863]">Type {room.roomType?.id}</span>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                                    <span className={`text-[10px] uppercase tracking-widest font-bold ${colorClass.split(' ')[1]}`}>{room.status}</span>
                                                    <select value={room.status} onChange={(e) => handleRoomStatusChange(room.id, e.target.value)} className="text-[10px] uppercase font-bold tracking-widest border border-[#1A1A1A]/20 p-2 bg-[#F9F8F6] outline-none hover:border-[#D4AF37] transition-colors cursor-pointer">
                                                        <option value="AVAILABLE">{t('admin.inventory.available')}</option>
                                                        <option value="OCCUPIED">{t('admin.inventory.occupied')}</option>
                                                        <option value="CLEANING">{t('admin.inventory.cleaning')}</option>
                                                        <option value="OUT_OF_ORDER">{t('admin.inventory.maintenance')}</option>
                                                    </select>
                                                    <div className="flex gap-2">
                                                        <button onClick={() => setEditingRoom(room)} className="text-[#D4AF37] hover:text-[#1A1A1A] uppercase tracking-widest font-bold text-[9px]">Edit</button>
                                                        <button onClick={() => handleDeleteRoom(room.id)} className="text-red-500 hover:text-red-800 uppercase tracking-widest font-bold text-[9px]">Delete</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    )})}
                                    {rooms.length === 0 && <p className="text-sm italic text-[#6C6863]">No rooms managed yet.</p>}
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
                                            
                                            <div className="flex gap-2 mb-4">
                                                <Input 
                                                    placeholder="CODE (e.g. SUMMER20)" 
                                                    value={newCoupon.code} 
                                                    onChange={e => setNewCoupon({...newCoupon, code: e.target.value.toUpperCase()})}
                                                    className="w-1/2 uppercase font-mono text-sm"
                                                />
                                                <Input 
                                                    type="number"
                                                    min="0" max="100"
                                                    placeholder="Discount %" 
                                                    value={newCoupon.discountPercentage} 
                                                    onChange={e => setNewCoupon({...newCoupon, discountPercentage: Number(e.target.value)})}
                                                    className="w-1/2 text-sm"
                                                />
                                                <Button type="button" onClick={handleAddCoupon} variant="primary" className="bg-[#1A1A1A] hover:bg-[#D4AF37] text-white text-[10px] uppercase px-4 h-10">Add</Button>
                                            </div>

                                            <div className="space-y-2">
                                                {coupons.map((c, i) => (
                                                    <div key={c.id} className={`flex items-center justify-between p-3 rounded-sm ${i % 2 === 0 ? 'bg-[#1A1A1A] text-white' : 'bg-[#F9F8F6] border border-[#1A1A1A]/10 text-[#1A1A1A]'}`}>
                                                        <span className="font-mono text-sm tracking-widest font-bold">{c.code}</span>
                                                        <div className="flex items-center gap-4">
                                                            <span className={`text-[10px] uppercase font-bold ${i % 2 === 0 ? 'text-[#D4AF37]' : 'text-[#6C6863]'}`}>{c.discountPercentage}% Off</span>
                                                            <button onClick={() => handleDeleteCoupon(c.id)} className="text-[10px] uppercase text-red-500 hover:text-red-700 font-bold ml-2">Del</button>
                                                        </div>
                                                    </div>
                                                ))}
                                                {coupons.length === 0 && <p className="text-xs text-[#6C6863] italic">No active promotions</p>}
                                            </div>
                                        </div>

                                        <div className="pt-4 border-t border-[#1A1A1A]/10">
                                            <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#6C6863] mb-4 block">Room Categories</label>
                                            <div className="space-y-3">
                                                {roomTypes.map(rt => (
                                                    <div key={rt.id} className="flex flex-col gap-2 p-3 border border-[#1A1A1A]/10 bg-[#F9F8F6]">
                                                        <div className="flex justify-between items-center">
                                                            <span className="font-bold text-sm text-[#1A1A1A]">{rt.name}</span>
                                                            <span className="text-[#D4AF37] font-mono text-sm">${rt.basePrice}</span>
                                                        </div>
                                                        <div className="flex justify-between items-center mt-2">
                                                            <span className="text-[10px] uppercase text-[#6C6863] tracking-widest">Cap: {rt.defaultCapacity || rt.capacity}</span>
                                                            <div className="flex gap-3">
                                                                <button onClick={() => setEditingCategory(rt)} className="text-[9px] uppercase tracking-widest font-bold text-[#D4AF37] hover:text-[#1A1A1A]">Edit</button>
                                                                <button onClick={() => handleDeleteCategory(rt.id)} className="text-[9px] uppercase tracking-widest font-bold text-red-500 hover:text-red-800">Delete</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <Button onClick={() => toast('Pricing Configuration unlocked check your network for integrations.', 'info')} variant="ghost" className="border border-[#1A1A1A]/20 w-full text-[10px] uppercase tracking-widest font-bold h-10 mt-4 border-dashed border-[#1A1A1A]/20">{t('admin.inventory.editPricing')}</Button>
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
                            <Button onClick={() => setAddStaffModalOpen(true)} variant="ghost" className="border border-[#1A1A1A]/20 text-[10px] uppercase tracking-widest font-bold h-10 px-6">{t('admin.users.addNew')}</Button>
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
                                                    <button onClick={() => setEditingUser(staff)} className="text-[#D4AF37] hover:text-[#1A1A1A] uppercase tracking-widest font-bold text-[9px] mr-4">Edit Profile</button>
                                                    <button onClick={() => setEditingStaffRole(staff)} className="text-[#D4AF37] hover:text-[#1A1A1A] uppercase tracking-widest font-bold text-[9px] mr-4">{t('admin.users.actions.edit')}</button>
                                                    <button onClick={() => handleSuspendAccount(staff.id)} className="text-red-500 hover:text-red-800 uppercase tracking-widest font-bold text-[9px]">{t('admin.users.actions.suspend')}</button>
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
                {/* Payments */}
                {activeTab === 'payments' && (
                    <div className="animate-in fade-in duration-500">
                        <div className="flex justify-between items-end border-b border-[#1A1A1A]/20 pb-4 mb-8">
                            <h2 className="text-3xl font-serif text-[#1A1A1A]">Payment Management <span className="italic text-[#D4AF37]">Ledger</span></h2>
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
                                                    <button onClick={() => setViewingPayment(p)} className="text-[#D4AF37] hover:text-[#1A1A1A] uppercase tracking-widest font-bold text-[9px] mr-4">View</button>
                                                    {p.status === 'COMPLETED' && (
                                                        <button onClick={() => handleProcessRefund(p.id)} className="text-red-500 hover:text-red-800 uppercase tracking-widest font-bold text-[9px]">Refund</button>
                                                    )}
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
                                    <Button onClick={() => handleExport('Revenue Ledger', 'CSV')} variant="ghost" className="border border-[#1A1A1A]/20 justify-between text-[10px] h-12 uppercase tracking-widest font-bold border-[#1A1A1A]/20 hover:border-[#1A1A1A] group"><span>{t('admin.reports.revenueLedger')}</span> <span className="text-[#D4AF37] group-hover:text-[#1A1A1A]">{t('admin.reports.exportCSV')}</span></Button>
                                    <Button onClick={() => handleExport('Tax Remittance', 'PDF')} variant="ghost" className="border border-[#1A1A1A]/20 justify-between text-[10px] h-12 uppercase tracking-widest font-bold border-[#1A1A1A]/20 hover:border-[#1A1A1A] group"><span>{t('admin.reports.taxRemittance')}</span> <span className="text-red-600 group-hover:text-[#1A1A1A]">{t('admin.reports.downloadPDF')}</span></Button>
                                </div>
                            </Card>

                            <Card className="p-8 border border-[#1A1A1A]/10 bg-white">
                                <div className="border-b border-[#1A1A1A]/10 pb-6 mb-6">
                                    <h3 className="text-lg font-serif text-[#1A1A1A] mb-1">{t('admin.reports.operational')}</h3>
                                    <p className="text-xs text-[#6C6863]">{t('admin.reports.operationalDesc')}</p>
                                </div>
                                <div className="space-y-4 flex flex-col">
                                    <Button onClick={() => handleExport('Housekeeping Route', 'PDF')} variant="ghost" className="border border-[#1A1A1A]/20 justify-between text-[10px] h-12 uppercase tracking-widest font-bold border-[#1A1A1A]/20 hover:border-[#1A1A1A] group"><span>{t('admin.reports.housekeepingRoute')}</span> <span className="text-red-600 group-hover:text-[#1A1A1A]">{t('admin.reports.printPDF')}</span></Button>
                                    <Button onClick={() => handleExport('Occupancy Forecast', 'CSV')} variant="ghost" className="border border-[#1A1A1A]/20 justify-between text-[10px] h-12 uppercase tracking-widest font-bold border-[#1A1A1A]/20 hover:border-[#1A1A1A] group"><span>{t('admin.reports.occupancyForecast')}</span> <span className="text-[#D4AF37] group-hover:text-[#1A1A1A]">{t('admin.reports.exportCSV')}</span></Button>
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
                                        <input type="text" value={settings.hotelName} onChange={(e) => setSettings({ ...settings, hotelName: e.target.value })} className="w-full border-b border-[#1A1A1A]/20 bg-transparent outline-none focus:border-[#D4AF37] pb-2 font-serif text-xl text-[#1A1A1A]" />
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                        <div>
                                            <label className="text-[10px] uppercase tracking-[0.2em] font-medium text-[#6C6863] mb-2 block">{t('admin.settings.taxRate')}</label>
                                            <input type="text" value={settings.taxRate} onChange={(e) => setSettings({ ...settings, taxRate: e.target.value })} className="w-full border-b border-[#1A1A1A]/20 bg-transparent outline-none focus:border-[#D4AF37] pb-2 font-mono text-lg text-[#1A1A1A]" />
                                        </div>
                                        <div>
                                            <label className="text-[10px] uppercase tracking-[0.2em] font-medium text-[#6C6863] mb-2 block">{t('admin.settings.currency')}</label>
                                            <select value={settings.currency} onChange={(e) => setSettings({ ...settings, currency: e.target.value })} className="w-full border-b border-[#1A1A1A]/20 bg-transparent outline-none focus:border-[#D4AF37] pb-2 font-mono text-lg text-[#1A1A1A]">
                                                <option value="USD">USD ($)</option>
                                                <option value="EUR">EUR (€)</option>
                                                <option value="VND">VND (₫)</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                        <div>
                                            <label className="text-[10px] uppercase tracking-[0.2em] font-medium text-[#6C6863] mb-2 block">Breakfast Price</label>
                                            <input type="number" min="0" step="0.5" value={settings.breakfastPrice} onChange={(e) => setSettings({ ...settings, breakfastPrice: Number(e.target.value) })} className="w-full border-b border-[#1A1A1A]/20 bg-transparent outline-none focus:border-[#D4AF37] pb-2 font-mono text-lg text-[#1A1A1A]" />
                                        </div>
                                        <div>
                                            <label className="text-[10px] uppercase tracking-[0.2em] font-medium text-[#6C6863] mb-2 block">Max Guests per Booking</label>
                                            <input type="number" min="1" value={settings.maxGuestsPerBooking} onChange={(e) => setSettings({ ...settings, maxGuestsPerBooking: Number(e.target.value) })} className="w-full border-b border-[#1A1A1A]/20 bg-transparent outline-none focus:border-[#D4AF37] pb-2 font-mono text-lg text-[#1A1A1A]" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                        <div>
                                            <label className="text-[10px] uppercase tracking-[0.2em] font-medium text-[#6C6863] mb-2 block">Min Nights</label>
                                            <input type="number" min="1" value={settings.minNights} onChange={(e) => setSettings({ ...settings, minNights: Number(e.target.value) })} className="w-full border-b border-[#1A1A1A]/20 bg-transparent outline-none focus:border-[#D4AF37] pb-2 font-mono text-lg text-[#1A1A1A]" />
                                        </div>
                                        <div>
                                            <label className="text-[10px] uppercase tracking-[0.2em] font-medium text-[#6C6863] mb-2 block">Max Nights</label>
                                            <input type="number" min="1" value={settings.maxNights} onChange={(e) => setSettings({ ...settings, maxNights: Number(e.target.value) })} className="w-full border-b border-[#1A1A1A]/20 bg-transparent outline-none focus:border-[#D4AF37] pb-2 font-mono text-lg text-[#1A1A1A]" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                        <div>
                                            <label className="text-[10px] uppercase tracking-[0.2em] font-medium text-[#6C6863] mb-2 block">Check-in Time</label>
                                            <input type="time" value={settings.checkInTime} onChange={(e) => setSettings({ ...settings, checkInTime: e.target.value })} className="w-full border-b border-[#1A1A1A]/20 bg-transparent outline-none focus:border-[#D4AF37] pb-2 font-mono text-lg text-[#1A1A1A]" />
                                        </div>
                                        <div>
                                            <label className="text-[10px] uppercase tracking-[0.2em] font-medium text-[#6C6863] mb-2 block">Check-out Time</label>
                                            <input type="time" value={settings.checkOutTime} onChange={(e) => setSettings({ ...settings, checkOutTime: e.target.value })} className="w-full border-b border-[#1A1A1A]/20 bg-transparent outline-none focus:border-[#D4AF37] pb-2 font-mono text-lg text-[#1A1A1A]" />
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            {/* Integrations */}
                            <Card className="p-8 border border-[#1A1A1A]/10 bg-[#1A1A1A] hover:!bg-[#2A2A2A] text-white transition-colors duration-300">
                                <h3 className="text-[10px] uppercase font-bold tracking-[0.3em] text-[#F9F8F6]/50 mb-8 pb-4 border-b border-white/10">{t('admin.settings.integrations')}</h3>
                                <div className="space-y-6">
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 bg-white/5 p-6 border border-white/10">
                                        <div>
                                            <p className="text-sm font-bold text-white mb-1">Payment Gateway (Stripe)</p>
                                            <p className="text-[10px] uppercase tracking-widest text-[#D4AF37]">● {t('admin.settings.apiActive')}</p>
                                        </div>
                                        <Button onClick={() => toast('Stripe Token refreshed successfully.', 'success')} variant="ghost" className="border border-[#1A1A1A]/20 text-[10px] uppercase tracking-widest font-bold h-8 border-white/20 hover:border-white text-white hover:text-[#1A1A1A] hover:bg-white transition-colors">{t('admin.settings.renewToken')}</Button>
                                    </div>
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 bg-white/5 p-6 border border-white/10">
                                        <div>
                                            <p className="text-sm font-bold text-white mb-1">SMS Notifications (Twilio)</p>
                                            <p className="text-[10px] uppercase tracking-widest text-red-500">○ {t('admin.settings.disconnected')}</p>
                                        </div>
                                        <Button onClick={() => toast('Redirecting to Twilio Connect...', 'info')} variant="ghost" className="border border-[#1A1A1A]/20 text-[10px] uppercase tracking-widest font-bold h-8 border-white/20 hover:border-white text-white bg-white/10 hover:text-[#1A1A1A] hover:bg-white transition-colors">{t('admin.settings.provideKey')}</Button>
                                    </div>
                                </div>
                            </Card>

                            <div className="flex justify-end pt-4">
                                <Button onClick={handleSaveSettings} variant="primary" className="bg-[#D4AF37] hover:bg-[#1A1A1A] text-white text-[10px] uppercase tracking-[0.2em] font-bold h-12 px-12 transition-colors">{t('admin.settings.saveChanges')}</Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Modals placed here for safe DOM rendering */}
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
                            {rooms.filter(r => r.status === 'AVAILABLE').map(r => <option key={r.id} value={r.id}>Room {r.roomNumber} - {r.roomType?.name}</option>)}
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Input type="date" label="Check In" value={walkInForm.checkInDate} onChange={(e) => setWalkInForm({ ...walkInForm, checkInDate: e.target.value })} required />
                        <Input type="date" label="Check Out" value={walkInForm.checkOutDate} onChange={(e) => setWalkInForm({ ...walkInForm, checkOutDate: e.target.value })} required />
                    </div>
                    <Input type="number" label="Total Price (USD)" value={walkInForm.totalPrice} onChange={(e) => setWalkInForm({ ...walkInForm, totalPrice: Number(e.target.value) })} required />
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
                                {rooms.filter(r => r.status === 'AVAILABLE').map(r => <option key={r.id} value={r.id}>Room {r.roomNumber} - {r.roomType?.name}</option>)}
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

            <Modal isOpen={isAddCategoryModalOpen} onClose={() => setAddCategoryModalOpen(false)} title="Add Room Category">
                <form onSubmit={handleAddCategorySubmit} className="space-y-4">
                    <Input type="text" label="Category Name" value={addCategoryForm.name} onChange={(e) => setAddCategoryForm({ ...addCategoryForm, name: e.target.value })} required />
                    <Input type="text" label="Description" value={addCategoryForm.description} onChange={(e) => setAddCategoryForm({ ...addCategoryForm, description: e.target.value })} required />
                    <div>
                        <label className="text-[10px] uppercase font-bold text-[#6C6863] block mb-2">Amenities</label>
                        <div className="grid grid-cols-2 gap-2">
                            {amenities.map(a => (
                                <label key={a.id} className="flex items-center gap-2 text-sm cursor-pointer">
                                    <input type="checkbox" checked={addCategoryForm.amenityIds.includes(a.id)} onChange={() => handleAmenityToggle(addCategoryForm, setAddCategoryForm, a.id, false)} className="accent-[#1A1A1A]" />
                                    {a.name}
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Input type="number" label="Base Price (USD)" value={addCategoryForm.basePrice} onChange={(e) => setAddCategoryForm({ ...addCategoryForm, basePrice: Number(e.target.value) })} required />
                        <Input type="number" label="Capacity (Guests)" value={addCategoryForm.maxGuests} onChange={(e) => setAddCategoryForm({ ...addCategoryForm, maxGuests: Number(e.target.value) })} required />
                    </div>
                    <Button type="submit" variant="primary" className="w-full mt-4 bg-[#1A1A1A] text-white">Add Category</Button>
                </form>
            </Modal>

            <Modal isOpen={isAddRoomModalOpen} onClose={() => setAddRoomModalOpen(false)} title="Add Room">
                <form onSubmit={handleAddRoomSubmit} className="space-y-4">
                    <Input type="text" label="Room Number" value={addRoomForm.roomNumber} onChange={(e) => setAddRoomForm({ ...addRoomForm, roomNumber: e.target.value })} required />
                    <Input type="text" label="Description" value={addRoomForm.description} onChange={(e) => setAddRoomForm({ ...addRoomForm, description: e.target.value })} />
                    <div>
                        <label className="text-[10px] uppercase font-bold text-[#6C6863] block mb-2">Amenities</label>
                        <div className="grid grid-cols-2 gap-2">
                            {amenities.map(a => (
                                <label key={a.id} className="flex items-center gap-2 text-sm cursor-pointer">
                                    <input type="checkbox" checked={addRoomForm.amenityIds.includes(a.id)} onChange={() => handleAmenityToggle(addRoomForm, setAddRoomForm, a.id, false)} className="accent-[#1A1A1A]" />
                                    {a.name}
                                </label>
                            ))}
                        </div>
                    </div>
                    <Input type="text" label="Image URL" value={addRoomForm.imageUrl} onChange={(e) => setAddRoomForm({ ...addRoomForm, imageUrl: e.target.value })} placeholder="/images/rooms/your-image.jpg" />
                    <div>
                        <label className="text-[10px] uppercase font-bold text-[#6C6863] block mb-1">Room Category</label>
                        <select className="w-full p-3 border border-[#1A1A1A]/20 bg-[#F9F8F6] text-sm" value={addRoomForm.roomTypeId} onChange={(e) => setAddRoomForm({ ...addRoomForm, roomTypeId: e.target.value })} required>
                            <option value="">-- Choose Category --</option>
                            {roomTypes.map(rt => <option key={rt.id} value={rt.id}>{rt.name}</option>)}
                        </select>
                    </div>
                    <Button type="submit" variant="primary" className="w-full mt-4 bg-[#1A1A1A] text-white">Add Room</Button>
                </form>
            </Modal>

            <Modal isOpen={isAddStaffModalOpen} onClose={() => setAddStaffModalOpen(false)} title="Register New Account">
                <form onSubmit={handleAddStaffSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <Input type="text" label="First Name" value={addStaffForm.firstName} onChange={(e) => setAddStaffForm({ ...addStaffForm, firstName: e.target.value })} required />
                        <Input type="text" label="Last Name" value={addStaffForm.lastName} onChange={(e) => setAddStaffForm({ ...addStaffForm, lastName: e.target.value })} required />
                    </div>
                    <Input type="email" label="Email Address" value={addStaffForm.email} onChange={(e) => setAddStaffForm({ ...addStaffForm, email: e.target.value })} required />
                    <Input type="password" label="Temporary Password" value={addStaffForm.password} onChange={(e) => setAddStaffForm({ ...addStaffForm, password: e.target.value })} required />
                    <Input type="tel" label="Phone Number" value={addStaffForm.phoneNumber} onChange={(e) => setAddStaffForm({ ...addStaffForm, phoneNumber: e.target.value })} required />
                    <Button type="submit" variant="primary" className="w-full mt-4 bg-[#1A1A1A] text-white">Register Account</Button>
                </form>
            </Modal>

            <Modal isOpen={!!editingStaffRole} onClose={() => setEditingStaffRole(null)} title="Modify User Role">
                {editingStaffRole && (
                    <form onSubmit={handleEditRoleSubmit} className="space-y-4">
                        <div>
                            <label className="text-[10px] uppercase font-bold text-[#6C6863] block mb-1">Assign Role</label>
                            <select className="w-full p-3 border border-[#1A1A1A]/20 bg-[#F9F8F6] text-sm" value={editingStaffRole.role} onChange={(e) => setEditingStaffRole({ ...editingStaffRole, role: e.target.value })} required>
                                <option value="GUEST">Guest</option>
                                <option value="USER">Standard User</option>
                                <option value="STAFF">Hotel Staff</option>
                                <option value="MANAGER">Manager</option>
                                <option value="ADMIN">Administrator</option>
                            </select>
                        </div>
                        <Button type="submit" variant="primary" className="w-full mt-4 bg-[#1A1A1A] text-white">Update Role</Button>
                    </form>
                )}
            </Modal>
            <Modal isOpen={!!editingCategory} onClose={() => setEditingCategory(null)} title="Edit Room Category">
                {editingCategory && (
                    <form onSubmit={handleEditCategorySubmit} className="space-y-4">
                        <Input type="text" label="Category Name" value={editingCategory.name} onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })} required />
                        <Input type="text" label="Description" value={editingCategory.description} onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })} required />
                        <div>
                            <label className="text-[10px] uppercase font-bold text-[#6C6863] block mb-2">Amenities</label>
                            <div className="grid grid-cols-2 gap-2">
                                {amenities.map(a => (
                                    <label key={a.id} className="flex items-center gap-2 text-sm cursor-pointer">
                                        <input type="checkbox" checked={(editingCategory.amenities || []).some((am: any) => am.id === a.id)} onChange={() => handleAmenityToggle(editingCategory, setEditingCategory, a.id, true)} className="accent-[#1A1A1A]" />
                                        {a.name}
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <Input type="number" label="Base Price (USD)" value={editingCategory.basePrice} onChange={(e) => setEditingCategory({ ...editingCategory, basePrice: Number(e.target.value) })} required />
                            <Input type="number" label="Capacity (Guests)" value={editingCategory.defaultCapacity || editingCategory.capacity} onChange={(e) => setEditingCategory({ ...editingCategory, defaultCapacity: Number(e.target.value) })} required />
                        </div>
                        <Button type="submit" variant="primary" className="w-full mt-4 bg-[#1A1A1A] text-white">Save Changes</Button>
                    </form>
                )}
            </Modal>

            <Modal isOpen={!!editingRoom} onClose={() => setEditingRoom(null)} title="Edit Room">
                {editingRoom && (
                    <form onSubmit={handleEditRoomSubmit} className="space-y-4">
                        <Input type="text" label="Room Number" value={editingRoom.roomNumber} onChange={(e) => setEditingRoom({ ...editingRoom, roomNumber: e.target.value })} required />
                        <Input type="text" label="Description" value={editingRoom.description || ''} onChange={(e) => setEditingRoom({ ...editingRoom, description: e.target.value })} />
                        <div>
                            <label className="text-[10px] uppercase font-bold text-[#6C6863] block mb-2">Amenities</label>
                            <div className="grid grid-cols-2 gap-2">
                                {amenities.map(a => (
                                    <label key={a.id} className="flex items-center gap-2 text-sm cursor-pointer">
                                        <input type="checkbox" checked={(editingRoom.amenities || []).some((am: any) => am.id === a.id)} onChange={() => handleAmenityToggle(editingRoom, setEditingRoom, a.id, true)} className="accent-[#1A1A1A]" />
                                        {a.name}
                                    </label>
                                ))}
                            </div>
                        </div>
                        <Input type="text" label="Image URL" value={editingRoom.imageUrl || ''} onChange={(e) => setEditingRoom({ ...editingRoom, imageUrl: e.target.value })} placeholder="/images/rooms/your-image.jpg" />
                        <div>
                            <label className="text-[10px] uppercase font-bold text-[#6C6863] block mb-1">Room Category</label>
                            <select className="w-full p-3 border border-[#1A1A1A]/20 bg-[#F9F8F6] text-sm" value={editingRoom.roomTypeId || editingRoom.roomType?.id || ''} onChange={(e) => setEditingRoom({ ...editingRoom, roomTypeId: e.target.value })} required>
                                <option value="">-- Choose Category --</option>
                                {roomTypes.map(rt => <option key={rt.id} value={rt.id}>{rt.name}</option>)}
                            </select>
                        </div>
                        <Button type="submit" variant="primary" className="w-full mt-4 bg-[#1A1A1A] text-white">Save Changes</Button>
                    </form>
                )}
            </Modal>

            <Modal isOpen={!!editingUser} onClose={() => setEditingUser(null)} title="Edit Profile">
                {editingUser && (
                    <form onSubmit={handleEditUserSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <Input type="text" label="First Name" value={editingUser.firstName} onChange={(e) => setEditingUser({ ...editingUser, firstName: e.target.value })} required />
                            <Input type="text" label="Last Name" value={editingUser.lastName} onChange={(e) => setEditingUser({ ...editingUser, lastName: e.target.value })} required />
                        </div>
                        <Input type="email" label="Email Address" value={editingUser.email} onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })} required />
                        <Input type="text" label="Phone Number" value={editingUser.phoneNumber || ''} onChange={(e) => setEditingUser({ ...editingUser, phoneNumber: e.target.value })} />
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
                        {viewingPayment.status === 'COMPLETED' && (
                            <Button onClick={() => handleProcessRefund(viewingPayment.id)} variant="primary" className="w-full mt-4 bg-red-600 text-white">Process Refund</Button>
                        )}
                    </div>
                )}
            </Modal>
            <Modal isOpen={isAmenityModalOpen} onClose={() => setAmenityModalOpen(false)} title="Manage Amenities">
                <div className="space-y-6">
                    <form onSubmit={handleAddAmenitySubmit} className="flex gap-2 items-end">
                        <div className="flex-1">
                            <Input type="text" label="New Amenity Name" value={addAmenityForm.name} onChange={(e) => setAddAmenityForm({ ...addAmenityForm, name: e.target.value })} required />
                        </div>
                        <Button type="submit" variant="primary" className="bg-[#1A1A1A] text-white whitespace-nowrap h-12">Add</Button>
                    </form>
                    <div className="border-t border-[#1A1A1A]/10 pt-4 max-h-60 overflow-y-auto space-y-2">
                        {amenities.map(a => (
                            <div key={a.id} className="flex justify-between items-center bg-[#F9F8F6] p-3 rounded">
                                <span className="text-sm font-serif">{a.name}</span>
                                <button onClick={() => handleDeleteAmenity(a.id)} className="text-red-500 hover:text-red-700 text-xs font-bold uppercase">Delete</button>
                            </div>
                        ))}
                        {amenities.length === 0 && <p className="text-sm text-[#6C6863] italic">No amenities found.</p>}
                    </div>
                </div>
            </Modal>
        </div>
    );
};
