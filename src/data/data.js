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
  { id: "manage Users", label: "Manage Users/Roles", icon: Users },
  { id: "enquiry & Leads", label: "Enquiries & Leads", icon: FileTextIcon },
  { id: "admission Applications", label: "Admission Applications", icon: BookImage },
  { id: "Student Profiles", label: "Student Profiles", icon: GraduationCap },
  { id: "Academic Configuration", label: "Academic Configuration", icon: BookOpen },
  { id: "Class Sections & Faculty Mapping", label: "Class Sections & Faculty Mapping", icon: UserCheck },
  { id: "Attendance Overview", label: "Attendance Overview", icon: CreditCard },
  { id: "Fee Structure & Payments", label: "Fee Structure & Payments", icon: FileText },
  { id: "Staff Directory", label: "Staff Directory", icon: Users },
  { id: "Payroll Management", label: "Payroll Management", icon: DollarSign },
  { id: "Reports & Analytics (basic)", label: "Reports & Analytics (basic)", icon: TrendingUp },
];

export const studentSidebarItems = [];
//    const stats = [
//     { title: 'Total Students', value: '2,847', change: '+12%', icon: Users, color: 'bg-blue-500' },
//     { title: 'Active Teachers', value: '154', change: '+3%', icon: GraduationCap, color: 'bg-green-500' },
//     { title: 'Classes Today', value: '48', change: '+5%', icon: BookOpen, color: 'bg-purple-500' },
//     { title: 'Revenue', value: '$124,590', change: '+18%', icon: DollarSign, color: 'bg-orange-500' },
//   ];

//   const students = [
//     { id: 1, name: 'Sarah Johnson', class: '10-A', grade: 'A+', attendance: '95%', status: 'Active' },
//     { id: 2, name: 'Michael Chen', class: '10-B', grade: 'A', attendance: '88%', status: 'Active' },
//     { id: 3, name: 'Emma Davis', class: '9-A', grade: 'B+', attendance: '92%', status: 'Active' },
//     { id: 4, name: 'James Wilson', class: '11-C', grade: 'A-', attendance: '90%', status: 'Active' },
//     { id: 5, name: 'Olivia Brown', class: '10-A', grade: 'A+', attendance: '97%', status: 'Active' },
//   ];

//   const recentActivities = [
//     { id: 1, action: 'New student enrollment', user: 'Admin', time: '2 minutes ago', type: 'success' },
//     { id: 2, action: 'Fee payment received', user: 'Sarah Johnson', time: '15 minutes ago', type: 'info' },
//     { id: 3, action: 'Attendance marked', user: 'Mr. Smith', time: '1 hour ago', type: 'default' },
//     { id: 4, action: 'Report generated', user: 'Admin', time: '2 hours ago', type: 'warning' },
//   ];

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