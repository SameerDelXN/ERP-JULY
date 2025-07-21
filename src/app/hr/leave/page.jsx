'use client';
import { useState, useEffect } from 'react';
import { CalendarDays, Clock, User, Check, X, Plus } from 'lucide-react';
// Remove useParams import since we're not using it

export default function LeaveManagement() {
  // Remove the useParams since we're not using dynamic routes
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [filter, setFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [formData, setFormData] = useState({
    leaveType: 'casual',
    startDate: '',
    endDate: '',
    reason: '',
    contactNumber: ''
  });

  // Fetch leave requests from backend

  const fetchLeaveRequests = async () => {
  setLoading(true);
  try {
    const res = await fetch('/api/hr/leave', { method: 'GET' });
    const json = await res.json();
    if (json.success) {
      setLeaveRequests(json.data);
    } else {
      console.error('Failed to fetch:', json.error);
    }
  } catch (error) {
    console.error('Failed to fetch leave requests:', error);
  } finally {
    setLoading(false);
  }
};

useEffect(()=>{
  fetchLeaveRequests()
},[])


  // useEffect(() => {
  //   const fetchLeaveRequests = async () => {
  //     setLoading(true);
  //     try {
  //       // Fetch all leave requests (you'll need a different endpoint)
  //       const res = await fetch('/api/hr/leave', { method: 'GET' });
  //       const json = await res.json();
  //       if (json.success) {
  //         setLeaveRequests(json.data);
  //       } else {
  //         console.error('Failed to fetch:', json.error);
  //       }
  //     } catch (error) {
  //       console.error('Failed to fetch leave requests:', error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchLeaveRequests();
  // }, []); // Remove id dependency

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Submit new leave request to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setLoading(true);
    try {
      // Create new leave request (you'll need a different endpoint)
      const res = await fetch('/api/hr/leave/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const json = await res.json();
      if (json.success) {
        setLeaveRequests(prev => [json.data, ...prev]);
        setIsModalOpen(false);
        // Reset form
        setFormData({
          leaveType: 'casual',
          startDate: '',
          endDate: '',
          reason: '',
          contactNumber: ''
        });
      } else {
        alert(json.error || 'Failed to submit leave request');
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert('Failed to submit leave request');
    } finally {
      setLoading(false);
    }
  };

  // Approve leave request via backend
  const handleApprove = async (leaveId) => {
    setLoading(true);
    try {
      // Fixed: Use backticks and correct URL structure (leaveId in URL, not body)
      const res = await fetch(`/api/hr/leave/${leaveId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'approved' }),
      });
      const json = await res.json();
      if (json.success) {
        setLeaveRequests(prev =>
          prev.map(req => req._id === leaveId ? { ...req, status: 'approved' } : req)
        );
      } else {
        alert(json.error || 'Failed to approve leave');
      }
    } catch (error) {
      console.error('Approve error:', error);
      alert('Failed to approve leave');
    } finally {
      setLoading(false);
    }
  };

  // Reject leave request via backend
  const handleReject = async (leaveId) => {
    setLoading(true);
    try {
      // Fixed: Use backticks and correct URL structure (leaveId in URL, not body)
      const res = await fetch(`/api/hr/leave/${leaveId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'rejected' }),
      });
      const json = await res.json();
      if (json.success) {
        setLeaveRequests(prev =>
          prev.map(req => req._id === leaveId ? { ...req, status: 'rejected' } : req)
        );
      } else {
        alert(json.error || 'Failed to reject leave');
      }
    } catch (error) {
      console.error('Reject error:', error);
      alert('Failed to reject leave');
    } finally {
      setLoading(false);
    }
  };

  const filteredRequests = leaveRequests.filter(request => {
    if (filter === 'all') return true;
    return request.status === filter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (loading) return <div className="text-center py-8">Loading leave requests...</div>;

  console.log('Leave requests:', fetchLeaveRequests);
  console.log('Filtered requests:', filteredRequests);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-950">Leave Applications</h1>
        <div className="flex space-x-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border rounded-md px-3 py-2 text-gray-950"
          >
            <option value="all">All Requests</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            <Plus className="mr-2" size={18} />
            Apply Leave
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee ID</th>
              

              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Leave Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dates</th>
              {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th> */}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredRequests.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                  No leave requests found.
                </td>
              </tr>
            ) : (
              filteredRequests.map((request) => (
                <tr key={request._id}>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <User className="text-gray-600" size={16} />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{request.staffId?.name || 'N/A'}</div>
                        <div className="text-sm text-gray-500">{request.staffId?._id || 'N/A'}</div>
                      </div>
                    </div>
                  </td>
                  {/* <td className="px-6 py-4 text-sm text-gray-500 capitalize">
                    {request.leaveType} leave
                  </td> */}
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <CalendarDays className="mr-1" size={14} />
                      {new Date(request.startDate || request.fromDate).toLocaleDateString()} - {new Date(request.endDate || request.toDate).toLocaleDateString()}
                      <span className="ml-2 px-2 py-0.5 bg-gray-100 rounded text-xs">
                        {request.days} day{request.days > 1 ? 's' : ''}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                    {request.reason}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                      {request.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {request.status === 'pending' && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleApprove(request._id)}
                          className="p-1 text-green-600 hover:text-green-800"
                          title="Approve"
                        >
                          <Check size={18} />
                        </button>
                        <button
                          onClick={() => handleReject(request._id)}
                          className="p-1 text-red-600 hover:text-red-800"
                          title="Reject"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Inline Modal Implementation */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto relative">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-4">Apply for Leave</h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID</label>
                  <input
                    name="leaveType"
                    value={formData.staffId}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  
                    
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Leave Type</label>
                  <select
                    name="leaveType"
                    value={formData.leaveType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  >
                    <option value="casual">Casual Leave</option>
                    <option value="sick">Sick Leave</option>
                    <option value="earned">Earned Leave</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-md"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                  <input
                    type="text"
                    name="reason"
                    value={formData.reason}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                  <input
                    type="text"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
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
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}