"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  X,
  Save,
  Search,
  FileText,
  LayoutDashboard,
  CreditCard,
  Filter,
  DollarSign,
  TrendingUp,
  Users,
  AlertCircle,
  Lock,
  Edit,
  Download
} from "lucide-react";
import ExportButton from "@/components/ExportButton";
import Card from "@/components/Card";
import StatsCard from "@/components/StatsCard";
import { useSession } from "@/context/SessionContext";

export default function AccountantFeeStructurePage() {
  const { user } = useSession();
  const [activeTab, setActiveTab] = useState("payments");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingStructure, setEditingStructure] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Filter States
  const [filterDepartment, setFilterDepartment] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [receiptAmounts, setReceiptAmounts] = useState({});

  // Data States
  const [existingFeeStructures, setExistingFeeStructures] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  const [yearList, setYearList] = useState([]);
  const [paymentRecords, setPaymentRecords] = useState([]);

  // Form States
  const [formData, setFormData] = useState({
    programType: "",
    department: "",
    year: "",
    semester: "",
    feeType: "",
    amount: "",
    dueDate: "",
    description: "",
  });

  const [programTypes, setProgramTypes] = useState([]);

  // For API compatibility - transform form data
  const transformFormDataForAPI = (formData) => {
    return {
      course: 'B.E.',
      category: formData.feeType || 'General',
      class: formData.semester || '1st Year',
      department: formData.department,
      fee: {
        tuitionFee: parseInt(formData.amount) || 0,
        libraryFee: 0,
        developmentFee: 0,
        examFee: 0
      }
    };
  };

  useEffect(() => {
    fetchFeeStructures();
    fetchDepartments();
    fetchProgramTypes();
    if (activeTab === "payments") {
      fetchPaymentRecords();
    }
  }, [activeTab]);

  const fetchProgramTypes = async () => {
    try {
      const response = await fetch("/api/program-types");
      const data = await response.json();
      if (data.success) {
        setProgramTypes(data.programTypes || []);
      }
    } catch (error) {
      console.error("Error fetching program types:", error);
    }
  };

  const fetchFeeStructures = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/fee/feestructure");
      const data = await response.json();
      if (data.success) {
        setExistingFeeStructures(data.feeStructures || []);
      }
    } catch (error) {
      console.error("Error fetching fee structures:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await fetch("/api/department");
      const data = await response.json();
      if (data.departments) {
        setDepartmentData(data.departments);
      }
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  const filteredDepartments = formData.programType
    ? departmentData.filter(dept => dept.programType === formData.programType)
    : [];

  // Update year list when department changes
  useEffect(() => {
    if (formData.department) {
      const dept = departmentData.find(d => d.department === formData.department);
      if (dept) {
        setYearList(dept.years || []);
      }
    } else {
      setYearList([]);
    }
  }, [formData.department, departmentData]);

  const fetchYears = async () => {
    try {
      const response = await fetch("/api/fee/feestructure");
      const data = await response.json();
      if (data.success && data.feeStructures) {
        // Extract unique years from fee structures
        const uniqueYears = [...new Set(data.feeStructures.map(structure => structure.year).filter(Boolean))];
        const yearData = uniqueYears.map((year, index) => ({
          _id: `year-${index}`,
          year: year
        }));
        setYearList(yearData);
      }
    } catch (error) {
      console.error("Error fetching years:", error);
    }
  };

  const fetchPaymentRecords = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/payments");
      const data = await response.json();
      if (data.success) {
        setPaymentRecords(data.data);
      }
    } catch (error) {
      console.error("Error fetching payment records:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      
      // Use the correct API endpoint for fee structures
      const url = editingStructure
        ? `/api/fee/feestructure?id=${editingStructure._id}`
        : "/api/fee/feestructure";
      const method = editingStructure ? "PUT" : "POST";

      // Transform form data to match the new API format
      const apiData = {
        programType: formData.programType,
        departmentName: formData.department,
        year: formData.year,
        caste: "general",
        category: formData.feeType || "regular",
        yearWiseFeeStructure: "annual",
        scholarshipParticular: "none",
        feesFromStudent: [
          {
            componentName: formData.feeType || "Tuition Fee",
            amount: parseFloat(formData.amount) || 0,
            collectionOrder: 1,
            displayOrder: 1
          }
        ],
        feesFromSocialWelfare: []
      };

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(apiData),
      });

      const data = await response.json();
      if (data.success) {
        fetchFeeStructures();
        fetchYears(); // Refresh years after adding new structure
        setShowAddForm(false);
        setShowEditForm(false);
        setEditingStructure(null);
        setFormData({
          programType: "",
          department: "",
          year: "",
          semester: "",
          feeType: "",
          amount: "",
          dueDate: "",
          description: "",
        });
      } else {
        alert(data.error || data.message || "Operation failed");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (structure) => {
    setEditingStructure(structure);
    // Transform API data back to form format
    setFormData({
      programType: structure.programType || "",
      department: structure.departmentName || "",
      year: structure.year || "",
      semester: structure.year || "",
      feeType: structure.category || "",
      amount: structure.feesFromStudent?.[0]?.amount?.toString() || "0",
      dueDate: "", // API doesn't have due date
      description: "", // API doesn't have description
    });
    setShowEditForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this fee structure?")) return;
    try {
      const response = await fetch(`/api/fee/feestructure?id=${id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (data.success) {
        fetchFeeStructures();
        fetchYears(); // Refresh years after deletion
      } else {
        alert(data.error || "Delete failed");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error deleting fee structure");
    }
  };

  const downloadReceipt = async (payment) => {
    try {
      console.log('Starting receipt download for payment:', payment);

      // If it is already a generated receipt in our table, download it directly!
      if (payment.receiptNumber) {
        const downloadKey = `downloading_${payment._id}`;
        if (window[downloadKey]) {
          console.log('Download already in progress for receipt:', payment._id);
          return;
        }
        window[downloadKey] = true;

        const downloadUrl = `/api/fee/receipts/pdf?receiptId=${payment._id}`;
        console.log('Direct Download URL:', downloadUrl);

        try {
          const response = await fetch(downloadUrl);
          const blob = await response.blob();
          const link = document.createElement('a');
          const url = window.URL.createObjectURL(blob);
          link.href = url;
          link.download = `Receipt-${payment.receiptNumber}.pdf`;
          link.style.display = 'none';
          document.body.appendChild(link);
          link.click();

          setTimeout(() => {
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            delete window[downloadKey];
          }, 200);
        } catch (err) {
          console.error('Download failed:', err);
          delete window[downloadKey];
          alert('Failed to download receipt');
        }
        return;
      }
      
      // Get the custom amount for this specific payment
      const customAmount = receiptAmounts[payment._id];
      const amountToUse = customAmount && customAmount.trim() !== '' ? parseFloat(customAmount) : null;
      
      if (amountToUse && (isNaN(amountToUse) || amountToUse <= 0)) {
        alert('Please enter a valid amount greater than 0');
        return;
      }
      
      // Prevent double downloads with stronger protection
      const downloadKey = `downloading_${payment._id}`;
      if (window[downloadKey]) {
        console.log('Download already in progress for payment:', payment._id);
        return;
      }
      
      window[downloadKey] = true;
      
      // First create a receipt for this payment
      const receiptResponse = await fetch('/api/fee/receipts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: payment._id,
          paymentMode: 'Cash', // Default payment mode
          remarks: amountToUse ? `Partial payment receipt - ₹${amountToUse}` : 'Full fee payment receipt',
          amountPaid: amountToUse
        })
      });
      
      const receiptData = await receiptResponse.json();
      console.log('Receipt creation response:', receiptData);
      
      if (receiptData.success) {
        // Create download link with relative URL
        const downloadUrl = `/api/fee/receipts/pdf?receiptId=${receiptData.receipt._id}`;
        console.log('Download URL:', downloadUrl);
        
        // Single download approach - fetch and create blob
        try {
          const response = await fetch(downloadUrl);
          const blob = await response.blob();
            
          // Create download link with blob for direct download only
          const link = document.createElement('a');
          const url = window.URL.createObjectURL(blob);
          link.href = url;
          link.download = `Receipt-${receiptData.receipt.receiptNumber}.pdf`;
          link.style.display = 'none';
          document.body.appendChild(link);
          link.click();
            
          // Clean up and clear flag with delay
          setTimeout(() => {
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            // Clear download flag after successful download
            delete window[downloadKey];
          }, 200);
          
          // Auto-clear flag after 5 seconds as backup
          setTimeout(() => {
            delete window[downloadKey];
          }, 5000);
            
        } catch (blobError) {
          console.error('Download failed:', blobError);
          // Clear download flag on error
          delete window[downloadKey];
          alert('Failed to download receipt');
        }
          
      } else {
        // Clear download flag on error
        delete window[downloadKey];
        alert('Failed to generate receipt: ' + (receiptData.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error downloading receipt:', error);
      // Clear download flag on exception
      delete window[downloadKey];
      alert('Failed to download receipt');
    }
  };

  const handlePaymentStatusChange = async (payment, newStatus) => {
    try {
      // Update the payment status in the local state first for immediate UI feedback
      const updatedPayments = paymentRecords.map(p => 
        p._id === payment._id ? { ...p, status: newStatus } : p
      );
      setPaymentRecords(updatedPayments);

      // No automatic receipt generation - just update the status
      console.log(`Payment status updated to ${newStatus} for ${payment.studentName}`);
      
    } catch (error) {
      console.error('Error updating payment status:', error);
      alert('Failed to update payment status');
      // Revert status on error
      const revertedPayments = paymentRecords.map(p => 
        p._id === payment._id ? { ...p, status: payment.status } : p
      );
      setPaymentRecords(revertedPayments);
    }
  };

  const filteredStructures = existingFeeStructures.filter((structure) => {
    const matchesSearch = structure.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         structure.departmentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         structure.programType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         structure.year?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = !filterDepartment || structure.departmentName === filterDepartment;
    const matchesYear = !filterYear || structure.year === filterYear;
    return matchesSearch && matchesDepartment && matchesYear;
  });

  const filteredPayments = paymentRecords.filter((payment) => {
    const matchesSearch = payment.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          payment.receiptNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          payment.generatedBy?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          payment.feeType?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Payment Records</h1>
        <p className="text-gray-500 text-sm">Manage and view payment records</p>
      </div>


      {activeTab === "payments" && (
        <>
          {/* Search for Payments */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search payments..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <ExportButton
              data={filteredPayments.map(p => ({
                StudentName: p.studentName,
                ReceiptNumber: p.receiptNumber || p.transactionId,
                Amount: p.amount,
                Date: p.paymentDate,
                Time: p.paymentTime || 'N/A',
                WhoGenerated: p.generatedBy || 'System',
                PaymentMode: p.paymentMode || 'Cash'
              }))}
              filename="Fee_Receipt_Report"
            />
          </div>

          {/* Payment Records Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Student Name</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Receipt Number</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Amount</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Date</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Time</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Who Generated</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Payment Mode</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredPayments.map((payment) => (
                    <tr key={payment._id} className="hover:bg-gray-50">
                      <td className="py-4 px-6">
                        <span className="text-sm text-gray-800 font-medium">{payment.studentName}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-sm text-gray-800">{payment.receiptNumber || payment.transactionId}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-sm font-bold text-green-600">₹{payment.amount}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-sm text-gray-800">{payment.paymentDate}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-sm text-gray-800">{payment.paymentTime || 'N/A'}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-sm font-medium text-blue-600">{payment.generatedBy || 'System'}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-sm text-gray-800">{payment.paymentMode || 'Cash'}</span>
                      </td>
                      <td className="py-4 px-6">
                        <button
                          onClick={() => downloadReceipt(payment)}
                          className="text-green-600 hover:text-green-800 flex items-center gap-1 bg-green-50 px-3 py-1.5 rounded-lg border border-green-200 transition-colors"
                          title="Download Receipt"
                        >
                          <Download size={14} />
                          <span className="text-xs font-semibold">Download</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

    </div>
  );
}
