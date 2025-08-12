// "use client";

// import React, { useState, useEffect } from "react";
// import {
//   Users,
//   UserCheck,
//   GraduationCap,
//   Building,
//   TrendingUp,
//   TrendingDown,
//   Calendar,
//   Clock,
//   Bell,
//   Search,
//   Filter,
//   Download,
//   Plus,
//   Activity,
//   Award,
//   BookOpen,
//   DollarSign,
//   ArrowUpRight,
//   ArrowDownRight,
//   ChevronRight,
//   PieChart,
//   BarChart2,
//   FileText,
//   LayoutDashboard,
//   Settings,
//   Mail,
//   HelpCircle,
// } from "lucide-react";
// import { useSession } from "@/context/SessionContext";
// import { useRouter } from "next/navigation";

// const AdminDashboard = () => {
//   const { user, refreshSession } = useSession();
//   const [dashboardData, setDashboardData] = useState(null);
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const router = useRouter();

//   const fetchDashboardStats = async () => {
//     try {
//       const res = await fetch("/api/dashboard");
//       if (!res.ok) {
//         throw new Error("Failed To Fetch Dashboard Data");
//       }
//       const data = await res.json();
//       return data;
//     } catch (err) {
//       console.log(err);
//       return null;
//     }
//   };

//   useEffect(() => {
//     refreshSession();
//     fetchDashboardStats().then((data) => setDashboardData(data));
//   }, []);

//   // Mock data - replace with your actual data
//   const students = {
//     total: 1245,
//     active: 1180,
//     activePercentage: 95,
//     growth: 8.2,
//     trend: "up",
//   };

//   const stats = {
//     students: {
//       icon: Users,
//       title: "Total Students",
//       route: "/admin/students",
//     },
//     staff: {
//       total: 45,
//       active: 42,
//       activePercentage: 93,
//       growth: 5.2,
//       trend: "up",
//       icon: UserCheck,
//       title: "Total Staff",
//       route: "/admin/staff",
//     },
//     teachers: {
//       total: 28,
//       active: 26,
//       activePercentage: 93,
//       growth: -2.1,
//       trend: "down",
//       icon: GraduationCap,
//       title: "Total Teachers",
//       route: "/admin/teachers",
//     },
//     hr: {
//       total: 5,
//       active: 5,
//       activePercentage: 100,
//       growth: 8.7,
//       trend: "up",
//       icon: Building,
//       title: "HR Personnel",
//       route: "/admin/hr",
//     },
//   };

//   const recentActivities = [
//     {
//       id: 1,
//       type: "admission",
//       message: "15 new admission applications received",
//       time: "2 hours ago",
//       route: "/admin/admissions",
//     },
//     {
//       id: 2,
//       type: "staff",
//       message: "New teacher John Smith joined Mathematics dept",
//       time: "4 hours ago",
//       route: "/admin/staff",
//     },
//     {
//       id: 3,
//       type: "system",
//       message: "Monthly attendance report generated",
//       time: "6 hours ago",
//       route: "/admin/reports",
//     },
//     {
//       id: 4,
//       type: "payment",
//       message: "₹2,50,000 fees collected today",
//       time: "8 hours ago",
//       route: "/admin/finance",
//     },
//   ];

//   const quickActions = [
//     {
//       icon: Plus,
//       label: "Add Department",
//       route: "/admin/academic-configuration",
//     },
//     { icon: UserCheck, label: "Add Staff", route: "/admin/manage-users" },
//     { icon: Calendar, label: "Schedule", route: "/admin/calendar" },
//     { icon: Download, label: "Reports", route: "/admin/reports" },
//   ];

