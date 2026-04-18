import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';

const mockRooms = [
    { id: 1, name: "The Grand Suite", price: 450, guests: 2, image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&auto=format&fit=crop&q=60" },
    { id: 2, name: "Ocean Villa", price: 750, guests: 4, image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&auto=format&fit=crop&q=60" },
    { id: 3, name: "Standard King", price: 250, guests: 2, image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&auto=format&fit=crop&q=60" }
];

export const SearchResults: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <div className="max-w-[1600px] mx-auto w-full px-8 md:px-16 pt-24 pb-40">
            <h1 className="text-4xl md:text-6xl font-serif text-[#1A1A1A] mb-16 leading-[1.1]">
                Find your <span className="italic">escape.</span>
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-x-12">
                
                {/* 2-column Layout: Left Sidebar for filtering */}
                <div className="md:col-span-4 lg:col-span-3 space-y-12 shrink-0 md:sticky md:top-36 h-max">
                    <Card variant="default" className="border-t border-[#1A1A1A] py-8">
                         <h3 className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#6C6863] mb-6">Reservation Details</h3>
                         <div className="space-y-6">
                            <Input label="Check-In" type="date" placeholder="Select date" />
                            <Input label="Check-Out" type="date" placeholder="Select date" />
                            <Input label="Guests" type="number" min="1" placeholder="1 Guest" />
                            <Button className="w-full mt-4">Search Availability</Button>
                         </div>
                    </Card>

                    <div className="pt-8 border-t border-[#1A1A1A]/10">
                        <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#6C6863] mb-4 block">Amenities</label>
                        <div className="space-y-3 font-serif text-[#1A1A1A] text-sm">
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <input type="checkbox" className="accent-[#1A1A1A] w-4 h-4 cursor-pointer align-middle border border-[#1A1A1A] appearance-none checked:bg-[#D4AF37] transition-colors" />
                                <span className="group-hover:text-[#D4AF37] transition-colors">Private Pool</span>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <input type="checkbox" className="accent-[#1A1A1A] w-4 h-4 cursor-pointer align-middle border border-[#1A1A1A] appearance-none checked:bg-[#D4AF37] transition-colors" />
                                <span className="group-hover:text-[#D4AF37] transition-colors">Ocean View</span>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <input type="checkbox" className="accent-[#1A1A1A] w-4 h-4 cursor-pointer align-middle border border-[#1A1A1A] appearance-none checked:bg-[#D4AF37] transition-colors" />
                                <span className="group-hover:text-[#D4AF37] transition-colors">Butler Service</span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Right Main Column: Rooms */}
                <div className="md:col-span-8 lg:col-span-8 lg:col-start-5 space-y-16">
                    <p className="text-[#6C6863] font-serif italic text-sm">{mockRooms.length} Residences available.</p>

                    {mockRooms.map((room, idx) => (
                        <div key={idx} className="group grid grid-cols-1 lg:grid-cols-2 gap-8 border-t border-[#1A1A1A]/10 pt-16 mt-16 first:mt-4 first:pt-4">
                            <div className="overflow-hidden aspect-[4/5] relative">
                                <img 
                                    src={room.image} 
                                    alt={room.name} 
                                    className="w-full h-full object-cover grayscale opacity-90 transition-all duration-[2000ms] group-hover:grayscale-0 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.04)] pointer-events-none"></div>
                            </div>
                            <div className="flex flex-col justify-between py-4 lg:py-8 lg:pl-4">
                                <div>
                                    <h2 className="text-3xl lg:text-4xl font-serif text-[#1A1A1A] group-hover:text-[#D4AF37] transition-colors duration-700">{room.name}</h2>
                                    <div className="mt-6 space-y-2 text-[#6C6863] text-sm leading-relaxed">
                                        <p>Accommodates up to {room.guests} guests.</p>
                                        <p>Spacious open-plan living with artisanal details and curated bespoke furniture.</p>
                                    </div>
                                </div>
                                <div className="mt-12 flex justify-between items-end">
                                    <div>
                                        <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#6C6863] mb-1">Starting from</p>
                                        <p className="text-2xl font-serif">${room.price} <span className="text-sm italic text-[#6C6863]">/ night</span></p>
                                    </div>
                                    <Button 
                                        variant="secondary" 
                                        className="group-hover:bg-[#1A1A1A] group-hover:text-white transition-all duration-700"
                                        onClick={() => window.location.href = '/checkout'}
                                    >
                                        Reserve
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
