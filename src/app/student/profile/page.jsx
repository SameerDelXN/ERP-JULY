'use client';

import { useEffect, useState } from 'react';
import { User, Edit, BookOpen, Settings, Lock } from 'lucide-react';

export default function StudentProfilePage() {
  const [student, setStudent] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [subjects, setSubjects] = useState([]);

  // Temporary: Replace with actual dynamic student ID logic
  const studentId = '686cd25835e2bb6cdeda5ea2'; // e.g., from session, cookie, or router

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await fetch(`/api/students/${studentId}`);

        if (!res.ok) throw new Error('Failed to fetch student data');
        const data = await res.json();
        setStudent(data);
      } catch (err) {
        console.error('[FETCH_ERROR]', err);
      }
    };

    fetchStudent();
  }, [studentId]);
  //-----------------------------------------------------------------------
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await fetch(`/api/students/${studentId}/academics`);
        const data = await res.json();

        const subjectsArray =
          data.academic?.years?.[0]?.divisions?.[0]?.subjects || [];

        setSubjects(subjectsArray);
      } catch (err) {
        console.error('[FETCH_SUBJECTS_ERROR]', err);
      }
    };

    if (studentId) fetchSubjects();
  }, [studentId]);

  //-----------------------------------------------------------------------
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith('address.')) {
      const field = name.split('.')[1];
      setStudent((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [field]: value,
        },
      }));
    } else {
      setStudent((prev) => ({ ...prev, [name]: value }));
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
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
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
                <User size={40} className="text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">{student.fullName || 'Loading...'}</h2>
              <p className="text-gray-600">{student.major}</p>
              <p className="text-sm text-gray-500 mt-1">Student ID: {student.studentId}</p>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Enrolled Since</span>
                  <span>{student.enrollmentDate || '-'}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Degree Progress: 75%</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <nav className="space-y-1">
                {['profile', 'courses', 'settings'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg text-left transition-colors ${activeTab === tab
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50'
                      }`}
                  >
                    {tab === 'profile' && <User size={18} />}
                    {tab === 'courses' && <BookOpen size={18} />}
                    {tab === 'settings' && <Settings size={18} />}
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {activeTab === 'profile' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Personal Information</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    ['Full Name', 'fullName'],
                    ['Email', 'email'],
                    ['Phone Number', 'mobileNumber'],
                    ['Date of Birth', 'dateOfBirth'],
                    ['Address', 'address'],
                    ['Emergency Contact', 'emergencyContact'],
                  ].map(([label, key]) => (
                    <div key={key} className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">{label}</label>

                      {editMode ? (
                        <input
                          type={key === 'email' ? 'email' : key === 'dateOfBirth' ? 'date' : 'text'}
                          name={key}
                          value={
                            key === 'address'
                              ? student.address?.addressLine || ''
                              : student[key] || ''
                          }
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      ) : (
                        key === 'address' ? (
                          <p className="text-gray-900">
                            {student.address
                              ? `${student.address.addressLine}, ${student.address.city}, ${student.address.state} - ${student.address.pincode}, ${student.address.country}`
                              : '-'}
                          </p>
                        ) : key === 'dateOfBirth' ? (
                          <p className="text-gray-900">
                            {student.dateOfBirth
                              ? (() => {
                                const date = new Date(student.dateOfBirth);
                                const day = String(date.getDate()).padStart(2, '0');
                                const month = String(date.getMonth() + 1).padStart(2, '0');
                                const year = date.getFullYear();
                                return `${day}-${month}-${year}`;
                              })()
                              : '-'}
                          </p>
                        ) : (
                          <p className="text-gray-900">{student[key]}</p>
                        )
                      )}
                    </div>
                  ))}

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
                      onClick={() => {
                        // 🔄 You can trigger PUT API here for updates
                        setEditMode(false);
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Save Changes
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* {activeTab === 'courses' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-6">Current Courses</h2>
                  <div>No courses available</div>
                </div>
              </div>
            )} */}

            {activeTab === 'courses' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-6">Current Courses</h2>

                  {subjects.length > 0 ? (
                    <ul className="space-y-3">
                      {subjects.map((subject, idx) => (
                        <li
                          key={idx}
                          className="bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-sm"
                        >
                          <p className="text-gray-800 font-semibold">
                            {subject.name || 'Unnamed Subject'}
                          </p>
                          {subject.teacher && (
                            <p className="text-sm text-gray-600 mt-1">
                              Teacher: {subject.teacherName || 'Not Assigned'}
                            </p>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">No subjects found for your department and year.</p>
                  )}
                </div>
              </div>
            )}


            {activeTab === 'settings' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Account Settings</h2>
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

