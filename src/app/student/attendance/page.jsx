// "use client"

// import React, { useState } from 'react';
// import {
//     Calendar,
//     ChevronDown,
//     ChevronUp,
//     CheckCircle2,
//     XCircle,
//     Clock,
//     Filter,
//     Download,
//     Search
// } from 'lucide-react';

// const AttendancePage = () => {
//     const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
//     const [expandedCourse, setExpandedCourse] = useState(null);
//     const [searchTerm, setSearchTerm] = useState('');

//     // Sample data
//     const courses = [
//         {
//             id: 1,
//             code: 'CS-401',
//             name: 'Advanced Algorithms',
//             instructor: 'Dr. Smith',
//             schedule: 'Mon/Wed 10:00-11:30',
//             attendance: {
//                 present: 12,
//                 absent: 2,
//                 percentage: 86
//             },
//             sessions: [
//                 { date: '2023-06-05', status: 'present', topic: 'Divide and Conquer' },
//                 { date: '2023-06-07', status: 'present', topic: 'Dynamic Programming' },
//                 { date: '2023-06-12', status: 'absent', topic: 'Greedy Algorithms' },
//                 { date: '2023-06-14', status: 'present', topic: 'Backtracking' },
//                 { date: '2023-06-19', status: 'present', topic: 'Graph Algorithms' },
//                 { date: '2023-06-21', status: 'present', topic: 'NP-Completeness' }
//             ]
//         },
//         {
//             id: 2,
//             code: 'MATH-310',
//             name: 'Discrete Mathematics',
//             instructor: 'Prof. Johnson',
//             schedule: 'Tue/Thu 13:00-14:30',
//             attendance: {
//                 present: 10,
//                 absent: 4,
//                 percentage: 71
//             },
//             sessions: [
//                 { date: '2023-06-06', status: 'present', topic: 'Number Theory' },
//                 { date: '2023-06-08', status: 'absent', topic: 'Combinatorics' },
//                 { date: '2023-06-13', status: 'present', topic: 'Graph Theory' },
//                 { date: '2023-06-15', status: 'absent', topic: 'Probability' },
//                 { date: '2023-06-20', status: 'present', topic: 'Logic' },
//                 { date: '2023-06-22', status: 'present', topic: 'Proof Techniques' }
//             ]
//         }
//     ];

//     const months = [
//         'January', 'February', 'March', 'April', 'May', 'June',
//         'July', 'August', 'September', 'October', 'November', 'December'
//     ];

//     const toggleCourseExpand = (courseId) => {
//         setExpandedCourse(expandedCourse === courseId ? null : courseId);
//     };

//     const filteredCourses = courses.filter(course =>
//         course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//     return (
//         <div className="min-h-screen bg-gray-50 p-4 md:p-6">
//             <div className="max-w-6xl mx-auto">
//                 {/* Header */}
//                 <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
//                     <div>
//                         <h1 className="text-2xl font-bold text-gray-800">Attendance Records</h1>
//                         <p className="text-gray-600">Track your class attendance</p>
//                     </div>

//                     <div className="flex flex-col sm:flex-row gap-2">
//                         <div className="relative">
//                             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//                             <input
//                                 type="text"
//                                 placeholder="Search courses..."
//                                 value={searchTerm}
//                                 onChange={(e) => setSearchTerm(e.target.value)}
//                                 className="pl-10 pr-4 py-2 w-full sm:w-64 border border-gray-300 text-black rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                             />
//                         </div>
//                         <div className="relative">
//                             <select
//                                 value={selectedMonth}
//                                 onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
//                                 className="px-4 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none text-black"
//                             >
//                                 {months.map((month, index) => (
//                                     <option key={month} value={index}>
//                                         {month}
//                                     </option>
//                                 ))}
//                             </select>
//                             <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
//                         </div>
//                         <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
//                             <Download size={16} />
//                             Export
//                         </button>
//                     </div>
//                 </div>

//                 {/* Attendance Summary Cards */}
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//                     <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
//                         <div className="flex items-center justify-between">
//                             <h3 className="text-sm font-medium text-gray-500">Total Classes</h3>
//                             <Calendar className="w-5 h-5 text-gray-400" />
//                         </div>
//                         <p className="text-2xl font-bold text-gray-800 mt-2">24</p>
//                         <p className="text-xs text-gray-500 mt-1">This semester</p>
//                     </div>
//                     <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
//                         <div className="flex items-center justify-between">
//                             <h3 className="text-sm font-medium text-gray-500">Present</h3>
//                             <CheckCircle2 className="w-5 h-5 text-green-500" />
//                         </div>
//                         <p className="text-2xl font-bold text-gray-800 mt-2">20</p>
//                         <div className="flex items-center gap-2 mt-1">
//                             <div className="w-full bg-gray-200 rounded-full h-2">
//                                 <div
//                                     className="bg-green-500 h-2 rounded-full"
//                                     style={{ width: '83%' }}
//                                 ></div>
//                             </div>
//                             <span className="text-xs text-gray-500">83%</span>
//                         </div>
//                     </div>
//                     <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
//                         <div className="flex items-center justify-between">
//                             <h3 className="text-sm font-medium text-gray-500">Absent</h3>
//                             <XCircle className="w-5 h-5 text-red-500" />
//                         </div>
//                         <p className="text-2xl font-bold text-gray-800 mt-2">4</p>
//                         <div className="flex items-center gap-2 mt-1">
//                             <div className="w-full bg-gray-200 rounded-full h-2">
//                                 <div
//                                     className="bg-red-500 h-2 rounded-full"
//                                     style={{ width: '17%' }}
//                                 ></div>
//                             </div>
//                             <span className="text-xs text-gray-500">17%</span>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Course Attendance List */}
//                 <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//                     {filteredCourses.length > 0 ? (
//                         filteredCourses.map(course => (
//                             <div key={course.id} className="border-b border-gray-200 last:border-b-0">
//                                 <div
//                                     className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
//                                     onClick={() => toggleCourseExpand(course.id)}
//                                 >
//                                     <div className="flex items-center justify-between">
//                                         <div>
//                                             <h3 className="font-medium text-gray-800">
//                                                 {course.code} - {course.name}
//                                             </h3>
//                                             <p className="text-sm text-gray-600 mt-1">
//                                                 {course.instructor} • {course.schedule}
//                                             </p>
//                                         </div>
//                                         <div className="flex items-center gap-4">
//                                             <div className="text-center">
//                                                 <span className={`text-sm font-medium ${course.attendance.percentage >= 80 ? 'text-green-600' :
//                                                         course.attendance.percentage >= 60 ? 'text-blue-600' : 'text-red-600'
//                                                     }`}>
//                                                     {course.attendance.percentage}%
//                                                 </span>
//                                                 <p className="text-xs text-gray-500">Attendance</p>
//                                             </div>
//                                             {expandedCourse === course.id ? (
//                                                 <ChevronUp className="w-5 h-5 text-gray-500" />
//                                             ) : (
//                                                 <ChevronDown className="w-5 h-5 text-gray-500" />
//                                             )}
//                                         </div>
//                                     </div>
//                                 </div>

