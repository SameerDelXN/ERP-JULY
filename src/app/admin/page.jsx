"use client";
import React, { useState } from "react";
import { columns , data } from "@/data/data";
import Header from "@/components/Header";
import { Bell, ChevronDown , SquarePen ,Trash2Icon } from "lucide-react";
import Avatar from "@/components/Avatar";
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
  
  // const renderStudents = () => (
  //   <div className="space-y-6">
  //     {/* Header Actions Card */}
  //     <Card>
  //       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
  //         <h2 className="text-2xl font-bold text-gray-900">Student Management</h2>
  //         <div className="flex items-center space-x-3">
  //           <Button variant="secondary" icon={Filter}>Filter</Button>
  //           <Button variant="secondary" icon={Download}>Export</Button>
  //           <Button variant="primary" icon={Plus}>Add Student</Button>
  //         </div>
  //       </div>

  //       {/* Search and Filters */}
  //       <div className="flex flex-col sm:flex-row gap-4">
  //         <SearchBar placeholder="Search students..." className="flex-1" />
  //         <select className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
  //           <option>All Classes</option>
  //           <option>Grade 9</option>
  //           <option>Grade 10</option>
  //           <option>Grade 11</option>
  //           <option>Grade 12</option>
  //         </select>
  //         <select className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
  //           <option>All Status</option>
  //           <option>Active</option>
  //           <option>Inactive</option>
  //           <option>Graduated</option>
  //         </select>
  //       </div>
  //     </Card>

  //     {/* Students Table */}
  //     <StudentTable students={students} />
  //   </div>
  // );

const renderEnquiry = () => {
  return (
    // <div className="overflow-x-auto w-full">

    // <table className="table-auto w-full border border-gray-200">
    //   <thead>
    //     <tr className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
    //       <th className="border px-4 py-2">Reg.Id</th>
    //       <th className="border px-4 py-2">First Name</th>
    //       <th className="border px-4 py-2">Last Name</th>
    //       <th className="border px-4 py-2">Date of Birth</th>
    //       <th className="border px-4 py-2">Gender</th>
    //       <th className="border px-4 py-2">Nationality</th>
    //       <th className="border px-4 py-2">Father’s Full Name</th>
    //       <th className="border px-4 py-2">Mother’s Full Name</th>
    //       <th className="border px-4 py-2">Mobile Number</th>
    //       <th className="border px-4 py-2">Email Address</th>
    //       <th className="border px-4 py-2">Address Line 1</th>
    //       <th className="border px-4 py-2">City</th>
    //       <th className="border px-4 py-2">State</th>
    //       <th className="border px-4 py-2">Postal/Zip Code</th>
    //       <th className="border px-4 py-2">Country</th>
    //       <th className="border px-4 py-2">Current School Name</th>
    //       <th className="border px-4 py-2">Current Class</th>
    //       <th className="border px-4 py-2">Applying For Class</th>
    //       <th className="border px-4 py-2">Academic Year Applying For</th>
    //       <th className="border px-4 py-2">Preferred Medium of Instruction</th>
    //       <th className="border px-4 py-2">Birth Certificate</th>
    //       <th className="border px-4 py-2">Parent Aadhaar or PAN Card</th>
    //       <th className="border px-4 py-2">Action</th>
    //     </tr>
    //   </thead>
    //   <tbody>
    //     <tr>
    //       <td className="border px-4 py-2">Reg.Id</td>
    //       <td className="border px-4 py-2">First Name</td>
    //       <td className="border px-4 py-2">Last Name</td>
    //       <td className="border px-4 py-2">Date of Birth</td>
    //       <td className="border px-4 py-2">Gender</td>
    //       <td className="border px-4 py-2">Nationality</td>
    //       <td className="border px-4 py-2">Father’s Full Name</td>
    //       <td className="border px-4 py-2">Mother’s Full Name</td>
    //       <td className="border px-4 py-2">Mobile Number</td>
    //       <td className="border px-4 py-2">Email Address</td>
    //       <td className="border px-4 py-2">Address Line 1</td>
    //       <td className="border px-4 py-2">City</td>
    //       <td className="border px-4 py-2">State</td>
    //       <td className="border px-4 py-2">Postal/Zip Code</td>
    //       <td className="border px-4 py-2">Country</td>
    //       <td className="border px-4 py-2">Current School Name</td>
    //       <td className="border px-4 py-2">Current Class</td>
    //       <td className="border px-4 py-2">Applying For Class</td>
    //       <td className="border px-4 py-2">Academic Year Applying For</td>
    //       <td className="border px-4 py-2">Preferred Medium of Instruction</td>
    //       <td className="border px-4 py-2">Birth Certificate</td>
    //       <td className="border px-4 py-2">Parent Aadhaar or PAN Card</td>
    //       <td className="border px-4 py-2">
    //           <SquarePen className="inline-block mr-2" />
    //           <Trash2Icon className="inline-block" />
    //       </td>
    //     </tr>
    //   </tbody>
    // </table>
    // </div>

    <TableData columns={columns} data={data}/>
  );
};


   const renderContent = () => {
    switch(activeTab) {
      case 'overview':
        return renderOverview();
      case 'enquiry':
        return renderEnquiry();
      default:
        return (
          <Card className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Building className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Coming Soon</h3>
            <p className="text-gray-600">This section is under development</p>
          </Card>
        );
    }
  };

  return (
     <div className="max-h-screen bg-gray-50">
        <main className="p-6 pt-24">
          {renderContent()}
        </main>
    </div>
  );
};

export default page;
