"use client"
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
  Clipboard,
  Save,
  X,
  ChevronLeft,
  UserPlus,
  Clock
} from 'lucide-react';
import { useSession } from '@/context/SessionContext';

const AcademicManagement = () => {
  const { user } = useSession();
  
  // State management
  const [activeTab, setActiveTab] = useState('courses');
  const [academics, setAcademics] = useState([]);
  const [selectedAcademic, setSelectedAcademic] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const [teachers, setTeachers] = useState([]);
  const [department, setDepartment] = useState('');
  
  // Modal states
  const [showYearModal, setShowYearModal] = useState(false);
  const [showDivisionModal, setShowDivisionModal] = useState(false);
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [showTimetableModal, setShowTimetableModal] = useState(false);
  const [showExamModal, setShowExamModal] = useState(false);
  
  // Editing indices
  const [editingYear, setEditingYear] = useState(null);
  const [editingDivision, setEditingDivision] = useState(null);
  const [editingTimetable, setEditingTimetable] = useState(null);
  const [editingExam, setEditingExam] = useState(null);
  
  // Form states
  const [newYear, setNewYear] = useState({ year: '', divisions: [] });
  const [newDivision, setNewDivision] = useState({ 
    name: '', 
    students: [], 
    subjects: [], 
    timetable: [], 
    exams: [] 
  });
  const [newSubject, setNewSubject] = useState({ name: '', teacher: '' });
  const [newTimetable, setNewTimetable] = useState({
    day: '',
    period: '',
    subject: '',
    teacher: '',
    time: { start: '', end: '' }
  });
  const [newExam, setNewExam] = useState({
    type: '',
    subject: '',
    totalMarks: '',
    date: ''
  });

  // Days and periods for timetable
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const periods = Array.from({ length: 8 }, (_, i) => `Period ${i + 1}`);
  const examTypes = ['Unit Test', 'Mid Term', 'Final Exam', 'Quiz', 'Practical'];

  // Fetch initial data
  useEffect(() => {
    if (user) {
      fetchAcademicData();
    }
  }, [user]);

  // API Functions
  const fetchAcademicData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/hod/${user.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch academic data');
      }
      
      const data = await response.json();
      setAcademics(data.academics || []);
      setTeachers(data.teachers || []);
      setDepartment(data.department || '');
      
      if (data.academics && data.academics.length > 0) {
        setSelectedAcademic(data.academics[0]);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching academic data:', err);
    } finally {
      setLoading(false);
    }
  };

  const saveAcademicChanges = async (selectedAcademicData) => {
    try {
      setLoading(true);
      setError(null);
      
      let response;
      
      if (selectedAcademicData._id === 'default') {
        // Create new academic
        response = await fetch(`/api/hod/${user.id}/academics`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            department: selectedAcademicData.department,
            years: selectedAcademicData.years
          })
        });
      } else {
        // Update existing academic
        response = await fetch(`/api/hod/${user.id}/academics`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            academicId: selectedAcademicData._id,
            years: selectedAcademicData.years
          })
        });
      }
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save academic data');
      }
      
      const data = await response.json();
      
      if (selectedAcademicData._id === 'default') {
        // For new academic, add to the list
        setAcademics([...academics, data.academic]);
        setSelectedAcademic(data.academic);
      } else {
        // For existing academic, update the specific academic
        setAcademics(academics.map(academic => 
          academic._id === selectedAcademic._id ? data.academic : academic
        ));
        setSelectedAcademic(data.academic);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error saving academic data:', err);
    } finally {
      setLoading(false);
    }
  };

  const addYear = async () => {
    try {
      if (!newYear.year.trim()) {
        setError('Please select a year');
        return;
      }

      const updatedAcademic = {
        ...selectedAcademic,
        years: [...selectedAcademic.years, newYear]
      };
      
      setSelectedAcademic(updatedAcademic);
      
      if (selectedAcademic._id !== 'default') {
        await saveAcademicChanges(updatedAcademic);
      }
      
      setShowYearModal(false);
      setNewYear({ year: '', divisions: [] });
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error adding year:', err);
    }
  };

  const addDivision = async () => {
    try {
      if (!newDivision.name.trim()) {
        setError('Please enter a division name');
        return;
      }

      const updatedAcademic = { ...selectedAcademic };
      if (!updatedAcademic.years[editingYear].divisions) {
        updatedAcademic.years[editingYear].divisions = [];
      }
      updatedAcademic.years[editingYear].divisions.push(newDivision);
      
      setSelectedAcademic(updatedAcademic);
      
      if (selectedAcademic._id !== 'default') {
        await saveAcademicChanges(updatedAcademic);
      }
      
      setShowDivisionModal(false);
      setNewDivision({ name: '', students: [], subjects: [], timetable: [], exams: [] });
      setError(null);
      setEditingYear(null);
    } catch (err) {
      setError(err.message);
      console.error('Error adding division:', err);
    }
  };

  const addSubject = async () => {
    try {
      if (!newSubject.name.trim() || !newSubject.teacher) {
        setError('Please fill in all subject details');
        return;
      }

      const updatedAcademic = { ...selectedAcademic };
      updatedAcademic.years[editingYear].divisions[editingDivision].subjects.push(newSubject);
      
      setSelectedAcademic(updatedAcademic);

      if (selectedAcademic._id !== 'default') {
        await saveAcademicChanges(updatedAcademic);
      }
      
      setShowSubjectModal(false);
      setNewSubject({ name: '', teacher: '' });
      setError(null);
      setEditingYear(null);
      setEditingDivision(null);
    } catch (err) {
      setError(err.message);
      console.error('Error adding subject:', err);
    }
  };

  const addTimetable = async () => {
    try {
      if (!newTimetable.day || !newTimetable.period || !newTimetable.subject || !newTimetable.teacher || !newTimetable.time.start || !newTimetable.time.end) {
        setError('Please fill in all timetable details');
        return;
      }

      const updatedAcademic = { ...selectedAcademic };
      
      if (editingTimetable !== null) {
        // Update existing timetable
        updatedAcademic.years[editingYear].divisions[editingDivision].timetable[editingTimetable] = newTimetable;
      } else {
        // Add new timetable
        updatedAcademic.years[editingYear].divisions[editingDivision].timetable.push(newTimetable);
      }
      
      setSelectedAcademic(updatedAcademic);

      if (selectedAcademic._id !== 'default') {
        await saveAcademicChanges(updatedAcademic);
      }
      
      setShowTimetableModal(false);
      setNewTimetable({
        day: '',
        period: '',
        subject: '',
        teacher: '',
        time: { start: '', end: '' }
      });
      setError(null);
      setEditingYear(null);
      setEditingDivision(null);
      setEditingTimetable(null);
    } catch (err) {
      setError(err.message);
      console.error('Error adding timetable:', err);
    }
  };

  const addExam = async () => {
    try {
      if (!newExam.type || !newExam.subject || !newExam.totalMarks || !newExam.date) {
        setError('Please fill in all exam details');
        return;
      }

      const updatedAcademic = { ...selectedAcademic };
      
      if (editingExam !== null) {
        // Update existing exam
        updatedAcademic.years[editingYear].divisions[editingDivision].exams[editingExam] = newExam;
      } else {
        // Add new exam
        updatedAcademic.years[editingYear].divisions[editingDivision].exams.push(newExam);
      }
      
      setSelectedAcademic(updatedAcademic);

      if (selectedAcademic._id !== 'default') {
        await saveAcademicChanges(updatedAcademic);
      }
      
      setShowExamModal(false);
      setNewExam({
        type: '',
        subject: '',
        totalMarks: '',
        date: ''
      });
      setError(null);
      setEditingYear(null);
      setEditingDivision(null);
      setEditingExam(null);
    } catch (err) {
      setError(err.message);
      console.error('Error adding exam:', err);
    }
  };

  const deleteYear = async (yearIndex) => {
    try {
      const updatedAcademic = { ...selectedAcademic };
      updatedAcademic.years.splice(yearIndex, 1);
      
      setSelectedAcademic(updatedAcademic);
      
      if (selectedAcademic._id !== 'default') {
        await saveAcademicChanges(updatedAcademic);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error deleting year:', err);
    }
  };

  const deleteDivision = async (yearIndex, divisionIndex) => {
    try {
      const updatedAcademic = { ...selectedAcademic };
      updatedAcademic.years[yearIndex].divisions.splice(divisionIndex, 1);
      
      setSelectedAcademic(updatedAcademic);
      
      if (selectedAcademic._id !== 'default') {
        await saveAcademicChanges(updatedAcademic);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error deleting division:', err);
    }
  };

  const deleteSubject = async (yearIndex, divisionIndex, subjectIndex) => {
    try {
      const updatedAcademic = { ...selectedAcademic };
      updatedAcademic.years[yearIndex].divisions[divisionIndex].subjects.splice(subjectIndex, 1);
      
      setSelectedAcademic(updatedAcademic);
      
      if (selectedAcademic._id !== 'default') {
        await saveAcademicChanges(updatedAcademic);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error deleting subject:', err);
    }
  };

  const deleteTimetable = async (yearIndex, divisionIndex, timetableIndex) => {
    try {
      const updatedAcademic = { ...selectedAcademic };
      updatedAcademic.years[yearIndex].divisions[divisionIndex].timetable.splice(timetableIndex, 1);
      
      setSelectedAcademic(updatedAcademic);
      
      if (selectedAcademic._id !== 'default') {
        await saveAcademicChanges(updatedAcademic);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error deleting timetable:', err);
    }
  };

  const deleteExam = async (yearIndex, divisionIndex, examIndex) => {
    try {
      const updatedAcademic = { ...selectedAcademic };
      updatedAcademic.years[yearIndex].divisions[divisionIndex].exams.splice(examIndex, 1);
      
      setSelectedAcademic(updatedAcademic);
      
      if (selectedAcademic._id !== 'default') {
        await saveAcademicChanges(updatedAcademic);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error deleting exam:', err);
    }
  };

  // Modal Components
  const YearModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Add New Year</h3>
          <button onClick={() => setShowYearModal(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Year</label>
            <select
              value={newYear.year}
              onChange={(e) => setNewYear({...newYear, year: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Year</option>
              <option value="1st">1st Year</option>
              <option value="2nd">2nd Year</option>
              <option value="3rd">3rd Year</option>
              <option value="4th">4th Year</option>
            </select>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={addYear}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
            >
              Add Year
            </button>
            <button
              onClick={() => {
                setShowYearModal(false);
                setError(null);
              }}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const DivisionModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Add New Division</h3>
          <button onClick={() => setShowDivisionModal(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Division Name</label>
            <input
              type="text"
              value={newDivision.name}
              onChange={(e) => setNewDivision({...newDivision, name: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., A, B, C"
            />
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={addDivision}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
            >
              Add Division
            </button>
            <button
              onClick={() => {
                setShowDivisionModal(false);
                setError(null);
              }}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const SubjectModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Add New Subject</h3>
          <button onClick={() => setShowSubjectModal(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Subject Name</label>
            <input
              type="text"
              value={newSubject.name}
              onChange={(e) => setNewSubject({...newSubject, name: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Programming Fundamentals"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Assign Teacher</label>
            <select
              value={newSubject.teacher}
              onChange={(e) => setNewSubject({...newSubject, teacher: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Teacher</option>
              {teachers.map(teacher => (
                <option key={teacher._id} value={teacher._id}>
                  {teacher.fullName}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={addSubject}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
            >
              {editingDivision !== null ? 'Update Subject' : 'Add Subject'}
            </button>
            <button
              onClick={() => {
                setShowSubjectModal(false);
                setError(null);
              }}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const TimetableModal = () => {
    const currentYear = selectedAcademic?.years[editingYear];
    const currentDivision = currentYear?.divisions[editingDivision];
    const currentSubjects = currentDivision?.subjects || [];

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">
              {editingTimetable !== null ? 'Edit Timetable' : 'Add New Timetable'}
            </h3>
            <button onClick={() => {
              setShowTimetableModal(false);
              setEditingTimetable(null);
            }}>
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Day</label>
              <select
                value={newTimetable.day}
                onChange={(e) => setNewTimetable({...newTimetable, day: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Day</option>
                {days.map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Period</label>
              <select
                value={newTimetable.period}
                onChange={(e) => setNewTimetable({...newTimetable, period: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Period</option>
                {periods.map(period => (
                  <option key={period} value={period}>{period}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Subject</label>
              <select
                value={newTimetable.subject}
                onChange={(e) => setNewTimetable({...newTimetable, subject: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Subject</option>
                {currentSubjects.map(subject => (
                  <option key={subject.name} value={subject.name}>{subject.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Teacher</label>
              <select
                value={newTimetable.teacher}
                onChange={(e) => setNewTimetable({...newTimetable, teacher: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Teacher</option>
                {teachers.map(teacher => (
                  <option key={teacher._id} value={teacher._id}>{teacher.fullName}</option>
                ))}
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Start Time</label>
                <input
                  type="time"
                  value={newTimetable.time.start}
                  onChange={(e) => setNewTimetable({
                    ...newTimetable, 
                    time: {...newTimetable.time, start: e.target.value}
                  })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">End Time</label>
                <input
                  type="time"
                  value={newTimetable.time.end}
                  onChange={(e) => setNewTimetable({
                    ...newTimetable, 
                    time: {...newTimetable.time, end: e.target.value}
                  })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={addTimetable}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
              >
                {editingTimetable !== null ? 'Update Schedule' : 'Add Schedule'}
              </button>
              <button
                onClick={() => {
                  setShowTimetableModal(false);
                  setEditingTimetable(null);
                  setError(null);
                }}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ExamModal = () => {
    const currentYear = selectedAcademic?.years[editingYear];
    const currentDivision = currentYear?.divisions[editingDivision];
    const currentSubjects = currentDivision?.subjects || [];

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">
              {editingExam !== null ? 'Edit Exam' : 'Schedule New Exam'}
            </h3>
            <button onClick={() => {
              setShowExamModal(false);
              setEditingExam(null);
            }}>
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Exam Type</label>
              <select
                value={newExam.type}
                onChange={(e) => setNewExam({...newExam, type: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Exam Type</option>
                {examTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Subject</label>
              <select
                value={newExam.subject}
                onChange={(e) => setNewExam({...newExam, subject: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Subject</option>
                {currentSubjects.map(subject => (
                  <option key={subject.name} value={subject.name}>{subject.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Total Marks</label>
              <input
                type="number"
                value={newExam.totalMarks}
                onChange={(e) => setNewExam({...newExam, totalMarks: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., 100"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Exam Date</label>
              <input
                type="date"
                value={newExam.date}
                onChange={(e) => setNewExam({...newExam, date: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={addExam}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
              >
                {editingExam !== null ? 'Update Exam' : 'Schedule Exam'}
              </button>
              <button
                onClick={() => {
                  setShowExamModal(false);
                  setEditingExam(null);
                  setError(null);
                }}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'courses':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Course Structure</h3>
              <button
                onClick={() => setShowYearModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
                Add Year
              </button>
            </div>

            {selectedAcademic?.years?.map((year, yearIndex) => (
              <div key={yearIndex} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="flex items-center justify-between p-4 bg-gray-50 border-b">
                  <h4 className="font-medium text-gray-900">{year.year} Year</h4>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingYear(yearIndex);
                        setShowDivisionModal(true);
                      }}
                      className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                    >
                      <Plus className="w-3 h-3" />
                      Add Division
                    </button>
                    <button
                      onClick={() => deleteYear(yearIndex)}
                      className="p-1 text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="p-4">
                  {year.divisions?.map((division, divisionIndex) => (
                    <div key={divisionIndex} className="mb-4 last:mb-0">
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="font-medium text-gray-800">Division {division.name}</h5>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditingYear(yearIndex);
                              setEditingDivision(divisionIndex);
                              setShowSubjectModal(true);
                            }}
                            className="flex items-center gap-1 px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                          >
                            <Plus className="w-3 h-3" />
                            Add Subject
                          </button>
                          <button
                            onClick={() => deleteDivision(yearIndex, divisionIndex)}
                            className="p-1 text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {division.subjects?.map((subject, subjectIndex) => (
                          <div key={subjectIndex} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-medium text-sm">{subject.name}</p>
                              <p className="text-xs text-gray-600">
                                Teacher: {teachers.find(t => t._id === subject.teacher)?.fullName || 'Not assigned'}
                              </p>
                            </div>
                            <div className="flex gap-1">
                              <button 
                                onClick={() => {
                                  setEditingYear(yearIndex);
                                  setEditingDivision(divisionIndex);
                                  setNewSubject(subject);
                                  setShowSubjectModal(true);
                                }}
                                className="p-1 text-blue-600 hover:text-blue-800"
                              >
                                <Edit className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => deleteSubject(yearIndex, divisionIndex, subjectIndex)}
                                className="p-1 text-red-600 hover:text-red-800"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
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
                <h3 className="font-medium text-black">Timetable Management</h3>
                {selectedAcademic?.years?.length > 0 && (
                  <button 
                    className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                    onClick={() => {
                      // Set default values for new timetable
                      setNewTimetable({
                        day: '',
                        period: '',
                        subject: '',
                        teacher: '',
                        time: { start: '', end: '' }
                      });
                      setEditingTimetable(null);
                      setShowTimetableModal(true);
                    }}
                  >
                    <Plus className="w-4 h-4" />
                    Add Schedule
                  </button>
                )}
              </div>
            </div>
            <div className="p-4">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
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
                    {selectedAcademic?.years?.flatMap((year, yearIndex) =>
                      year.divisions?.flatMap((division, divIndex) =>
                        division.timetable?.map((slot, slotIndex) => (
                          <tr key={`${yearIndex}-${divIndex}-${slotIndex}`} className="hover:bg-gray-50">
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{year.year}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{division.name}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{slot.day}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{slot.period}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{slot.subject}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                              {teachers.find(t => t._id === slot.teacher)?.fullName || 'Not assigned'}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                              {                              `${slot.time.start} - ${slot.time.end}`}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => {
                                    setEditingYear(yearIndex);
                                    setEditingDivision(divIndex);
                                    setEditingTimetable(slotIndex);
                                    setNewTimetable(slot);
                                    setShowTimetableModal(true);
                                  }}
                                  className="text-blue-600 hover:text-blue-900"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => deleteTimetable(yearIndex, divIndex, slotIndex)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )
                    )}
                  </tbody>
                </table>
              </div>
              {selectedAcademic?.years?.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No timetable data available. Add academic years and divisions first.
                </div>
              )}
            </div>
          </div>
        );

      case 'exams':
        return (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-black">Exam Schedule</h3>
                {selectedAcademic?.years?.length > 0 && (
                  <button 
                    className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                    onClick={() => {
                      // Set default values for new exam
                      setNewExam({
                        type: '',
                        subject: '',
                        totalMarks: '',
                        date: ''
                      });
                      setEditingExam(null);
                      setShowExamModal(true);
                    }}
                  >
                    <Plus className="w-4 h-4" />
                    Schedule Exam
                  </button>
                )}
              </div>
            </div>
            <div className="p-4">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Division</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exam Type</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Marks</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {selectedAcademic?.years?.flatMap((year, yearIndex) =>
                      year.divisions?.flatMap((division, divIndex) =>
                        division.exams?.map((exam, examIndex) => (
                          <tr key={`${yearIndex}-${divIndex}-${examIndex}`} className="hover:bg-gray-50">
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{year.year}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{division.name}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{exam.type}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{exam.subject}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{exam.totalMarks}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                              {new Date(exam.date).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => {
                                    setEditingYear(yearIndex);
                                    setEditingDivision(divIndex);
                                    setEditingExam(examIndex);
                                    setNewExam(exam);
                                    setShowExamModal(true);
                                  }}
                                  className="text-blue-600 hover:text-blue-900"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => deleteExam(yearIndex, divIndex, examIndex)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )
                    )}
                  </tbody>
                </table>
              </div>
              {selectedAcademic?.years?.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No exam data available. Add academic years and divisions first.
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-900">Academic Management</h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <select
                value={selectedAcademic?._id || ''}
                onChange={(e) => {
                  const academic = academics.find(a => a._id === e.target.value);
                  setSelectedAcademic(academic || null);
                }}
                className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Academic</option>
                {academics.map(academic => (
                  <option key={academic?._id} value={academic?._id}>
                    {academic?.department} ({academic?.years?.length || 0} years)
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
            <button
              onClick={() => {
                setSelectedAcademic({
                  _id: 'default',
                  department: department,
                  years: []
                });
              }}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Plus className="w-4 h-4" />
              New Academic
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Loading Indicator */}
        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {!loading && selectedAcademic && (
          <>
            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('courses')}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'courses' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                >
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    Course Structure
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('timetable')}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'timetable' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                >
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Timetable
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('exams')}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'exams' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Exams
                  </div>
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            {renderTabContent()}

            {/* Save Button for New Academic */}
            {selectedAcademic._id === 'default' && (
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => saveAcademicChanges(selectedAcademic)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save Academic Structure
                </button>
              </div>
            )}
          </>
        )}

        {/* Empty State */}
        {!loading && !selectedAcademic && (
          <div className="text-center py-12">
            <div className="mx-auto h-24 w-24 text-gray-400">
              <BookOpen className="w-full h-full" />
            </div>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No academic selected</h3>
            <p className="mt-1 text-sm text-gray-500">
              Select an existing academic or create a new one to get started.
            </p>
            <div className="mt-6">
              <button
                onClick={() => {
                  setSelectedAcademic({
                    _id: 'default',
                    department: department,
                    years: []
                  });
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="-ml-1 mr-2 h-5 w-5" />
                New Academic
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      {showYearModal && <YearModal />}
      {showDivisionModal && <DivisionModal />}
      {showSubjectModal && <SubjectModal />}
      {showTimetableModal && <TimetableModal />}
      {showExamModal && <ExamModal />}
    </div>
  );
};

export default AcademicManagement;