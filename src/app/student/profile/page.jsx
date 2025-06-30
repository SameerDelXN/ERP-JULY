"use client"

import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  Calendar,
  BookOpen,
  GraduationCap,
  Edit,
  Settings,
  CreditCard,
  Lock,
  LogOut
} from 'lucide-react';

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [editMode, setEditMode] = useState(false);

  // Sample student data
  const [student, setStudent] = useState({
    name: 'Alex Johnson',
    email: 'alex.johnson@university.edu',
    phone: '+1 (555) 123-4567',
    dob: '1998-05-15',
    studentId: 'STU20230045',
    major: 'Computer Science',
    enrollmentDate: '2021-09-01',
    address: '123 University Ave, Campus Town',
    emergencyContact: 'Maria Johnson (Mother) - +1 (555) 987-6543'
  });

  const courses = [
    { code: 'CS-401', name: 'Advanced Algorithms', progress: 85 },
    { code: 'CS-402', name: 'Database Systems', progress: 72 },
    { code: 'MATH-310', name: 'Discrete Mathematics', progress: 90 },
    { code: 'ENG-205', name: 'Technical Writing', progress: 68 }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStudent(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Student Profile</h1>
          <button 
            onClick={() => setEditMode(!editMode)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Edit size={16} />
            {editMode ? 'Save Changes' : 'Edit Profile'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Profile Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
                <User size={40} className="text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">{student.name}</h2>
              <p className="text-gray-600">{student.major}</p>
              <p className="text-sm text-gray-500 mt-1">Student ID: {student.studentId}</p>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Enrolled Since</span>
                  <span>{student.enrollmentDate}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: '75%' }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Degree Progress: 75%</p>
              </div>
            </div>

            {/* Navigation */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg text-left transition-colors ${activeTab === 'profile' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <User size={18} />
                  Profile
                </button>
                <button
                  onClick={() => setActiveTab('courses')}
                  className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg text-left transition-colors ${activeTab === 'courses' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <BookOpen size={18} />
                  My Courses
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg text-left transition-colors ${activeTab === 'settings' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <Settings size={18} />
                  Account Settings
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {activeTab === 'profile' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Personal Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Full Name</label>
                    {editMode ? (
                      <input
                        type="text"
                        name="name"
                        value={student.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">{student.name}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    {editMode ? (
                      <input
                        type="email"
                        name="email"
                        value={student.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    ) : (
                      <div className="flex items-center gap-2 text-gray-900">
                        <Mail size={16} className="text-gray-500" />
                        {student.email}
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Phone Number</label>
                    {editMode ? (
                      <input
                        type="tel"
                        name="phone"
                        value={student.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    ) : (
                      <div className="flex items-center gap-2 text-gray-900">
                        <Phone size={16} className="text-gray-500" />
                        {student.phone}
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Date of Birth</label>
                    {editMode ? (
                      <input
                        type="date"
                        name="dob"
                        value={student.dob}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    ) : (
                      <div className="flex items-center gap-2 text-gray-900">
                        <Calendar size={16} className="text-gray-500" />
                        {student.dob}
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Address</label>
                    {editMode ? (
                      <input
                        type="text"
                        name="address"
                        value={student.address}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">{student.address}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Emergency Contact</label>
                    {editMode ? (
                      <input
                        type="text"
                        name="emergencyContact"
                        value={student.emergencyContact}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">{student.emergencyContact}</p>
                    )}
                  </div>
                </div>

                {editMode && (
                  <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
                    <button
                      onClick={() => setEditMode(false)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => setEditMode(false)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Save Changes
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'courses' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-6">Current Courses</h2>
                  
                  <div className="space-y-4">
                    {courses.map((course, index) => (
                      <div key={index} className="p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-medium text-gray-800">{course.name}</h3>
                            <p className="text-sm text-gray-500">{course.code}</p>
                          </div>
                          <span className="text-sm font-medium text-blue-600">{course.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              course.progress > 80 ? 'bg-green-500' :
                              course.progress > 60 ? 'bg-blue-500' : 'bg-yellow-500'
                            }`}
                            style={{ width: `${course.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-6">Academic Progress</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium text-gray-800">GPA</h3>
                        <GraduationCap size={20} className="text-blue-600" />
                      </div>
                      <p className="text-3xl font-bold text-gray-900 mt-2">3.72</p>
                      <p className="text-sm text-gray-600 mt-1">Out of 4.0 scale</p>
                    </div>

                    <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium text-gray-800">Credits Earned</h3>
                        <BookOpen size={20} className="text-green-600" />
                      </div>
                      <p className="text-3xl font-bold text-gray-900 mt-2">96</p>
                      <p className="text-sm text-gray-600 mt-1">Out of 128 required</p>
                    </div>

                    <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium text-gray-800">Expected Graduation</h3>
                        <Calendar size={20} className="text-purple-600" />
                      </div>
                      <p className="text-3xl font-bold text-gray-900 mt-2">May 2024</p>
                      <p className="text-sm text-gray-600 mt-1">2 semesters remaining</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Account Settings</h2>
                
                <div className="space-y-6">
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <Lock size={20} className="text-gray-600" />
                      <h3 className="font-medium text-gray-800">Change Password</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">Update your account password</p>
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                      Change Password
                    </button>
                  </div>

                  
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;