//   const StatCard = ({
//     title,
//     icon: Icon,
//     total,
//     active,
//     activePercentage,
//     growth,
//     trend,
//     route,
//   }) => (
//     <div
//       onClick={() => router.push(route)}
//       className="bg-white rounded-xl p-6 border border-indigo-50 hover:shadow-md transition-all duration-200 group cursor-pointer hover:border-indigo-100"
//     >
//       <div className="flex items-center justify-between mb-4">
//         <div className="p-3 bg-indigo-50 rounded-lg group-hover:bg-indigo-100 transition-colors duration-200">
//           <Icon className="w-5 h-5 text-indigo-600" />
//         </div>
//         <span
//           className={`text-xs font-medium px-2 py-1 rounded-full ${
//             trend === "up"
//               ? "bg-green-50 text-green-600"
//               : "bg-red-50 text-red-600"
//           }`}
//         >
//           {trend === "up" ? (
//             <span className="flex items-center gap-1">
//               <ArrowUpRight className="w-3 h-3" /> +{growth}%
//             </span>
//           ) : (
//             <span className="flex items-center gap-1">
//               <ArrowDownRight className="w-3 h-3" /> {growth}%
//             </span>
//           )}
//         </span>
//       </div>

//       <div className="space-y-3">
//         <h3 className="text-indigo-900/70 text-sm font-medium">{title}</h3>
//         <div className="flex items-baseline gap-2">
//           <span className="text-2xl font-semibold text-indigo-900">
//             {total}
//           </span>
//           <span className="text-sm text-indigo-500">total</span>
//         </div>
//         <div className="flex items-center gap-3">
//           <div className="flex-1 bg-indigo-50 rounded-full h-1.5">
//             <div
//               className="h-1.5 rounded-full bg-indigo-600 transition-all duration-300"
//               style={{ width: `${activePercentage}%` }}
//             ></div>
//           </div>
//           <span className="text-xs text-indigo-600">{active} active</span>
//         </div>
//       </div>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-indigo-50/30 flex">

//       {/* Main Content */}
//       <div className="flex-1 overflow-auto">
//         <div className="p-6">
//           {/* Header */}
//           <div className="flex justify-between items-center mb-8">
//             <div>
//               <h1 className="text-2xl font-bold text-indigo-900">
//                 Dashboard Overview
//               </h1>
//               <p className="text-indigo-500">
//                 Welcome back, {user?.name || "Admin"}
//               </p>
//             </div>
//             <div className="flex items-center gap-4">
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-400" />
//                 <input
//                   type="text"
//                   placeholder="Search..."
//                   className="pl-10 pr-4 py-2 text-sm rounded-lg border border-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-transparent w-64"
//                 />
//               </div>
//               <button className="p-2 rounded-lg bg-white border border-indigo-100 text-indigo-600 hover:bg-indigo-50 relative">
//                 <Bell className="w-5 h-5" />
//                 <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
//               </button>
//               <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
//                 <Plus className="w-4 h-4" />
//                 <span>New Task</span>
//               </button>
//             </div>
//           </div>

//           {/* Stats Grid */}
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
//             <StatCard
//               title={stats.students.title}
//               icon={stats.students.icon}
//               total={students.total}
//               active={students.active}
//               activePercentage={students.activePercentage}
//               growth={students.growth}
//               trend={students.trend}
//               route={stats.students.route}
//             />
//             <StatCard
//               title={stats.staff.title}
//               icon={stats.staff.icon}
//               total={stats.staff.total}
//               active={stats.staff.active}
//               activePercentage={stats.staff.activePercentage}
//               growth={stats.staff.growth}
//               trend={stats.staff.trend}
//               route={stats.staff.route}
//             />
//             <StatCard
//               title={stats.teachers.title}
//               icon={stats.teachers.icon}
//               total={stats.teachers.total}
//               active={stats.teachers.active}
//               activePercentage={stats.teachers.activePercentage}
//               growth={stats.teachers.growth}
//               trend={stats.teachers.trend}
//               route={stats.teachers.route}
//             />
//             <StatCard
//               title={stats.hr.title}
//               icon={stats.hr.icon}
//               total={stats.hr.total}
//               active={stats.hr.active}
//               activePercentage={stats.hr.activePercentage}
//               growth={stats.hr.growth}
//               trend={stats.hr.trend}
//               route={stats.hr.route}
//             />
//           </div>

