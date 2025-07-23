"use client";

import { useState, useEffect } from 'react';

export default function SalaryPage() {
  const [formData, setFormData] = useState({
    staffId: '',
    name: '',
    baseSalary: '',
    allowances: '',
    deductions: '',
    leaveDeduction: ''
  });
  const [salaryRecords, setSalaryRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setIsLoading(true);
    fetch('/api/hr/salary')
      .then(res => res.json())
      .then(data => {
        if (data.success) setSalaryRecords(data.data);
      })
      .catch(() => setSalaryRecords([]))
      .finally(() => setIsLoading(false));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateNetSalary = () => {
    const base = parseFloat(formData.baseSalary) || 0;
    const allowances = parseFloat(formData.allowances) || 0;
    const deductions = parseFloat(formData.deductions) || 0;
    const leaveDeduction = parseFloat(formData.leaveDeduction) || 0;
    return base + allowances - deductions - leaveDeduction;
  };

  const handleSubmit = async () => {
    if (!formData.staffId || !formData.name || !formData.baseSalary) return;
    setIsLoading(true);
    try {
      const res = await fetch('/api/hr/salary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          staffId: formData.staffId,
          name: formData.name,
          baseSalary: parseFloat(formData.baseSalary),
          allowances: parseFloat(formData.allowances) || 0,
          deductions: parseFloat(formData.deductions) || 0,
          leaveDeduction: parseFloat(formData.leaveDeduction) || 0,
        }),
      });
      const data = await res.json();
      if (data.success) {
        if (editingId) {
          setSalaryRecords(prev =>
            prev.map(record => record._id === data.data._id ? data.data : record)
          );
          setEditingId(null);
        } else {
          setSalaryRecords(prev => [...prev, data.data]);
        }
        setFormData({
          staffId: '',
          name: '',
          baseSalary: '',
          allowances: '',
          deductions: '',
          leaveDeduction: ''
        });
      } else {
        alert(data.error || 'Failed to save salary');
      }
    } catch (err) {
      alert('Error saving salary');
    }
    setIsLoading(false);
  };

  const handleEdit = (record) => {
    setFormData({
      staffId: record.staffId,
      name: record.name,
      baseSalary: record.baseSalary.toString(),
      allowances: record.allowances.toString(),
      deductions: record.deductions.toString(),
      leaveDeduction: record.leaveDeduction.toString()
    });
    setEditingId(record._id);
  };

  // No backend delete implemented yet
  // const handleDelete = (id) => {
  //   setSalaryRecords(prev => prev.filter(record => record._id !== id));
  // };

  const filteredRecords = salaryRecords?.filter(record =>
    record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.staffId.toLowerCase().includes(searchTerm.toLowerCase())
  );
console.log(salaryRecords)
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Salary Structure Management</h1>
          <a 
            href="/hr/payroll" 
            className="inline-flex items-center text-[#093FB4] hover:text-blue-700 font-medium cursor-pointer"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Payroll
          </a>
        </div>

        {/* Add/Edit Salary Form */}
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            {editingId ? 'Edit Salary Structure' : 'Add New Salary Structure'}
          </h2>
          
          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="staffId" className="block text-sm font-medium text-gray-700 mb-1">
                  Staff ID *
                </label>
                <input
                  type="text"
                  id="staffId"
                  name="staffId"
                  value={formData.staffId}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., STF010"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Employee Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter employee name"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="baseSalary" className="block text-sm font-medium text-gray-700 mb-1">
                  Base Salary *
                </label>
                <input
                  type="number"
                  id="baseSalary"
                  name="baseSalary"
                  value={formData.baseSalary}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="allowances" className="block text-sm font-medium text-gray-700 mb-1">
                  Allowances
                </label>
                <input
                  type="number"
                  id="allowances"
                  name="allowances"
                  value={formData.allowances}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>
              
              <div>
                <label htmlFor="deductions" className="block text-sm font-medium text-gray-700 mb-1">
                  Deductions
                </label>
                <input
                  type="number"
                  id="deductions"
                  name="deductions"
                  value={formData.deductions}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>
              
              <div>
                <label htmlFor="leaveDeduction" className="block text-sm font-medium text-gray-700 mb-1">
                  Leave Deduction
                </label>
                <input
                  type="number"
                  id="leaveDeduction"
                  name="leaveDeduction"
                  value={formData.leaveDeduction}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            {/* Net Salary Preview */}
            {(formData.baseSalary || formData.allowances || formData.deductions || formData.leaveDeduction) && (
              <div className="bg-gray-50 p-4 rounded-md border">
                <p className="text-sm text-gray-600">
                  Net Salary Preview: <span className="font-bold text-lg text-[#093FB4]">${calculateNetSalary().toLocaleString()}</span>
                </p>
              </div>
            )}

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className={`px-6 py-2 rounded-md font-medium ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#093FB4] hover:bg-blue-700 text-[#FFFCFB]'}`}
              >
                {isLoading ? 'Processing...' : editingId ? 'Update Salary' : 'Add Salary Structure'}
              </button>
              
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setFormData({
                      staffId: '',
                      name: '',
                      baseSalary: '',
                      allowances: '',
                      deductions: '',
                      leaveDeduction: ''
                    });
                  }}
                  className="px-6 py-2 rounded-md font-medium bg-gray-200 text-gray-700 hover:bg-gray-300"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Search and Table */}
        <div className="mb-4 flex items-center">
          <input
            type="text"
            placeholder="Search by name or staff ID..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 w-full md:w-1/3"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Staff ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Base Salary</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Allowances</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Deductions</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Leave Deduction</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Net Salary</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRecords.map(record => (
                <tr key={record._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.staffId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${record.baseSalary?.toLocaleString?.() ?? '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${record.allowances?.toLocaleString?.() ?? '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${record.deductions?.toLocaleString?.() ?? '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${record.leaveDeduction?.toLocaleString?.() ?? '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">${record.netSalary?.toLocaleString?.() ?? '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <button
                      className="text-blue-600 hover:text-blue-900 mr-2"
                      onClick={() => handleEdit(record)}
                    >
                      Edit
                    </button>
                    {/*
                    <button
                      className="text-red-600 hover:text-red-900"
                      onClick={() => handleDelete(record._id)}
                    >
                      Delete
                    </button>
                    */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}