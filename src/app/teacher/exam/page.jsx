// "use client";

// import { useState, useEffect } from "react";
// import {
//   Plus,
//   Trash2,
//   Edit,
//   Save,
//   X,
//   BookOpen,
//   FileText,
//   Search,
//   Filter,
//   ChevronDown,
//   ChevronUp,
//   Clock,
//   Calendar,
//   Users,
//   GraduationCap,
//   Bookmark,
// } from "lucide-react";
// import { useSession } from "@/context/SessionContext";

// export default function ExamManagement() {
//   // State for subjects, exams, and questions
//   const [subjects, setSubjects] = useState([]);
//   const [exams, setExams] = useState([]);
//   const [questions, setQuestions] = useState([]);
//   const { user } = useSession();

//   // State for UI controls
//   const [selectedSubject, setSelectedSubject] = useState(null);
//   const [selectedExam, setSelectedExam] = useState(null);
//   const [isAddingQuestion, setIsAddingQuestion] = useState(false);
//   const [newQuestion, setNewQuestion] = useState({
//     question: "",
//     options: [
//       { text: "", isCorrect: false },
//       { text: "", isCorrect: false },
//       { text: "", isCorrect: false },
//       { text: "", isCorrect: false },
//     ],
//     answer: 0,
//   });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [expandedSubjects, setExpandedSubjects] = useState({});
//   const [sortConfig, setSortConfig] = useState({
//     key: null,
//     direction: "ascending",
//   });
//   const [showExamModal, setShowExamModal] = useState(false);
//   const [newExam, setNewExam] = useState({
//     type: '',
//     subject: '',
//     totalMarks: '',
//     date: '',
//     duration: ''
//   });

//   // Fetch subjects and exams from API
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const response = await fetch(`/api/teachers/${user.id}/dashboard`);
//         const data = await response.json();

//         console.log("API Response:", data);

//         if (data) {
//           // Transform the API data to separate each subject individually
//           const transformedSubjects = [];
//           let subjectId = 1;

//           data.mySubjects.forEach((subjectGroup, groupIndex) => {
//             subjectGroup.subjects.forEach((subjectName, subjectIndex) => {
//               transformedSubjects.push({
//                 id: subjectId++,
//                 name: subjectName,
//                 description: `${subjectGroup.year}, ${subjectGroup.semester}, Division ${subjectGroup.division}`,
//                 year: subjectGroup.year,
//                 semester: subjectGroup.semester,
//                 division: subjectGroup.division,
//                 groupId: groupIndex + 1, // To identify which group this subject belongs to
//                 studentCount: Math.floor(Math.random() * 50) + 30, // Mock data for demo
//               });
//               console.log("Subject", subjectName);
//             });
//           });

//           console.log(transformedSubjects);
//           setSubjects(transformedSubjects);

//           // Transform exams to include subjectId reference
//           console.log("Exam data from API:", data.myExam);

//           // Extract all exams from the nested structure
//           const allExams = data.myExam.flatMap((examGroup) => examGroup.exams);

//           // Now transform each exam to include subjectId
//           const transformedExams = allExams.map((exam) => {
//             // Try to find a matching subject based on subject name
//             const matchingSubject = transformedSubjects.find(
//               (s) => s.name.toLowerCase() === exam.subject.toLowerCase()
//             );

//             return {
//               ...exam,
//               subjectId: matchingSubject?.id || null,
//               // questionCount,
//               status:
//                 new Date(exam.date) > new Date() ? "upcoming" : "completed",
//             };
//           });

//           console.log("Transformed exams:", transformedExams);
//           setExams(transformedExams);
//         } else {
//           setError("Failed to fetch data");
//         }
//       } catch (err) {
//         setError("Error fetching data: " + err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (user && user.id) {
//       fetchData();
//     }
//   }, [user]);

//   // Toggle subject expansion
//   const toggleSubjectExpansion = (subjectId) => {
//     setExpandedSubjects((prev) => ({
//       ...prev,
//       [subjectId]: !prev[subjectId],
//     }));
//   };

