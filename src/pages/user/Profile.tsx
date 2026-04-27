import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import { BookingService, AuthService, PaymentService } from '../../api';

type Tab = 'active' | 'bookings' | 'profile' | 'payment' | 'preferences';

export const Profile: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { user, login, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('active');

  // Profile update state
  const [isUpdating, setIsUpdating] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phoneNumber: user?.phoneNumber || ''
  });
  const [updateMsg, setUpdateMsg] = useState('');

  // Password update state
  const [pwdData, setPwdData] = useState({ oldPassword: '', newPassword: '' });
  const [isChangingPwd, setIsChangingPwd] = useState(false);
  
  // Deactivate account state
  const [isDeactivating, setIsDeactivating] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const language = i18n.language.toUpperCase() === 'VI' ? 'VN' : i18n.language.toUpperCase();
  const setLanguage = (lang: string) => {
    const code = lang === 'VN' ? 'vi' : 'en';
    i18n.changeLanguage(code);
  };

  const [dbBookings, setDbBookings] = useState<any[]>([]);
  const hasActiveStay = dbBookings.some((b) => b.status === 'CONFIRMED' || b.status === 'CHECKED_IN');

  useEffect(() => {
    if (user?.id) {
      BookingService.getUserBookings(user.id)
        .then((res: any[]) => setDbBookings(res))
        .catch((err) => console.error('Failed to load bookings', err));
    }
  }, [user]);

  const upcomingBookings = dbBookings.filter((b) => ['PENDING', 'CONFIRMED'].includes(b.status));
  const pastBookings = dbBookings.filter((b) => ['COMPLETED', 'CANCELLED'].includes(b.status));
  const currentStay = dbBookings.find((b) => b.status === 'CONFIRMED' || b.status === 'CHECKED_IN');

  const getFallbackImage = () => 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&auto=format&fit=crop&q=60';

  const savedPayments = [
    { id: 'pm_1', card: 'Visa', last4: '1234', exp: '12/28' }
  ];

  const handleUpdateProfile = async () => {
    if (!user?.id) return;
    setIsUpdating(true);
    setUpdateMsg('');
    try {
      await AuthService.updateProfile(user.id, profileData);
      
      // Update global context
      const token = localStorage.getItem('auth_token');
      if (token) {
          await login(token, user.id);
      }
      toast(t('profile.accountSettings.updateSuccess') || "Profile updated successfully!", 'success');
      setUpdateMsg(t('profile.accountSettings.updateSuccess') || "Profile updated successfully!");
    } catch (err: any) {
      toast(err.message || "Failed to update profile.", 'error');
      setUpdateMsg(err.message || "Failed to update profile.");
    } finally {
      setIsUpdating(false);
      setTimeout(() => setUpdateMsg(''), 3000);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;
    setIsChangingPwd(true);
    try {
        await AuthService.changePassword(user.id, pwdData);
        toast('Password changed successfully!', 'success');
        setPwdData({ oldPassword: '', newPassword: '' });
    } catch (err: any) {
        toast(err.message || 'Failed to change password.', 'error');
    } finally {
        setIsChangingPwd(false);
    }
  };

  const handleDeactivateAccount = async () => {
    if (!window.confirm("Are you sure you want to deactivate your account? This action cannot be undone.")) return;
    if (!user?.id) return;
    setIsDeactivating(true);
    try {
        await AuthService.deleteUser(user.id);
        toast('Account deactivated successfully.', 'info');
        logout();
        navigate('/');
    } catch(err: any) {
        toast(err.message || 'Failed to deactivate account', 'error');
        setIsDeactivating(false);
    }
  };

  const handleCancelReservation = async (id: number) => {
    if (!window.confirm("Are you sure you want to cancel this reservation?")) return;
    try {
        await BookingService.cancelBooking(id);
        toast('Reservation cancelled successfully', 'success');
        setDbBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'CANCELLED' } : b));
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

  return (
    <div className="max-w-[1600px] mx-auto w-full px-8 md:px-16 pt-24 pb-40">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-x-12">
        
        {/* Sidebar Nav */}
        <div className="lg:col-span-3 border-b lg:border-b-0 lg:border-r border-[#1A1A1A]/10 pb-8 lg:pb-0 h-[max-content]">
          <h1 className="text-4xl md:text-5xl font-serif text-[#1A1A1A] mb-[2px]">
            {t('profile.welcome')}
          </h1>
          <h2 className="text-3xl font-serif italic text-[#D4AF37] mb-12">
            {user?.firstName} {user?.lastName}
          </h2>

          <nav className="flex flex-col space-y-2 text-xs uppercase tracking-[0.2em] font-medium text-[#6C6863]">
            {hasActiveStay && (
              <button 
                onClick={() => setActiveTab('active')} 
                className={`text-left py-3 transition-colors relative ${activeTab === 'active' ? 'text-[#D4AF37] after:-left-4 after:top-1/2 after:-translate-y-1/2 after:absolute after:h-px after:w-2 after:bg-[#D4AF37]' : 'hover:text-[#1A1A1A]'}`}
              >
                {t('profile.activeStay')}
              </button>
            )}
            
            <button 
              onClick={() => setActiveTab('bookings')} 
              className={`text-left py-3 border-t border-[#1A1A1A]/5 transition-colors relative ${activeTab === 'bookings' ? 'text-[#D4AF37] after:-left-4 after:top-1/2 after:-translate-y-1/2 after:absolute after:h-px after:w-2 after:bg-[#D4AF37]' : 'hover:text-[#1A1A1A]'}`}
            >
              {t('profile.reservations')}
            </button>
            <button 
              onClick={() => setActiveTab('profile')} 
              className={`text-left py-3 border-t border-[#1A1A1A]/5 transition-colors relative ${activeTab === 'profile' ? 'text-[#D4AF37] after:-left-4 after:top-1/2 after:-translate-y-1/2 after:absolute after:h-px after:w-2 after:bg-[#D4AF37]' : 'hover:text-[#1A1A1A]'}`}
            >
              {t('profile.management')}
            </button>
            <button 
              onClick={() => setActiveTab('payment')} 
              className={`text-left py-3 border-t border-[#1A1A1A]/5 transition-colors relative ${activeTab === 'payment' ? 'text-[#D4AF37] after:-left-4 after:top-1/2 after:-translate-y-1/2 after:absolute after:h-px after:w-2 after:bg-[#D4AF37]' : 'hover:text-[#1A1A1A]'}`}
            >
              {t('profile.payment')}
            </button>
            <button 
              onClick={() => setActiveTab('preferences')} 
              className={`text-left py-3 border-t border-[#1A1A1A]/5 transition-colors relative ${activeTab === 'preferences' ? 'text-[#D4AF37] after:-left-4 after:top-1/2 after:-translate-y-1/2 after:absolute after:h-px after:w-2 after:bg-[#D4AF37]' : 'hover:text-[#1A1A1A]'}`}
            >
              {t('profile.preferences')}
            </button>

            <button 
              onClick={handleLogout}
              className="text-left py-4 mt-8 text-[#1A1A1A] hover:text-red-500 transition-colors uppercase font-bold tracking-[0.2em] border border-[#1A1A1A]/10 px-4 text-center"
            >
              {t('profile.signOut')}
            </button>
          </nav>
        </div>

        {/* Dynamic Content Pane */}
        <div className="lg:col-span-8 lg:col-start-5 pt-4">
          
          {/* 3. Active Stay Context */}
          {activeTab === 'active' && hasActiveStay && (
            <div className="space-y-12 animate-in fade-in duration-700">
              <div className="flex justify-between items-end border-b border-[#1A1A1A]/20 pb-4 mb-8">
                <h2 className="text-3xl font-serif text-[#1A1A1A]">{t('profile.currentStay.title')} <span className="italic text-[#D4AF37]">{t('profile.currentStay.titleItalic')}</span></h2>
                <span className="text-[10px] uppercase tracking-[0.3em] bg-[#1A1A1A] text-white px-3 py-1 animate-pulse">{t('profile.currentStay.checkedIn')}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-[#1A1A1A] text-[#F9F8F6] p-8 border-none relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/20 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2"></div>
                  <p className="text-[10px] uppercase font-bold tracking-[0.3em] text-[#F9F8F6]/60 mb-2">{t('profile.currentStay.roomDetails')}</p>
                  <h3 className="text-5xl font-serif text-[#D4AF37] mb-2">{currentStay?.roomId || "02"}</h3>
                  <p className="text-sm font-serif">Lumière Master Room</p>
                </Card>

                <Card className="p-8 border border-[#1A1A1A]/10 hover:border-[#D4AF37]/50 transition-colors group">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[10px] uppercase font-bold tracking-[0.3em] text-[#6C6863] mb-2">{t('profile.currentStay.digitalAccess')}</p>
                      <h4 className="text-xl font-serif text-[#1A1A1A] mb-1">{t('profile.currentStay.wifiCreds')}</h4>
                      <p className="text-sm text-[#1A1A1A]">{t('profile.currentStay.network')}: <span className="font-bold">Lumiere_Guest</span></p>
                      <p className="text-sm text-[#1A1A1A] mb-6">{t('profile.currentStay.password')}: <span className="font-mono text-[#D4AF37]">LUM#402!X</span></p>
                    </div>
                    <svg className="w-8 h-8 text-[#D4AF37] opacity-50 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="1" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                  </div>
                  <Button onClick={() => alert('Available in v2.0')} variant="ghost" className="border border-[#1A1A1A]/20 w-full text-xs">{t('profile.currentStay.viewQr')}</Button>
                </Card>
              </div>

              <Card className="p-8 border-none bg-white shadow-[0_8px_32px_rgba(0,0,0,0.03)]">
                <p className="text-[10px] uppercase font-bold tracking-[0.3em] text-[#6C6863] mb-6 border-b border-[#1A1A1A]/10 pb-2">{t('profile.currentStay.liveFolio')}</p>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#6C6863]">{t('profile.currentStay.roomRate')}</span>
                    <span className="text-[#1A1A1A] font-serif">${currentStay?.totalPrice || "0.00"}</span>
                  </div>
                  <div className="flex justify-between text-sm opacity-50">
                    <span className="text-[#6C6863]">{t('profile.currentStay.dining')}</span>
                    <span className="text-[#1A1A1A] font-serif">$0.00</span>
                  </div>
                  <div className="flex justify-between text-sm opacity-50">
                    <span className="text-[#6C6863]">{t('profile.currentStay.spa')}</span>
                    <span className="text-[#1A1A1A] font-serif">$0.00</span>
                  </div>
                  <div className="pt-4 mt-4 border-t border-[#1A1A1A]/10 flex justify-between items-center">
                    <span className="font-bold text-[#1A1A1A] uppercase tracking-[0.1em] text-xs">{t('profile.currentStay.balance')}</span>
                    <span className="text-2xl font-serif text-[#D4AF37]">${currentStay?.totalPrice || "0.00"}</span>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* 2. Reservation Management */}
          {activeTab === 'bookings' && (
            <div className="space-y-16 animate-in fade-in duration-700">
              
              {/* Upcoming */}
              <div>
                <div className="border-b border-[#1A1A1A]/20 pb-4 mb-8">
                  <h2 className="text-3xl font-serif text-[#1A1A1A]">{t('profile.manageBookings.upcoming')} <span className="italic text-[#D4AF37]">{t('profile.manageBookings.reservations')}</span></h2>
                </div>

                {upcomingBookings.length > 0 ? upcomingBookings.map((booking, index) => (
                  <Card key={booking.id || index} className="p-0 border-none shadow-[0_8px_32px_rgba(0,0,0,0.04)] bg-white overflow-hidden group">
                    <div className="grid grid-cols-1 md:grid-cols-12">
                      <div className="md:col-span-4 aspect-[4/3] md:aspect-auto overflow-hidden relative">
                        <img src={getFallbackImage()} alt="Room" className="w-full h-full object-cover grayscale transition-all duration-[2000ms] group-hover:grayscale-0 group-hover:scale-105" />
                      </div>
                      <div className="md:col-span-8 p-8 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start mb-4">
                            <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-[#6C6863]">{t('profile.manageBookings.conf')} BKG-{booking.id}</span>
                            <span className="text-[10px] uppercase font-bold text-[#D4AF37] border border-[#D4AF37]/20 px-3 py-1">{booking.status}</span>
                          </div>
                          <h3 className="text-2xl font-serif text-[#1A1A1A] mb-1">Room {booking.roomId}</h3>
                          <p className="text-sm text-[#6C6863] mb-4">{booking.checkInDate} to {booking.checkOutDate}</p>
                          <p className="text-lg font-serif text-[#1A1A1A]">{t('profile.manageBookings.totalCost')}: <span className="text-[#D4AF37]">${booking.totalPrice}</span></p>
                        </div>

                        <div className="mt-8 pt-6 border-t border-[#1A1A1A]/10 flex flex-col sm:flex-row gap-4">
                          <Button onClick={() => alert('Available in v2.0')} variant="secondary" className="w-full sm:w-auto h-10 px-6">{t('profile.manageBookings.modify')}</Button>
                          <Button onClick={() => handleCancelReservation(booking.id)} variant="ghost" className="w-full sm:w-auto h-10 px-6 border border-[#1A1A1A]/20 text-red-700 hover:bg-red-50 hover:border-red-200">{t('profile.manageBookings.cancel')}</Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                )) : (
                  <p className="text-[#6C6863] italic font-serif">{t('profile.manageBookings.noUpcoming')}</p>
                )}
              </div>

              {/* Past */}
              <div className="pt-4">
                <div className="border-b border-[#1A1A1A]/20 pb-4 mb-8">
                  <h2 className="text-3xl font-serif text-[#1A1A1A]">{t('profile.manageBookings.past')} <span className="italic text-[#6C6863]">{t('profile.manageBookings.stays')}</span></h2>
                </div>

                {pastBookings.length > 0 ? pastBookings.map((booking, index) => (
                  <Card key={booking.id || index} className="p-8 border border-[#1A1A1A]/10 bg-transparent flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-white hover:shadow-[0_8px_32px_rgba(0,0,0,0.03)] transition-all">
                    <div>
                        <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-[#6C6863] block mb-2">BKG-{booking.id}</span>
                        <h3 className="text-xl font-serif text-[#1A1A1A]">Room {booking.roomId}</h3>
                        <p className="text-xs text-[#6C6863] mt-2">{booking.checkInDate} to {booking.checkOutDate}</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button onClick={() => handleViewReceipt(booking.id)} variant="ghost" className="border border-[#1A1A1A]/20 text-xs h-9">{t('profile.manageBookings.downloadInvoice')}</Button>
                      <Button onClick={() => alert('Available in v2.0')} variant="primary" className="text-xs h-9 bg-[#1A1A1A] text-white">{t('profile.manageBookings.leaveReview')}</Button>
                    </div>
                  </Card>
                )) : (
                  <p className="text-[#6C6863] italic font-serif">{t('profile.manageBookings.noPast')}</p>
                )}
              </div>
            </div>
          )}

          {/* 1. Profile Management */}
          {activeTab === 'profile' && (
            <div className="space-y-12 animate-in fade-in duration-700 max-w-2xl">
               <div>
                 <h2 className="text-3xl font-serif text-[#1A1A1A] border-b border-[#1A1A1A]/20 pb-4 mb-8">{t('profile.personalDetails.title')} <span className="italic text-[#D4AF37]">{t('profile.personalDetails.titleItalic')}</span></h2>
                 <form className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div>
                      <label className="text-[10px] uppercase tracking-[0.2em] font-medium text-[#6C6863] mb-2 block">{t('profile.personalDetails.firstName')}</label>
                      <input type="text" value={profileData.firstName} onChange={e => setProfileData({...profileData, firstName: e.target.value})} className="w-full border-b border-[#1A1A1A]/20 bg-transparent outline-none focus:border-[#D4AF37] pb-2 font-serif text-lg text-[#1A1A1A] transition-colors" />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase tracking-[0.2em] font-medium text-[#6C6863] mb-2 block">{t('profile.personalDetails.lastName')}</label>
                      <input type="text" value={profileData.lastName} onChange={e => setProfileData({...profileData, lastName: e.target.value})} className="w-full border-b border-[#1A1A1A]/20 bg-transparent outline-none focus:border-[#D4AF37] pb-2 font-serif text-lg text-[#1A1A1A] transition-colors" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-[10px] uppercase tracking-[0.2em] font-medium text-[#6C6863] mb-2 block">{t('profile.personalDetails.email')}</label>
                      <input type="email" value={user?.email || ""} className="w-full border-b border-[#1A1A1A]/20 bg-transparent outline-none focus:border-[#D4AF37] pb-2 font-serif text-lg text-[#1A1A1A] transition-colors" readOnly />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-[10px] uppercase tracking-[0.2em] font-medium text-[#6C6863] mb-2 block">{t('profile.personalDetails.phone')}</label>
                      <input type="tel" value={profileData.phoneNumber} onChange={e => setProfileData({...profileData, phoneNumber: e.target.value})} className="w-full border-b border-[#1A1A1A]/20 bg-transparent outline-none focus:border-[#D4AF37] pb-2 font-serif text-lg text-[#1A1A1A] transition-colors" />
                    </div>
                 </form>
               </div>

               <div className="pt-8">
                 <h2 className="text-3xl font-serif text-[#1A1A1A] border-b border-[#1A1A1A]/20 pb-4 mb-8">{t('profile.accountSettings.title')} <span className="italic text-[#6C6863]">{t('profile.accountSettings.titleItalic')}</span></h2>
                 
                 <div className="space-y-8">
                    {/* Password */}
                    <div className="flex flex-col gap-4 p-6 border border-[#1A1A1A]/10 bg-white">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                        <div>
                          <p className="font-serif text-[#1A1A1A] text-lg">{t('profile.accountSettings.password')}</p>
                          <p className="text-xs text-[#6C6863] mt-1">{t('profile.accountSettings.lastChanged', { count: 3 })}</p>
                        </div>
                      </div>
                      
                      <form onSubmit={handleChangePassword} className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-[#1A1A1A]/10 mt-2">
                          <div>
                              <label className="text-[10px] uppercase tracking-[0.2em] font-medium text-[#6C6863] mb-2 block">Current Password</label>
                              <input required type="password" value={pwdData.oldPassword} onChange={e => setPwdData({...pwdData, oldPassword: e.target.value})} className="w-full border-b border-[#1A1A1A]/20 bg-transparent outline-none focus:border-[#D4AF37] pb-2 font-serif text-lg text-[#1A1A1A] transition-colors" />
                          </div>
                          <div>
                              <label className="text-[10px] uppercase tracking-[0.2em] font-medium text-[#6C6863] mb-2 block">New Password</label>
                              <input required type="password" minLength={6} value={pwdData.newPassword} onChange={e => setPwdData({...pwdData, newPassword: e.target.value})} className="w-full border-b border-[#1A1A1A]/20 bg-transparent outline-none focus:border-[#D4AF37] pb-2 font-serif text-lg text-[#1A1A1A] transition-colors" />
                          </div>
                          <div className="md:col-span-2 flex justify-end mt-2">
                             <Button disabled={isChangingPwd} type="submit" variant="ghost" className="border border-[#1A1A1A]/20 text-xs bg-transparent">{isChangingPwd ? 'Updating...' : t('profile.accountSettings.resetPassword') || 'Change Password'}</Button>
                          </div>
                      </form>
                    </div>

                    {/* Language Toggle */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 border border-[#1A1A1A]/10 bg-white">
                      <div>
                        <p className="font-serif text-[#1A1A1A] text-lg">{t('profile.accountSettings.langPref')}</p>
                        <p className="text-xs text-[#6C6863] mt-1">{t('profile.accountSettings.langDesc')}</p>
                      </div>
                      <div className="flex bg-[#F9F8F6] p-1 border border-[#1A1A1A]/10">
                        <button onClick={() => setLanguage('EN')} className={`px-4 py-2 text-xs font-bold tracking-wider ${language === 'EN' ? 'bg-[#1A1A1A] text-white' : 'text-[#6C6863] hover:text-[#1A1A1A]'} transition-colors`}>EN</button>
                        <button onClick={() => setLanguage('VN')} className={`px-4 py-2 text-xs font-bold tracking-wider ${language === 'VN' ? 'bg-[#1A1A1A] text-white' : 'text-[#6C6863] hover:text-[#1A1A1A]'} transition-colors`}>VN</button>
                        <button onClick={() => setLanguage('JA')} className={`px-4 py-2 text-xs font-bold tracking-wider ${language === 'JA' ? 'bg-[#1A1A1A] text-white' : 'text-[#6C6863] hover:text-[#1A1A1A]'} transition-colors`}>JA</button>
                      </div>
                    </div>
                 </div>

                 <div className="mt-12 flex justify-end items-center gap-4">
                   {updateMsg && <span className="text-sm italic">{updateMsg}</span>}
                   <Button disabled={isUpdating} onClick={handleUpdateProfile} variant="primary" className="bg-[#D4AF37] text-white py-4 hover:bg-[#D4AF37]/90 px-8">
                     {isUpdating ? 'Saving...' : t('profile.accountSettings.saveChanges')}
                   </Button>
                 </div>

                 {/* Danger Zone */}
                 <div className="mt-16 pt-8 border-t border-red-500/20">
                     <h3 className="text-xl font-serif text-red-700 mb-4">Danger Zone</h3>
                     <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 border border-red-500/20 bg-red-50/50">
                        <div>
                          <p className="font-serif text-[#1A1A1A] text-lg">Deactivate Account</p>
                          <p className="text-xs text-[#6C6863] mt-1">Once you deactivate your account, there is no going back. Please be certain.</p>
                        </div>
                        <Button disabled={isDeactivating} onClick={handleDeactivateAccount} variant="ghost" className="border border-red-700 text-red-700 text-xs bg-transparent hover:bg-red-700 hover:text-white transition-colors">{isDeactivating ? 'Deactivating...' : 'Deactivate Account'}</Button>
                     </div>
                 </div>
               </div>
            </div>
          )}

          {/* 4. Payment Information */}
          {activeTab === 'payment' && (
             <div className="space-y-8 animate-in fade-in duration-700 max-w-2xl">
                <div className="flex justify-between items-end border-b border-[#1A1A1A]/20 pb-4 mb-8">
                  <h2 className="text-3xl font-serif text-[#1A1A1A]">{t('profile.paymentMethods.title')} <span className="italic text-[#D4AF37]">{t('profile.paymentMethods.titleItalic')}</span></h2>
                </div>

                <div className="space-y-6">
                  {savedPayments.map((pm) => (
                    <Card key={pm.id} className="p-6 border border-[#1A1A1A]/10 bg-white flex justify-between items-center group">
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-10 bg-[#F9F8F6] flex items-center justify-center border border-[#1A1A1A]/10 text-xs font-bold italic font-serif">
                          {pm.card}
                        </div>
                        <div>
                          <p className="font-serif text-[#1A1A1A] text-lg tracking-widest">•••• {pm.last4}</p>
                          <p className="text-[10px] uppercase tracking-widest text-[#6C6863] mt-1">{t('profile.paymentMethods.expires')} {pm.exp}</p>
                        </div>
                      </div>
                      <button onClick={() => alert('Available in v2.0')} className="text-xs text-[#6C6863] hover:text-red-600 transition-colors uppercase tracking-[0.2em] font-medium border-b border-transparent hover:border-red-600">{t('profile.paymentMethods.remove')}</button>
                    </Card>
                  ))}
                  
                  <button onClick={() => alert('Available in v2.0')} className="w-full py-8 border border-dashed border-[#1A1A1A]/20 bg-transparent hover:bg-[#1A1A1A]/5 transition-colors flex flex-col items-center justify-center gap-3 text-[#6C6863] hover:text-[#1A1A1A]">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="1.5" d="M12 4v16m8-8H4"></path></svg>
                    <span className="text-[10px] uppercase font-bold tracking-[0.2em]">{t('profile.paymentMethods.addNew')}</span>
                  </button>
                </div>
             </div>
          )}

          {/* 5. Guest Preferences */}
          {activeTab === 'preferences' && (
             <div className="space-y-12 animate-in fade-in duration-700 max-w-2xl">
                <div className="border-b border-[#1A1A1A]/20 pb-4 mb-8">
                  <h2 className="text-3xl font-serif text-[#1A1A1A]">{t('profile.guestPreferences.title')} <span className="italic text-[#D4AF37]">{t('profile.guestPreferences.titleItalic')}</span></h2>
                  <p className="text-sm text-[#6C6863] mt-2 font-serif italic">{t('profile.guestPreferences.subtitle')}</p>
                </div>

                <div className="space-y-12">
                  
                  {/* Room Requirements */}
                  <div>
                    <h3 className="text-[10px] uppercase font-bold tracking-[0.3em] text-[#1A1A1A] mb-6">{t('profile.guestPreferences.roomReq')}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { id: 'highFloor', label: t('profile.guestPreferences.prefs.highFloor') },
                        { id: 'nearElevator', label: t('profile.guestPreferences.prefs.nearElevator') },
                        { id: 'awayElevator', label: t('profile.guestPreferences.prefs.awayElevator') },
                        { id: 'accessibility', label: t('profile.guestPreferences.prefs.accessibility') },
                        { id: 'extraPillows', label: t('profile.guestPreferences.prefs.extraPillows') },
                        { id: 'firmMattress', label: t('profile.guestPreferences.prefs.firmMattress') }
                      ].map(pref => (
                        <label key={pref.id} className="flex items-center gap-4 p-4 border border-[#1A1A1A]/10 bg-white cursor-pointer hover:border-[#D4AF37]/50 transition-colors">
                          <input type="checkbox" className="w-4 h-4 rounded-none text-[#D4AF37] focus:ring-[#D4AF37] focus:ring-offset-0 border-[#1A1A1A]/20" />
                          <span className="text-sm text-[#1A1A1A] font-serif">{pref.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Dietary Restrictions */}
                  <div>
                    <h3 className="text-[10px] uppercase font-bold tracking-[0.3em] text-[#1A1A1A] mb-6">{t('profile.guestPreferences.dietary')}</h3>
                    <textarea 
                      placeholder={t('profile.guestPreferences.dietaryPlaceholder')}
                      className="w-full h-32 p-4 border border-[#1A1A1A]/20 bg-transparent outline-none focus:border-[#D4AF37] font-serif text-[#1A1A1A] resize-none"
                    ></textarea>
                  </div>

                  {/* Notification Settings */}
                  <div>
                    <h3 className="text-[10px] uppercase font-bold tracking-[0.3em] text-[#1A1A1A] mb-6">{t('profile.guestPreferences.notifications')}</h3>
                    <div className="space-y-4">
                      <label className="flex justify-between items-center p-4 border border-[#1A1A1A]/10 bg-white cursor-pointer">
                        <div>
                          <p className="text-sm font-bold text-[#1A1A1A] uppercase tracking-wider text-[11px] mb-1">{t('profile.guestPreferences.emailAlerts')}</p>
                          <p className="text-xs text-[#6C6863] font-serif">{t('profile.guestPreferences.emailDesc')}</p>
                        </div>
                        <input type="checkbox" defaultChecked className="w-5 h-5 rounded-none text-[#D4AF37] focus:ring-[#D4AF37] border-[#1A1A1A]/20" />
                      </label>
                      <label className="flex justify-between items-center p-4 border border-[#1A1A1A]/10 bg-white cursor-pointer">
                        <div>
                          <p className="text-sm font-bold text-[#1A1A1A] uppercase tracking-wider text-[11px] mb-1">{t('profile.guestPreferences.smsAlerts')}</p>
                          <p className="text-xs text-[#6C6863] font-serif">{t('profile.guestPreferences.smsDesc')}</p>
                        </div>
                        <input type="checkbox" defaultChecked className="w-5 h-5 rounded-none text-[#D4AF37] focus:ring-[#D4AF37] border-[#1A1A1A]/20" />
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex justify-end pt-8">
                    <Button onClick={() => alert('Available in v2.0')} variant="primary" className="bg-[#1A1A1A] text-white hover:bg-[#D4AF37] px-8 transition-colors duration-500">{t('profile.guestPreferences.update')}</Button>
                  </div>

                </div>
             </div>
          )}

        </div>
      </div>
    </div>
  );
};
