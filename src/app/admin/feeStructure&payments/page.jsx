"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, Trash2, X, Save, Search, FileText } from "lucide-react";

export default function FeeStructurePage() {
  const [formData, setFormData] = useState({
    programType: "",
    departmentName: "",
    year: "",
    caste: "",
    fees: [],
    totalFees: 0,
  });

  const [feeItem, setFeeItem] = useState({ type: "", feeName: "", amount: "" });
  const [departmentData, setDepartmentData] = useState([]);
  const [yearList, setYearList] = useState([]);
  const [existingFeeStructures, setExistingFeeStructures] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("structures");

  // Refs for input fields to maintain focus
  const feeTypeRef = useRef(null);
  const amountRef = useRef(null);

  const [casteList] = useState([
    { id: "general", name: "General" },
    { id: "obc", name: "OBC" },
    { id: "sc", name: "SC" },
    { id: "st", name: "ST" },
    { id: "ews", name: "EWS" },
  ]);

  // Fetch existing fee structures
  useEffect(() => {
    const loadFeeStructures = async () => {
      try {
        const res = await fetch("/api/fee/feestructure");
        const data = await res.json();
        if (data.success && data.feeStructures) {
          setExistingFeeStructures(data.feeStructures);
        }
      } catch (err) {
        console.error("Error loading fee structures:", err);
      }
    };
    loadFeeStructures();
  }, []);

  // Fetch departments
  useEffect(() => {
    const loadDepartments = async () => {
      try {
        const res = await fetch("/api/department");
        const data = await res.json();
        if (data.departments) {
          setDepartmentData(data.departments);
        }
      } catch (err) {
        console.error("Error loading departments:", err);
      }
    };
    loadDepartments();
  }, []);

  // Auto-load years when department selected
  useEffect(() => {
    if (formData.departmentName) {
      const dept = departmentData.find(
        (d) => d.department === formData.departmentName
      );
      if (dept) {
        setYearList(dept.years || []);
      }
    }
  }, [formData.departmentName, departmentData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFeeItemChange = (e) => {
    const { name, value } = e.target;
    setFeeItem(prev => ({ ...prev, [name]: value }));
  };

  const addFeeItem = () => {
    if (!feeItem.type || !feeItem.amount) {
      alert("Please enter fee type and amount");
      return;
    }

    const updatedFees = [...formData.fees, {
      feeName: feeItem.type,
      amount: feeItem.amount,
      type: feeItem.type,
    }];

    const total = updatedFees.reduce(
      (sum, item) => sum + parseFloat(item.amount || 0),
      0
    );

    setFormData((prev) => ({
      ...prev,
      fees: updatedFees,
      totalFees: total,
    }));

    // Store current focus state
    const isFeeTypeFocused = document.activeElement === feeTypeRef.current;
    const isAmountFocused = document.activeElement === amountRef.current;

    setFeeItem({ type: "", feeName: "", amount: "" });

    // Restore focus after state update
    setTimeout(() => {
      if (isFeeTypeFocused && feeTypeRef.current) {
        feeTypeRef.current.focus();
      } else if (isAmountFocused && amountRef.current) {
        amountRef.current.focus();
      } else if (feeTypeRef.current) {
        feeTypeRef.current.focus();
      }
    }, 0);
  };

  const removeFeeItem = (index) => {
    const updatedFees = formData.fees.filter((_, i) => i !== index);
    const total = updatedFees.reduce(
      (sum, item) => sum + parseFloat(item.amount || 0),
      0
    );

    setFormData((prev) => ({
      ...prev,
      fees: updatedFees,
      totalFees: total,
    }));
  };

  const handleSubmit = async () => {
    if (
      !formData.programType ||
      !formData.departmentName ||
      !formData.year ||
      formData.fees.length === 0
    ) {
      alert("Please fill all required fields");
      return;
    }

    setIsLoading(true);

    const feesToSend = formData.fees.map((f) => ({
      feeName: f.feeName,
      amount: parseFloat(f.amount),
    }));

    const payload = {
      ...formData,
      fees: feesToSend,
    };

    try {
      const res = await fetch("/api/fee/feestructure", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        alert("Fee structure saved!");
        setFormData({
          programType: "",
          departmentName: "",
          year: "",
          caste: "",
          fees: [],
          totalFees: 0,
        });
        setShowAddForm(false);
        
        // Refresh the list
        const refreshRes = await fetch("/api/fee/feestructure");
        const refreshData = await refreshRes.json();
        if (refreshData.success && refreshData.feeStructures) {
          setExistingFeeStructures(refreshData.feeStructures);
        }
      } else {
        alert(data.error || "Failed to save fee structure");
      }
    } catch (err) {
      console.error(err);
      alert("Error occurred");
    }

    setIsLoading(false);
  };

  const deleteFeeStructure = async (id) => {
    if (!confirm("Are you sure you want to delete this fee structure?")) {
      return;
    }

    try {
      const res = await fetch(`/api/fee/feestructure?id=${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success) {
        alert("Fee structure deleted!");
        setExistingFeeStructures(existingFeeStructures.filter(f => f._id !== id));
      } else {
        alert(data.error || "Failed to delete");
      }
    } catch (err) {
      console.error(err);
      alert("Error occurred");
    }
  };

  // Filter structures based on search
  const filteredStructures = existingFeeStructures.filter((structure) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      structure.departmentName?.toLowerCase().includes(searchLower) ||
      structure.programType?.toLowerCase().includes(searchLower) ||
      structure.year?.toLowerCase().includes(searchLower) ||
      structure.caste?.toLowerCase().includes(searchLower)
    );
  });

  const AddFeeStructureModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-medium text-gray-900">Add New Fee Structure</h2>
          <button
            onClick={() => setShowAddForm(false)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Program Type *
              </label>
              <select
                name="programType"
                value={formData.programType}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="">Select Program Type</option>
                {departmentData.map((d) => (
                  <option key={d._id} value={d.programType}>
                    {d.programType}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department Name *
              </label>
              <select
                name="departmentName"
                value={formData.departmentName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="">Select Department</option>
                {departmentData.map((d) => (
                  <option key={d._id} value={d.department}>
                    {d.department}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Year *
              </label>
              <select
                name="year"
                value={formData.year}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="">Select Year</option>
                {yearList.map((y, index) => (
                  <option key={index} value={y.year}>
                    {y.year}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Caste
              </label>
              <select
                name="caste"
                value={formData.caste}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="">Select Caste</option>
                {casteList.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Add Fee Type & Amount *
              </label>

              <div className="flex gap-2">
                <input
                  ref={feeTypeRef}
                  type="text"
                  name="type"
                  placeholder="Fee type (e.g., Tuition, Lab)"
                  value={feeItem.type}
                  onChange={handleFeeItemChange}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />

                <input
                  ref={amountRef}
                  type="number"
                  name="amount"
                  placeholder="Amount"
                  value={feeItem.amount}
                  onChange={handleFeeItemChange}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      addFeeItem();
                    }
                  }}
                  className="w-32 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />

                <button
                  type="button"
                  onClick={addFeeItem}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  Add
                </button>
              </div>

              <div className="mt-3 space-y-2">
                {formData.fees.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center bg-gray-50 p-3 border border-gray-200 rounded-lg"
                  >
                    <span className="text-sm text-gray-900">
                      {item.feeName} — ₹{item.amount}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeFeeItem(index)}
                      className="text-red-500 text-sm hover:text-red-700 font-medium"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {formData.totalFees > 0 && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-gray-700 font-medium mb-2">Total Fee Breakdown:</p>

              <ul className="space-y-1 text-sm text-gray-700 mb-3">
                {formData.fees.map((f, i) => (
                  <li key={i}>
                    • {f.type}: ₹{parseFloat(f.amount).toLocaleString()}
                  </li>
                ))}
              </ul>

              <p className="font-bold text-lg text-blue-600">
                Total Fees: ₹{formData.totalFees.toLocaleString()}
              </p>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm font-medium ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? (
                <span>Processing...</span>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Fee Structure</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6 overflow-hidden">
          <div className="flex border-b border-gray-100">
            <button
              onClick={() => setActiveTab("structures")}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all duration-200 ${
                activeTab === "structures"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Fee Structures</span>
              <span className="ml-1 bg-gray-100 text-gray-600 rounded-full px-2 py-0.5 text-xs">
                {existingFeeStructures.length}
              </span>
            </button>
          </div>

          <div className="p-6">
            {activeTab === "structures" && (
              <div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <div className="relative flex-1 max-w-md w-full">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search fee structures..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full text-sm transition-all duration-200"
                    />
                  </div>

                  <button
                    onClick={() => setShowAddForm(true)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md w-full sm:w-auto justify-center"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Fee Structure</span>
                  </button>
                </div>

                {filteredStructures.length === 0 ? (
                  <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-2 text-gray-400">
                      <FileText className="w-12 h-12 text-gray-300" />
                      <p className="text-sm font-medium">No fee structures found</p>
                      {searchTerm ? (
                        <button
                          onClick={() => setSearchTerm("")}
                          className="text-blue-600 text-xs hover:underline mt-2"
                        >
                          Clear search
                        </button>
                      ) : (
                        <p className="text-xs text-gray-400">Click "Add Fee Structure" to create one</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full divide-y divide-gray-100">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Program Type
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Department Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Year
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Caste
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Total Fees
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                          {filteredStructures.map((structure) => (
                            <tr
                              key={structure._id}
                              className="hover:bg-gray-50 transition-colors"
                            >
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                  {structure.programType}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                  {structure.departmentName}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                  {structure.year}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                  {structure.caste ? structure.caste.toUpperCase() : 'General'}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                  ₹{structure.totalFees?.toLocaleString()}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button
                                  onClick={() => deleteFeeStructure(structure._id)}
                                  className="text-gray-400 hover:text-red-600 transition-colors p-1 rounded-full hover:bg-red-50"
                                  title="Delete"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Modal */}
      {showAddForm && <AddFeeStructureModal />}
    </div>
  );
}