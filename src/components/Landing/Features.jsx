'use client';
import { 
  CheckCircle2,
  BookMarked,
  ClipboardList,
  BellRing,
  CalendarCheck,
  FileBarChart2,
  Users2,
  CreditCard,
  FlaskRound,
  Building,
  BriefcaseBusiness,
  FileCheck
} from 'lucide-react';

const features = [
  {
    icon: <BookMarked className="w-5 h-5 text-blue-600" />,
    title: "Online Admissions",
    description: "Complete digital admission process with application tracking and automated merit lists"
  },
  {
    icon: <ClipboardList className="w-5 h-5 text-blue-600" />,
    title: "Attendance Management",
    description: "Biometric/Facial recognition integration with regulatory compliance reports"
  },
  {
    icon: <BellRing className="w-5 h-5 text-blue-600" />,
    title: "SMS/Email Alerts",
    description: "Automated notifications for fees, exams, and important announcements"
  },
  {
    icon: <CalendarCheck className="w-5 h-5 text-blue-600" />,
    title: "Timetable Scheduling",
    description: "AI-powered scheduling for classes, labs, and workshops with conflict resolution"
  },
  {
    icon: <FileBarChart2 className="w-5 h-5 text-blue-600" />,
    title: "Exam Management",
    description: "End-to-end exam processing from scheduling to result publication"
  },
  {
    icon: <Users2 className="w-5 h-5 text-blue-600" />,
    title: "Faculty Management",
    description: "Complete HR solution with workload balancing and performance tracking"
  },
  {
    icon: <CreditCard className="w-5 h-5 text-blue-600" />,
    title: "Fee Automation",
    description: "Online payment gateway integration with receipt generation"
  },
  {
    icon: <FlaskRound className="w-5 h-5 text-blue-600" />,
    title: "Lab Utilization",
    description: "Equipment tracking and optimal resource allocation analytics"
  },
  {
    icon: <Building className="w-5 h-5 text-blue-600" />,
    title: "Hostel Management",
    description: "Complete residential facility management with mess controls"
  },
  {
    icon: <BriefcaseBusiness className="w-5 h-5 text-blue-600" />,
    title: "Placement Cell",
    description: "Company relationship management and student placement tracking"
  },
  {
    icon: <FileCheck className="w-5 h-5 text-blue-600" />,
    title: "Accreditation Ready",
    description: "Pre-formatted reports for NBA, NAAC, and AICTE submissions"
  },
  {
    icon: <CheckCircle2 className="w-5 h-5 text-blue-600" />,
    title: "Custom Modules",
    description: "Tailored solutions for your institute's unique requirements"
  }
];

export default function FeaturesSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Features That <span className="text-blue-600">Simplify Operations</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Comprehensive tools designed specifically for technical education management
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="mt-0.5">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 text-center">
          <button className="px-6 py-3 border border-blue-600 text-blue-600 hover:bg-blue-50 font-medium rounded-lg transition-all">
            See All Features in Detail
          </button>
        </div>
      </div>
    </section>
  );
}