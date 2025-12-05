'use client';

import { useEffect, useState } from "react";
import { getBookings, acceptBooking, rejectBooking, deleteBooking } from "@/lib/firestore";
import { onUserChanged, logout } from "@/lib/auth";
import { sendEmail } from "@/lib/email";
import { useRouter } from "next/navigation";

interface BookingData {
  id: string;
  name: string;
  email: string;
  phone: string;
  people: number;
  date?: any;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt?: any;
  processedAt?: any;
}

export default function AdminBookings() {
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingIds, setProcessingIds] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showMessage, setShowMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const router = useRouter();
  const itemsPerPage = 10;

  useEffect(() => {
    const unsubscribe = onUserChanged((user) => {
      if (!user) {
        router.push('/login');
        return;
      }
      loadBookings();
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    if (showMessage) {
      const timer = setTimeout(() => setShowMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [showMessage]);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const bookingsData = await getBookings();
      const normalizedBookings: BookingData[] = bookingsData.map((b: any) => ({
        id: b.id,
        name: b.name ?? '',
        email: b.email ?? '',
        phone: b.phone ?? '',
        people: b.people ?? 0,
        date: b.date,
        status: b.status ?? 'pending',
        createdAt: b.createdAt,
        processedAt: b.processedAt,
      }));
      setBookings(normalizedBookings);
    } catch (error) {
      setShowMessage({type: 'error', text: 'Failed to load bookings'});
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (id: string) => {
    setProcessingIds(prev => [...prev, id]);
    try {
      await acceptBooking(id);
      const updatedBookings = bookings.map(b => b.id === id ? { ...b, status: "accepted" as const, processedAt: new Date() } : b);
      setBookings(updatedBookings);
      
      const booking = bookings.find(b => b.id === id);
      if (booking) {
        try {
          await sendEmail('booking_acceptance', booking);
        } catch (err) {
          // Email failed but booking status updated
        }
      }
      
      setShowMessage({type: 'success', text: 'Booking accepted and customer notified!'});
    } catch (error) {
      setShowMessage({type: 'error', text: 'Failed to accept booking'});
    } finally {
      setProcessingIds(prev => prev.filter(pId => pId !== id));
    }
  };

  const handleReject = async (id: string) => {
    setProcessingIds(prev => [...prev, id]);
    try {
      await rejectBooking(id);
      const updatedBookings = bookings.map(b => b.id === id ? { ...b, status: "rejected" as const, processedAt: new Date() } : b);
      setBookings(updatedBookings);
      
      const booking = bookings.find(b => b.id === id);
      if (booking) {
        try {
          await sendEmail('booking_rejection', booking);
        } catch (err) {
          // Email failed but booking status updated
        }
      }
      
      setShowMessage({type: 'success', text: 'Booking rejected and customer notified!'});
    } catch (error) {
      setShowMessage({type: 'error', text: 'Failed to reject booking'});
    } finally {
      setProcessingIds(prev => prev.filter(pId => pId !== id));
    }
  };

  const handleDelete = async (id: string) => {
    setProcessingIds(prev => [...prev, id]);
    try {
      await deleteBooking(id);
      const updatedBookings = bookings.filter(b => b.id !== id);
      setBookings(updatedBookings);
      setShowMessage({type: 'success', text: 'Booking deleted successfully!'});
    } catch (error) {
      setShowMessage({type: 'error', text: 'Failed to delete booking'});
    } finally {
      setProcessingIds(prev => prev.filter(pId => pId !== id));
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      setShowMessage({type: 'error', text: 'Failed to logout'});
    }
  };

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    accepted: bookings.filter(b => b.status === 'accepted').length,
    rejected: bookings.filter(b => b.status === 'rejected').length,
  };

  const filteredBookings = filterStatus === 'all' 
    ? bookings 
    : bookings.filter(b => b.status === filterStatus);

  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin" style={{borderColor: '#1976d2', borderTopColor: 'transparent'}}></div>
          <p className="text-slate-600 font-medium">Loading bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Toast Message */}
      {showMessage && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg transform transition-all duration-300 ${
          showMessage.type === 'success' 
            ? 'bg-green-500 text-white' 
            : 'bg-red-500 text-white'
        }`}>
          <div className="flex items-center gap-3">
            {showMessage.type === 'success' ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            <span className="font-medium">{showMessage.text}</span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-800 mb-2">Booking Management</h1>
            <p className="text-slate-600">Manage and track all restaurant bookings</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-6 py-3 text-white rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            style={{backgroundColor: '#1976d2'}}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1565c0'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1976d2'}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500 transform transition-all duration-200 hover:shadow-xl hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">Total Bookings</p>
                <p className="text-3xl font-bold text-slate-800">{stats.total}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500 transform transition-all duration-200 hover:shadow-xl hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">Pending</p>
                <p className="text-3xl font-bold text-orange-600">{stats.pending}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500 transform transition-all duration-200 hover:shadow-xl hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">Accepted</p>
                <p className="text-3xl font-bold text-green-600">{stats.accepted}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500 transform transition-all duration-200 hover:shadow-xl hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">Rejected</p>
                <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-xl shadow-lg p-2 mb-6 flex gap-2 overflow-x-auto">
          {['all', 'pending', 'accepted', 'rejected'].map((status) => (
            <button
              key={status}
              onClick={() => {
                setFilterStatus(status);
                setCurrentPage(1);
              }}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 whitespace-nowrap ${
                filterStatus === status
                  ? 'text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
              style={filterStatus === status ? {backgroundColor: '#1976d2'} : {}}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="text-white" style={{background: '#1976d2'}}>
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Phone</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">People</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Date</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">Status</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {paginatedBookings.map((booking, index) => {
                  const isProcessing = processingIds.includes(booking.id);
                  return (
                    <tr key={booking.id} className={`hover:bg-slate-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">{booking.name}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{booking.email}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{booking.phone}</td>
                      <td className="px-6 py-4 text-sm text-center font-semibold text-slate-900">{booking.people}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {booking.date ? new Date(booking.date.seconds ? booking.date.seconds * 1000 : booking.date).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                          booking.status === 'pending' 
                            ? 'bg-orange-100 text-orange-700' 
                            : booking.status === 'accepted'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          {booking.status === 'pending' ? (
                            <>
                              <button
                                onClick={() => handleAccept(booking.id)}
                                disabled={isProcessing}
                                className="px-3 py-2 bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white rounded-lg text-xs font-medium transition-all duration-200 shadow hover:shadow-md transform hover:-translate-y-0.5 disabled:transform-none flex items-center gap-1"
                              >
                                {isProcessing ? (
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                )}
                                Accept
                              </button>
                              <button
                                onClick={() => handleReject(booking.id)}
                                disabled={isProcessing}
                                className="px-3 py-2 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white rounded-lg text-xs font-medium transition-all duration-200 shadow hover:shadow-md transform hover:-translate-y-0.5 disabled:transform-none flex items-center gap-1"
                              >
                                {isProcessing ? (
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                )}
                                Reject
                              </button>
                            </>
                          ) : (
                            <span className="text-xs text-slate-500 font-medium">Processed</span>
                          )}
                          <button
                            onClick={() => handleDelete(booking.id)}
                            disabled={isProcessing}
                            title="Delete booking permanently"
                            className="px-3 py-2 bg-slate-700 hover:bg-slate-800 disabled:bg-slate-400 text-white rounded-lg text-xs font-medium transition-all duration-200 shadow hover:shadow-md transform hover:-translate-y-0.5 disabled:transform-none flex items-center gap-1"
                          >
                            {isProcessing ? (
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            )}
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <div className="text-sm text-slate-600">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredBookings.length)} of {filteredBookings.length} bookings
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-white hover:bg-slate-100 disabled:bg-slate-100 disabled:text-slate-400 text-slate-700 rounded-lg font-medium transition-all duration-200 shadow border border-slate-200"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow ${
                      currentPage === page
                        ? 'text-white'
                        : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                    }`}
                    style={currentPage === page ? {backgroundColor: '#1976d2'} : {}}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-white hover:bg-slate-100 disabled:bg-slate-100 disabled:text-slate-400 text-slate-700 rounded-lg font-medium transition-all duration-200 shadow border border-slate-200"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {filteredBookings.length === 0 && (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">No bookings found</h3>
            <p className="text-slate-600">There are no bookings matching your current filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}

