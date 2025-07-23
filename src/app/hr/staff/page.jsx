'use client';
import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
//import Modal from '@/components/Modal';

export default function StaffManagement() {
  const [staff, setStaff] = useState([]);
  const [filteredStaff, setFilteredStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStaff, setCurrentStaff] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    staffId: '',
    fullName: '',
    email: '',
    department: 'HR',
    position: '',
    salary: '',
    contactNumber: ''
  });

  // Fetch all staff
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const res = await fetch('/api/hr/staff');
        const data = await res.json();
        setStaff(data.data);
        setFilteredStaff(data.data);
      } catch (error) {
        console.error('Failed to fetch staff:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStaff();
  }, []);

  // Search functionality
  useEffect(() => {
    const results = staff.filter(person =>
      person?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person?.staffId?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStaff(results);
  }, [searchTerm, staff]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Create or Update staff
  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = currentStaff 
      ? `/api/hr/staff/${currentStaff._id}`
      : '/api/hr/staff';
    const method = currentStaff ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const newStaff = await res.json();
      
      if (currentStaff) {
        setStaff(staff.map(s => s._id === newStaff._id ? newStaff : s));
      } else {
        setStaff([...staff, newStaff]);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving staff:', error);
    }
  };

  // Delete staff
  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this staff member?')) return;
    
    try {
      await fetch(`/api/hr/staff/${id}`, { method: 'DELETE' });
      setStaff(staff.filter(s => s._id !== id));
    } catch (error) {
      console.error('Error deleting staff:', error);
    }
  };

  // Open modal for editing
  const handleEdit = (staff) => {
    setCurrentStaff(staff);
    setFormData({
      staffId: staff.staffId,
      name: staff.name,
      email: staff.email,
      department: staff.department,
      designation: staff.designation,
      salary: staff.salary,
      contactNumber: staff.contactNumber || ''
    });
    setIsModalOpen(true);
  };

  // Reset form for new staff
  const handleAddNew = () => {
    setCurrentStaff(null);
    setFormData({
      staffId: '',
      name: '',
      email: '',
      department: 'HR',
      designation: '',
      salary: '',
      contactNumber: ''
    });
    setIsModalOpen(true);
  };

  if (loading) return <div className="text-center py-8">Loading staff data...</div>;
  console.log(filteredStaff)
  return (
    <div className="p-6 text-gray-950">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Staff Management</h1>
        <button
          onClick={handleAddNew}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          <Plus className="mr-2" size={18} />
          Add Staff
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-3 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search by name or staff ID..."
          className="pl-10 pr-4 py-2 w-full max-w-md border rounded-lg focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Staff Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Staff ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Position</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Salary</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredStaff?.map((person) => (
              <tr key={person._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{person.staffId}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{person.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{person.department}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{person.designation}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${person.salary.toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button
                    onClick={() => handleEdit(person)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(person._id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <h2 className="text-xl font-bold mb-4">
              {currentStaff ? 'Edit Staff Member' : 'Add New Staff Member'}
            </h2>
            <form onSubmit={handleSubmit}>
              {/* ... [keep your existing form fields] */}
              <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Staff ID</label>
              <input
                type="text"
                name="staffId"
                value={formData.staffId}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md"
                required
              >
                <option value="HR">HR</option>
                <option value="Finance">Finance</option>
                <option value="IT">IT</option>
                <option value="Operations">Operations</option>
                <option value="Marketing">Marketing</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
              <input
                type="text"
                name="position"
                value={formData.position}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Salary</label>
              <input
                type="number"
                name="salary"
                value={formData.salary}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
              <input
                type="tel"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 border rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {currentStaff ? 'Update' : 'Save'}
            </button>
          </div>
        </form>
            </form>
          </div>
        </div>
      )}
      
    </div>
  );
}