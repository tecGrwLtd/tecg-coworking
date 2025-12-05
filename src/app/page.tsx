'use client';

import { useState, useEffect } from 'react';
import { onUserChanged } from '@/lib/auth';
import BookingForm from '@/components/BookingForm';
import AdminBookings from '@/components/AdminBookings';
import Image from 'next/image';

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);

  const images = [
    '/space-1.jpg',
    // '/space-2.jpg', 
    // '/space-3.jpg',
    '/space-4.jpg',
    '/space-5.jpg',
    '/Gemini_Generated_Image_kw5s30kw5s30kw5s.png',
    '/Gemini_Generated_Image_tki3wltki3wltki3.png',
    '/Gemini_Generated_Image_jpc51rjpc51rjpc5 (3).png'
  ];

  useEffect(() => {
    const unsubscribe = onUserChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const prevImage = () => setCurrentImage((c) => (c === 0 ? images.length - 1 : c - 1));
  const nextImage = () => setCurrentImage((c) => (c === images.length - 1 ? 0 : c + 1));

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return <AdminBookings />;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] w-full overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/hero-coworking.jpg"
            alt="Modern Coworking Space"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
          <h1 className="mb-6 text-5xl font-bold tracking-tight text-white md:text-7xl animate-fade-in">
            Tecgrw Coworking
          </h1>
          <p className="mb-8 max-w-2xl text-xl text-white/95 md:text-2xl font-light">
            A modern workspace in Kibagabaga, Kigali where freelancers and remote workers thrive
          </p>
          <div className="mb-8">
            <BookingForm />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-20 sm:px-8 md:px-16 lg:px-32">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-4 text-center text-4xl font-bold text-gray-900">
            Everything You Need to Succeed
          </h2>
          <p className="mb-12 text-center text-lg text-gray-600">
            Work, connect, and grow in a space designed for productivity
          </p>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="group rounded-xl bg-white p-8 text-center shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="mb-6 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg">
                  <span className="text-3xl">📶</span>
                </div>
              </div>
              <h3 className="mb-4 text-xl font-bold text-gray-900">High-Speed Wi-Fi</h3>
              <p className="text-gray-600 leading-relaxed">Blazing fast internet to keep you connected and productive all day</p>
            </div>
            <div className="group rounded-xl bg-white p-8 text-center shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="mb-6 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg">
                  <span className="text-3xl">☕</span>
                </div>
              </div>
              <h3 className="mb-4 text-xl font-bold text-gray-900">Free Tea & Lunch</h3>
              <p className="text-gray-600 leading-relaxed">Complimentary refreshments to keep you energized throughout your workday</p>
            </div>
            <div className="group rounded-xl bg-white p-8 text-center shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="mb-6 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg">
                  <span className="text-3xl">👥</span>
                </div>
              </div>
              <h3 className="mb-4 text-xl font-bold text-gray-900">Community</h3>
              <p className="text-gray-600 leading-relaxed">Join a friendly network of innovators, freelancers, and remote workers</p>
            </div>
            <div className="group rounded-xl bg-white p-8 text-center shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="mb-6 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg">
                  <span className="text-3xl">📅</span>
                </div>
              </div>
              <h3 className="mb-4 text-xl font-bold text-gray-900">Flexible Plans</h3>
              <p className="text-gray-600 leading-relaxed">Daily, weekly, or monthly options to fit your unique schedule</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-gray-50 px-4 py-20 sm:px-8 md:px-16 lg:px-32">
        <div className="mx-auto max-w-4xl">
          {/* Workspace Image */}
          <div className="mb-12 flex justify-center">
            <div className="relative w-full max-w-3xl overflow-hidden rounded-xl shadow-2xl">
              <Image
                src="/Gemini_Generated_Image_kw5s30kw5s30kw5s.png"
                alt="Tecgrw Coworking Space - Modern workspace with professionals working"
                width={800}
                height={400}
                className="w-full h-auto object-cover"
                priority
              />
            </div>
          </div>
          <h2 className="mb-8 text-center text-4xl font-bold text-gray-900">
            Why Choose Tecgrw
          </h2>
          <div className="space-y-6 text-lg leading-relaxed text-gray-800">
            <p>
              Welcome to <strong>Tecgrw Ltd Co-Working Space</strong> — a modern, affordable workspace
              designed for freelancers and remote workers who want to work, connect, and grow.
            </p>
            <p>
              We go beyond desks and Wi-Fi. At Tecgrw, you'll find a community that values collaboration,
              creativity, and growth. Whether you're brainstorming a new idea or meeting clients, our space
              offers the perfect atmosphere.
            </p>
            <div className="my-8 rounded-2xl bg-white p-8 shadow-lg">
              <h3 className="mb-4 text-2xl font-semibold text-[#1976d2]">Flexible Membership Plans</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="mr-3 mt-1" style={{color: '#1976d2'}}>•</span>
                  <span><strong>Daily Pass:</strong> Perfect for occasional visits</span>1976d2
                </li>
                <li className="flex items-start">
                  <span className="mr-3 mt-1" style={{color: '#1976d2'}}>•</span>
                  <span><strong>Weekly Access:</strong> Great for flexible work schedules</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 mt-1" style={{color: '#1976d2'}}>•</span>
                  <span><strong>Monthly Membership:</strong> Ideal for regular use and best value</span>
                </li>
              </ul>
              <p className="mt-4 italic text-gray-500">All plans include Wi-Fi, tea, and lunch.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="px-4 py-20 sm:px-8 md:px-16 lg:px-32">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-12 text-center text-4xl font-bold text-gray-900">
            Explore Our Space
          </h2>
          <div className="relative">
            <div className="overflow-hidden rounded-2xl shadow-xl">
              <Image
                src={images[currentImage]}
                alt={`Coworking space view ${currentImage + 1}`}
                width={800}
                height={500}
                className="h-[400px] w-full object-cover transition-all duration-500 md:h-[500px]"
              />
            </div>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-3 shadow-lg transition-all hover:bg-white hover:scale-110"
              aria-label="Previous image"
            >
              <svg className="h-6 w-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-3 shadow-lg transition-all hover:bg-white hover:scale-110"
              aria-label="Next image"
            >
              <svg className="h-6 w-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          <div className="mt-6 flex justify-center gap-2">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentImage(idx)}
                className={`h-3 w-3 rounded-full transition-all ${
                  idx === currentImage ? "w-8" : "bg-gray-300"
                }`}
                style={{
                  backgroundColor: idx === currentImage ? '#1976d2' : undefined
                }}
                onMouseEnter={(e) => {
                  if (idx !== currentImage) {
                    e.currentTarget.style.backgroundColor = '#1976d2';
                  }
                }}
                onMouseLeave={(e) => {
                  if (idx !== currentImage) {
                    e.currentTarget.style.backgroundColor = '';
                  }
                }}
                aria-label={`Go to image ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="px-4 py-20 sm:px-8 md:px-16 lg:px-32" style={{background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)'}}>
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-12 text-center text-4xl font-bold text-[#1976d2]">
            Visit Us Today
          </h2>
          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-2xl bg-white p-8 shadow-lg">
              <div className="mb-4 flex items-center gap-3">
                <span className="text-2xl">📍</span>
                <h3 className="text-xl font-semibold" style={{color: '#1976d2'}}>Location</h3>
              </div>
              <p className="mb-2 text-gray-800 font-semibold">
                Tecgrw Ltd Office
              </p>
              <p className="text-gray-700">
                KG 317, Kibagabaga, Kigali
              </p>
              <p className="mt-2 text-sm text-gray-600">
                Conveniently located near a supermarket with easy moto access
              </p>
            </div>
            <div className="rounded-2xl bg-white p-8 shadow-lg">
              <div className="mb-4 flex items-center gap-3">
                <span className="text-2xl">📞</span>
                <h3 className="text-xl font-semibold" style={{color: '#1976d2'}}>Contact</h3>
              </div>
              <div className="space-y-3 text-gray-700">
                <div>
                  <p className="mb-2 text-gray-800 font-semibold">Call / WhatsApp</p>
                  <p className="block text-gray-500">
                    +250 795 583 795
                  </p>
                  <p className="block text-gray-500">
                    +250 798 975 878
                  </p>
                </div>
                <div>
                  <p className="mb-1 text-sm font-medium text-gray-500">Email</p>
                  <p className="flex items-center gap-2 text-gray-500">
                    <span>✉️</span>
                    info@tecgrw.com
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-12 text-white" style={{backgroundColor: '#1976d2'}}>
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <h4 className="mb-4 text-xl font-semibold">Tecgrw Ltd</h4>
              <p className="text-sm text-blue-100">
                Modern coworking space in Kigali, Rwanda
              </p>
            </div>
            <div>
              <h4 className="mb-4 text-xl font-semibold">Quick Links</h4>
              <div className="space-y-2 text-sm">
                <a href="https://www.tecgrw.com/privacy" target="_blank" rel="noopener noreferrer" className="block transition-colors text-white hover:text-blue-100">
                  Privacy Policy
                </a>
                <a href="https://www.tecgrw.com/terms" target="_blank" rel="noopener noreferrer" className="block transition-colors text-white hover:text-blue-100">
                  Terms of Use
                </a>
              </div>
            </div>
            <div>
              <h4 className="mb-4 text-xl font-semibold">Follow Us</h4>
              <div className="space-y-2 text-sm">
                <a href="https://www.instagram.com/tecgrw/" target="_blank" rel="noopener noreferrer" className="block transition-colors text-white hover:text-blue-100">
                  Instagram
                </a>
                <a href="https://www.facebook.com/tecGrw1/" target="_blank" rel="noopener noreferrer" className="block transition-colors text-white hover:text-blue-100">
                  Facebook
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-blue-300 pt-8 text-center text-sm text-blue-100">
            © 2025 Tecgrw Ltd. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

