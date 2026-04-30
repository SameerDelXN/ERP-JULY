"use client";
import DashboardSidebar from "@/components/DashboardSidebar";
import React, { useState, useEffect, useRef } from "react";
import { teacherSidebarItems } from "@/data/data";
import { Bell, ChevronDown, LogOut, User, Settings } from "lucide-react";
import Avatar from "@/components/Avatar";
import Header from "@/components/Header";
import { useRouter } from "next/navigation";
import Unauthorized from "@/components/Unauthorized";
import { useSession } from "@/context/SessionContext";
import Loading from "@/components/Loading";

const Layout = ({ children }) => {
  const { user, loading, logout } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(teacherSidebarItems[0]?.id || "overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const [instituteName, setInstituteName] = useState("");
  const profileRef = useRef(null);

  // Fetch institute name
  useEffect(() => {
    const fetchInstituteName = async () => {
      try {
        const res = await fetch('/api/system/settings');
        const data = await res.json();
        if (data.success && data.settings?.systemConfig?.collegeName) {
          setInstituteName(data.settings.systemConfig.collegeName);
        }
      } catch (err) {
        console.error('Error fetching institute name:', err);
      }
    };
    fetchInstituteName();
  }, []);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.push("/login");
      return;
    }

    if (user.role === "teacher") {
      setIsAuthorized(true);
    } else {
      setIsAuthorized(false);
    }

    setIsLoading(false);
  }, [user, loading, router]);

  // Handle tab change
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    router.push(`/teacher/${tabId}`);
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const getTitle = () => {
    const activeTabItem = teacherSidebarItems.find((item) => item.id === activeTab);
    return activeTabItem?.label || activeTab.charAt(0).toUpperCase() + activeTab.slice(1) || "Teacher Dashboard";
  };

  if (loading || isLoading) {
    return <Loading />;
  }

  if (!isAuthorized) {
    return <Unauthorized />;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <DashboardSidebar
        items={teacherSidebarItems}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100/50 lg:ml-64 h-16 shadow-sm">
          <Header title={getTitle()} onMenuClick={() => setSidebarOpen(true)} instituteName={instituteName}>
            {/* Notification Button */}
            <button className="relative p-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-50/80 rounded-xl transition-all duration-300 group">
              <Bell className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
              <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full border-2 border-white">
                <span className="absolute inset-0 w-3 h-3 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full animate-ping opacity-75"></span>
              </span>
            </button>

            {/* User Profile Section */}
            <div
              ref={profileRef}
              className="relative flex items-center space-x-3 px-3 py-2 rounded-2xl hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100/50 transition-all duration-300 cursor-pointer group border border-transparent hover:border-gray-200/50"
              onClick={() => setProfileOpen(!profileOpen)}
            >
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-500 group-hover:scale-105 p-0.5 transition-transform duration-300">
                  <div className="w-full h-full rounded-full bg-white p-0.5">
                    <Avatar name={user?.fullName || "Teacher"} />
                  </div>
                </div>
              </div>

              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-gray-900 group-hover:text-gray-700 transition-colors duration-200">
                  {user?.fullName || "Teacher"}
                </p>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <User className="w-3 h-3" />
                  Faculty
                </p>
              </div>

              <ChevronDown className={`w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-all duration-300 ${profileOpen ? 'transform rotate-180 text-orange-500' : ''}`} />

              {/* Profile Dropdown */}
              {profileOpen && (
                <div className="absolute right-0 top-14 w-72 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl py-2 z-50 border border-gray-200/50 animate-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-4 border-b border-gray-100/50">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-500 p-0.5">
                        <div className="w-full h-full rounded-full bg-white p-0.5">
                          <Avatar name={user?.fullName || "Teacher"} />
                        </div>
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <p className="font-semibold text-gray-900 truncate">{user?.fullName || "Teacher"}</p>
                        <p className="text-sm text-gray-500 truncate">{user?.email || "teacher@techedu.com"}</p>
                      </div>
                    </div>
                  </div>

                  <div className="py-2">
                    <button
                      className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-orange-50 hover:to-amber-50 hover:text-orange-700 transition-all duration-200 group"
                      onClick={() => router.push('/teacher/profile')}
                    >
                      <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center mr-3 group-hover:bg-orange-200 transition-colors">
                        <User className="w-4 h-4 text-orange-600" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-medium">Profile Settings</p>
                        <p className="text-xs text-gray-500">Manage your account</p>
                      </div>
                    </button>
                    <button
                      className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-amber-50 hover:to-yellow-50 hover:text-amber-700 transition-all duration-200 group"
                      onClick={() => router.push('/teacher/settings')}
                    >
                      <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center mr-3 group-hover:bg-amber-200 transition-colors">
                        <Settings className="w-4 h-4 text-amber-600" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-medium">Preferences</p>
                        <p className="text-xs text-gray-500">Customize your experience</p>
                      </div>
                    </button>
                  </div>

                  <div className="px-4 py-2 border-t border-gray-100/50">
                    <button
                      className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 hover:text-red-700 transition-all duration-200 group rounded-lg"
                      onClick={handleLogout}
                    >
                      <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center mr-3 group-hover:bg-red-200 transition-colors">
                        <LogOut className="w-4 h-4 text-red-600" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-medium">Sign Out</p>
                        <p className="text-xs text-gray-500">End your session</p>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </Header>
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 pt-16">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