//                                 {expandedCourse === course.id && (
//                                     <div className="px-4 pb-4">
//                                         <div className="overflow-x-auto">
//                                             <table className="min-w-full divide-y divide-gray-200">
//                                                 <thead className="bg-gray-50">
//                                                     <tr>
//                                                         <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                                             Date
//                                                         </th>
//                                                         <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                                             Status
//                                                         </th>
//                                                         <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                                             Topic
//                                                         </th>
//                                                     </tr>
//                                                 </thead>
//                                                 <tbody className="bg-white divide-y divide-gray-200">
//                                                     {course.sessions.map((session, index) => (
//                                                         <tr key={index}>
//                                                             <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">
//                                                                 {new Date(session.date).toLocaleDateString('en-US', {
//                                                                     weekday: 'short',
//                                                                     month: 'short',
//                                                                     day: 'numeric'
//                                                                 })}
//                                                             </td>
//                                                             <td className="px-4 py-3 whitespace-nowrap">
//                                                                 {session.status === 'present' ? (
//                                                                     <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
//                                                                         <CheckCircle2 className="w-3 h-3" /> Present
//                                                                     </span>
//                                                                 ) : (
//                                                                     <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
//                                                                         <XCircle className="w-3 h-3" /> Absent
//                                                                     </span>
//                                                                 )}
//                                                             </td>
//                                                             <td className="px-4 py-3 text-sm text-gray-800">
//                                                                 {session.topic}
//                                                             </td>
//                                                         </tr>
//                                                     ))}
//                                                 </tbody>
//                                             </table>
//                                         </div>
//                                     </div>
//                                 )}
//                             </div>
//                         ))
//                     ) : (
//                         <div className="p-8 text-center">
//                             <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
//                                 <Search className="w-8 h-8 text-gray-400" />
//                             </div>
//                             <h3 className="text-lg font-medium text-gray-900">No courses found</h3>
//                             <p className="text-gray-500 mt-1">Try adjusting your search or filter</p>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default AttendancePage;


// "use client";

// import React, { useEffect, useState } from 'react';
// import {
//     Calendar, ChevronDown, ChevronUp, CheckCircle2, XCircle, Download, Search
// } from 'lucide-react';
// import axios from 'axios';

// const AttendancePage = ({ params }) => {
//     const studentId = "686cd25835e2bb6cdeda5ea2"; // from dynamic route /students/[id]/attendance
//     const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
//     const [searchTerm, setSearchTerm] = useState('');
//     const [expandedSubject, setExpandedSubject] = useState(null);
//     const [subjects, setSubjects] = useState([]);


//     const months = [
//         'January', 'February', 'March', 'April', 'May', 'June',
//         'July', 'August', 'September', 'October', 'November', 'December'
//     ];
//     const toggleExpand = (code) => {
//         setExpandedSubject(expandedSubject === code ? null : code);
//     };

//     const fetchStudentData = async () => {
//         try {
//             const res = await axios.get(`/api/students/${studentId}/academics`);
//             const { academic, attendance } = res.data;

//             const subjectMap = {};

//             // Map subjects
//             academic?.years?.[0]?.divisions?.[0]?.subjects?.forEach(subject => {
//                 subjectMap[subject.name] = {
//                     code: subject.code || subject.name,
//                     name: subject.name,
//                     teacher: subject.teacherName,
//                     sessions: [],
//                     present: 0,
//                     total: 0,
//                 };
//             });

//             // Add attendance per subject
//             attendance.forEach((record) => {
//                 const subj = subjectMap[record.subject];
//                 if (subj) {
//                     subj.sessions.push({
//                         date: record.date,
//                         status: record.isPresent ? 'present' : 'absent',
//                         topic: record.topicName
//                     });
//                     subj.total += 1;
//                     if (record.isPresent) subj.present += 1;
//                 }
//             });

//             // Calculate percentage
//             const finalSubjects = Object.values(subjectMap).map(subj => ({
//                 ...subj,
//                 percentage: subj.total === 0 ? 0 : Math.round((subj.present / subj.total) * 100)
//             }));

