"use client";
import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Calendar,
  FileText,
  Plus,
  Download,
  Search,
  Edit,
  Trash2,
  ChevronDown,
  ChevronRight,
  Users,
  Clipboard
} from 'lucide-react';
import { useSession } from '@/context/SessionContext';

const AcademicManagement = () => {
  const { user } = useSession();
  const [activeTab, setActiveTab] = useState('courses');
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [divisions, setDivisions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);

  // Fetch academic data from API
  useEffect(() => {
    const fetchAcademicData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!user?.id) return;

        // Fetch academic data for HOD's department
        const response = await fetch(`/api/hod/${user.id}/academics`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch academic data');
        }

        const data = await response.json();
        
        // Transform API data to match our frontend structure
        const transformedYears = data.academics.map(academic => ({
          academicId: academic._id,
          yearNumber: parseInt(academic.year) || 1,
          yearLabel: `${academic.year} Year`,
          divisions: academic.divisions.map(division => ({
            name: division.name,
            students: division.students.length,
            subjects: division.subjects.map(subject => ({
              name: subject.name,
              teacher: subject.teacher
            })),
            timetable: division.timetable,
            exams: division.exams
          }))
        }));

        setYears(transformedYears);
      } catch (err) {
        console.error("Failed to fetch academic data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAcademicData();
  }, [user?.id]);

  const handleSelectYear = (year) => {
    setSelectedYear(year);
    setDivisions(year.divisions);
  };

  // Add a new division to the selected year
  const handleAddDivision = async () => {
    try {
      if (!selectedYear) return;
      
      const newDivision = {
        name: `Division ${String.fromCharCode(65 + divisions.length)}`, // A, B, C, etc.
        students: 0,
        subjects: [],
        timetable: [],
        exams: []
      };

      // Prepare the update payload
      const updatePayload = {
        academicId: selectedYear.academicId,
        divisionUpdates: [
          ...divisions.map(div => ({
            name: div.name,
            subjects: div.subjects,
            timetable: div.timetable,
            exams: div.exams,
            students: div.students
          })),
          newDivision
        ]
      };

      // Send PUT request to update academic record
      const response = await fetch(`/api/hod/${user.id}/academics`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatePayload)
      });

      if (!response.ok) {
        throw new Error('Failed to add division');
      }

      // Refresh the data
      const updatedYear = {
        ...selectedYear,
        divisions: [...selectedYear.divisions, newDivision]
      };
      
      setSelectedYear(updatedYear);
      setDivisions(updatedYear.divisions);
      
    } catch (err) {
      console.error("Failed to add division:", err);
      setError(err.message);
    }
  };

  // Add a new subject to a division
  const handleAddSubject = async (divisionName) => {
    try {
      if (!selectedYear) return;
      
      const newSubject = {
        name: "New Subject",
        teacher: "" // You'll need to implement teacher selection
      };

      // Find the division and add the subject
      const updatedDivisions = divisions.map(division => {
        if (division.name === divisionName) {
          return {
            ...division,
            subjects: [...division.subjects, newSubject]
          };
        }
        return division;
      });

      // Prepare the update payload
      const updatePayload = {
        academicId: selectedYear.academicId,
        divisionUpdates: updatedDivisions.map(div => ({
          name: div.name,
          subjects: div.subjects,
          timetable: div.timetable,
          exams: div.exams,
          students: div.students
        }))
      };

      // Send PUT request to update academic record
      const response = await fetch(`/api/hod/${user.id}/academics`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatePayload)
      });

      if (!response.ok) {
        throw new Error('Failed to add subject');
      }

      // Update local state
      const updatedYear = {
        ...selectedYear,
        divisions: updatedDivisions
      };
      
      setSelectedYear(updatedYear);
      setDivisions(updatedDivisions);
      
    } catch (err) {
      console.error("Failed to add subject:", err);
      setError(err.message);
    }
  };

  // Delete a division
  const handleDeleteDivision = async (divisionName) => {
    try {
      if (!selectedYear) return;
      
      // Filter out the division to be deleted
      const updatedDivisions = divisions.filter(div => div.name !== divisionName);

      // Prepare the update payload
      const updatePayload = {
        academicId: selectedYear.academicId,
        divisionUpdates: updatedDivisions.map(div => ({
          name: div.name,
          subjects: div.subjects,
          timetable: div.timetable,
          exams: div.exams,
          students: div.students
        }))
      };

      // Send PUT request to update academic record
      const response = await fetch(`/api/hod/${user.id}/academics`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatePayload)
      });

      if (!response.ok) {
        throw new Error('Failed to delete division');
      }

      // Update local state
      const updatedYear = {
        ...selectedYear,
        divisions: updatedDivisions
      };
      
      setSelectedYear(updatedYear);
      setDivisions(updatedDivisions);
      
    } catch (err) {
      console.error("Failed to delete division:", err);
      setError(err.message);
    }
  };

  const filteredDivisions = divisions.filter(division => 
    division.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    division.subjects.some(subject => 
      subject.name.toLowerCase().includes(searchTerm.toLowerCase())
  ));

  const renderTabContent = () => {
    switch (activeTab) {
      case 'courses':
        return (
          <div className="space-y-6">
            <button 
              onClick={handleAddDivision}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
            >
              <Plus className="w-4 h-4" />
              Add New Division
            </button>

            {filteredDivisions.map((division, index) => (
              <div key={index} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                  <h3 className="font-medium text-black">Division {division.name}</h3>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-black">{division.students} students</span>
                    <button 
                      onClick={() => handleDeleteDivision(division.name)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Subjects</h4>
                  <div className="space-y-3">
                    {division.subjects.map((subject, subIndex) => (
                      <div key={subIndex} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{subject.name}</p>
                          <p className="text-sm text-gray-600">Teacher: {subject.teacher}</p>
                        </div>
                        <div className="flex gap-2">
                          <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button 
                    onClick={() => handleAddSubject(division.name)}
                    className="mt-3 flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                  >
                    <Plus className="w-4 h-4" />
                    Add Subject
                  </button>
                </div>
              </div>
            ))}
          </div>
        );
      case 'timetable':
        return (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-black">
                  Timetable Management ({selectedYear?.yearLabel})
                </h3>
                <button className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
                  <Plus className="w-4 h-4" />
                  New Schedule
                </button>
              </div>
            </div>
            <div className="p-4">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Division</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Day</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Period</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teacher</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {divisions.flatMap((division, divIndex) =>
                      division.timetable.map((slot, slotIndex) => (
                        <tr key={`${divIndex}-${slotIndex}`} className="hover:bg-gray-50">
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">Div {division.name}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{slot.day}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{slot.period}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{slot.subject}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{slot.teacher}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            {slot.time.start} - {slot.time.end}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex gap-2">
                              <button className="text-blue-600 hover:text-blue-800">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button className="text-red-600 hover:text-red-800">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      case 'exams':
        return (
          <div className="space-y-6">
            {divisions.map((division, index) => (
              <div key={index} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                  <h3 className="font-medium text-black">
                    Division {division.name} Exams ({selectedYear?.yearLabel})
                  </h3>
                  <button className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700">
                    <Plus className="w-4 h-4" />
                    Schedule Exam
                  </button>
                </div>
                <div className="p-4">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Marks</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {division.exams.map((exam, examIndex) => (
                          <tr key={examIndex} className="hover:bg-gray-50">
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{exam.type}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{exam.subject}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{exam.totalMarks}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{exam.date}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                              <div className="flex gap-2">
                                <button className="text-blue-600 hover:text-blue-800">
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button className="text-red-600 hover:text-red-800">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  const renderYearSelection = () => {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Select Academic Year</h3>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {years.map((year) => (
            <button
              key={year.yearNumber}
              onClick={() => handleSelectYear(year)}
              className="p-5 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
            >
              <div className="font-medium text-gray-900 flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-blue-600" />
                {year.yearLabel}
              </div>
              <div className="text-sm text-gray-500 mt-3">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  {year.divisions.reduce((sum, div) => sum + div.students, 0)} students
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Clipboard className="w-4 h-4" />
                  {year.divisions.length} division{year.divisions.length !== 1 ? 's' : ''}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Loading academic data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Academic Management</h2>
            <p className="text-gray-600 text-sm mt-1">
              Manage courses, timetables, and examinations by year
            </p>
          </div>
          
          {selectedYear && (
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black" />
                <input
                  type="text"
                  placeholder="Search divisions or subjects..."
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          )}
        </div>

        {!selectedYear ? (
          renderYearSelection()
        ) : (
          <>
            {/* Back button and selected info */}
            <div className="flex items-center gap-4 mb-6">
              <button 
                onClick={() => setSelectedYear(null)}
                className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
              >
                <ChevronRight className="w-4 h-4 rotate-180" />
                Back to all years
              </button>
              
              <div className="text-sm text-gray-600">
                Viewing: <span className="font-medium">{selectedYear.yearLabel}</span>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 mb-6">
              {[
                { id: 'courses', label: 'Courses', icon: BookOpen },
                { id: 'timetable', label: 'Timetable', icon: Calendar },
                { id: 'exams', label: 'Examinations', icon: FileText }
              ].map((tab) => (
                <button
                  key={tab.id}
                  className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {renderTabContent()}
          </>
        )}
      </div>
    </div>
  );
};

export default AcademicManagement;