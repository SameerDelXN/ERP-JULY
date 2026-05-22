import {
  Home,
  FileText,
  Users,
  CreditCard,
  BookOpen,
  UserCheck,
  File,
  LayoutDashboard,
  DollarSign,
  TrendingUp,
  Calendar,
  Search,
  Filter,
  Eye,
  Download,
  Phone,
  Mail,
  MapPin,
  GraduationCap,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
  Trash2,
  Edit,
  Save,
  Lock,
  Check,
  Award,
  BookImage,
  MessageSquare,
  Settings,
  BookOpenCheck,
  CalendarClock
} from "lucide-react";

export const adminSidebarItems = [
  { id: "overview", label: "Overview", icon: Home },
  { id: "manage-users", label: "Manage Users", icon: Users },
  { id: "roles", label: "Roles & Permissions", icon: Award },
  { id: "enquiry&leads", label: "Enquiries & Leads", icon: FileText },
  // { id: "application-leads", label: "Application and Leads", icon: UserCheck }, // Removed as per request
  { id: "admission-applications", label: "Admission Applications", icon: BookImage },
  { id: "student-profiles", label: "Student Profiles", icon: GraduationCap },
  { id: "academic-configuration", label: "Academic Configuration", icon: BookOpen },
  { id: "courses", label: "CRM Management", icon: BookImage }, // ID 'courses' matches folder name to fix 404
  { id: "attendance-overview", label: "Attendance Overview", icon: CreditCard },
  { id: "feeStructure&payments", label: "Fee Structure & Payments", icon: FileText },
];

export const ROUTE_PERMISSIONS = {
  "/admin/overview": "sidebar.overview",
  "/admin/manage-users": "sidebar.manage-users",
  "/admin/roles": "sidebar.roles",
  "/admin/enquiry": "sidebar.enquiry&leads",
  // "/admin/application-leads": "sidebar.application-leads",
  "/admin/admission": "sidebar.admission-applications",
  "/admin/students": "sidebar.student-profiles",
  "/admin/academic": "sidebar.academic-configuration",
  "/admin/courses": "sidebar.courses", // Updated route to match folder
  "/admin/attendance": "sidebar.attendance-overview",
  "/admin/fees": "sidebar.feeStructure&payments",
};

// Sidebar specifically for superadmin (starting with Benefits)
export const superadminSidebarItems = [
  { id: "benefits", label: "Benefits", icon: Award },
  { id: "modules", label: "Modules", icon: BookOpen },
  { id: "features", label: "Features", icon: Settings },
  { id: "testimonials", label: "Testimonials", icon: MessageSquare },
  { id: "contact-info", label: "Contact Info", icon: Phone },
];

export const staffSidebarItems = [
  { id: "overview", label: "Overview", icon: Home },
  { id: "enquiry&leads", label: "Enquiries & Leads", icon: FileText },
  // { id: "followup-tracker", label: "Follow-up Tracker", icon: FileText },
  { id: "application-management", label: "Application Management", icon: BookImage },
  // { id: "admission-test-scheduling", label: "Admission Test Scheduling", icon: BookImage },
  // { id: "communication-logs", label: "Communication Logs (Email/SMS)", icon: BookImage },
];

export const studentSidebarItems = [
  { id: "profile", label: "Profile", icon: UserCheck },
  { id: "attendance", label: "Attendance", icon: FileText },
  { id: "myexams", label: "My Exams", icon: BookOpenCheck },
  // { id: "assignments", label: "Assignments", icon: BookOpen },
  { id: "timetable", label: "My Timetable", icon: CalendarClock },
];

//sample
export const teacherSidebarItems = [
  { id: "overview", label: "Overview", icon: Home },
  { id: "my-classes", label: "My Classes", icon: BookOpen },
  { id: "take-attendance", label: "Take Attendance", icon: UserCheck },
  { id: "attendance-overview", label: "Attendance Overview", icon: CreditCard },
  { id: "course-plan", label: "Create Course Plan", icon: UserCheck },
  { id: "student-list", label: "Student List", icon: Users },
  // {id: "upload-notes", label: "Upload Notes/Syllabus", icon: BookOpenCheck},
  // {id: "marks", label: "Exam Marks", icon: FileCheck},
  { id: "exam", label: "All Exam", icon: File },
]

export const accountantSidebarItems = [
  { id: "overview", label: "Overview", icon: Home },
  { id: "feeStructure&payments", label: "Payment Records", icon: FileText },
  { id: "payments", label: "Payment Processing", icon: CreditCard },
  { id: "student-profiles", label: "Student Profiles", icon: GraduationCap },
];

export const roles = [
  // {
  //   id: 1,
  //   name: 'Super Admin',
  //   description: 'Full system access with all permissions',
  //   userCount: 2,
  //   permissions: ['Full Access', 'User Management', 'System Settings', 'Reports', 'Financial Management'],
  //   color: 'bg-red-500'
  // },
  {
    id: 2,
    name: 'Admin',
    // description: 'Administrative access with limited system settings',
    // userCount: 5,
    // permissions: ['User Management', 'Student Management', 'Teacher Management', 'Reports', 'Fee Management'],
    color: 'bg-blue-500'
  },
  {
    id: 3,
    name: 'Teacher',
    // description: 'Teaching staff with classroom management access',
    // userCount: 45,
    // permissions: ['Student Management', 'Grade Management', 'Attendance', 'Assignment Management', 'Communication'],
    color: 'bg-green-500'
  },
  {
    id: 4,
    name: 'Staff',
    // description: 'Non-teaching staff with specific operational access',
    // userCount: 23,
    // permissions: ['Library Management', 'Transport Management', 'Inventory Management'],
    color: 'bg-indigo-500'
  },
  {
    id: 5,
    name: 'HOD',
    // description: 'HOD access to academic resources and information',
    // userCount: 1247,
    // permissions: ['View Profile', 'View Grades', 'Submit Assignments', 'View Schedule', 'Communication'],
    color: 'bg-purple-500'
  },
  // {
  //   id: 5,
  //   name: 'Parent',
  //   description: 'Parent access to monitor child progress',
  //   userCount: 892,
  //   permissions: ['View Child Progress', 'Communication', 'Fee Payment', 'Event Information'],
  //   color: 'bg-yellow-500'
  // },
  {
    id: 6,
    name: 'HR',
    // description: 'Parent access to monitor child progress',
    // userCount: 892,
    // permissions: ['View Child Progress', 'Communication', 'Fee Payment', 'Event Information'],
    color: 'bg-yellow-500'
  },
  {
    id: 7,
    name: 'Accountant',
    // description: 'Financial management and accounting access',
    // userCount: 5,
    // permissions: ['Fee Management', 'Invoice Management', 'Financial Reports', 'Payment Processing'],
    color: 'bg-emerald-500'
  },
];