//             setSubjects(finalSubjects);
//         } catch (err) {
//             console.error('Error fetching data', err);
//         }
//     };

//     useEffect(() => {
//         fetchStudentData();
//     }, []);

//     const filteredSubjects = subjects.filter(subject =>
//         subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         subject.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         subject.teacher.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//     return (
//         <div className="min-h-screen bg-gray-50 p-4 md:p-6">
//             <div className="max-w-6xl mx-auto">
//                 <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
//                     <div>
//                         <h1 className="text-2xl font-bold text-gray-800">Attendance Records</h1>
//                         <p className="text-gray-600">Track your subject-wise attendance</p>
//                     </div>

//                     <div className="flex flex-col sm:flex-row gap-2">
//                         <div className="relative">
//                             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//                             <input
//                                 type="text"
//                                 placeholder="Search subjects..."
//                                 value={searchTerm}
//                                 onChange={(e) => setSearchTerm(e.target.value)}
//                                 className="pl-10 pr-4 py-2 w-full sm:w-64 border border-gray-300 text-black rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                             />
//                         </div>
//                         {/*------------------------------ */}
//                         <div className="relative">
//                             <select
//                                 value={selectedMonth}
//                                 onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
//                                 className="px-4 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none text-black"
//                             >
//                                 {months.map((month, index) => (
//                                     <option key={month} value={index}>
//                                         {month}
//                                     </option>
//                                 ))}
//                             </select>
//                             <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
//                         </div>
//                         {/*------------------------------ */}
//                         <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
//                             <Download size={16} />
//                             Export
//                         </button>
//                     </div>
//                 </div>

//                 {/* Subjects List */}
//                 <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//                     {filteredSubjects.length > 0 ? (
//                         filteredSubjects.map(subject => (
//                             <div key={subject.code} className="border-b border-gray-200">
//                                 <div
//                                     className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
//                                     onClick={() => toggleExpand(subject.code)}
//                                 >
//                                     {/* <div className="flex items-center justify-between">
//                                         <div>
//                                             <h3 className="font-medium text-gray-800">
//                                                 {subject.name}
//                                             </h3>
//                                             <p className="text-sm text-gray-600 mt-1">
//                                                 {subject.teacher}
//                                             </p>
//                                         </div>
//                                         <div className="flex items-center gap-4">
//                                             <div className="text-center">
//                                                 <span className={`text-sm font-medium ${subject.percentage >= 80 ? 'text-green-600' :
//                                                         subject.percentage >= 60 ? 'text-blue-600' : 'text-red-600'
//                                                     }`}>
//                                                     {subject.percentage}%
//                                                 </span>
//                                                 <p className="text-xs text-gray-500">Attendance</p>
//                                             </div>
//                                             {expandedSubject === subject.code ? (
//                                                 <ChevronUp className="w-5 h-5 text-gray-500" />
//                                             ) : (
//                                                 <ChevronDown className="w-5 h-5 text-gray-500" />
//                                             )}
//                                         </div>
//                                     </div> */}

//                                     <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
//                                         {/* Left Side: Subject Name, Teacher Name, and Stats */}
//                                         <div className="flex flex-col">
//                                             <div className="flex flex-wrap items-center gap-4">
//                                                 <h3 className="font-medium text-gray-800 text-base">{subject.name}</h3>
//                                                 <div className="flex items-center gap-3 text-sm text-gray-600">
//                                                     <span>Total: <span className="font-semibold text-gray-800">{subject.total}</span></span>
//                                                     <span>Present: <span className="font-semibold text-green-600">{subject.present}</span></span>
//                                                     <span>Absent: <span className="font-semibold text-red-600">{subject.total - subject.present}</span></span>
//                                                 </div>
//                                             </div>
//                                             <p className="text-sm text-gray-600 mt-1">{subject.teacher}</p>
//                                         </div>

//                                         {/* Right Side: % Attendance + Chevron */}
//                                         <div className="flex items-center gap-4">
//                                             <div className="text-center">
//                                                 <span
//                                                     className={`text-sm font-medium ${subject.percentage >= 80
//                                                             ? 'text-green-600'
//                                                             : subject.percentage >= 60
//                                                                 ? 'text-blue-600'
//                                                                 : 'text-red-600'
//                                                         }`}
//                                                 >
//                                                     {subject.percentage}%
//                                                 </span>
//                                                 <p className="text-xs text-gray-500">Attendance</p>
//                                             </div>
//                                             {expandedSubject === subject.code ? (
//                                                 <ChevronUp className="w-5 h-5 text-gray-500" />
//                                             ) : (
//                                                 <ChevronDown className="w-5 h-5 text-gray-500" />
//                                             )}
//                                         </div>
//                                     </div>

//                                 </div>

