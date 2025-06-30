"use client";
import DashboardSidebar from "@/components/DashboardSidebar";
import React, { useState } from "react";
import { staffSidebarItems } from "@/data/data";
import { Bell, ChevronDown } from "lucide-react";
import Avatar from "@/components/Avatar";
import Header from "@/components/Header";
import { useRouter } from "next/navigation";


const layout = ({ children }) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(
    staffSidebarItems[0]?.id || "overview"
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleTabChange = (newTab) => {
    // console.log("Changing tab to:", newTab); // Debug log
    setActiveTab(newTab);
    if(newTab === "overview")
    {
       router.push('/staff')
    }else{
      router.push(`/staff/${newTab}`)
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

  // console.log(activeTab);
  
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
        <div className="fixed top-0 left-0 right-0 z-40 bg-white shadow border-b lg:ml-64 h-16">
          <Header title={getTitle()} onMenuClick={() => setSidebarOpen(true)}>
            <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <div className="flex items-center space-x-3">
              <Avatar name="Staff User" />
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-900">Staff User</p>
                <p className="text-xs text-gray-500">Staff</p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-500" />
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
