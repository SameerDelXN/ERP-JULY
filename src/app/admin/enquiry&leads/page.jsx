
"use client";
import React, { useEffect, useState } from "react";
import {
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  User,
  GraduationCap,
  Calendar,
  XCircle,
  CheckCircle,
  Star,
  Save,
} from "lucide-react";
import Image from "next/image";

const AssignCounselorModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    assignCounselor: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
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
              {
                
              <option value="">Select Counselor</option>
              }
              
            </select>
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
  const [showAssignCounselorModal, setShowAssignCounselorModal] = useState(false);

  const totalEnquiries = enquiries.length;
  const newLeads = enquiries.filter((e) => e.status === "New").length;
  const converted = enquiries.filter((e) => e.status === "Converted").length;
  const conversionRate = totalEnquiries
    ? Math.round((converted / totalEnquiries) * 100)
    : 0;

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

  const filteredEnquiries = enquiries.filter((enquiry) => {
    const matchesSearch =
      (enquiry.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (enquiry.email?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (enquiry.course?.toLowerCase() || "").includes(searchTerm.toLowerCase());

    if (activeTab === "All") return matchesSearch;
    return matchesSearch && enquiry.status === activeTab;
  });

  const handleAssignCounselor = (formData) => {
    console.log("Assigning counselor:", formData.assignCounselor);
    setShowAssignCounselorModal(false);
  };

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
            {["All", "New", "Contacted", "Converted", "Lost"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
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
                onChange={(e) => setSearchTerm(e.target.value)}
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
              {filteredEnquiries.map((enquiry) => (
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
                          {enquiry.name}
                        </p>
                        <p className="text-sm text-gray-600">{enquiry.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <GraduationCap className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-800">
                        {enquiry.courseInterested}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        enquiry.status
                      )}`}
                    >
                      {enquiry.status.charAt(0).toUpperCase() +
                        enquiry.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-gray-700">{enquiry.source}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>{enquiry.followUps.date}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        className="p-1 text-amber-600 hover:bg-amber-50 rounded"
                        onClick={() => setShowAssignCounselorModal(true)}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-red-600 hover:bg-red-50 rounded">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-6">
        <p className="text-sm text-gray-600">Showing 1 to 3 of 3 results</p>
        <div className="flex items-center space-x-2">
          <button
            className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50"
            disabled
          >
            Previous
          </button>
          <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm">
            1
          </button>
          <button
            className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50"
            disabled
          >
            Next
          </button>
        </div>
      </div>

      {/* Modal */}
      {showAssignCounselorModal && (
        <AssignCounselorModal
          onClose={() => setShowAssignCounselorModal(false)}
          onSubmit={handleAssignCounselor}
        />
      )}
    </div>
  );
};

export default EnquiriesLeads;