//                                 {expandedSubject === subject.code && (
//                                     <div className="px-4 pb-4">
//                                         <div className="overflow-x-auto">
//                                             <table className="min-w-full divide-y divide-gray-200">
//                                                 <thead className="bg-gray-50">
//                                                     <tr>
//                                                         <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
//                                                         <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
//                                                         <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Topic</th>
//                                                     </tr>
//                                                 </thead>
//                                                 <tbody className="bg-white divide-y divide-gray-200">
//                                                     {subject.sessions.map((session, idx) => (
//                                                         <tr key={idx}>
//                                                             <td className="px-4 py-3 text-sm text-gray-800">
//                                                                 {new Date(session.date).toLocaleDateString('en-US', {
//                                                                     weekday: 'short',
//                                                                     month: 'short',
//                                                                     day: 'numeric'
//                                                                 })}
//                                                             </td>
//                                                             <td className="px-4 py-3">
//                                                                 {session.status === 'present' ? (
//                                                                     <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
//                                                                         <CheckCircle2 className="w-3 h-3" /> Present
//                                                                     </span>
//                                                                 ) : (
//                                                                     <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
//                                                                         <XCircle className="w-3 h-3" /> Absent
//                                                                     </span>
//                                                                 )}
//                                                             </td>
//                                                             <td className="px-4 py-3 text-sm text-gray-800">
//                                                                 {session.topic}
//                                                             </td>
//                                                         </tr>
//                                                     ))}
//                                                 </tbody>
//                                             </table>
//                                         </div>
//                                     </div>
//                                 )}
//                             </div>
//                         ))
//                     ) : (
//                         <div className="p-8 text-center text-gray-500">No subjects found</div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default AttendancePage;


// "use client";

// import React, { useEffect, useState } from 'react';
// import {
//     Calendar, ChevronDown, ChevronUp, CheckCircle2, XCircle, Download, Search,
//     BookOpen, User, TrendingUp, Award, AlertCircle, Filter
// } from 'lucide-react';
// import axios from 'axios';

// const AttendancePage = ({ params }) => {
//     const studentId = "686cd25835e2bb6cdeda5ea2"; // from dynamic route /students/[id]/attendance
//     const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
//     const [searchTerm, setSearchTerm] = useState('');
//     const [expandedSubject, setExpandedSubject] = useState(null);
//     const [subjects, setSubjects] = useState([]);
//     const [hoveredCard, setHoveredCard] = useState(null);
//     const [loading, setLoading] = useState(true);

//     const months = [
//         'January', 'February', 'March', 'April', 'May', 'June',
//         'July', 'August', 'September', 'October', 'November', 'December'
//     ];

//     const toggleExpand = (code) => {
//         setExpandedSubject(expandedSubject === code ? null : code);
//     };

//     const fetchStudentData = async () => {
//         try {
//             setLoading(true);
//             const res = await axios.get(`/api/students/${studentId}/academics`);
//             const { academic, attendance } = res.data;

//             const subjectMap = {};

//             // Map subjects
//             academic?.years?.[0]?.divisions?.[0]?.subjects?.forEach(subject => {
//                 subjectMap[subject.name] = {
//                     code: subject.code || subject.name,
//                     name: subject.name,
//                     teacher: subject.teacherName,
//                     sessions: [],
//                     present: 0,
//                     total: 0,
//                 };
//             });

//             // Add attendance per subject
//             attendance.forEach((record) => {
//                 const subj = subjectMap[record.subject];
//                 if (subj) {
//                     subj.sessions.push({
//                         date: record.date,
//                         status: record.isPresent ? 'present' : 'absent',
//                         topic: record.topicName
//                     });
//                     subj.total += 1;
//                     if (record.isPresent) subj.present += 1;
//                 }
//             });

//             // Calculate percentage and add trend data
//             const finalSubjects = Object.values(subjectMap).map(subj => {
//                 const percentage = subj.total === 0 ? 0 : Math.round((subj.present / subj.total) * 100);
                
//                 // Calculate trend based on last 5 sessions
//                 const recentSessions = subj.sessions.slice(-5);
//                 const recentPresent = recentSessions.filter(s => s.status === 'present').length;
//                 const recentPercentage = recentSessions.length > 0 ? (recentPresent / recentSessions.length) * 100 : 0;
                
//                 return {
//                     ...subj,
//                     percentage,
//                     recentTrend: recentPercentage >= percentage ? 'up' : 'down',
//                     lastClass: subj.sessions.length > 0 ? 
//                         new Date(subj.sessions[subj.sessions.length - 1].date).toLocaleDateString('en-US', {
//                             month: 'short',
//                             day: 'numeric'
//                         }) : 'No classes'
//                 };
//             });

//             setSubjects(finalSubjects);
//         } catch (err) {
//             console.error('Error fetching data', err);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchStudentData();
//     }, []);

//     const filteredSubjects = subjects.filter(subject =>
//         subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         subject.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         subject.teacher.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//     const getAttendanceColor = (percentage) => {
//         if (percentage >= 90) return 'emerald';
//         if (percentage >= 80) return 'blue';
//         if (percentage >= 70) return 'amber';
//         return 'red';
//     };

//     const getAttendanceGradient = (percentage) => {
//         if (percentage >= 90) return 'from-emerald-500 to-emerald-600';
//         if (percentage >= 80) return 'from-blue-500 to-blue-600';
//         if (percentage >= 70) return 'from-amber-500 to-amber-600';
//         return 'from-red-500 to-red-600';
//     };

//     if (loading) {
//         return (
//             <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
//                 <div className="max-w-6xl mx-auto">
//                     <div className="animate-pulse">
//                         <div className="h-8 bg-gray-300 rounded w-1/4 mb-4"></div>
//                         <div className="space-y-4">
//                             {[1, 2, 3].map(i => (
//                                 <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
//                                     <div className="h-6 bg-gray-300 rounded w-1/3 mb-2"></div>
//                                     <div className="h-4 bg-gray-300 rounded w-1/4"></div>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
//             <div className="max-w-6xl mx-auto">
//                 {/* Header */}
//                 <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
//                     <div>
//                         <h1 className="text-3xl font-bold text-gray-900 mb-2">Attendance Dashboard</h1>
//                         <p className="text-gray-600">Track your academic progress and attendance</p>
//                     </div>

