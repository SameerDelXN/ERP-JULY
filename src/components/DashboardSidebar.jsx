import { GraduationCap, X } from 'lucide-react';
import React from 'react'

const DashboardSidebar = ({ items, activeTab, onTabChange, isOpen, onClose }) => {
  return (  
    <>
      {/* Mobile overlay */}
    {isOpen && (
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
        onClick={onClose}
      />
    )}

    {/* Sidebar */}
    <div className={`fixed inset-y-0 left-0 z-50 w-64 lg:min-h-screen bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
      isOpen ? 'translate-x-0' : '-translate-x-full'
    }`}>
      <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">EduAdmin</span>
        </div>
        <button 
          className="lg:hidden p-1 rounded-md hover:bg-gray-100"
          onClick={onClose}
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      <nav className="mt-6 px-4 space-y-2">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              onTabChange(item.id);
              onClose();
            }}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
              activeTab === item.id
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>

    </>
  )
}

export default DashboardSidebar

