"use client";

import Link from "next/link";
import Image from "next/image";

const TechnicalInstituteHero = () => {
  return (
    <>
      {/* ------------------------------------------------
        HERO SECTION
      ------------------------------------------------ */}
      <section
        className="
          relative bg-gradient-to-b from-blue-700 to-blue-600 text-white
          overflow-hidden
          pt-16 md:pt-20
          pb-48 md:pb-64
        "
        name="home"
      >
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-20 right-20 w-32 h-32 border-2 border-white rounded-lg rotate-12"></div>
          <div className="absolute bottom-32 left-16 w-24 h-24 border-2 border-white rounded-full"></div>
          <div className="absolute top-1/2 right-1/4 w-16 h-16 border-2 border-white rotate-45"></div>
        </div>

        {/* Left icons (hidden on mobile) */}
        <div className="absolute left-8 top-1/2 -translate-y-1/2 space-y-8 opacity-20 hidden md:block">
          <div className="w-16 h-16 border-2 border-white rounded-lg flex items-center justify-center">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>

          <div className="w-16 h-16 border-2 border-white rounded-lg flex items-center justify-center">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          </div>
        </div>

        {/* Right icons (hidden on mobile) */}
        <div className="absolute right-0 top-0 bottom-0 w-1/4 opacity-10 pointer-events-none hidden md:block">
          <div className="absolute top-1/4 right-12 w-20 h-20">
            <svg fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
            </svg>
          </div>

          <div className="absolute top-1/2 right-20 w-16 h-16">
            <svg fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
            </svg>
          </div>

          <div className="absolute bottom-1/4 right-16 w-12 h-12">
            <svg fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z" />
            </svg>
          </div>
        </div>

        {/* Hero Content */}
        <div className="container mx-auto px-6 md:px-16 py-12 md:py-16 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            A next-generation digital campus solution for skill enhancement and growth
          </h1>

          <p className="text-lg md:text-xl text-blue-100 mb-8">
            From Admissions to Alumni — Manage everything in one powerful platform
          </p>

          <div className="flex justify-center">
            <Link
              href="/enquiry-form"
              className="bg-lime-300 text-blue-900 font-semibold px-8 py-3.5 rounded-full shadow-lg hover:scale-105 transition"
            >
              Request Demo
            </Link>
          </div>
        </div>
      </section>

      {/* HERO IMAGE */}
<div
  className="
    relative z-30 flex justify-center
    -mt-38 sm:-mt-42
    md:-mt-72
    order-last md:order-none
  "
>
  <Image
    src="/herosection.png"
    width={800}
    height={400}
    className="w-72 md:w-[500px] lg:w-[560px]"
    alt="ERP Dashboard Preview"
    priority
  />
</div>





      {/* ------------------------------------------------
        SECTION 2
      ------------------------------------------------ */}
      <section className="bg-gray-50 -mt-24 md:-mt-32 pt-48 md:pt-60 pb-6 md:pb-8">
        <div className="container mx-auto px-6 md:px-16">
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-3xl shadow-xl overflow-hidden">
            <div className="flex flex-col lg:flex-row items-center justify-between px-8 md:px-12 py-6 md:py-8">
              <div className="max-w-2xl text-white space-y-4 lg:pr-8">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                  Empowering Students from Campus to the Professional World
                </h2>

                <p className="text-base md:text-lg text-blue-50 leading-relaxed">
                  Empowering colleges and universities with a smart, centralized ERP system
                  designed to transform academic, administrative, and placement operations.
                  With 35+ integrated modules, TechEdu College ERP ensures efficiency,
                  transparency, and compliance with NEP 2020 guidelines — making your campus
                  truly future-ready.
                </p>
              </div>

              <div className="mt-8 lg:mt-0">
                <Image
                  src="/student-professional.png"
                  width={300}
                  height={300}
                  className="w-64 md:w-80 lg:w-96"
                  alt="Student to Professional Journey"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default TechnicalInstituteHero;
