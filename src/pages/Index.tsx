import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FeatureCard } from "@/components/FeatureCard";
import { Wifi, Coffee, Users, Calendar, MapPin, Phone, Mail } from "lucide-react";
import heroImage from "@/assets/hero-coworking.jpg";
import space1 from "@/assets/space-1.jpg";
import space2 from "@/assets/space-2.jpg";
import space3 from "@/assets/space-3.jpg";
import space4 from "@/assets/space-4.jpg";
import space5 from "@/assets/space-5.jpg";

const Index = () => {
  const images = [space1, space2, space3, space4, space5];
  const [current, setCurrent] = useState(0);

  const prevImage = () => setCurrent((c) => (c === 0 ? images.length - 1 : c - 1));
  const nextImage = () => setCurrent((c) => (c === images.length - 1 ? 0 : c + 1));

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] w-full overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Modern Coworking Space"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
          <h1 className="mb-6 text-5xl font-bold tracking-tight text-white md:text-7xl animate-fade-in">
            Tecgrw Coworking
          </h1>
          <p className="mb-8 max-w-2xl text-xl text-white/95 md:text-2xl font-light animate-fade-in">
            A modern workspace in Kibagabaga, Kigali where freelancers and remote workers thrive
          </p>
          <Button
            size="lg"
            style={{ backgroundColor: '#095aa3' }}
            className="text-white font-semibold px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 border-2 border-[#095aa3]"
            asChild
          >
            <a href="https://www.tecgrw.com/contact" target="_blank" rel="noopener noreferrer">
              Book Your Space
            </a>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-20 sm:px-8 md:px-16 lg:px-32">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-4 text-center text-4xl font-bold text-foreground">
            <span style={{ color: '#095aa3' }}>Everything You Need to Succeed</span>
          </h2>
          <p className="mb-12 text-center text-lg text-muted-foreground">
            Work, connect, and grow in a space designed for productivity
          </p>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <FeatureCard
              icon={<Wifi className="h-6 w-6" style={{ color: '#095aa3' }} />}
              title="High-Speed Wi-Fi"
              description="Blazing fast internet to keep you connected and productive all day"
            />
            <FeatureCard
              icon={<Coffee className="h-6 w-6" style={{ color: '#095aa3' }}  />}
              title="Free Tea & Lunch"
              description="Complimentary refreshments to keep you energized throughout your workday"
            />
            <FeatureCard
              icon={<Users className="h-6 w-6" style={{ color: '#095aa3' }} />}
              title="Community"
              description="Join a friendly network of innovators, freelancers, and remote workers"
            />
            <FeatureCard
              icon={<Calendar className="h-6 w-6" style={{ color: '#095aa3' }}  />}
              title="Flexible Plans"
              description="Daily, weekly, or monthly options to fit your unique schedule"
            />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-secondary/30 px-4 py-20 sm:px-8 md:px-16 lg:px-32">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-8 text-center text-4xl font-bold text-foreground">
            <span style={{ color: '#095aa3' }}>Why Choose Tecgrw</span>
          </h2>
          <div className="space-y-6 text-lg leading-relaxed text-foreground/90">
            <p>
              Welcome to <strong>Tecgrw Ltd Co-Working Space</strong> — a modern, affordable workspace
              designed for freelancers and remote workers who want to work, connect, and grow.
            </p>
            <p>
              We go beyond desks and Wi-Fi. At Tecgrw, you'll find a community that values collaboration,
              creativity, and growth. Whether you're brainstorming a new idea or meeting clients, our space
              offers the perfect atmosphere.
            </p>
            <div className="my-8 rounded-2xl bg-card p-8 shadow-[var(--shadow-soft)]">
              <h3 className="mb-4 text-2xl font-semibold" style={{ color: '#095aa3' }}>Flexible Membership Plans</h3>
              <ul className="space-y-3 text-foreground/80">
                <li className="flex items-start">
                  <span className="mr-3 mt-1 text-accent">•</span>
                  <span><strong>Daily Pass:</strong> Perfect for short visits or travelers</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 mt-1 text-accent">•</span>
                  <span><strong>Weekly Access:</strong> Great for flexible work schedules</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 mt-1 text-accent">•</span>
                  <span><strong>Monthly Membership:</strong> Ideal for regular use and best value</span>
                </li>
              </ul>
              <p className="mt-4 italic text-muted-foreground">All plans include Wi-Fi, tea, and lunch.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="px-4 py-20 sm:px-8 md:px-16 lg:px-32">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-12 text-center text-4xl font-bold text-foreground">
            <span style={{ color: '#095aa3' }}>Explore Our Space</span>
          </h2>
          <div className="relative">
            <div className="overflow-hidden rounded-2xl shadow-[var(--shadow-glow)]">
              <img
                src={images[current]}
                alt={`Coworking space view ${current + 1}`}
                className="h-[400px] w-full object-cover transition-all duration-500 md:h-[500px]"
              />
            </div>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full p-3 shadow-lg transition-all hover:scale-110 bg-white/90"
              aria-label="Previous image"
            >
              <svg className="h-6 w-6 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-3 shadow-lg transition-all hover:scale-110 bg-white/90"
              aria-label="Next image"
            >
              <svg className="h-6 w-6 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          <div className="mt-6 flex justify-center gap-2">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrent(idx)}
                style={{ backgroundColor: idx === current ? '#095aa3' : '#e0e7ef', width: idx === current ? 24 : 12, height: 12, borderRadius: 6, transition: 'all 0.3s' }}
                aria-label={`Go to image ${idx + 1}`}
              />
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button
              size="lg"
              style={{ backgroundColor: '#095aa3' }}
              className="text-white font-semibold px-10 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 border-2 border-[#095aa3]"
              asChild
            >
              <a href="https://www.tecgrw.com/contact" target="_blank" rel="noopener noreferrer">
                Book Your Visit Today
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-gradient-to-br from-primary/5 to-accent/5 px-4 py-20 sm:px-8 md:px-16 lg:px-32">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-12 text-center text-4xl font-bold text-foreground">
            <span style={{ color: '#095aa3' }}>Visit Us Today</span>
          </h2>
          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-2xl bg-card p-8 shadow-[var(--shadow-soft)]">
              <div className="mb-4 flex items-center gap-3 text-primary">
                <MapPin className="h-6 w-6" style={{ color: '#095aa3' }} />
                <h3 className="text-xl font-semibold" style={{ color: '#095aa3' }}>Location</h3>
              </div>
              <p className="mb-2 text-foreground/90">
                <strong>Tecgrw Ltd Office</strong>
              </p>
              <p className="text-foreground/80">
                KG 317, Kibagabaga, Kigali
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Conveniently located near a supermarket with easy moto access
              </p>
              <Button
                variant="outline"
                className="mt-4 w-full group"
                asChild
              >
                <a
                  href="https://maps.app.goo.gl/XBCvtQxn5UiWu3z29"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ transition: 'color 0.2s' }}
                  className="group-hover:text-white group-hover:bg-[#095aa3] group-hover:border-[#095aa3] group-hover:shadow-lg px-4 py-2 rounded-md"
                >
                  View on Map
                </a>
              </Button>
            </div>
            <div className="rounded-2xl bg-card p-8 shadow-[var(--shadow-soft)]">
              <div className="mb-4 flex items-center gap-3 text-primary">
                <Phone className="h-6 w-6" style={{ color: '#095aa3' }} />
                <h3 className="text-xl font-semibold" style={{ color: '#095aa3' }}>Contact</h3>
              </div>
              <div className="space-y-3 text-foreground/90">
                <div>
                  <p className="mb-1 text-sm font-medium text-muted-foreground">Call / WhatsApp</p>
                  <a href="tel:+250795583795" className="block hover:text-primary transition-colors">
                    +250 795 583 795
                  </a>
                  <a href="tel:+250798975878" className="block hover:text-primary transition-colors">
                    +250 798 975 878
                  </a>
                </div>
                <div>
                  <p className="mb-1 text-sm font-medium text-muted-foreground">Email</p>
                  <a href="mailto:info@tecgrw.com" className="flex items-center gap-2 hover:text-primary transition-colors">
                    <Mail className="h-4 w-4" />
                    info@tecgrw.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#095aa3] px-4 py-12 text-background">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <h4 className="mb-4 text-xl font-semibold" style={{ color: '#ffffff' }}>Tecgrw Ltd</h4>
              <p className="text-sm text-background/80">
                Modern coworking space in Kigali, Rwanda
              </p>
            </div>
            <div>
              <h4 className="mb-4 text-xl font-semibold" style={{ color: '#ffffff' }}>Quick Links</h4>
              <div className="space-y-2 text-sm">
                <a href="https://www.tecgrw.com/privacy" target="_blank" rel="noopener noreferrer" className="block transition-colors text-white">
                  Privacy Policy
                </a>
                <a href="https://www.tecgrw.com/terms" target="_blank" rel="noopener noreferrer" className="block transition-colors text-white">
                  Terms of Use
                </a>
              </div>
            </div>
            <div>
              <h4 className="mb-4 text-xl font-semibold" style={{ color: '#ffffff' }}>Follow Us</h4>
              <div className="space-y-2 text-sm">
                <a href="https://www.instagram.com/tecgrw/" target="_blank" rel="noopener noreferrer" className="block transition-colors text-white">
                  Instagram
                </a>
                <a href="https://www.facebook.com/tecGrw1/" target="_blank" rel="noopener noreferrer" className="block transition-colors text-white">
                  Facebook
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-background/20 pt-8 text-center text-sm text-background/60">
            © 2025 Tecgrw Ltd. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
