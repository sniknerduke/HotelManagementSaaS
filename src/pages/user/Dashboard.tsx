import React from 'react';
import { Card } from '../../components/ui/Card';

export const Dashboard: React.FC = () => {
    return (
        <div className="max-w-[1600px] mx-auto w-full pt-16 md:pt-32 pb-40 px-8 md:px-16 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-x-12">
            
            {/* Sidebar nav for Staff Dashboard */}
            <div className="lg:col-span-3 border-r border-[#1A1A1A]/10 pr-8 min-h-screen">
                <h1 className="text-3xl md:text-5xl font-serif text-[#1A1A1A] mb-12">
                    <span className="italic">Lumière</span><br />
                    Management
                </h1>
                
                <nav className="flex flex-col space-y-2 mt-20 text-xs uppercase tracking-[0.2em] font-medium text-[#6C6863]">
                    <a href="#" className="py-4 border-t border-[#1A1A1A]/10 text-[#1A1A1A] hover:text-[#D4AF37] transition-colors relative after:-left-4 after:top-1/2 after:-translate-y-1/2 after:absolute after:h-px after:w-2 after:bg-[#D4AF37]">Overview</a>
                    <a href="#" className="py-4 border-t border-[#1A1A1A]/10 hover:text-[#D4AF37] transition-colors">Reservations</a>
                    <a href="#" className="py-4 border-t border-[#1A1A1A]/10 hover:text-[#D4AF37] transition-colors">Inventory</a>
                    <a href="#" className="py-4 border-t border-[#1A1A1A]/10 hover:text-[#D4AF37] transition-colors hover:bg-transparent">Guests</a>
                    <a href="#" className="py-4 border-t border-[#1A1A1A]/10 hover:text-[#D4AF37] transition-colors border-b">Settings</a>
                </nav>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-8 lg:col-start-5 space-y-16">
                <div>
                    <h2 className="text-[#1A1A1A] font-serif text-3xl mb-8">Performance <span className="italic text-[#D4AF37]">Metrics</span></h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                        <Card className="py-8 border-t border-[#1A1A1A]/20 shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-shadow duration-[700ms]">
                            <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#6C6863] mb-4">Today's Occupancy</p>
                            <p className="text-4xl md:text-6xl font-serif">84<span className="text-xl italic text-[#6C6863]">%</span></p>
                        </Card>
                        <Card className="py-8 border-t border-[#1A1A1A]/20 shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-shadow duration-[700ms]">
                            <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#6C6863] mb-4">Pending Check-Ins</p>
                            <p className="text-4xl md:text-6xl font-serif text-[#D4AF37]">12</p>
                        </Card>
                        <Card className="py-8 border-t border-[#1A1A1A]/20 shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-shadow duration-[700ms]">
                            <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#6C6863] mb-4">Revenue (MTD)</p>
                            <p className="text-4xl md:text-6xl font-serif">$42<span className="text-xl italic text-[#6C6863]">k</span></p>
                        </Card>
                    </div>
                </div>

                <div className="pt-8">
                    <div className="flex justify-between items-end mb-8 border-b border-[#1A1A1A]/20 pb-4">
                         <h3 className="font-serif text-[#1A1A1A] text-2xl">Recent Reservations</h3>
                         <a href="#" className="uppercase text-[10px] tracking-[0.2em] font-medium text-[#6C6863] hover:text-[#D4AF37] transition-colors pb-1">View All Calendar</a>
                    </div>
                    
                    <table className="w-full text-left font-sans text-sm text-[#1A1A1A] border-collapse">
                        <thead>
                            <tr className="border-b border-[#1A1A1A]/10 text-[10px] uppercase tracking-[0.25em] text-[#6C6863]">
                                <th className="pb-4 font-normal">Guest</th>
                                <th className="pb-4 font-normal">Dates</th>
                                <th className="pb-4 font-normal">Residence</th>
                                <th className="pb-4 font-normal">Status</th>
                                <th className="pb-4 font-normal text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#1A1A1A]/5">
                            <tr className="group hover:bg-[#F9F8F6]/80 transition-colors duration-[700ms]">
                                <td className="py-6 font-serif italic group-hover:text-[#D4AF37] transition-colors duration-500">Eleanor Vance</td>
                                <td className="py-6 text-[#6C6863]">Apr 22 - Apr 26</td>
                                <td className="py-6 text-[#6C6863]">The Grand Suite</td>
                                <td className="py-6"><span className="px-3 py-1 bg-[#1A1A1A] text-white text-[10px] uppercase tracking-[0.1em]">Confirmed</span></td>
                                <td className="py-6 text-right"><button className="text-[10px] uppercase tracking-[0.2em] text-[#6C6863] hover:text-[#1A1A1A] underline underline-offset-4">Manage</button></td>
                            </tr>
                            <tr className="group hover:bg-[#F9F8F6]/80 transition-colors duration-[700ms]">
                                <td className="py-6 font-serif italic group-hover:text-[#D4AF37] transition-colors duration-500">Julien Crain</td>
                                <td className="py-6 text-[#6C6863]">Apr 23 - Apr 24</td>
                                <td className="py-6 text-[#6C6863]">Ocean Villa</td>
                                <td className="py-6"><span className="px-3 py-1 bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 text-[10px] uppercase tracking-[0.1em]">Pending</span></td>
                                <td className="py-6 text-right"><button className="text-[10px] uppercase tracking-[0.2em] text-[#6C6863] hover:text-[#1A1A1A] underline underline-offset-4">Manage</button></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
