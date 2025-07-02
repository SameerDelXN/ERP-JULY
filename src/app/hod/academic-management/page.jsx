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

const AcademicManagement = () => {
  const [activeTab, setActiveTab] = useState('courses');
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [divisions, setDivisions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Simulate API call to fetch academic data
    const fetchAcademicData = async () => {
      setLoading(true);
      try {
        // Mock data with years
        const mockData = [
          {
            yearNumber: 1,
            yearLabel: "1st Year",
            divisions: [
              {
                name: "A",
                students: 60,
                subjects: [
                  { name: "Mathematics I", teacher: "Dr. Smith" },
                  { name: "Physics", teacher: "Prof. Johnson" },
                ],
                timetable: [
                  { day: "Monday", period: "1", subject: "Mathematics", teacher: "Dr. Smith", time: { start: "09:00", end: "10:00" } },
                ],
                exams: [
                  { type: "Unit Test", subject: "Mathematics", totalMarks: 50, date: "2023-10-15" },
                ]
              },
              {
                name: "B",
                students: 55,
                subjects: [
                  { name: "Chemistry", teacher: "Prof. Davis" }
                ],
                timetable: [
                  { day: "Wednesday", period: "1", subject: "Chemistry", teacher: "Prof. Davis", time: { start: "09:00", end: "10:00" } }
                ],
                exams: [
                  { type: "Practical Exam", subject: "Chemistry", totalMarks: 30, date: "2023-10-18" }
                ]
              }
            ]
          },
          {
            yearNumber: 2,
            yearLabel: "2nd Year",
            divisions: [
              {
                name: "A",
                students: 50,
                subjects: [
                  { name: "Data Structures", teacher: "Dr. Wilson" },
                  { name: "Algorithms", teacher: "Prof. Brown" }
                ],
                timetable: [
                  { day: "Tuesday", period: "2", subject: "Data Structures", teacher: "Dr. Wilson", time: { start: "10:00", end: "11:00" } }
                ],
                exams: [
                  { type: "Mid Term", subject: "Algorithms", totalMarks: 100, date: "2023-11-20" }
                ]
              }
            ]
          },
          {
            yearNumber: 3,
            yearLabel: "3rd Year",
            divisions: [
              {
                name: "A",
                students: 45,
                subjects: [
                  { name: "Database Systems", teacher: "Dr. Lee" },
                  { name: "Operating Systems", teacher: "Prof. Taylor" }
                ],
                timetable: [
                  { day: "Thursday", period: "3", subject: "Database Systems", teacher: "Dr. Lee", time: { start: "11:00", end: "12:00" } }
                ],
                exams: [
                  { type: "Project Evaluation", subject: "Database Systems", totalMarks: 150, date: "2023-12-15" }
                ]
              }
            ]
          }
        ];
        
        setYears(mockData);
      } catch (error) {
        console.error("Failed to fetch academic data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAcademicData();
  }, []);

  const handleSelectYear = (year) => {
    setSelectedYear(year);
    setDivisions(year.divisions);
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
            {filteredDivisions.map((division, index) => (
              <div key={index} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                  <h3 className="font-medium text-black">Division {division.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-black">{division.students} students</span>
                    <ChevronDown className="w-4 h-4 text-black" />
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
                  <button className="mt-3 flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700">
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