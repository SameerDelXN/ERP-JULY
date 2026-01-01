'use client';
import { ChevronLeft, ChevronRight, Star, StarHalf } from 'lucide-react';
import { useState } from 'react';

const testimonials = [
  {
    name: "Dr. Rajesh Verma",
    position: "Director, ABC Engineering College",
    avatar: "/avatars/1.jpg",
    rating: 5,
    content: "The lab management module alone saved us 15 hours per week. Our faculty can now focus on what matters most – teaching."
  },
  {
    name: "Prof. Anjali Deshpande",
    position: "Principal, XYZ Polytechnic",
    avatar: "/avatars/2.jpg",
    rating: 4.5,
    content: "AICTE compliance & NAAC documentation became effortless. We cleared our accreditation with flying colors."
  },
  {
    name: "Dr. Sanjay Patel",
    position: "HOD Computer Science, PQR Institute",
    avatar: "/avatars/3.jpg",
    rating: 5,
    content: "The placement module transformed our recruitment process. We achieved our highest placement rate ever – 92%!"
  },
  {
    name: "Ms. Priya Iyer",
    position: "Admin Director, LMN Technical Campus",
    avatar: "/avatars/4.jpg",
    rating: 4,
    content: "Fee automation reduced our processing time by 80%. Reconciliation reports save countless hours monthly."
  }
];

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const visibleCards = 2; // ← show 2 at a time on desktop

  const next = () => setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  const displayTestimonials = () => {
    const arr = [];
    for (let i = 0; i < visibleCards; i++) {
      arr.push(testimonials[(currentIndex + i) % testimonials.length]);
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
            Hear from institutions that have transformed their operations with TechEdu ERP
          </p>
        </div>

        {/* Desktop + Tablet Slider (2 visible) */}
        <div className="hidden md:flex items-center gap-6 justify-center">
          <button onClick={prev} className="p-3 rounded-full bg-white shadow hover:bg-gray-200">
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div className="grid grid-cols-2 gap-6 w-full max-w-4xl">
            {displayTestimonials().map((t, i) => (
              <TestimonialCard key={i} testimonial={t} />
            ))}
          </div>

          <button onClick={next} className="p-3 rounded-full bg-white shadow hover:bg-gray-200">
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Single-Card Slider */}
        <div className="md:hidden relative mt-6">
          <TestimonialCard testimonial={testimonials[currentIndex]} />
          <div className="flex justify-center mt-6 space-x-4">
            <button onClick={prev} className="p-2 rounded-full bg-white shadow hover:bg-gray-200">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={next} className="p-2 rounded-full bg-white shadow hover:bg-gray-200">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}

/*------------------------------------------
  Card Component
-------------------------------------------*/
function TestimonialCard({ testimonial }) {
  return (
    <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100 h-full flex flex-col">
      
      {/* Star Rating */}
      <div className="flex mb-4">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className={`w-5 h-5 ${i < Math.floor(testimonial.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
        ))}
        {testimonial.rating % 1 !== 0 && (
          <StarHalf className="w-5 h-5 text-yellow-400 fill-yellow-400" />
        )}
      </div>

      <blockquote className="text-gray-700 italic mb-6 leading-relaxed">
        "{testimonial.content}"
      </blockquote>

      {/* Avatar + Name */}
      <div className="mt-auto flex items-center gap-4">
        <img src={testimonial.avatar} alt={testimonial.name} className="w-12 h-12 rounded-full object-cover border" />
        <div>
          <p className="font-semibold text-gray-900">{testimonial.name}</p>
          <p className="text-sm text-gray-500">{testimonial.position}</p>
        </div>
      </div>
    </div>
  );
}