//                     <div className="flex flex-col sm:flex-row gap-3">
//                         <div className="relative">
//                             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//                             <input
//                                 type="text"
//                                 placeholder="Search subjects..."
//                                 value={searchTerm}
//                                 onChange={(e) => setSearchTerm(e.target.value)}
//                                 className="pl-10 pr-4 py-2 w-full sm:w-64 border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white shadow-sm"
//                             />
//                         </div>
//                         <div className="relative">
//                             <select
//                                 value={selectedMonth}
//                                 onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
//                                 className="px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none text-gray-900 bg-white shadow-sm"
//                             >
//                                 {months.map((month, index) => (
//                                     <option key={month} value={index}>
//                                         {month}
//                                     </option>
//                                 ))}
//                             </select>
//                             <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
//                         </div>
//                         <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm">
//                             <Download size={16} />
//                             Export
//                         </button>
//                     </div>
//                 </div>

//                 {/* Subjects List */}
//                 <div className="space-y-4">
//                     {filteredSubjects.length > 0 ? (
//                         filteredSubjects.map((subject) => {
//                             const isExpanded = expandedSubject === subject.code;
//                             const isHovered = hoveredCard === subject.code;

//                             return (
//                                 <div
//                                     key={subject.code}
//                                     className={`bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden transition-all duration-300 transform ${
//                                         isHovered ? 'shadow-xl scale-[1.02]' : 'hover:shadow-xl hover:scale-[1.01]'
//                                     }`}
//                                     onMouseEnter={() => setHoveredCard(subject.code)}
//                                     onMouseLeave={() => setHoveredCard(null)}
//                                 >
//                                     {/* Main Card Content */}
//                                     <div 
//                                         className="p-6 cursor-pointer"
//                                         onClick={() => toggleExpand(subject.code)}
//                                     >
//                                         <div className="flex items-center justify-between">
//                                             {/* Left Section */}
//                                             <div className="flex-1 min-w-0">
//                                                 <div className="flex items-center gap-3 mb-3">
//                                                     <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg">
//                                                         <BookOpen className="w-5 h-5 text-white" />
//                                                     </div>
//                                                     <div>
//                                                         <h3 className="text-xl font-semibold text-gray-900 truncate">{subject.name}</h3>
//                                                         <div className="flex items-center gap-2 text-sm text-gray-600">
//                                                             <User className="w-4 h-4" />
//                                                             <span>{subject.teacher}</span>
//                                                         </div>
//                                                     </div>
//                                                 </div>

//                                                 {/* Stats Row */}
//                                                 <div className="flex items-center gap-4 mt-4">
//                                                     <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full">
//                                                         <Calendar className="w-4 h-4 text-gray-500" />
//                                                         <span className="text-sm text-gray-700">Total: <span className="font-semibold">{subject.total}</span></span>
//                                                     </div>
//                                                     <div className="flex items-center gap-2 px-3 py-1 bg-green-100 rounded-full">
//                                                         <CheckCircle2 className="w-4 h-4 text-green-600" />
//                                                         <span className="text-sm text-green-700">Present: <span className="font-semibold">{subject.present}</span></span>
//                                                     </div>
//                                                     <div className="flex items-center gap-2 px-3 py-1 bg-red-100 rounded-full">
//                                                         <XCircle className="w-4 h-4 text-red-600" />
//                                                         <span className="text-sm text-red-700">Absent: <span className="font-semibold">{subject.total - subject.present}</span></span>
//                                                     </div>
//                                                 </div>
//                                             </div>

//                                             {/* Right Section - Attendance Percentage */}
//                                             <div className="flex items-center gap-4">
//                                                 <div className="text-center">
//                                                     <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r ${getAttendanceGradient(subject.percentage)} text-white shadow-lg`}>
//                                                         <span className="text-2xl font-bold">{subject.percentage}%</span>
//                                                         {subject.recentTrend === 'up' ? (
//                                                             <TrendingUp className="w-5 h-5" />
//                                                         ) : (
//                                                             <AlertCircle className="w-5 h-5" />
//                                                         )}
//                                                     </div>
//                                                     <p className="text-xs text-gray-500 mt-1">Attendance</p>
//                                                 </div>
                                                
//                                                 {/* Expand/Collapse Button */}
//                                                 <button 
//                                                     className={`p-2 rounded-full transition-all duration-200 ${
//                                                         isExpanded 
//                                                             ? 'bg-indigo-100 text-indigo-600 rotate-180' 
//                                                             : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
//                                                     }`}
//                                                 >
//                                                     <ChevronDown className="w-5 h-5" />
//                                                 </button>
//                                             </div>
//                                         </div>

//                                         {/* Progress Bar */}
//                                         <div className="mt-4">
//                                             <div className="w-full bg-gray-200 rounded-full h-2">
//                                                 <div 
//                                                     className={`h-2 rounded-full bg-gradient-to-r ${getAttendanceGradient(subject.percentage)} transition-all duration-500`}
//                                                     style={{ width: `${subject.percentage}%` }}
//                                                 ></div>
//                                             </div>
//                                         </div>
//                                     </div>

