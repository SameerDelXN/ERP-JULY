"use client";
import DashboardSidebar from "@/components/DashboardSidebar";
import React, { useState, useEffect } from "react";
import { staffSidebarItems } from "@/data/data";
import { Bell, ChevronDown } from "lucide-react";
import Avatar from "@/components/Avatar";
import Header from "@/components/Header";
import { useRouter } from "next/navigation";
import Unauthorized from "@/components/Unauthorized";
import { useSession } from "@/context/SessionContext";
import Loading from "@/components/Loading";



const layout = ({ children }) => {
  const {user,loading} = useSession()
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(staffSidebarItems[0]?.id || "overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.push("/login");
      return;
    }

    // Check if user has staff role
    if (user.role === "staff") {
      setIsAuthorized(true);
    } else {
      setIsAuthorized(false);
    }

    setIsLoading(false);
  }, [user, loading, router]);

  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
    if (newTab === "overview") {
      router.push('/staff');
    } else {
      router.push(`/staff/${newTab}`);
    }
  };

  const activeTabItem = staffSidebarItems.find((item) => item.id === activeTab);

  const getTitle = () => {
    if (activeTab === "overview") {
      return activeTabItem?.label || "Dashboard Overview";
    }
    return (
      activeTabItem?.label ||
      activeTab.charAt(0).toUpperCase() + activeTab.slice(1)
    );
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
        items={staffSidebarItems}
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
            <div className="flex items-center space-x-3 px-2 py-1.5 rounded-lg hover:bg-gray-50 transition-colors duration-200 cursor-pointer group">
              {/* Avatar */}
              <div className="relative">
                <Avatar name={user?.username || "Staff User"} />
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
              </div>

              {/* User Info */}
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-900 group-hover:text-gray-700">
                  {user?.username || "Staff User"}
                </p>
                <p className="text-xs text-gray-500">Staff</p>
              </div>

              {/* Dropdown Arrow */}
              <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors duration-200" />
            </div>
          </Header>
        </div>  

        {/* Scrollable main area */}
        <main className="flex-1 overflow-y-auto pt-20 px-6">{children}</main>
      </div>
    </div>
  );
};

export default layout;