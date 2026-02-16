import { Menu } from "lucide-react";
import React from "react";

const Header = ({ title, onMenuClick, children }) => {
  return (
    <header className="bg-white border-b border-gray-100">
      <div className="flex items-center h-16 px-6">
        {/* Left Section - Menu & Title */}
        <div className="flex items-center space-x-4 flex-shrink-0">
          <button
            className="lg:hidden p-2.5 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-gray-500 hover:text-gray-700"
            onClick={onMenuClick}
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
            <div className="text-xs text-gray-500 hidden sm:block">
              Dashboard {title}
            </div>
          </div>
        </div>

        {/* Center Section - School Name */}
        <div className="hidden lg:flex flex-1 items-center justify-center px-4">
          <h2 className="text-xl font-bold bg-gradient-to-r from-blue-700 via-blue-600 to-blue-800 bg-clip-text text-transparent tracking-tight whitespace-nowrap drop-shadow-sm font-sans">
            Dnyaneshwari Primary and Secondary School
          </h2>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center space-x-2 flex-shrink-0 ml-auto lg:ml-0">
          {children}
        </div>
      </div>
    </header>
  );
};

export default Header;