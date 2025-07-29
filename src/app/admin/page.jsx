"use client"

import React, { useState, useEffect } from 'react';
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
  Icon
} from 'lucide-react';
import { useSession } from '@/context/SessionContext';
import { useRouter } from 'next/navigation';

const AdminDashboard = () => {
  const { user, refreshSession } = useSession();
  const [students, setStudents] = useState([]);
  const router = useRouter();
  
 const fetchStudents = async () => {
    try { 
      const res = await fetch("/api/students");
      console.log(res);
      if (!res.ok) {
        throw new Error('Failed To Fetch Students');
      } 
      let data = await res.json();
      console.log(data);
      setStudents(data.data);
    } catch(err) {
      console.log(err); 
    }
  };

  useEffect(() => {
    refreshSession();
    fetchStudents();
  }, []);

  console.log(students);

  
  // const stats = {
  //   students: { total: 3000, active: 2847, growth: 12.5, trend: 'up', route: '/admin/students' },
  //   staff: { total: 300, active: 287, growth: 5.2, trend: 'up', route: '/admin/staff' },
  //   teachers: { total: 30, active: 28, growth: -2.1, trend: 'down', route: '/admin/teachers' },
  //   hr: { total: 30, active: 29, growth: 8.7, trend: 'up', route: '/admin/hr' }
  // };

  const recentActivities = [
    { id: 1, type: 'admission', message: '15 new admission applications received', time: '2 hours ago', route: '/admin/admissions' },
    { id: 2, type: 'staff', message: 'New teacher John Smith joined Mathematics dept', time: '4 hours ago', route: '/admin/staff' },
    { id: 3, type: 'system', message: 'Monthly attendance report generated', time: '6 hours ago', route: '/admin/reports' },
    { id: 4, type: 'payment', message: '₹2,50,000 fees collected today', time: '8 hours ago', route: '/admin/finance' }
  ];

  const quickActions = [
    { icon: Plus, label: 'Add Department', route: '/admin/academic-configuration' },
    { icon: UserCheck, label: 'Add Staff', route: '/admin/manage-users' },
    { icon: Calendar, label: 'Schedule', route: '/admin' },
    { icon: Download, label: 'Reports', route: '/admin' }
  ];

  const StatCard = ({ title, icon: Icon, total, active, growth, trend, route }) => (
    <div 
      onClick={() => router.push(route)}
      className="bg-white rounded-xl p-6 border border-indigo-50 hover:shadow-md transition-all duration-200 group cursor-pointer"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-indigo-50 rounded-lg group-hover:bg-indigo-100 transition-colors duration-200">
          <Icon className="w-5 h-5 text-indigo-600" />
        </div>
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${trend === 'up' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
          {trend === 'up' ? (
            <span className="flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" /> +{growth}%
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <ArrowDownRight className="w-3 h-3" /> {growth}%
            </span>
          )}
        </span>
      </div>
      
      <div className="space-y-3">
        {/* <h3 className="text-indigo-900/70 text-sm font-medium">{title}</h3> */}
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-semibold text-indigo-900">{students.length}</span>
          <span className="text-sm text-indigo-500">total</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-1 bg-indigo-50 rounded-full h-1.5">
            <div 
              className="h-1.5 rounded-full bg-indigo-600 transition-all duration-300"
              style={{ width: `${(active / total) * 100}%` }}
            ></div>
          </div>
          <span className="text-xs text-indigo-600">{ ""} active</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-indigo-50/30">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-indigo-900">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-400" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-10 pr-4 py-2 text-sm rounded-lg border border-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-transparent"
              />
            </div>
            <button className="p-2 rounded-lg bg-white border border-indigo-100 text-indigo-600 hover:bg-indigo-50">
              <Bell className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard 
            title="Total Students" 
            icon={Users} 
            total={students.length}
            active={students.active}
            // growth={stats.students.growth}
            // trend={stats.students.trend}
            // route={stats.students.route}
          />
          <StatCard 
            title="Total Staff" 
            icon={UserCheck} 
            // total={stats.staff.total}
            // active={stats.staff.active}
            // growth={stats.staff.growth}
            // trend={stats.staff.trend}
            // route={stats.staff.route}
          />
          <StatCard 
            title="Total Teachers" 
            icon={GraduationCap} 
            // total={stats.teachers.total}
            // active={stats.teachers.active}
            // growth={stats.teachers.growth}
            // trend={stats.teachers.trend}
            // route={stats.teachers.route}
          />
          <StatCard 
            title="HR Personnel" 
            icon={Building} 
            // total={stats.hr.total}
            // active={stats.hr.active}
            // growth={stats.hr.growth}
            // trend={stats.hr.trend}
            // route={stats.hr.route}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl p-6 border border-indigo-50">
            <h3 className="text-lg font-medium text-indigo-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => router.push(action.route)}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl border border-indigo-50 hover:bg-indigo-50 hover:border-indigo-100 transition-all duration-200 cursor-pointer"
                >
                  <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600">
                    <action.icon className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-medium text-indigo-800">{action.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Recent Activities */}
          <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-indigo-50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-indigo-900">Recent Activities</h3>
              <button 
                onClick={() => router.push('/admin/activities')}
                className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center gap-1 cursor-pointer"
              >
                View All <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-3">
              {recentActivities.map((activity) => (
                <div 
                  key={activity.id} 
                  onClick={() => router.push(activity.route)}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-indigo-50 transition-colors border border-indigo-50 cursor-pointer"
                >
                  <div className={`p-2 rounded-lg mt-0.5 ${
                    activity.type === 'admission' ? 'bg-blue-50 text-blue-600' :
                    activity.type === 'staff' ? 'bg-purple-50 text-purple-600' :
                    activity.type === 'system' ? 'bg-indigo-50 text-indigo-600' :
                    'bg-green-50 text-green-600'
                  }`}>
                    {activity.type === 'admission' ? <BookOpen className="w-4 h-4" /> :
                    activity.type === 'staff' ? <UserCheck className="w-4 h-4" /> :
                    activity.type === 'system' ? <Activity className="w-4 h-4" /> :
                    <DollarSign className="w-4 h-4" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-indigo-900 font-medium">{activity.message}</p>
                    <p className="text-xs text-indigo-500 mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <div 
            onClick={() => router.push('/admin/attendance')}
            className="bg-white rounded-xl p-6 border border-indigo-50 hover:shadow-sm transition-all cursor-pointer"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-indigo-50 rounded-lg">
                <Award className="w-5 h-5 text-indigo-600" />
              </div>
              <span className="text-sm font-medium text-indigo-700">Attendance Rate</span>
            </div>
            <div className="text-2xl font-semibold text-indigo-900">94.2%</div>
            <div className="text-xs text-green-600 mt-1 flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" />
              +2.1% from last month
            </div>
          </div>

          <div 
            onClick={() => router.push('/admin/courses')}
            className="bg-white rounded-xl p-6 border border-indigo-50 hover:shadow-sm transition-all cursor-pointer"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-indigo-50 rounded-lg">
                <BookOpen className="w-5 h-5 text-indigo-600" />
              </div>
              <span className="text-sm font-medium text-indigo-700">Active Courses</span>
            </div>
            <div className="text-2xl font-semibold text-indigo-900">127</div>
            <div className="text-xs text-indigo-500 mt-1 flex items-center gap-1">
              <Plus className="w-3 h-3" />
              5 new this month
            </div>
          </div>

          <div 
            onClick={() => router.push('/admin/events')}
            className="bg-white rounded-xl p-6 border border-indigo-50 hover:shadow-sm transition-all cursor-pointer"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-indigo-50 rounded-lg">
                <Calendar className="w-5 h-5 text-indigo-600" />
              </div>
              <span className="text-sm font-medium text-indigo-700">Events Today</span>
            </div>
            <div className="text-2xl font-semibold text-indigo-900">8</div>
            <div className="text-xs text-indigo-500 mt-1">3 upcoming</div>
          </div>

          <div 
            onClick={() => router.push('/admin/finance')}
            className="bg-white rounded-xl p-6 border border-indigo-50 hover:shadow-sm transition-all cursor-pointer"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-indigo-50 rounded-lg">
                <DollarSign className="w-5 h-5 text-indigo-600" />
              </div>
              <span className="text-sm font-medium text-indigo-700">Revenue</span>
            </div>
            <div className="text-2xl font-semibold text-indigo-900">₹12.5L</div>
            <div className="text-xs text-indigo-500 mt-1">This month</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
