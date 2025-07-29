'use client';

import { useEffect, useState } from 'react';
import { User, Edit, BookOpen, Settings, Lock, Loader2, MapPin, Users, Phone, PhoneCall, Shield } from 'lucide-react';
import { useSession } from '@/context/SessionContext';

export default function StudentProfilePage() {
  const { user } = useSession();
  console.log(user)
  const studentId = user?.id;

  const [student, setStudent] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [subjects, setSubjects] = useState([]);

  // Loading states
  const [isLoadingStudent, setIsLoadingStudent] = useState(true);
  const [isLoadingSubjects, setIsLoadingSubjects] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  //---------------------------------------------------------------------------------

  const [address, setAddress] = useState(null);
  const [contact, setContact] = useState(null);
  const [family, setFamily] = useState(null);

  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  const [isLoadingContact, setIsLoadingContact] = useState(false);
  const [isLoadingFamily, setIsLoadingFamily] = useState(false);
//------------------------------------------------------------------------------------
  const [admission, setAdmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };
//-------------------------------------------------------------------------------
  const fetchStudent = async () => {
    try {
      setIsLoadingStudent(true);
      const res = await fetch(`/api/students/${user.id}`);
      if (!res.ok) throw new Error('Failed to fetch student data');
      const data = await res.json();
      setStudent(data);
    } catch (err) {
      console.error('[FETCH_STUDENT_ERROR]', err);
    } finally {
      setIsLoadingStudent(false);
    }
  };

  useEffect(() => {
    if (!user?.id) return;
   fetchStudent();
    
  }, [user?.id]);

  //-----------------------------------------------------------------------
  useEffect(() => {
    if (!user?.id) return;

    const fetchSubjects = async () => {
      try {
        setIsLoadingSubjects(true);
        const res = await fetch(`/api/students/${user.id}/academics`);
        const data = await res.json();
        console.log("-------------------" + user)
        const subjectsArray =
          data.academic?.years?.[0]?.divisions?.[0]?.subjects || [];

        setSubjects(subjectsArray);
      } catch (err) {
        console.error('[FETCH_SUBJECTS_ERROR]', err);
      } finally {
        setIsLoadingSubjects(false);
      }
    };

    fetchSubjects();
  }, [user?.id]);

  //-----------------------------------------------------------------------
  useEffect(() => {
    if (!user?.id) return;
    const id = user?.id;
    console.log(user.id)
    // if (!user?.admissionId) return;
    // const id = user?.admissionId;
    //console.log(user.admissionId)
    
    const fetchAdmissionDetails = async () => {
      try {
        const response = await fetch(`/api/students/${id}/admission`);
        //const response = await fetch(`/api/admission/${id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch admission details');
        }
        const data = await response.json();
        console.log('Fetched admission data:', data);
        setAdmission(data.admission);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAdmissionDetails();
  }, [user?.id]);

  //----------------------------------------------------------------------

  const saveProfileChanges = async () => {
    try {
      setIsSaving(true);
      const res = await fetch(`/api/students/${student._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(student),
      });

      if (!res.ok) throw new Error('Failed to update student profile');

      await fetchStudent(); // ✅ Refresh UI with updated data
      setEditMode(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('[UPDATE_PROFILE_ERROR]', error);
      alert('Error updating profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  //-------------------------------------------------------------------------
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith('address.')) {
      const field = name.split('.')[1];
      setStudent((prev) => ({
        ...prev,
        address: {
          ...(prev.address || {}),
          [field]: value,
        },
      }));
    } else {
      setStudent((prev) => ({ ...prev, [name]: value }));
    }
  };



  //----------------------------------------------------------------------------------------
  
  // const id = student.admissionId;
  // const fetchAdmissionDetails = async () => {
  //   try {
  //     const response = await fetch(`/api/admission/${id}`);
  //     if (!response.ok) {
  //       throw new Error('Failed to fetch admission details');
  //     }
  //     const data = await response.json();
  //     setAdmissionData(data);
  //   } catch (err) {
  //     setError(err.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };


  if (loading) return <div>Loading admission details...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!admission) return <div>No admission data found</div>;
  //---------------------------------------------------------------------------------------------------
 // Loading component
  const LoadingSpinner = () => (
    <div className="flex items-center justify-center p-8">
      <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
    </div>
  );

  // Skeleton components
  const SkeletonCard = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div className="space-y-3">
        <div className="h-3 bg-gray-200 rounded"></div>
        <div className="h-3 bg-gray-200 rounded w-5/6"></div>
        <div className="h-3 bg-gray-200 rounded w-4/6"></div>
      </div>
    </div>
  );

  const ProfileSkeleton = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center animate-pulse">
      <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-200"></div>
      <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-1"></div>
      <div className="h-3 bg-gray-200 rounded w-2/3 mx-auto"></div>
    </div>
  );

  // Show loading for initial data
  if (isLoadingStudent && !student.fullName) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Loading Profile</h2>
          <p className="text-gray-600">Please wait while we fetch your information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Student Profile</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
                <User size={40} className="text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">{student.fullName || 'Loading...'}</h2>
              <p className="text-gray-600">{student.email}</p>
              <p className="text-sm text-gray-500 mt-1">Student ID: {student?.studentId}</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <nav className="space-y-1">
                {['personal details', 'address', 'contact', 'family', 'courses'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg text-left transition-colors ${activeTab === tab
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50'
                      }`}
                  >
                    {tab === 'personal details' && <User size={18} />}
                    {tab === 'address' && <MapPin size={18} />}
                    {tab === 'contact' && <Phone size={18} />}
                    {tab === 'family' && <Users size={18} />}
                    {tab === 'courses' && <BookOpen size={18} />}
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">

            {(activeTab === 'profile' || activeTab === 'personal details') && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-800">Personal Information</h2>
                </div>

                {isLoadingStudent ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[...Array(4)].map((_, i) => (
                      <div key={`skeleton-${i}`} className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                        <div className="h-10 bg-gray-100 rounded animate-pulse"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Full Name */}
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-600">Full Name</label>
                      <p className="text-gray-900 font-medium">
                        {student.fullName || <span className="text-gray-400">Not provided</span>}
                      </p>
                    </div>

                    {/* Email */}
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-600">Email</label>
                      <p className="text-gray-900 font-medium">
                        {student.email || <span className="text-gray-400">Not provided</span>}
                      </p>
                    </div>

                    {/* Date of Birth */}
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-600">Date of Birth</label>
                      <p className="text-gray-900 font-medium">
                        {student.dateOfBirth ? (
                          formatDate(student.dateOfBirth)
                        ) : (
                          <span className="text-gray-400">Not provided</span>
                        )}
                      </p>
                    </div>

                     {/* Gender */}
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-600">Gender</label>
                      <p className="text-gray-900 font-medium">
                        {admission?.gender || <span className="text-gray-400">Not provided</span>}
                      </p>
                    </div>

                    {/* Religion */}
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-600">Religion</label>
                      <p className="text-gray-900 font-medium">
                        {admission?.religionAsPerLC || <span className="text-gray-400">Not provided</span>}
                      </p>
                    </div>

                    {/* Caste */}
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-600">Caste</label>
                      <p className="text-gray-900 font-medium">
                        {admission?.casteAsPerLC || <span className="text-gray-400">Not provided</span>}
                      </p>
                    </div>

                    {/* Nationality */}
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-600">Nationality</label>
                      <p className="text-gray-900 font-medium">
                        {admission?.nationality || <span className="text-gray-400">Not provided</span>}
                      </p>
                    </div>

                    {/* Domicile */}
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-600">Domicile</label>
                      <p className="text-gray-900 font-medium">
                        {admission?.domicile || <span className="text-gray-400">Not provided</span>}
                      </p>
                    </div>
                  
                    
                  </div>
                )}
              </div>
            )}

            {activeTab === 'address' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <MapPin className="w-5 h-5 text-blue-600" />
                      </div>
                      <h2 className="text-xl font-bold text-gray-800">Address Information</h2>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {isLoadingStudent ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  ) : student?.address ? (
                    <div className="space-y-6">
                      {/* Full Address Preview */}
                      <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500">
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Complete Address</h3>
                        <p className="text-gray-900 leading-relaxed">
                          {[
                            student.address.addressLine,
                            student.address.city,
                            student.address.state,
                            student.address.pincode,
                            student.address.country
                          ].filter(Boolean).join(', ')}
                        </p>
                      </div>

                      {/* Address Fields */}
                      <dl className="divide-y divide-gray-100">
                        {[
                          { label: 'Address Line', value: student.address.addressLine },
                          { label: 'City', value: student.address.city },
                          { label: 'State', value: student.address.state },
                          { label: 'Pincode', value: student.address.pincode },
                          { label: 'Country', value: student.address.country }
                        ].map(({ label, value }) => (
                          <div key={label} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="flex-1 min-w-0">
                              <dt className="text-sm font-medium text-gray-600 mb-1">{label}</dt>
                              <dd className="text-gray-900 break-words">{value || '-'}</dd>
                            </div>
                          </div>
                        ))}
                      </dl>

                      {/* Quick Actions */}

                    </div>
                  ) : (
                    <div className="text-center py-12">

                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'contact' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Phone className="w-5 h-5 text-green-600" />
                      </div>
                      <h2 className="text-xl font-bold text-gray-800">Contact Details</h2>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {isLoadingStudent ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Contact Fields Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                          { label: 'Phone Number', key: 'mobileNumber', icon: Phone, color: 'blue' },
                          { label: 'Alternate Phone', key: 'alternatePhone', icon: PhoneCall, color: 'purple' },
                          { label: 'Emergency Contact', key: 'emergencyContact', icon: Shield, color: 'red' },
                        ].map(({ label, key, icon: Icon, color }) => (
                          <div key={key} className="space-y-2">
                            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                              <Icon className={`w-4 h-4 text-${color}-600`} />
                              <span>{label}</span>
                            </label>

                            {editMode ? (
                              <input
                                type="text"
                                name={key}
                                value={student[key] || ''}
                                onChange={handleInputChange}
                                placeholder={`Enter ${label.toLowerCase()}`}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                              />
                            ) : (
                              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                <div className="flex-1">
                                  <p className="text-gray-900 font-medium">{student[key] || '-'}</p>
                                </div>

                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'family' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Family Details</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mother's Name</label>
                    <p className="text-base text-gray-900">{admission?.motherName || 'N/A'}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mother's Mobile Number</label>
                    <p className="text-base text-gray-900">{admission?.motherMobileNumber || 'N/A'}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'courses' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-6">Current Courses</h2>

                  {isLoadingSubjects ? (
                    <div className="space-y-3">
                      {Array(3).fill(0).map((_, i) => (
                        <div key={i} className="bg-gray-50 border border-gray-200 rounded-lg p-4 animate-pulse">
                          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      ))}
                    </div>
                  ) : subjects.length > 0 ? (
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