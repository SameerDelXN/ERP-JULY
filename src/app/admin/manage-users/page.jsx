"use client";
import React, { useEffect, useState } from "react";
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Edit,
  Trash2,
  Phone,
  Download,
  Upload,
  Save,
  ChevronDown,
  ChevronUp,
  X,
} from "lucide-react";
import { roles } from "@/data/data";
import LoadingComponent from "@/components/Loading";

const UserManagementPage = () => {
  const [activeTab, setActiveTab] = useState("users");
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedRoles, setExpandedRoles] = useState({});

  const toggleRoleExpansion = (role) => {
    setExpandedRoles((prev) => ({
      ...prev,
      [role]: !prev[role],
    }));
  };

  // Group users by role
  const groupUsersByRole = (usersToGroup) => {
    const grouped = {};

    // Initialize groups for all roles
    roles.forEach((role) => {
      grouped[role.name.toLowerCase()] = [];
    });
    grouped["other"] = []; // For any unclassified roles

    // Sort users into groups
    usersToGroup.forEach((user) => {
      const roleKey = user.role.toLowerCase();
      if (grouped[roleKey]) {
        grouped[roleKey].push(user);
      } else {
        grouped["other"].push(user);
      }
    });

    return grouped;
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const fetchAllUsers = async () => {
    try {
      setLoading(true);

      // Fetch regular users
      const usersRes = await fetch("/api/userData");
      if (!usersRes.ok) throw new Error("Failed to fetch users");
      const usersData = await usersRes.json();
      const regularUsers = Array.isArray(usersData)
        ? usersData
        : usersData.users || [];

      // Fetch teachers
      const teachersRes = await fetch("/api/teachers");
      if (!teachersRes.ok) throw new Error("Failed to fetch teachers");
      const teachersData = await teachersRes.json();
      const teachers = Array.isArray(teachersData)
        ? teachersData
        : teachersData.teachers || [];

      // Combine and normalize data
      const combinedUsers = [...regularUsers, ...teachers];

      setUsers(combinedUsers);
    } catch (err) {
      setError(err.message);
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  };
  console.log(users);
  const handleEditUser = (user) => {
    setCurrentUser({
      ...user,
      role: user.role.toLowerCase(),
    });
    setShowEditUserModal(true);
  };

  const handleDeleteUser = async (userId, userRole) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      setLoading(true);

      const endpoint =
        userRole === "teacher" || userRole === "hod"
          ? `/api/teachers/${userId}`
          : `/api/userData/${userId}`;

      const res = await fetch(endpoint, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete user");
      }

      await fetchAllUsers();
      alert("User deleted successfully");
    } catch (err) {
      alert(err.message);
      console.error("Delete error:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter((user) => {
    const name = user?.fullName || "";
    const email = user?.email || "";
    const role = user?.role.toLowerCase() || "";

    const matchesSearch =
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole =
      filterRole === "all" || role === filterRole.toLowerCase();

    return matchesSearch && matchesRole;
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    const aValue = a[sortBy] || "";
    const bValue = b[sortBy] || "";

    if (sortOrder === "asc") {
      return aValue.localeCompare(bValue);
    } else {
      return bValue.localeCompare(aValue);
    }
  });

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const roleGroups = groupUsersByRole(sortedUsers);

  if (loading) {
    return <LoadingComponent />;
  }
  if (error)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="p-6 text-red-600">Error: {error}</div>
      </div>
    );

  const AddUserModal = () => {
    const [formData, setFormData] = useState({
      fullName: "",
      email: "",
      phone: "",
      role: "",
      password: "",
      confirmPassword: "",
      department: "",
      teacherId: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
      const { name, value } = e.target;

      // Clear any existing error for this field
      setErrors((prev) => ({ ...prev, [name]: "" }));

      // Special validation for fullName (only letters and spaces)
      if (name === "fullName" && value && !/^[a-zA-Z\s]*$/.test(value)) {
        setErrors((prev) => ({
          ...prev,
          [name]: "Only alphabetic characters are allowed",
        }));
        return;
      }
      // Special validation for Department (only letters and spaces)
      if (name === "department" && value && !/^[a-zA-Z\s]*$/.test(value)) {
        setErrors((prev) => ({
          ...prev,
          [name]: "Only alphabetic characters are allowed",
        }));
        return;
      }

      // Special handling for phone (only numbers, max 10 digits)
      if (name === "phone") {
        const numericValue = value.replace(/\D/g, "").slice(0, 10);
        setFormData((prev) => ({
          ...prev,
          [name]: numericValue,
        }));
        return;
      }

      // Handle all other fields
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    };

    const validateForm = () => {
      const newErrors = {};

      // Full name validation
      if (!formData.fullName.trim()) {
        newErrors.fullName = "Full name is required";
      } else if (!/^[a-zA-Z\s]+$/.test(formData.fullName)) {
        newErrors.fullName = "Name should contain only letters";
      }

      // Email validation
      if (!formData.email.trim()) {
        newErrors.email = "Email is required";
      } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
        newErrors.email = "Email is invalid";
      }

      // Phone validation
      if (!formData.phone.trim()) {
        newErrors.phone = "Phone is required";
      } else if (!/^\d{10}$/.test(formData.phone)) {
        newErrors.phone = "Phone must be 10 digits";
      }

      // Role validation
      if (!formData.role) {
        newErrors.role = "Role is required";
      }

      // Password validation
      if (!formData.password) {
        newErrors.password = "Password is required";
      } else if (formData.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters";
      }

      // Teacher/HOD-specific validation
      if (
        formData.role.toLowerCase() === "teacher" ||
        formData.role.toLowerCase() === "hod"
      ) {
        if (!formData.teacherId.trim()) {
          newErrors.teacherId = "Teacher ID is required";
        }
        if (
          formData.role.toLowerCase() === "teacher" &&
          !formData.department.trim()
        ) {
          newErrors.department = "Department is required";
        }
      }

      // Confirm password validation
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!validateForm()) return;

      setIsSubmitting(true);

      try {
        const requestData = {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          role: formData.role.toLowerCase(),
        };

        // Add teacher/HOD-specific fields
        if (
          formData.role.toLowerCase() === "teacher" ||
          formData.role.toLowerCase() === "hod"
        ) {
          requestData.teacherId = formData.teacherId;
          if (formData.role.toLowerCase() === "teacher") {
            requestData.department = formData.department;
          }
        }
        console.log(requestData);

        const res = await fetch("/api/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Registration failed");
        }

        alert("User registered successfully!");
        setShowAddUserModal(false);
        fetchAllUsers();
      } catch (err) {
        alert(err.message);
        console.error("Registration error:", err);
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium text-gray-900">Add New User</h2>
            <button
              onClick={() => setShowAddUserModal(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  maxLength={25}
                  className={`w-full px-3 py-2 border ${
                    errors.fullName ? "border-red-500" : "border-gray-200"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm`}
                  placeholder="Enter full name"
                />
                {errors.fullName && (
                  <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role *
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${
                    errors.role ? "border-red-500" : "border-gray-200"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm`}
                >
                  <option value="">Select Role</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.name.toLowerCase()}>
                      {role.name}
                    </option>
                  ))}
                </select>
                {errors.role && (
                  <p className="mt-1 text-sm text-red-600">{errors.role}</p>
                )}
              </div>
            </div>

            {(formData.role.toLowerCase() === "teacher" ||
              formData.role.toLowerCase() === "hod") && (
              <div className="grid grid-cols-2 gap-4 mb-4">
                {formData.role.toLowerCase() === "teacher" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Department *
                    </label>
                    <input
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      maxLength={20}
                      className={`w-full px-3 py-2 border ${
                        errors.department ? "border-red-500" : "border-gray-200"
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm`}
                      placeholder="Enter department"
                    />
                    {errors.department && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.department}
                      </p>
                    )}
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teacher ID *
                  </label>
                  <input
                    type="text"
                    name="teacherId"
                    value={formData.teacherId}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${
                      errors.teacherId ? "border-red-500" : "border-gray-200"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm`}
                    placeholder="Enter teacher ID like T-123"
                  />
                  {errors.teacherId && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.teacherId}
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${
                    errors.email ? "border-red-500" : "border-gray-200"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm`}
                  placeholder="Enter email address"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${
                    errors.phone ? "border-red-500" : "border-gray-200"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm`}
                  placeholder="Enter phone number"
                  maxLength={10}
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password *
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${
                    errors.password ? "border-red-500" : "border-gray-200"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm`}
                  placeholder="Enter password"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password *
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${
                    errors.confirmPassword
                      ? "border-red-500"
                      : "border-gray-200"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm`}
                  placeholder="Confirm password"
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowAddUserModal(false)}
                className="px-4 py-2 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm font-medium ${
                  isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? (
                  <span>Processing...</span>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Add User</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };
  const EditUserModal = () => {
    const [formData, setFormData] = useState({
      fullName: currentUser?.fullName || "",
      email: currentUser?.email || "",
      phone: currentUser?.phone || "",
      role: currentUser?.role || "",
      department: currentUser?.department || "",
      teacherId: currentUser?.teacherId || "",
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
      const { name, value } = e.target;

      // Clear any existing error for this field
      setErrors((prev) => ({ ...prev, [name]: "" }));

      // Special validation for fullName (only letters and spaces)
      if (name === "fullName" && value && !/^[a-zA-Z\s]*$/.test(value)) {
        setErrors((prev) => ({
          ...prev,
          [name]: "Only alphabetic characters are allowed",
        }));
        return;
      }

      // Special validation for department (only letters and spaces)
      if (name === "department" && value && !/^[a-zA-Z\s]*$/.test(value)) {
        setErrors((prev) => ({
          ...prev,
          [name]: "Only alphabetic characters are allowed",
        }));
        return;
      }

      // Special handling for phone (only numbers, max 10 digits)
      if (name === "phone") {
        const numericValue = value.replace(/\D/g, "").slice(0, 10);
        setFormData((prev) => ({
          ...prev,
          [name]: numericValue,
        }));
        return;
      }

      // Handle all other fields
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    };

    const validateForm = () => {
      const newErrors = {};

      // Full name validation
      if (!formData.fullName.trim()) {
        newErrors.fullName = "Full name is required";
      } else if (!/^[a-zA-Z\s]+$/.test(formData.fullName)) {
        newErrors.fullName = "Name should contain only letters";
      }

      // Email validation
      if (!formData.email.trim()) {
        newErrors.email = "Email is required";
      } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
        newErrors.email = "Email is invalid";
      }

      // Phone validation
      if (!formData.phone.trim()) {
        newErrors.phone = "Phone is required";
      } else if (!/^\d{10}$/.test(formData.phone)) {
        newErrors.phone = "Phone must be 10 digits";
      }

      // Role validation
      if (!formData.role) {
        newErrors.role = "Role is required";
      }

      // Teacher/HOD-specific validation
      if (
        formData.role.toLowerCase() === "teacher" ||
        formData.role.toLowerCase() === "hod"
      ) {
        if (!formData.teacherId.trim()) {
          newErrors.teacherId = "Teacher ID is required";
        }
        if (
          formData.role.toLowerCase() === "teacher" &&
          !formData.department.trim()
        ) {
          newErrors.department = "Department is required";
        }
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!validateForm()) return;

      setIsSubmitting(true);

      try {
        const requestData = {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          role: formData.role.toLowerCase(),
        };

        // Add teacher-specific fields if role is teacher
        if (formData.role.toLowerCase() === "teacher") {
          requestData.department = formData.department;
          requestData.teacherId = formData.teacherId;
        }
        // Add hod-specific fields if role is hod
        if (formData.role.toLowerCase() === "hod") {
          requestData.department = formData.department;
          requestData.teacherId = formData.teacherId;
        }

        // Determine the endpoint based on current user role
        const endpoint =
          currentUser.role === "teacher" || currentUser.role === "hod"
            ? `/api/teachers/${currentUser._id}`
            : `/api/userData/${currentUser._id}`;

        const res = await fetch(endpoint, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to update user");
        }

        // Refresh user list
        await fetchAllUsers();
        alert("User updated successfully!");
        setShowEditUserModal(false);
      } catch (err) {
        alert(err.message);
        console.error("Update error:", err);
      } finally {
        setIsSubmitting(false);
      }
    };
    console.log(formData);
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium text-gray-900">Edit User</h2>
            <button
              onClick={() => setShowEditUserModal(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${
                    errors.fullName ? "border-red-500" : "border-gray-200"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm`}
                  placeholder="Enter full name"
                />
                {errors.fullName && (
                  <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role *
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  disabled
                  className={`w-full px-3 py-2 border ${
                    errors.role ? "border-red-500" : "border-gray-200"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm`}
                >
                  <option value="">Select Role</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.name.toLowerCase()}>
                      {role.name}
                    </option>
                  ))}
                </select>
                {errors.role && (
                  <p className="mt-1 text-sm text-red-600">{errors.role}</p>
                )}
              </div>
            </div>

            {(formData.role.toLowerCase() === "teacher" ||
              formData.role.toLowerCase() === "hod") && (
              <div className="grid grid-cols-2 gap-4 mb-4">
                {formData.role.toLowerCase() === "teacher" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Department *
                    </label>
                    <input
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      maxLength={20}
                      className={`w-full px-3 py-2 border ${
                        errors.department ? "border-red-500" : "border-gray-200"
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm`}
                      placeholder="Enter department"
                    />
                    {errors.department && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.department}
                      </p>
                    )}
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teacher ID *
                  </label>
                  <input
                    type="text"
                    name="teacherId"
                    value={formData.teacherId}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${
                      errors.teacherId ? "border-red-500" : "border-gray-200"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm`}
                    placeholder="Enter teacher ID"
                  />
                  {errors.teacherId && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.teacherId}
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${
                    errors.email ? "border-red-500" : "border-gray-200"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm`}
                  placeholder="Enter email address"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  maxLength={10}
                  minLength={10}
                  className={`w-full px-3 py-2 border ${
                    errors.phone ? "border-red-500" : "border-gray-200"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm`}
                  placeholder="Enter phone number"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowEditUserModal(false)}
                className="px-4 py-2 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm font-medium ${
                  isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? (
                  <span>Updating...</span>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Update User</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6 overflow-hidden">
          <div className="flex border-b border-gray-100">
            <button
              onClick={() => setActiveTab("users")}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all duration-200 ${
                activeTab === "users"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Users</span>
              <span className="ml-1 bg-gray-100 text-gray-600 rounded-full px-2 py-0.5 text-xs">
                {users.length}
              </span>
            </button>
          </div>

          <div className="p-6">
            {activeTab === "users" && (
              <div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full">
                    <div className="relative flex-1 max-w-md">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full text-sm transition-all duration-200"
                      />
                    </div>

                    <div className="relative">
                      <select
                        value={filterRole}
                        onChange={(e) => setFilterRole(e.target.value)}
                        className="appearance-none pl-3 pr-8 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm w-full sm:w-48 transition-all duration-200"
                      >
                        <option value="all">All Roles</option>
                        {roles.map((role) => (
                          <option key={role.id} value={role.name.toLowerCase()}>
                            {role.name}
                          </option>
                        ))}
                      </select>
                      <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                    </div>
                  </div>

                  <button
                    onClick={() => setShowAddUserModal(true)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md w-full sm:w-auto justify-center"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Add User</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {Object.entries(roleGroups).map(([role, usersInRole]) => {
                    if (usersInRole.length === 0) return null;

                    const isExpanded = expandedRoles[role] !== false;
                    const roleInfo = roles.find(
                      (r) => r.name.toLowerCase() === role
                    ) || {
                      name: role.charAt(0).toUpperCase() + role.slice(1),
                      color: "gray",
                    };

                    return (
                      <div
                        key={role}
                        className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
                      >
                        <div
                          className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                          onClick={() => toggleRoleExpansion(role)}
                        >
                          <div className="flex items-center">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold mr-3 ${
                                role === "admin"
                                  ? "bg-red-100 text-red-800"
                                  : role === "teacher"
                                  ? "bg-green-100 text-green-800"
                                  : role === "staff"
                                  ? "bg-blue-100 text-blue-800"
                                  : role === "hod"
                                  ? "bg-purple-100 text-purple-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {roleInfo.name}
                            </span>
                            <span className="text-sm text-gray-500">
                              {usersInRole.length}{" "}
                              {usersInRole.length === 1 ? "user" : "users"}
                            </span>
                          </div>
                          <div className="text-gray-400">
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </div>
                        </div>

                        {isExpanded && (
                          <div className="border-t border-gray-100">
                            <div className="overflow-x-auto">
                              <table className="w-full divide-y divide-gray-100">
                                <thead className="bg-gray-50">
                                  <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      User
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Contact
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Actions
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100">
                                  {usersInRole.map((user) => (
                                    <tr
                                      key={user._id}
                                      className="hover:bg-gray-50 transition-colors"
                                    >
                                      <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                          <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                                            {user.fullName?.charAt(0) || "U"}
                                          </div>
                                          <div className="ml-4">
                                            <div className="text-sm font-semibold text-gray-900">
                                              {user.fullName}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                              {user.email}
                                            </div>
                                          </div>
                                        </div>
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2 text-sm text-gray-900">
                                          <Phone className="w-4 h-4 text-gray-400" />
                                          {user.phone || "N/A"}
                                        </div>
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-end gap-3">
                                          <button
                                            onClick={() => handleEditUser(user)}
                                            className="text-gray-400 hover:text-blue-600 transition-colors p-1 rounded-full hover:bg-blue-50"
                                            title="Edit"
                                          >
                                            <Edit className="w-4 h-4" />
                                          </button>
                                          <button
                                            onClick={() =>
                                              handleDeleteUser(
                                                user._id,
                                                user.role
                                              )
                                            }
                                            className="text-gray-400 hover:text-red-600 transition-colors p-1 rounded-full hover:bg-red-50"
                                            title="Delete"
                                          >
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
                        )}
                      </div>
                    );
                  })}
                </div>

                {sortedUsers.length === 0 && (
                  <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-2 text-gray-400">
                      <Users className="w-8 h-8" />
                      <p className="text-sm font-medium">No users found</p>
                      {searchTerm && (
                        <button
                          onClick={() => setSearchTerm("")}
                          className="text-blue-600 text-xs hover:underline mt-2"
                        >
                          Clear search
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals would go here */}
      {showAddUserModal && <AddUserModal />}
      {showEditUserModal && <EditUserModal />}
    </div>
  );
};

export default UserManagementPage;
