import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { InventoryService } from '../api';

export const RoomDetail: React.FC = () => {
    const { t } = useTranslation();
    const { id } = useParams<{ id: string }>();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [roomType, setRoomType] = useState<any>(null);
    const [otherRooms, setOtherRooms] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const checkInDate = searchParams.get('checkIn') || '';
    const checkOutDate = searchParams.get('checkOut') || '';
    const adultsParam = parseInt(searchParams.get('adults') || '2');
    const childrenParam = parseInt(searchParams.get('children') || '0');

    const nights = (checkInDate && checkOutDate)
        ? Math.max(1, Math.round((new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) / (1000 * 60 * 60 * 24)))
        : 0;

    // --- Search Bar State & Logic ---
    const todayDate = new Date(); todayDate.setHours(0, 0, 0, 0);
    const maxDate = new Date(todayDate); maxDate.setMonth(maxDate.getMonth() + 3);
    const toISO = (d: Date) => {
        const offset = d.getTimezoneOffset() * 60000;
        return new Date(d.getTime() - offset).toISOString().split('T')[0];
    };
    const fmtDateSearch = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const isSameDay = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
    const parseDate = (s: string | null) => { if (!s) return null; const d = new Date(s + 'T00:00:00'); return isNaN(d.getTime()) ? null : d; };

    const [checkIn, setCheckIn] = useState<Date | null>(() => parseDate(searchParams.get('checkIn')));
    const [checkOut, setCheckOut] = useState<Date | null>(() => parseDate(searchParams.get('checkOut')));
    const [adults, setAdults] = useState(() => parseInt(searchParams.get('adults') || '2'));
    const [children, setChildren] = useState(() => parseInt(searchParams.get('children') || '0'));
    const [rooms, setRooms] = useState(1);
    const totalGuests = adults + children;

    const [calendarMonth, setCalendarMonth] = useState(() => {
        const ci = parseDate(searchParams.get('checkIn'));
        return ci ? new Date(ci.getFullYear(), ci.getMonth(), 1) : new Date(todayDate.getFullYear(), todayDate.getMonth(), 1);
    });

    const prevMonth = () => { const p = new Date(calendarMonth); p.setMonth(p.getMonth() - 1); if (p >= new Date(todayDate.getFullYear(), todayDate.getMonth(), 1)) setCalendarMonth(p); };
    const nextMonth = () => { const n = new Date(calendarMonth); n.setMonth(n.getMonth() + 1); if (n <= new Date(maxDate.getFullYear(), maxDate.getMonth(), 1)) setCalendarMonth(n); };
    const calendarDays = () => {
        const year = calendarMonth.getFullYear(), month = calendarMonth.getMonth();
        const firstDow = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        return [...Array.from({ length: firstDow }, () => null), ...Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1))];
    };
    const handleDayClick = (day: Date) => {
        if (day < todayDate || day > maxDate) return;
        if (!checkIn || (checkIn && checkOut)) { setCheckIn(day); setCheckOut(null); }
        else if (day > checkIn) { setCheckOut(day); setActiveDatePicker(null); }
        else { setCheckIn(day); setCheckOut(null); }
    };

    const [activeDatePicker, setActiveDatePicker] = useState<'sticky' | 'normal' | null>(null);
    const [activeGuestPicker, setActiveGuestPicker] = useState<'sticky' | 'normal' | null>(null);

    useEffect(() => {
        const fetchRoomDetails = async () => {
            if (!id) return;
            setIsLoading(true);
            try {
                const data = await InventoryService.getRoomType(parseInt(id));
                setRoomType(data);

                // Fetch other room types
                const allTypes = await InventoryService.getAllRoomTypes();
                const filtered = allTypes.filter((rt: any) => rt.id !== parseInt(id) && (rt.availableCount || 0) > 0).slice(0, 3);
                setOtherRooms(filtered);
            } catch (err: any) {
                console.error("Failed to fetch room details", err);
                setError("Could not load room details. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchRoomDetails();
    }, [id]);

    const fmtDate = (s: string) => {
        if (!s) return '—';
        const d = new Date(s + 'T00:00:00');
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    if (isLoading) {
        return (
            <div className="max-w-[1600px] mx-auto w-full px-8 md:px-16 pt-24 pb-40 flex justify-center items-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4AF37]"></div>
            </div>
        );
    }

    if (error || !roomType) {
        return (
            <div className="max-w-[1600px] mx-auto w-full px-8 md:px-16 pt-24 pb-40 text-center">
                <h1 className="text-4xl font-serif text-[#1A1A1A] mb-6">{error || 'Room not found'}</h1>
                <Button onClick={() => navigate(-1)} variant="secondary">Go Back</Button>
            </div>
        );
    }

    const basePrice = Number(roomType.basePrice) || 0;
    const subtotal = basePrice * nights;
    const vatAmount = subtotal * 0.10; // 10% VAT
    const totalAmount = subtotal + vatAmount;

    const handleReserve = () => {
        const queryParams = new URLSearchParams(searchParams);
        queryParams.set('roomType', id || '1');
        if (!checkInDate || !checkOutDate) {
            const searchBar = document.getElementById('room-search-bar');
            if (searchBar) {
                const headerOffset = 120;
                const elementPosition = searchBar.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
            setActiveDatePicker('normal');
        } else {
            navigate(`/checkout?${queryParams.toString()}`);
        }
    };

    const handleUpdateSearch = () => {
        const params = new URLSearchParams(searchParams);
        if (checkIn) params.set('checkIn', toISO(checkIn));
        if (checkOut) params.set('checkOut', toISO(checkOut));
        params.set('adults', String(adults));
        params.set('children', String(children));
        navigate(`/room/${id}?${params.toString()}`);
        setActiveDatePicker(null);
        setActiveGuestPicker(null);
    };

    const SearchBarContent = ({ isSticky = false }: { isSticky?: boolean }) => (
        <>
            <div className={`flex-1 w-full border-b md:border-b-0 md:border-r border-[#1A1A1A]/10 ${isSticky ? 'pb-2 md:pb-0 md:px-6 xl:px-8' : 'pb-4 md:pb-0 md:px-8 xl:px-12'} group cursor-pointer relative`}>
                <label className={`block uppercase font-bold tracking-[0.2em] text-[#6C6863] group-hover:text-[#1A1A1A] transition-colors ${isSticky ? 'text-[8px] mb-1' : 'text-[10px] mb-3'}`}>{t('home.checkInCheckOut')}</label>
                <div
                    className={`flex items-center justify-between w-full h-full ${isSticky ? 'py-0' : 'py-1'}`}
                    onClick={() => { setActiveDatePicker(activeDatePicker === (isSticky ? 'sticky' : 'normal') ? null : (isSticky ? 'sticky' : 'normal')); setActiveGuestPicker(null); }}
                >
                    <span className={`font-serif transition-colors ${isSticky ? 'text-lg xl:text-xl' : 'text-xl xl:text-3xl'} ${!checkIn ? 'text-[#1A1A1A]/30' : 'text-[#1A1A1A]'}`}>
                        {!checkIn ? t('home.addDates') : !checkOut ? `${fmtDateSearch(checkIn)} - ${t('home.checkout')}` : `${fmtDateSearch(checkIn)} - ${fmtDateSearch(checkOut)}`}
                    </span>
                    <svg className={`w-4 h-4 text-[#1A1A1A]/40 transition-transform duration-500 transform ${activeDatePicker === (isSticky ? 'sticky' : 'normal') ? 'rotate-180 text-[#1A1A1A]' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="1.5" d="M19 9l-7 7-7-7"></path>
                    </svg>
                </div>

                {activeDatePicker === (isSticky ? 'sticky' : 'normal') && (
                    <div className="absolute top-[120%] left-0 w-[400px] bg-[#F9F8F6] border border-[#1A1A1A]/10 shadow-[0_32px_64px_rgba(0,0,0,0.2)] z-50 p-8 animate-in fade-in slide-in-from-top-4 duration-500">
                        <div className="flex justify-between items-center mb-8">
                            <button onClick={(e) => { e.stopPropagation(); prevMonth(); }} className="text-[#1A1A1A]/40 hover:text-[#1A1A1A] transition-colors h-8 w-8 flex items-center justify-center border border-transparent hover:border-[#1A1A1A]/20">←</button>
                            <span className="font-serif italic text-xl text-[#1A1A1A]">{calendarMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                            <button onClick={(e) => { e.stopPropagation(); nextMonth(); }} className="text-[#1A1A1A]/40 hover:text-[#1A1A1A] transition-colors h-8 w-8 flex items-center justify-center border border-transparent hover:border-[#1A1A1A]/20">→</button>
                        </div>
                        <div className="grid grid-cols-7 gap-2 text-center mb-4">
                            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                                <span key={i} className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#6C6863]/60">{d}</span>
                            ))}
                        </div>
                        <div className="grid grid-cols-7 gap-y-4 gap-x-0 overflow-hidden text-center font-serif text-lg">
                            {calendarDays().map((day, i) => {
                                if (!day) return <span key={`b${i}`} className="opacity-0"></span>;
                                const disabled = day < todayDate || day > maxDate;
                                const isSelected = (checkIn && isSameDay(day, checkIn)) || (checkOut && isSameDay(day, checkOut));
                                const isInRange = checkIn && checkOut && day > checkIn && day < checkOut;
                                return (
                                    <div key={i} className={`relative flex items-center justify-center h-10 ${isInRange ? 'bg-[#D4AF37]/15' : ''} ${checkIn && checkOut && isSameDay(day, checkIn) ? 'bg-gradient-to-r from-transparent to-[#D4AF37]/15' : ''} ${checkOut && isSameDay(day, checkOut) ? 'bg-gradient-to-l from-transparent to-[#D4AF37]/15' : ''}`}>
                                        <button
                                            disabled={disabled}
                                            onClick={(e) => { e.stopPropagation(); handleDayClick(day); }}
                                            className={`w-10 h-10 rounded-none flex flex-shrink-0 items-center justify-center transition-colors relative z-10 ${disabled ? 'text-[#1A1A1A]/20 cursor-not-allowed' : isSelected ? 'bg-[#1A1A1A] text-[#F9F8F6]' : 'text-[#1A1A1A] hover:bg-[#1A1A1A]/5'}`}
                                        >
                                            {day.getDate()}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            <div className={`flex-1 w-full ${isSticky ? 'pb-2 md:pb-0 md:px-6 xl:px-8' : 'pb-4 md:pb-0 md:px-8 xl:px-12'} group cursor-pointer relative`}>
                <label className={`block uppercase font-bold tracking-[0.2em] text-[#6C6863] group-hover:text-[#1A1A1A] transition-colors ${isSticky ? 'text-[8px] mb-1' : 'text-[10px] mb-3'}`}>{t('home.guests')}</label>
                <div
                    className={`flex items-center justify-between w-full h-full ${isSticky ? 'py-0' : 'py-1'}`}
                    onClick={() => { setActiveGuestPicker(activeGuestPicker === (isSticky ? 'sticky' : 'normal') ? null : (isSticky ? 'sticky' : 'normal')); setActiveDatePicker(null); }}
                >
                    <div className="flex flex-col">
                        <span className={`font-serif text-[#1A1A1A] transition-colors ${isSticky ? 'text-lg xl:text-xl' : 'text-xl xl:text-3xl'}`}>
                            {totalGuests} {t('home.guest', { count: totalGuests })}
                        </span>
                        {!isSticky && (
                            <span className="text-[10px] uppercase tracking-[0.1em] text-[#6C6863]/60 mt-1">
                                {rooms} {t('home.room', { count: rooms })}
                            </span>
                        )}
                    </div>
                    <svg className={`w-4 h-4 text-[#1A1A1A]/40 transition-transform duration-500 transform ${activeGuestPicker === (isSticky ? 'sticky' : 'normal') ? 'rotate-180 text-[#1A1A1A]' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="1.5" d="M19 9l-7 7-7-7"></path>
                    </svg>
                </div>

                {activeGuestPicker === (isSticky ? 'sticky' : 'normal') && (
                    <div className="absolute top-[120%] right-0 lg:right-auto md:left-0 w-[350px] bg-[#F9F8F6] border border-[#1A1A1A]/10 shadow-[0_32px_64px_rgba(0,0,0,0.2)] z-50 p-8 animate-in fade-in slide-in-from-top-4 duration-500">
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div><p className="font-serif text-lg text-[#1A1A1A]">{t('home.adults')}</p><p className="text-xs text-[#6C6863] italic">{t('home.adultsAge')}</p></div>
                                <div className="flex items-center gap-4">
                                    <button onClick={(e) => { e.stopPropagation(); setAdults(Math.max(1, adults - 1)); }} className="w-8 h-8 rounded-full border border-[#1A1A1A]/20 flex items-center justify-center text-[#1A1A1A] hover:border-[#1A1A1A] transition-colors">−</button>
                                    <span className="font-serif w-4 text-center">{adults}</span>
                                    <button onClick={(e) => { e.stopPropagation(); setAdults(adults + 1); }} className="w-8 h-8 rounded-full border border-[#1A1A1A]/20 flex items-center justify-center text-[#1A1A1A] hover:border-[#1A1A1A] transition-colors">+</button>
                                </div>
                            </div>
                            <div className="flex items-center justify-between border-t border-[#1A1A1A]/10 pt-6">
                                <div><p className="font-serif text-lg text-[#1A1A1A]">{t('home.children')}</p><p className="text-xs text-[#6C6863] italic">{t('home.childrenAge')}</p></div>
                                <div className="flex items-center gap-4">
                                    <button onClick={(e) => { e.stopPropagation(); setChildren(Math.max(0, children - 1)); }} className="w-8 h-8 rounded-full border border-[#1A1A1A]/20 flex items-center justify-center text-[#1A1A1A] hover:border-[#1A1A1A] transition-colors">−</button>
                                    <span className="font-serif w-4 text-center">{children}</span>
                                    <button onClick={(e) => { e.stopPropagation(); setChildren(children + 1); }} className="w-8 h-8 rounded-full border border-[#1A1A1A]/20 flex items-center justify-center text-[#1A1A1A] hover:border-[#1A1A1A] transition-colors">+</button>
                                </div>
                            </div>
                            <div className="flex items-center justify-between border-t border-[#1A1A1A]/10 pt-6">
                                <div><p className="font-serif text-lg text-[#1A1A1A]">{t('home.room_other')}</p></div>
                                <div className="flex items-center gap-4">
                                    <button onClick={(e) => { e.stopPropagation(); setRooms(Math.max(1, rooms - 1)); }} className="w-8 h-8 rounded-full border border-[#1A1A1A]/20 flex items-center justify-center text-[#1A1A1A] hover:border-[#1A1A1A] transition-colors">−</button>
                                    <span className="font-serif w-4 text-center">{rooms}</span>
                                    <button onClick={(e) => { e.stopPropagation(); setRooms(rooms + 1); }} className="w-8 h-8 rounded-full border border-[#1A1A1A]/20 flex items-center justify-center text-[#1A1A1A] hover:border-[#1A1A1A] transition-colors">+</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className={`w-full md:w-auto mt-4 md:mt-0 shrink-0 relative z-10 ${isSticky ? 'xl:pl-6' : 'xl:pl-8'}`}>
                <Button onClick={handleUpdateSearch} className={`w-full md:w-auto bg-[#1A1A1A] hover:bg-[#D4AF37] text-[#F9F8F6] hover:text-[#1A1A1A] transition-colors duration-500 shadow-none border-none tracking-[0.3em] ${isSticky ? 'px-8 py-4 text-xs' : 'px-16 py-6 xl:py-8 text-sm'}`}>
                    {t('search.update')}
                </Button>
            </div>
        </>
    );

    return (
        <div className="max-w-[1600px] mx-auto w-full px-8 md:px-16 pt-24 pb-40">
            {/* Hero Image */}
            <div className="w-full aspect-[21/9] md:aspect-[3/1] mb-16 overflow-hidden relative group">
                <img
                    src={roomType.imageUrl || "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1600&auto=format&fit=crop&q=80"}
                    alt={roomType.name}
                    className="w-full h-full object-cover grayscale opacity-90 transition-all duration-[2000ms] group-hover:grayscale-0 group-hover:scale-105"
                />
                <div className="absolute inset-0 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.04)] pointer-events-none"></div>
            </div>

            {/* Search Bar - Normal */}
            <div id="room-search-bar" className="mb-20 w-full relative z-40">
                <div className="bg-[#F9F8F6] p-6 md:p-8 xl:py-10 shadow-[0_32px_64px_rgba(0,0,0,0.08)] flex flex-col md:flex-row items-center gap-6 xl:gap-8 w-full border border-[#1A1A1A]/10">
                    <SearchBarContent isSticky={false} />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-x-12">

                {/* Left Area: Details */}
                <div className="lg:col-span-7 space-y-12">
                    <div>
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif text-[#1A1A1A] mb-4 leading-[1.1]">
                            {roomType.name}
                        </h1>
                        <p className="text-[#6C6863] text-sm tracking-[0.1em] uppercase font-bold">
                            {t('search.accommodates', { count: roomType.maxGuests })}
                        </p>
                    </div>

                    <div className="prose prose-lg text-[#6C6863] max-w-none font-serif leading-relaxed">
                        <p>{roomType.description || t('search.roomDescription')}</p>
                    </div>

                    {roomType.amenities && roomType.amenities.length > 0 && (
                        <div className="pt-8 border-t border-[#1A1A1A]/10">
                            <h2 className="text-2xl font-serif text-[#1A1A1A] mb-8">{t('search.filters.amenities')}</h2>
                            <div className="grid grid-cols-2 gap-4">
                                {roomType.amenities.map((amenity: any) => (
                                    <div key={amenity.id} className="flex items-center gap-3 text-[#1A1A1A] font-serif">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]"></div>
                                        <span>{amenity.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Area: Reservation Widget */}
                <div className="lg:col-span-4 lg:col-start-9 md:sticky md:top-36 h-max">
                    <Card variant="featured" className="py-8 bg-white/80 backdrop-blur-sm -mx-4 md:mx-0 shadow-[0_8px_32px_rgba(0,0,0,0.06)] border-t-[6px]">
                        <h3 className="text-[10px] uppercase font-bold tracking-[0.3em] text-[#1A1A1A] mb-8 pb-4 border-b border-[#1A1A1A]/10">Reservation Summary</h3>

                        <div className="flex items-end gap-2 mb-8">
                            <span className="text-4xl font-serif text-[#1A1A1A]">${basePrice}</span>
                            <span className="text-sm italic text-[#6C6863] mb-1">/ {t('search.night')}</span>
                        </div>

                        {nights > 0 ? (
                            <>
                                <p className="text-xs text-[#6C6863] mb-6 pb-6 border-b border-[#1A1A1A]/10">
                                    {fmtDate(checkInDate)} — {fmtDate(checkOutDate)} <br />
                                    {adultsParam} Adult{adultsParam > 1 ? 's' : ''}{childrenParam > 0 ? `, ${childrenParam} Child${childrenParam > 1 ? 'ren' : ''}` : ''}
                                </p>

                                <div className="space-y-4 text-sm font-medium">
                                    <div className="flex justify-between items-center text-[#6C6863]">
                                        <span>${basePrice} × {nights} night{nights > 1 ? 's' : ''}</span>
                                        <span className="text-[#1A1A1A] font-serif">${subtotal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[#6C6863]">
                                        <span>VAT (10%)</span>
                                        <span className="text-[#1A1A1A] font-serif">${vatAmount.toFixed(2)}</span>
                                    </div>
                                </div>

                                <div className="mt-8 pt-6 border-t border-[#1A1A1A]/20 flex justify-between items-end">
                                    <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#1A1A1A]">{t('checkout.summary.total')}</span>
                                    <span className="text-3xl font-serif text-[#D4AF37]">${totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                </div>
                            </>
                        ) : (
                            <div className="mb-8 p-4 bg-[#1A1A1A]/5 border border-[#1A1A1A]/10 text-sm text-[#6C6863] font-serif italic">
                                Please select dates on the search page to see exact pricing and availability.
                            </div>
                        )}

                        <div className="mt-8">
                            <Button
                                onClick={handleReserve}
                                className="w-full bg-[#1A1A1A] hover:bg-[#D4AF37] text-white hover:text-[#1A1A1A] transition-colors duration-500 shadow-none border-none tracking-[0.3em] py-4"
                            >
                                {nights > 0 ? t('search.reserve') : t('home.addDates') || 'Select Dates'}
                            </Button>
                        </div>
                    </Card>
                </div>

            </div>

            {/* Other Rooms Section */}
            {otherRooms.length > 0 && (
                <div className="mt-32 pt-16 border-t border-[#1A1A1A]/10">
                    <h2 className="text-4xl font-serif text-[#1A1A1A] mb-12 text-center">Other Rooms You Might Like</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {otherRooms.map((room) => (
                            <Link
                                key={room.id}
                                to={`/room/${room.id}?${searchParams.toString()}`}
                                className="group block"
                            >
                                <div className="aspect-[4/3] overflow-hidden relative mb-6">
                                    <img
                                        src={room.imageUrl || "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&auto=format&fit=crop&q=60"}
                                        alt={room.name}
                                        className="w-full h-full object-cover grayscale opacity-90 transition-all duration-[2000ms] group-hover:grayscale-0 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.04)] pointer-events-none"></div>
                                </div>
                                <h3 className="text-2xl font-serif text-[#1A1A1A] group-hover:text-[#D4AF37] transition-colors">{room.name}</h3>
                                <p className="text-[#6C6863] text-sm mt-2 line-clamp-2">{room.description}</p>
                                <div className="mt-4 text-[#1A1A1A] font-serif">
                                    From ${room.basePrice} <span className="text-xs italic text-[#6C6863]">/ {t('search.night')}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
