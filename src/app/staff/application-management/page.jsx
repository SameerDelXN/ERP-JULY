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
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const FormField = ({
  control,
  name,
  label,
  type = "text",
  placeholder = "",
  options = [],
  icon = null,
  error = null,
  required = false,
  ...props
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        if (type === "select") {
          return (
            <select
              {...field}
              className={`w-full px-3 py-2 border ${
                error ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              {...props}
            >
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          );
        }

        if (type === "date") {
          return (
            <div className="relative">
              <input
                {...field}
                type="date"
                className={`w-full px-3 py-2 border ${
                  error ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                placeholder={placeholder}
                {...props}
              />
              {icon && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  {icon}
                </div>
              )}
            </div>
          );
        }

        return (
          <div className="relative">
            <input
              {...field}
              type={type}
              className={`w-full px-3 py-2 border ${
                error ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              placeholder={placeholder}
              {...props}
            />
            {icon && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                {icon}
              </div>
            )}
          </div>
        );
      }}
    />
    {error && <p className="mt-1 text-sm text-red-600">{error.message}</p>}
  </div>
);

const DocumentField = ({
  name,
  label,
  accept,
  multiple = false,
  renderStatus,
  onChange,
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <div className="flex items-center gap-3">
      {renderStatus()}
      <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-lg text-sm transition-colors">
        {multiple ? "Upload Files" : "Upload File"}
        <input
          type="file"
          name={name}
          className="hidden"
          accept={accept}
          multiple={multiple}
          onChange={onChange}
        />
      </label>
    </div>
  </div>
);

const PersonalDetailsStep = ({ control, errors }) => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
      <User className="w-5 h-5 text-blue-600" />
      Personal Details
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={control}
        name="fullName"
        label="Full Name"
        type="text"
        placeholder="As per mark sheet (CAPITAL)"
        error={errors.fullName}
        required
      />

      <FormField
        control={control}
        name="dateOfBirth"
        label="Date of Birth"
        type="date"
        icon={<Calendar className="w-4 h-4" />}
        error={errors.dateOfBirth}
        required
      />

      <FormField
        control={control}
        name="gender"
        label="Gender"
        type="select"
        options={[
          { value: "", label: "Select Gender" },
          { value: "Male", label: "Male" },
          { value: "Female", label: "Female" },
          { value: "Other", label: "Other" },
        ]}
        error={errors.gender}
        required
      />

      <FormField
        control={control}
        name="nationality"
        label="Nationality"
        type="text"
        error={errors.nationality}
        required
      />

      <FormField
        control={control}
        name="category"
        label="Category"
        type="select"
        options={[
          { value: "", label: "Select Category" },
          { value: "Open", label: "Open" },
          { value: "SC", label: "SC" },
          { value: "ST", label: "ST" },
          { value: "OBC", label: "OBC" },
          { value: "EWS", label: "EWS" },
          { value: "NT", label: "NT" },
          { value: "SBC", label: "SBC" },
          { value: "VJ", label: "VJ" },
          { value: "Other", label: "Other" },
        ]}
      />

      <FormField
        control={control}
        name="mobileNumber"
        label="Mobile Number"
        type="tel"
        placeholder="10-digit mobile number"
        icon={<Phone className="w-4 h-4" />}
        error={errors.mobileNumber}
        required
      />

      <FormField
        control={control}
        name="email"
        label="Email"
        type="email"
        icon={<Mail className="w-4 h-4" />}
        error={errors.email}
        required
      />
    </div>
  </div>
);

const ParentDetailsStep = ({ control, errors }) => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
      <Users className="w-5 h-5 text-blue-600" />
      Parent/Guardian Details
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={control}
        name="fatherName"
        label="Father's Name"
        type="text"
      />

      <FormField
        control={control}
        name="motherName"
        label="Mother's Name"
        type="text"
      />

      <FormField
        control={control}
        name="guardianName"
        label="Guardian's Name"
        type="text"
        placeholder="If applicable"
      />

      <FormField
        control={control}
        name="parentMobile"
        label="Parent/Guardian Mobile"
        type="tel"
        icon={<Phone className="w-4 h-4" />}
        error={errors.parentMobile}
      />

      <FormField
        control={control}
        name="parentEmail"
        label="Parent/Guardian Email"
        type="email"
        icon={<Mail className="w-4 h-4" />}
        error={errors.parentEmail}
      />

      <FormField
        control={control}
        name="familyIncome"
        label="Annual Family Income (₹)"
        type="number"
        error={errors.familyIncome}
      />
    </div>
  </div>
);

const AddressDetailsStep = ({ control, errors }) => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
      <Home className="w-5 h-5 text-blue-600" />
      Address Details
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="md:col-span-2">
        <FormField
          control={control}
          name="addressLine"
          label="Address Line"
          type="text"
          placeholder="House no, street, area"
          error={errors.addressLine}
          required
        />
      </div>

      <FormField
        control={control}
        name="city"
        label="City"
        type="text"
        error={errors.city}
        required
      />

      <FormField
        control={control}
        name="state"
        label="State"
        type="text"
        error={errors.state}
        required
      />

      <FormField
        control={control}
        name="pincode"
        label="Pincode"
        type="text"
        placeholder="6-digit pincode"
        error={errors.pincode}
        required
      />

      <FormField
        control={control}
        name="country"
        label="Country"
        type="text"
        error={errors.country}
        required
      />
    </div>
  </div>
);

const AcademicDetailsStep = ({ control, errors }) => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
      <School className="w-5 h-5 text-blue-600" />
      Academic Information
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={control}
        name="programType"
        label="Program Type"
        type="select"
        options={[
          { value: "", label: "Select Program Type" },
          { value: "Diploma", label: "Diploma" },
          { value: "UG", label: "Undergraduate" },
          { value: "PG", label: "Postgraduate" },
        ]}
        error={errors.programType}
        required
      />

      <FormField
        control={control}
        name="courseName"
        label="Course Name"
        type="text"
        error={errors.courseName}
        required
      />

      <FormField
        control={control}
        name="yearOfAdmission"
        label="Year of Admission"
        type="select"
        options={[
          { value: "", label: "Select Year" },
          { value: "1st Year", label: "1st Year" },
          { value: "2nd Year", label: "2nd Year" },
          { value: "3rd Year", label: "3rd Year" },
          { value: "4th Year", label: "4th Year" },
        ]}
        error={errors.yearOfAdmission}
        required
      />

      <FormField
        control={control}
        name="round"
        label="Admission Round"
        type="select"
        options={[
          { value: "", label: "Select Round" },
          { value: "CAP1", label: "CAP Round 1" },
          { value: "CAP2", label: "CAP Round 2" },
          { value: "CAP3", label: "CAP Round 3" },
          { value: "Institute Level", label: "Institute Level" },
        ]}
      />

      <FormField
        control={control}
        name="seatType"
        label="Seat Type"
        type="select"
        options={[
          { value: "", label: "Select Seat Type" },
          { value: "GOV", label: "Government" },
          { value: "MIN", label: "Minority" },
          { value: "Management", label: "Management" },
          { value: "TFWS", label: "TFWS" },
        ]}
      />

      <FormField
        control={control}
        name="admissionCategoryDTE"
        label="Admission Category (DTE)"
        type="select"
        options={[
          { value: "", label: "Select Category" },
          { value: "CAP", label: "CAP" },
          { value: "Institute Level", label: "Institute Level" },
          { value: "Against CAP", label: "Against CAP" },
        ]}
      />

      <FormField
        control={control}
        name="casteAsPerLC"
        label="Caste as per LC"
        type="text"
      />

      <FormField
        control={control}
        name="subCasteAsPerLC"
        label="Sub-Caste as per LC"
        type="text"
      />

      <FormField
        control={control}
        name="domicile"
        label="Domicile"
        type="text"
      />

      <FormField
        control={control}
        name="religionAsPerLC"
        label="Religion as per LC"
        type="text"
      />
    </div>

    <h3 className="text-lg font-semibold text-gray-900 mt-6 flex items-center gap-2">
      <BookOpen className="w-5 h-5 text-blue-600" />
      Academic Details
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={control}
        name="qualifyingExam"
        label="Qualifying Exam"
        type="text"
        placeholder="e.g., HSC, Graduation"
      />

      <FormField
        control={control}
        name="marksObtained"
        label="Marks Obtained"
        type="number"
      />

      <FormField
        control={control}
        name="totalMarks"
        label="Total Marks"
        type="number"
      />

      <FormField
        control={control}
        name="percentage"
        label="Percentage"
        type="number"
        step="0.01"
        min="0"
        max="100"
      />

      <FormField control={control} name="grade" label="Grade" type="text" />

      <FormField
        control={control}
        name="monthYearOfPassing"
        label="Month & Year of Passing"
        type="text"
        placeholder="e.g., Mar 2023"
      />
    </div>
  </div>
);

const DocumentUploadStep = ({
  control,
  errors,
  watch,
  uploadingFiles,
  handleFileChange,
}) => {
  const renderFileStatus = (fieldName) => {
    const value = watch(fieldName);
    const isUploading = uploadingFiles[fieldName];

    if (isUploading) {
      return (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          {/* <Loader2 className="w-4 h-4 animate-spin" />
          Uploading... */}
          <LoadingComponent />
        </div>
      );
    }

    if (Array.isArray(value) && value.length > 0) {
      return (
        <div className="flex items-center gap-2">
          <File className="w-4 h-4 text-gray-500" />
          <span className="text-sm">{value.length} files uploaded</span>
        </div>
      );
    }

    if (value) {
      return (
        <div className="flex items-center gap-2">
          <File className="w-4 h-4 text-gray-500" />
          <span className="text-sm">{value}</span>
        </div>
      );
    }

    return <span className="text-sm text-gray-500">No file uploaded</span>;
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
        <FileCheck className="w-5 h-5 text-blue-600" />
        Documents
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DocumentField
          name="photograph"
          label="Photograph"
          accept="image/*"
          renderStatus={() => renderFileStatus("photograph")}
          onChange={(e) => handleFileChange("photograph", e)}
        />

        <DocumentField
          name="signature"
          label="Signature"
          accept="image/*"
          renderStatus={() => renderFileStatus("signature")}
          onChange={(e) => handleFileChange("signature", e)}
        />

        <DocumentField
          name="markSheets"
          label="Mark Sheets"
          accept=".pdf,.jpg,.png"
          multiple
          renderStatus={() => renderFileStatus("markSheets")}
          onChange={(e) => handleFileChange("markSheets", e)}
        />

        <DocumentField
          name="transferCertificate"
          label="Transfer Certificate"
          accept=".pdf,.jpg,.png"
          renderStatus={() => renderFileStatus("transferCertificate")}
          onChange={(e) => handleFileChange("transferCertificate", e)}
        />

        <DocumentField
          name="migrationCertificate"
          label="Migration Certificate"
          accept=".pdf,.jpg,.png"
          renderStatus={() => renderFileStatus("migrationCertificate")}
          onChange={(e) => handleFileChange("migrationCertificate", e)}
        />

        <DocumentField
          name="undertakingDocument"
          label="Undertaking Document"
          accept=".pdf,.jpg,.png"
          renderStatus={() => renderFileStatus("undertakingDocument")}
          onChange={(e) => handleFileChange("undertakingDocument", e)}
        />
      </div>
    </div>
  );
};

const AdmissionForm = ({ admission, onClose, onUpdate }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState({});

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
    trigger,
  } = useForm({
    defaultValues: admission || {},
  });

  const validateStep = async (step) => {
    let fields = [];
    switch (step) {
      case 1:
        fields = [
          "fullName",
          "dateOfBirth",
          "gender",
          "nationality",
          "mobileNumber",
          "email",
        ];
        break;
      case 2:
        fields = []; // Parent details are optional
        break;
      case 3:
        fields = ["addressLine", "city", "state", "pincode", "country"];
        break;
      case 4:
        fields = ["programType", "courseName", "yearOfAdmission"];
        break;
      case 5:
        fields = []; // Documents are optional
        break;
      default:
        fields = [];
    }

    const result = await trigger(fields);
    return result;
  };

  const steps = [
    { id: 1, name: "Personal", icon: <User size={16} /> },
    { id: 2, name: "Parent", icon: <Users size={16} /> },
    { id: 3, name: "Address", icon: <Home size={16} /> },
    { id: 4, name: "Academic", icon: <School size={16} /> },
    { id: 5, name: "Documents", icon: <FileCheck size={16} /> },
  ];

  const handleFileUpload = async (fieldName, file) => {
    setUploadingFiles((prev) => ({ ...prev, [fieldName]: true }));

    // Simulate file upload
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // In a real app, you would upload to cloud storage here
    const fileName = `uploaded_${fieldName}_${Date.now()}.${file.name
      .split(".")
      .pop()}`;

    setValue(fieldName, fileName);
    setUploadingFiles((prev) => ({ ...prev, [fieldName]: false }));
    return fileName;
  };

  const handleFileChange = async (fieldName, e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (fieldName === "markSheets") {
      const fileNames = [];
      for (let i = 0; i < files.length; i++) {
        const fileName = await handleFileUpload(fieldName, files[i]);
        fileNames.push(fileName);
      }
      setValue(fieldName, fileNames);
    } else {
      await handleFileUpload(fieldName, files[0]);
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const isUpdate = !!admission?._id;
      const url = isUpdate
        ? `/api/admission/${admission._id}`
        : "/api/admission";
      const method = isUpdate ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(
          isUpdate ? "Failed to update admission" : "Failed to create admission"
        );
      }

      const result = await response.json();

      onUpdate(isUpdate ? { ...admission, ...data } : result.data);
      toast.success(
        isUpdate
          ? "Admission updated successfully"
          : "Admission created successfully"
      );
      onClose();
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = async () => {
    const isValid = await validateStep(currentStep);
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <PersonalDetailsStep control={control} errors={errors} />;
      case 2:
        return <ParentDetailsStep control={control} errors={errors} />;
      case 3:
        return <AddressDetailsStep control={control} errors={errors} />;
      case 4:
        return <AcademicDetailsStep control={control} errors={errors} />;
      case 5:
        return (
          <DocumentUploadStep
            control={control}
            errors={errors}
            watch={watch}
            uploadingFiles={uploadingFiles}
            handleFileChange={handleFileChange}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl relative border border-gray-100 max-h-[96vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {admission ? "Edit Admission" : "New Admission"}
              </h2>
              <p className="text-sm text-gray-600">
                {currentStep === 5
                  ? "Upload required documents"
                  : "Complete all steps to submit"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-white rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            {steps.map((step) => (
              <div key={step.id} className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentStep >= step.id
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {step.id < currentStep ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  ) : (
                    step.icon
                  )}
                </div>
                <span className="text-xs mt-1 text-gray-500">{step.name}</span>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-6 overflow-y-auto max-h-[calc(80vh-180px)]">
            {renderStep()}
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-between p-6 border-t border-gray-100">
            <div>
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </button>
              )}
            </div>
            <div className="flex items-center gap-3">
              {currentStep < steps.length ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      {/* <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving... */}
                      <LoadingComponent />
                    </>
                  ) : (
                    "Submit Application"
                  )}
                </button>
              )}
            </div>
          </div>
        </form>
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
  const { user } = useSession();

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
              <div className="p-3 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg">
                <Clock className="w-6 h-6 text-white" />
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
              <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-lg">
                <CheckCircle className="w-6 h-6 text-white" />
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
              <thead className="bg-gray-50">
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