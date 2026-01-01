'use client';
<<<<<<< HEAD

import {
  Users,
  LineChart,
  Folder,
  CalendarCheck,
  CheckSquare,
  FileStack,
  ClipboardList,
  ShieldCheck,
} from 'lucide-react';

const benefits = [
  {
    icon: <Users className="w-6 h-6" />,
    title: "Role-Based Access",
    description: "Granular permissions for Faculty, HOD, Lab Staff, and Admin",
  },
  {
    icon: <LineChart className="w-6 h-6" />,
    title: "Real-Time Analytics",
    description: "Live dashboards with actionable insights",
  },
  {
    icon: <Folder className="w-6 h-6" />,
    title: "Digital Document Hub",
    description: "Centralized repository with version control",
  },
  {
    icon: <CalendarCheck className="w-6 h-6" />,
    title: "Academic Automation",
    description: "Automate labs, exams, and workshop workflows",
  },
  {
    icon: <CheckSquare className="w-6 h-6" />,
    title: "Compliance Reports",
    description: "One-click AICTE, NAAC, and NBA reports",
  },
  {
    icon: <FileStack className="w-6 h-6" />,
    title: "Placement Tracking",
    description: "Complete recruitment lifecycle management",
  },
  {
    icon: <ClipboardList className="w-6 h-6" />,
    title: "Project Management",
    description: "Track research and student projects",
  },
  {
    icon: <ShieldCheck className="w-6 h-6" />,
    title: "Quality Assurance",
    description: "Built-in checks for academic excellence",
  },
=======
import { Users, LineChart, Folder, CalendarCheck, LockKeyhole, FileStack, ClipboardList } from 'lucide-react';

const benefits = [
  {
    icon: <Users className="w-8 h-8" />,
    title: "Role-Based Access",
    description: "Secure permissions for faculty, HODs, lab staff, and admin with customizable access levels."
  },
  {
    icon: <LineChart className="w-8 h-8" />,
    title: "Real-Time Analytics",
    description: "Live dashboards with department-wise performance metrics and institutional KPIs."
  },
  {
    icon: <Folder className="w-8 h-8" />,
    title: "Digital Document Hub",
    description: "Centralized storage for syllabi, lab manuals, research papers, and accreditation documents."
  },
  {
    icon: <CalendarCheck className="w-8 h-8" />,
    title: "Academic Automation",
    description: "Auto-schedule labs, workshops, and exams with conflict detection and resource allocation."
  },
  {
    icon: <LockKeyhole className="w-8 h-8" />,
    title: "AICTE Compliance",
    description: "Built-in templates and reports for mandatory submissions and accreditation requirements."
  },
  {
    icon: <FileStack className="w-8 h-8" />,
    title: "Placement Tracking",
    description: "End-to-end management of company drives, student profiles, and offer letters."
  },
  {
    icon: <ClipboardList className="w-8 h-8" />,
    title: "Project Management",
    description: "Track final year projects, research initiatives, and industry collaborations."
  }
>>>>>>> origin/main
];

export default function BenefitsSection() {
  return (
<<<<<<< HEAD
    <section className="py-20 bg-white" name="benefits">
      <div className="container mx-auto px-6 md:px-16">

        {/* Top Pill Text */}
        <div className="flex justify-center mb-6">
          <span className="px-6 py-2 bg-gray-100 rounded-full text-gray-700 font-medium text-sm">
            Why Choose TechEdu ERP
          </span>
        </div>

        {/* Main Box Heading */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Built for Engineering Excellence
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Comprehensive features designed specifically for technical education institutions
          </p>
        </div>

        {/* Grid Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((item, index) => (
            <div
              key={index}
              className="bg-blue-50 p-6 rounded-xl hover:bg-blue-100 transition duration-200 shadow-sm hover:shadow-md cursor-pointer"
            >
              <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-blue-100 text-blue-600 mb-4">
                {item.icon}
              </div>

              <h3 className="font-semibold text-gray-800 text-lg mb-1">
                {item.title}
              </h3>

              <p className="text-gray-600 text-sm leading-relaxed">
                {item.description}
              </p>
=======
    <section className="py-16 bg-white" name="benefits">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose Our <span className="text-blue-600">Technical ERP</span>?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Specialized solutions designed for the unique challenges of engineering institutes and polytechnics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className="group relative bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:border-blue-100"
            >
              <div className="absolute inset-0 rounded-xl border-2 border-blue-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none"></div>
              <div className="flex items-center mb-4">
                <div className="p-2 rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-100 group-hover:text-blue-700 transition-colors duration-300">
                  {benefit.icon}
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{benefit.title}</h3>
              <p className="text-gray-600">{benefit.description}</p>
>>>>>>> origin/main
            </div>
          ))}
        </div>

<<<<<<< HEAD
      </div>
    </section>
  );
}
=======
        <div className="mt-16 text-center">
          <p className="text-gray-500 mb-6">Trusted by leading technical institutions</p>
          <div className="flex flex-wrap justify-center gap-8 items-center opacity-70">
            {['AICTE', 'NBA', 'NAAC', 'COA', 'UGC'].map((org, i) => (
              <div key={i} className="text-2xl font-bold text-gray-400">{org}</div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
>>>>>>> origin/main
