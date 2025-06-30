"use client"

import React, { useState } from 'react';
import {
    BookOpen,
    Award,
    TrendingUp,
    TrendingDown,
    BarChart2,
    Download,
    Filter,
    Search,
    ChevronDown,
    ChevronUp,
    Info
} from 'lucide-react';

const GradesPage = () => {
    const [activeSemester, setActiveSemester] = useState('Fall 2023');
    const [expandedCourse, setExpandedCourse] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Sample data
    const semesters = [
        {
            name: 'Fall 2023',
            gpa: 3.72,
            credits: 15,
            courses: [
                {
                    id: 1,
                    code: 'CS-401',
                    name: 'Advanced Algorithms',
                    instructor: 'Dr. Smith',
                    creditHours: 3,
                    grade: 'A',
                    gradePoints: 12.0,
                    exams: [
                        { name: 'Midterm Exam', score: 88, weight: 30, average: 72 },
                        { name: 'Final Exam', score: 92, weight: 40, average: 78 },
                        { name: 'Project', score: 95, weight: 30, average: 85 }
                    ]
                },
                {
                    id: 2,
                    code: 'MATH-310',
                    name: 'Discrete Mathematics',
                    instructor: 'Prof. Johnson',
                    creditHours: 4,
                    grade: 'B+',
                    gradePoints: 13.2,
                    exams: [
                        { name: 'Midterm 1', score: 82, weight: 25, average: 75 },
                        { name: 'Midterm 2', score: 78, weight: 25, average: 70 },
                        { name: 'Final Exam', score: 85, weight: 50, average: 73 }
                    ]
                },
                {
                    id: 3,
                    code: 'ENG-205',
                    name: 'Technical Writing',
                    instructor: 'Prof. Williams',
                    creditHours: 3,
                    grade: 'A-',
                    gradePoints: 11.1,
                    exams: [
                        { name: 'Research Paper', score: 90, weight: 40, average: 82 },
                        { name: 'Presentations', score: 88, weight: 30, average: 75 },
                        { name: 'Final Portfolio', score: 92, weight: 30, average: 85 }
                    ]
                }
            ]
        },
        {
            name: 'Spring 2023',
            gpa: 3.58,
            credits: 16,
            courses: [
                {
                    id: 4,
                    code: 'CS-302',
                    name: 'Data Structures',
                    instructor: 'Dr. Lee',
                    creditHours: 4,
                    grade: 'B+',
                    gradePoints: 13.2,
                    exams: []
                },
                {
                    id: 5,
                    code: 'PHYS-201',
                    name: 'Physics II',
                    instructor: 'Prof. Chen',
                    creditHours: 4,
                    grade: 'B',
                    gradePoints: 12.0,
                    exams: []
                }
            ]
        }
    ];

    const currentSemester = semesters.find(sem => sem.name === activeSemester);
    const filteredCourses = currentSemester?.courses.filter(course =>
        course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.code.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    const toggleCourseExpand = (courseId) => {
        setExpandedCourse(expandedCourse === courseId ? null : courseId);
    };

    const getGradeColor = (grade) => {
        switch (grade) {
            case 'A': case 'A-': return 'text-green-600';
            case 'B+': case 'B': return 'text-blue-600';
            case 'C+': case 'C': return 'text-yellow-600';
            case 'D': return 'text-orange-600';
            case 'F': return 'text-red-600';
            default: return 'text-gray-600';
        }
    };

    const calculateProgress = (score, average) => {
        const diff = score - average;
        const percentage = Math.min(Math.max((diff / 30) * 100, -100), 100);
        return percentage;
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Academic Grades</h1>
                        <p className="text-gray-600">View your exam results and academic progress</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search courses..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 w-full sm:w-64 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div className="relative">
                            <select
                                value={activeSemester}
                                onChange={(e) => setActiveSemester(e.target.value)}
                                className="px-4 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                            >
                                {semesters.map(semester => (
                                    <option key={semester.name} value={semester.name}>
                                        {semester.name}
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

                {/* GPA Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium text-gray-500">Semester GPA</h3>
                            <Award className="w-5 h-5 text-blue-500" />
                        </div>
                        <p className="text-2xl font-bold text-gray-800 mt-2">{currentSemester.gpa}</p>
                        <div className="flex items-center gap-1 mt-1">
                            <TrendingUp className="w-4 h-4 text-green-500" />
                            <span className="text-xs text-gray-500">+0.14 from previous</span>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium text-gray-500">Credit Hours</h3>
                            <BookOpen className="w-5 h-5 text-purple-500" />
                        </div>
                        <p className="text-2xl font-bold text-gray-800 mt-2">{currentSemester.credits}</p>
                        <p className="text-xs text-gray-500 mt-1">Current semester</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium text-gray-500">Cumulative GPA</h3>
                            <BarChart2 className="w-5 h-5 text-green-500" />
                        </div>
                        <p className="text-2xl font-bold text-gray-800 mt-2">3.65</p>
                        <div className="flex items-center gap-2 mt-1">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-green-500 h-2 rounded-full"
                                    style={{ width: `${(3.65 / 4.0) * 100}%` }}
                                ></div>
                            </div>
                            <span className="text-xs text-gray-500">91% of 4.0</span>
                        </div>
                    </div>
                </div>

                {/* Grades Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Course
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Instructor
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Credits
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Grade
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Points
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Details
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredCourses.length > 0 ? (
                                    filteredCourses.map(course => (
                                        <React.Fragment key={course.id}>
                                            <tr className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="font-medium text-gray-900">{course.code}</div>
                                                    <div className="text-sm text-gray-500">{course.name}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                                                    {course.instructor}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                                                    {course.creditHours}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`font-bold ${getGradeColor(course.grade)}`}>
                                                        {course.grade}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                                                    {course.gradePoints.toFixed(1)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <button
                                                        onClick={() => toggleCourseExpand(course.id)}
                                                        className="text-blue-600 hover:text-blue-800"
                                                    >
                                                        {expandedCourse === course.id ? (
                                                            <ChevronUp className="w-5 h-5" />
                                                        ) : (
                                                            <ChevronDown className="w-5 h-5" />
                                                        )}
                                                    </button>
                                                </td>
                                            </tr>

                                            {expandedCourse === course.id && (
                                                <tr>
                                                    <td colSpan="6" className="px-6 py-4 bg-gray-50">
                                                        <div className="pl-8 pr-4">
                                                            <h4 className="font-medium text-gray-800 mb-3">Exam Results</h4>
                                                            <div className="space-y-4">
                                                                {course.exams.length > 0 ? (
                                                                    course.exams.map((exam, index) => {
                                                                        const progress = calculateProgress(exam.score, exam.average);
                                                                        return (
                                                                            <div key={index} className="border border-gray-200 rounded-lg p-4">
                                                                                <div className="flex justify-between items-center mb-2">
                                                                                    <h5 className="font-medium text-gray-800">{exam.name}</h5>
                                                                                    <div className="flex items-center gap-4">
                                                                                        <div className="text-center">
                                                                                            <span className="font-bold text-gray-900">{exam.score}%</span>
                                                                                            <span className="text-xs text-gray-500 ml-1">(You)</span>
                                                                                        </div>
                                                                                        <div className="text-center">
                                                                                            <span className="text-gray-700">{exam.average}%</span>
                                                                                            <span className="text-xs text-gray-500 ml-1">(Avg)</span>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="flex items-center gap-4">
                                                                                    <div className="flex-1">
                                                                                        <div className="relative pt-1">
                                                                                            <div className="flex items-center justify-between">
                                                                                                <div>
                                                                                                    <span className={`text-xs font-semibold inline-block ${progress >= 0 ? 'text-green-600' : 'text-red-600'
                                                                                                        }`}>
                                                                                                        {progress >= 0 ? '+' : ''}{Math.round(progress)}%
                                                                                                    </span>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                                                                                                <div
                                                                                                    style={{ width: `${Math.abs(progress)}%` }}
                                                                                                    className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${progress >= 0 ? 'bg-green-500' : 'bg-red-500'
                                                                                                        }`}
                                                                                                ></div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                    <span className="text-xs text-gray-500">{exam.weight}% weight</span>
                                                                                </div>
                                                                            </div>
                                                                        );
                                                                    })
                                                                ) : (
                                                                    <div className="text-center py-4 text-gray-500">
                                                                        No exam details available
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-8 text-center">
                                            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                                <Search className="w-8 h-8 text-gray-400" />
                                            </div>
                                            <h3 className="text-lg font-medium text-gray-900">No courses found</h3>
                                            <p className="text-gray-500 mt-1">Try adjusting your search or select a different semester</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* GPA Explanation */}
                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                        <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                            <h3 className="font-medium text-blue-800">How GPA is Calculated</h3>
                            <p className="text-sm text-blue-700 mt-1">
                                GPA is calculated by multiplying the grade points for each course by its credit hours,
                                summing these values, and then dividing by the total credit hours attempted.
                                A = 4.0, A- = 3.7, B+ = 3.3, B = 3.0, B- = 2.7, and so on.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GradesPage;