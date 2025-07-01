"use client";
import React, { useEffect, useState } from "react";
import {
  Search,
  Filter,
  Download,
  Eye,
  Edit2,
  Trash2,
  Plus,
  MoreVertical,
  Calendar,
  User,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import Image from "next/image";

const AdmissionApplications = () => {
  const [selectedTab, setSelectedTab] = useState("all");
  const [showNewApplication, setShowNewApplication] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [admission, setAdmission] = useState([]);

  useEffect(() => {
    const fetchAdmission = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/admission");
        if (!res.ok) throw new Error("Failed to fetch Admissions");
        const admissionData = await res.json();

        // Ensure the response is an array
        if (!Array.isArray(admissionData)) {
          throw new Error("Expected array but got " + typeof admissionData);
        }

        setAdmission(admissionData);
      } catch (error) {
        setError(err.message);
        console.error("Failed to fetch admissions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdmission();
  }, []);
  // const [formData, setFormData] = useState({
  //   firstName: "",
  //   lastName: "",
  //   email: "",
  //   phone: "",
  //   dateOfBirth: "",
  //   gender: "",
  //   address: "",
  //   city: "",
  //   state: "",
  //   zipCode: "",
  //   country: "",
  //   program: "",
  //   previousEducation: "",
  //   gpa: "",
  //   testScore: "",
  //   testType: "",
  //   personalStatement: "",
  //   documents: [],
  // });

  const statusConfig = {
    pending: {
      color: "bg-yellow-100 text-yellow-800",
      icon: Clock,
      label: "Pending",
    },
    approved: {
      color: "bg-green-100 text-green-800",
      icon: CheckCircle,
      label: "Approved",
    },
    rejected: {
      color: "bg-red-100 text-red-800",
      icon: XCircle,
      label: "Rejected",
    },
    under_review: {
      color: "bg-blue-100 text-blue-800",
      icon: Clock,
      label: "Under Review",
    },
  };

  const filteredApplications = admission.filter((app) => {
    const matchesSearch =
      app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      selectedFilter === "all" || app.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setShowNewApplication(false);
    // Reset form
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      gender: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
      program: "",
      previousEducation: "",
      gpa: "",
      testScore: "",
      testType: "",
      personalStatement: "",
      documents: [],
    });
  };

  // if (showNewApplication) {
  //   return (
  //     <div className="min-h-screen bg-gray-50 p-6">
  //       <div className="max-w-4xl mx-auto">
  //         {/* Header */}
  //         <div className="flex items-center justify-between mb-6">
  //           <div>
  //             <h1 className="text-2xl font-bold text-gray-900">
  //               New Admission Application
  //             </h1>
  //             <p className="text-gray-600">
  //               Fill out the application form below
  //             </p>
  //           </div>
  //           <button
  //             onClick={() => setShowNewApplication(false)}
  //             className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
  //           >
  //             ← Back to Applications
  //           </button>
  //         </div>

  //         {/* Application Form */}
  //         <div className="bg-white rounded-xl shadow-sm border">
  //           <form onSubmit={handleSubmit} className="p-6 space-y-6">
  //             {/* Personal Information */}
  //             <div>
  //               <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
  //                 <User className="w-5 h-5 mr-2 text-blue-600" />
  //                 Personal Information
  //               </h3>
  //               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  //                 <div>
  //                   <label className="block text-sm font-medium text-gray-700 mb-2">
  //                     First Name *
  //                   </label>
  //                   <input
  //                     type="text"
  //                     name="firstName"
  //                     value={formData.firstName}
  //                     onChange={handleInputChange}
  //                     required
  //                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  //                   />
  //                 </div>
  //                 <div>
  //                   <label className="block text-sm font-medium text-gray-700 mb-2">
  //                     Last Name *
  //                   </label>
  //                   <input
  //                     type="text"
  //                     name="lastName"
  //                     value={formData.lastName}
  //                     onChange={handleInputChange}
  //                     required
  //                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  //                   />
  //                 </div>
  //                 <div>
  //                   <label className="block text-sm font-medium text-gray-700 mb-2">
  //                     Email *
  //                   </label>
  //                   <input
  //                     type="email"
  //                     name="email"
  //                     value={formData.email}
  //                     onChange={handleInputChange}
  //                     required
  //                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  //                   />
  //                 </div>
  //                 <div>
  //                   <label className="block text-sm font-medium text-gray-700 mb-2">
  //                     Phone Number *
  //                   </label>
  //                   <input
  //                     type="tel"
  //                     name="phone"
  //                     value={formData.phone}
  //                     onChange={handleInputChange}
  //                     required
  //                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  //                   />
  //                 </div>
  //                 <div>
  //                   <label className="block text-sm font-medium text-gray-700 mb-2">
  //                     Date of Birth *
  //                   </label>
  //                   <input
  //                     type="date"
  //                     name="dateOfBirth"
  //                     value={formData.dateOfBirth}
  //                     onChange={handleInputChange}
  //                     required
  //                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  //                   />
  //                 </div>
  //                 <div>
  //                   <label className="block text-sm font-medium text-gray-700 mb-2">
  //                     Gender
  //                   </label>
  //                   <select
  //                     name="gender"
  //                     value={formData.gender}
  //                     onChange={handleInputChange}
  //                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  //                   >
  //                     <option value="">Select Gender</option>
  //                     <option value="male">Male</option>
  //                     <option value="female">Female</option>
  //                     <option value="other">Other</option>
  //                     <option value="prefer_not_to_say">
  //                       Prefer not to say
  //                     </option>
  //                   </select>
  //                 </div>
  //               </div>
  //             </div>

  //             {/* Address Information */}
  //             <div>
  //               <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
  //                 <MapPin className="w-5 h-5 mr-2 text-blue-600" />
  //                 Address Information
  //               </h3>
  //               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  //                 <div className="md:col-span-2">
  //                   <label className="block text-sm font-medium text-gray-700 mb-2">
  //                     Street Address *
  //                   </label>
  //                   <input
  //                     type="text"
  //                     name="address"
  //                     value={formData.address}
  //                     onChange={handleInputChange}
  //                     required
  //                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  //                   />
  //                 </div>
  //                 <div>
  //                   <label className="block text-sm font-medium text-gray-700 mb-2">
  //                     City *
  //                   </label>
  //                   <input
  //                     type="text"
  //                     name="city"
  //                     value={formData.city}
  //                     onChange={handleInputChange}
  //                     required
  //                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  //                   />
  //                 </div>
  //                 <div>
  //                   <label className="block text-sm font-medium text-gray-700 mb-2">
  //                     State/Province *
  //                   </label>
  //                   <input
  //                     type="text"
  //                     name="state"
  //                     value={formData.state}
  //                     onChange={handleInputChange}
  //                     required
  //                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  //                   />
  //                 </div>
  //                 <div>
  //                   <label className="block text-sm font-medium text-gray-700 mb-2">
  //                     ZIP/Postal Code *
  //                   </label>
  //                   <input
  //                     type="text"
  //                     name="zipCode"
  //                     value={formData.zipCode}
  //                     onChange={handleInputChange}
  //                     required
  //                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  //                   />
  //                 </div>
  //                 <div>
  //                   <label className="block text-sm font-medium text-gray-700 mb-2">
  //                     Country *
  //                   </label>
  //                   <select
  //                     name="country"
  //                     value={formData.country}
  //                     onChange={handleInputChange}
  //                     required
  //                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  //                   >
  //                     <option value="">Select Country</option>
  //                     <option value="us">United States</option>
  //                     <option value="ca">Canada</option>
  //                     <option value="uk">United Kingdom</option>
  //                     <option value="au">Australia</option>
  //                     <option value="in">India</option>
  //                     <option value="other">Other</option>
  //                   </select>
  //                 </div>
  //               </div>
  //             </div>

  //             {/* Academic Information */}
  //             <div>
  //               <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
  //                 <GraduationCap className="w-5 h-5 mr-2 text-blue-600" />
  //                 Academic Information
  //               </h3>
  //               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  //                 <div>
  //                   <label className="block text-sm font-medium text-gray-700 mb-2">
  //                     Program of Interest *
  //                   </label>
  //                   <select
  //                     name="program"
  //                     value={formData.program}
  //                     onChange={handleInputChange}
  //                     required
  //                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  //                   >
  //                     <option value="">Select Program</option>
  //                     <option value="computer_science">Computer Science</option>
  //                     <option value="business_administration">
  //                       Business Administration
  //                     </option>
  //                     <option value="engineering">Engineering</option>
  //                     <option value="psychology">Psychology</option>
  //                     <option value="medicine">Medicine</option>
  //                     <option value="law">Law</option>
  //                     <option value="arts">Liberal Arts</option>
  //                   </select>
  //                 </div>
  //                 <div>
  //                   <label className="block text-sm font-medium text-gray-700 mb-2">
  //                     Previous Education Level *
  //                   </label>
  //                   <select
  //                     name="previousEducation"
  //                     value={formData.previousEducation}
  //                     onChange={handleInputChange}
  //                     required
  //                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  //                   >
  //                     <option value="">Select Education Level</option>
  //                     <option value="high_school">High School</option>
  //                     <option value="bachelors">Bachelor's Degree</option>
  //                     <option value="masters">Master's Degree</option>
  //                     <option value="doctorate">Doctorate</option>
  //                   </select>
  //                 </div>
  //                 <div>
  //                   <label className="block text-sm font-medium text-gray-700 mb-2">
  //                     GPA *
  //                   </label>
  //                   <input
  //                     type="number"
  //                     step="0.01"
  //                     min="0"
  //                     max="4"
  //                     name="gpa"
  //                     value={formData.gpa}
  //                     onChange={handleInputChange}
  //                     required
  //                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  //                   />
  //                 </div>
  //                 <div>
  //                   <label className="block text-sm font-medium text-gray-700 mb-2">
  //                     Test Type
  //                   </label>
  //                   <select
  //                     name="testType"
  //                     value={formData.testType}
  //                     onChange={handleInputChange}
  //                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  //                   >
  //                     <option value="">Select Test Type</option>
  //                     <option value="sat">SAT</option>
  //                     <option value="act">ACT</option>
  //                     <option value="gre">GRE</option>
  //                     <option value="gmat">GMAT</option>
  //                     <option value="toefl">TOEFL</option>
  //                     <option value="ielts">IELTS</option>
  //                   </select>
  //                 </div>
  //                 <div>
  //                   <label className="block text-sm font-medium text-gray-700 mb-2">
  //                     Test Score
  //                   </label>
  //                   <input
  //                     type="number"
  //                     name="testScore"
  //                     value={formData.testScore}
  //                     onChange={handleInputChange}
  //                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  //                   />
  //                 </div>
  //               </div>
  //             </div>

  //             {/* Personal Statement */}
  //             <div>
  //               <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
  //                 <FileText className="w-5 h-5 mr-2 text-blue-600" />
  //                 Personal Statement
  //               </h3>
  //               <div>
  //                 <label className="block text-sm font-medium text-gray-700 mb-2">
  //                   Personal Statement (500-1000 words) *
  //                 </label>
  //                 <textarea
  //                   name="personalStatement"
  //                   value={formData.personalStatement}
  //                   onChange={handleInputChange}
  //                   required
  //                   rows="6"
  //                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  //                   placeholder="Tell us about yourself, your goals, and why you want to join our institution..."
  //                 />
  //               </div>
  //             </div>

  //             {/* Document Upload */}
  //             <div>
  //               <h3 className="text-lg font-semibold text-gray-900 mb-4">
  //                 Required Documents
  //               </h3>
  //               <div className="space-y-3">
  //                 <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
  //                   <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
  //                   <p className="text-sm text-gray-600">
  //                     Upload transcripts, certificates, and other required
  //                     documents
  //                   </p>
  //                   <input
  //                     type="file"
  //                     multiple
  //                     accept=".pdf,.doc,.docx,.jpg,.png"
  //                     className="mt-2"
  //                   />
  //                 </div>
  //               </div>
  //             </div>

  //             {/* Submit Button */}
  //             <div className="flex justify-end space-x-4 pt-6 border-t">
  //               <button
  //                 type="button"
  //                 onClick={() => setShowNewApplication(false)}
  //                 className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
  //               >
  //                 Cancel
  //               </button>
  //               <button
  //                 type="submit"
  //                 className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
  //               >
  //                 Submit Application
  //               </button>
  //             </div>
  //           </form>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  if (loading)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Image
          src="/loading.svg"
          alt="Loading..."
          width={300}
          height={300}
          className="mb-4"
        />
        {/* <Loader/> */}
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="p-6 text-red-600">Error: {error}</div>
      </div>
    );
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Admission Applications
            </h1>
            <p className="text-gray-600">
              Manage and review student admission applications
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-6 rounded-xl shadow-sm ">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Applications
                </p>
                <p className="text-2xl font-bold text-gray-900">156</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Pending Review
                </p>
                <p className="text-2xl font-bold text-yellow-600">42</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-green-600">89</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-red-600">25</p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm mb-6">
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search applications..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="under_review">Under Review</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </button>
                <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </button>
              </div>
            </div>
          </div>

          {/* Applications Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 ">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applicant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Program
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    GPA
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Test Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submitted
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredApplications.map((application) => {
                  const StatusIcon = statusConfig[application.status].icon;
                  return (
                    <tr key={application.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                              <User className="w-5 h-5 text-gray-600" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {application.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {application.email}
                            </div>
                            <div className="text-xs text-gray-400">
                              {application.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {application.program}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            statusConfig[application.status].color
                          }`}
                        >
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {statusConfig[application.status].label}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {application.gpa}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {application.testScore}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(
                          application.submittedDate
                        ).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button className="text-blue-600 hover:text-blue-900">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="text-gray-600 hover:text-gray-900">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <button className="text-gray-600 hover:text-gray-900">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-3 flex items-center justify-between border-t">
            <div className="flex-1 flex justify-between sm:hidden">
              <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Previous
              </button>
              <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">1</span> to{" "}
                  <span className="font-medium">4</span> of{" "}
                  <span className="font-medium">
                    {filteredApplications.length}
                  </span>{" "}
                  results
                </p>
              </div>
              <div>
                <nav
                  className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                  aria-label="Pagination"
                >
                  <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    Previous
                  </button>
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                    1
                  </button>
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                    2
                  </button>
                  <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdmissionApplications;
