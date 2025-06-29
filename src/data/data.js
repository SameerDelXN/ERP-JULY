import {
  Users,
  GraduationCap,
  BookOpen,
  TrendingUp,
  Settings,
  Home,
  UserCheck,
  FileText,
  CreditCard,
  FileTextIcon,
  BookImage,
  DollarSign
} from "lucide-react";
export const adminSidebarItems = [
  { id: "overview", label: "Overview", icon: Home },
  { id: "manage-users", label: "Manage Users/Roles", icon: Users },
  { id: "enquiry&leads", label: "Enquiries & Leads", icon: FileTextIcon },
  { id: "admission-applications", label: "Admission Applications", icon: BookImage },
  // { id: "student-profiles", label: "Student Profiles", icon: GraduationCap },
  // { id: "academic-configuration", label: "Academic Configuration", icon: BookOpen },
  // { id: "class-sections&facultymapping", label: "Class Sections & Faculty Mapping", icon: UserCheck },
  // { id: "attendance-overview", label: "Attendance Overview", icon: CreditCard },
  // { id: "feeStructure&payments", label: "Fee Structure & Payments", icon: FileText },
  // { id: "staff-directory", label: "Staff Directory", icon: Users },
  // { id: "payroll-management", label: "Payroll Management", icon: DollarSign },
  // { id: "reports&analytics", label: "Reports & Analytics (basic)", icon: TrendingUp },
];
export const staffSidebarItems = [
  { id: "overview", label: "Overview", icon: Home },
  { id: "enquiry&leads", label: "Enquiries & Leads", icon: FileTextIcon },

];

export const studentSidebarItems = [];

export const columns = [
  { header: 'Reg.Id', accessor: 'Reg.Id' },
  { header: 'First Name', accessor: 'name' },
  { header: 'Last Name', accessor: 'name' },
  { header: 'Date of Birth', accessor: 'name' },
  { header: 'Gender', accessor: 'name' },
  { header: 'Nationality', accessor: 'name' },
  { header: 'Father’s Full Name', accessor: 'name' },
  { header: 'Mother’s Full Name', accessor: 'name' },
  { header: 'Mobile Number', accessor: 'name' },
  { header: 'Email Address', accessor: 'name' },
  { header: 'Address Line 1', accessor: 'name' },
  { header: 'City', accessor: 'name' },
  { header: 'State', accessor: 'name' },
  { header: 'Postal/Zip Code', accessor: 'Postal/Zip Code' },
  { header: 'Country', accessor: 'name' },
  { header: 'Current School Name', accessor: 'name' },
  { header: 'Current Class', accessor: 'name' },
  { header: 'Applying For Class', accessor: 'name' },
  { header: 'Academic Year Applying For', accessor: 'name' },
  { header: 'Preferred Medium of Instruction', accessor: 'name' },
  { header: 'Birth Certificate', accessor: 'name' },
  { header: 'Parent Aadhaar or PAN Card', accessor: 'name' },
  { header: 'Action', accessor: 'name' },
];

export const data = [

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
      description: 'Administrative access with limited system settings',
      userCount: 5,
      permissions: ['User Management', 'Student Management', 'Teacher Management', 'Reports', 'Fee Management'],
      color: 'bg-blue-500'
    },
    {
      id: 3,
      name: 'Teacher',
      description: 'Teaching staff with classroom management access',
      userCount: 45,
      permissions: ['Student Management', 'Grade Management', 'Attendance', 'Assignment Management', 'Communication'],
      color: 'bg-green-500'
    },
    {
      id: 4,
      name: 'Staff',
      description: 'Non-teaching staff with specific operational access',
      userCount: 23,
      permissions: ['Library Management', 'Transport Management', 'Inventory Management'],
      color: 'bg-indigo-500'
    }
    // {
    //   id: 4,
    //   name: 'Student',
    //   description: 'Student access to academic resources and information',
    //   userCount: 1247,
    //   permissions: ['View Profile', 'View Grades', 'Submit Assignments', 'View Schedule', 'Communication'],
    //   color: 'bg-purple-500'
    // },
    // {
    //   id: 5,
    //   name: 'Parent',
    //   description: 'Parent access to monitor child progress',
    //   userCount: 892,
    //   permissions: ['View Child Progress', 'Communication', 'Fee Payment', 'Event Information'],
    //   color: 'bg-yellow-500'
    // },
  ];