import { Building2, X } from "lucide-react";
import Image from "next/image";
import React from "react";
//sample
const DashboardSidebar = ({
  items,
  activeTab,
  onTabChange,
  isOpen,
  onClose,
}) => {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40 lg:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 z-50 w-64 h-screen bg-white shadow-2xl transform transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:shadow-none lg:border-r lg:border-gray-100 ${isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-100 bg-white">
            {/* <div className="w-full h-14 pt-5 bg-red-500">
              <Image
                width={540}
                height={480}
                src="/TechEdu.png"
                alt="TechEdu Logo"
                className="object-contain w-full  object-cover  h-full  "
              />
            </div> */}
            <div className="mt-10">
              <div className="w-40 h-40 flex items-center justify-center ">
                {" "}

                {/* Increase width/height */}
                <Image
                  width={1920}
                  height={1080}
                  src="/TechEdu.png"
                  alt="TechEdu Logo"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            <button
              className="lg:hidden p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              onClick={onClose}
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id);
                  onClose();
                }}
                className={`w-full flex items-center space-x-4 px-4 py-3 rounded-xl text-left transition-all duration-200 group ${activeTab === item.id
                    ? "bg-white text-blue-700 shadow-sm border border-blue-100"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-transparent"
                  }`}
              >
                <div
                  className={`flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-200 flex-shrink-0 ${activeTab === item.id
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                      : "bg-blue-50 text-blue-600 group-hover:bg-blue-100"
                    }`}
                >
                  <item.icon className="w-6 h-6 stroke-[1.5]" />
                </div>
                <span className="font-medium text-sm">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
            <div className="text-xs text-gray-500 text-center">
              © 2025 ERP Learning Portal
            </div>
            <div className="text-xs text-gray-400 text-center mt-1">
              All rights reserved
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardSidebar;
