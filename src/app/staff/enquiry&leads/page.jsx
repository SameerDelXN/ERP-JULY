"use client";
import React, { useEffect, useState } from "react";
import {
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Trash2,
  Phone,
  Mail,
  Calendar,
  User,
  GraduationCap,
  MapPin,
  Star,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import Image from "next/image";

const EnquiriesLeads = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  // Add counselorId - you might get this from your auth context or session
  const [counselorId, setCounselorId] = useState(null);
  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        setLoading(true);
        // Fetch counselor ID if not already available
        // This is just an example - adjust based on how you store auth info
        const counselorRes = await fetch("/api/userData");
        const counselorData = await counselorRes.json();
        setCounselorId(counselorData.id);

        const res = await fetch("/api/enquiry");
        if (!res.ok) throw new Error("Failed to fetch enquiries");
        const enquiriesData = await res.json();
        setEnquiries(enquiriesData);
      } catch (err) {
        setError(err.message);
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEnquiries();
  }, []);

  console.log(enquiries);

  const getStatusColor = (status) => {
    switch (status) {
      case "New":
        return "bg-blue-100 text-blue-800";
      case "In Progress":
        return "bg-indigo-100 text-indigo-800";
      case "Contacted":
        return "bg-yellow-100 text-yellow-800";
      case "Converted":
        return "bg-purple-100 text-purple-800";
      case "Lost":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Filter enquiries to only show those assigned to the current counselor
  const counselorEnquiries = enquiries.filter(
    (enquiry) => enquiry.counselorId === counselorId
  );

  // Update your filteredEnquiries to use counselorEnquiries
  const filteredEnquiries = counselorEnquiries.filter((enquiry) => {
    const matchesSearch =
      (enquiry.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (enquiry.email?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (enquiry.course?.toLowerCase() || "").includes(searchTerm.toLowerCase());

    if (activeTab === "All") return matchesSearch;
    return matchesSearch && enquiry.status === activeTab;
  });

  // Update your stats calculations to use counselorEnquiries instead of enquiries
  const totalEnquiries = counselorEnquiries.length;
  const newLeads = counselorEnquiries.filter((e) => e.status === "New").length;
  const converted = counselorEnquiries.filter(
    (e) => e.status === "Converted"
  ).length;
  const conversionRate = totalEnquiries
    ? Math.round((converted / totalEnquiries) * 100)
    : 0;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredEnquiries.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredEnquiries.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Enquiries & Leads
        </h1>
        <p className="text-gray-600">
          Manage and track all student enquiries and leads
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Enquiries</p>
              <p className="text-2xl font-bold text-gray-800">
                {totalEnquiries}
              </p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <User className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">New Leads</p>
              <p className="text-2xl font-bold text-gray-800">{newLeads}</p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <Plus className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Converted</p>
              <p className="text-2xl font-bold text-gray-800">{converted}</p>
            </div>
            <div className="p-2 bg-yellow-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Conversion Rate</p>
              <p className="text-2xl font-bold text-gray-800">
                {conversionRate}%
              </p>
            </div>
            <div className="p-2 bg-purple-100 rounded-lg">
              <Star className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          <div className="flex flex-wrap gap-2">
            {[
              "All",
              "New",
              "In Progress",
              "Contacted",
              "Converted",
              "Lost",
            ].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setCurrentPage(1); // Reset to first page when changing tabs
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search enquiries..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); // Reset to first page when searching
                }}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Enquiries Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Student
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Course
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Status
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Source
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Follow-up
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((enquiry) => (
                  <tr
                    key={enquiry._id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">
                            {`${enquiry.first || ''} ${enquiry.middle || ''} ${enquiry.last || ''}`.trim() || "N/A"}
                          </p>
                          <p className="text-sm text-gray-600">
                            {enquiry.email || "N/A"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <GraduationCap className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-800">
                          {enquiry.courseInterested || "N/A"}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          enquiry.status
                        )}`}
                      >
                        {enquiry.status
                          ? enquiry.status.charAt(0).toUpperCase() +
                            enquiry.status.slice(1)
                          : "N/A"}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-gray-700">
                        {enquiry.source || "N/A"}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        {(() => {
                          const dateToShow =
                            enquiry.status === "New"
                              ? new Date(enquiry.createdAt)
                              : enquiry.followUps?.length > 0
                              ? new Date(enquiry.followUps[0].date)
                              : new Date(enquiry.createdAt);

                          const formattedDate = `${dateToShow
                            .getDate()
                            .toString()
                            .padStart(2, "0")}/${(dateToShow.getMonth() + 1)
                            .toString()
                            .padStart(2, "0")}/${dateToShow.getFullYear()}`;

                          return <span>{formattedDate}</span>;
                        })()}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <button
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                          onClick={() => openDetailsModal(enquiry._id)}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          className="p-1 text-amber-600 hover:bg-amber-50 rounded"
                          onClick={() => openAssignModal(enquiry._id)}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-gray-500">
                    No enquiries found matching your criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {filteredEnquiries.length > 0 && (
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-gray-600">
            Showing {indexOfFirstItem + 1} to{" "}
            {Math.min(indexOfLastItem, filteredEnquiries.length)} of{" "}
            {filteredEnquiries.length} results
          </p>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => paginate(pageNum)}
                  className={`px-3 py-1 rounded text-sm ${
                    currentPage === pageNum
                      ? "bg-blue-600 text-white"
                      : "border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            {totalPages > 5 && currentPage < totalPages - 2 && (
              <span className="px-2">...</span>
            )}

            {totalPages > 5 && currentPage < totalPages - 2 && (
              <button
                onClick={() => paginate(totalPages)}
                className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50"
              >
                {totalPages}
              </button>
            )}

            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnquiriesLeads;