//           {/* Charts Section */}
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
//             <div className="bg-white rounded-xl p-6 border border-indigo-50">
//               <div className="flex items-center justify-between mb-4">
//                 <h3 className="text-lg font-medium text-indigo-900">
//                   Student Enrollment
//                 </h3>
//                 <div className="flex items-center gap-2">
//                   <button className="text-xs px-2 py-1 rounded-md bg-indigo-50 text-indigo-600">
//                     Monthly
//                   </button>
//                   <button className="text-xs px-2 py-1 rounded-md text-indigo-500 hover:bg-indigo-50">
//                     Yearly
//                   </button>
//                 </div>
//               </div>
//               <div className="h-64 bg-indigo-50 rounded-lg flex items-center justify-center">
//                 <BarChart2 className="w-12 h-12 text-indigo-300" />
//               </div>
//             </div>
//             <div className="bg-white rounded-xl p-6 border border-indigo-50">
//               <div className="flex items-center justify-between mb-4">
//                 <h3 className="text-lg font-medium text-indigo-900">
//                   Attendance Overview
//                 </h3>
//                 <div className="flex items-center gap-2">
//                   <button className="text-xs px-2 py-1 rounded-md bg-indigo-50 text-indigo-600">
//                     By Class
//                   </button>
//                   <button className="text-xs px-2 py-1 rounded-md text-indigo-500 hover:bg-indigo-50">
//                     By Subject
//                   </button>
//                 </div>
//               </div>
//               <div className="h-64 bg-indigo-50 rounded-lg flex items-center justify-center">
//                 <PieChart className="w-12 h-12 text-indigo-300" />
//               </div>
//             </div>
//           </div>

//           {/* Additional Metrics */}
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
//             <div
//               onClick={() => router.push("/admin/attendance")}
//               className="bg-white rounded-xl p-6 border border-indigo-50 hover:shadow-sm transition-all cursor-pointer"
//             >
//               <div className="flex items-center gap-3 mb-3">
//                 <div className="p-2 bg-indigo-50 rounded-lg">
//                   <Award className="w-5 h-5 text-indigo-600" />
//                 </div>
//                 <span className="text-sm font-medium text-indigo-700">
//                   Attendance Rate
//                 </span>
//               </div>
//               <div className="text-2xl font-semibold text-indigo-900">94.2%</div>
//               <div className="text-xs text-green-600 mt-1 flex items-center gap-1">
//                 <ArrowUpRight className="w-3 h-3" />
//                 +2.1% from last month
//               </div>
//             </div>

//             <div
//               onClick={() => router.push("/admin/courses")}
//               className="bg-white rounded-xl p-6 border border-indigo-50 hover:shadow-sm transition-all cursor-pointer"
//             >
//               <div className="flex items-center gap-3 mb-3">
//                 <div className="p-2 bg-indigo-50 rounded-lg">
//                   <BookOpen className="w-5 h-5 text-indigo-600" />
//                 </div>
//                 <span className="text-sm font-medium text-indigo-700">
//                   Active Courses
//                 </span>
//               </div>
//               <div className="text-2xl font-semibold text-indigo-900">127</div>
//               <div className="text-xs text-indigo-500 mt-1 flex items-center gap-1">
//                 <Plus className="w-3 h-3" />5 new this month
//               </div>
//             </div>

//             <div
//               onClick={() => router.push("/admin/events")}
//               className="bg-white rounded-xl p-6 border border-indigo-50 hover:shadow-sm transition-all cursor-pointer"
//             >
//               <div className="flex items-center gap-3 mb-3">
//                 <div className="p-2 bg-indigo-50 rounded-lg">
//                   <Calendar className="w-5 h-5 text-indigo-600" />
//                 </div>
//                 <span className="text-sm font-medium text-indigo-700">
//                   Events Today
//                 </span>
//               </div>
//               <div className="text-2xl font-semibold text-indigo-900">8</div>
//               <div className="text-xs text-indigo-500 mt-1">3 upcoming</div>
//             </div>

//             <div
//               onClick={() => router.push("/admin/finance")}
//               className="bg-white rounded-xl p-6 border border-indigo-50 hover:shadow-sm transition-all cursor-pointer"
//             >
//               <div className="flex items-center gap-3 mb-3">
//                 <div className="p-2 bg-indigo-50 rounded-lg">
//                   <DollarSign className="w-5 h-5 text-indigo-600" />
//                 </div>
//                 <span className="text-sm font-medium text-indigo-700">
//                   Revenue
//                 </span>
//               </div>
//               <div className="text-2xl font-semibold text-indigo-900">
//                 ₹12.5L
//               </div>
//               <div className="text-xs text-indigo-500 mt-1">This month</div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;

