'use client';

import React, { useEffect, useState } from 'react';
import { CalendarDays, Clock, BookOpenCheck, FileText, AlertCircle, CheckCircle, Filter, Search, Bell, Calendar } from 'lucide-react';

function formatDate(isoDate) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(isoDate).toLocaleDateString(undefined, options);
}

function getTimeUntilExam(examDate) {
  const now = new Date();
  const exam = new Date(examDate);
  const timeDiff = exam - now;
  
  if (timeDiff < 0) return 'Past';
  
  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  
  if (days === 0) return `${hours}h remaining`;
  if (days === 1) return 'Tomorrow';
  if (days <= 7) return `${days} days`;
  return `${days} days`;
}

function getExamStatus(examDate) {
  const now = new Date();
  const exam = new Date(examDate);
  const timeDiff = exam - now;
  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  
  if (timeDiff < 0) return { status: 'past', color: 'gray', bgColor: 'bg-gray-100' };
  if (days <= 3) return { status: 'urgent', color: 'red', bgColor: 'bg-red-50' };
  if (days <= 7) return { status: 'soon', color: 'yellow', bgColor: 'bg-yellow-50' };
  return { status: 'upcoming', color: 'blue', bgColor: 'bg-blue-50' };
}

export default function ExamsPage() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const studentId = '686cd25835e2bb6cdeda5ea2';

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const res = await fetch(`/api/students/${studentId}/academics`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || 'Failed to fetch');

        const academic = data.academic;
        const division = academic?.years?.[0]?.divisions?.[0];
        const examsArray = division?.exams || [];

        setExams(examsArray);
      } catch (err) {
        console.error('Error fetching exams:', err);
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, []);

  const filteredExams = exams.filter(exam => {
    const matchesSearch = exam.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exam.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterStatus === 'all') return matchesSearch;
    
    const status = getExamStatus(exam.date).status;
    return matchesSearch && status === filterStatus;
  });

  const upcomingCount = exams.filter(exam => getExamStatus(exam.date).status !== 'past').length;
  const urgentCount = exams.filter(exam => getExamStatus(exam.date).status === 'urgent').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-100 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-gray-600 text-sm font-medium">Total Exams</div>
                  <div className="text-3xl font-bold text-gray-800">{exams.length}</div>
                </div>
                <div className="p-3 bg-blue-500 rounded-lg">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
            
            <div className="bg-green-100 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-gray-600 text-sm font-medium">Upcoming</div>
                  <div className="text-3xl font-bold text-gray-800">{upcomingCount}</div>
                </div>
                <div className="p-3 bg-green-500 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
            
            <div className="bg-purple-100 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-gray-600 text-sm font-medium">Urgent</div>
                  <div className="text-3xl font-bold text-gray-800">{urgentCount}</div>
                </div>
                <div className="p-3 bg-purple-500 rounded-lg">
                  <AlertCircle className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search exams by subject or type..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="relative">
              <Filter className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <select
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Exams</option>
                <option value="urgent">Urgent</option>
                <option value="soon">This Week</option>
                <option value="upcoming">Upcoming</option>
              </select>
            </div>
          </div>
        </div>

        {/* Exams List */}
        <div className="space-y-4">
          {loading ? (
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <div className="text-gray-600">Loading your exams...</div>
            </div>
          ) : error ? (
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <div className="text-red-600 font-semibold">Error: {error}</div>
            </div>
          ) : filteredExams.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <BookOpenCheck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <div className="text-gray-600">
                {searchTerm || filterStatus !== 'all' ? 'No exams match your search criteria.' : 'No upcoming exams.'}
              </div>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredExams.map((exam) => {
                const examStatus = getExamStatus(exam.date);
                const timeUntil = getTimeUntilExam(exam.date);
                
                return (
                  <div
                    key={exam._id}
                    className={`bg-white rounded-2xl shadow-lg border-l-4 border-${examStatus.color}-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${examStatus.bgColor}`}
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 bg-${examStatus.color}-100 rounded-lg`}>
                            <BookOpenCheck className={`w-5 h-5 text-${examStatus.color}-600`} />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-800">{exam.subject}</h3>
                            <p className="text-gray-600 font-medium">{exam.type}</p>
                          </div>
                        </div>
                        
                        <div className={`px-3 py-1 rounded-full text-xs font-semibold bg-${examStatus.color}-100 text-${examStatus.color}-800`}>
                          {timeUntil}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-2 text-gray-700">
                          <CalendarDays className="w-4 h-4 text-gray-500" />
                          <span className="font-medium">{formatDate(exam.date)}</span>
                        </div>

                        <div className="flex items-center gap-2 text-gray-700">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span className="font-medium">Total Marks: {exam.totalMarks}</span>
                        </div>
                      </div>

                      {examStatus.status === 'urgent' && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <div className="flex items-center gap-2 text-red-700">
                            <AlertCircle className="w-4 h-4" />
                            <span className="text-sm font-medium">Exam is coming up soon! Make sure you're prepared.</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}