//                                     {/* Expanded Content */}
//                                     {isExpanded && (
//                                         <div className="border-t border-gray-100">
//                                             <div className="p-6">
//                                                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//                                                     {/* Attendance Summary */}
//                                                     <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4">
//                                                         <h4 className="font-semibold text-gray-900 mb-2">Summary</h4>
//                                                         <div className="space-y-2 text-sm">
//                                                             <div className="flex justify-between">
//                                                                 <span className="text-gray-600">Classes Attended:</span>
//                                                                 <span className="font-semibold">{subject.present}/{subject.total}</span>
//                                                             </div>
//                                                             <div className="flex justify-between">
//                                                                 <span className="text-gray-600">Last Class:</span>
//                                                                 <span className="font-semibold">{subject.lastClass}</span>
//                                                             </div>
//                                                             <div className="flex justify-between">
//                                                                 <span className="text-gray-600">Trend:</span>
//                                                                 <span className={`font-semibold ${subject.recentTrend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
//                                                                     {subject.recentTrend === 'up' ? '↗ Improving' : '↘ Declining'}
//                                                                 </span>
//                                                             </div>
//                                                         </div>
//                                                     </div>

//                                                     {/* Status Badge */}
//                                                     <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4">
//                                                         <h4 className="font-semibold text-gray-900 mb-2">Status</h4>
//                                                         <div className="flex items-center gap-2">
//                                                             {subject.percentage >= 75 ? (
//                                                                 <>
//                                                                     <Award className="w-5 h-5 text-green-600" />
//                                                                     <span className="text-green-700 font-semibold">Good Standing</span>
//                                                                 </>
//                                                             ) : (
//                                                                 <>
//                                                                     <AlertCircle className="w-5 h-5 text-red-600" />
//                                                                     <span className="text-red-700 font-semibold">Needs Attention</span>
//                                                                 </>
//                                                             )}
//                                                         </div>
//                                                         <p className="text-sm text-gray-600 mt-1">
//                                                             {subject.percentage >= 75 
//                                                                 ? "You're meeting attendance requirements" 
//                                                                 : `Need ${Math.ceil((75 * subject.total / 100) - subject.present)} more classes`
//                                                             }
//                                                         </p>
//                                                     </div>

//                                                     {/* Quick Actions */}
//                                                     <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4">
//                                                         <h4 className="font-semibold text-gray-900 mb-2">Quick Actions</h4>
//                                                         <div className="space-y-2">
//                                                             <button className="w-full px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition-colors">
//                                                                 View Details
//                                                             </button>
//                                                             <button className="w-full px-3 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300 transition-colors">
//                                                                 Set Reminder
//                                                             </button>
//                                                         </div>
//                                                     </div>
//                                                 </div>

//                                                 {/* Attendance Details Table */}
//                                                 <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
//                                                     <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
//                                                         <h4 className="font-semibold text-gray-900">Attendance Details</h4>
//                                                     </div>
//                                                     <div className="overflow-x-auto">
//                                                         <table className="min-w-full divide-y divide-gray-200">
//                                                             <thead className="bg-gray-50">
//                                                                 <tr>
//                                                                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
//                                                                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                                                                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Topic</th>
//                                                                 </tr>
//                                                             </thead>
//                                                             <tbody className="bg-white divide-y divide-gray-200">
//                                                                 {subject.sessions.map((session, idx) => (
//                                                                     <tr key={idx} className="hover:bg-gray-50">
//                                                                         <td className="px-4 py-3 text-sm text-gray-900">
//                                                                             {new Date(session.date).toLocaleDateString('en-US', {
//                                                                                 weekday: 'short',
//                                                                                 month: 'short',
//                                                                                 day: 'numeric'
//                                                                             })}
//                                                                         </td>
//                                                                         <td className="px-4 py-3">
//                                                                             {session.status === 'present' ? (
//                                                                                 <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
//                                                                                     <CheckCircle2 className="w-3 h-3" /> Present
//                                                                                 </span>
//                                                                             ) : (
//                                                                                 <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
//                                                                                     <XCircle className="w-3 h-3" /> Absent
//                                                                                 </span>
//                                                                             )}
//                                                                         </td>
//                                                                         <td className="px-4 py-3 text-sm text-gray-900">
//                                                                             {session.topic || 'No topic recorded'}
//                                                                         </td>
//                                                                     </tr>
//                                                                 ))}
//                                                             </tbody>
//                                                         </table>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     )}
//                                 </div>
//                             );
//                         })
//                     ) : (
//                         <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
//                             <div className="text-gray-400 mb-4">
//                                 <Search className="w-16 h-16 mx-auto" />
//                             </div>
//                             <h3 className="text-xl font-semibold text-gray-900 mb-2">No subjects found</h3>
//                             <p className="text-gray-600">Try adjusting your search terms or check back later.</p>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default AttendancePage;

"use client";

import React, { useEffect, useState } from 'react';
import {
    Calendar, ChevronDown, ChevronUp, CheckCircle2, XCircle, Download, Search,
    BookOpen, User, TrendingUp, Award, AlertCircle, Filter
} from 'lucide-react';
import axios from 'axios';

