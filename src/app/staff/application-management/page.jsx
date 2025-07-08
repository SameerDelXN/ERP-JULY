"use client";
import React, { useEffect, useState } from "react";
import {
  Search,
  Eye,
  Calendar,
  User,
  Mail,
  Phone,
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
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import LoadingComponent from "@/components/Loading";

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
              value={
                <span className="group relative inline-block">
                  {application.fullName ? (
                    <>
                      {application.fullName.substring(0, 25)}
                      {application.fullName.length > 25 && (
                        <>
                          <span>...</span>
                          <span className="absolute z-10 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap bottom-full left-1/2 transform -translate-x-1/2">
                            {application.fullName}
                          </span>
                        </>
                      )}
                    </>
                  ) : (
                    "N/A"
                  )}
                </span>
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
            {application.documents && application.documents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {Object.entries(application.documents[0])
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
            ) : (
              <p className="text-gray-500 text-sm">No documents uploaded</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const AdmissionApplications = () => {
  const [selectedTab, setSelectedTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [admission, setAdmission] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedAdmissionId, setSelectedAdmissionId] = useState(null);

  useEffect(() => {
    const fetchAdmission = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/admission");
        if (!res.ok) throw new Error("Failed to fetch Admissions");
        const admissionData = await res.json();
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
      app.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app._id?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      selectedFilter === "all" || app.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredApplications?.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredApplications?.length / itemsPerPage) || 1;

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const openDetailsModal = (admissionId) => {
    setSelectedAdmissionId(admissionId);
    setShowDetailsModal(true);
  };

  if (loading) return <LoadingComponent />;

  if (error)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="p-6 text-red-600">Error: {error}</div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-6 rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Applications
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {admission.length}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 p-6 rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  In Process Review
                </p>
                <p className="text-2xl font-bold text-yellow-600">
                  {admission.filter((a) => a.status === "inProcess").length}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-100 to-green-200 p-6 rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-green-600">
                  {admission.filter((a) => a.status === "approved").length}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-lg">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-red-100 to-red-200 p-6 rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-red-600">
                  {admission.filter((a) => a.status === "rejected").length}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-lg">
                <XCircle className="w-6 h-6 text-white" />
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
                {currentItems?.map((application) => {
                  const status = application.status || "inProcess";
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
                              <span className="group relative inline-block">
                                {application.fullName ? (
                                  <>
                                    {application.fullName.substring(0, 25)}
                                    {application.fullName.length > 25 && (
                                      <>
                                        <span>...</span>
                                        <span className="absolute z-10 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap bottom-full left-1/2 transform -translate-x-1/2">
                                          {application.fullName}
                                        </span>
                                      </>
                                    )}
                                  </>
                                ) : (
                                  "N/A"
                                )}
                              </span>
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
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Showing {indexOfFirstItem + 1} to{" "}
                  {Math.min(indexOfLastItem, filteredApplications?.length)} of{" "}
                  {filteredApplications?.length} results
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-1">
                    {[...Array(totalPages)].map((_, index) => {
                      const pageNumber = index + 1;
                      if (
                        pageNumber === 1 ||
                        pageNumber === totalPages ||
                        (pageNumber >= currentPage - 1 &&
                          pageNumber <= currentPage + 1)
                      ) {
                        return (
                          <button
                            key={pageNumber}
                            onClick={() => paginate(pageNumber)}
                            className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                              currentPage === pageNumber
                                ? "bg-blue-600 text-white"
                                : "text-gray-600 hover:bg-gray-100"
                            }`}
                          >
                            {pageNumber}
                          </button>
                        );
                      } else if (
                        pageNumber === currentPage - 2 ||
                        pageNumber === currentPage + 2
                      ) {
                        return (
                          <span key={pageNumber} className="px-2 text-gray-400">
                            ...
                          </span>
                        );
                      }
                      return null;
                    })}
                  </div>

                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
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