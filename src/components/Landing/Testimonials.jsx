'use client';
import { ChevronLeft, ChevronRight, Star, StarHalf } from 'lucide-react';
import { useState } from 'react';

const testimonials = [
  {
    name: "Dr. Rajesh Verma",
    position: "Director, ABC Engineering College",
    avatar: "/avatars/1.jpg",
    rating: 5,
    content: "This ERP transformed our campus operations. The lab management module alone saved us 15 hours per week in scheduling conflicts."
  },
  {
    name: "Prof. Anjali Deshpande",
    position: "Principal, XYZ Polytechnic",
    avatar: "/avatars/2.jpg",
    rating: 4.5,
    content: "The AICTE compliance features made our accreditation process effortless. Our NAAC score improved by 20% thanks to better documentation."
  },
  {
    name: "Dr. Sanjay Patel",
    position: "HOD Computer Science, PQR Institute",
    avatar: "/avatars/3.jpg",
    rating: 5,
    content: "Placement tracking has never been easier. We've increased our placement rate by 35% since implementation last year."
  },
  {
    name: "Ms. Priya Iyer",
    position: "Admin Director, LMN Technical Campus",
    avatar: "/avatars/4.jpg",
    rating: 4,
    content: "Fee automation reduced our payment processing time by 80%. The reconciliation reports save us countless hours each month."
  }
];

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Trusted by <span className="text-blue-600">Institutes Nationwide</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Hear from educators who've transformed their campus operations
          </p>
        </div>

        {/* Desktop - 2 Column Layout */}
        <div className="hidden md:grid grid-cols-2 gap-8">
          {testimonials.slice(0, 2).map((testimonial, index) => (
            <TestimonialCard key={index} testimonial={testimonial} />
          ))}
        </div>

        {/* Mobile - Carousel */}
        <div className="md:hidden relative">
          <TestimonialCard testimonial={testimonials[currentIndex]} />
          <div className="flex justify-center mt-6 space-x-4">
            <button 
              onClick={prevTestimonial}
              className="p-2 rounded-full bg-white border border-gray-200 text-gray-700 hover:bg-gray-100"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={nextTestimonial}
              className="p-2 rounded-full bg-white border border-gray-200 text-gray-700 hover:bg-gray-100"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-16 flex flex-wrap justify-center gap-6">
          {[
            { label: "50+", subtext: "Institutes" },
            { label: "4.8/5", subtext: "Rating" },
            { label: "100%", subtext: "Compliance" },
            { label: "24/7", subtext: "Support" }
          ].map((stat, index) => (
            <div key={index} className="text-center px-6 py-4 bg-white rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-blue-600">{stat.label}</div>
              <div className="text-sm text-gray-500 mt-1">{stat.subtext}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ testimonial }) {
  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center mb-6">
        <div className="relative mr-4">
          <div className="w-14 h-14 rounded-full bg-gray-200 overflow-hidden">
            {/* Replace with actual image */}
            <div className="w-full h-full bg-blue-100 flex items-center justify-center text-blue-600">
              {testimonial.name.charAt(0)}
            </div>
          </div>
          <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white p-1 rounded-full">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
          <p className="text-sm text-gray-500">{testimonial.position}</p>
        </div>
      </div>
      <div className="flex mb-4">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i}
            className={`w-5 h-5 ${i < Math.floor(testimonial.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
          />
        ))}
        {testimonial.rating % 1 !== 0 && (
          <StarHalf className="w-5 h-5 text-yellow-400 fill-yellow-400" />
        )}
      </div>
      <blockquote className="text-gray-600 italic">
        "{testimonial.content}"
      </blockquote>
    </div>
  );
}