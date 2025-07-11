"use client";
import React, { useEffect, useState } from "react";
import {
  Search,
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
  X,
  ChevronRight,
  ChevronLeft,
  Target,
  Activity,
  MessageSquare,
  File,
  FileText as FileTextIcon,
  Loader2,
  BookOpen,
  Users,
  Home,
  School,
  FileCheck,
  Upload,
  IndianRupee,
  Tent,
  ShieldCheck,
} from "lucide-react";
import { useSession } from "@/context/SessionContext";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-hot-toast";
import LoadingComponent from "@/components/Loading";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const DetailCard = ({ icon, label, value, bgColor, iconColor }) => (
  <div className="flex items-start gap-3">
    <div className={`p-2 rounded-lg ${bgColor} ${iconColor}`}>{icon}</div>
    <div>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="font-medium text-gray-900">{value || "N/A"}</p>
    </div>
  </div>
);
const DetailCardDocuments = ({
  icon,
  label,
  value,
  bgColor,
  iconColor,
  fileUrl,
  viewIcon,
}) => (
  <div className="flex items-start gap-3">
    <div className={`p-2 rounded-lg ${bgColor} ${iconColor}`}>{icon}</div>
    <div>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <div className="flex items-center gap-2">
        {viewIcon}
        <p className="font-medium text-gray-900">
          <a href={fileUrl} target="_blank" rel="noopener noreferrer">
            {value || "N/A"}
          </a>
        </p>
      </div>
    </div>
  </div>
);

