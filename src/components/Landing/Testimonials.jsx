'use client';

import { ChevronLeft, ChevronRight, Star, StarHalf } from 'lucide-react';
import { useState, useEffect } from 'react';

const defaultTestimonials = [
  {
    name: "Dr. Rajesh Verma",
    position: "Director, ABC Engineering College",
    avatar: "/avatars/1.jpg",
    rating: 5,
    content:
      "The lab management module alone saved us 15 hours per week. Our faculty can now focus on what matters most – teaching.",
  },
  {
    name: "Prof. Anjali Deshpande",
    position: "Principal, XYZ Polytechnic",
    avatar: "/avatars/2.jpg",
    rating: 4.5,
    content:
      "AICTE compliance & NAAC documentation became effortless. We cleared our accreditation with flying colors.",
  },
  {
    name: "Dr. Sanjay Patel",
    position: "HOD Computer Science, PQR Institute",
    avatar: "/avatars/3.jpg",
    rating: 5,
    content:
      "The placement module transformed our recruitment process. We achieved our highest placement rate ever – 92%!",
  },
  {
    name: "Ms. Priya Iyer",
    position: "Admin Director, LMN Technical Campus",
    avatar: "/avatars/4.jpg",
    rating: 4,
    content:
      "Fee automation reduced our processing time by 80%. Reconciliation reports save countless hours monthly.",
  },
];

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const visibleCards = 2;

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const response = await fetch("/api/testimonials");
      const data = await response.json();
      setTestimonials(data.testimonials || defaultTestimonials);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      setTestimonials(defaultTestimonials);
      setLoading(false);
    }
  };

  // If loading or empty array, prevent errors
  const activeTestimonials = testimonials.length > 0 ? testimonials : defaultTestimonials;

  const next = () =>
    setCurrentIndex((prev) => (prev + 1) % activeTestimonials.length);
  const prev = () =>
    setCurrentIndex(
      (prev) => (prev - 1 + activeTestimonials.length) % activeTestimonials.length
    );

  const displayTestimonials = () => {
    const arr = [];
    if (activeTestimonials.length === 0) return arr;

    // Safety check if we have fewer cards than visibleCards
    const count = Math.min(visibleCards, activeTestimonials.length);

    for (let i = 0; i < count; i++) {
      // If we want it to cycle seamlessly even if few items, logic works if array length >= visible cards
      // If not, just show what we have. But the original code assumed infinite wrap logic.
      // Assuming infinite wrap logic:
      arr.push(activeTestimonials[(currentIndex + i) % activeTestimonials.length]);
    }
    return arr;
  };

  return (
    <section className="py-20 bg-gradient-to-b from-gray-100 to-gray-50">
      <div className="container mx-auto px-6">
        {/* Heading */}
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            Trusted by Educators Nationwide
          </h2>
          <p className="text-lg text-gray-600">
            {loading ? "Loading testimonials..." : "Hear from institutions that have transformed their operations with TechEdu ERP"}
          </p>
        </div>

        {/* Desktop / Tablet */}
        <div className="hidden md:flex items-center gap-6 justify-center">
          <button
            suppressHydrationWarning
            onClick={prev}
            className="p-3 rounded-full bg-white shadow hover:bg-gray-200 transition"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div className="grid grid-cols-2 gap-6 w-full max-w-4xl">
            {displayTestimonials().map((t, i) => (
              <TestimonialCard key={i} testimonial={t} />
            ))}
          </div>

          <button
            suppressHydrationWarning
            onClick={next}
            className="p-3 rounded-full bg-white shadow hover:bg-gray-200 transition"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile */}
        <div className="md:hidden relative mt-6">
          {activeTestimonials.length > 0 && (
            <TestimonialCard testimonial={activeTestimonials[currentIndex]} />
          )}
          <div className="flex justify-center mt-6 space-x-4">
            <button
              suppressHydrationWarning
              onClick={prev}
              className="p-2 rounded-full bg-white shadow hover:bg-gray-200"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              suppressHydrationWarning
              onClick={next}
              className="p-2 rounded-full bg-white shadow hover:bg-gray-200"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------
   Card Component
---------------------------------------- */
function TestimonialCard({ testimonial }) {
  if (!testimonial) return null;
  return (
    <div className="group bg-white p-8 rounded-xl shadow-md border border-gray-100 h-full flex flex-col transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
      {/* ⭐ STARS WITH BLACK BORDER */}
      <div className="flex mb-4 gap-1">
        {[...Array(5)].map((_, i) => {
          const rating = testimonial.rating || 0;

          if (i + 1 <= Math.floor(rating)) {
            return (
              <Star
                key={i}
                className="w-5 h-5 fill-yellow-400 text-yellow-600
                           transition-transform duration-300
                           group-hover:scale-110"
                strokeWidth={1.5}
              />
            );
          }

          if (i + 0.5 === rating) {
            return (
              <StarHalf
                key={i}
                className="w-5 h-5 fill-yellow-400 text-yellow-600
                           transition-transform duration-300
                           group-hover:scale-110"
                strokeWidth={1.5}
              />
            );
          }

          return (
            <Star
              key={i}
              className="w-5 h-5 fill-white text-yellow-600
                         transition-transform duration-300
                         group-hover:scale-110"
              strokeWidth={1.5}
            />
          );
        })}
      </div>

      <blockquote className="text-gray-700 italic mb-6 leading-relaxed">
        “{testimonial.content}”
      </blockquote>

      <div className="mt-auto flex items-center gap-4">
        <img
          src={testimonial.avatar || "/avatars/default.jpg"}
          alt={testimonial.name}
          className="w-12 h-12 rounded-full object-cover border"
          onError={(e) => { e.target.onerror = null; e.target.src = "https://ui-avatars.com/api/?name=" + encodeURIComponent(testimonial.name) + "&background=random"; }}
        />
        <div>
          <p className="font-semibold text-gray-900">
            {testimonial.name}
          </p>
          <p className="text-sm text-gray-500">
            {testimonial.position}
          </p>
        </div>
      </div>
    </div>
  );
}

