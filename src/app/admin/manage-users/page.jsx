"use client";
import React, { useEffect, useState } from "react";
import {
  Users,
  UserPlus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Shield,
  CheckCircle,
  XCircle,
  Mail,
  Phone,
  Calendar,
  Download,
  Upload,
  Plus,
  Settings,
  Lock,
  Unlock,
  UserCheck,
  AlertCircle,
  X,
  Save,
  ArrowUpDown,
} from "lucide-react";
import { roles } from "@/data/data";
import Image from "next/image";

const UserManagementPage = () => {
  const [activeTab, setActiveTab] = useState("users");
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
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
        const combinedUsers = [
          ...regularUsers,
          ...teachers.map((teacher) => ({
            ...teacher,
            role: "teacher", // Ensure consistent role naming
          })),
        ];

        setUsers(combinedUsers);
      } catch (err) {
        setError(err.message);
        console.error("Failed to fetch users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllUsers();
  }, []);

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
    const [formErrors, setFormErrors] = useState({});

    const validateForm = () => {
      const errors = {};
      if (!formData.fullName.trim()) errors.fullName = "Full name is required";
      if (!formData.email.trim()) errors.email = "Email is required";
      else if (!/^\S+@\S+\.\S+$/.test(formData.email))
        errors.email = "Email is invalid";
      if (!formData.phone.trim()) errors.phone = "Phone is required";
      if (!formData.role) errors.role = "Role is required";
      if (!formData.password) errors.password = "Password is required";
      else if (formData.password.length < 6)
        errors.password = "Password must be at least 6 characters";

      // Teacher-specific validation
      if (formData.role.toLowerCase() === "teacher") {
        if (!formData.department.trim())
          errors.department = "Department is required";
        if (!formData.teacherId.trim())
          errors.teacherId = "Teacher ID is required";
      }

      if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = "Passwords do not match";
      }
      setFormErrors(errors);
      return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
      console.log(formData);

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
          role: formData.role.toLowerCase(), // Ensure consistent case
        };

        // Add teacher-specific fields if role is teacher
        if (formData.role.toLowerCase() === "teacher") {
          requestData.department = formData.department;
          requestData.teacherId = formData.teacherId;
        }

        const res = await fetch("/api/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        });

        const data = await res.json();

        console.log(data);

        if (!res.ok) {
          throw new Error(data.message || "Failed to add user");
        }

        // Refresh user list
        const usersRes = await fetch("/api/userData");
        const teachersRes = await fetch("/api/teachers");

        const usersData = await usersRes.json();
        const teachersData = await teachersRes.json();

        const regularUsers = Array.isArray(usersData)
          ? usersData
          : usersData.users || [];
        const teachers = Array.isArray(teachersData)
          ? teachersData
          : teachersData.teachers || [];

        setUsers([
          ...regularUsers,
          ...teachers.map((teacher) => ({
            ...teacher,
            role: "teacher",
          })),
        ]);

        alert("User added successfully!");
        setShowAddUserModal(false);
        setFormData({
          fullName: "",
          email: "",
          phone: "",
          role: "",
          password: "",
          confirmPassword: "",
          department: "",
          teacherId: "",
        });
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
            <h2 className="text-lg font-medium text-gray-900">
              Add New User
            </h2>
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
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  className={`w-full px-3 py-2 border ${
                    formErrors.fullName ? "border-red-500" : "border-gray-200"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm`}
                  placeholder="Enter full name"
                />
                {formErrors.fullName && (
                  <p className="mt-1 text-sm text-red-600">
                    {formErrors.fullName}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role *
                </label>
                <select
                  value={formData.role.toLowerCase()}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  className={`w-full px-3 py-2 border ${
                    formErrors.role ? "border-red-500" : "border-gray-200"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm`}
                >
                  <option value="">Select Role</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.name.toLowerCase()}>
                      {role.name}
                    </option>
                  ))}
                </select>
                {formErrors.role && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.role}</p>
                )}
              </div>
            </div>

            {formData.role === "teacher" && (
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department *
                  </label>
                  <input
                    type="text"
                    value={formData.department || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, department: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder="Enter department"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teacher ID *
                  </label>
                  <input
                    type="text"
                    value={formData.teacherId || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, teacherId: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder="Enter teacher ID"
                  />
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
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className={`w-full px-3 py-2 border ${
                    formErrors.email ? "border-red-500" : "border-gray-200"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm`}
                  placeholder="Enter email address"
                />
                {formErrors.email && (
                  <p className="mt-1 text-sm text-red-600">
                    {formErrors.email}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className={`w-full px-3 py-2 border ${
                    formErrors.phone ? "border-red-500" : "border-gray-200"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm`}
                  placeholder="Enter phone number"
                />
                {formErrors.phone && (
                  <p className="mt-1 text-sm text-red-600">
                    {formErrors.phone}
                  </p>
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
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className={`w-full px-3 py-2 border ${
                    formErrors.password ? "border-red-500" : "border-gray-200"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm`}
                  placeholder="Enter password"
                />
                {formErrors.password && (
                  <p className="mt-1 text-sm text-red-600">
                    {formErrors.password}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password *
                </label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  className={`w-full px-3 py-2 border ${
                    formErrors.confirmPassword
                      ? "border-red-500"
                      : "border-gray-200"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm`}
                  placeholder="Confirm password"
                />
                {formErrors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">
                    {formErrors.confirmPassword}
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

 if (loading) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
      <div className="flex flex-col items-center space-y-6">
        {/* Main loader container */}
        <div className="relative">
          {/* Outer rotating ring */}
          <div className="w-20 h-20 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600"></div>
          
          {/* Inner pulsing dot */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
          </div>
        </div>
        
        {/* Loading text with animated dots */}
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Loading ERP System</h3>
          <div className="flex items-center justify-center space-x-1">
            <span className="text-gray-500">Initializing</span>
            <div className="flex space-x-1">
              <div className="w-1 h-1 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
              <div className="w-1 h-1 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
              <div className="w-1 h-1 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
            </div>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="w-64 bg-gray-200 rounded-full h-2 overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full animate-pulse"></div>
        </div>
        
        {/* Optional: System status text */}
        <p className="text-sm text-gray-400 max-w-md text-center">
          Please wait while we prepare your workspace...
        </p>
      </div>
    </div>
  );
}
  if (error)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="p-6 text-red-600">Error: {error}</div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">User Management</h2>
            <p className="text-gray-600 text-sm mt-1">
              Manage user accounts and role permissions for your institution
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700">
              <Download className="w-4 h-4" />
              Export
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700">
              <Upload className="w-4 h-4" />
              Import
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg border border-gray-100 mb-6">
          <div className="flex border-b border-gray-100">
            <button
              onClick={() => setActiveTab("users")}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === "users"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Users className="w-4 h-4" />
              Users ({users.length})
            </button>
            <button
              onClick={() => setActiveTab("roles")}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === "roles"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Shield className="w-4 h-4" />
              Roles ({roles.length})
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "users" && (
              <div>
                {/* Users Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <div className="flex flex-col sm:flex-row gap-3 flex-1">
                    {/* Search */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-80 text-sm"
                      />
                    </div>

                    {/* Filters */}
                    <select
                      value={filterRole}
                      onChange={(e) => setFilterRole(e.target.value)}
                      className="px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    >
                      <option value="all">All Roles</option>
                      {roles.map((role) => (
                        <option key={role.id} value={role.name}>
                          {role.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={() => setShowAddUserModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    <UserPlus className="w-4 h-4" />
                    Add User
                  </button>
                </div>

                {/* Users Table */}
                <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                          <th className="px-6 py-3 text-left">
                            <input
                              type="checkbox"
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <button
                              className="flex items-center gap-1 hover:text-gray-700 transition-colors"
                              onClick={() => handleSort("fullName")}
                            >
                              <span>User</span>
                              <ArrowUpDown className="w-3 h-3" />
                            </button>
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Contact
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <button
                              className="flex items-center gap-1 hover:text-gray-700 transition-colors"
                              onClick={() => handleSort("role")}
                            >
                              <span>Role</span>
                              <ArrowUpDown className="w-3 h-3" />
                            </button>
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-100">
                        {sortedUsers.length > 0 ? (
                          sortedUsers.map((user) => (
                            <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                              <td className="px-6 py-4">
                                <input
                                  type="checkbox"
                                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                              </td>
                              <td className="px-6 py-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {user.fullName}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {user.email}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="text-sm text-gray-900">
                                  {user.phone}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <span
                                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    user.role === "admin"
                                      ? "bg-red-50 text-red-700"
                                      : user.role === "teacher"
                                      ? "bg-green-50 text-green-700"
                                      : user.role === "student"
                                      ? "bg-blue-50 text-blue-700"
                                      : user.role === "parent"
                                      ? "bg-purple-50 text-purple-700"
                                      : "bg-gray-50 text-gray-700"
                                  }`}
                                >
                                  {user.role}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                  <button className="text-gray-400 hover:text-blue-600 transition-colors">
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button className="text-gray-400 hover:text-red-600 transition-colors">
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan="5"
                              className="px-6 py-8 text-center text-gray-500 text-sm"
                            >
                              No users found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "roles" && (
              <div>
                {/* Roles Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {users.map((role) => (
                    <div
                      key={role.id}
                      className="bg-white rounded-lg border border-gray-100 p-6 hover:border-gray-200 transition-all duration-200"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-medium text-gray-900">
                            {role.fullName}
                          </h3>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="text-gray-400 hover:text-gray-600 transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="text-gray-400 hover:text-gray-600 transition-colors">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors">
                          View Permissions
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showAddUserModal && <AddUserModal />}
    </div>
  );
};

export default UserManagementPage;