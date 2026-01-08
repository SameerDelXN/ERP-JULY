"use client";
import {
  User,
  Phone,
  Mail,
  Info,
  ChevronDown,
} from "lucide-react";
import { useState, useEffect } from "react";

export default function EnquiryForm() {
  const [courseOptions, setCourseOptions] = useState([]);
  const [programTypeOptions, setProgramTypeOptions] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  
  // Cleaned up state: Removed verification specific state variables
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    phone: "",
    email: "",
    programType: "",
    course: "",
    source: "",
    notes: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filteredCourseOptions, setFilteredCourseOptions] = useState([]);
  const [selectedProgramType, setSelectedProgramType] = useState("");

  const fetchDepartments = async () => {
    try {
      const response = await fetch("/api/courses");
      if (!response.ok) throw new Error("Failed to fetch departments");
      const departments = await response.json();

      console.log(departments);

      setCourseOptions(departments.courses);
      setProgramTypeOptions(departments.programTypes);
    } catch (error) {
      console.error("Error fetching departments:", error);
    } finally {
      setLoadingCourses(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleProgramTypeChange = (e) => {
    const programType = e.target.value;
    setSelectedProgramType(programType);
    setFormData({
      ...formData,
      programType: programType,
      course: "", // Reset course selection when program type changes
    });

    // Filter courses based on selected program type
    if (programType) {
      const filtered = courseOptions.filter(
        (course) => course.programType === programType
      );
      setFilteredCourseOptions(filtered);
    } else {
      setFilteredCourseOptions(courseOptions);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "lastName" || name === "middleName" || name === "firstName") {
      if (!/^[a-zA-Z\s]*$/.test(value)) {
        setErrors({
          ...errors,
          [name]: "Only alphabetic characters are allowed",
        });
        return;
      }
    }

    if (name === "phone") {
      if (/\D/.test(value)) {
        setErrors({
          ...errors,
          phone: "Only numbers are allowed",
        });
      } else {
        if (errors.phone) {
          setErrors({
            ...errors,
            phone: null,
          });
        }
      }

      const numericValue = value.replace(/\D/g, "");
      setFormData({
        ...formData,
        [name]: numericValue.slice(0, 10),
      });
      return;
    }

    setFormData({
      ...formData,
      [name]: value,
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSubmitted(true);
        setFormData({
          firstName: "",
          middleName: "",
          lastName: "",
          phone: "",
          email: "",
          programType: "",
          course: "",
          source: "",
          notes: "",
        });
      } else {
        throw new Error(data.message || "Failed to submit enquiry");
      }
    } catch (error) {
      console.error("Submission error:", error);
      setErrors({ submit: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.firstName.trim()) errors.firstName = "First name is required";
    if (!formData.lastName.trim()) errors.lastName = "Last name is required";
    if (!formData.phone.trim()) errors.phone = "Phone number is required";
    if (formData.phone.trim() && !/^\d{10}$/.test(formData.phone))
      errors.phone = "Invalid phone number";
    if (!formData.email.trim()) errors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email))
      errors.email = "Email is invalid";
    if (!formData.programType.trim()) errors.programType = "Program Type is required";
    if (!formData.course.trim()) errors.course = "Course is required";
    if (!formData.source.trim()) errors.source = "Source is required";
    return errors;
  };

  const sourceOptions = [
    "Website",
    "Social Media",
    "Referral",
    "Newspaper",
    "Campus Visit",
    "Education Fair",
  ];

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h2>
          <p className="text-gray-600 mb-6">
            Your enquiry has been submitted successfully.
          </p>
          <p className="text-gray-500 text-sm">
            Our team will contact you shortly.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <img
            src="/TechEdu-remove-bg.png"
            alt="TechEdu Logo"
            className="mx-auto mb-4 h-20 sm:h-24 md:h-28 w-auto object-contain"
          />

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Institute Enquiry Form
          </h1>
          <p className="text-gray-600">
            Fill out this form and our team will get back to you within 24 hours
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6 sm:p-8">
            {errors.submit && (
              <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg">
                {errors.submit}
              </div>
            )}

            <div className="mb-10">
              <div className="flex items-center mb-6">
                <div className="p-2 rounded-lg bg-blue-50 text-blue-600 mr-3">
                  <User className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Personal Information
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-black mb-1"
                  >
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      maxLength={20}
                      minLength={2}
                      className={`w-full px-4 py-2.5 rounded-lg border ${
                        errors.firstName ? "border-red-500" : "border-gray-300"
                      } focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition`}
                      placeholder="Enter first name"
                    />
                    {errors.firstName && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.firstName}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="middleName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Middle Name
                  </label>
                  <input
                    type="text"
                    id="middleName"
                    name="middleName"
                    value={formData.middleName}
                    onChange={handleChange}
                    maxLength={20}
                    minLength={2}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                    placeholder="Enter middle name"
                  />
                  {errors.middleName && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.middleName}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      maxLength={20}
                      minLength={2}
                      className={`w-full px-4 py-2.5 rounded-lg border ${
                        errors.lastName ? "border-red-500" : "border-gray-300"
                      } focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition`}
                      placeholder="Enter last name"
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.lastName}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 h-[50px] left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      maxLength={10}
                      minLength={10}
                      className={`w-full pl-10 px-4 py-2.5 rounded-lg border ${
                        errors.phone ? "border-red-500" : "border-gray-300"
                      } focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition`}
                      placeholder="Enter 10-digit phone number"
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.phone}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 h-[50px] left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      maxLength={45}
                      className={`w-full pl-10 px-4 py-2.5 rounded-lg border ${
                        errors.email ? "border-red-500" : "border-gray-300"
                      } focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition`}
                      placeholder="Enter email address"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-10">
              <div className="flex items-center mb-6">
                <div className="p-2 rounded-lg bg-blue-50 text-blue-600 mr-3">
                  <Info className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Enquiry Details
                </h2>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div>
                  <label
                    htmlFor="programType"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Program Type <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    {!loadingCourses ? (
                      <select
                        id="programType"
                        name="programType"
                        value={selectedProgramType}
                        onChange={handleProgramTypeChange}
                        required
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition appearance-none"
                      >
                        <option value="">Select a Program Type</option>
                        {programTypeOptions.map((program, index) => (
                          <option key={`program-${index}`} value={program}>
                            {program}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-gray-100 animate-pulse">
                        Loading Program Types...
                      </div>
                    )}
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="course"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Course Interested <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    {!loadingCourses ? (
                      <select
                        id="course"
                        name="course"
                        value={formData.course}
                        onChange={handleChange}
                        required
                        disabled={!selectedProgramType}
                        className={`w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition appearance-none ${
                          !selectedProgramType ? "bg-gray-100" : ""
                        }`}
                      >
                        <option value="">
                          {selectedProgramType
                            ? "Select a course"
                            : "First select a Program Type"}
                        </option>
                        {filteredCourseOptions.map((course, index) => (
                          <option key={`course-${index}`} value={course.name}>
                            {course.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-gray-100 animate-pulse">
                        Loading courses...
                      </div>
                    )}
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                  {errors.course && (
                    <p className="mt-1 text-sm text-red-600">{errors.course}</p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="source"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    How did you hear about us?{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      id="source"
                      name="source"
                      value={formData.source}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition appearance-none"
                    >
                      <option value="">Select source</option>
                      {sourceOptions.map((source, index) => (
                        <option key={index} value={source}>
                          {source}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                  {errors.source && (
                    <p className="mt-1 text-sm text-red-600">{errors.source}</p>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <label
                  htmlFor="notes"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Additional Notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                  placeholder="Enter any additional information"
                ></textarea>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all shadow-md hover:shadow-lg flex items-center ${
                  isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? "Submitting..." : "Submit Enquiry"}
                {!isSubmitting && (
                  <svg
                    className="w-5 h-5 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
//sample