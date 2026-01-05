'use client';


import { 
  Globe, 
  Fingerprint, 
  MessageSquare, 
  CalendarRange, 
  ClipboardList, 
  Users2, 
  CreditCard, 
  FlaskRound, 
  Building, 
  BriefcaseBusiness, 
  FileCheck, 
  BarChart3 
} from 'lucide-react';

const features = [
  { icon: <Globe className="w-6 h-6 text-blue-600" />, title: "Online Admissions", description: "Digital application process document verification" },
  { icon: <Fingerprint className="w-6 h-6 text-blue-600" />, title: "Smart Attendance", description: "Biometric & facial recognition integration" },
  { icon: <MessageSquare className="w-6 h-6 text-blue-600" />, title: "SMS & Email Alert", description: "Automated notifications for all stakeholders" },

  { icon: <CalendarRange className="w-6 h-6 text-blue-600" />, title: "AI Timetable Scheduling", description: "Conflict-free scheduling with optimization" },
  { icon: <ClipboardList className="w-6 h-6 text-blue-600" />, title: "Exam Management", description: "Complete examination lifecycle handling" },
  { icon: <Users2 className="w-6 h-6 text-blue-600" />, title: "Faculty Management", description: "Automated notifications for all stakeholders" },

  { icon: <CreditCard className="w-6 h-6 text-blue-600" />, title: "Fee Automation", description: "Online payments with auto-reconciliation" },
  { icon: <BarChart3 className="w-6 h-6 text-blue-600" />, title: "Lab Analytics", description: "Utilization reports & resource planning" },
  { icon: <Building className="w-6 h-6 text-blue-600" />, title: "Hostel Management", description: "Room allotment & mess management" },

  { icon: <BriefcaseBusiness className="w-6 h-6 text-blue-600" />, title: "Placement Cell", description: "Company relations & student placements" },
  { icon: <FileCheck className="w-6 h-6 text-blue-600" />, title: "Accreditation Reports", description: "Ready-to-submit AICTE/NAAC documents" },
  { icon: <FileCheck className="w-6 h-6 text-blue-600" />, title: "Custom Modules", description: "Tailored solutions for unique needs" },

];

export default function FeaturesSection() {
  return (

    <section className="py-20 bg-white" id="features">
      <div className="container mx-auto px-6 md:px-16">

        {/* --- Heading Section --- */}
        <div className="text-center mb-16">

          {/* Pill label */}
          <div className="flex justify-center mb-6">
            <span className="px-6 py-2 bg-blue-50/70 hover:bg-blue-100/70 rounded-full text-sm font-medium text-gray-700 shadow-sm border border-transparent hover:border-blue-200">
              Powerful Features
            </span>
          </div>

          {/* Title */}
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
            Everything You Need to Succeed
          </h2>

          {/* Subtitle */}
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Comprehensive features designed to streamline every aspect of campus operations
          </p>
        </div>

        {/* --- Features Grid (Same Layout in Screenshot) --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((item, i) => (
            <div key={i} 
              className="flex items-start space-x-4 p-5 bg-blue-50/70 hover:bg-blue-100/70 rounded-xl 
                         transition-all duration-300 border border-transparent hover:border-blue-200"
            >
              <div className="w-10 h-10 flex items-center justify-center bg-white text-blue-600 rounded-lg shadow-sm">
                {item.icon}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-base mb-1">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Button */}
        <div className="mt-12 text-center">
          <button className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full 
                            transition shadow-md hover:shadow-lg">
            See All Feature In Detail
          </button>
        </div>

      </div>
    </section>
  );
}