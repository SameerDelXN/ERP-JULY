<<<<<<< HEAD
"use client";

import Link from "next/link";
import Image from "next/image";

const TechnicalInstituteHero = () => {
  return (
    <>

      {/* ------------------------------------------------ HERO SECTION ------------------------------------------------ */}
      <section className="relative bg-gradient-to-b from-blue-700 to-blue-600 text-white overflow-hidden pb-48 md:pb-64" name="home">
        
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-20 right-20 w-32 h-32 border-2 border-white rounded-lg rotate-12"></div>
          <div className="absolute bottom-32 left-16 w-24 h-24 border-2 border-white rounded-full"></div>
          <div className="absolute top-1/2 right-1/4 w-16 h-16 border-2 border-white rotate-45"></div>
        </div>

        {/* Left icons */}
        <div className="absolute left-8 top-1/2 -translate-y-1/2 space-y-8 opacity-20">
          <div className="w-16 h-16 border-2 border-white rounded-lg flex items-center justify-center">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="w-16 h-16 border-2 border-white rounded-lg flex items-center justify-center">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
        </div>

        {/* Right icons */}
        <div className="absolute right-0 top-0 bottom-0 w-1/4 opacity-10 pointer-events-none">
          <div className="absolute top-1/4 right-12 w-20 h-20">
            <svg fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
            </svg>
          </div>
          <div className="absolute top-1/2 right-20 w-16 h-16">
            <svg fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
            </svg>
          </div>
          <div className="absolute bottom-1/4 right-16 w-12 h-12">
            <svg fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/>
            </svg>
          </div>
        </div>

        
        <div className="container mx-auto px-6 md:px-16 py-16 md:py-20 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            A next-generation digital campus solution for skill enhancement and growth
          </h1>

          <p className="text-lg md:text-xl text-blue-100 mb-8">
            From Admissions to Alumni-Manage everything in one Powerful Platform
          </p>

          <div className="flex justify-center gap-4">
            <Link href="/demo" className="bg-lime-300 text-blue-900 font-semibold px-8 py-3.5 rounded-full shadow-lg hover:scale-105 transition">Request Demo</Link>
            <Link href="/enquiry-form" className="border-2 border-white text-white px-8 py-3.5 rounded-full hover:bg-white/10 transition">Customize Solution</Link>
          </div>
        </div>

      </section>

      {/* HERO PNG - Positioned to overlap both sections */}
      <div className="relative -mt-56 md:-mt-72 z-30 flex justify-center">
        <Image src="/herosection.png" width={800} height={400} className="w-72 md:w-[500px] lg:w-[560px]" alt="" priority/>
      </div>

      {/* ------------------------------------------------ SECTION 2 DIRECTLY MERGED ------------------------------------------------ */}

      <section className="bg-gray-50 -mt-24 md:-mt-32 pt-48 md:pt-60 pb-6 md:pb-8" >
        <div className="container mx-auto px-6 md:px-16">
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-3xl shadow-xl overflow-hidden">
            <div className="flex flex-col lg:flex-row items-center justify-between px-8 md:px-12 py-6 md:py-8">
              
              <div className="max-w-2xl text-white space-y-4 lg:pr-8">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                  Empowering Students from Campus to the Professional World
                </h2>
                
                <p className="text-base md:text-lg text-blue-50 leading-relaxed">
                  Empowering Colleges and universities with a smart, centralized ERP system Designed to transform academic, administrative and placement Operations. With 35 + integrated modules, techedu College ERP ensures efficiency, transparently and compliance with NEP 2020 guidelines-making your campus truly future-ready.
                </p>
              </div>

              <div className="mt-8 lg:mt-0">
                <Image src="/student-professional.png" width={300} height={300} className="w-64 md:w-80 lg:w-96" alt="" priority/>
              </div>

            </div>
          </div>
        </div>
      </section>

    </>
=======
'use client';

import Link from 'next/link';
import Image from 'next/image';

const TechnicalInstituteHero = () => {
  return (
    <section className="relative bg-gradient-to-br from-blue-900 to-blue-700 text-white overflow-hidden" name="home">
      {/* Background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-32 h-32 bg-blue-400 rounded-full mix-blend-screen filter blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-teal-300 rounded-full mix-blend-screen filter blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 py-24 md:py-32">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Text Content - Left Side */}
          <div className="lg:w-1/2 space-y-6 z-10">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              <span className="block">Next-Gen Campus Management</span>
              <span className="text-blue-200">for TechEdu </span>
            </h1>
            
            <p className="text-lg md:text-xl text-blue-100 max-w-lg">
              Streamline lab scheduling, workshop management, placement tracking, and academic operations with our specialized ERP solution built for engineering education.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                href="/demo"
                className="px-6 py-3.5 bg-white hover:bg-blue-50 text-blue-700 font-medium rounded-lg transition-all shadow-md hover:shadow-lg text-center"
              >
                Request Demo
              </Link>
              <Link
                href="/enquiry-form"
                className="px-6 py-3.5 border border-blue-300 hover:border-white text-white hover:bg-blue-600/50 font-medium rounded-lg transition-all text-center"
              >
                Customize Solution
              </Link>
            </div>
            
            {/* Institute-specific features */}
            <div className="grid grid-cols-2 gap-3 pt-6">
              {[
                'Lab Management',
                'Placement Tracking',
                'AICTE Compliance',
                'Industry Collaboration',
                'Workshop Scheduling',
                'Project Management'
              ].map((feature) => (
                <div key={feature} className="flex items-center">
                  <svg className="w-5 h-5 text-blue-300 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-blue-100">{feature}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Technical Dashboard Image - Right Side */}
          <div className="lg:w-1/2 relative z-10">
            <div className="relative rounded-xl shadow-2xl overflow-hidden border border-blue-500/30 transform perspective-1000 rotate-y-6">
              <div className="bg-gray-900 p-4">
                {/* Technical dashboard mockup */}
                <div className="flex justify-between items-center mb-4">
                  <div className="text-sm font-mono text-blue-400">TechEdu v4.2</div>
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                </div>
                
                {/* Dashboard content */}
                <div className="bg-gray-800 rounded-lg p-4 mb-3">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-blue-300 font-mono text-sm">LAB UTILIZATION</h3>
                    <span className="text-xs text-green-400">+12% this month</span>
                  </div>
                  <div className="h-32 bg-gray-900 rounded p-2 grid grid-cols-5 gap-2">
                    {['MECH', 'CSE', 'ECE', 'CIVIL', 'AI/ML'].map((dept) => (
                      <div key={dept} className="relative">
                        <div className="absolute bottom-0 w-full bg-blue-600 rounded-t" style={{ height: `${Math.random() * 70 + 30}%` }}></div>
                        <div className="absolute bottom-0 w-full text-center text-xs text-blue-200">{dept}</div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-800 rounded-lg p-3">
                    <div className="text-xs text-blue-300 mb-1">PLACEMENTS</div>
                    <div className="text-xl font-bold text-white">87%</div>
                    <div className="text-xs text-green-400">↑ 5% YOY</div>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-3">
                    <div className="text-xs text-blue-300 mb-1">PROJECTS</div>
                    <div className="text-xl font-bold text-white">142</div>
                    <div className="text-xs text-blue-400">Ongoing</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
>>>>>>> origin/main
  );
};

export default TechnicalInstituteHero;