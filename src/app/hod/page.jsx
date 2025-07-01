"use client";
import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserCheck, 
  GraduationCap, 
  BookOpen,
  Clock,
  Calendar,
  TrendingUp, 
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Download,
  Activity,
  Award,
  BarChart2,
  Clipboard,
  Bookmark
} from 'lucide-react';
import { useSession } from '@/context/SessionContext';

const HodDashboard = () => {
  const { user, refreshSession } = useSession();
  const [timeframe, setTimeframe] = useState('monthly');
  const [departmentData, setDepartmentData] = useState(null);
  
  useEffect(() => {
    refreshSession();
    // Simulate fetching department data - replace with actual API call
    const fetchDepartmentData = async () => {
      // In a real app, you would fetch this data from your API
      const mockData = {
        department: "Computer Science",
        year: "2023-2024",
        divisions: [
          {
            name: "A",
            students: 48,
            subjects: 6,
            teachers: 8
          },
          {
            name: "B",
            students: 45,
            subjects: 6,
            teachers: 8
          }
        ],
        totalStudents: 93,
        totalTeachers: 8,
        attendanceRate: 92.5,
        upcomingExams: 3,
        recentActivities: [
          { id: 1, type: 'attendance', message: 'Submitted attendance for OOPs - Div A', time: '1 hour ago' },
          { id: 2, type: 'exam', message: 'Mid-term exam scheduled for DBMS', time: '3 hours ago' },
          { id: 3, type: 'timetable', message: 'Updated timetable for Div B', time: '5 hours ago' },
          { id: 4, type: 'meeting', message: 'Department meeting scheduled', time: '1 day ago' }
        ]
      };
      setDepartmentData(mockData);
    };
    
    fetchDepartmentData();
  }, []);

  const quickActions = [
    { icon: Plus, label: 'Add Student' },
    { icon: BookOpen, label: 'Add Subject' },
    { icon: Calendar, label: 'Schedule Exam' },
    { icon: Download, label: 'Generate Report' }
  ];

  const StatCard = ({ title, icon: Icon, value, change, trend }) => (
    <div className="bg-white rounded-lg p-6 border border-gray-100 hover:shadow-sm transition-all duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-gray-100 rounded-lg">
          <Icon className="w-5 h-5 text-gray-600" />
        </div>
        {change && (
          <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
            trend === 'up' 
              ? 'bg-green-50 text-green-700' 
              : 'bg-red-50 text-red-700'
          }`}>
            {trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {Math.abs(change)}%
          </div>
        )}
      </div>
      
      <div className="space-y-3">
        <h3 className="text-gray-600 text-sm font-medium">{title}</h3>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-semibold text-gray-900">{value}</span>
        </div>
      </div>
    </div>
  );

  if (!departmentData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Loading department data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Department Overview</h2>
            <p className="text-gray-600 text-sm mt-1">
              {departmentData.department} Department • Academic Year: {departmentData.year}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <select 
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
            
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard 
            title="Total Students" 
            icon={Users} 
            value={departmentData.totalStudents}
            change={2.5}
            trend="up"
          />
          <StatCard 
            title="Total Teachers" 
            icon={GraduationCap} 
            value={departmentData.totalTeachers}
          />
          <StatCard 
            title="Attendance Rate" 
            icon={UserCheck} 
            value={`${departmentData.attendanceRate}%`}
            change={1.2}
            trend="up"
          />
          <StatCard 
            title="Upcoming Exams" 
            icon={Bookmark} 
            value={departmentData.upcomingExams}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-lg p-6 border border-gray-100">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  className="flex flex-col items-center gap-2 p-4 rounded-lg border border-gray-100 hover:bg-gray-50 hover:border-gray-200 transition-all duration-200"
                >
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <action.icon className="w-4 h-4 text-gray-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{action.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Recent Activities */}
          <div className="lg:col-span-2 bg-white rounded-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Recent Activities</h3>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">View All</button>
            </div>
            
            <div className="space-y-3">
              {departmentData.recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="p-2 bg-gray-100 rounded-lg mt-0.5">
                    {activity.type === 'attendance' ? <Clipboard className="w-4 h-4 text-gray-600" /> :
                     activity.type === 'exam' ? <BookOpen className="w-4 h-4 text-gray-600" /> :
                     activity.type === 'timetable' ? <Calendar className="w-4 h-4 text-gray-600" /> :
                     <Activity className="w-4 h-4 text-gray-600" />}
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

        {/* Divisions Overview */}
        <div className="mt-6 bg-white rounded-lg p-6 border border-gray-100">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Divisions Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {departmentData.divisions.map((division, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-all">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">Division {division.name}</h4>
                  <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {division.students} Students
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <BookOpen className="w-4 h-4 text-gray-500" />
                    {division.subjects} Subjects
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <UserCheck className="w-4 h-4 text-gray-500" />
                    {division.teachers} Teachers
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Attendance Rate</span>
                    <span className="font-medium text-green-600">92%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 mt-1">
                    <div 
                      className="h-2 rounded-full bg-green-500" 
                      style={{ width: '92%' }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          <div className="bg-white rounded-lg p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <BarChart2 className="w-4 h-4 text-gray-600" />
              </div>
              <span className="text-sm font-medium text-gray-600">Subject Performance</span>
            </div>
            <div className="space-y-4">
              {['OOPs', 'DBMS', 'Algorithms', 'Networks'].map((subject, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-700">{subject}</span>
                    <span className="font-medium">78%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div 
                      className="h-1.5 rounded-full bg-blue-600" 
                      style={{ width: `${78}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Award className="w-4 h-4 text-gray-600" />
              </div>
              <span className="text-sm font-medium text-gray-600">Top Students</span>
            </div>
            <div className="space-y-3">
              {[
                { name: 'Rahul Sharma', score: '98%' },
                { name: 'Priya Patel', score: '96%' },
                { name: 'Amit Kumar', score: '95%' },
                { name: 'Neha Gupta', score: '94%' }
              ].map((student, i) => (
                <div key={i} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                  <span className="text-sm font-medium text-gray-700">{student.name}</span>
                  <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                    {student.score}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Calendar className="w-4 h-4 text-gray-600" />
              </div>
              <span className="text-sm font-medium text-gray-600">Upcoming Events</span>
            </div>
            <div className="space-y-3">
              {[
                { title: 'Mid-term Exams', date: 'Jun 15-20', type: 'exam' },
                { title: 'Faculty Meeting', date: 'Jun 18', type: 'meeting' },
                { title: 'Project Submission', date: 'Jun 25', type: 'deadline' },
                { title: 'Guest Lecture', date: 'Jun 28', type: 'event' }
              ].map((event, i) => (
                <div key={i} className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded">
                  <div className="p-1.5 bg-gray-100 rounded mt-0.5">
                    <Calendar className="w-3.5 h-3.5 text-gray-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">{event.title}</p>
                    <p className="text-xs text-gray-500">{event.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HodDashboard;