"use client";
import {
  User,
  Phone,
  Mail,
  BookOpen,
  Info,
  Calendar,
  ChevronDown,
} from "lucide-react";
import { useState, useEffect } from "react";

export default function EnquiryForm() {
  const [courseOptions, setCourseOptions] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [mobileOTP, setMobileOTP] = useState('');
  const [emailToken, setEmailToken] = useState('');
  const [generatedOTP, setGeneratedOTP] = useState('');
  const [mobileVerified, setMobileVerified] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [showOTPSection, setShowOTPSection] = useState(false);
  const [showEmailSection, setShowEmailSection] = useState(false);
  const [verificationCheckInterval, setVerificationCheckInterval] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    phone: "",
    email: "",
    course: "",
    source: "",
    notes: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("/api/courses");
        if (!response.ok) throw new Error("Failed to fetch courses");
        const data = await response.json();
        setCourseOptions(data.map(course => course.name));
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoadingCourses(false);
      }
    };

    fetchCourses();
  }, []);

  const handleSendOTP = async () => {
    if (!formData.phone || formData.phone.length !== 10) {
      setErrors({...errors, phone: 'Valid phone number required'});
      return;
    }

    try {
      const response = await fetch('/api/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone: formData.phone }),
      });

      const data = await response.json();

      if (response.ok) {
        setGeneratedOTP(data.otp); // In production, store in DB and verify against it
        setShowOTPSection(true);
      } else {
        throw new Error(data.error || 'Failed to send OTP');
      }
    } catch (error) {
      setErrors({...errors, submit: error.message});
    }
  };
// Add this useEffect to handle verification status checks
// Replace your existing verification useEffect with this optimized version
useEffect(() => {
  let intervalId;

  const checkVerificationStatus = async () => {
    try {
      console.log('Checking verification status for:', formData.email);
      const response = await fetch('/api/check-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email })
      });
      
      const data = await response.json();
      console.log('Verification response:', data);
      
      if (data.verified) {
        console.log('Email verified, updating state...');
        setEmailVerified(true);
        setShowEmailSection(false);
        localStorage.setItem(`verifiedEmail_${formData.email}`, 'true');
        clearInterval(intervalId);
      }
    } catch (error) {
      console.error('Verification check failed:', error);
    }
  };

  if (formData.email && !emailVerified) {
    // Check immediately when email changes
    checkVerificationStatus();
    
    // Then set up polling every 3 seconds
    intervalId = setInterval(checkVerificationStatus, 3000);
  }

  return () => {
    if (intervalId) clearInterval(intervalId);
  };
}, [formData.email, emailVerified]);
// Add this useEffect to check verification status when email is entered
useEffect(() => {
  if (formData.email) {
    // Check localStorage first
    const isVerified = localStorage.getItem(`verifiedEmail_${formData.email}`) === 'true';
    if (isVerified) {
      setEmailVerified(true);
      setShowEmailSection(false);
      return;
    }

    // Then check server status
    const checkServerVerification = async () => {
      try {
        const response = await fetch('/api/check-verification', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: formData.email })
        });
        
        const data = await response.json();
        if (data.verified) {
          setEmailVerified(true);
          setShowEmailSection(false);
          localStorage.setItem(`verifiedEmail_${formData.email}`, 'true');
        }
      } catch (error) {
        console.error('Initial verification check failed:', error);
      }
    };

    checkServerVerification();
  }
}, [formData.email]);
useEffect(() => {
  return () => {
    if (verificationCheckInterval) {
      clearInterval(verificationCheckInterval);
    }
  };
}, [verificationCheckInterval]);
// Add this useEffect at the top of your component
useEffect(() => {
  // Check URL parameters for verification status
  const urlParams = new URLSearchParams(window.location.search);
  const verified = urlParams.get('verified');
  const verificationError = urlParams.get('verificationError');

  if (verified === 'true' && formData.email) {
    setEmailVerified(true);
    setShowEmailSection(false);
    localStorage.setItem(`verifiedEmail_${formData.email}`, 'true');
    
    // Clean up the URL
    window.history.replaceState({}, document.title, window.location.pathname);
  }

  if (verificationError === 'true') {
    setErrors({...errors, emailVerification: 'Email verification failed'});
    
    // Clean up the URL
    window.history.replaceState({}, document.title, window.location.pathname);
  }
}, [formData.email]);
  const verifyMobileOTP = () => {
    if (mobileOTP === generatedOTP) { // In production, verify against DB-stored OTP
      setMobileVerified(true);
      setShowOTPSection(false);
      sendVerificationEmail();
    } else {
      setErrors({...errors, otp: 'Invalid OTP'});
    }
  };

  const sendVerificationEmail = async () => {
    try {
      const response = await fetch('/api/send-verification-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await response.json();

      if (response.ok) {
        setShowEmailSection(true);
      } else {
        throw new Error(data.error || 'Failed to send verification email');
      }
    } catch (error) {
      setErrors({...errors, submit: error.message});
    }
  };

const verifyEmailToken = async () => {
  try {
    const response = await fetch('/api/verify-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        email: formData.email, 
        token: emailToken 
      }),
    });

    const data = await response.json();

    if (response.ok && data.verified) {
      setEmailVerified(true);
      setShowEmailSection(false);
      localStorage.setItem(`verifiedEmail_${formData.email}`, 'true');
    } else {
      setErrors({...errors, emailVerification: data.error || 'Verification failed'});
    }
  } catch (error) {
    setErrors({...errors, emailVerification: error.message});
  }
};
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Handle name fields (firstName, middleName, lastName)
    if (name === "lastName" || name === "middleName" || name === "firstName") {
      if (!/^[a-zA-Z\s]*$/.test(value)) {
        setErrors({
          ...errors,
          [name]: "Only alphabetic characters are allowed",
        });
        return;
      }
    }

    // Handle phone field
    if (name === 'phone') {
      if (/\D/.test(value)) {
        setErrors({
          ...errors,
          phone: "Only numbers are allowed"
        });
      } else {
        if (errors.phone) {
          setErrors({
            ...errors,
            phone: null
          });
        }
      }
      
      const numericValue = value.replace(/\D/g, '');
      setFormData({
        ...formData,
        [name]: numericValue.slice(0, 10)
      });
      return;
    }

    // Handle all other fields
    setFormData({
      ...formData,
      [name]: value
    });

    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Institute Enquiry Form
          </h1>
          <p className="text-gray-600">
            Fill out this form and our team will get back to you within 24 hours
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6 sm:p-8">
            {/* Error message for submission */}
            {errors.submit && (
              <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg">
                {errors.submit}
              </div>
            )}

            {/* Personal Information Section */}
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
                  />{" "}
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
                  {!mobileVerified && formData.phone.length === 10 && (
                    <button
                      type="button"
                      onClick={handleSendOTP}
                      className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                    >
                      {showOTPSection ? 'Resend OTP' : 'Send OTP'}
                    </button>
                  )}
                  {mobileVerified && (
                    <p className="mt-2 text-sm text-green-600 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Mobile number verified
                    </p>
                  )}
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
       
