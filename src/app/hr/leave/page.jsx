'use client';
import { useState, useEffect } from 'react';
import { CalendarDays, Clock, User, Check, X, Plus, Eye } from 'lucide-react';
// Remove useParams import since we're not using it

export default function LeaveManagement() {
  // Remove the useParams since we're not using dynamic routes
  const [rejectionReason, setRejectionReason] = useState('');
const [showRejectionModal, setShowRejectionModal] = useState(false);
const [currentRejectedRequest, setCurrentRejectedRequest] = useState(null);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [filter, setFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [formData, setFormData] = useState({
    staffId: '',
    leaveType: 'Casual',
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
    console.log('Fetched leave requests:', json);
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
      // Create new leave request
      const res = await fetch('/api/hr/leave', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          staffId: formData.staffId,
          fromDate: formData.startDate,
          toDate: formData.endDate,
          reason: formData.reason,
          type: formData.leaveType
        }),
      });
      const json = await res.json();
      if (json.success) {
        setLeaveRequests(prev => [json.data, ...prev]);
        setIsModalOpen(false);
        // Reset form
        setFormData({
          staffId: '',
          leaveType: 'Casual',
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
  const handleReject = async (leaveId) => {
  const reason = prompt("Please enter the reason for rejection:");
  if (reason === null) return; // User cancelled
  
  setLoading(true);
  console.log('Rejecting leave with ID:', leaveId, 'Reason:', reason);
  
  try {
    const res = await fetch(`/api/hr/leave/${leaveId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        status: 'rejected',
        rejectionReason: reason 
      }),
    });
    const json = await res.json();
    console.log('Reject response:', json);
    
    if (json.success) {
      setLeaveRequests(prev =>
        prev.map(req => req._id === leaveId ? { 
          ...req, 
          status: 'rejected',
          rejectionReason: reason 
        } : req)
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

//Approve leave request via backend

const handleApprove = async (leaveId) =>{
  setLoading(true)
  console.log('Approving leave with ID:', leaveId);

  try{
    const res = await fetch(`/api/hr/leave/${leaveId}`,{
      method:'PUT',
      headers:{'Content-Type': 'application/json'},
      body:JSON.stringify({status:'approved'}),
    });

    const json = await res.json()
    console.log('Approve response:', json);

    if(json.success){
      setLeaveRequests(prev => prev.map(req=> req._id === leaveId ? {...req,status:'approved'}:req))
    }
    else{
      alert(json.error || 'Failed to approve')
    }
  }
  catch(error){
    console.error('Approve error',error)
    alert('Failed to approve')
  }finally{
    setLoading(false)
  }
}

  // Reject leave request via backend
  // const handleReject = async (leaveId) => {
  //   setLoading(true);
  //   try {
  //     // Fixed: Use backticks and correct URL structure (leaveId in URL, not body)
  //     const res = await fetch(`/api/hr/leave/${leaveId}`, {
  //       method: 'PUT',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ status: 'rejected' }),
  //     });
  //     const json = await res.json();
  //     if (json.success) {
  //       setLeaveRequests(prev =>
  //         prev.map(req => req._id === leaveId ? { ...req, status: 'rejected' } : req)
  //       );
  //     } else {
  //       alert(json.error || 'Failed to reject leave');
  //     }
  //   } catch (error) {
  //     console.error('Reject error:', error);
  //     alert('Failed to reject leave');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

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

  const getInitials = (name) => {
  if (!name) return '';
  return name.split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

  if (loading) return <div className="text-center py-8">Loading leave requests...</div>;

  console.log('Leave requests:', leaveRequests);
  console.log('Filtered requests:', filteredRequests);


  const totalApplication = filteredRequests.length;
  const totalPending = filteredRequests.filter(sta => {
    const pending = sta.status === "pending"
    return pending
  })

  const totalApproved = filteredRequests.filter(sta => {
    const approved = sta.status === "approved"
    return approved
  })

  console.log(totalPending.length);
  


  return (
    <div className="p-2 sm:p-4 md:p-6 max-w-6xl mx-auto w-full">
      <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6'>
        <div className='bg-white rounded-lg shadow p-4 border-l-4 border-blue-500' >
          <div className='flex justify-between items-start'>
            <div>
              <p className='text-sm font-medium text-gray-500'>Total Application</p>
              <p className='text-2xl font-bold text-gray-900'>{totalApplication}</p>
            </div>
            <div className='p-3 rounded-full bg-blue-100 text-blue-600'>
              <CalendarDays size={20}/>
            </div>
          </div>
          <p className='text-xs text-gray-500 mt-2'>This month</p>
        </div>

        {/* Approved Card*/}
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Approved</p>
              <p className="text-2xl font-bold text-gray-900">{totalApproved.length}</p>
            </div>
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <Check size={20} />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">This month</p>
        </div>

        {/* Pending Card */}
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-yellow-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{totalPending.length}</p>
            </div>
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <Clock size={20} />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">This month</p>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-2">
        {/* <h1 className="text-xl sm:text-2xl font-bold text-gray-950">Leave Applications</h1> */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border rounded-md px-3 py-2 text-gray-950 w-full sm:w-auto"
          >
            <option value="all">All Requests</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full sm:w-auto text-sm sm:text-base"
          >
            <Plus className="mr-2" size={18} />
            Apply Leave
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-xs sm:text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee ID</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Leave Type</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dates</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-4 sm:px-6 py-4 text-center text-gray-500">
                    No leave requests found.
                  </td>
                </tr>
              ) : (
                filteredRequests.map((request) => (
                  <tr key={request._id}>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gray-200 flex items-center justify-center text-xs sm:text-base">
                          {getInitials(request.staffId?.name)}
                        </div>
                        <div className="ml-2 sm:ml-4">
                          <div className="text-xs sm:text-sm font-medium text-gray-900">{request.staffId?.name || 'N/A'}</div>
                          <div className="text-xs sm:text-sm text-gray-500">{request.staffId?.staffId || 'N/A'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-gray-500 capitalize">
                      {request.type || request.leaveType} leave
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-gray-500">
                      <div className="flex items-center">
                        <CalendarDays className="mr-1" size={14} />
                        {new Date(request.fromDate).toLocaleDateString()} - {new Date(request.toDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-gray-500">
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
      </div>

      {/* Rejection Reason Modal */}
      {showRejectionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2">
          <div className="bg-white rounded-lg p-4 sm:p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base sm:text-lg font-medium text-gray-900">Rejection Reason</h3>
              <button 
                onClick={() => setShowRejectionModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            <div className="mb-4 p-3 sm:p-4 bg-gray-50 rounded">
              <p className="text-gray-700 text-xs sm:text-sm">{rejectionReason}</p>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setShowRejectionModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs sm:text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Inline Modal Implementation */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2">
          <div className="bg-white rounded-lg p-4 sm:p-6 max-w-md w-full mx-2 max-h-[90vh] overflow-y-auto relative">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-lg sm:text-xl"
            >
              ×
            </button>
            <h2 className="text-lg sm:text-xl font-bold mb-4">Apply for Leave</h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Employee ID</label>
                  <input
                    name="staffId"
                    value={formData.staffId}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md text-xs sm:text-sm"
                    placeholder="Enter staff ID (e.g., STF001)"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Leave Type</label>
                  <select
                    name="leaveType"
                    value={formData.leaveType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md text-xs sm:text-sm"
                    required
                  >
                    <option value="Casual">Casual Leave</option>
                    <option value="Sick">Sick Leave</option>
                    <option value="Other">Other Leave</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Start Date</label>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-md text-xs sm:text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">End Date</label>
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-md text-xs sm:text-sm"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Reason</label>
                  <input
                    type="text"
                    name="reason"
                    value={formData.reason}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md text-xs sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                  <input
                    type="text"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md text-xs sm:text-sm"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border rounded-md text-xs sm:text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-xs sm:text-sm"
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