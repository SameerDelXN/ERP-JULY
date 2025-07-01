"use client"

import React, { useState } from 'react';
import {
    BookOpen,
    Calendar,
    Clock,
    AlertCircle,
    CheckCircle2,
    BarChart2,
    TrendingUp,
    Bell,
    FileText,
    Award,
    GraduationCap
} from 'lucide-react';

const OverviewPage = () => {
    // Sample data
    const [stats, setStats] = useState({
        courses: 5,
        credits: 15,
        gpa: 3.68,
        attendance: 92,
        assignmentsDue: 3,
        upcomingExams: 2
    });

    const recentGrades = [
        { course: 'CS-401', title: 'Midterm Exam', grade: 'A', score: 94, average: 82 },
        { course: 'MATH-310', title: 'Quiz 3', grade: 'B+', score: 88, average: 76 },
        { course: 'ENG-205', title: 'Research Paper', grade: 'A-', score: 90, average: 85 }
    ];

    const upcomingTasks = [
        { id: 1, type: 'assignment', course: 'CS-401', title: 'Algorithm Project', due: '2023-06-25', status: 'in-progress' },
        { id: 2, type: 'exam', course: 'MATH-310', title: 'Final Exam', due: '2023-06-28', status: 'pending' },
        { id: 3, type: 'reading', course: 'ENG-205', title: 'Chapter 8 Reading', due: '2023-06-22', status: 'not-started' }
    ];

    const announcements = [
        { id: 1, title: 'Campus Closed July 4th', date: '2023-06-15', source: 'University Administration' },
        { id: 2, title: 'CS-401 Office Hours Changed', date: '2023-06-12', source: 'Dr. Smith' },
        { id: 3, title: 'Library Extended Hours', date: '2023-06-10', source: 'University Library' }
    ];

    const calculateTrend = (current, previous) => {
        const diff = current - previous;
        return {
            value: Math.abs(diff).toFixed(1),
            direction: diff >= 0 ? 'up' : 'down',
            positive: diff >= 0
        };
    };

    const gpaTrend = calculateTrend(3.68, 3.62);
    const attendanceTrend = calculateTrend(92, 90);

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
                        <p className="text-gray-600">Welcome back! Here's your academic overview</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <div className="pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg">
                                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                            </div>
                        </div>
                        <button className="p-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 relative">
                            <Bell size={18} />
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                                3
                            </span>
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Current GPA</h3>
                                <p className="text-2xl font-bold text-gray-800 mt-1">{stats.gpa}</p>
                            </div>
                            <div className={`p-2 rounded-lg ${gpaTrend.positive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                                }`}>
                                <div className="flex items-center gap-1">
                                    {gpaTrend.direction === 'up' ? (
                                        <TrendingUp size={16} />
                                    ) : (
                                        <TrendingDown size={16} />
                                    )}
                                    <span className="text-xs font-medium">{gpaTrend.value}</span>
                                </div>
                            </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                            <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${(stats.gpa / 4.0) * 100}%` }}
                            ></div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Attendance</h3>
                                <p className="text-2xl font-bold text-gray-800 mt-1">{stats.attendance}%</p>
                            </div>
                            <div className={`p-2 rounded-lg ${attendanceTrend.positive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                                }`}>
                                <div className="flex items-center gap-1">
                                    {attendanceTrend.direction === 'up' ? (
                                        <TrendingUp size={16} />
                                    ) : (
                                        <TrendingDown size={16} />
                                    )}
                                    <span className="text-xs font-medium">{attendanceTrend.value}%</span>
                                </div>
                            </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                            <div
                                className="bg-green-500 h-2 rounded-full"
                                style={{ width: `${stats.attendance}%` }}
                            ></div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Courses</h3>
                                <p className="text-2xl font-bold text-gray-800 mt-1">{stats.courses}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Credits</h3>
                                <p className="text-2xl font-bold text-gray-800 mt-1">{stats.credits}</p>
                            </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                            <div
                                className="bg-purple-500 h-2 rounded-full"
                                style={{ width: `${(stats.credits / 128) * 100}%` }}
                            ></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Degree progress: {Math.round((stats.credits / 128) * 100)}%</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Recent Grades */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-800">Recent Grades</h2>
                                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                                    View All
                                </button>
                            </div>

                            <div className="space-y-4">
                                {recentGrades.map((grade, index) => (
                                    <div key={index} className="p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="font-medium text-gray-800">{grade.course}: {grade.title}</h3>
                                                <div className="flex items-center gap-4 mt-2">
                                                    <span className={`text-lg font-bold ${grade.grade === 'A' ? 'text-green-600' :
                                                            grade.grade.startsWith('B') ? 'text-blue-600' :
                                                                grade.grade.startsWith('C') ? 'text-yellow-600' :
                                                                    'text-red-600'
                                                        }`}>
                                                        {grade.grade}
                                                    </span>
                                                    <span className="text-gray-800 font-medium">{grade.score}%</span>
                                                    <span className="text-sm text-gray-500">Class avg: {grade.average}%</span>
                                                </div>
                                            </div>
                                            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${grade.score >= grade.average + 10 ? 'bg-green-100 text-green-700' :
                                                    grade.score >= grade.average ? 'bg-blue-100 text-blue-700' :
                                                        'bg-red-100 text-red-700'
                                                }`}>
                                                {grade.score >= grade.average + 10 ? (
                                                    <>
                                                        <TrendingUp size={12} />
                                                        <span>Well above</span>
                                                    </>
                                                ) : grade.score >= grade.average ? (
                                                    <>
                                                        <BarChart2 size={12} />
                                                        <span>Above avg</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <AlertCircle size={12} />
                                                        <span>Below avg</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Upcoming Tasks */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-800">Upcoming Tasks</h2>
                                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                                    View All
                                </button>
                            </div>

                            <div className="space-y-4">
                                {upcomingTasks.map(task => (
                                    <div key={task.id} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                        <div className="flex items-start gap-3">
                                            <div className={`p-2 rounded-lg ${task.type === 'exam' ? 'bg-red-100 text-red-600' :
                                                    task.type === 'assignment' ? 'bg-blue-100 text-blue-600' :
                                                        'bg-purple-100 text-purple-600'
                                                }`}>
                                                {task.type === 'exam' ? (
                                                    <FileText size={16} />
                                                ) : task.type === 'assignment' ? (
                                                    <BookOpen size={16} />
                                                ) : (
                                                    <GraduationCap size={16} />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-medium text-gray-800">{task.course}: {task.title}</h3>
                                                <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                                                    <Calendar size={14} />
                                                    <span>
                                                        Due {new Date(task.due).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className={`text-xs font-medium px-2 py-1 rounded-full ${task.status === 'in-progress' ? 'bg-yellow-100 text-yellow-700' :
                                                    task.status === 'pending' ? 'bg-blue-100 text-blue-700' :
                                                        'bg-gray-100 text-gray-700'
                                                }`}>
                                                {task.status === 'in-progress' ? 'In Progress' :
                                                    task.status === 'pending' ? 'Pending' : 'Not Started'}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Announcements */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Announcements</h2>

                            <div className="space-y-4">
                                {announcements.map(announcement => (
                                    <div key={announcement.id} className="pb-4 border-b border-gray-200 last:border-b-0 last:pb-0">
                                        <h3 className="font-medium text-gray-800">{announcement.title}</h3>
                                        <div className="flex items-center justify-between mt-1">
                                            <p className="text-sm text-gray-600">{announcement.source}</p>
                                            <p className="text-xs text-gray-500">
                                                {new Date(announcement.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OverviewPage;