"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

const StudentProfile = () => {
  const params = useParams();
  const router = useRouter();
  const [student, setStudent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/students/${params.id}`);
        if (!res.ok) {
          throw new Error("Failed to fetch student");
        }
        const data = await res.json();
        console.log(data);
        
        setStudent(data);
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
        console.error("Failed to load student:", err);
      }
    };

    if (params.id) {
      fetchStudent();
    }
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-xl font-semibold text-gray-600">Loading student profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl font-semibold text-red-600 mb-4">Error: {error}</div>
          <button
            onClick={() => router.back()}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl font-semibold text-gray-600 mb-4">Student not found</div>
          <button
            onClick={() => router.back()}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/admin/student-profiles"
            className="text-blue-600 hover:text-blue-800 mb-4 inline-flex items-center"
          >
            ← Back to Students
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-2">Student Profile</h1>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-8 text-white">
            <div className="flex items-center">
              <div className="h-20 w-20 bg-white text-black bg-opacity-20 rounded-full flex items-center justify-center text-2xl font-bold">
                {(student.fullName || student.name).charAt(0).toUpperCase()}
              </div>
              <div className="ml-6">
                <h2 className="text-2xl font-bold">{student.fullName || student.name}</h2>
                <p className="text-blue-100">{student.email}</p>
                <p className="text-blue-100 mt-1">ID: {student.studentId}</p>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="px-6 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Full Name</span>
                    <p className="text-gray-900">{student.fullName || student.name}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Email</span>
                    <p className="text-gray-900">{student.email}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Phone</span>
                    <p className="text-gray-900">{student.phone || "Not provided"}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Date of Birth</span>
                    <p className="text-gray-900">
                      {student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString() : "Not provided"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Academic Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Academic Information</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Student ID</span>
                    <p className="text-gray-900">{student.studentId}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Program Type</span>
                    <p className="text-gray-900">{student.programType || "N/A"}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Branch/Course</span>
                    <p className="text-gray-900">{student.branch}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Status    </span>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        student.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {student.status ? student.status.charAt(0).toUpperCase() + student.status.slice(1) : "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Address Information */}
            {student.address && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Address Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Address</span>
                    <p className="text-gray-900">
                      {student.address.street || student.address.addressLine1 || "Not provided"}
                    </p>
                    {student.address.city && (
                      <p className="text-gray-900">{student.address.city}</p>
                    )}
                    {student.address.state && (
                      <p className="text-gray-900">{student.address.state}</p>
                    )}
                    {student.address.zipCode && (
                      <p className="text-gray-900">{student.address.zipCode}</p>
                    )}
                    {student.address.country && (
                      <p className="text-gray-900">{student.address.country}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Additional Information */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <span className="text-sm font-medium text-gray-500">Admission Date</span>
                  <p className="text-gray-900">
                    {student.admissionDate ? new Date(student.admissionDate).toLocaleDateString() : "Not provided"}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Created At</span>
                  <p className="text-gray-900">
                    {new Date(student.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => router.back()}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;