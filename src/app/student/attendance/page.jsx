"use client"

import React, { useState } from 'react';
import {
    Calendar,
    ChevronDown,
    ChevronUp,
    CheckCircle2,
    XCircle,
    Clock,
    Filter,
    Download,
    Search
} from 'lucide-react';

const AttendancePage = () => {
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [expandedCourse, setExpandedCourse] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Sample data
    const courses = [
        {
            id: 1,
            code: 'CS-401',
            name: 'Advanced Algorithms',
            instructor: 'Dr. Smith',
            schedule: 'Mon/Wed 10:00-11:30',
            attendance: {
                present: 12,
                absent: 2,
                percentage: 86
            },
            sessions: [
                { date: '2023-06-05', status: 'present', topic: 'Divide and Conquer' },
                { date: '2023-06-07', status: 'present', topic: 'Dynamic Programming' },
                { date: '2023-06-12', status: 'absent', topic: 'Greedy Algorithms' },
                { date: '2023-06-14', status: 'present', topic: 'Backtracking' },
                { date: '2023-06-19', status: 'present', topic: 'Graph Algorithms' },
                { date: '2023-06-21', status: 'present', topic: 'NP-Completeness' }
            ]
        },
        {
            id: 2,
            code: 'MATH-310',
            name: 'Discrete Mathematics',
            instructor: 'Prof. Johnson',
            schedule: 'Tue/Thu 13:00-14:30',
            attendance: {
                present: 10,
                absent: 4,
                percentage: 71
            },
            sessions: [
                { date: '2023-06-06', status: 'present', topic: 'Number Theory' },
                { date: '2023-06-08', status: 'absent', topic: 'Combinatorics' },
                { date: '2023-06-13', status: 'present', topic: 'Graph Theory' },
                { date: '2023-06-15', status: 'absent', topic: 'Probability' },
                { date: '2023-06-20', status: 'present', topic: 'Logic' },
                { date: '2023-06-22', status: 'present', topic: 'Proof Techniques' }
            ]
        }
    ];

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const toggleCourseExpand = (courseId) => {
        setExpandedCourse(expandedCourse === courseId ? null : courseId);
    };

    const filteredCourses = courses.filter(course =>
        course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Attendance Records</h1>
                        <p className="text-gray-600">Track your class attendance</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search courses..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 w-full sm:w-64 border border-gray-300 text-black rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div className="relative">
                            <select
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                                className="px-4 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none text-black"
                            >
                                {months.map((month, index) => (
                                    <option key={month} value={index}>
                                        {month}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                            <Download size={16} />
                            Export
                        </button>
                    </div>
                </div>

                {/* Attendance Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium text-gray-500">Total Classes</h3>
                            <Calendar className="w-5 h-5 text-gray-400" />
                        </div>
                        <p className="text-2xl font-bold text-gray-800 mt-2">24</p>
                        <p className="text-xs text-gray-500 mt-1">This semester</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium text-gray-500">Present</h3>
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                        </div>
                        <p className="text-2xl font-bold text-gray-800 mt-2">20</p>
                        <div className="flex items-center gap-2 mt-1">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-green-500 h-2 rounded-full"
                                    style={{ width: '83%' }}
                                ></div>
                            </div>
                            <span className="text-xs text-gray-500">83%</span>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium text-gray-500">Absent</h3>
                            <XCircle className="w-5 h-5 text-red-500" />
                        </div>
                        <p className="text-2xl font-bold text-gray-800 mt-2">4</p>
                        <div className="flex items-center gap-2 mt-1">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-red-500 h-2 rounded-full"
                                    style={{ width: '17%' }}
                                ></div>
                            </div>
                            <span className="text-xs text-gray-500">17%</span>
                        </div>
                    </div>
                </div>

                {/* Course Attendance List */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    {filteredCourses.length > 0 ? (
                        filteredCourses.map(course => (
                            <div key={course.id} className="border-b border-gray-200 last:border-b-0">
                                <div
                                    className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                                    onClick={() => toggleCourseExpand(course.id)}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-medium text-gray-800">
                                                {course.code} - {course.name}
                                            </h3>
                                            <p className="text-sm text-gray-600 mt-1">
                                                {course.instructor} • {course.schedule}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-center">
                                                <span className={`text-sm font-medium ${course.attendance.percentage >= 80 ? 'text-green-600' :
                                                        course.attendance.percentage >= 60 ? 'text-blue-600' : 'text-red-600'
                                                    }`}>
                                                    {course.attendance.percentage}%
                                                </span>
                                                <p className="text-xs text-gray-500">Attendance</p>
                                            </div>
                                            {expandedCourse === course.id ? (
                                                <ChevronUp className="w-5 h-5 text-gray-500" />
                                            ) : (
                                                <ChevronDown className="w-5 h-5 text-gray-500" />
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {expandedCourse === course.id && (
                                    <div className="px-4 pb-4">
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Date
                                                        </th>
                                                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Status
                                                        </th>
                                                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Topic
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {course.sessions.map((session, index) => (
                                                        <tr key={index}>
                                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">
                                                                {new Date(session.date).toLocaleDateString('en-US', {
                                                                    weekday: 'short',
                                                                    month: 'short',
                                                                    day: 'numeric'
                                                                })}
                                                            </td>
                                                            <td className="px-4 py-3 whitespace-nowrap">
                                                                {session.status === 'present' ? (
                                                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                                        <CheckCircle2 className="w-3 h-3" /> Present
                                                                    </span>
                                                                ) : (
                                                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                                        <XCircle className="w-3 h-3" /> Absent
                                                                    </span>
                                                                )}
                                                            </td>
                                                            <td className="px-4 py-3 text-sm text-gray-800">
                                                                {session.topic}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="p-8 text-center">
                            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <Search className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900">No courses found</h3>
                            <p className="text-gray-500 mt-1">Try adjusting your search or filter</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AttendancePage;