//   // Handle sorting
//   const handleSort = (key) => {
//     let direction = "ascending";
//     if (sortConfig.key === key && sortConfig.direction === "ascending") {
//       direction = "descending";
//     }
//     setSortConfig({ key, direction });
//   };

//   // Sort subjects
//   const sortedSubjects = [...subjects].sort((a, b) => {
//     if (sortConfig.key) {
//       if (a[sortConfig.key] < b[sortConfig.key]) {
//         return sortConfig.direction === "ascending" ? -1 : 1;
//       }
//       if (a[sortConfig.key] > b[sortConfig.key]) {
//         return sortConfig.direction === "ascending" ? 1 : -1;
//       }
//     }
//     return 0;
//   });

//   // Filter subjects by search term
//   const filteredSubjects = sortedSubjects.filter(
//     (subject) =>
//       subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       subject.description.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   // Filter exams by selected subject
//   const filteredExams = selectedSubject
//     ? exams.filter((exam) => exam.subjectId === selectedSubject.id)
//     : [];

//     console.log("filteredExams",filteredExams);

//   // Filter questions by selected exam
//   // const filteredQuestions = selectedExam
//   //   ? questions.filter((question) => question.examId === selectedExam.id)
//   //   : [];

//   const filteredQuestions = selectedExam
//     ? questions.filter((question) => {
//         return question.examId === selectedExam.id;
//       })
//     : [];

//   // Add this function to handle API calls
//   const addQuestionToAPI = async (questionData) => {
//     try {
//       // Prepare the data in the correct format expected by your API
//       const requestData = {
//         question: questionData.question,
//         options: questionData.options.map((opt) => opt.text), // Send only the text, not objects
//         correctOption: questionData.answer, // Send the index of the correct answer
//         examId: selectedExam.id,
//         createdBy: user.id,
//         marks: 1,
//       };

//       console.log("Sending to API:", JSON.stringify(requestData, null, 2));

//       const response = await fetch(`/api/teachers/${user.id}/exam`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(requestData),
//       });

//       console.log("Response status:", response.status);

//       if (!response.ok) {
//         const errorData = await response.json();
//         console.error("API Error response:", errorData);
//         throw new Error(
//           `Failed to add question: ${response.status} ${
//             errorData.message || "Unknown error"
//           }`
//         );
//       }

//       const data = await response.json();
//       console.log("API Success response:", data);

//       return {
//         id: data._id || data.id,
//         examId: selectedExam.id,
//         question: data.question,
//         options: data.options || [],
//         answer: data.correctOption || 0, // Use correctOption from response
//       };
//     } catch (error) {
//       console.error("API Error details:", error);
//       setError("Error adding question: " + error.message);
//       throw error;
//     }
//   };

//   // Update the handleAddQuestion function
//   const handleAddQuestion = async () => {
//     // Check if all options have text
//     const allOptionsFilled = newQuestion.options.every(
//       (opt) => opt.text.trim() !== ""
//     );

//     if (newQuestion.question.trim() && allOptionsFilled && selectedExam) {
//       try {
//         setLoading(true);
//         const savedQuestion = await addQuestionToAPI(newQuestion);

//         // Add the question to local state
//         setQuestions([
//           ...questions,
//           {
//             id: savedQuestion.id,
//             examId: selectedExam.id,
//             question: savedQuestion.question,
//             options: savedQuestion.options,
//             answer: savedQuestion.answer,
//           },
//         ]);

//         // Reset form with correct object structure
//         setNewQuestion({
//           question: "",
//           options: [
//             { text: "", isCorrect: false },
//             { text: "", isCorrect: false },
//             { text: "", isCorrect: false },
//             { text: "", isCorrect: false },
//           ],
//           answer: 0,
//         });
//         setIsAddingQuestion(false);
//       } catch (error) {
//         console.error("Error in handleAddQuestion:", error);
//         // Error message is already set in addQuestionToAPI
//       } finally {
//         setLoading(false);
//       }
//     } else {
//       setError("Please fill in all fields and select an exam");
//     }
//   };

//   // Add this useEffect to fetch questions for the selected exam
//   useEffect(() => {
//     const fetchQuestionsForExam = async () => {
//       if (!selectedExam) {
//         setQuestions([]);
//         return;
//       }

//       try {
//         setLoading(true);
//         const response = await fetch(`/api/teachers/${user.id}/exam`);

//         if (response.ok) {
//           const questionsData = await response.json();

//           console.log(questionsData);

//           const queData = questionsData.questions;
//           // Transform the API response to match our expected format
//           // In your useEffect that fetches questions
//           const transformedQuestions = queData.map((q) => ({
//             id: q._id || q.id,
//             examId: q.examId || selectedExam.id,
//             question: q.questionText || q.question,
//             options: q.options || [],
//             answer: q.options.findIndex(opt => opt.isCorrect === true) || 0, // Use correctOption from response
//           }));

//           console.log(transformedQuestions);

//           setQuestions(transformedQuestions);
//         } else {
//           setError("Failed to fetch questions");
//           setQuestions([]);
//         }
//       } catch (err) {
//         setError("Error fetching questions: " + err.message);
//         setQuestions([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchQuestionsForExam();
//   }, [selectedExam, user.id]);

//   console.log(questions);

//   const handleDeleteQuestion = (id) => {
//     setQuestions(questions.filter((q) => q.id !== id));
//   };

//   const handleOptionChange = (index, value) => {
//   const updatedOptions = [...newQuestion.options];
//   updatedOptions[index] = { ...updatedOptions[index], text: value };
//   setNewQuestion({ ...newQuestion, options: updatedOptions });
// };

//   const handleAnswerChange = (index) => {
//     const updatedOptions = newQuestion.options.map((opt, i) => ({
//       ...opt,
//       isCorrect: i === index,
//     }));
//     setNewQuestion({
//       ...newQuestion,
//       options: updatedOptions,
//       answer: index,
//     });
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading data...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
//         <div className="text-center text-red-500">
//           <p>{error}</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Subjects Panel */}
//         <div className="bg-white rounded-xl shadow-md p-6">
//           <div className="flex justify-between items-center mb-6">
//             <h2 className="text-xl font-semibold text-gray-800 flex items-center">
//               <BookOpen className="mr-2" size={20} /> Subjects
//             </h2>
//             <div className="flex items-center space-x-2">
//               <div className="relative">
//                 <Search
//                   className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
//                   size={18}
//                 />
//                 <input
//                   type="text"
//                   placeholder="Search subjects..."
//                   className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//               </div>
//               <button
//                 className="p-2 border rounded-lg hover:bg-gray-50"
//                 onClick={() => handleSort("name")}
//               >
//                 <Filter size={18} />
//               </button>
//             </div>
//           </div>

//           <div className="space-y-3">
//             {filteredSubjects.map((subject) => (
//               <div
//                 key={subject.id}
//                 className={`rounded-lg transition-all overflow-hidden ${
//                   selectedSubject?.id === subject.id
//                     ? "ring-2 ring-blue-500 shadow-md"
//                     : "bg-white border border-gray-200 hover:shadow-md"
//                 }`}
//               >
//                 <div
//                   className="p-4 cursor-pointer flex justify-between items-center"
//                   onClick={() => {
//                     setSelectedSubject(subject);
//                     setSelectedExam(null);
//                     toggleSubjectExpansion(subject.id);
//                   }}
//                 >
//                   <div className="flex-1">
//                     <h3 className="font-semibold text-gray-800">
//                       {subject.name}
//                     </h3>
//                     <p className="text-sm text-gray-600 mt-1">
//                       {subject.description}
//                     </p>
//                     <div className="flex items-center mt-2 text-xs text-gray-500">
//                       <Users size={14} className="mr-1" />
//                       <span className="mr-3">
//                         {subject.studentCount} students
//                       </span>
//                       <GraduationCap size={14} className="mr-1" />
//                       <span>Year {subject.year}</span>
//                     </div>
//                   </div>
//                   <div>
//                     {expandedSubjects[subject.id] ? (
//                       <ChevronUp size={20} />
//                     ) : (
//                       <ChevronDown size={20} />
//                     )}
//                   </div>
//                 </div>

