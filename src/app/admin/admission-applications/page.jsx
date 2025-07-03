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
  Zap,
  Target,
  Activity,
  MessageSquare,
  File,
  FileTextIcon,
} from "lucide-react";
import Image from "next/image";

const DetailCard = ({ icon, label, value, bgColor, iconColor }) => (
  <div className="flex items-start gap-3">
    <div className={`p-2 rounded-lg ${bgColor} ${iconColor}`}>{icon}</div>
    <div>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="font-medium text-gray-900">{value}</p>
    </div>
  </div>
);

const AdmissionDetailsModal = ({ admissionId, admission, onClose }) => {
  const [application, setApplication] = useState(null);

  useEffect(() => {
    if (admissionId && admission) {
      const foundEnquiry = admission.find((e) => e._id === admissionId);
      setApplication(foundEnquiry || null);
    }
  }, [admissionId, admission]);

  if (!application) {
    return (
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 w-full max-w-2xl shadow-2xl relative border border-gray-100">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
          >
            <XCircle className="w-5 h-5" />
          </button>
          <div className="text-center py-16 text-gray-500">
            <User className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">No admission found</p>
          </div>
        </div>
      </div>
    );
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "New":
        return <Zap className="w-4 h-4" />;
      case "In Progress":
        return <Clock className="w-4 h-4" />;
      case "Contacted":
        return <Phone className="w-4 h-4" />;
      case "Converted":
        return <Target className="w-4 h-4" />;
      case "Lost":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  console.log(application.documents);

  const getStatusColor = (status) => {
    switch (status) {
      case "New":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "In Progress":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Contacted":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "Converted":
        return "bg-green-50 text-green-700 border-green-200";
      case "Lost":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl relative border border-gray-100 max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Admission Details
              </h2>
              <p className="text-sm text-gray-600">
                Complete information overview
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-white rounded-full"
          >
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* Status Banner */}
          <div
            className={`flex items-center gap-3 p-4 rounded-xl border mb-6 ${getStatusColor(
              application.status
            )}`}
          >
            {getStatusIcon(application.status)}
            <div>
              <p className="font-semibold">
                Status: {application.status || "Unknown"}
              </p>
              <p className="text-sm opacity-80">
                Last updated:{" "}
                {application.createdAt
                  ? new Date(application.createdAt).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
          </div>

          {/* Main Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 px-5">
            <DetailCard
              icon={<User className="w-5 h-5" />}
              label="Full Name"
              value={application.fullName ||
                `${application.first || ""} ${application.middle || ""} ${
                  application.last || ""
                }`.trim() || "N/A"
              }
              bgColor="bg-blue-50"
              iconColor="text-blue-600"
            />
            <DetailCard
              icon={<Mail className="w-5 h-5" />}
              label="Email Address"
              value={application.email || "N/A"}
              bgColor="bg-green-50"
              iconColor="text-green-600"
            />
            <DetailCard
              icon={<Phone className="w-5 h-5" />}
              label="Phone Number"
              value={application.mobileNumber || "N/A"}
              bgColor="bg-purple-50"
              iconColor="text-purple-600"
            />
            <DetailCard
              icon={<GraduationCap className="w-5 h-5" />}
              label="Course Interested"
              value={application.courseName || "N/A"}
              bgColor="bg-orange-50"
              iconColor="text-orange-600"
            />
            <DetailCard
              icon={<Calendar className="w-5 h-5" />}
              label="Date of Birth"
              value={
                application.dateOfBirth
                  ? new Date(application.dateOfBirth).toLocaleDateString()
                  : "N/A"
              }
              bgColor="bg-teal-50"
              iconColor="text-teal-600"
            />
            <DetailCard
              icon={<MessageSquare className="w-5 h-5" />}
              label="Nationality"
              value={application.nationality || "N/A"}
              bgColor="bg-pink-50"
              iconColor="text-pink-600"
            />
            <DetailCard
              icon={<MessageSquare className="w-5 h-5" />}
              label="Gender"
              value={application.gender || "N/A"}
              bgColor="bg-pink-50"
              iconColor="text-pink-600"
            />
            <DetailCard
              icon={<MessageSquare className="w-5 h-5" />}
              label="Father Name"
              value={application.fatherName || "N/A"}
              bgColor="bg-pink-50"
              iconColor="text-pink-600"
            />
            <DetailCard
              icon={<MessageSquare className="w-5 h-5" />}
              label="Mother Name"
              value={application.motherName || "N/A"}
              bgColor="bg-pink-50"
              iconColor="text-pink-600"
            />
            <DetailCard
              icon={<Phone className="w-5 h-5" />}
              label="Parent Number"
              value={application.parentMobile || "N/A"}
              bgColor="bg-purple-50"
              iconColor="text-purple-600"
            />
            <DetailCard
              icon={<Phone className="w-5 h-5" />}
              label="Parent Email"
              value={application.parentEmail || "N/A"}
              bgColor="bg-purple-50"
              iconColor="text-purple-600"
            />
            <DetailCard
              icon={<Phone className="w-5 h-5" />}
              label="Address"
              value={application.addressLine || "N/A"}
              bgColor="bg-purple-50"
              iconColor="text-purple-600"
            />
            <DetailCard
              icon={<Phone className="w-5 h-5" />}
              label="city"
              value={application.city || "N/A"}
              bgColor="bg-purple-50"
              iconColor="text-purple-600"
            />
            <DetailCard
              icon={<Phone className="w-5 h-5" />}
              label="state"
              value={application.state || "N/A"}
              bgColor="bg-purple-50"
              iconColor="text-purple-600"
            />
            <DetailCard
              icon={<Phone className="w-5 h-5" />}
              label="pincode"
              value={application.pincode || "N/A"}
              bgColor="bg-purple-50"
              iconColor="text-purple-600"
            />
            <DetailCard
              icon={<Phone className="w-5 h-5" />}
              label="country"
              value={application.country || "N/A"}
              bgColor="bg-purple-50"
              iconColor="text-purple-600"
            />
            <DetailCard
              icon={<Phone className="w-5 h-5" />}
              label="currentSchoolName"
              value={application.currentSchoolName || "N/A"}
              bgColor="bg-purple-50"
              iconColor="text-purple-600"
            />
            <DetailCard
              icon={<Phone className="w-5 h-5" />}
              label="currentClass"
              value={application.currentClass || "N/A"}
              bgColor="bg-purple-50"
              iconColor="text-purple-600"
            />
            <DetailCard
              icon={<Phone className="w-5 h-5" />}
              label="academicYear"
              value={application.academicYear || "N/A"}
              bgColor="bg-purple-50"
              iconColor="text-purple-600"
            />
            <DetailCard
              icon={<Phone className="w-5 h-5" />}
              label="preferredMedium"
              value={application.preferredMedium || "N/A"}
              bgColor="bg-purple-50"
              iconColor="text-purple-600"
            />
          </div>
          <div className="bg-gray-50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                <File className="w-4 h-4 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Documents</h3>
            </div>
            {!application.documents && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {Object?.entries(application.documents[0])
                  .filter(([key]) => key !== "_id")
                  .map(([key, doc]) => (
                    <DetailCard
                      key={key}
                      icon={<FileTextIcon className="w-5 h-5" />}
                      label={key}
                      value={doc.fileName || "N/A"}
                      bgColor="bg-purple-50"
                      iconColor="text-purple-600"
                    />
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const AdmissionApplications = () => {
  const [selectedTab, setSelectedTab] = useState("all");
  const [showNewApplication, setShowNewApplication] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [admission, setAdmission] = useState([]);

  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedAdmissionId, setSelectedAdmissionId] = useState(null);

  useEffect(() => {
    const fetchAdmission = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/admission");
        console.log(res);

        if (!res.ok) throw new Error("Failed to fetch Admissions");
        const admissionData = await res.json();
        console.log(admissionData);

        setAdmission(admissionData.data);
      } catch (error) {
        setError(error.message);
        console.error("Failed to fetch admissions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdmission();
  }, []);

  const statusConfig = {
    inProcess: {
      color: "bg-yellow-100 text-yellow-800",
      icon: Clock,
      label: "In Process",
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
  };

  const filteredApplications = admission?.filter((app) => {
    const matchesSearch =
      app.first?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app._id?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      selectedFilter === "all" || app.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const openDetailsModal = (admissionId) => {
    setSelectedAdmissionId(admissionId);
    setShowDetailsModal(true);
  };

  if (loading)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
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
                <p className="text-2xl font-bold text-gray-900">
                  {admission.length}
                </p>
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
                  In Process Review
                </p>
                <p className="text-2xl font-bold text-yellow-600">
                  {admission.filter((a) => a.status === "inProcess").length}
                </p>
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
                <p className="text-2xl font-bold text-green-600">
                  {admission.filter((a) => a.status === "approved").length}
                </p>
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
                <p className="text-2xl font-bold text-red-600">
                  {admission.filter((a) => a.status === "rejected").length}
                </p>
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
                  <option value="inProcess">In Process</option>
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
                    Applying For
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
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
                  const status = application.status || "In Process";
                  const config = statusConfig[status] || statusConfig.inProcess;
                  return (
                    <tr key={application._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                              <User className="w-5 h-5 text-gray-600" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {application.fullName || `${application.first || ""} ${
                                application.middle || ""
                              } ${application.last || ""}`.trim() || "N/A"}
                            </div>
                            <div className="text-sm text-gray-500">
                              {application.email}
                            </div>
                            <div className="text-xs text-gray-400">
                              ID: {application._id?.slice(-6) || "N/A"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {application.courseName || "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}
                        >
                          <config.icon className="w-3 h-3 mr-1" />
                          {config.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {application.createdAt
                          ? new Date(application.createdAt).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            className="text-blue-600 hover:text-blue-900"
                            onClick={() => openDetailsModal(application._id)}
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {/* <button className="text-gray-600 hover:text-gray-900">
                            <Edit2 className="w-4 h-4" />
                          </button> */}
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
                  <span className="font-medium">
                    {Math.min(4, filteredApplications.length)}
                  </span>{" "}
                  of{" "}
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

      {showDetailsModal && (
        <AdmissionDetailsModal
          admissionId={selectedAdmissionId}
          admission={admission}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedAdmissionId(null);
          }}
        />
      )}
    </div>
  );
};

export default AdmissionApplications;