const AttendancePage = ({ params }) => {
    const studentId = "686cd25835e2bb6cdeda5ea2"; // from dynamic route /students/[id]/attendance
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedSubject, setExpandedSubject] = useState(null);
    const [subjects, setSubjects] = useState([]);
    const [hoveredCard, setHoveredCard] = useState(null);
    const [loading, setLoading] = useState(true);

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const toggleExpand = (code) => {
        setExpandedSubject(expandedSubject === code ? null : code);
    };

    const fetchStudentData = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`/api/students/${studentId}/academics`);
            const { academic, attendance } = res.data;

            const subjectMap = {};

            // Map subjects
            academic?.years?.[0]?.divisions?.[0]?.subjects?.forEach(subject => {
                subjectMap[subject.name] = {
                    code: subject.code || subject.name,
                    name: subject.name,
                    teacher: subject.teacherName,
                    sessions: [],
                    present: 0,
                    total: 0,
                };
            });

            // Add attendance per subject
            attendance.forEach((record) => {
                const subj = subjectMap[record.subject];
                if (subj) {
                    subj.sessions.push({
                        date: record.date,
                        status: record.isPresent ? 'present' : 'absent',
                        topic: record.topicName
                    });
                    subj.total += 1;
                    if (record.isPresent) subj.present += 1;
                }
            });

            // Calculate percentage and add trend data
            const finalSubjects = Object.values(subjectMap).map(subj => {
                const percentage = subj.total === 0 ? 0 : Math.round((subj.present / subj.total) * 100);
                
                // Calculate trend based on last 5 sessions
                const recentSessions = subj.sessions.slice(-5);
                const recentPresent = recentSessions.filter(s => s.status === 'present').length;
                const recentPercentage = recentSessions.length > 0 ? (recentPresent / recentSessions.length) * 100 : 0;
                
                return {
                    ...subj,
                    percentage,
                    recentTrend: recentPercentage >= percentage ? 'up' : 'down',
                    lastClass: subj.sessions.length > 0 ? 
                        new Date(subj.sessions[subj.sessions.length - 1].date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric'
                        }) : 'No classes'
                };
            });

            setSubjects(finalSubjects);
        } catch (err) {
            console.error('Error fetching data', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudentData();
    }, []);

    const filteredSubjects = subjects.filter(subject =>
        subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subject.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subject.teacher.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getAttendanceColor = (percentage) => {
        if (percentage >= 90) return 'green';
        if (percentage >= 80) return 'blue';
        if (percentage >= 70) return 'orange';
        return 'purple';
    };

    const getAttendanceGradient = (percentage) => {
        if (percentage >= 90) return 'from-green-500 to-green-600';
        if (percentage >= 80) return 'from-blue-500 to-blue-600';
        if (percentage >= 70) return 'from-orange-500 to-orange-600';
        return 'from-purple-500 to-purple-600';
    };

    const getCardBackground = (percentage) => {
        if (percentage >= 90) return 'bg-gradient-to-br from-green-50 to-green-100';
        if (percentage >= 80) return 'bg-gradient-to-br from-blue-50 to-blue-100';
        if (percentage >= 70) return 'bg-gradient-to-br from-orange-50 to-orange-100';
        return 'bg-gradient-to-br from-purple-50 to-purple-100';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-6">
                <div className="max-w-6xl mx-auto">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-300 rounded w-1/4 mb-4"></div>
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
                                    <div className="h-6 bg-gray-300 rounded w-1/3 mb-2"></div>
                                    <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Attendance Dashboard</h1>
                        <p className="text-gray-600">Track your academic progress and attendance</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search subjects..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 w-full sm:w-64 border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
                            />
                        </div>
                        <div className="relative">
                            <select
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                                className="px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none text-gray-900 bg-white shadow-sm"
                            >
                                {months.map((month, index) => (
                                    <option key={month} value={index}>
                                        {month}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg">
                            <Download size={16} />
                            Export
                        </button>
                    </div>
                </div>

                {/* Subjects List */}
                <div className="space-y-4">
                    {filteredSubjects.length > 0 ? (
                        filteredSubjects.map((subject) => {
                            const isExpanded = expandedSubject === subject.code;
                            const isHovered = hoveredCard === subject.code;

                            return (
                                <div
                                    key={subject.code}
                                    className={`${getCardBackground(subject.percentage)} rounded-xl shadow-lg border border-white/50 overflow-hidden transition-all duration-300 transform ${
                                        isHovered ? 'shadow-xl scale-[1.02]' : 'hover:shadow-xl hover:scale-[1.01]'
                                    }`}
                                    onMouseEnter={() => setHoveredCard(subject.code)}
                                    onMouseLeave={() => setHoveredCard(null)}
                                >
                                    {/* Main Card Content */}
                                    <div 
                                        className="p-6 cursor-pointer"
                                        onClick={() => toggleExpand(subject.code)}
                                    >
                                        <div className="flex items-center justify-between">
                                            {/* Left Section */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div className={`p-3 rounded-xl ${
                                                        subject.percentage >= 90 ? 'bg-green-500' :
                                                        subject.percentage >= 80 ? 'bg-blue-500' :
                                                        subject.percentage >= 70 ? 'bg-orange-500' : 'bg-purple-500'
                                                    }`}>
                                                        <BookOpen className="w-5 h-5 text-white" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-xl font-semibold text-gray-900 truncate">{subject.name}</h3>
                                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                                            <User className="w-4 h-4" />
                                                            <span>{subject.teacher}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Stats Row */}
                                                <div className="flex items-center gap-4 mt-4">
                                                    <div className="flex items-center gap-2 px-3 py-1 bg-white/60 backdrop-blur-sm rounded-full border border-white/30">
                                                        <Calendar className="w-4 h-4 text-slate-600" />
                                                        <span className="text-sm text-slate-700">Total: <span className="font-semibold">{subject.total}</span></span>
                                                    </div>
                                                    <div className="flex items-center gap-2 px-3 py-1 bg-white/60 backdrop-blur-sm rounded-full border border-white/30">
                                                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                                                        <span className="text-sm text-green-700">Present: <span className="font-semibold">{subject.present}</span></span>
                                                    </div>
                                                    <div className="flex items-center gap-2 px-3 py-1 bg-white/60 backdrop-blur-sm rounded-full border border-white/30">
                                                        <XCircle className="w-4 h-4 text-red-600" />
                                                        <span className="text-sm text-red-700">Absent: <span className="font-semibold">{subject.total - subject.present}</span></span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Right Section - Attendance Percentage */}
                                            <div className="flex items-center gap-4">
                                                <div className="text-center">
                                                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r ${getAttendanceGradient(subject.percentage)} text-white shadow-lg`}>
                                                        <span className="text-2xl font-bold">{subject.percentage}%</span>
                                                        {subject.recentTrend === 'up' ? (
                                                            <TrendingUp className="w-5 h-5" />
                                                        ) : (
                                                            <AlertCircle className="w-5 h-5" />
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-gray-500 mt-1">Attendance</p>
                                                </div>
                                                
                                                {/* Expand/Collapse Button */}
                                                <button 
                                                    className={`p-2 rounded-full transition-all duration-200 ${
                                                        isExpanded 
                                                            ? 'bg-white/70 text-slate-700 rotate-180' 
                                                            : 'bg-white/50 text-slate-600 hover:bg-white/70'
                                                    }`}
                                                >
                                                    <ChevronDown className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Progress Bar */}
                                        <div className="mt-4">
                                            <div className="w-full bg-white/40 backdrop-blur-sm rounded-full h-2">
                                                <div 
                                                    className={`h-2 rounded-full bg-gradient-to-r ${getAttendanceGradient(subject.percentage)} transition-all duration-500`}
                                                    style={{ width: `${subject.percentage}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Expanded Content */}
                                    {isExpanded && (
                                        <div className="border-t border-white/30 bg-white/20 backdrop-blur-sm">
                                            <div className="p-6">
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                                    {/* Attendance Summary */}
                                                    <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                                                        <h4 className="font-semibold text-slate-800 mb-2">Summary</h4>
                                                        <div className="space-y-2 text-sm">
                                                            <div className="flex justify-between">
                                                                <span className="text-slate-600">Classes Attended:</span>
                                                                <span className="font-semibold">{subject.present}/{subject.total}</span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span className="text-slate-600">Last Class:</span>
                                                                <span className="font-semibold">{subject.lastClass}</span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span className="text-slate-600">Trend:</span>
                                                                <span className={`font-semibold ${subject.recentTrend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                                                                    {subject.recentTrend === 'up' ? '↗ Improving' : '↘ Declining'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Status Badge */}
                                                    <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                                                        <h4 className="font-semibold text-slate-800 mb-2">Status</h4>
                                                        <div className="flex items-center gap-2">
                                                            {subject.percentage >= 75 ? (
                                                                <>
                                                                    <Award className="w-5 h-5 text-green-600" />
                                                                    <span className="text-green-700 font-semibold">Good Standing</span>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <AlertCircle className="w-5 h-5 text-red-600" />
                                                                    <span className="text-red-700 font-semibold">Needs Attention</span>
                                                                </>
                                                            )}
                                                        </div>
                                                        <p className="text-sm text-slate-600 mt-1">
                                                            {subject.percentage >= 75 
                                                                ? "You're meeting attendance requirements" 
                                                                : `Need ${Math.ceil((75 * subject.total / 100) - subject.present)} more classes`
                                                            }
                                                        </p>
                                                    </div>

                                                    {/* Quick Actions */}
                                                    <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                                                        <h4 className="font-semibold text-slate-800 mb-2">Quick Actions</h4>
                                                        <div className="space-y-2">
                                                            <button className={`w-full px-3 py-2 ${
                                                                subject.percentage >= 90 ? 'bg-green-500 hover:bg-green-600' :
                                                                subject.percentage >= 80 ? 'bg-blue-500 hover:bg-blue-600' :
                                                                subject.percentage >= 70 ? 'bg-orange-500 hover:bg-orange-600' : 'bg-purple-500 hover:bg-purple-600'
                                                            } text-white rounded-lg text-sm transition-colors`}>
                                                                View Details
                                                            </button>
                                                            <button className="w-full px-3 py-2 bg-white/60 text-slate-700 rounded-lg text-sm hover:bg-white/80 transition-colors">
                                                                Set Reminder
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Attendance Details Table */}
                                                <div className="bg-white/50 backdrop-blur-sm rounded-xl border border-white/30 overflow-hidden">
                                                    <div className="px-4 py-3 bg-white/40 border-b border-white/30">
                                                        <h4 className="font-semibold text-slate-800">Attendance Details</h4>
                                                    </div>
                                                    <div className="overflow-x-auto">
                                                        <table className="min-w-full">
                                                            <thead className="bg-white/30">
                                                                <tr>
                                                                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Date</th>
                                                                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Status</th>
                                                                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Topic</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className="divide-y divide-white/20">
                                                                {subject.sessions.map((session, idx) => (
                                                                    <tr key={idx} className="hover:bg-white/20 transition-colors">
                                                                        <td className="px-4 py-3 text-sm text-slate-800">
                                                                            {new Date(session.date).toLocaleDateString('en-US', {
                                                                                weekday: 'short',
                                                                                month: 'short',
                                                                                day: 'numeric'
                                                                            })}
                                                                        </td>
                                                                        <td className="px-4 py-3">
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
                                                                        <td className="px-4 py-3 text-sm text-slate-800">
                                                                            {session.topic || 'No topic recorded'}
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    ) : (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                            <div className="text-gray-400 mb-4">
                                <Search className="w-16 h-16 mx-auto" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No subjects found</h3>
                            <p className="text-gray-600">Try adjusting your search terms or check back later.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AttendancePage;