"use client"

import React, { useState } from 'react';
import { 
  BookOpen,
  Clock,
  Upload,
  Download,
  User,
  CheckCircle2,
  AlertCircle,
  Calendar,
  FileText,
  Search
} from 'lucide-react';

const AssignmentPage = () => {
  // Sample data
  const assignments = [
    {
      id: 1,
      title: 'Math Homework',
      course: 'Advanced Mathematics',
      teacher: 'Dr. Smith',
      dueDate: '2023-06-15',
      submitted: false,
      description: 'Complete all exercises from chapter 3. Show your work.'
    },
    {
      id: 2,
      title: 'Literature Essay',
      course: 'English Literature',
      teacher: 'Prof. Johnson',
      dueDate: '2023-06-20',
      submitted: true,
      submissionDate: '2023-06-18',
      description: '5-page essay on Shakespearean themes in modern literature.'
    }
  ];

  const [selectedAssignment, setSelectedAssignment] = useState(assignments[0]);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!uploadedFile) return;
    setSubmissionSuccess(true);
    // In a real app, you would handle file upload here
  };

  const StatusBadge = ({ assignment }) => {
    if (assignment.submitted) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
          <CheckCircle2 className="w-3 h-3" /> Submitted
        </span>
      );
    }
    
    const dueDate = new Date(assignment.dueDate);
    const today = new Date();
    
    if (today > dueDate) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
          <AlertCircle className="w-3 h-3" /> Overdue
        </span>
      );
    }
    
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
        <Clock className="w-3 h-3" /> Pending
      </span>
    );
  };

  const DueDateStatus = ({ dueDate }) => {
    const daysLeft = Math.ceil((new Date(dueDate) - new Date()) / (1000 * 60 * 60 * 24));
    return (
      <div className="flex items-center gap-1 text-sm text-gray-500">
        <Calendar className="w-4 h-4" />
        {daysLeft <= 0 ? 'Due today' : `Due in ${daysLeft} day${daysLeft !== 1 ? 's' : ''}`}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Assignments</h1>
          <p className="text-gray-600">View and submit your assignments</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search..."
              className="pl-10 pr-4 py-2 w-full sm:w-64 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <option>All Teachers</option>
            <option>Dr. Smith</option>
            <option>Prof. Johnson</option>
          </select>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Assignment List */}
        <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Your Assignments</h2>
          <div className="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto">
            {assignments.map(assignment => (
              <div 
                key={assignment.id}
                onClick={() => {
                  setSelectedAssignment(assignment);
                  setSubmissionSuccess(false);
                }}
                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedAssignment?.id === assignment.id 
                    ? 'border-blue-300 bg-blue-50' 
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex justify-between items-start gap-2">
                  <h3 className="font-medium text-gray-800">{assignment.title}</h3>
                  <StatusBadge assignment={assignment} />
                </div>
                <p className="text-sm text-gray-600 mt-1 truncate">{assignment.course}</p>
                <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3" /> {assignment.teacher}
                  </span>
                  <DueDateStatus dueDate={assignment.dueDate} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Assignment Detail */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {selectedAssignment ? (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">{selectedAssignment.title}</h2>
                  <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" /> {selectedAssignment.course}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="w-4 h-4" /> {selectedAssignment.teacher}
                    </span>
                  </div>
                </div>
                <StatusBadge assignment={selectedAssignment} />
              </div>

              {submissionSuccess && (
                <div className="flex items-center gap-2 p-3 bg-green-50 text-green-700 rounded-lg">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Assignment submitted successfully!</span>
                </div>
              )}

              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
                <p className="text-gray-700">{selectedAssignment.description}</p>
              </div>

              {selectedAssignment.submitted ? (
                <div className="text-center py-6 border-t border-gray-200">
                  <CheckCircle2 className="w-10 h-10 text-green-500 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-gray-800">Assignment Submitted</h3>
                  <p className="text-gray-600 mb-4">Submitted on {selectedAssignment.submissionDate}</p>
                  <button className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                    <Download className="w-4 h-4" /> Download Submission
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Submit Your Work</h3>
                  
                  <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors">
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600 text-center">
                      {uploadedFile ? (
                        <span className="font-medium text-gray-800">{uploadedFile.name}</span>
                      ) : (
                        <>
                          <span className="font-medium text-blue-600">Click to upload</span> or drag and drop
                        </>
                      )}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">PDF, DOC, PPT (Max. 10MB)</p>
                    <input 
                      type="file" 
                      className="hidden" 
                      onChange={(e) => setUploadedFile(e.target.files[0])}
                      required
                    />
                  </label>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6">
                    <DueDateStatus dueDate={selectedAssignment.dueDate} />
                    <button
                      type="submit"
                      disabled={!uploadedFile}
                      className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                        uploadedFile 
                          ? 'bg-blue-600 text-white hover:bg-blue-700' 
                          : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      Submit Assignment
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <FileText className="w-12 h-12 mb-4" />
              <p>Select an assignment to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssignmentPage;