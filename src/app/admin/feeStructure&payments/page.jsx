// "use client";

// import { useState, useEffect, useRef } from "react";
// import { Plus, Trash2, X, Save, Search, FileText } from "lucide-react";

// export default function FeeStructurePage() {
//   const [formData, setFormData] = useState({
//     programType: "",
//     departmentName: "",
//     year: "",
//     caste: "",
//     category: "",
//     yearWiseFeeStructure: "",
//     scholarshipParticular: "",
//     feesFromStudent: [],
//     feesFromSocialWelfare: [],
//     totalStudentFees: 0,
//     totalSocialWelfareFees: 0,
//     totalFees: 0,
//   });

//   const [studentFeeItem, setStudentFeeItem] = useState({
//     componentName: "",
//     amount: "",
//     collectionOrder: "",
//     displayOrder: "",
//   });

//   const [welfareFeeItem, setWelfareFeeItem] = useState({
//     componentName: "",
//     amount: "",
//     collectionOrder: "",
//     displayOrder: "",
//   });

//   const [departmentData, setDepartmentData] = useState([]);
//   const [yearList, setYearList] = useState([]);
//   const [existingFeeStructures, setExistingFeeStructures] = useState([]);
//   const [showAddForm, setShowAddForm] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [activeTab, setActiveTab] = useState("structures");

//   // Refs for student fee inputs
//   const studentComponentRef = useRef(null);
//   const studentAmountRef = useRef(null);

//   // Refs for welfare fee inputs
//   const welfareComponentRef = useRef(null);
//   const welfareAmountRef = useRef(null);

//   const [casteList] = useState([
//     { id: "general", name: "General" },
//     { id: "obc", name: "OBC" },
//     { id: "sc", name: "SC" },
//     { id: "st", name: "ST" },
//     { id: "ews", name: "EWS" },
//   ]);

//   const [categoryList] = useState([
//     { id: "regular", name: "Regular" },
//     { id: "management", name: "Management Quota" },
//     { id: "nri", name: "NRI Quota" },
//     { id: "sports", name: "Sports Quota" },
//     { id: "defense", name: "Defense Quota" },
//   ]);

//   const [yearWiseFeeStructureList] = useState([
//     { id: "annual", name: "Annual" },
//     { id: "semester", name: "Semester" },
//     { id: "quarterly", name: "Quarterly" },
//     { id: "monthly", name: "Monthly" },
//   ]);

//   const [scholarshipList] = useState([
//     { id: "none", name: "No Scholarship" },
//     { id: "merit", name: "Merit-based Scholarship" },
//     { id: "need", name: "Need-based Scholarship" },
//     { id: "government", name: "Government Scholarship" },
//     { id: "institutional", name: "Institutional Scholarship" },
//     { id: "sports", name: "Sports Scholarship" },
//     { id: "minority", name: "Minority Scholarship" },
//   ]);

//   // Fetch existing fee structures
//   useEffect(() => {
//     const loadFeeStructures = async () => {
//       try {
//         const res = await fetch("/api/fee/feestructure");
//         const data = await res.json();
//         if (data.success && data.feeStructures) {
//           setExistingFeeStructures(data.feeStructures);
//         }
//       } catch (err) {
//         console.error("Error loading fee structures:", err);
//       }
//     };
//     loadFeeStructures();
//   }, []);

//   // Fetch departments
//   useEffect(() => {
//     const loadDepartments = async () => {
//       try {
//         const res = await fetch("/api/department");
//         const data = await res.json();
//         if (data.departments) {
//           setDepartmentData(data.departments);
//         }
//       } catch (err) {
//         console.error("Error loading departments:", err);
//       }
//     };
//     loadDepartments();
//   }, []);

//   // Auto-load years when department selected
//   useEffect(() => {
//     if (formData.departmentName) {
//       const dept = departmentData.find(
//         (d) => d.department === formData.departmentName
//       );
//       if (dept) {
//         setYearList(dept.years || []);
//       }
//     }
//   }, [formData.departmentName, departmentData]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleStudentFeeItemChange = (e) => {
//     const { name, value } = e.target;
//     const activeElement = document.activeElement;
//     const isComponentInput = activeElement === studentComponentRef.current;
//     const isAmountInput = activeElement === studentAmountRef.current;

//     setStudentFeeItem((prev) => ({ ...prev, [name]: value }));

//     requestAnimationFrame(() => {
//       if (isComponentInput && studentComponentRef.current) {
//         studentComponentRef.current.focus();
//       } else if (isAmountInput && studentAmountRef.current) {
//         studentAmountRef.current.focus();
//       }
//     });
//   };

//   const handleWelfareFeeItemChange = (e) => {
//     const { name, value } = e.target;
//     const activeElement = document.activeElement;
//     const isComponentInput = activeElement === welfareComponentRef.current;
//     const isAmountInput = activeElement === welfareAmountRef.current;

//     setWelfareFeeItem((prev) => ({ ...prev, [name]: value }));

//     requestAnimationFrame(() => {
//       if (isComponentInput && welfareComponentRef.current) {
//         welfareComponentRef.current.focus();
//       } else if (isAmountInput && welfareAmountRef.current) {
//         welfareAmountRef.current.focus();
//       }
//     });
//   };

//   const addStudentFeeItem = () => {
//     if (!studentFeeItem.componentName || !studentFeeItem.amount) {
//       alert("Please enter component name and amount");
//       return;
//     }

//     const updatedFees = [
//       ...formData.feesFromStudent,
//       {
//         componentName: studentFeeItem.componentName,
//         amount: parseFloat(studentFeeItem.amount),
//         collectionOrder: parseInt(studentFeeItem.collectionOrder) || 1,
//         displayOrder: parseInt(studentFeeItem.displayOrder) || 1,
//       },
//     ];

//     const studentTotal = updatedFees.reduce(
//       (sum, item) => sum + parseFloat(item.amount || 0),
//       0
//     );

//     const grandTotal = studentTotal + formData.totalSocialWelfareFees;

//     setFormData((prev) => ({
//       ...prev,
//       feesFromStudent: updatedFees,
//       totalStudentFees: studentTotal,
//       totalFees: grandTotal,
//     }));

//     setStudentFeeItem({
//       componentName: "",
//       amount: "",
//       collectionOrder: "",
//       displayOrder: "",
//     });

//     setTimeout(() => {
//       if (studentComponentRef.current) {
//         studentComponentRef.current.focus();
//       }
//     }, 0);
//   };

//   const addWelfareFeeItem = () => {
//     if (!welfareFeeItem.componentName || !welfareFeeItem.amount) {
//       alert("Please enter component name and amount");
//       return;
//     }

//     const updatedFees = [
//       ...formData.feesFromSocialWelfare,
//       {
//         componentName: welfareFeeItem.componentName,
//         amount: parseFloat(welfareFeeItem.amount),
//         collectionOrder: parseInt(welfareFeeItem.collectionOrder) || 1,
//         displayOrder: parseInt(welfareFeeItem.displayOrder) || 1,
//       },
//     ];

//     const welfareTotal = updatedFees.reduce(
//       (sum, item) => sum + parseFloat(item.amount || 0),
//       0
//     );

//     const grandTotal = formData.totalStudentFees + welfareTotal;

//     setFormData((prev) => ({
//       ...prev,
//       feesFromSocialWelfare: updatedFees,
//       totalSocialWelfareFees: welfareTotal,
//       totalFees: grandTotal,
//     }));

//     setWelfareFeeItem({
//       componentName: "",
//       amount: "",
//       collectionOrder: "",
//       displayOrder: "",
//     });

//     setTimeout(() => {
//       if (welfareComponentRef.current) {
//         welfareComponentRef.current.focus();
//       }
//     }, 0);
//   };

//   const removeStudentFeeItem = (index) => {
//     const updatedFees = formData.feesFromStudent.filter((_, i) => i !== index);
//     const studentTotal = updatedFees.reduce(
//       (sum, item) => sum + parseFloat(item.amount || 0),
//       0
//     );
//     const grandTotal = studentTotal + formData.totalSocialWelfareFees;

//     setFormData((prev) => ({
//       ...prev,
//       feesFromStudent: updatedFees,
//       totalStudentFees: studentTotal,
//       totalFees: grandTotal,
//     }));
//   };

//   const removeWelfareFeeItem = (index) => {
//     const updatedFees = formData.feesFromSocialWelfare.filter((_, i) => i !== index);
//     const welfareTotal = updatedFees.reduce(
//       (sum, item) => sum + parseFloat(item.amount || 0),
//       0
//     );
//     const grandTotal = formData.totalStudentFees + welfareTotal;

//     setFormData((prev) => ({
//       ...prev,
//       feesFromSocialWelfare: updatedFees,
//       totalSocialWelfareFees: welfareTotal,
//       totalFees: grandTotal,
//     }));
//   };

//   const handleSubmit = async () => {
//     if (
//       !formData.programType ||
//       !formData.departmentName ||
//       !formData.year ||
//       (formData.feesFromStudent.length === 0 && formData.feesFromSocialWelfare.length === 0)
//     ) {
//       alert("Please fill all required fields and add at least one fee item");
//       return;
//     }

//     setIsLoading(true);

//     const payload = {
//       programType: formData.programType,
//       departmentName: formData.departmentName,
//       year: formData.year,
//       caste: formData.caste,
//       category: formData.category,
//       yearWiseFeeStructure: formData.yearWiseFeeStructure,
//       scholarshipParticular: formData.scholarshipParticular,
//       feesFromStudent: formData.feesFromStudent,
//       feesFromSocialWelfare: formData.feesFromSocialWelfare,
//     };

//     try {
//       const res = await fetch("/api/fee/feestructure", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       const data = await res.json();

//       if (data.success) {
//         alert("Fee structure saved successfully!");
//         setFormData({
//           programType: "",
//           departmentName: "",
//           year: "",
//           caste: "",
//           category: "",
//           yearWiseFeeStructure: "",
//           scholarshipParticular: "",
//           feesFromStudent: [],
//           feesFromSocialWelfare: [],
//           totalStudentFees: 0,
//           totalSocialWelfareFees: 0,
//           totalFees: 0,
//         });
//         setShowAddForm(false);

//         // Refresh the list
//         const refreshRes = await fetch("/api/fee/feestructure");
//         const refreshData = await refreshRes.json();
//         if (refreshData.success && refreshData.feeStructures) {
//           setExistingFeeStructures(refreshData.feeStructures);
//         }
//       } else {
//         alert(data.error || "Failed to save fee structure");
//       }
//     } catch (err) {
//       console.error(err);
//       alert("Error occurred");
//     }

//     setIsLoading(false);
//   };

//   const deleteFeeStructure = async (id) => {
//     if (!confirm("Are you sure you want to delete this fee structure?")) {
//       return;
//     }

//     try {
//       const res = await fetch(`/api/fee/feestructure?id=${id}`, {
//         method: "DELETE",
//       });

//       const data = await res.json();

//       if (data.success) {
//         alert("Fee structure deleted!");
//         setExistingFeeStructures(
//           existingFeeStructures.filter((f) => f._id !== id)
//         );
//       } else {
//         alert(data.error || "Failed to delete");
//       }
//     } catch (err) {
//       console.error(err);
//       alert("Error occurred");
//     }
//   };

//   // Filter structures based on search
//   const filteredStructures = existingFeeStructures.filter((structure) => {
//     const searchLower = searchTerm.toLowerCase();
//     return (
//       structure.departmentName?.toLowerCase().includes(searchLower) ||
//       structure.programType?.toLowerCase().includes(searchLower) ||
//       structure.year?.toLowerCase().includes(searchLower) ||
//       structure.caste?.toLowerCase().includes(searchLower)
//     );
//   });

//   const AddFeeStructureModal = () => (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-lg p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto border border-gray-100">
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-lg font-medium text-gray-900">
//             Add New Fee Structure
//           </h2>
//           <button
//             onClick={() => setShowAddForm(false)}
//             className="text-gray-400 hover:text-gray-600 transition-colors"
//           >
//             <X className="w-5 h-5" />
//           </button>
//         </div>

//         <div className="space-y-6">
//           {/* Basic Information */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Program Type *
//               </label>
//               <select
//                 name="programType"
//                 value={formData.programType}
//                 onChange={handleInputChange}
//                 className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
//               >
//                 <option value="">Select Program Type</option>
//                 {departmentData.map((d) => (
//                   <option key={d._id} value={d.programType}>
//                     {d.programType}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Department Name *
//               </label>
//               <select
//                 name="departmentName"
//                 value={formData.departmentName}
//                 onChange={handleInputChange}
//                 className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
//               >
//                 <option value="">Select Department</option>
//                 {departmentData.map((d) => (
//                   <option key={d._id} value={d.department}>
//                     {d.department}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Year *
//               </label>
//               <select
//                 name="year"
//                 value={formData.year}
//                 onChange={handleInputChange}
//                 className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
//               >
//                 <option value="">Select Year</option>
//                 {yearList.map((y, index) => (
//                   <option key={index} value={y.year}>
//                     {y.year}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Caste
//               </label>
//               <select
//                 name="caste"
//                 value={formData.caste}
//                 onChange={handleInputChange}
//                 className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
//               >
//                 <option value="">Select Caste</option>
//                 {casteList.map((c) => (
//                   <option key={c.id} value={c.id}>
//                     {c.name}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Category
//               </label>
//               <select
//                 name="category"
//                 value={formData.category}
//                 onChange={handleInputChange}
//                 className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
//               >
//                 <option value="">Select Category</option>
//                 {categoryList.map((c) => (
//                   <option key={c.id} value={c.id}>
//                     {c.name}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Fee Structure Type
//               </label>
//               <select
//                 name="yearWiseFeeStructure"
//                 value={formData.yearWiseFeeStructure}
//                 onChange={handleInputChange}
//                 className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
//               >
//                 <option value="">Select Type</option>
//                 {yearWiseFeeStructureList.map((y) => (
//                   <option key={y.id} value={y.id}>
//                     {y.name}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Scholarship Type
//               </label>
//               <select
//                 name="scholarshipParticular"
//                 value={formData.scholarshipParticular}
//                 onChange={handleInputChange}
//                 className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
//               >
//                 <option value="">Select Scholarship</option>
//                 {scholarshipList.map((s) => (
//                   <option key={s.id} value={s.id}>
//                     {s.name}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           {/* Fee Components Section */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {/* Fees From Student */}
//             <div className="border border-gray-200 rounded-lg p-4">
//               <h3 className="text-base font-medium text-purple-700 mb-4">
//                 Fees From Student
//               </h3>

//               <div className="space-y-3">
//                 <div className="grid grid-cols-2 gap-2">
//                   <input
//                     ref={studentComponentRef}
//                     type="text"
//                     name="componentName"
//                     placeholder="Component Name"
//                     value={studentFeeItem.componentName}
//                     onChange={handleStudentFeeItemChange}
//                     className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
//                   />

//                   <input
//                     ref={studentAmountRef}
//                     type="number"
//                     name="amount"
//                     placeholder="Amount"
//                     value={studentFeeItem.amount}
//                     onChange={handleStudentFeeItemChange}
//                     className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
//                   />
//                 </div>

//                 <div className="grid grid-cols-2 gap-2">
//                   <input
//                     type="number"
//                     name="collectionOrder"
//                     placeholder="Collection Order"
//                     value={studentFeeItem.collectionOrder}
//                     onChange={handleStudentFeeItemChange}
//                     className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
//                   />

//                   <input
//                     type="number"
//                     name="displayOrder"
//                     placeholder="Display Order"
//                     value={studentFeeItem.displayOrder}
//                     onChange={handleStudentFeeItemChange}
//                     onKeyPress={(e) => {
//                       if (e.key === "Enter") {
//                         addStudentFeeItem();
//                       }
//                     }}
//                     className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
//                   />
//                 </div>

//                 <button
//                   type="button"
//                   onClick={addStudentFeeItem}
//                   className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
//                 >
//                   Add Student Fee
//                 </button>
//               </div>

//               {/* Student Fee List */}
//               <div className="mt-4 space-y-2 max-h-60 overflow-y-auto">
//                 {formData.feesFromStudent.map((item, index) => (
//                   <div
//                     key={index}
//                     className="flex justify-between items-center bg-gray-50 p-3 border border-gray-200 rounded-lg"
//                   >
//                     <div className="flex-1">
//                       <p className="text-sm font-medium text-gray-900">
//                         {item.componentName}
//                       </p>
//                       <p className="text-xs text-gray-600">
//                         ₹{item.amount} • Col: {item.collectionOrder} • Disp:{" "}
//                         {item.displayOrder}
//                       </p>
//                     </div>
//                     <button
//                       type="button"
//                       onClick={() => removeStudentFeeItem(index)}
//                       className="text-red-500 hover:text-red-700 ml-2"
//                     >
//                       <Trash2 className="w-4 h-4" />
//                     </button>
//                   </div>
//                 ))}
//               </div>

//               {formData.totalStudentFees > 0 && (
//                 <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
//                   <p className="text-sm font-bold text-blue-700">
//                     Total Student Fees: ₹
//                     {formData.totalStudentFees.toLocaleString()}
//                   </p>
//                 </div>
//               )}
//             </div>

//             {/* Fees From Social Welfare */}
//             <div className="border border-gray-200 rounded-lg p-4">
//               <h3 className="text-base font-medium text-purple-700 mb-4">
//                 Fees From Social Welfare
//               </h3>

//               <div className="space-y-3">
//                 <div className="grid grid-cols-2 gap-2">
//                   <input
//                     ref={welfareComponentRef}
//                     type="text"
//                     name="componentName"
//                     placeholder="Component Name"
//                     value={welfareFeeItem.componentName}
//                     onChange={handleWelfareFeeItemChange}
//                     className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
//                   />

//                   <input
//                     ref={welfareAmountRef}
//                     type="number"
//                     name="amount"
//                     placeholder="Amount"
//                     value={welfareFeeItem.amount}
//                     onChange={handleWelfareFeeItemChange}
//                     className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
//                   />
//                 </div>

//                 <div className="grid grid-cols-2 gap-2">
//                   <input
//                     type="number"
//                     name="collectionOrder"
//                     placeholder="Collection Order"
//                     value={welfareFeeItem.collectionOrder}
//                     onChange={handleWelfareFeeItemChange}
//                     className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
//                   />

//                   <input
//                     type="number"
//                     name="displayOrder"
//                     placeholder="Display Order"
//                     value={welfareFeeItem.displayOrder}
//                     onChange={handleWelfareFeeItemChange}
//                     onKeyPress={(e) => {
//                       if (e.key === "Enter") {
//                         addWelfareFeeItem();
//                       }
//                     }}
//                     className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
//                   />
//                 </div>

//                 <button
//                   type="button"
//                   onClick={addWelfareFeeItem}
//                   className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
//                 >
//                   Add Welfare Fee
//                 </button>
//               </div>

//               {/* Welfare Fee List */}
//               <div className="mt-4 space-y-2 max-h-60 overflow-y-auto">
//                 {formData.feesFromSocialWelfare.map((item, index) => (
//                   <div
//                     key={index}
//                     className="flex justify-between items-center bg-gray-50 p-3 border border-gray-200 rounded-lg"
//                   >
//                     <div className="flex-1">
//                       <p className="text-sm font-medium text-gray-900">
//                         {item.componentName}
//                       </p>
//                       <p className="text-xs text-gray-600">
//                         ₹{item.amount} • Col: {item.collectionOrder} • Disp:{" "}
//                         {item.displayOrder}
//                       </p>
//                     </div>
//                     <button
//                       type="button"
//                       onClick={() => removeWelfareFeeItem(index)}
//                       className="text-red-500 hover:text-red-700 ml-2"
//                     >
//                       <Trash2 className="w-4 h-4" />
//                     </button>
//                   </div>
//                 ))}
//               </div>

//               {formData.totalSocialWelfareFees > 0 && (
//                 <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
//                   <p className="text-sm font-bold text-green-700">
//                     Total Welfare Fees: ₹
//                     {formData.totalSocialWelfareFees.toLocaleString()}
//                   </p>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Grand Total */}
//           {formData.totalFees > 0 && (
//             <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
//               <div className="grid grid-cols-3 gap-4 text-center">
//                 <div>
//                   <p className="text-xs text-gray-600 mb-1">Student Fees</p>
//                   <p className="text-lg font-bold text-blue-600">
//                     ₹{formData.totalStudentFees.toLocaleString()}
//                   </p>
//                 </div>
//                 <div>
//                   <p className="text-xs text-gray-600 mb-1">Welfare Fees</p>
//                   <p className="text-lg font-bold text-green-600">
//                     ₹{formData.totalSocialWelfareFees.toLocaleString()}
//                   </p>
//                 </div>
//                 <div>
//                   <p className="text-xs text-gray-600 mb-1">Grand Total</p>
//                   <p className="text-xl font-bold text-purple-600">
//                     ₹{formData.totalFees.toLocaleString()}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Action Buttons */}
//           <div className="flex justify-end gap-3 pt-2">
//             <button
//               type="button"
//               onClick={() => setShowAddForm(false)}
//               className="px-4 py-2 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
//             >
//               Cancel
//             </button>
//             <button
//               type="button"
//               onClick={handleSubmit}
//               disabled={isLoading}
//               className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm font-medium ${
//                 isLoading ? "opacity-70 cursor-not-allowed" : ""
//               }`}
//             >
//               {isLoading ? (
//                 <span>Processing...</span>
//               ) : (
//                 <>
//                   <Save className="w-4 h-4" />
//                   <span>Save Fee Structure</span>
//                 </>
//               )}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="p-6">
//         <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6 overflow-hidden">
//           <div className="flex border-b border-gray-100">
//             <button
//               onClick={() => setActiveTab("structures")}
//               className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all duration-200 ${
//                 activeTab === "structures"
//                   ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50"
//                   : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
//               }`}
//             >
//               <FileText className="w-4 h-4" />
//               <span>Fee Structures</span>
//               <span className="ml-1 bg-gray-100 text-gray-600 rounded-full px-2 py-0.5 text-xs">
//                 {existingFeeStructures.length}
//               </span>
//             </button>
//           </div>

//           <div className="p-6">
//             {activeTab === "structures" && (
//               <div>
//                 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
//                   <div className="relative flex-1 max-w-md w-full">
//                     <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//                     <input
//                       type="text"
//                       placeholder="Search fee structures..."
//                       value={searchTerm}
//                       onChange={(e) => setSearchTerm(e.target.value)}
//                       className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full text-sm transition-all duration-200"
//                     />
//                   </div>

//                   <button
//                     onClick={() => setShowAddForm(true)}
//                     className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md w-full sm:w-auto justify-center"
//                   >
//                     <Plus className="w-4 h-4" />
//                     <span>Add Fee Structure</span>
//                   </button>
//                 </div>

//                 {filteredStructures.length === 0 ? (
//                   <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
//                     <div className="flex flex-col items-center justify-center gap-2 text-gray-400">
//                       <FileText className="w-12 h-12 text-gray-300" />
//                       <p className="text-sm font-medium">
//                         No fee structures found
//                       </p>
//                       {searchTerm ? (
//                         <button
//                           onClick={() => setSearchTerm("")}
//                           className="text-blue-600 text-xs hover:underline mt-2"
//                         >
//                           Clear search
//                         </button>
//                       ) : (
//                         <p className="text-xs text-gray-400">
//                           Click "Add Fee Structure" to create one
//                         </p>
//                       )}
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
//                     <div className="overflow-x-auto">
//                       <table className="w-full divide-y divide-gray-100">
//                         <thead className="bg-gray-50">
//                           <tr>
//                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                               Program
//                             </th>
//                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                               Department
//                             </th>
//                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                               Year
//                             </th>
//                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                               Caste
//                             </th>
//                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                               Student Fees
//                             </th>
//                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                               Welfare Fees
//                             </th>
//                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                               Total
//                             </th>
//                             <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                               Actions
//                             </th>
//                           </tr>
//                         </thead>
//                         <tbody className="bg-white divide-y divide-gray-100">
//                           {filteredStructures.map((structure) => (
//                             <tr
//                               key={structure._id}
//                               className="hover:bg-gray-50 transition-colors"
//                             >
//                               <td className="px-6 py-4 whitespace-nowrap">
//                                 <div className="text-sm text-gray-900">
//                                   {structure.programType}
//                                 </div>
//                               </td>
//                               <td className="px-6 py-4 whitespace-nowrap">
//                                 <div className="text-sm text-gray-900">
//                                   {structure.departmentName}
//                                 </div>
//                               </td>
//                               <td className="px-6 py-4 whitespace-nowrap">
//                                 <div className="text-sm text-gray-900">
//                                   {structure.year}
//                                 </div>
//                               </td>
//                               <td className="px-6 py-4 whitespace-nowrap">
//                                 <div className="text-sm text-gray-900">
//                                   {structure.caste
//                                     ? structure.caste.toUpperCase()
//                                     : "General"}
//                                 </div>
//                               </td>
//                               <td className="px-6 py-4 whitespace-nowrap">
//                                 <div className="text-sm text-blue-600 font-medium">
//                                   ₹{structure.totalStudentFees?.toLocaleString() || 0}
//                                 </div>
//                               </td>
//                               <td className="px-6 py-4 whitespace-nowrap">
//                                 <div className="text-sm text-green-600 font-medium">
//                                   ₹
//                                   {structure.totalSocialWelfareFees?.toLocaleString() ||
//                                     0}
//                                 </div>
//                               </td>
//                               <td className="px-6 py-4 whitespace-nowrap">
//                                 <div className="text-sm text-purple-600 font-bold">
//                                   ₹{structure.totalFees?.toLocaleString() || 0}
//                                 </div>
//                               </td>
//                               <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                                 <button
//                                   onClick={() =>
//                                     deleteFeeStructure(structure._id)
//                                   }
//                                   className="text-gray-400 hover:text-red-600 transition-colors p-1 rounded-full hover:bg-red-50"
//                                   title="Delete"
//                                 >
//                                   <Trash2 className="w-4 h-4" />
//                                 </button>
//                               </td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </table>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Add Modal */}
//       {showAddForm && <AddFeeStructureModal />}
//     </div>
//   );
// }


"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, Trash2, X, Save, Search, FileText } from "lucide-react";

