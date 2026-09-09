import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Key, Search, Trash2, Download, RefreshCw, X, Eye, EyeOff, Users, CheckCircle, XCircle, FileSpreadsheet, CloudLightning, Ticket } from 'lucide-react';
import { RsvpGuest } from '../types';
import { deleteRsvp, updateRsvpStatus, subscribeToRsvps, isFirebaseConfigured, getRsvps } from '../lib/firebase';
import RsvpPassModal from './RsvpPassModal';
import Footer from './Footer';

export default function AdminPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [guests, setGuests] = useState<RsvpGuest[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [attendanceFilter, setAttendanceFilter] = useState<'all' | 'yes' | 'no'>('all');
  const [passcodeError, setPasscodeError] = useState('');
  const [selectedGuestForPass, setSelectedGuestForPass] = useState<RsvpGuest | null>(null);

  // Subscribe to real-time updates from Firebase (with local sandbox fallback)
  useEffect(() => {
    const unsubscribe = subscribeToRsvps((updatedGuests) => {
      setGuests(updatedGuests);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setPasscodeError('');

    const code = passcode.trim().toLowerCase();
    if (
      code === '#veeandphil2026' || 
      code === 'veeandphil2026' || 
      code === 'veephil2026' || 
      code === '#veephil2026' || 
      code === '25102026' || 
      code === '#philcollins2026' || 
      code === 'philcollins2026'
    ) {
      setIsAuthenticated(true);
      setPasscode('');
    } else {
      setPasscodeError('Incorrect passcode. Access Denied.');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this RSVP entry?')) {
      try {
        await deleteRsvp(id);
      } catch (err) {
        console.error('Failed to delete RSVP:', err);
      }
    }
  };

  const handleToggleAttendance = async (id: string) => {
    const guest = guests.find((g) => g.id === id);
    if (!guest) return;

    const nextAttend = guest.willAttend === 'yes' ? 'no' : 'yes';
    const nextSeats = nextAttend === 'yes' ? 1 : 0;

    try {
      await updateRsvpStatus(id, nextAttend, nextSeats);
    } catch (err) {
      console.error('Failed to update attendance:', err);
    }
  };

  const handleExportCSV = () => {
    if (guests.length === 0) return;

    // Construct CSV Header and Content
    const headers = ['ID', 'Full Name', 'Phone Number', 'Will Attend', 'Seats Requested', 'Notes', 'Submitted At'];
    const rows = guests.map((g) => [
      g.id,
      `"${g.fullName.replace(/"/g, '""')}"`,
      `"${g.phoneNumber}"`,
      g.willAttend === 'yes' ? 'YES' : 'NO',
      g.adultsCount,
      `"${(g.notes || '').replace(/"/g, '""')}"`,
      g.submittedAt,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    
    // Create hidden trigger to download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `venessa_and_philemon_wedding_rsvps_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered lists
  const filteredGuests = guests.filter((g) => {
    const matchesSearch =
      g.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.phoneNumber.includes(searchQuery);

    const matchesAttendance =
      attendanceFilter === 'all' ||
      (attendanceFilter === 'yes' && g.willAttend === 'yes') ||
      (attendanceFilter === 'no' && g.willAttend === 'no');

    return matchesSearch && matchesAttendance;
  });

  // Aggregate stats
  const totalRsvps = guests.length;
  const totalAttending = guests.filter((g) => g.willAttend === 'yes').length;
  const totalDeclined = guests.filter((g) => g.willAttend === 'no').length;
  const totalSeats = guests.reduce((sum, g) => sum + (g.willAttend === 'yes' ? g.adultsCount : 0), 0);

  return (
    <>
      {/* Wedding Minisite Footer */}
      <Footer onOpenAdmin={() => setIsOpen(true)} />

      {/* Full screen modal wrapper */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-stone-900/65 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
          >
            <div className="bg-white border border-stone-200 rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden relative flex flex-col my-8 max-h-[90vh]">
              {/* Header */}
              <div className="border-b border-stone-100 p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-700">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-serif text-xl text-stone-900 font-medium">Admin Guest Manager</h3>
                      {isFirebaseConfigured ? (
                        <span className="flex items-center gap-1 text-[8px] text-emerald-700 bg-emerald-50 border border-emerald-200/50 px-1.5 py-0.5 rounded font-sans font-bold uppercase tracking-wider">
                          Cloud Live
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[8px] text-amber-700 bg-amber-50 border border-amber-200/50 px-1.5 py-0.5 rounded font-sans font-bold uppercase tracking-wider">
                          Sandbox
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-stone-500 font-sans">Venessa &amp; Philemon Wedding RSVP Dashboard</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-stone-50 rounded-full text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Login authentication overlay if not authenticated */}
              {!isAuthenticated ? (
                <div className="p-12 flex flex-col items-center justify-center text-center max-w-sm mx-auto space-y-6">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-700 animate-pulse">
                    <Key className="w-8 h-8" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-serif text-lg text-stone-900 font-medium">Passcode Required</h4>
                    <p className="text-xs text-stone-500">Exclusively for Venessa &amp; Philemon to access the guest RSVP database.</p>
                  </div>

                  <form onSubmit={handleLogin} className="w-full space-y-4">
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="Enter Admin Passcode"
                        value={passcode}
                        onChange={(e) => setPasscode(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-200 focus:border-maroon-700 rounded-xl pl-4 pr-11 py-3 text-sm text-stone-800 outline-none transition-colors text-center"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-3 text-stone-400 hover:text-stone-700 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    {passcodeError && (
                      <p className="text-xs text-rose-600 font-medium">{passcodeError}</p>
                    )}

                    <button
                      type="submit"
                      className="w-full py-3 bg-maroon-700 hover:bg-maroon-800 text-white font-sans font-bold uppercase tracking-wider text-xs rounded-xl shadow-md transition-all cursor-pointer"
                    >
                      Authenticate Access
                    </button>
                  </form>
                </div>
              ) : (
                /* Authenticated Dashboard Panel */
                <div className="p-6 overflow-y-auto space-y-6 flex-1 flex flex-col">
                  {/* Dashboard stats cards */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {/* Stat 1 */}
                    <div className="bg-[#FCFAF7] border border-stone-200 p-4 rounded-2xl flex items-center gap-3.5 shadow-sm">
                      <div className="w-10 h-10 rounded-xl bg-maroon-50 text-maroon-700 flex items-center justify-center shrink-0">
                        <Users className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] text-stone-500 uppercase font-sans font-bold">Total RSVPs</p>
                        <p className="text-xl font-semibold font-serif text-stone-900">{totalRsvps}</p>
                      </div>
                    </div>

                    {/* Stat 2 */}
                    <div className="bg-[#FCFAF7] border border-stone-200 p-4 rounded-2xl flex items-center gap-3.5 shadow-sm">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                        <CheckCircle className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] text-stone-500 uppercase font-sans font-bold">Attending Accounts</p>
                        <p className="text-xl font-semibold font-serif text-stone-900">{totalAttending}</p>
                      </div>
                    </div>

                    {/* Stat 3 */}
                    <div className="bg-[#FCFAF7] border border-stone-200 p-4 rounded-2xl flex items-center gap-3.5 shadow-sm">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                        <Users className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] text-stone-500 uppercase font-sans font-bold">Total Seats</p>
                        <p className="text-xl font-semibold font-serif text-stone-900">{totalSeats}</p>
                      </div>
                    </div>

                    {/* Stat 4 */}
                    <div className="bg-[#FCFAF7] border border-stone-200 p-4 rounded-2xl flex items-center gap-3.5 shadow-sm">
                      <div className="w-10 h-10 rounded-xl bg-stone-100 text-stone-600 flex items-center justify-center shrink-0">
                        <XCircle className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] text-stone-500 uppercase font-sans font-bold">Declined Count</p>
                        <p className="text-xl font-semibold font-serif text-stone-900">{totalDeclined}</p>
                      </div>
                    </div>
                  </div>

                  {/* Filter and Action Header */}
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-2">
                    {/* Search and Filters */}
                    <div className="flex flex-wrap items-center gap-3 w-full md:w-auto flex-1">
                      {/* Search Bar */}
                      <div className="relative flex-1 max-w-sm min-w-[200px]">
                        <Search className="absolute left-3.5 top-3 w-4 h-4 text-stone-400" />
                        <input
                          type="text"
                          placeholder="Search guest by name or phone..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full bg-stone-50 border border-stone-200 focus:border-maroon-700 rounded-xl pl-10 pr-4 py-2 text-xs text-stone-800 outline-none transition-colors"
                        />
                      </div>

                      {/* Filter Pills */}
                      <div className="inline-flex bg-stone-50 border border-stone-200 rounded-lg p-1 text-xs">
                        <button
                          onClick={() => setAttendanceFilter('all')}
                          className={`px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
                            attendanceFilter === 'all' ? 'bg-maroon-700 text-white font-bold' : 'text-stone-550 hover:text-stone-900'
                          }`}
                        >
                          All
                        </button>
                        <button
                          onClick={() => setAttendanceFilter('yes')}
                          className={`px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
                            attendanceFilter === 'yes' ? 'bg-maroon-700 text-white font-bold' : 'text-stone-550 hover:text-stone-900'
                          }`}
                        >
                          Attending
                        </button>
                        <button
                          onClick={() => setAttendanceFilter('no')}
                          className={`px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
                            attendanceFilter === 'no' ? 'bg-maroon-700 text-white font-bold' : 'text-stone-550 hover:text-stone-900'
                          }`}
                        >
                          Declined
                        </button>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                      <button
                        onClick={() => { getRsvps().then(setGuests); }}
                        className="px-3.5 py-2 bg-white border border-stone-200 hover:bg-stone-50 text-stone-600 hover:text-stone-900 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
                        title="Reload Database"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Refresh</span>
                      </button>
                      
                      <button
                        onClick={handleExportCSV}
                        disabled={guests.length === 0}
                        className="px-4 py-2 bg-maroon-700 hover:bg-maroon-800 text-white font-bold rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow disabled:opacity-50"
                      >
                        <FileSpreadsheet className="w-4 h-4" />
                        <span>Export CSV</span>
                      </button>
                    </div>
                  </div>

                  {/* Scrollable Guest Table/List */}
                  <div className="border border-stone-200 bg-white rounded-2xl overflow-hidden flex-1 overflow-x-auto shadow-inner max-h-[400px]">
                    <table className="w-full text-left text-xs border-collapse min-w-[650px]">
                      <thead>
                        <tr className="bg-stone-50 border-b border-stone-200 text-stone-550 font-sans font-bold uppercase tracking-wider">
                          <th className="p-4">Guest Name</th>
                          <th className="p-4">Phone Number</th>
                          <th className="p-4 text-center">Status / Seats</th>
                          <th className="p-4">Personal Notes</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredGuests.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="p-10 text-center text-stone-500 font-serif italic text-sm">
                              No guest records found matching the search criteria.
                            </td>
                          </tr>
                        ) : (
                          filteredGuests.map((guest) => (
                            <tr key={guest.id} className="border-b border-stone-100 hover:bg-stone-50 transition-colors">
                              <td className="p-4">
                                <div className="font-serif font-semibold text-stone-900 text-sm">{guest.fullName}</div>
                                <div className="text-[10px] text-stone-400 font-mono mt-0.5">
                                  {new Date(guest.submittedAt).toLocaleDateString('en-KE', {
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </div>
                              </td>
                              <td className="p-4 font-mono text-stone-600">{guest.phoneNumber}</td>
                              <td className="p-4 text-center">
                                <button
                                  onClick={() => handleToggleAttendance(guest.id)}
                                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-sans font-bold text-[9px] uppercase tracking-wider border cursor-pointer ${
                                    guest.willAttend === 'yes'
                                      ? 'bg-emerald-50 border-emerald-200 text-emerald-850'
                                      : 'bg-stone-50 border-stone-250 text-stone-600'
                                  }`}
                                  title="Click to toggle status"
                                >
                                  {guest.willAttend === 'yes' ? `Attending (Seats: ${guest.adultsCount})` : 'Declined'}
                                </button>
                              </td>
                              <td className="p-4 text-stone-500 italic max-w-xs truncate" title={guest.notes}>
                                {guest.notes || <span className="text-stone-300">None</span>}
                              </td>
                              <td className="p-4 text-right flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => setSelectedGuestForPass(guest)}
                                  className="p-2 bg-white hover:bg-maroon-50 text-maroon-800 border border-stone-200 hover:border-maroon-300 rounded-lg transition-all cursor-pointer flex items-center gap-1 font-sans text-[11px] font-bold"
                                  title="View Guest Pass"
                                >
                                  <Ticket className="w-3.5 h-3.5 text-maroon-800" />
                                  <span className="hidden sm:inline">Pass</span>
                                </button>
                                <button
                                  onClick={() => handleDelete(guest.id)}
                                  className="p-2 bg-white hover:bg-maroon-50 text-stone-400 hover:text-maroon-700 border border-stone-200 hover:border-maroon-300 rounded-lg transition-all cursor-pointer"
                                  title="Delete Entry"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Footer Stats summary */}
                  <div className="text-[10px] text-stone-500 text-center font-sans">
                    Showing {filteredGuests.length} of {guests.length} total registrations. Unlocked with administrative access privilege.
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Guest Pass Preview Modal */}
      <AnimatePresence>
        {selectedGuestForPass && (
          <RsvpPassModal 
            guest={selectedGuestForPass} 
            onClose={() => setSelectedGuestForPass(null)} 
          />
        )}
      </AnimatePresence>
    </>
  );
}
