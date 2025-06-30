"use client";
import React, { useState } from "react";
import { columns, data } from "@/data/data";
import TableData from "@/components/TableData";

const page = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      {/* <OverviewStats stats={stats} /> */}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Charts - 2 columns */}
        {/* <div className="lg:col-span-2 space-y-6">
          <AttendanceChart />
          <PerformanceMetricsCard />
        </div> */}

        {/* Sidebar Cards - 1 column */}
        {/* <div className="space-y-6">
          <QuickActionsCard />
          <RecentActivityCard activities={recentActivities} />
          <UpcomingEventsCard />
        </div> */}
      </div>
    </div>
  );

  const renderEnquiry = () => {
    return <TableData columns={columns} data={data} />;
  };

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return renderOverview();
      case "enquiry":
        return renderEnquiry();
      default:
        return (
          <Card className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Building className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Coming Soon
            </h3>
            <p className="text-gray-600">This section is under development</p>
          </Card>
        );
    }
  };

  return (
    <div className="max-h-screen bg-gray-50">
      <main className="p-6 pt-24">{renderContent()}</main>
    </div>
  );
};

export default page;
