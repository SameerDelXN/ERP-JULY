"use client";
import DashboardSidebar from "@/components/DashboardSidebar";
import React, { useState } from "react";
import { sidebarItems } from "@/data/data";
import { Bell, ChevronDown } from "lucide-react";
import Avatar from "@/components/Avatar";
import Header from "@/components/Header";

const layout = ({ children }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="max-h-screen bg-gray-50">
      <aside>
        <DashboardSidebar
          items={sidebarItems}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <div className="fixed top-0 left-0 right-0 z-4 bg-white shadow border-b lg:ml-64">
          <Header
            title={
              activeTab === "overview"
                ? "Dashboard Overview"
                : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)
            }
            onMenuClick={() => setSidebarOpen(true)}
          >
            {/* <SearchBar placeholder="Search..." className="w-64 hidden sm:block" /> */}

            <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            <div className="flex items-center space-x-3">
              <Avatar name="Admin User" />
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-900">Admin User</p>
                <p className="text-xs text-gray-500">Super Admin</p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </div>
          </Header>
        </div>
      </aside>
      {children}
    </div>
  );
};

export default layout;