{emailVerified ? (
  <div className="mt-2">
    <p className="text-sm text-green-600 flex items-center">
      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
      </svg>
      Email verified
    </p>
  </div>
) : (
  <div>
    <button
      type="button"
      onClick={sendVerificationEmail}
      className="mt-2 text-sm text-blue-600 hover:text-blue-800"
    >
      {showEmailSection ? 'Resend Verification' : 'Send Verification Email'}
    </button>
  
  </div>
)}
                </div>
              </div>

              {/* OTP Verification Section */}
              {showOTPSection && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center mb-3">
                    <Phone className="w-5 h-5 text-blue-600 mr-2" />
                    <h3 className="font-medium">Mobile Verification</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    We've sent an OTP to your mobile number ending with {formData.phone.slice(-3)}
                  </p>
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={mobileOTP}
                      onChange={(e) => setMobileOTP(e.target.value)}
                      maxLength={6}
                      className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                      placeholder="Enter 6-digit OTP"
                    />
                    <button
                      onClick={verifyMobileOTP}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Verify
                    </button>
                  </div>
                  {errors.otp && (
                    <p className="mt-1 text-sm text-red-600">{errors.otp}</p>
                  )}
                </div>
              )}

              {/* Email Verification Section */}
           
            </div>

            {/* Enquiry Details Section */}
            <div className="mb-10">
              <div className="flex items-center mb-6">
                <div className="p-2 rounded-lg bg-blue-50 text-blue-600 mr-3">
                  <Info className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Enquiry Details
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition appearance-none"
                      >
                        <option value="">Select a course</option>
                        {courseOptions.map((course, index) => (
                          <option key={index} value={course}>
                            {course}
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

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting || !mobileVerified || !emailVerified}
                className={`px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all shadow-md hover:shadow-lg flex items-center ${
                  isSubmitting || !mobileVerified || !emailVerified ? "opacity-70 cursor-not-allowed" : ""
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
            
            {/* Verification Status */}
            {(showOTPSection || showEmailSection || !mobileVerified || !emailVerified) && (
              <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <h3 className="font-medium text-yellow-800 mb-2">Verification Required</h3>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li className={`flex items-center ${mobileVerified ? 'text-green-600' : ''}`}>
                    {mobileVerified ? (
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                    Mobile Number {mobileVerified ? 'Verified' : 'Not Verified'}
                  </li>
                  <li className={`flex items-center ${emailVerified ? 'text-green-600' : ''}`}>
                    {emailVerified ? (
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                    Email Address {emailVerified ? 'Verified' : 'Not Verified'}
                  </li>
                </ul>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}