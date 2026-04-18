import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export const Profile: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'bookings'>('bookings');

  // Mock Bookings
  const upcomingBookings = [
    { id: 'RES-103', room: 'The Grand Suite', dates: 'Oct 12 - Oct 15, 2026', status: 'Confirmed', price: '$1,350', image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&auto=format&fit=crop&q=60' }
  ];

  const pastBookings = [
    { id: 'RES-042', room: 'Ocean Villa', dates: 'Jan 05 - Jan 08, 2026', status: 'Completed', price: '$2,250', image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&auto=format&fit=crop&q=60' }
  ];

  return (
    <div className="max-w-[1600px] mx-auto w-full px-8 md:px-16 pt-24 pb-40">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-x-12">
        
        {/* Sidebar Nav */}
        <div className="lg:col-span-3 border-b lg:border-b-0 lg:border-r border-[#1A1A1A]/10 pb-8 lg:pb-0 lg:pr-8 h-[max-content] lg:min-h-[50vh]">
          <h1 className="text-4xl md:text-5xl font-serif text-[#1A1A1A] mb-12">
            Welcome,<br />
            <span className="italic">Guest.</span>
          </h1>

          <nav className="flex flex-col space-y-4 text-xs uppercase tracking-[0.2em] font-medium text-[#6C6863]">
            <button onClick={() => setActiveTab('bookings')} className={`text-left py-2 hover:text-[#D4AF37] transition-colors relative ${activeTab === 'bookings' ? 'text-[#1A1A1A] after:-left-4 after:top-1/2 after:-translate-y-1/2 after:absolute after:h-px after:w-2 after:bg-[#D4AF37]' : ''}`}>My Stays</button>
            <button onClick={() => setActiveTab('profile')} className={`text-left py-2 hover:text-[#D4AF37] transition-colors relative ${activeTab === 'profile' ? 'text-[#1A1A1A] after:-left-4 after:top-1/2 after:-translate-y-1/2 after:absolute after:h-px after:w-2 after:bg-[#D4AF37]' : ''}`}>Account Details</button>
            <button className="text-left py-2 border-t border-[#1A1A1A]/10 mt-6 hover:text-red-500 transition-colors">Sign Out</button>
          </nav>
        </div>

        {/* Content */}
        <div className="lg:col-span-8 lg:col-start-5 pt-4">
          
          {activeTab === 'bookings' && (
            <div className="space-y-16">
              
              {/* Upcoming */}
              <div>
                <div className="flex justify-between items-end border-b border-[#1A1A1A]/20 pb-4 mb-8">
                  <h2 className="text-3xl font-serif text-[#1A1A1A]">Upcoming <span className="italic text-[#D4AF37]">Stays</span></h2>
                </div>

                {upcomingBookings.length > 0 ? upcomingBookings.map((booking) => (
                  <Card key={booking.id} className="p-0 border-none shadow-[0_4px_24px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] bg-white overflow-hidden group">
                    <div className="grid grid-cols-1 md:grid-cols-12">
                      <div className="md:col-span-4 aspect-[4/3] md:aspect-auto overflow-hidden relative">
                        <img src={booking.image} alt={booking.room} className="w-full h-full object-cover grayscale opacity-90 transition-all duration-[2000ms] group-hover:grayscale-0 group-hover:scale-105" />
                        <div className="absolute inset-0 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.04)] pointer-events-none"></div>
                      </div>
                      <div className="md:col-span-8 p-8 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start mb-4">
                            <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-[#6C6863]">Confirmation — {booking.id}</span>
                            <span className="text-[10px] uppercase font-bold text-[#D4AF37] bg-[#D4AF37]/10 px-3 py-1 border border-[#D4AF37]/20">{booking.status}</span>
                          </div>
                          <h3 className="text-2xl font-serif text-[#1A1A1A] mb-2">{booking.room}</h3>
                          <p className="text-sm text-[#6C6863]">{booking.dates}</p>
                        </div>

                        <div className="mt-8 pt-6 border-t border-[#1A1A1A]/10 flex gap-4">
                          <Button variant="secondary" className="w-full sm:w-auto h-10 px-6 group-hover:bg-[#1A1A1A] group-hover:text-white transition-all duration-700">Modify</Button>
                          <Button variant="ghost" className="w-full sm:w-auto h-10 px-6 text-[#6C6863] border border-[#6C6863]/20 hover:border-red-500 hover:text-red-500 transition-colors">Cancel Stay</Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                )) : (
                  <p className="text-[#6C6863] italic font-serif">No upcoming stays.</p>
                )}
              </div>

              {/* Past */}
              <div className="pt-12">
                <div className="flex justify-between items-end border-b border-[#1A1A1A]/20 pb-4 mb-8">
                  <h2 className="text-3xl font-serif text-[#1A1A1A]">Past <span className="italic text-[#6C6863]">Journeys</span></h2>
                </div>

                {pastBookings.length > 0 ? pastBookings.map((booking) => (
                  <Card key={booking.id} className="p-0 border border-[#1A1A1A]/10 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.04)] bg-transparent overflow-hidden group">
                    <div className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div>
                         <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-[#6C6863] block mb-2">{booking.id}</span>
                         <h3 className="text-xl font-serif text-[#1A1A1A]">{booking.room}</h3>
                         <p className="text-xs text-[#6C6863] mt-1">{booking.dates} • {booking.price}</p>
                      </div>
                      <Button variant="secondary" className="w-full md:w-auto h-10 px-6 border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white transition-all duration-500">Leave a Review</Button>
                    </div>
                  </Card>
                )) : (
                  <p className="text-[#6C6863] italic font-serif">No past stays.</p>
                )}
              </div>

            </div>
          )}

          {activeTab === 'profile' && (
            <div className="space-y-8 max-w-xl">
               <h2 className="text-3xl font-serif text-[#1A1A1A] border-b border-[#1A1A1A]/20 pb-4 mb-8">Personal <span className="italic text-[#D4AF37]">Information</span></h2>
               <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] uppercase tracking-[0.2em] font-medium text-[#6C6863] mb-1 block">First Name</label>
                    <p className="font-serif text-[#1A1A1A] text-lg">John</p>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-[0.2em] font-medium text-[#6C6863] mb-1 block">Last Name</label>
                    <p className="font-serif text-[#1A1A1A] text-lg">Doe</p>
                  </div>
                  <div className="col-span-2 pt-4">
                    <label className="text-[10px] uppercase tracking-[0.2em] font-medium text-[#6C6863] mb-1 block">Email</label>
                    <p className="font-serif text-[#1A1A1A] text-lg">john.doe@example.com</p>
                  </div>
               </div>
               
               <div className="pt-12 mt-12 border-t border-[#1A1A1A]/10">
                 <Button variant="secondary" className="w-full sm:w-auto">Edit Information</Button>
                 <Button variant="ghost" className="w-full sm:w-auto mt-4 sm:mt-0 sm:ml-4 text-red-500 hover:bg-red-50">Delete Account</Button>
               </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
