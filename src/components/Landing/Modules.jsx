'use client';
import { 
  BookOpenText, 
  GraduationCap, 
  IndianRupee, 
  Library, 
  CalendarDays, 
  UserCog, 
  ClipboardSignature, 
  BarChart4,
  FlaskConical,
  Building2,
  Briefcase,
  FileSearch
} from 'lucide-react';

const modules = [
  {
    icon: <BookOpenText className="w-6 h-6" />,
    title: "Admissions",
    description: "Streamline application processing, merit lists, and enrollment with automated workflows"
  },
  {
    icon: <GraduationCap className="w-6 h-6" />,
    title: "Academics",
    description: "Manage curriculum, timetable, attendance, and grading with AICTE compliance"
  },
  {
    icon: <IndianRupee className="w-6 h-6" />,
    title: "Fee Management",
    description: "Automated fee collection, receipts, and reconciliation with UGC-compliant reporting"
  },
  {
    icon: <Library className="w-6 h-6" />,
    title: "Examination",
    description: "End-to-end exam scheduling, invigilation, and result processing"
  },
  {
    icon: <CalendarDays className="w-6 h-6" />,
    title: "Timetable",
    description: "Smart scheduling for classes, labs, and workshops with conflict detection"
  },
  {
    icon: <UserCog className="w-6 h-6" />,
    title: "HR & Payroll",
    description: "Faculty management, leave tracking, and salary processing"
  },
  {
    icon: <ClipboardSignature className="w-6 h-6" />,
    title: "Placement",
    description: "Track company drives, student profiles, and offer letters"
  },
  {
    icon: <BarChart4 className="w-6 h-6" />,
    title: "Analytics",
    description: "Real-time dashboards with institutional KPIs and department metrics"
  },
  {
    icon: <FlaskConical className="w-6 h-6" />,
    title: "Lab Management",
    description: "Inventory tracking, equipment maintenance, and utilization reports"
  },
  {
    icon: <Building2 className="w-6 h-6" />,
    title: "Hostel",
    description: "Room allocation, mess management, and student amenities"
  },
  {
    icon: <Briefcase className="w-6 h-6" />,
    title: "Industry Collaboration",
    description: "Manage MOUs, projects, and internship programs"
  },
  {
    icon: <FileSearch className="w-6 h-6" />,
    title: "Accreditation",
    description: "Pre-built templates for NBA, NAAC, and AICTE submissions"
  }
];

export default function ModulesSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Comprehensive <span className="text-blue-600">ERP Modules</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Specialized solutions designed for technical institutes of all sizes
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {modules.map((module, index) => (
            <div 
              key={index}
              className="group bg-white rounded-lg border border-gray-200 p-6 transition-all duration-300 hover:shadow-md hover:border-blue-200 hover:-translate-y-1"
            >
              <div className="flex items-start space-x-4">
                <div className="p-2 rounded-md bg-blue-50 text-blue-600 group-hover:bg-blue-100 group-hover:text-blue-700 transition-colors">
                  {module.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{module.title}</h3>
                  <p className="text-sm text-gray-600">{module.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all shadow-sm hover:shadow-md">
            View All Module Features
          </button>
        </div>
      </div>
    </section>
  );
}