//                 {expandedSubjects[subject.id] && (
//                   <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
//                     <div className="flex justify-between items-center text-sm">
//                       <span className="text-gray-600">
//                         Exams: {filteredExams.length}
//                       </span>
//                       <button
//                         className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
//                         onClick={() => {
//                             setNewExam({
//                               type: '',
//                               subject: '',
//                               totalMarks: '',
//                               date: '',
//                               duration:''
//                             });
//                             setShowExamModal(true);
//                           }}
//                       >
//                         <Plus size={16} className="mr-1" />
//                         New Exam
//                       </button>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             ))}

//             {filteredSubjects.length === 0 && (
//               <div className="text-center py-8 text-gray-500">
//                 {searchTerm
//                   ? "No subjects match your search."
//                   : "No subjects available."}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Exams Panel */}
//         <div className="bg-white rounded-xl shadow-md p-6">
//           <div className="flex justify-between items-center mb-6">
//             <h2 className="text-xl font-semibold text-gray-800 flex items-center">
//               <FileText className="mr-2" size={20} />
//               {selectedSubject ? `Exams for ${selectedSubject.name}` : "Exams"}
//             </h2>
//             {selectedSubject && (
//               <button className="px-3 py-2 bg-blue-500 text-white rounded-lg flex items-center text-sm">
//                 <Plus size={16} className="mr-1" /> Create Exam
//               </button>
//             )}
//           </div>

//           <div className="space-y-3">
//             {filteredExams.map((exam) => {
//               const formattedDate = new Date(exam.date).toLocaleDateString('en-GB');
//               const subject = subjects.find((s) => s.id === exam.subjectId);
//               return (
//                 <div
//                   key={exam.id}
//                   className={`rounded-lg transition-all overflow-hidden ${
//                     selectedExam?.id === exam.id
//                       ? "ring-2 ring-blue-500 shadow-md"
//                       : "bg-white border border-gray-200 hover:shadow-md"
//                   }`}
//                   onClick={() => setSelectedExam(exam)}
//                 >
//                   <div className="p-4 cursor-pointer">
//                     <div className="flex justify-between items-start">
//                       <div className="flex-1">
//                         <h3 className="font-semibold text-gray-800 flex items-center">
//                           {exam.type || exam.name || `Exam ${exam.id}`}
//                           <span
//                             className={`ml-2 text-xs px-2 py-1 rounded-full ${
//                               exam.status === "upcoming"
//                                 ? "bg-yellow-100 text-yellow-800"
//                                 : "bg-green-100 text-green-800"
//                             }`}
//                           >
//                             {exam.status === "upcoming"
//                               ? "Upcoming"
//                               : "Completed"}
//                           </span>
//                         </h3>
//                         <p className="text-sm text-gray-600 mt-1">
//                           {subject?.name || "Unknown Subject"}
//                         </p>
//                       </div>
//                       <button
//                         className="p-1 text-gray-400 hover:text-gray-600"
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           // Handle edit exam
//                         }}
//                       >
//                         <Edit size={16} />
//                       </button>
//                     </div>

//                     <div className="grid grid-cols-2 gap-2 mt-3 text-sm text-gray-600">
//                       <div className="flex items-center">
//                         <Calendar size={14} className="mr-1" />
//                         <span>{formattedDate}</span>
//                       </div>
//                       <div className="flex items-center">
//                         <Clock size={14} className="mr-1" />
//                         <span>{exam.duration} mins</span>
//                       </div>
//                     </div>

//                     <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
//                       <div className="flex items-center text-xs text-gray-500">
//                         <FileText size={12} className="mr-1" />
//                         <span>{exam.questionCount} questions</span>
//                       </div>
//                       <div className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100">
//                         Total Marks: {exam.totalMarks}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}

//             {filteredExams.length === 0 && (
//               <div className="text-center py-8 text-gray-500">
//                 {selectedSubject
//                   ? "No exams for this subject yet. Create your first exam!"
//                   : "Select a subject to view exams."}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Questions Panel */}
//       <div className="mt-6 bg-white rounded-xl shadow-md p-6">
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-xl font-semibold text-gray-800">
//             {selectedExam ? `Questions for ${selectedExam.type}` : "Questions"}
//           </h2>
//           <button
//             onClick={() => setIsAddingQuestion(true)}
//             disabled={!selectedExam}
//             className={`px-4 py-2 rounded-lg flex items-center ${
//               selectedExam
//                 ? "bg-blue-500 hover:bg-blue-600 text-white"
//                 : "bg-gray-200 text-gray-500 cursor-not-allowed"
//             }`}
//           >
//             <Plus size={18} className="mr-1" /> Add Question
//           </button>
//         </div>

