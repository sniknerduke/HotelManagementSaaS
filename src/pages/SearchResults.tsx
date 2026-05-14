import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { BookingService, InventoryService, AmenityService } from '../api';

export const SearchResults: React.FC = () => {
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();

    // --- Date helpers ---
    const todayDate = new Date(); todayDate.setHours(0, 0, 0, 0);
    const maxDate = new Date(todayDate); maxDate.setMonth(maxDate.getMonth() + 3);
    const toISO = (d: Date) => {
        const offset = d.getTimezoneOffset() * 60000;
        return new Date(d.getTime() - offset).toISOString().split('T')[0];
    };
    const fmtDate = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const isSameDay = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

    // --- Init state from URL params ---
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

    // Calendar helpers
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

    // UI state
    const [activeDatePicker, setActiveDatePicker] = useState<'sticky' | 'normal' | null>(null);
    const [activeGuestPicker, setActiveGuestPicker] = useState<'sticky' | 'normal' | null>(null);
    const [isScrolled, setIsScrolled] = useState(false);
    const [roomsData, setRoomsData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [amenities, setAmenities] = useState<any[]>([]);
    const [selectedAmenityIds, setSelectedAmenityIds] = useState<number[]>([]);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 3;
    const navigate = useNavigate();

    useEffect(() => { AmenityService.getAllAmenities().then(setAmenities).catch(console.error); }, []);
    const toggleFilter = (id: number) => setSelectedAmenityIds(prev => prev.includes(id) ? prev.filter(aId => aId !== id) : [...prev, id]);

    const filteredRooms = roomsData.filter(room => {
        if (selectedAmenityIds.length === 0) return true;
        const roomAmenityIds = (room.amenities || []).map((a: any) => a.id);
        return selectedAmenityIds.every(id => roomAmenityIds.includes(id));
    });

    // Reset page when filters or data change
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedAmenityIds, roomsData]);

    const totalPages = Math.ceil(filteredRooms.length / ITEMS_PER_PAGE);
    const paginatedRooms = filteredRooms.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    useEffect(() => {
        const handleScroll = () => {
            const scrolled = window.scrollY > 400;
            setIsScrolled(scrolled);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Fetch availability: date-aware when dates selected, otherwise show all room types
    useEffect(() => {
        const fetchRooms = async () => {
            setIsLoading(true);
            try {
                if (checkIn && checkOut) {
                    // Date-aware availability from booking-service
                    const data = await BookingService.getAvailability(toISO(checkIn), toISO(checkOut), totalGuests);
                    setRoomsData(data);
                } else {
                    // No dates selected — show all room types from inventory
                    const types = await InventoryService.getAllRoomTypes();
                    setRoomsData(types.filter((rt: any) => rt.maxGuests >= totalGuests && (rt.availableCount || 0) > 0));
                }
            } catch (err) {
                console.error("Failed to fetch rooms from booking-service, falling back to inventory", err);
                // Fallback: show all room types (no date filtering) so the page isn't empty
                try {
                    const types = await InventoryService.getAllRoomTypes();
                    setRoomsData(types.filter((rt: any) => rt.maxGuests >= totalGuests && (rt.availableCount || 0) > 0));
                } catch (_) {
                    setRoomsData([]);
                }
            } finally {
                setIsLoading(false);
            }
        };
        fetchRooms();
    }, [checkIn, checkOut, totalGuests]);

    const nights = checkIn && checkOut ? Math.round((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)) : 0;

    const SearchBarContent = ({ isSticky = false }: { isSticky?: boolean }) => (
        <>
            {/* Dates */}
            <div className={`flex-1 w-full border-b md:border-b-0 md:border-r border-[#1A1A1A]/10 ${isSticky ? 'pb-2 md:pb-0 md:px-6 xl:px-8' : 'pb-4 md:pb-0 md:px-8 xl:px-12'} group cursor-pointer relative`}>
                <label className={`block uppercase font-bold tracking-[0.2em] text-[#6C6863] group-hover:text-[#1A1A1A] transition-colors ${isSticky ? 'text-[8px] mb-1' : 'text-[10px] mb-3'}`}>{t('home.checkInCheckOut')}</label>
                <div
                    className={`flex items-center justify-between w-full h-full ${isSticky ? 'py-0' : 'py-1'}`}
                    onClick={() => { setActiveDatePicker(activeDatePicker === (isSticky ? 'sticky' : 'normal') ? null : (isSticky ? 'sticky' : 'normal')); setActiveGuestPicker(null); }}
                >
                    <span className={`font-serif transition-colors ${isSticky ? 'text-lg xl:text-xl' : 'text-xl xl:text-3xl'} ${!checkIn ? 'text-[#1A1A1A]/30' : 'text-[#1A1A1A]'}`}>
                        {!checkIn ? t('home.addDates') : !checkOut ? `${fmtDate(checkIn)} - ${t('home.checkout')}` : `${fmtDate(checkIn)} - ${fmtDate(checkOut)}`}
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

            {/* Guests */}
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
                <Button 
                    onClick={() => {
                        const params = new URLSearchParams(searchParams);
                        if (checkIn) params.set('checkIn', toISO(checkIn));
                        if (checkOut) params.set('checkOut', toISO(checkOut));
                        params.set('adults', String(adults));
                        params.set('children', String(children));
                        navigate(`/search?${params.toString()}`);
                        setActiveDatePicker(null);
                        setActiveGuestPicker(null);
                    }}
                    className={`w-full md:w-auto bg-[#1A1A1A] hover:bg-[#D4AF37] text-[#F9F8F6] hover:text-[#1A1A1A] transition-colors duration-500 shadow-none border-none tracking-[0.3em] ${isSticky ? 'px-8 py-4 text-xs' : 'px-16 py-6 xl:py-8 text-sm'}`}>
                    {t('search.update')}
                </Button>
            </div>
        </>
    );

    return (
        <div className="max-w-[1600px] mx-auto w-full px-8 md:px-16 pt-24 pb-40">

            <h1 className="text-4xl md:text-6xl font-serif text-[#1A1A1A] mb-12 leading-[1.1]">
                {t('search.title')} <span className="italic">{t('search.titleItalic')}</span>
            </h1>

            {/* Search Bar - Normal */}
            <div className="mb-20 w-full relative z-40">
                <div className="bg-[#F9F8F6] p-6 md:p-8 xl:py-10 shadow-[0_32px_64px_rgba(0,0,0,0.08)] flex flex-col md:flex-row items-center gap-6 xl:gap-8 w-full border border-[#1A1A1A]/10">
                    <SearchBarContent isSticky={false} />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-x-12 relative z-10">

                {/* Left Sidebar */}
                <div className="md:col-span-4 lg:col-span-3 space-y-12 shrink-0 md:sticky md:top-36 h-max">
                    <div className="pt-8 border-t border-[#1A1A1A]/10 mt-[-2rem]">
                        <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#6C6863] mb-4 block">{t('search.filters.amenities')}</label>
                        <div className="space-y-3 font-serif text-[#1A1A1A] text-sm">
                            {amenities.map(a => (
                                <label key={a.id} className="flex items-center gap-3 cursor-pointer group">
                                    <input type="checkbox" checked={selectedAmenityIds.includes(a.id)} onChange={() => toggleFilter(a.id)} className="accent-[#1A1A1A] w-4 h-4 cursor-pointer align-middle border border-[#1A1A1A] appearance-none checked:bg-[#D4AF37] transition-colors" />
                                    <span className="group-hover:text-[#D4AF37] transition-colors">{a.name}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right - Rooms */}
                <div className="md:col-span-8 lg:col-span-8 lg:col-start-5 space-y-16">
                    <p className="text-[#6C6863] font-serif italic text-sm">{t('search.residencesAvailable', { count: filteredRooms.length })}{nights > 0 ? ` • ${nights} ${nights === 1 ? 'night' : 'nights'}` : ''}</p>

                    {isLoading ? (
                        <div className="py-20 flex justify-center items-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4AF37]"></div>
                        </div>
                    ) : (
                        <>
                            {paginatedRooms.map((room) => (
                                <div key={room.roomTypeId || room.id} className="group grid grid-cols-1 lg:grid-cols-2 gap-8 border-t border-[#1A1A1A]/10 pt-16 mt-16 first:mt-4 first:pt-4">
                                    <Link to={`/room/${room.roomTypeId || room.id}?checkIn=${checkIn ? toISO(checkIn) : ''}&checkOut=${checkOut ? toISO(checkOut) : ''}&adults=${adults}&children=${children}`} className="overflow-hidden aspect-[4/5] relative block">
                                        <img
                                            src={room.imageUrl || "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&auto=format&fit=crop&q=60"}
                                            alt={room.name}
                                            className="w-full h-full object-cover grayscale opacity-90 transition-all duration-[2000ms] group-hover:grayscale-0 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.04)] pointer-events-none"></div>
                                    </Link>
                                    <div className="flex flex-col justify-between py-4 lg:py-8 lg:pl-4">
                                        <div>
                                            <Link to={`/room/${room.roomTypeId || room.id}?checkIn=${checkIn ? toISO(checkIn) : ''}&checkOut=${checkOut ? toISO(checkOut) : ''}&adults=${adults}&children=${children}`}>
                                                <h2 className="text-3xl lg:text-4xl font-serif text-[#1A1A1A] group-hover:text-[#D4AF37] transition-colors duration-700">{room.name}</h2>
                                            </Link>
                                            <div className="mt-6 space-y-2 text-[#6C6863] text-sm leading-relaxed">
                                                <p>{t('search.accommodates', { count: room.maxGuests })}</p>
                                                <p>{room.description || t('search.roomDescription')}</p>
                                                <p className="text-xs text-[#6C6863]/60">{room.availableCount} room{room.availableCount > 1 ? 's' : ''} available</p>
                                            </div>
                                        </div>
                                        <div className="mt-12 space-y-4">
                                            <div className="flex justify-between items-end">
                                                <div>
                                                    <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#6C6863] mb-1">{t('search.startingFrom')}</p>
                                                    <p className="text-2xl font-serif">${room.basePrice} <span className="text-sm italic text-[#6C6863]">/ {t('search.night')}</span></p>
                                                    {nights > 0 && room.total && <p className="text-sm text-[#6C6863] mt-1">${room.total} <span className="text-xs italic">total ({nights}n, incl. 10% VAT)</span></p>}
                                                </div>
                                                <Button
                                                    variant="secondary"
                                                    className="group-hover:bg-[#1A1A1A] group-hover:text-white transition-all duration-700"
                                                    onClick={() => {
                                                        if (!checkIn || !checkOut) {
                                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                                            setActiveDatePicker('normal');
                                                        } else {
                                                            window.location.href = `/checkout?roomType=${room.roomTypeId || room.id}&checkIn=${toISO(checkIn)}&checkOut=${toISO(checkOut)}&adults=${adults}&children=${children}`;
                                                        }
                                                    }}
                                                >
                                                    {!checkIn || !checkOut ? 'Select Dates' : t('search.reserve')}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Pagination Controls */}
                            {totalPages > 1 && (
                                <div className="flex justify-center items-center gap-8 mt-24 pt-12 border-t border-[#1A1A1A]/10">
                                    <button
                                        onClick={() => {
                                            setCurrentPage(prev => Math.max(1, prev - 1));
                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                        }}
                                        disabled={currentPage === 1}
                                        className="group flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] font-bold text-[#1A1A1A] disabled:opacity-20 transition-all"
                                    >
                                        <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="square" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                        </svg>
                                        {t('search.pagination.previous')}
                                    </button>

                                    <div className="flex items-center gap-4">
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                                            <button
                                                key={p}
                                                onClick={() => {
                                                    setCurrentPage(p);
                                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                                }}
                                                className={`w-10 h-10 flex items-center justify-center text-[10px] font-bold transition-all border ${currentPage === p
                                                        ? 'bg-[#1A1A1A] text-[#F9F8F6] border-[#1A1A1A]'
                                                        : 'text-[#1A1A1A]/40 border-transparent hover:border-[#1A1A1A]/10 hover:text-[#1A1A1A]'
                                                    }`}
                                            >
                                                {String(p).padStart(2, '0')}
                                            </button>
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => {
                                            setCurrentPage(prev => Math.min(totalPages, prev + 1));
                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                        }}
                                        disabled={currentPage === totalPages}
                                        className="group flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] font-bold text-[#1A1A1A] disabled:opacity-20 transition-all"
                                    >
                                        {t('search.pagination.next')}
                                        <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="square" strokeWidth="2" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
