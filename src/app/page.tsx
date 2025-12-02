'use client';

import { useState, useEffect } from 'react';
import { onUserChanged } from '@/lib/auth';
import BookingForm from '@/components/BookingForm';
import AdminBookings from '@/components/AdminBookings';

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onUserChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (user) {
    // Admin view - show admin bookings dashboard
    return <AdminBookings />;
  }

  // Public view - simple coworking booking page
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Tecgrw Coworking Space
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Professional workspace in Kigali available Wednesdays and Fridays
            </p>
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <div className="grid md:grid-cols-2 gap-8 text-left">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Location</h3>
                  <p className="text-gray-600">KG 317, Kibagabaga, Kigali</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Contact</h3>
                  <p className="text-gray-600">Phone: +250 795 583 795</p>
                  <p className="text-gray-600">Email: info@tecgrw.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Book Your Workspace
            </h2>
            <BookingForm />
            
            {/* Admin Access */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-500 mb-4">Staff Access</p>
              <a 
                href="/login" 
                className="inline-block px-4 py-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
              >
                Admin Login
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
