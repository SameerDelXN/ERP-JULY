"use client"
import React, { useState } from 'react';
import { 
  Users, 
  BookOpen, 
  Calendar, 
  FileText, 
  TrendingUp, 
  Bell, 
  Settings,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Award,
  Clock,
  CheckCircle
} from 'lucide-react';

const TeacherDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [students, setStudents] = useState([
    { id: 1, name: 'Alice Johnson', grade: 'A', attendance: 95, lastActive: '2 hours ago' },
    { id: 2, name: 'Bob Smith', grade: 'B+', attendance: 88, lastActive: '1 day ago' },
    { id: 3, name: 'Carol Williams', grade: 'A-', attendance: 92, lastActive: '3 hours ago' },
    { id: 4, name: 'David Brown', grade: 'B', attendance: 85, lastActive: '5 hours ago' },
    { id: 5, name: 'Eva Davis', grade: 'A+', attendance: 98, lastActive: '1 hour ago' }
  ]);

  const [assignments, setAssignments] = useState([
    { id: 1, title: 'Math Quiz Chapter 5', dueDate: '2024-03-15', submitted: 18, total: 25, status: 'active' },
    { id: 2, title: 'Science Project', dueDate: '2024-03-20', submitted: 12, total: 25, status: 'active' },
    { id: 3, title: 'History Essay', dueDate: '2024-03-10', submitted: 25, total: 25, status: 'completed' },
    { id: 4, title: 'Literature Review', dueDate: '2024-03-25', submitted: 5, total: 25, status: 'active' }
  ]);

  const [classes, setClasses] = useState([
    { id: 1, name: 'Mathematics 101', students: 25, nextClass: 'Today 10:00 AM' },
    { id: 2, name: 'Science Advanced', students: 20, nextClass: 'Today 2:00 PM' },
    { id: 3, name: 'History Modern', students: 28, nextClass: 'Tomorrow 9:00 AM' }
  ]);

  const StatCard = ({ title, value, icon: Icon, color, trend }) => (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4" style={{ borderLeftColor: color }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {trend && <p className="text-sm text-green-600 mt-1">↗ {trend}</p>}
        </div>
        <Icon className="h-8 w-8" style={{ color }} />
      </div>
    </div>
  );

  const OverviewTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Students" 
          value="73" 
          icon={Users} 
          color="#3B82F6" 
          trend="+3 this week" 
        />
        <StatCard 
          title="Active Classes" 
          value="3" 
          icon={BookOpen} 
          color="#10B981" 
        />
        <StatCard 
          title="Pending Assignments" 
          value="12" 
          icon={FileText} 
          color="#F59E0B" 
        />
        <StatCard 
          title="Average Grade" 
          value="B+" 
          icon={Award} 
          color="#8B5CF6" 
          trend="+0.2 this month" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {[
              { action: 'Alice Johnson submitted Math Quiz', time: '2 hours ago' },
              { action: 'New assignment posted to Science Advanced', time: '4 hours ago' },
              { action: 'Bob Smith requested grade review', time: '1 day ago' },
              { action: 'History essay grades published', time: '2 days ago' }
            ].map((activity, idx) => (
              <div key={idx} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Clock className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">{activity.action}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Upcoming Classes</h3>
          <div className="space-y-3">
            {classes.map((cls) => (
              <div key={cls.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <p className="font-medium">{cls.name}</p>
                  <p className="text-sm text-gray-600">{cls.students} students</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-blue-600">{cls.nextClass}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );


  const AssignmentsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Assignments</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Create Assignment</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assignments.map((assignment) => (
          <div key={assignment.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">{assignment.title}</h3>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                assignment.status === 'completed' ? 'bg-green-100 text-green-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {assignment.status}
              </span>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Due Date:</span>
                <span className="text-sm font-medium">{assignment.dueDate}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Submitted:</span>
                <span className="text-sm font-medium">{assignment.submitted}/{assignment.total}</span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${(assignment.submitted / assignment.total) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="flex space-x-2 mt-4">
              <button className="flex-1 bg-blue-100 text-blue-600 py-2 px-3 rounded-lg hover:bg-blue-200 text-sm">
                View Details
              </button>
              <button className="flex-1 bg-gray-100 text-gray-600 py-2 px-3 rounded-lg hover:bg-gray-200 text-sm">
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'assignments', label: 'Assignments', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-gray-100">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <nav className="flex space-x-8 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>

        {/* Tab Content */}
        <div>
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'assignments' && <AssignmentsTab />}
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;