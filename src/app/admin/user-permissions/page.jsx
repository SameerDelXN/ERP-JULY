"use client";
import React, { useState, useEffect } from "react";
import {
    adminSidebarItems,
    studentSidebarItems,
    teacherSidebarItems,
    staffSidebarItems,
    hodSidebarItems,
    hrSidebarItems,
    superadminSidebarItems,
} from "@/data/data";
import { Search, Save, CheckCircle, XCircle } from "lucide-react";
import { toast } from "react-hot-toast";

const UserPermissionsPage = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const [editedPermissions, setEditedPermissions] = useState([]);
    const [saving, setSaving] = useState(false);

    // Map roles to sidebar items
    const roleSidebarMap = {
        admin: adminSidebarItems,
        student: studentSidebarItems,
        teacher: teacherSidebarItems,
        staff: staffSidebarItems,
        hr: hrSidebarItems,
        hod: hodSidebarItems,
        superadmin: superadminSidebarItems,
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        if (searchTerm) {
            const lower = searchTerm.toLowerCase();
            setFilteredUsers(
                users.filter(
                    (u) =>
                        u.fullName.toLowerCase().includes(lower) ||
                        u.email?.toLowerCase().includes(lower) ||
                        u.role.toLowerCase().includes(lower)
                )
            );
        } else {
            setFilteredUsers(users);
        }
    }, [searchTerm, users]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await fetch("/api/admin/permissions/users");
            if (response.ok) {
                const data = await response.json();
                setUsers(data);
                setFilteredUsers(data);
            } else {
                toast.error("Failed to fetch users");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error fetching users");
        } finally {
            setLoading(false);
        }
    };

    const handleUserClick = (user) => {
        setSelectedUser(user);
        // If permissions is empty/null, it implies default access (all tabs) or no access.
        // Based on requirement: "remove a permission that is not necessary", 
        // we should initialize with all tabs if the permissions array is empty.
        // However, if we want to START with what they have persisted, we use user.permissions.
        // If user.permissions is empty [], let's assume they have ALL permissions by default, 
        // so we pre-fill all IDs.

        const roleItems = roleSidebarMap[user.role.toLowerCase()] || [];
        const allTabIds = roleItems.map((item) => item.id);

        if (!user.permissions || user.permissions.length === 0) {
            setEditedPermissions(allTabIds);
        } else {
            setEditedPermissions(user.permissions);
        }
    };

    const togglePermission = (tabId) => {
        setEditedPermissions((prev) => {
            if (prev.includes(tabId)) {
                return prev.filter((id) => id !== tabId);
            } else {
                return [...prev, tabId];
            }
        });
    };

    const savePermissions = async () => {
        if (!selectedUser) return;
        setSaving(true);
        try {
            const response = await fetch("/api/admin/permissions/update", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: selectedUser._id,
                    type: selectedUser.type, // 'user' | 'student' | 'teacher'
                    permissions: editedPermissions,
                }),
            });

            if (response.ok) {
                toast.success("Permissions updated successfully");
                // Update local state
                const updatedUsers = users.map((u) =>
                    u._id === selectedUser._id ? { ...u, permissions: editedPermissions } : u
                );
                setUsers(updatedUsers);
                setSelectedUser({ ...selectedUser, permissions: editedPermissions });
            } else {
                toast.error("Failed to update permissions");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error updating permissions");
        } finally {
            setSaving(false);
        }
    };

    const currentRoleItems = selectedUser
        ? roleSidebarMap[selectedUser.role.toLowerCase()] || []
        : [];

    return (
        <div className="p-6 h-[calc(100vh-80px)] overflow-hidden flex flex-col">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">User Permissions Management</h1>

            <div className="flex flex-1 gap-6 overflow-hidden">
                {/* User List Panel */}
                <div className="w-1/3 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col">
                    <div className="p-4 border-b border-gray-100">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search users..."
                                className="w-full pl-9 pr-4 py-2 bg-gray-50 border-none rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none text-sm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {loading ? (
                            <div className="p-8 text-center text-gray-500">Loading users...</div>
                        ) : filteredUsers.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">No users found</div>
                        ) : (
                            <div className="divide-y divide-gray-50">
                                {filteredUsers.map((user) => (
                                    <div
                                        key={user._id}
                                        onClick={() => handleUserClick(user)}
                                        className={`p-4 cursor-pointer transition-colors hover:bg-gray-50 ${selectedUser?._id === user._id ? "bg-blue-50 border-l-4 border-blue-500" : "border-l-4 border-transparent"
                                            }`}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-medium text-gray-900">{user.fullName}</h3>
                                                <p className="text-xs text-gray-500 uppercase mt-1">{user.role}</p>
                                                <p className="text-xs text-gray-400">{user.email}</p>
                                            </div>
                                            {selectedUser?._id === user._id && (
                                                <CheckCircle className="w-4 h-4 text-blue-500" />
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Permissions Panel */}
                <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col">
                    {selectedUser ? (
                        <>
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900">Manage Permissions</h2>
                                    <p className="text-sm text-gray-500">
                                        Control sidebar access for <span className="font-medium text-gray-900">{selectedUser.fullName}</span> ({selectedUser.role})
                                    </p>
                                </div>
                                <button
                                    onClick={savePermissions}
                                    disabled={saving}
                                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Save className="w-4 h-4" />
                                    {saving ? "Saving..." : "Save Changes"}
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6">
                                {currentRoleItems.length === 0 ? (
                                    <div className="text-center text-gray-500 py-10">
                                        No configurable tabs available for this role.
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {currentRoleItems.map((item) => {
                                            const isPermitted = editedPermissions.includes(item.id);
                                            return (
                                                <div
                                                    key={item.id}
                                                    onClick={() => togglePermission(item.id)}
                                                    className={`
                                                        flex items-center justify-between p-4 rounded-xl border border-gray-100 cursor-pointer 
                                                        transition-all duration-200 hover:shadow-sm hover:border-blue-200 bg-white group
                                                    `}
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className={`p-2.5 rounded-lg transition-colors ${isPermitted ? "bg-blue-50 text-blue-600" : "bg-gray-100 text-gray-400 group-hover:bg-gray-200"
                                                            }`}>
                                                            {item.icon && <item.icon className="w-5 h-5" />}
                                                        </div>
                                                        <div>
                                                            <p className={`font-medium text-sm transition-colors ${isPermitted ? "text-gray-900" : "text-gray-500"
                                                                }`}>
                                                                {item.label}
                                                            </p>
                                                            <p className="text-xs text-gray-400 font-mono mt-0.5">{item.id}</p>
                                                        </div>
                                                    </div>

                                                    <div className={`
                                                        relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300
                                                        ${isPermitted ? 'bg-blue-600' : 'bg-gray-200'}
                                                    `}>
                                                        <span className={`
                                                            inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 shadow-sm
                                                            ${isPermitted ? 'translate-x-6' : 'translate-x-1'}
                                                        `} />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <Search className="w-8 h-8 text-gray-300" />
                            </div>
                            <p className="text-lg font-medium text-gray-500">Select a user to manage permissions</p>
                            <p className="text-sm mt-2">Search and click on a user from the list on the left.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserPermissionsPage;