export default function FeeStructurePage() {
  const [formData, setFormData] = useState({
    programType: "",
    departmentName: "",
    year: "",
    caste: "",
    category: "",
    yearWiseFeeStructure: "",
    scholarshipParticular: "",
    feesFromStudent: [],
    feesFromSocialWelfare: [],
    totalStudentFees: 0,
    totalSocialWelfareFees: 0,
    totalFees: 0,
  });

  const [studentFeeItem, setStudentFeeItem] = useState({
    componentName: "",
    amount: "",
    collectionOrder: "",
    displayOrder: "",
  });

  const [welfareFeeItem, setWelfareFeeItem] = useState({
    componentName: "",
    amount: "",
    collectionOrder: "",
    displayOrder: "",
  });

  const [departmentData, setDepartmentData] = useState([]);
  const [yearList, setYearList] = useState([]);
  const [existingFeeStructures, setExistingFeeStructures] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("structures");

  // Refs for student fee inputs
  const studentComponentRef = useRef(null);
  const studentAmountRef = useRef(null);

  // Refs for welfare fee inputs
  const welfareComponentRef = useRef(null);
  const welfareAmountRef = useRef(null);

  const [casteList] = useState([
    { id: "general", name: "General" },
    { id: "obc", name: "OBC" },
    { id: "sc", name: "SC" },
    { id: "st", name: "ST" },
    { id: "ews", name: "EWS" },
  ]);

  const [categoryList] = useState([
    { id: "regular", name: "Regular" },
    { id: "management", name: "Management Quota" },
    { id: "nri", name: "NRI Quota" },
    { id: "sports", name: "Sports Quota" },
    { id: "defense", name: "Defense Quota" },
  ]);

  const [yearWiseFeeStructureList] = useState([
    { id: "annual", name: "Annual" },
    { id: "semester", name: "Semester" },
    { id: "quarterly", name: "Quarterly" },
    { id: "monthly", name: "Monthly" },
  ]);

  const [scholarshipList] = useState([
    { id: "none", name: "No Scholarship" },
    { id: "merit", name: "Merit-based Scholarship" },
    { id: "need", name: "Need-based Scholarship" },
    { id: "government", name: "Government Scholarship" },
    { id: "institutional", name: "Institutional Scholarship" },
    { id: "sports", name: "Sports Scholarship" },
    { id: "minority", name: "Minority Scholarship" },
  ]);

  // Fetch existing fee structures
  useEffect(() => {
    const loadFeeStructures = async () => {
      try {
        const res = await fetch("/api/fee/feestructure");
        const data = await res.json();
        if (data.success && data.feeStructures) {
          setExistingFeeStructures(data.feeStructures);
        }
      } catch (err) {
        console.error("Error loading fee structures:", err);
      }
    };
    loadFeeStructures();
  }, []);

  // Fetch departments
  useEffect(() => {
    const loadDepartments = async () => {
      try {
        const res = await fetch("/api/department");
        const data = await res.json();
        if (data.departments) {
          setDepartmentData(data.departments);
        }
      } catch (err) {
        console.error("Error loading departments:", err);
      }
    };
    loadDepartments();
  }, []);

  // Auto-load years when department selected
  useEffect(() => {
    if (formData.departmentName) {
      const dept = departmentData.find(
        (d) => d.department === formData.departmentName
      );
      if (dept) {
        setYearList(dept.years || []);
      }
    }
  }, [formData.departmentName, departmentData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStudentFeeItemChange = (e) => {
    const { name, value } = e.target;
    const activeElement = document.activeElement;
    const isComponentInput = activeElement === studentComponentRef.current;
    const isAmountInput = activeElement === studentAmountRef.current;

    setStudentFeeItem((prev) => ({ ...prev, [name]: value }));

    requestAnimationFrame(() => {
      if (isComponentInput && studentComponentRef.current) {
        studentComponentRef.current.focus();
      } else if (isAmountInput && studentAmountRef.current) {
        studentAmountRef.current.focus();
      }
    });
  };

  const handleWelfareFeeItemChange = (e) => {
    const { name, value } = e.target;
    const activeElement = document.activeElement;
    const isComponentInput = activeElement === welfareComponentRef.current;
    const isAmountInput = activeElement === welfareAmountRef.current;

    setWelfareFeeItem((prev) => ({ ...prev, [name]: value }));

    requestAnimationFrame(() => {
      if (isComponentInput && welfareComponentRef.current) {
        welfareComponentRef.current.focus();
      } else if (isAmountInput && welfareAmountRef.current) {
        welfareAmountRef.current.focus();
      }
    });
  };

  const addStudentFeeItem = () => {
    if (!studentFeeItem.componentName || !studentFeeItem.amount) {
      alert("Please enter component name and amount");
      return;
    }

    const amount = parseFloat(studentFeeItem.amount);
    if (isNaN(amount) || amount < 0) {
      alert("Please enter a valid amount");
      return;
    }

    const updatedFees = [
      ...formData.feesFromStudent,
      {
        componentName: studentFeeItem.componentName,
        amount: amount,
        collectionOrder: parseInt(studentFeeItem.collectionOrder) || 1,
        displayOrder: parseInt(studentFeeItem.displayOrder) || 1,
      },
    ];

    const studentTotal = updatedFees.reduce(
      (sum, item) => sum + item.amount,
      0
    );

    const grandTotal = studentTotal + formData.totalSocialWelfareFees;

    setFormData((prev) => ({
      ...prev,
      feesFromStudent: updatedFees,
      totalStudentFees: studentTotal,
      totalFees: grandTotal,
    }));

    setStudentFeeItem({
      componentName: "",
      amount: "",
      collectionOrder: "",
      displayOrder: "",
    });

    setTimeout(() => {
      if (studentComponentRef.current) {
        studentComponentRef.current.focus();
      }
    }, 0);
  };

  const addWelfareFeeItem = () => {
    if (!welfareFeeItem.componentName || !welfareFeeItem.amount) {
      alert("Please enter component name and amount");
      return;
    }

    const amount = parseFloat(welfareFeeItem.amount);
    if (isNaN(amount) || amount < 0) {
      alert("Please enter a valid amount");
      return;
    }

    const updatedFees = [
      ...formData.feesFromSocialWelfare,
      {
        componentName: welfareFeeItem.componentName,
        amount: amount,
        collectionOrder: parseInt(welfareFeeItem.collectionOrder) || 1,
        displayOrder: parseInt(welfareFeeItem.displayOrder) || 1,
      },
    ];

    const welfareTotal = updatedFees.reduce(
      (sum, item) => sum + item.amount,
      0
    );

    const grandTotal = formData.totalStudentFees + welfareTotal;

    setFormData((prev) => ({
      ...prev,
      feesFromSocialWelfare: updatedFees,
      totalSocialWelfareFees: welfareTotal,
      totalFees: grandTotal,
    }));

    setWelfareFeeItem({
      componentName: "",
      amount: "",
      collectionOrder: "",
      displayOrder: "",
    });

    setTimeout(() => {
      if (welfareComponentRef.current) {
        welfareComponentRef.current.focus();
      }
    }, 0);
  };

  const removeStudentFeeItem = (index) => {
    const updatedFees = formData.feesFromStudent.filter((_, i) => i !== index);
    const studentTotal = updatedFees.reduce(
      (sum, item) => sum + item.amount,
      0
    );
    const grandTotal = studentTotal + formData.totalSocialWelfareFees;

    setFormData((prev) => ({
      ...prev,
      feesFromStudent: updatedFees,
      totalStudentFees: studentTotal,
      totalFees: grandTotal,
    }));
  };

  const removeWelfareFeeItem = (index) => {
    const updatedFees = formData.feesFromSocialWelfare.filter((_, i) => i !== index);
    const welfareTotal = updatedFees.reduce(
      (sum, item) => sum + item.amount,
      0
    );
    const grandTotal = formData.totalStudentFees + welfareTotal;

    setFormData((prev) => ({
      ...prev,
      feesFromSocialWelfare: updatedFees,
      totalSocialWelfareFees: welfareTotal,
      totalFees: grandTotal,
    }));
  };

  const handleSubmit = async () => {
    if (
      !formData.programType ||
      !formData.departmentName ||
      !formData.year ||
      (formData.feesFromStudent.length === 0 && formData.feesFromSocialWelfare.length === 0)
    ) {
      alert("Please fill all required fields and add at least one fee item");
      return;
    }

    setIsLoading(true);

    const payload = {
      programType: formData.programType,
      departmentName: formData.departmentName,
      year: formData.year,
      caste: formData.caste,
      category: formData.category,
      yearWiseFeeStructure: formData.yearWiseFeeStructure,
      scholarshipParticular: formData.scholarshipParticular,
      feesFromStudent: formData.feesFromStudent,
      feesFromSocialWelfare: formData.feesFromSocialWelfare,
    };

    try {
      const res = await fetch("/api/fee/feestructure", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        alert("Fee structure saved successfully!");
        setFormData({
          programType: "",
          departmentName: "",
          year: "",
          caste: "",
          category: "",
          yearWiseFeeStructure: "",
          scholarshipParticular: "",
          feesFromStudent: [],
          feesFromSocialWelfare: [],
          totalStudentFees: 0,
          totalSocialWelfareFees: 0,
          totalFees: 0,
        });
        setShowAddForm(false);

        // Refresh the list
        const refreshRes = await fetch("/api/fee/feestructure");
        const refreshData = await refreshRes.json();
        if (refreshData.success && refreshData.feeStructures) {
          setExistingFeeStructures(refreshData.feeStructures);
        }
      } else {
        alert(data.error || "Failed to save fee structure");
      }
    } catch (err) {
      console.error(err);
      alert("Error occurred");
    }

    setIsLoading(false);
  };

  const deleteFeeStructure = async (id) => {
    if (!confirm("Are you sure you want to delete this fee structure?")) {
      return;
    }

    try {
      const res = await fetch(`/api/fee/feestructure?id=${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success) {
        alert("Fee structure deleted!");
        setExistingFeeStructures(
          existingFeeStructures.filter((f) => f._id !== id)
        );
      } else {
        alert(data.error || "Failed to delete");
      }
    } catch (err) {
      console.error(err);
      alert("Error occurred");
    }
  };

  // Filter structures based on search
  const filteredStructures = existingFeeStructures.filter((structure) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      structure.departmentName?.toLowerCase().includes(searchLower) ||
      structure.programType?.toLowerCase().includes(searchLower) ||
      structure.year?.toLowerCase().includes(searchLower) ||
      structure.caste?.toLowerCase().includes(searchLower)
    );
  });

  const AddFeeStructureModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-medium text-gray-900">
            Add New Fee Structure
          </h2>
          <button
            onClick={() => setShowAddForm(false)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Program Type *
              </label>
              <select
                name="programType"
                value={formData.programType}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="">Select Program Type</option>
                {departmentData.map((d) => (
                  <option key={d._id} value={d.programType}>
                    {d.programType}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department Name *
              </label>
              <select
                name="departmentName"
                value={formData.departmentName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="">Select Department</option>
                {departmentData.map((d) => (
                  <option key={d._id} value={d.department}>
                    {d.department}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Year *
              </label>
              <select
                name="year"
                value={formData.year}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="">Select Year</option>
                {yearList.map((y, index) => (
                  <option key={index} value={y.year}>
                    {y.year}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Caste
              </label>
              <select
                name="caste"
                value={formData.caste}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="">Select Caste</option>
                {casteList.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="">Select Category</option>
                {categoryList.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fee Structure Type
              </label>
              <select
                name="yearWiseFeeStructure"
                value={formData.yearWiseFeeStructure}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="">Select Type</option>
                {yearWiseFeeStructureList.map((y) => (
                  <option key={y.id} value={y.id}>
                    {y.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Scholarship Type
              </label>
              <select
                name="scholarshipParticular"
                value={formData.scholarshipParticular}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="">Select Scholarship</option>
                {scholarshipList.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Fee Components Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Fees From Student */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-base font-medium text-purple-700 mb-4">
                Fees From Student
              </h3>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <input
                    ref={studentComponentRef}
                    type="text"
                    name="componentName"
                    placeholder="Component Name"
                    value={studentFeeItem.componentName}
                    onChange={handleStudentFeeItemChange}
                    className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                  <input
                    ref={studentAmountRef}
                    type="number"
                    name="amount"
                    placeholder="Amount"
                    value={studentFeeItem.amount}
                    onChange={handleStudentFeeItemChange}
                    className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    name="collectionOrder"
                    placeholder="Collection Order"
                    value={studentFeeItem.collectionOrder}
                    onChange={handleStudentFeeItemChange}
                    className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                  <input
                    type="number"
                    name="displayOrder"
                    placeholder="Display Order"
                    value={studentFeeItem.displayOrder}
                    onChange={handleStudentFeeItemChange}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        addStudentFeeItem();
                      }
                    }}
                    className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>

                <button
                  type="button"
                  onClick={addStudentFeeItem}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  Add Student Fee
                </button>
              </div>

              {/* Student Fee List */}
              <div className="mt-4 space-y-2 max-h-60 overflow-y-auto">
                {formData.feesFromStudent.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center bg-gray-50 p-3 border border-gray-200 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {item.componentName}
                      </p>
                      <p className="text-xs text-gray-600">
                        ₹{item.amount} • Col: {item.collectionOrder} • Disp: {item.displayOrder}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeStudentFeeItem(index)}
                      className="text-red-500 hover:text-red-700 ml-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {formData.totalStudentFees > 0 && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm font-bold text-blue-700">
                    Total Student Fees: ₹{formData.totalStudentFees.toLocaleString()}
                  </p>
                </div>
              )}
            </div>

            {/* Fees From Social Welfare */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-base font-medium text-purple-700 mb-4">
                Fees From Social Welfare
              </h3>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <input
                    ref={welfareComponentRef}
                    type="text"
                    name="componentName"
                    placeholder="Component Name"
                    value={welfareFeeItem.componentName}
                    onChange={handleWelfareFeeItemChange}
                    className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                  <input
                    ref={welfareAmountRef}
                    type="number"
                    name="amount"
                    placeholder="Amount"
                    value={welfareFeeItem.amount}
                    onChange={handleWelfareFeeItemChange}
                    className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    name="collectionOrder"
                    placeholder="Collection Order"
                    value={welfareFeeItem.collectionOrder}
                    onChange={handleWelfareFeeItemChange}
                    className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                  <input
                    type="number"
                    name="displayOrder"
                    placeholder="Display Order"
                    value={welfareFeeItem.displayOrder}
                    onChange={handleWelfareFeeItemChange}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        addWelfareFeeItem();
                      }
                    }}
                    className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>

                <button
                  type="button"
                  onClick={addWelfareFeeItem}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                >
                  Add Welfare Fee
                </button>
              </div>

              {/* Welfare Fee List */}
              <div className="mt-4 space-y-2 max-h-60 overflow-y-auto">
                {formData.feesFromSocialWelfare.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center bg-gray-50 p-3 border border-gray-200 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {item.componentName}
                      </p>
                      <p className="text-xs text-gray-600">
                        ₹{item.amount} • Col: {item.collectionOrder} • Disp: {item.displayOrder}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeWelfareFeeItem(index)}
                      className="text-red-500 hover:text-red-700 ml-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {formData.totalSocialWelfareFees > 0 && (
                <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm font-bold text-green-700">
                    Total Welfare Fees: ₹{formData.totalSocialWelfareFees.toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Grand Total */}
          {formData.totalFees > 0 && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Student Fees</p>
                  <p className="text-lg font-bold text-blue-600">
                    ₹{formData.totalStudentFees.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Welfare Fees</p>
                  <p className="text-lg font-bold text-green-600">
                    ₹{formData.totalSocialWelfareFees.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Grand Total</p>
                  <p className="text-xl font-bold text-purple-600">
                    ₹{formData.totalFees.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm font-medium ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? (
                <span>Processing...</span>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Fee Structure</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6 overflow-hidden">
          <div className="flex border-b border-gray-100">
            <button
              onClick={() => setActiveTab("structures")}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all duration-200 ${
                activeTab === "structures"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Fee Structures</span>
              <span className="ml-1 bg-gray-100 text-gray-600 rounded-full px-2 py-0.5 text-xs">
                {existingFeeStructures.length}
              </span>
            </button>
          </div>

          <div className="p-6">
            {activeTab === "structures" && (
              <div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <div className="relative flex-1 max-w-md w-full">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search fee structures..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full text-sm transition-all duration-200"
                    />
                  </div>

                  <button
                    onClick={() => setShowAddForm(true)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-blue-6
00 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md w-full sm:w-auto justify-center"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Fee Structure</span>
                  </button>
                </div>

                {filteredStructures.length === 0 ? (
                  <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-2 text-gray-400">
                      <FileText className="w-12 h-12 text-gray-300" />
                      <p className="text-sm font-medium">
                        No fee structures found
                      </p>
                      {searchTerm ? (
                        <button
                          onClick={() => setSearchTerm("")}
                          className="text-blue-600 text-xs hover:underline mt-2"
                        >
                          Clear search
                        </button>
                      ) : (
                        <p className="text-xs text-gray-400">
                          Click "Add Fee Structure" to create one
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full divide-y divide-gray-100">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Program
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Department
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Year
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Caste
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Student Fees
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Welfare Fees
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Total
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                          {filteredStructures.map((structure) => (
                            <tr
                              key={structure._id}
                              className="hover:bg-gray-50 transition-colors"
                            >
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                  {structure.programType}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                  {structure.departmentName}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                  {structure.year}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                  {structure.caste
                                    ? structure.caste.toUpperCase()
                                    : "General"}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-blue-600 font-medium">
                                  ₹{structure.totalStudentFees?.toLocaleString() || 0}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-green-600 font-medium">
                                  ₹{structure.totalSocialWelfareFees?.toLocaleString() || 0}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-purple-600 font-bold">
                                  ₹{structure.totalFees?.toLocaleString() || 0}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button
                                  onClick={() => deleteFeeStructure(structure._id)}
                                  className="text-gray-400 hover:text-red-600 transition-colors p-1 rounded-full hover:bg-red-50"
                                  title="Delete"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Modal */}
      {showAddForm && <AddFeeStructureModal />}
    </div>
  );
}