//         {isAddingQuestion && (
//           <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
//             <h3 className="font-medium mb-3 text-blue-800 flex items-center">
//               <Bookmark size={16} className="mr-1" />
//               Add Question to {selectedExam?.type}
//             </h3>
//             <textarea
//               placeholder="Enter your question"
//               className="w-full p-3 mb-3 border rounded-lg h-20 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               value={newQuestion.question}
//               onChange={(e) =>
//                 setNewQuestion({ ...newQuestion, question: e.target.value })
//               }
//             />

//             <h4 className="font-medium text-gray-700 text-sm mb-2">Options:</h4>
//             {newQuestion.options.map((option, index) => (
//               <div key={index} className="flex items-center mb-2">
//                 <input
//                   type="radio"
//                   name="correctAnswer"
//                   checked={newQuestion.answer === index}
//                   onChange={() => handleAnswerChange(index)}
//                   className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500"
//                 />
//                 <input
//                   type="text"
//                   placeholder={`Option ${index + 1}`}
//                   className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   value={option.text}
//                   onChange={(e) => handleOptionChange(index, e.target.value)}
//                 />
//               </div>
//             ))}

//             <div className="flex justify-end space-x-2 mt-3">
//               <button
//                 onClick={() => setIsAddingQuestion(false)}
//                 className="px-3 py-2 border rounded-lg flex items-center hover:bg-gray-50"
//               >
//                 <X size={16} className="mr-1" /> Cancel
//               </button>
//               <button
//                 onClick={handleAddQuestion}
//                 className="px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center"
//               >
//                 <Save size={16} className="mr-1" /> Save Question
//               </button>
//             </div>
//           </div>
//         )}

//         <div className="space-y-4">
//           {filteredQuestions.map((question, index) => (
//             <div
//               key={index}
//               className="p-4 bg-gray-50 border border-gray-200 rounded-lg"
//             >
//               <div className="flex justify-between items-start mb-2">
//                 <h3 className="font-medium text-gray-800">
//                   <span className="bg-blue-100 text-blue-800 rounded-full h-6 w-6 inline-flex items-center justify-center text-sm mr-2">
//                     {index + 1}
//                   </span>
//                   {question.question}
//                 </h3>
//                 <button
//                   onClick={() => handleDeleteQuestion(question.id)}
//                   className="text-red-500 hover:text-red-700 p-1"
//                 >
//                   <Trash2 size={16} />
//                 </button>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
//                 {question.options.map((option, optIndex) => {
//                   // Extract the text from the option (handles both string and object formats)
//                   const optionText =
//                     typeof option === "string" ? option : option.text;
//                   const optionId =
//                     typeof option === "object"
//                       ? option._id || optIndex
//                       : optIndex;

//                   return (
//                     <div
//                       key={optionId}
//                       className={`p-3 rounded-lg text-sm flex items-center ${
//                         question.answer === optIndex
//                           ? "bg-green-100 text-green-800 border border-green-200"
//                           : "bg-white border border-gray-200"
//                       }`}
//                     >
//                       <span className="font-medium mr-2">
//                         {String.fromCharCode(65 + optIndex)}.
//                       </span>
//                       <span>{optionText}</span>
//                       {question.answer === optIndex && (
//                         <span className="ml-auto bg-green-200 text-green-800 text-xs px-2 py-1 rounded-full">
//                           Correct Answer
//                         </span>
//                       )}
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           ))}

//           {filteredQuestions.length === 0 && (
//             <div className="text-center py-8 text-gray-500">
//               {selectedExam
//                 ? "No questions added to this exam yet. Add your first question!"
//                 : "Select an exam to view and manage its questions."}
//             </div>
//           )}
//         </div>
//       </div>
//       {/* {showExamModal && <ExamModal />} */}
//     </div>
//   );
// }