const AdmissionDetailsModal = ({ admissionId, admission, onClose }) => {
  const [application, setApplication] = useState(null);

  useEffect(() => {
    if (admissionId && admission) {
      const foundEnquiry = admission.find((e) => e?._id === admissionId);
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
      case "inProcess":
        return <Clock className="w-4 h-4" />;
      case "approved":
        return <CheckCircle className="w-4 h-4" />;
      case "rejected":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "inProcess":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "approved":
        return "bg-green-50 text-green-700 border-green-200";
      case "rejected":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  console.log(application);

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
              application?.status
            )}`}
          >
            {getStatusIcon(application?.status)}
            <div>
              <p className="font-semibold">
                Status: {application?.status || "Unknown"}
              </p>
              <p className="text-sm opacity-80">
                Last updated:{" "}
                {application.updatedAt
                  ? new Date(application.updatedAt).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
          </div>

          {/* Main Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 px-5">
            <DetailCard
              icon={<User className="w-5 h-5" />}
              label="Full Name"
              value={application?.fullName}
              bgColor="bg-blue-50"
              iconColor="text-blue-600"
            />

            <DetailCard
              icon={<Mail className="w-5 h-5" />}
              label="Email Address"
              value={application.email}
              bgColor="bg-green-50"
              iconColor="text-green-600"
            />

            <DetailCard
              icon={<Phone className="w-5 h-5" />}
              label="Student WhatsApp"
              value={application.studentWhatsappNumber}
              bgColor="bg-purple-50"
              iconColor="text-purple-600"
            />

            <DetailCard
              icon={<GraduationCap className="w-5 h-5" />}
              label="Branch"
              value={application.branch}
              bgColor="bg-orange-50"
              iconColor="text-orange-600"
            />

            <DetailCard
              icon={<Calendar className="w-5 h-5" />}
              label="Date of Birth"
              value={application.dateOfBirth}
              bgColor="bg-teal-50"
              iconColor="text-teal-600"
            />

            <DetailCard
              icon={<MessageSquare className="w-5 h-5" />}
              label="Gender"
              value={application.gender}
              bgColor="bg-pink-50"
              iconColor="text-pink-600"
            />

            <DetailCard
              icon={<MessageSquare className="w-5 h-5" />}
              label="Mother Name"
              value={application.motherName}
              bgColor="bg-pink-50"
              iconColor="text-pink-600"
            />

            <DetailCard
              icon={<Phone className="w-5 h-5" />}
              label="Parent WhatsApp"
              value={application.fatherGuardianWhatsappNumber}
              bgColor="bg-purple-50"
              iconColor="text-purple-600"
            />

            <DetailCard
              icon={<GraduationCap className="w-5 h-5" />}
              label="Program Type"
              value={application.programType}
              bgColor="bg-orange-50"
              iconColor="text-orange-600"
            />

            <DetailCard
              icon={<GraduationCap className="w-5 h-5" />}
              label="Year"
              value={application.year}
              bgColor="bg-orange-50"
              iconColor="text-orange-600"
            />

            <DetailCard
              icon={<GraduationCap className="w-5 h-5" />}
              label="Admission Round"
              value={application.round}
              bgColor="bg-orange-50"
              iconColor="text-orange-600"
            />

            <DetailCard
              icon={<GraduationCap className="w-5 h-5" />}
              label="Seat Type"
              value={application.seatType}
              bgColor="bg-orange-50"
              iconColor="text-orange-600"
            />

            <DetailCard
              icon={<GraduationCap className="w-5 h-5" />}
              label="Admission Category"
              value={application.admissionCategoryDTE}
              bgColor="bg-orange-50"
              iconColor="text-orange-600"
            />

            <DetailCard
              icon={<MessageSquare className="w-5 h-5" />}
              label="Caste (as per LC)"
              value={application.casteAsPerLC}
              bgColor="bg-pink-50"
              iconColor="text-pink-600"
            />

            <DetailCard
              icon={<MessageSquare className="w-5 h-5" />}
              label="Domicile"
              value={application.domicile}
              bgColor="bg-pink-50"
              iconColor="text-pink-600"
            />

            <DetailCard
              icon={<Tent className="w-5 h-5" />}
              label="Nationality"
              value={application.nationality}
              bgColor="bg-pink-50"
              iconColor="text-pink-600"
            />

            <DetailCard
              icon={<IndianRupee className="w-5 h-5" />}
              label="Family Income"
              value={
                application.familyIncome
                  ? `₹${application.familyIncome}`
                  : "N/A"
              }
              bgColor="bg-pink-50"
              iconColor="text-pink-600"
            />

            <DetailCard
              icon={<GraduationCap className="w-5 h-5" />}
              label="Admission Year"
              value={application.admissionYear}
              bgColor="bg-pink-50"
              iconColor="text-pink-600"
            />

            <DetailCard
              icon={<ShieldCheck className="w-5 h-5" />}
              label="PRN"
              value={application.prn || "Not Generated"}
              bgColor="bg-pink-50"
              iconColor="text-pink-600"
            />
          </div>

          {/* Address Section */}
          {application.address && application.address.length > 0 && (
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-indigo-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Address</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {application.address.map((addr, index) => (
                  <React.Fragment key={index}>
                    <DetailCard
                      icon={<MapPin className="w-5 h-5" />}
                      label="Address Line"
                      value={addr.addressLine}
                      bgColor="bg-purple-50"
                      iconColor="text-purple-600"
                    />
                    <DetailCard
                      icon={<MapPin className="w-5 h-5" />}
                      label="City"
                      value={addr.city}
                      bgColor="bg-purple-50"
                      iconColor="text-purple-600"
                    />
                    <DetailCard
                      icon={<MapPin className="w-5 h-5" />}
                      label="State"
                      value={addr.state}
                      bgColor="bg-purple-50"
                      iconColor="text-purple-600"
                    />
                    <DetailCard
                      icon={<MapPin className="w-5 h-5" />}
                      label="Pincode"
                      value={addr.pincode}
                      bgColor="bg-purple-50"
                      iconColor="text-purple-600"
                    />
                    <DetailCard
                      icon={<MapPin className="w-5 h-5" />}
                      label="Country"
                      value={addr.country}
                      bgColor="bg-purple-50"
                      iconColor="text-purple-600"
                    />
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}

          {/* Documents Section */}
          <div className="bg-gray-50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                <File className="w-4 h-4 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Documents</h3>
            </div>

            {application.documents && application.documents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {application.documents.map((doc, index) => (
                  <DetailCardDocuments
                    key={index}
                    icon={<FileTextIcon className="w-5 h-5" />}
                    label={doc.type || `Document ${index + 1}`}
                    value={doc.fileName}
                    fileUrl={doc.fileUrl}
                    bgColor="bg-purple-50"
                    viewIcon={<Eye className="w-4 h-4" />}
                    iconColor="text-purple-600"
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No documents uploaded</p>
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
  pattern = null,
  minLength,
  maxLength,
  min = null,
  max = null,
  validate = null,
   alphaOnly = false,
  numericOnly = false,
  maxDate = null,
  ...props
}) => {
  const handleTextInput = (e) => {
    // Only allow alphabets and spaces for text fields
    if (type === "text" && alphaOnly) {
      e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, "");
    }
    // Only allow numbers for numeric fields
    if (type === "number" || (type === "tel" && numericOnly)) {
      e.target.value = e.target.value.replace(/\D/g, "");
    }
  };
  // Filter out custom props that shouldn't be passed to DOM elements
  const inputProps = {
    ...props,
    ...(type === "date" && maxDate ? { max: maxDate } : {}),
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <Controller
        name={name}
        control={control}
        rules={{
          required: required ? `${label} is required` : false,
          pattern,
          minLength,
          maxLength,
          min,
          max,
          validate,
        }}
        render={({ field }) => {
          if (type === "select") {
            return (
              <select
                {...field}
                className={`w-full px-3 py-2 border ${
                  error ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                {...inputProps}
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
                  value={field.value || ""}
                  className={`w-full px-3 py-2 border ${
                    error ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder={placeholder}
                  max={props.maxDate || undefined}
                  {...inputProps}
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
                value={field.value || ""}
                minLength={minLength}
                maxLength={maxLength}
                onChange={(e) => {
                  handleTextInput(e);
                  field.onChange(e);
                }}
                className={`w-full px-3 py-2 border ${
                  error ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                placeholder={placeholder}
                pattern={pattern}
                {...inputProps}
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
};

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

const AddressFields = ({ control, errors, index }) => (
  <div className="space-y-4 border border-gray-200 p-4 rounded-lg">
    <h4 className="font-medium text-gray-700">
      Address {index > 0 ? index + 1 : ""}
    </h4>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={control}
        name={`address[${index}].addressLine`}
        label="Address Line"
        type="text"
        error={errors.address?.[index]?.addressLine}
        maxLength={200}
      />
      <FormField
        control={control}
        name={`address[${index}].city`}
        label="City"
        type="text"
        alphaOnly={true}
        error={errors.address?.[index]?.city}
        maxLength={50}
        pattern={{
          value: /^[a-zA-Z\s]*$/,
          message: "Only alphabets are allowed",
        }}
      />
      <FormField
        control={control}
        name={`address[${index}].state`}
        label="State"
        type="text"
        alphaOnly={true}
        error={errors.address?.[index]?.state}
        maxLength={50}
        pattern={{
          value: /^[a-zA-Z\s]*$/,
          message: "Only alphabets are allowed",
        }}
      />
      <FormField
        control={control}
        name={`address[${index}].pincode`}
        label="Pincode"
        type="number"
        error={errors.address?.[index]?.pincode}
        required
        numericOnly={true}
        minLength={6}
        maxLength={6}
        pattern={{
          value: /^[0-9]{6}$/,
          message: "Must be a valid 6-digit pincode",
        }}
      />
      <FormField
        control={control}
        name={`address[${index}].country`}
        label="Country"
        type="text"
        alphaOnly={true}
        error={errors.address?.[index]?.country}
        maxLength={50}
        pattern={{
          value: /^[a-zA-Z\s]*$/,
          message: "Only alphabets are allowed",
        }}
      />
    </div>
  </div>
);

const PersonalDetailsStep = ({ control, errors }) => {
  const validateEmail = (value) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(value) || "Invalid email address";
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
        <User className="w-5 h-5 text-blue-600" />
        Personal Details
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="firstName"
          label="First Name"
          type="text"
          placeholder="Enter First Name"
          error={errors?.firstName}
          required
          alphaOnly={true}
          minLength={2}
          maxLength={20}
          pattern={{
            value: /^[a-zA-Z\s]*$/,
            message: "Only alphabets are allowed",
          }}
        />
        <FormField
          control={control}
          name="middleName"
          label="Middle Name"
          type="text"
          placeholder="Enter Middle Name"
          error={errors?.middleName}
          required
          alphaOnly={true}
          minLength={3}
          maxLength={20}
          pattern={{
            value: /^[a-zA-Z\s]*$/,
            message: "Only alphabets are allowed",
          }}
        />
        <FormField
          control={control}
          name="lastName"
          label="Last Name"
          type="text"
          placeholder="Enter Last Name"
          error={errors?.lastName}
          required
          alphaOnly={true}
          minLength={3}
          maxLength={20}
          pattern={{
            value: /^[a-zA-Z\s]*$/,
            message: "Only alphabets are allowed",
          }}
        />
        <FormField
          control={control}
          name="fullName"
          label="Full Name"
          type="text"
          placeholder="As per mark sheet"
          error={errors?.fullName}
          required
          alphaOnly={true}
          minLength={3}
          maxLength={60}
          pattern={{
            value: /^[a-zA-Z\s]*$/,
            message: "Only alphabets are allowed",
          }}
        />
        <FormField
          control={control}
          name="nameAsPerAadhar"
          label="Name as per Aadhar"
          type="text"
          placeholder="As per Aadhar card"
          error={errors?.nameAsPerAadhar}
          required
          alphaOnly={true}
          minLength={3}
          maxLength={60}
          pattern={{
            value: /^[a-zA-Z\s]*$/,
            message: "Only alphabets are allowed",
          }}
        />

        <FormField
          control={control}
          name="dateOfBirth"
          label="Date of Birth"
          type="date"
          error={errors.dateOfBirth}
          required
          maxDate={new Date().toISOString().split("T")[0]}
          validate={(value) => {
            const selectedDate = new Date(value);
            const today = new Date();
            return (
              selectedDate <= today || "Date of birth cannot be in the future"
            );
          }}
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
          name="email"
          label="Email"
          type="email"
          icon={<Mail className="w-4 h-4" />}
          error={errors?.email}
          required
          validate={validateEmail}
        />

        <FormField
          control={control}
          name="studentWhatsappNumber"
          label="Student WhatsApp Number"
          type="tel"
          placeholder="10-digit mobile number"
          icon={<Phone className="w-4 h-4" />}
          error={errors.studentWhatsappNumber}
          required
          numericOnly={true}
          minLength={10}
          maxLength={10}
          pattern={{
            value: /^[0-9]{10}$/,
            message: "Must be a valid 10-digit number",
          }}
        />
      </div>
    </div>
  );
};

const FamilyDetailsStep = ({ control, errors }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
        <Users className="w-5 h-5 text-blue-600" />
        Family Details
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="motherName"
          label="Mother's Name"
          type="text"
          error={errors.motherName}
          alphaOnly={true}
          maxLength={20}
          pattern={{
            value: /^[a-zA-Z\s]*$/,
            message: "Only alphabets are allowed",
          }}
        />

        <FormField
          control={control}
          name="fatherGuardianWhatsappNumber"
          label="Father/Guardian WhatsApp"
          type="tel"
          icon={<Phone className="w-4 h-4" />}
          error={errors.fatherGuardianWhatsappNumber}
          numericOnly={true}
          minLength={10}
          maxLength={10}
          pattern={{
            value: /^[0-9]{10}$/,
            message: "Must be a valid 10-digit number",
          }}
        />

        <FormField
          control={control}
          name="motherMobileNumber"
          label="Mother's Mobile"
          type="tel"
          icon={<Phone className="w-4 h-4" />}
          error={errors.motherMobileNumber}
          numericOnly={true}
          minLength={10}
          maxLength={10}
          pattern={{
            value: /^[0-9]{10}$/,
            message: "Must be a valid 10-digit number",
          }}
        />

        <FormField
          control={control}
          name="familyIncome"
          label="Annual Family Income (₹)"
          type="number"
          numericOnly={true}
          error={errors.familyIncome}
          min={0}
          maxLength={8}
          validate={(value) => {
            if (value === "" || value === null) return true;
            return !isNaN(value) || "Must be a number";
          }}
        />
      </div>
    </div>
  );
};

const AcademicDetailsStep = ({ control, errors }) => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
      <School className="w-5 h-5 text-blue-600" />
      Academic Information
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={control}
        name="admissionYear"
        label="Admission Year"
        type="text"
        placeholder="e.g. 2024-25"
        error={errors.admissionYear}
        required
      />

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
        name="branch"
        label="Branch/Course"
        type="text"
        alphaOnly={true}
        error={errors.branch}
        required
        maxLength={20}
        pattern={{
          value: /^[a-zA-Z\s]*$/,
          message: "Only alphabets are allowed",
        }}
      />

      <FormField
        control={control}
        name="year"
        label="Year"
        type="select"
        options={[
          { value: "", label: "Select Year" },
          { value: "1st Year", label: "1st Year" },
          { value: "2nd Year", label: "2nd Year" },
          { value: "3rd Year", label: "3rd Year" },
          { value: "4th Year", label: "4th Year" },
        ]}
        error={errors.year}
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
        error={errors.round}
        required
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
        error={errors.seatType}
        required
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
        error={errors.admissionCategoryDTE}
        required
      />
    </div>
  </div>
);
const BackgroundDetailsStep = ({ control, errors }) => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
      <User className="w-5 h-5 text-blue-600" />
      Background Information
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={control}
        name="casteAsPerLC"
        label="Caste as per LC"
        type="text"
        error={errors.casteAsPerLC}
        alphaOnly={true}
          minLength={2}
          maxLength={20}
          pattern={{
            value: /^[a-zA-Z\s]*$/,
            message: "Only alphabets are allowed",
          }}
      />

      <FormField
        control={control}
        name="subCasteAsPerLC"
        label="Sub-Caste as per LC"
        type="text"
        error={errors.subCasteAsPerLC}
        alphaOnly={true}
          minLength={2}
          maxLength={20}
          pattern={{
            value: /^[a-zA-Z\s]*$/,
            message: "Only alphabets are allowed",
          }}
      />

      <FormField
        control={control}
        name="domicile"
        label="Domicile"
        type="text"
        error={errors.domicile}
        alphaOnly={true}
          minLength={2}
          maxLength={20}
          pattern={{
            value: /^[a-zA-Z\s]*$/,
            message: "Only alphabets are allowed",
          }}
      />

      <FormField
        control={control}
        name="nationality"
        label="Nationality"
        type="text"
        error={errors.nationality}
        alphaOnly={true}
          minLength={2}
          maxLength={20}
          pattern={{
            value: /^[a-zA-Z\s]*$/,
            message: "Only alphabets are allowed",
          }}
      />

      <FormField
        control={control}
        name="religionAsPerLC"
        label="Religion as per LC"
        type="text"
        error={errors.religionAsPerLC}
        alphaOnly={true}
          minLength={2}
          maxLength={20}
          pattern={{
            value: /^[a-zA-Z\s]*$/,
            message: "Only alphabets are allowed",
          }}
      />

      <FormField
        control={control}
        name="isForeignNational"
        label="Is Foreign National?"
        type="select"
        options={[
          { value: "", label: "Select" },
          { value: "true", label: "Yes" },
          { value: "false", label: "No" },
        ]}
        error={errors.isForeignNational}
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
    const value = watch(`documents.${fieldName}`);
    const isUploading = uploadingFiles[fieldName];

    if (isUploading) {
      return (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Uploading...</span>
        </div>
      );
    }

    if (!value || (Array.isArray(value) && value.length === 0)) {
      return <span className="text-sm text-gray-500">No file uploaded</span>;
    }

    if (Array.isArray(value)) {
      return (
        <div className="flex flex-col gap-1">
          {value.map((doc, index) => (
            <div key={index} className="flex items-center gap-2">
              <File className="w-4 h-4 text-gray-500" />
              <span className="text-sm">
                {doc.type || `Document ${index + 1}`}
              </span>
              <a
                href={doc.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline text-xs"
              >
                View
              </a>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2">
        <File className="w-4 h-4 text-gray-500" />
        <span className="text-sm">{value.type}</span>
        <a
          href={value.fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline text-xs"
        >
          View
        </a>
      </div>
    );
  };
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
        <FileCheck className="w-5 h-5 text-blue-600" />
        Documents
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DocumentField
          name="aadharCard"
          label="Aadhar Card"
          accept=".pdf,.jpg,.png"
          renderStatus={() => renderFileStatus("aadharCard")}
          onChange={(e) => handleFileChange("aadharCard", e)}
        />

        <DocumentField
          name="lcCertificate"
          label="LC Certificate"
          accept=".pdf,.jpg,.png"
          renderStatus={() => renderFileStatus("lcCertificate")}
          onChange={(e) => handleFileChange("lcCertificate", e)}
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
          name="tcCertificate"
          label="TC Certificate"
          accept=".pdf,.jpg,.png"
          renderStatus={() => renderFileStatus("tcCertificate")}
          onChange={(e) => handleFileChange("tcCertificate", e)}
        />

        <DocumentField
          name="incomeCertificate"
          label="Income Certificate"
          accept=".pdf,.jpg,.png"
          renderStatus={() => renderFileStatus("incomeCertificate")}
          onChange={(e) => handleFileChange("incomeCertificate", e)}
        />

        <DocumentField
          name="casteCertificate"
          label="Caste Certificate"
          accept=".pdf,.jpg,.png"
          renderStatus={() => renderFileStatus("casteCertificate")}
          onChange={(e) => handleFileChange("casteCertificate", e)}
        />
      </div>
    </div>
  );
};

const AddressStep = ({ control, errors, watch }) => {
  const addresses = watch("address") || [{}];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
        <MapPin className="w-5 h-5 text-blue-600" />
        Address Information
      </h3>
      {addresses.map((_, index) => (
        <AddressFields
          key={index}
          control={control}
          errors={errors}
          index={index}
        />
      ))}
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
    defaultValues: admission || {
      isForeignNational: "false",
      status: "inProcess",
      address: [{}], // Initialize with one empty address object
      documents: {
        aadharCard: "",
        lcCertificate: "",
        markSheets: [],
        tcCertificate: "",
        incomeCertificate: "",
        casteCertificate: "",
      },
    },
  });

  const steps = [
    { id: 1, name: "Personal", icon: <User size={16} /> },
    { id: 2, name: "Family", icon: <Users size={16} /> },
    { id: 3, name: "Academic", icon: <School size={16} /> },
    { id: 4, name: "Background", icon: <User size={16} /> },
    { id: 5, name: "Address", icon: <MapPin size={16} /> },
    { id: 6, name: "Documents", icon: <FileCheck size={16} /> },
  ];

  const validateStep = async (step) => {
    let fields = [];
    switch (step) {
      case 1:
        fields = [
          "fullName",
          "dateOfBirth",
          "gender",
          "email",
          "studentWhatsappNumber",
        ];
        break;
      case 2:
        fields = []; // Family details are optional
        break;
      case 3:
        fields = [
          "admissionYear",
          "programType",
          "branch",
          "year",
          "round",
          "seatType",
          "admissionCategoryDTE",
        ];
        break;
      case 4:
        fields = []; // Background details are optional
        break;
      case 5:
        fields = []; // Address is optional
        break;
      case 6:
        fields = []; // Documents are optional
        break;
      default:
        fields = [];
    }

    const result = await trigger(fields);
    return result;
  };

  const handleFileChange = async (fieldName, e) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    setUploadingFiles((prev) => ({ ...prev, [fieldName]: true }));

    try {
      const formData = new FormData();

      // Map frontend field names to backend document types
      const documentTypeMap = {
        aadharCard: "Aadhar Card",
        lcCertificate: "LC Certificate",
        markSheets: "Mark Sheets",
        tcCertificate: "TC Certificate",
        incomeCertificate: "Income Certificate",
        casteCertificate: "Caste Certificate",
      };

      // Convert FileList to array immediately
      const files = Array.from(fileList);

      if (fieldName !== "markSheets") {
        // Single file upload (but still handle as array for consistency)
        formData.append("files", files[0]);
        formData.append("fieldName", fieldName);
        formData.append("documentType", documentTypeMap[fieldName]);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) throw new Error("Failed to upload file");

        const result = await response.json();

        // Update the documents array in the form
        setValue(`documents.${fieldName}`, {
          type: documentTypeMap[fieldName],
          fileName: files[0].name,
          fileUrl: result.documentUrl,
          mimeType: files[0].type,
        });
      } else {
        // Multiple files upload (markSheets)
        files.forEach((file) => {
          formData.append("files", file);
        });
        formData.append("fieldName", fieldName);
        formData.append("documentType", "Mark Sheets");

        const response = await fetch("/api/upload/multiple", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) throw new Error("Failed to upload files");

        const result = await response.json();
        console.log(result);
        console.log("files = ", files);
        // Create an array of document objects
        const markSheetDocuments = files.map((file, index) => ({
          type: "Mark Sheet",
          fileName: file.name,
          fileUrl: result?.uploadedFiles[index].documentUrl,
          mimeType: file.type,
        }));
        console.log("mark = ", markSheetDocuments);
        setValue("documents.markSheets", markSheetDocuments);
      }
    } catch (error) {
      console.error("Error uploading files:", error);
      toast.error("Failed to upload files");
    } finally {
      setUploadingFiles((prev) => ({ ...prev, [fieldName]: false }));
    }
  };

  const onSubmit = async (data) => {
    // console.log("Form data before processing:", data);
    setIsSubmitting(true);

    try {
      const isUpdate = !!admission?._id;
      const url = isUpdate
        ? `/api/admission/${admission?._id}`
        : "/api/admission";
      const method = isUpdate ? "PUT" : "POST";

      // Prepare documents array - FIXED VERSION
      const documents = [];

      // Handle aadharCard if it exists
      if (data.documents?.aadharCard) {
        documents.push(data.documents.aadharCard);
      }

      // Handle markSheets if they exist
      if (
        data.documents?.markSheets &&
        Array.isArray(data.documents.markSheets)
      ) {
        documents.push(...data.documents.markSheets);
      }

      // Prepare the payload
      const payload = {
        ...data,
        documents, // Now this will be a proper array
        isForeignNational: data.isForeignNational === "true",
        address: data.address || [{}],
      };

      // Remove the nested documents structure to avoid duplication
      delete payload.documents.aadharCard;
      delete payload.documents.markSheets;

      // console.log("Final payload being sent:", payload);

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            (isUpdate
              ? "Failed to update admission"
              : "Failed to create admission")
        );
      }

      const result = await response.json();
      onUpdate(isUpdate ? { ...admission, ...result.data } : result.data);
      toast.success(
        isUpdate
          ? "Admission updated successfully"
          : "Admission created successfully"
      );
      onClose();
      alert(result.message)
    } catch (error) {
      console.error("Submission error:", error);
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
        return <FamilyDetailsStep control={control} errors={errors} />;
      case 3:
        return <AcademicDetailsStep control={control} errors={errors} />;
      case 4:
        return <BackgroundDetailsStep control={control} errors={errors} />;
      case 5:
        return <AddressStep control={control} errors={errors} watch={watch} />;
      case 6:
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
                {currentStep === 6
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

        <form>
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
                  type="button"
                  onClick={handleSubmit(onSubmit)}
                  disabled={isSubmitting}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
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
  const [showForm, setShowForm] = useState(false);
  const [selectedAdmission, setSelectedAdmission] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [admission, setAdmission] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
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

        // Sort by createdAt date in descending order (newest first)
        const sortedAdmissions = admissionData.data.sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt);
        });

        setAdmission(sortedAdmissions);
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
      app?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app?._id?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      selectedFilter === "all" || app?.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredApplications?.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages =
    Math.ceil(filteredApplications?.length / itemsPerPage) || 1;

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
  const handleExportToExcel = () => {
    if (!admission || admission.length === 0) {
      alert("No data to export");
      return;
    }

    const exportData = admission.map((app) => ({
      FullName: app.fullName || "",
      Email: app.email || "",
      WhatsApp: app.studentWhatsappNumber || "",
      Branch: app.branch || "",
      ProgramType: app.programType || "",
      Year: app.year || "",
      Round: app.round || "",
      SeatType: app.seatType || "",
      AdmissionCategory: app.admissionCategoryDTE || "",
      Gender: app.gender || "",
      MotherName: app.motherName || "",
      ParentWhatsApp: app.fatherGuardianWhatsappNumber || "",
      Caste: app.casteAsPerLC || "",
      Domicile: app.domicile || "",
      Nationality: app.nationality || "",
      FamilyIncome: app.familyIncome || "",
      AdmissionYear: app.admissionYear || "",
      PRN: app.prn || "",
      DateOfBirth: app.dateOfBirth || "",
      Status: app.status || "",
      CreatedAt: app.createdAt ? new Date(app.createdAt).toLocaleString() : "",
      UpdatedAt: app.updatedAt ? new Date(app.updatedAt).toLocaleString() : "",
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Admissions");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(data, "admissions.xlsx");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex gap-4 pb-4 justify-end">
          <button
            onClick={handleExportToExcel}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-br to-blue-600 from-purple-600 text-white rounded-lg transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md w-full sm:w-auto justify-center"
          >
            <Upload className="w-4 h-4" />
            <span>Export</span>
          </button>

          <button
            onClick={() => {
              setSelectedAdmission(null);
              setShowForm(true);
            }}
            className="flex items-center px-4 py-2.5 bg-gradient-to-br to-blue-600 from-purple-600 text-white rounded-lg transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md w-full sm:w-auto justify-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Admission
          </button>
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

          <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 p-6 rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  In Process Review
                </p>
                <p className="text-2xl font-bold text-yellow-600">
                  {admission.filter((a) => a?.status === "inProcess").length}
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
                  {admission.filter((a) => a?.status === "approved").length}
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
                  {admission.filter((a) => a?.status === "rejected").length}
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
                    Branch
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
                {currentItems.map((application) => {
                  const status = application?.status || "inProcess";
                  const config = statusConfig[status] || statusConfig.inProcess;
                  return (
                    <tr key={application?._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                              <User className="w-5 h-5 text-gray-600" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {application?.fullName || "N/A"}
                            </div>
                            <div className="text-sm text-gray-500">
                              {application?.email}
                            </div>
                            <div className="text-xs text-gray-400">
                              ID: {application?._id?.slice(-6) || "N/A"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {application.branch || "N/A"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {application.programType || "N/A"}
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
                            onClick={() => openDetailsModal(application?._id)}
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            className="text-indigo-600 hover:text-indigo-900"
                            onClick={() => {
                              setSelectedAdmission(application);
                              setShowForm(true);
                            }}
                          >
                            <Edit2 className="w-4 h-4" />
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
      {showForm && (
        <AdmissionForm
          admission={selectedAdmission}
          onClose={() => setShowForm(false)}
          onUpdate={(updatedData) => {
            if (updatedData?._id) {
              // Update existing admission
              setAdmission((prev) =>
                prev.map((app) =>
                  app?._id === updatedData?._id ? updatedData : app
                )
              );
            } else {
              // Add new admission
              setAdmission((prev) => [...prev, updatedData]);
            }
          }}
        />
      )}
    </div>
  );
};

export default AdmissionApplications;
