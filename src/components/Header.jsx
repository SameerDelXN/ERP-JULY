import { Menu } from "lucide-react";
import React from "react";

const Header = ({ title, onMenuClick, children }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-6">
        <div className="flex items-center space-x-4">
          <button
            className="lg:hidden p-2 rounded-md hover:bg-gray-100"
            onClick={onMenuClick}
          >
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
        </div>

        <div className="flex items-center space-x-4">{children}</div>
      </div>
    </header>
  );
};

export default Header;
