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
  );
};

export default TechnicalInstituteHero;