"use client";
import DashboardSidebar from "@/components/DashboardSidebar";
import React, { useState, useEffect, useRef } from "react";
import { adminSidebarItems } from "@/data/data";
import { Bell, ChevronDown, User, Settings, LogOut } from "lucide-react";
import Avatar from "@/components/Avatar";
import Header from "@/components/Header";
import { useRouter } from "next/navigation";
import Unauthorized from "@/components/Unauthorized";
import { useSession } from "@/context/SessionContext";
import Loading from "@/components/Loading";

const Layout = ({ children }) => {
  const { user, loading, logout } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(adminSidebarItems[0]?.id || "overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

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

    if (user.role === "admin") {
      setIsAuthorized(true);
    } else {
      setIsAuthorized(false);
    }

    setIsLoading(false);
  }, [user, loading, router]);

  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
    if (newTab === "overview") {
      router.push('/admin');
    } else {
      router.push(`/admin/${newTab}`);
    }
  };

  const activeTabItem = adminSidebarItems.find((item) => item.id === activeTab);

  const getTitle = () => {
    if (activeTab === "overview") {
      return activeTabItem?.label || "Dashboard Overview";
    }
    return (
      activeTabItem?.label ||
      activeTab.charAt(0).toUpperCase() + activeTab.slice(1)
    );
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (isLoading) {
    return <Loading />;
  }

  if (!isAuthorized) {
    return <Unauthorized />;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <DashboardSidebar
        items={adminSidebarItems}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      
      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <div className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-100 lg:ml-64 h-16 shadow-sm">
          <Header title={getTitle()} onMenuClick={() => setSidebarOpen(true)}>
            {/* Notification Button */}
            <button className="relative p-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-all duration-200 group">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-red-500 rounded-full border-2 border-white">
                <span className="absolute inset-0 w-3 h-3 bg-red-500 rounded-full animate-ping opacity-75"></span>
              </span>
            </button>

            {/* User Profile Section */}
            <div 
              ref={profileRef}
              className="relative flex items-center space-x-3 px-2 py-1.5 rounded-lg hover:bg-gray-50 transition-colors duration-200 cursor-pointer group"
              onClick={() => setProfileOpen(!profileOpen)}
            >
              {/* Avatar */}
              <div className="relative">
                <Avatar name={user?.name || "Admin User"} />
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
              </div>

              {/* User Info */}
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-900 group-hover:text-gray-700">
                  {user?.username || "Admin User"}
                </p>
                <p className="text-xs text-gray-500">Super Administrator</p>
              </div>

              {/* Dropdown Arrow */}
              <ChevronDown className={`w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-all duration-200 ${profileOpen ? 'transform rotate-180' : ''}`} />

              {/* Profile Dropdown */}
              {profileOpen && (
                <div className="absolute right-0 top-12 w-56 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                  <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                    <p className="font-medium">{user?.username || "Admin User"}</p>
                    <p className="text-xs text-gray-500">{user?.email || ""}</p>
                  </div>
                  {/* <button
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => router.push('/admin/profile')}
                  >
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </button>
                  <button
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => router.push('/admin/settings')}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </button> */}
                  <button
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 border-t border-gray-100"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </Header>
        </div>  

        {/* Scrollable main area */}
        <main className="flex-1 overflow-y-auto pt-20 px-6">{children}</main>
      </div>
    </div>
  );
};

export default Layout;