"use client"
import React, { useState, useEffect } from "react";
import {
  Users,
  UserCheck,
  GraduationCap,
  Building,
  TrendingUp,
  TrendingDown,
  Calendar,
  Clock,
  Bell,
  Search,
  Filter,
  Download,
  Plus,
  Activity,
  Award,
  BookOpen,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  PieChart,
  BarChart2,
  FileText,
  LayoutDashboard,
  Settings,
  Mail,
  HelpCircle,
  Eye,
  Star,
  AlertCircle,
} from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
  Filler,
} from 'chart.js';
import {
  Line,
  Bar,
  Doughnut,
  Pie,
} from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
  Filler
);

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState('monthly');

  // Sample data for charts
  const enrollmentData = [
    { month: 'Jan', students: 1100, target: 1000 },
    { month: 'Feb', students: 1150, target: 1100 },
    { month: 'Mar', students: 1180, target: 1200 },
    { month: 'Apr', students: 1220, target: 1250 },
    { month: 'May', students: 1245, target: 1300 },
    { month: 'Jun', students: 1280, target: 1350 },
  ];

  const attendanceData = [
    { name: 'Present', value: 94.2, color: '#4f46e5' },
    { name: 'Absent', value: 3.8, color: '#ef4444' },
    { name: 'Late', value: 2.0, color: '#f59e0b' },
  ];

  const performanceData = [
    { subject: 'Math', score: 85 },
    { subject: 'Science', score: 92 },
    { subject: 'English', score: 88 },
    { subject: 'History', score: 76 },
    { subject: 'Arts', score: 95 },
  ];

  const revenueData = [
    { month: 'Jan', revenue: 850000, expenses: 620000 },
    { month: 'Feb', revenue: 920000, expenses: 650000 },
    { month: 'Mar', revenue: 1100000, expenses: 720000 },
    { month: 'Apr', revenue: 1180000, expenses: 780000 },
    { month: 'May', revenue: 1250000, expenses: 820000 },
  ];

  // Mock data
  const students = {
    total: 1245,
    active: 1180,
    activePercentage: 95,
    growth: 8.2,
    trend: "up",
  };

  const stats = {
    students: {
      icon: Users,
      title: "Total Students",
      route: "/admin/students",
    },
    staff: {
      total: 45,
      active: 42,
      activePercentage: 93,
      growth: 5.2,
      trend: "up",
      icon: UserCheck,
      title: "Total Staff",
      route: "/admin/staff",
    },
    teachers: {
      total: 28,
      active: 26,
      activePercentage: 93,
      growth: -2.1,
      trend: "down",
      icon: GraduationCap,
      title: "Total Teachers",
      route: "/admin/teachers",
    },
    hr: {
      total: 5,
      active: 5,
      activePercentage: 100,
      growth: 8.7,
      trend: "up",
      icon: Building,
      title: "HR Personnel",
      route: "/admin/hr",
    },
  };

  const recentActivities = [
    {
      id: 1,
      type: "admission",
      message: "15 new admission applications received",
      time: "2 hours ago",
      icon: Users,
      color: "bg-blue-500",
    },
    {
      id: 2,
      type: "staff",
      message: "New teacher John Smith joined Mathematics dept",
      time: "4 hours ago",
      icon: UserCheck,
      color: "bg-green-500",
    },
    {
      id: 3,
      type: "system",
      message: "Monthly attendance report generated",
      time: "6 hours ago",
      icon: FileText,
      color: "bg-purple-500",
    },
    {
      id: 4,
      type: "payment",
      message: "₹2,50,000 fees collected today",
      time: "8 hours ago",
      icon: DollarSign,
      color: "bg-emerald-500",
    },
  ];

  const EnhancedStatCard = ({
    title,
    icon: Icon,
    total,
    active,
    activePercentage,
    growth,
    trend,
    route,
  }) => (
    <div className="group relative bg-white rounded-2xl p-6 border border-indigo-100/50 hover:border-indigo-200 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 cursor-pointer overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="relative">
            <div className="p-3 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl shadow-lg shadow-indigo-500/25 group-hover:shadow-indigo-500/40 transition-all duration-300 group-hover:scale-110">
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full animate-pulse" />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-indigo-700 text-sm font-semibold uppercase tracking-wide">{title}</h3>
          
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-indigo-900 group-hover:text-indigo-600 transition-colors">
              {total.toLocaleString()}
            </span>
            <span className="text-sm text-indigo-500 font-medium">total</span>
          </div>
        </div>
      </div>
    </div>
  );

  const MetricCard = ({ icon: Icon, title, value, subtitle, trend, onClick }) => (
    <div 
      onClick={onClick}
      className="group bg-white rounded-2xl p-6 border border-indigo-100/50 hover:border-indigo-200 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 cursor-pointer"
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="p-3 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl shadow-lg shadow-indigo-500/25">
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-indigo-700 uppercase tracking-wide">{title}</h3>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="text-2xl font-bold text-indigo-900">{value}</div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-indigo-500">{subtitle}</span>
          {trend && (
            <span className={`text-xs flex items-center gap-1 ${
              trend.includes('+') ? 'text-emerald-600' : 'text-indigo-500'
            }`}>
              {trend.includes('+') && <ArrowUpRight className="w-3 h-3" />}
              {trend.includes('new') && <Plus className="w-3 h-3" />}
              {trend}
            </span>
          )}
        </div>
      </div>
    </div>
  );

  const ChartCard = ({ title, children, actions }) => (
    <div className="bg-white rounded-2xl p-6 border border-indigo-100/50 shadow-sm hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-indigo-900">{title}</h3>
        {actions && (
          <div className="flex items-center gap-2">
            {actions}
          </div>
        )}
      </div>
      {children}
    </div>
  );

  const TimeframeButton = ({ active, children, onClick }) => (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
        active
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
          : 'text-indigo-600 hover:bg-indigo-50 border border-indigo-200'
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white">
      <div className="p-6 space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-900 to-indigo-600 bg-clip-text text-transparent">
              Dashboard Overview
            </h1>
            <p className="text-indigo-600 font-medium">Welcome back, Admin</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-400" />
              <input
                type="text"
                placeholder="Search anything..."
                className="pl-10 pr-4 py-2.5 text-sm rounded-xl border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent w-64 bg-white/50 backdrop-blur-sm"
              />
            </div>
            
            <button className="relative p-2.5 rounded-xl bg-white border border-indigo-200 text-indigo-600 hover:bg-indigo-50 transition-all duration-200 hover:scale-105">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            </button>
          </div>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <EnhancedStatCard
            title={stats.students.title}
            icon={stats.students.icon}
            total={students.total}
            active={students.active}
            activePercentage={students.activePercentage}
            growth={students.growth}
            trend={students.trend}
            route={stats.students.route}
          />
          <EnhancedStatCard
            title={stats.staff.title}
            icon={stats.staff.icon}
            total={stats.staff.total}
            active={stats.staff.active}
            activePercentage={stats.staff.activePercentage}
            growth={stats.staff.growth}
            trend={stats.staff.trend}
            route={stats.staff.route}
          />
          <EnhancedStatCard
            title={stats.teachers.title}
            icon={stats.teachers.icon}
            total={stats.teachers.total}
            active={stats.teachers.active}
            activePercentage={stats.teachers.activePercentage}
            growth={stats.teachers.growth}
            trend={stats.teachers.trend}
            route={stats.teachers.route}
          />
          <EnhancedStatCard
            title={stats.hr.title}
            icon={stats.hr.icon}
            total={stats.hr.total}
            active={stats.hr.active}
            activePercentage={stats.hr.activePercentage}
            growth={stats.hr.growth}
            trend={stats.hr.trend}
            route={stats.hr.route}
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard
            title="Student Enrollment Trend"
            actions={
              <div className="flex gap-2">
                <TimeframeButton active={selectedTimeframe === 'monthly'} onClick={() => setSelectedTimeframe('monthly')}>
                  Monthly
                </TimeframeButton>
                <TimeframeButton active={selectedTimeframe === 'yearly'} onClick={() => setSelectedTimeframe('yearly')}>
                  Yearly
                </TimeframeButton>
              </div>
            }
          >
            <div className="h-80">
              <Line
                data={{
                  labels: enrollmentData.map(d => d.month),
                  datasets: [
                    {
                      label: 'Students',
                      data: enrollmentData.map(d => d.students),
                      borderColor: '#4f46e5',
                      backgroundColor: 'rgba(79, 70, 229, 0.1)',
                      borderWidth: 3,
                      fill: true,
                      tension: 0.4,
                      pointBackgroundColor: '#4f46e5',
                      pointBorderColor: '#ffffff',
                      pointBorderWidth: 2,
                      pointRadius: 6,
                      pointHoverRadius: 8,
                    },
                    {
                      label: 'Target',
                      data: enrollmentData.map(d => d.target),
                      borderColor: '#94a3b8',
                      backgroundColor: 'transparent',
                      borderWidth: 2,
                      borderDash: [5, 5],
                      fill: false,
                      tension: 0.4,
                      pointBackgroundColor: '#94a3b8',
                      pointBorderColor: '#ffffff',
                      pointBorderWidth: 2,
                      pointRadius: 4,
                      pointHoverRadius: 6,
                    }
                  ]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top',
                      labels: {
                        usePointStyle: true,
                        color: '#4f46e5',
                        font: {
                          weight: 'bold'
                        }
                      }
                    },
                    tooltip: {
                      backgroundColor: 'white',
                      titleColor: '#4f46e5',
                      bodyColor: '#4f46e5',
                      borderColor: '#c7d2fe',
                      borderWidth: 1,
                      cornerRadius: 12,
                      boxShadow: '0 10px 25px -5px rgba(79, 70, 229, 0.1)'
                    }
                  },
                  scales: {
                    x: {
                      grid: {
                        color: '#e0e7ff',
                      },
                      ticks: {
                        color: '#6366f1',
                        font: {
                          weight: 'bold'
                        }
                      }
                    },
                    y: {
                      grid: {
                        color: '#e0e7ff',
                      },
                      ticks: {
                        color: '#6366f1',
                        font: {
                          weight: 'bold'
                        }
                      }
                    }
                  },
                  interaction: {
                    intersect: false,
                    mode: 'index'
                  }
                }}
              />
            </div>
          </ChartCard>

          <ChartCard
            title="Attendance Distribution"
            actions={
              <div className="flex gap-2">
                <TimeframeButton active={true}>This Week</TimeframeButton>
                <TimeframeButton active={false}>This Month</TimeframeButton>
              </div>
            }
          >
            <div className="h-80 flex items-center justify-center">
              <div className="w-80">
                <Doughnut
                  data={{
                    labels: attendanceData.map(d => d.name),
                    datasets: [
                      {
                        data: attendanceData.map(d => d.value),
                        backgroundColor: attendanceData.map(d => d.color),
                        borderColor: '#ffffff',
                        borderWidth: 3,
                        hoverBorderWidth: 4,
                        cutout: '60%',
                      }
                    ]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom',
                        labels: {
                          usePointStyle: true,
                          padding: 20,
                          color: '#4f46e5',
                          font: {
                            weight: 'bold',
                            size: 12
                          }
                        }
                      },
                      tooltip: {
                        backgroundColor: 'white',
                        titleColor: '#4f46e5',
                        bodyColor: '#4f46e5',
                        borderColor: '#c7d2fe',
                        borderWidth: 1,
                        cornerRadius: 12,
                        callbacks: {
                          label: function(context) {
                            return `${context.label}: ${context.parsed}%`;
                          }
                        }
                      }
                    }
                  }}
                />
              </div>
            </div>
          </ChartCard>
        </div>

        {/* Secondary Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            icon={Award}
            title="Attendance Rate"
            value="94.2%"
            subtitle="Overall performance"
            trend="+2.1% from last month"
          />
          
          <MetricCard
            icon={BookOpen}
            title="Active Courses"
            value="127"
            subtitle="Currently running"
            trend="5 new this month"
          />
          
          <MetricCard
            icon={Calendar}
            title="Events Today"
            value="8"
            subtitle="Scheduled activities"
            trend="3 upcoming"
          />
          
          <MetricCard
            icon={DollarSign}
            title="Monthly Revenue"
            value="₹12.5L"
            subtitle="This month"
            trend="+18.2% growth"
          />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;