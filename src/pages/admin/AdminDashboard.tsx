import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

type AdminTab = 'overview' | 'reservations' | 'inventory' | 'users' | 'reports' | 'settings';

export const AdminDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<AdminTab>('overview');

    return (
        <div className="max-w-[1600px] mx-auto w-full pt-16 md:pt-32 pb-40 px-8 flex flex-col lg:flex-row gap-12">
            
            {/* Sidebar Nav */}
            <div className="lg:w-1/4 border-r border-[#1A1A1A]/10 pr-8 min-h-screen">
                <h1 className="text-3xl md:text-5xl font-serif text-[#1A1A1A] mb-12 mt-8">
                    <span className="italic">Lumière</span><br />
                    Admin
                </h1>
                
                <nav className="flex flex-col space-y-2 text-xs uppercase tracking-[0.2em] font-medium text-[#6C6863]">
                    <button onClick={() => setActiveTab('overview')} className={`text-left py-4 border-t border-[#1A1A1A]/20 transition-colors relative ${activeTab === 'overview' ? 'text-[#1A1A1A] after:-left-4 after:top-1/2 after:-translate-y-1/2 after:absolute after:h-px after:w-2 after:bg-[#D4AF37]' : 'hover:text-[#D4AF37]'}`}>1. Global Overview</button>
                    <button onClick={() => setActiveTab('reservations')} className={`text-left py-4 border-t border-[#1A1A1A]/5 transition-colors relative ${activeTab === 'reservations' ? 'text-[#1A1A1A] after:-left-4 after:top-1/2 after:-translate-y-1/2 after:absolute after:h-px after:w-2 after:bg-[#D4AF37]' : 'hover:text-[#D4AF37]'}`}>2. Reservations</button>
                    <button onClick={() => setActiveTab('inventory')} className={`text-left py-4 border-t border-[#1A1A1A]/5 transition-colors relative ${activeTab === 'inventory' ? 'text-[#1A1A1A] after:-left-4 after:top-1/2 after:-translate-y-1/2 after:absolute after:h-px after:w-2 after:bg-[#D4AF37]' : 'hover:text-[#D4AF37]'}`}>3. Inventory & Rooms</button>
                    <button onClick={() => setActiveTab('users')} className={`text-left py-4 border-t border-[#1A1A1A]/5 transition-colors relative ${activeTab === 'users' ? 'text-[#1A1A1A] after:-left-4 after:top-1/2 after:-translate-y-1/2 after:absolute after:h-px after:w-2 after:bg-[#D4AF37]' : 'hover:text-[#D4AF37]'}`}>4. Users & Staff</button>
                    <button onClick={() => setActiveTab('reports')} className={`text-left py-4 border-t border-[#1A1A1A]/5 transition-colors relative ${activeTab === 'reports' ? 'text-[#1A1A1A] after:-left-4 after:top-1/2 after:-translate-y-1/2 after:absolute after:h-px after:w-2 after:bg-[#D4AF37]' : 'hover:text-[#D4AF37]'}`}>5. Reports Analytics</button>
                    <button onClick={() => setActiveTab('settings')} className={`text-left py-4 border-t border-[#1A1A1A]/5 transition-colors relative ${activeTab === 'settings' ? 'text-[#1A1A1A] after:-left-4 after:top-1/2 after:-translate-y-1/2 after:absolute after:h-px after:w-2 after:bg-[#D4AF37]' : 'hover:text-[#D4AF37]'}`}>6. System Settings</button>
                </nav>
            </div>

            {/* Dynamic Content Pane */}
            <div className="flex-1 w-full pt-8 min-w-0">
                
                {/* 1. Global Overview */}
                {activeTab === 'overview' && (
                    <div className="animate-in fade-in duration-500">
                        <div className="flex justify-between items-end border-b border-[#1A1A1A]/20 pb-4 mb-8">
                            <h2 className="text-3xl font-serif text-[#1A1A1A]">Main <span className="italic text-[#D4AF37]">Dashboard</span></h2>
                            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#6C6863]">Real-time Metrics</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                            <Card className="p-8 border border-[#1A1A1A]/10 bg-white">
                                <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#6C6863] mb-2">Occupancy Rate</p>
                                <p className="text-4xl font-serif text-[#1A1A1A]">85%</p>
                                <p className="text-xs text-green-600 mt-3 flex items-center gap-1 font-medium"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeWidth="2" d="M5 15l7-7 7 7"></path></svg> +5% from last week</p>
                            </Card>
                            <Card className="p-8 border border-[#1A1A1A]/10 bg-white">
                                <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#6C6863] mb-2">Available Rooms</p>
                                <p className="text-4xl font-serif text-[#1A1A1A]">24</p>
                                <p className="text-xs text-[#6C6863] mt-3 font-serif italic">Out of 160 total rooms</p>
                            </Card>
                            <Card className="p-8 border-none bg-[#1A1A1A] text-white">
                                <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/50 mb-2">Daily Revenue</p>
                                <p className="text-4xl font-serif text-[#D4AF37]">$24,500</p>
                                <p className="text-xs text-green-400 mt-3 font-medium">+12% from yesterday</p>
                            </Card>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            <div>
                                <h3 className="text-[10px] uppercase font-bold tracking-[0.3em] text-[#1A1A1A] mb-6">Daily Operations</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center border-b border-[#1A1A1A]/10 pb-4">
                                        <div>
                                            <span className="text-sm font-serif text-[#6C6863] block">Expected Check-ins</span>
                                            <span className="text-[10px] uppercase tracking-[0.1em] text-[#D4AF37]">12 Pending</span>
                                        </div>
                                        <span className="text-2xl font-serif text-[#1A1A1A]">45</span>
                                    </div>
                                    <div className="flex justify-between items-center border-b border-[#1A1A1A]/10 pb-4">
                                        <div>
                                            <span className="text-sm font-serif text-[#6C6863] block">Expected Check-outs</span>
                                            <span className="text-[10px] uppercase tracking-[0.1em] text-[#D4AF37]">4 Completed</span>
                                        </div>
                                        <span className="text-2xl font-serif text-[#1A1A1A]">38</span>
                                    </div>
                                    <div className="flex justify-between items-center border-b border-[#1A1A1A]/10 pb-4">
                                        <div>
                                            <span className="text-sm font-serif text-[#6C6863] block">Stay-overs</span>
                                        </div>
                                        <span className="text-2xl font-serif text-[#1A1A1A]">93</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div>
                                <h3 className="text-[10px] uppercase font-bold tracking-[0.3em] text-[#1A1A1A] mb-6 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> Action Needed (Alerts)</h3>
                                <div className="space-y-4">
                                    <Card className="p-4 border-l-4 border-l-red-500 bg-red-50/50 border-y-0 border-r-0 rounded-r-lg">
                                        <p className="text-sm font-bold text-[#1A1A1A] mb-1">Overbooked Room Type</p>
                                        <p className="text-xs text-red-900/70 font-serif">Standard King is overbooked by 2 rooms for Oct 15.</p>
                                    </Card>
                                    <Card className="p-4 border-l-4 border-l-yellow-500 bg-yellow-50/50 border-y-0 border-r-0 rounded-r-lg">
                                        <p className="text-sm font-bold text-[#1A1A1A] mb-1">Payment Failure</p>
                                        <p className="text-xs text-yellow-900/70 font-serif">Deposit failed for Confirmation #RES-1042.</p>
                                    </Card>
                                    <Card className="p-4 border-l-4 border-l-blue-500 bg-blue-50/50 border-y-0 border-r-0 rounded-r-lg">
                                        <p className="text-sm font-bold text-[#1A1A1A] mb-1">Pending Guest Request</p>
                                        <p className="text-xs text-blue-900/70 font-serif">Room 304 requested late checkout.</p>
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
                            <h2 className="text-3xl font-serif text-[#1A1A1A]">Front <span className="italic text-[#D4AF37]">Desk</span></h2>
                            <div className="flex gap-4">
                                <Button variant="ghost" className="border border-[#1A1A1A]/20 text-[10px] uppercase font-bold tracking-[0.1em] h-10 px-4 whitespace-nowrap">Walk-in Booking</Button>
                                <Button variant="primary" className="bg-[#1A1A1A] text-white hover:bg-[#D4AF37] transition-colors text-[10px] uppercase font-bold tracking-[0.1em] h-10 px-4 whitespace-nowrap">Calendar / Grid</Button>
                            </div>
                        </div>

                        {/* Searchable Directory */}
                        <div className="mb-0 flex flex-col md:flex-row gap-4 bg-[#F9F8F6] p-4 border border-[#1A1A1A]/10 border-b-0">
                            <input type="text" placeholder="Search by Name, Conf#, or Room" className="flex-1 p-3 border border-[#1A1A1A]/10 bg-white text-sm focus:border-[#D4AF37] outline-none font-serif italic" />
                            <select className="p-3 border border-[#1A1A1A]/10 bg-white text-sm focus:border-[#D4AF37] outline-none uppercase tracking-widest text-[10px] font-bold text-[#6C6863]">
                                <option>Status: All</option>
                                <option>Checked In</option>
                                <option>Reserved</option>
                                <option>Checked Out</option>
                            </select>
                        </div>

                        <div className="overflow-x-auto border border-[#1A1A1A]/10 bg-white min-h-[50vh]">
                            <table className="w-full text-left border-collapse whitespace-nowrap">
                                <thead>
                                    <tr className="border-b border-[#1A1A1A]/20 text-[10px] uppercase tracking-[0.2em] text-[#6C6863] bg-[#F9F8F6]">
                                        <th className="py-4 px-6 font-medium">Guest</th>
                                        <th className="py-4 px-6 font-medium">Conf #</th>
                                        <th className="py-4 px-6 font-medium">Room</th>
                                        <th className="py-4 px-6 font-medium">Dates</th>
                                        <th className="py-4 px-6 font-medium">Status</th>
                                        <th className="py-4 px-6 font-medium text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[1, 2, 3, 4, 5].map(i => (
                                        <tr key={i} className="border-b border-[#1A1A1A]/5 hover:bg-[#F9F8F6]/50 transition-colors group">
                                            <td className="py-4 px-6 text-sm font-bold text-[#1A1A1A] font-serif">Jane Doe</td>
                                            <td className="py-4 px-6 text-xs text-[#6C6863]">RES-108{i}</td>
                                            <td className="py-4 px-6 text-sm text-[#1A1A1A] font-serif italic text-[#D4AF37]">{i % 2 === 0 ? 'The Grand Suite' : 'Ocean Villa'}</td>
                                            <td className="py-4 px-6 text-xs text-[#6C6863]">Oct 14 - Oct 18</td>
                                            <td className="py-4 px-6">
                                                <span className={`text-[9px] uppercase font-bold tracking-widest px-2 py-1 ${i === 1 ? 'bg-green-100/50 border border-green-200 text-green-700' : 'bg-blue-100/50 border border-blue-200 text-blue-700'}`}>
                                                    {i === 1 ? 'Checked In' : 'Reserved'}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-xs text-right space-x-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="text-[#D4AF37] hover:text-[#1A1A1A] uppercase tracking-widest font-bold text-[9px]">Edit</button>
                                                {i === 1 ? (
                                                    <button className="text-[#1A1A1A] hover:text-red-600 uppercase tracking-widest font-bold text-[9px]">Check Out</button>
                                                ) : (
                                                    <button className="text-[#1A1A1A] hover:text-green-600 uppercase tracking-widest font-bold text-[9px]">Check In</button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* 3. Inventory & Room Management */}
                {activeTab === 'inventory' && (
                    <div className="animate-in fade-in duration-500">
                        <div className="flex justify-between items-end border-b border-[#1A1A1A]/20 pb-4 mb-8">
                            <h2 className="text-3xl font-serif text-[#1A1A1A]">Inventory <span className="italic text-[#D4AF37]">Management</span></h2>
                            <Button variant="primary" className="bg-[#1A1A1A] hover:bg-[#D4AF37] transition-colors text-white text-[10px] uppercase tracking-widest font-bold h-10 px-6">+ Add Category</Button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                            <div className="lg:col-span-8">
                                <h3 className="text-[10px] uppercase font-bold tracking-[0.3em] text-[#1A1A1A] mb-6">Room Status Control</h3>
                                <div className="space-y-4">
                                    {[
                                        { num: '101', type: 'Standard King', status: 'Available', statusColor: 'border-l-green-500' },
                                        { num: '102', type: 'Standard King', status: 'Occupied', statusColor: 'border-l-blue-500' },
                                        { num: '201', type: 'Ocean Villa', status: 'Cleaning', statusColor: 'border-l-yellow-500' },
                                        { num: '405', type: 'The Grand Suite', status: 'Maintenance', statusColor: 'border-l-red-500' }
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
                                                        <option>Set Status</option>
                                                        <option>Available</option>
                                                        <option>Occupied</option>
                                                        <option>Cleaning</option>
                                                        <option>Maintenance</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            </div>

                            <div className="lg:col-span-4">
                                <h3 className="text-[10px] uppercase font-bold tracking-[0.3em] text-[#1A1A1A] mb-6">Rate Control Defaults</h3>
                                <Card className="p-8 border border-[#1A1A1A]/10 bg-white">
                                    <div className="space-y-6">
                                        <div>
                                            <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#6C6863] mb-2 block">Seasonal Multipliers</label>
                                            <div className="flex items-center justify-between border-b border-[#1A1A1A]/10 pb-3">
                                                <div>
                                                    <span className="text-sm font-serif text-[#1A1A1A] block">High Season Multiplier</span>
                                                    <span className="text-[10px] uppercase tracking-widest text-[#D4AF37]">Dec - Mar</span>
                                                </div>
                                                <span className="font-mono bg-[#F9F8F6] px-2 py-1 border border-[#1A1A1A]/10">1.25x</span>
                                            </div>
                                        </div>

                                        <div className="pt-4">
                                            <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#6C6863] mb-2 block">Active Promotions</label>
                                            <div className="flex items-center justify-between bg-[#1A1A1A] text-white p-3 mb-2 rounded-sm">
                                                <span className="font-mono text-sm tracking-widest">SUMMER20</span>
                                                <span className="text-xs font-bold text-[#D4AF37]">-20% Off</span>
                                            </div>
                                            <div className="flex items-center justify-between bg-[#F9F8F6] border border-[#1A1A1A]/10 p-3 rounded-sm">
                                                <span className="font-mono text-sm tracking-widest font-bold">VIPUPGRADE</span>
                                                <span className="text-[10px] uppercase font-bold text-[#6C6863]">Free Category Up</span>
                                            </div>
                                        </div>
                                        <Button variant="ghost" className="border border-[#1A1A1A]/20 w-full text-[10px] uppercase tracking-widest font-bold h-10 mt-4 border-dashed border-[#1A1A1A]/20">Edit Pricing Rules</Button>
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
                            <h2 className="text-3xl font-serif text-[#1A1A1A]">Staff <span className="italic text-[#D4AF37]">& Roles</span></h2>
                            <Button variant="ghost" className="border border-[#1A1A1A]/20 text-[10px] uppercase tracking-widest font-bold h-10 px-6">+ Register Account</Button>
                        </div>
                        
                        <div className="overflow-x-auto border border-[#1A1A1A]/10 bg-white">
                            <table className="w-full text-left border-collapse whitespace-nowrap">
                                <thead>
                                    <tr className="border-b border-[#1A1A1A]/10 text-[10px] uppercase tracking-[0.2em] text-[#6C6863] bg-[#F9F8F6]">
                                        <th className="py-4 px-6 font-medium">Name</th>
                                        <th className="py-4 px-6 font-medium">Role (RBAC)</th>
                                        <th className="py-4 px-6 font-medium">Department</th>
                                        <th className="py-4 px-6 font-medium text-right">Settings</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        { name: 'Sarah Jenkins', role: 'Super Admin', dept: 'Management' },
                                        { name: 'Michael Chang', role: 'Receptionist', dept: 'Front Desk' },
                                        { name: 'Elena Rodriguez', role: 'Housekeeping', dept: 'Services' }
                                    ].map((staff, i) => (
                                        <tr key={i} className="border-b border-[#1A1A1A]/5 hover:bg-[#F9F8F6] transition-colors group">
                                            <td className="py-4 px-6">
                                                <p className="text-sm font-bold text-[#1A1A1A]">{staff.name}</p>
                                                <p className="text-xs text-[#6C6863] font-serif italic">ID: EMP-0{i+1}42</p>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className="text-[10px] uppercase tracking-widest font-bold bg-[#1A1A1A] text-white px-2 py-1">{staff.role}</span>
                                            </td>
                                            <td className="py-4 px-6 text-sm text-[#1A1A1A] font-serif">{staff.dept}</td>
                                            <td className="py-4 px-6 text-xs text-right opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="text-[#D4AF37] hover:text-[#1A1A1A] uppercase tracking-widest font-bold text-[9px] mr-4">Edit Role</button>
                                                <button className="text-red-500 hover:text-red-800 uppercase tracking-widest font-bold text-[9px]">Revoke Access</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-16 pt-16 border-t border-[#1A1A1A]/10">
                            <h3 className="text-[10px] uppercase font-bold tracking-[0.3em] text-[#1A1A1A] mb-2">Guest Database CRM</h3>
                            <p className="text-sm text-[#6C6863] font-serif italic mb-8">Access historical guest profiles, lifetime stays, and maintain internal notes.</p>
                            <Card className="p-8 border-dashed border-2 border-[#1A1A1A]/10 bg-transparent flex flex-col items-center justify-center gap-4 hover:border-[#D4AF37]/50 hover:bg-white transition-all cursor-pointer group">
                                <svg className="w-8 h-8 text-[#1A1A1A]/30 group-hover:text-[#D4AF37] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeWidth="1.5" d="M12 4v16m8-8H4"></path></svg>
                                <span className="text-[10px] uppercase tracking-widest font-bold text-[#1A1A1A]">Open CRM Module</span>
                            </Card>
                        </div>
                    </div>
                )}

                {/* 5. Reports & Analytics */}
                {activeTab === 'reports' && (
                    <div className="animate-in fade-in duration-500">
                        <div className="border-b border-[#1A1A1A]/20 pb-4 mb-8">
                            <h2 className="text-3xl font-serif text-[#1A1A1A]">Data <span className="italic text-[#D4AF37]">Export & Analytics</span></h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <Card className="p-8 border border-[#1A1A1A]/10 bg-white">
                                <div className="border-b border-[#1A1A1A]/10 pb-6 mb-6">
                                    <h3 className="text-lg font-serif text-[#1A1A1A] mb-1">Financial Ledgers</h3>
                                    <p className="text-xs text-[#6C6863]">Generated revenue breakdowns, taxes, and payment gateways routing.</p>
                                </div>
                                <div className="space-y-4 flex flex-col">
                                    <Button variant="ghost" className="border border-[#1A1A1A]/20 justify-between text-[10px] h-12 uppercase tracking-widest font-bold border-[#1A1A1A]/20 hover:border-[#1A1A1A] group"><span>Monthly Revenue Ledger</span> <span className="text-[#D4AF37] group-hover:text-[#1A1A1A]">Export CSV</span></Button>
                                    <Button variant="ghost" className="border border-[#1A1A1A]/20 justify-between text-[10px] h-12 uppercase tracking-widest font-bold border-[#1A1A1A]/20 hover:border-[#1A1A1A] group"><span>Tax Remittance (Q3)</span> <span className="text-red-600 group-hover:text-[#1A1A1A]">Download PDF</span></Button>
                                </div>
                            </Card>

                            <Card className="p-8 border border-[#1A1A1A]/10 bg-white">
                                <div className="border-b border-[#1A1A1A]/10 pb-6 mb-6">
                                    <h3 className="text-lg font-serif text-[#1A1A1A] mb-1">Operational Manifests</h3>
                                    <p className="text-xs text-[#6C6863]">Daily housekeeping task lists, maintenance schedules, and food & beverage.</p>
                                </div>
                                <div className="space-y-4 flex flex-col">
                                    <Button variant="ghost" className="border border-[#1A1A1A]/20 justify-between text-[10px] h-12 uppercase tracking-widest font-bold border-[#1A1A1A]/20 hover:border-[#1A1A1A] group"><span>Today's Housekeeping Route</span> <span className="text-red-600 group-hover:text-[#1A1A1A]">Print PDF</span></Button>
                                    <Button variant="ghost" className="border border-[#1A1A1A]/20 justify-between text-[10px] h-12 uppercase tracking-widest font-bold border-[#1A1A1A]/20 hover:border-[#1A1A1A] group"><span>Occupancy Forecast (30 Day)</span> <span className="text-[#D4AF37] group-hover:text-[#1A1A1A]">Export CSV</span></Button>
                                </div>
                            </Card>
                        </div>
                    </div>
                )}

                {/* 6. System Settings */}
                {activeTab === 'settings' && (
                    <div className="animate-in fade-in duration-500">
                        <div className="border-b border-[#1A1A1A]/20 pb-4 mb-8">
                            <h2 className="text-3xl font-serif text-[#1A1A1A]">Global <span className="italic text-[#D4AF37]">Configuration</span></h2>
                        </div>

                        <div className="max-w-3xl space-y-12">
                            {/* Property Details */}
                            <Card className="p-8 border border-[#1A1A1A]/10 bg-white">
                                <h3 className="text-[10px] uppercase font-bold tracking-[0.3em] text-[#1A1A1A] mb-8 pb-4 border-b border-[#1A1A1A]/10">Property Meta</h3>
                                <div className="space-y-6">
                                    <div>
                                        <label className="text-[10px] uppercase tracking-[0.2em] font-medium text-[#6C6863] mb-2 block">Official Hotel Name</label>
                                        <input type="text" defaultValue="Lumière Hotel & Resort" className="w-full border-b border-[#1A1A1A]/20 bg-transparent outline-none focus:border-[#D4AF37] pb-2 font-serif text-xl text-[#1A1A1A]" />
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                        <div>
                                            <label className="text-[10px] uppercase tracking-[0.2em] font-medium text-[#6C6863] mb-2 block">Standard Tax Rate (%)</label>
                                            <input type="text" defaultValue="8.5" className="w-full border-b border-[#1A1A1A]/20 bg-transparent outline-none focus:border-[#D4AF37] pb-2 font-mono text-lg text-[#1A1A1A]" />
                                        </div>
                                        <div>
                                            <label className="text-[10px] uppercase tracking-[0.2em] font-medium text-[#6C6863] mb-2 block">Base Currency</label>
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
                                <h3 className="text-[10px] uppercase font-bold tracking-[0.3em] text-[#F9F8F6]/50 mb-8 pb-4 border-b border-white/10">3rd-Party Integrations</h3>
                                <div className="space-y-6">
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 bg-white/5 p-6 border border-white/10">
                                        <div>
                                            <p className="text-sm font-bold text-white mb-1">Payment Gateway (Stripe)</p>
                                            <p className="text-[10px] uppercase tracking-widest text-[#D4AF37]">● API Key Active</p>
                                        </div>
                                        <Button variant="ghost" className="border border-[#1A1A1A]/20 text-[10px] uppercase tracking-widest font-bold h-8 border-white/20 hover:border-white text-white">Renew Token</Button>
                                    </div>
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 bg-white/5 p-6 border border-white/10">
                                        <div>
                                            <p className="text-sm font-bold text-white mb-1">SMS Notifications (Twilio)</p>
                                            <p className="text-[10px] uppercase tracking-widest text-red-500">○ Disconnected</p>
                                        </div>
                                        <Button variant="ghost" className="border border-[#1A1A1A]/20 text-[10px] uppercase tracking-widest font-bold h-8 border-white/20 hover:border-white text-white bg-white/10">Provide Key</Button>
                                    </div>
                                </div>
                            </Card>

                            <div className="flex justify-end pt-4">
                                <Button variant="primary" className="bg-[#D4AF37] hover:bg-[#1A1A1A] text-white text-[10px] uppercase tracking-[0.2em] font-bold h-12 px-12 transition-colors">Commit Global Changes</Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
