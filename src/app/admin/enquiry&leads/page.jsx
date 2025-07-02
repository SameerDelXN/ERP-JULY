"use client";
import React, { useEffect, useState } from "react";
import {
  Search,
  Plus,
  Eye,
  Edit,
  User,
  GraduationCap,
  Calendar,
  XCircle,
  CheckCircle,
  Star,
  Mail,
  Phone,
  MessageSquare,
} from "lucide-react";
import Image from "next/image";

const EnquiryDetailsModal = ({ enquiryId, enquiries, onClose }) => {
  const [enquiry, setEnquiry] = useState(null);

  useEffect(() => {
    if (enquiryId && enquiries) {
      const foundEnquiry = enquiries.find((e) => e._id === enquiryId);
      setEnquiry(foundEnquiry || null);
    }
  }, [enquiryId, enquiries]);

  if (!enquiry) {
    return (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
        <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-lg relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <XCircle className="w-6 h-6" />
          </button>
          <div className="text-center py-12 text-gray-500">
            No enquiry found
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <XCircle className="w-6 h-6" />
        </button>

        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Enquiry Details
          </h2>
          <div className="space-y-4">
            <DetailRow
              icon={<User />}
              label="Name"
              value={`${enquiry.first || ''} ${enquiry.middle || ''} ${enquiry.last || ''}`.trim() || "N/A"}
            />
            <DetailRow
              icon={<Mail />}
              label="Email"
              value={enquiry.email || "N/A"}
            />
            <DetailRow
              icon={<Phone />}
              label="Phone"
              value={enquiry.phone || "N/A"}
            />
            <DetailRow
              icon={<GraduationCap />}
              label="Course"
              value={enquiry.courseInterested || "N/A"}
            />
            <DetailRow
              icon={<Calendar />}
              label="Date"
              value={
                enquiry.createdAt
                  ? new Date(enquiry.createdAt).toLocaleDateString()
                  : "N/A"
              }
            />
            <DetailRow
              icon={<MessageSquare />}
              label="Source"
              value={enquiry.source || "N/A"}
            />
            <DetailRow
              icon={<MessageSquare />}
              label="Status"
              value={enquiry.status || "N/A"}
            />
            {enquiry?.followUps?.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-1">
                  Follow Ups:
                </p>
                <ul className="space-y-1 list-disc list-inside text-sm text-gray-700">
                  {enquiry.followUps.map((fup, index) => (
                    <li key={index}>
                      <span className="font-medium">
                        {fup.date
                          ? new Date(fup.date).toLocaleDateString()
                          : "N/A"}
                        :
                      </span>{" "}
                      {fup?.note || "N/A"}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailRow = ({ icon, label, value }) => (
  <div className="flex items-center gap-3 text-gray-700">
    <div className="bg-gray-100 p-2 rounded-lg text-blue-600">{icon}</div>
    <div>
      <p className="text-sm font-semibold">{label}</p>
      <p className="text-sm">{value || "N/A"}</p>
    </div>
  </div>
);

const AssignCounselorModal = ({ onClose, onSubmit, enquiryId }) => {
  const [counselors, setCounselors] = useState([]);
  const [loadingCounselors, setLoadingCounselors] = useState(true);
  const [counselorError, setCounselorError] = useState(null);
  const [formData, setFormData] = useState({
    assignCounselor: "",
    followUpDate: "",
    followUpNote: "",
  });

  useEffect(() => {
    const fetchCounselors = async () => {
      try {
        const res = await fetch("/api/userData");
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        const staffUser = data.users;

        if (!Array.isArray(staffUser)) {
          throw new Error("Expected array data but got something else");
        }

        const staffUsers = staffUser.filter((user) => user.role === "staff");
        setCounselors(staffUsers);
        setCounselorError(null);
      } catch (error) {
        console.error("Failed to fetch counselors:", error);
        setCounselorError(error.message);
        setCounselors([]);
      } finally {
        setLoadingCounselors(false);
      }
    };

    fetchCounselors();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSubmit(
        formData.assignCounselor,
        enquiryId,
        formData.followUpDate,
        formData.followUpNote
      );
      onClose();
    } catch (error) {
      alert(`Failed to assign counselor: ${error.message}`);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Assign Counselor
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XCircle className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Counselor *
            </label>
            <select
              value={formData.assignCounselor}
              onChange={(e) =>
                setFormData({ ...formData, assignCounselor: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Counselor</option>
              {counselors.map((counselor) => (
                <option key={counselor._id} value={counselor._id}>
                  {counselor?.fullName || "Unknown Counselor"}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Set Follow-Up Date *
            </label>
            <input
              type="date"
              value={formData.followUpDate}
              onChange={(e) =>
                setFormData({ ...formData, followUpDate: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add Follow-Up Note *
            </label>
            <input
              type="text"
              value={formData.followUpNote}
              onChange={(e) =>
                setFormData({ ...formData, followUpNote: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Assign
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const EnquiriesLeads = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showAssignCounselorModal, setShowAssignCounselorModal] = useState(false);
  const [selectedEnquiryId, setSelectedEnquiryId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const totalEnquiries = enquiries.length;
  const newLeads = enquiries.filter((e) => e.status === "New").length;
  const converted = enquiries.filter((e) => e.status === "Converted").length;
  const conversionRate = totalEnquiries
    ? Math.round((converted / totalEnquiries) * 100)
    : 0;

  const filteredEnquiries = enquiries.filter((enquiry) => {
    const matchesSearch =
      (enquiry.first?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (enquiry.email?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (enquiry.courseInterested?.toLowerCase() || "").includes(
        searchTerm.toLowerCase()
      );

    if (activeTab === "All") return matchesSearch;
    return matchesSearch && enquiry.status === activeTab;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredEnquiries.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredEnquiries.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/enquiry");
        if (!res.ok) throw new Error("Failed to fetch enquiries");
        const enquiriesData = await res.json();
        setEnquiries(enquiriesData);
      } catch (error) {
        setError(error.message);
        console.error("Failed to fetch enquiries:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEnquiries();
  }, []);

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

  const handleAssignCounselor = async (
    counselorId,
    enquiryId,
    followUpDate,
    followUpNote
  ) => {
    try {
      const response = await fetch(`/api/enquiry/${enquiryId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          counsellorId: counselorId,
          status: "In Progress",
          followUps: [
            {
              date: new Date(followUpDate).toISOString(),
              note: followUpNote || "Assigned Counselor",
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to assign counselor");
      }

      const updatedEnquiry = await response.json();

      setEnquiries((prevEnquiries) =>
        prevEnquiries.map((enquiry) =>
          enquiry._id === enquiryId
            ? {
                ...enquiry,
                counsellorId: counselorId,
                status: "In Progress",
                followUps: [
                  ...(enquiry.followUps || []),
                  {
                    date: new Date(followUpDate).toISOString(),
                    note: followUpNote || "Assigned Counselor",
                  },
                ],
              }
            : enquiry
        )
      );

      return updatedEnquiry;
    } catch (error) {
      console.error("Error assigning counselor:", error);
      throw error;
    }
  };

  const openDetailsModal = (enquiryId) => {
    setSelectedEnquiryId(enquiryId);
    setShowDetailsModal(true);
  };

  const openAssignModal = (enquiryId) => {
    setSelectedEnquiryId(enquiryId);
    setShowAssignCounselorModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Image
          src="/loading.svg"
          alt="Loading..."
          width={300}
          height={300}
          className="mb-4"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="p-6 text-red-600">Error: {error}</div>
      </div>
    );
  }

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

      {/* Modals */}
      {showAssignCounselorModal && (
        <AssignCounselorModal
          onClose={() => {
            setShowAssignCounselorModal(false);
            setSelectedEnquiryId(null);
          }}
          onSubmit={handleAssignCounselor}
          enquiryId={selectedEnquiryId}
        />
      )}
      {showDetailsModal && (
        <EnquiryDetailsModal
          enquiryId={selectedEnquiryId}
          enquiries={enquiries}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedEnquiryId(null);
          }}
        />
      )}
    </div>
  );
};

export default EnquiriesLeads;