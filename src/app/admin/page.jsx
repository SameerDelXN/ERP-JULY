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
  DollarSign
} from 'lucide-react';

const AdminDashboard = () => {
  const [timeframe, setTimeframe] = useState('monthly');
  // const [notifications, setNotifications] = useState(3);
  
  const stats = {
    students: { total: 3000, active: 2847, growth: 12.5, trend: 'up' },
    staff: { total: 300, active: 287, growth: 5.2, trend: 'up' },
    teachers: { total: 30, active: 28, growth: -2.1, trend: 'down' },
    hr: { total: 30, active: 29, growth: 8.7, trend: 'up' }
  };

  const recentActivities = [
    { id: 1, type: 'admission', message: '15 new admission applications received', time: '2 hours ago' },
    { id: 2, type: 'staff', message: 'New teacher John Smith joined Mathematics dept', time: '4 hours ago' },
    { id: 3, type: 'system', message: 'Monthly attendance report generated', time: '6 hours ago' },
    { id: 4, type: 'payment', message: '₹2,50,000 fees collected today', time: '8 hours ago' }
  ];

  const quickActions = [
    { icon: Plus, label: 'Add Student', color: 'bg-blue-500' },
    { icon: UserCheck, label: 'Add Staff', color: 'bg-green-500' },
    { icon: Calendar, label: 'Schedule', color: 'bg-purple-500' },
    { icon: Download, label: 'Reports', color: 'bg-orange-500' }
  ];

  const StatCard = ({ title, icon: Icon, total, active, growth, trend, color }) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${color} bg-opacity-10`}>
          <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
        </div>
        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
          trend === 'up' 
            ? 'bg-green-100 text-green-700' 
            : 'bg-red-100 text-red-700'
        }`}>
          {trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {Math.abs(growth)}%
        </div>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-gray-600 text-sm font-medium">{title}</h3>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-gray-900">{total.toLocaleString()}</span>
          <span className="text-sm text-gray-500">total</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${color} transition-all duration-500`}
              style={{ width: `${(active / total) * 100}%` }}
            ></div>
          </div>
          <span className="text-sm font-medium text-gray-700">{active} active</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="p-6">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Overview</h2>
            <p className="text-gray-600 mt-1">Welcome back! Here's what's happening at your institution.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <select 
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="px-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
            
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Total Students" 
            icon={Users} 
            total={stats.students.total}
            active={stats.students.active}
            growth={stats.students.growth}
            trend={stats.students.trend}
            color="bg-blue-500"
          />
          <StatCard 
            title="Total Staff" 
            icon={UserCheck} 
            total={stats.staff.total}
            active={stats.staff.active}
            growth={stats.staff.growth}
            trend={stats.staff.trend}
            color="bg-green-500"
          />
          <StatCard 
            title="Total Teachers" 
            icon={GraduationCap} 
            total={stats.teachers.total}
            active={stats.teachers.active}
            growth={stats.teachers.growth}
            trend={stats.teachers.trend}
            color="bg-purple-500"
          />
          <StatCard 
            title="HR Personnel" 
            icon={Building} 
            total={stats.hr.total}
            active={stats.hr.active}
            growth={stats.hr.growth}
            trend={stats.hr.trend}
            color="bg-orange-500"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-gray-50 transition-colors group"
                >
                  <div className={`p-3 rounded-xl ${action.color} group-hover:scale-110 transition-transform`}>
                    <action.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{action.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Recent Activities */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">View All</button>
            </div>
            
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className={`p-2 rounded-lg ${
                    activity.type === 'admission' ? 'bg-blue-100 text-blue-600' :
                    activity.type === 'staff' ? 'bg-green-100 text-green-600' :
                    activity.type === 'system' ? 'bg-purple-100 text-purple-600' :
                    'bg-orange-100 text-orange-600'
                  }`}>
                    {activity.type === 'admission' ? <BookOpen className="w-4 h-4" /> :
                     activity.type === 'staff' ? <UserCheck className="w-4 h-4" /> :
                     activity.type === 'system' ? <Activity className="w-4 h-4" /> :
                     <DollarSign className="w-4 h-4" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 font-medium">{activity.message}</p>
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <Award className="w-5 h-5 text-emerald-600" />
              </div>
              <span className="text-sm font-medium text-gray-600">Attendance Rate</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">94.2%</div>
            <div className="text-xs text-emerald-600 mt-1">+2.1% from last month</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-gray-600">Active Courses</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">127</div>
            <div className="text-xs text-blue-600 mt-1">5 new this month</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>
              <span className="text-sm font-medium text-gray-600">Events Today</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">8</div>
            <div className="text-xs text-purple-600 mt-1">3 upcoming</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <DollarSign className="w-5 h-5 text-orange-600" />
              </div>
              <span className="text-sm font-medium text-gray-600">Revenue</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">₹12.5L</div>
            <div className="text-xs text-orange-600 mt-1">This month</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;