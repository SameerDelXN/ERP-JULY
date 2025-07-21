"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {use} from 'react'
import { useRouter } from 'next/navigation';
import html2pdf from 'html2pdf.js';

export default function GeneratePayslip({ params }) {
  const { employeeId } = use(params);
  const router = useRouter();
  const [employee, setEmployee] = useState(null);
  const [payslip, setPayslip] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [isGenerating, setIsGenerating] = useState(false);

  // Fetch employee and payslip data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch employee details
        const empRes = await fetch(`/api/hr/staff`);
        const empData = await empRes.json();
        console.log("employee data",empData)
        
        if (!empData.success) {
          throw new Error(empData.error || 'Failed to fetch employee');
        }
        
        setEmployee(empData.data);
        
        // Fetch payslip if exists
        const payslipRes = await fetch(`/api/hr/payslip/${employeeId}`);
        const payslipData = await payslipRes.json();
        console.log("payslipData", payslipData)
        
        if (payslipData.success) {
          // Filter payslip by selected month and year
          const filtered = payslipData.data.find(p => 
            p.month.toLowerCase() === new Date(year, month - 1).toLocaleString('default', { month: 'long' }).toLowerCase() &&
            p.year === year
          );
          setPayslip(filtered || null);
        }
      } catch (error) {
        setError(error.message);
        setEmployee(null)
        setPayslip(null)
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [employeeId, month, year]);

  const handleGeneratePayslip = async () => {
    try {
      setIsGenerating(true);
      const res = await fetch(`/api/hr/payslip/${employeeId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ month, year }),
      });
      
      const data = await res.json();
      
      if (data.success) {
        setPayslip(data.data);
      } else {
        throw new Error(data.error || 'Failed to generate payslip');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGeneratePDF = () => {
    const element = document.getElementById('payslip-to-print');
    const opt = {
      margin: 10,
      filename: `payslip_${employee?.staffId}_${month}_${year}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().from(element).set(opt).save();
  };

  console.log(employee)

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 text-red-600">
          {error}
          <button 
            onClick={() => router.back()} 
            className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 text-gray-900">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Generate Payslip</h1>
        
        {/* Employee Info */}
        {employee && (
          <div className="mb-8 p-4 border border-gray-200 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Employee Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Staff ID</p>
                <p className="font-medium">{employee.staffId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium">{employee.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Department</p>
                <p className="font-medium">{employee.department}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Position</p>
                <p className="font-medium">{employee.position}</p>
              </div>
            </div>
          </div>
        )}

        {/* Month/Year Selection */}
        <div className="mb-8 p-4 border border-gray-200 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Select Period</h2>
          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
              <select
                value={month}
                onChange={(e) => setMonth(parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <option key={m} value={m}>
                    {new Date(year, m - 1).toLocaleString('default', { month: 'long' })}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
              <select
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              >
                {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button
            onClick={handleGeneratePayslip}
            disabled={isGenerating}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
          >
            {isGenerating ? 'Generating...' : 'Generate Payslip'}
          </button>
        </div>

        {/* Payslip Display */}
        {payslip && (
          <div className="mb-8">
            <div id="payslip-to-print" className="p-6 border border-gray-200 rounded-lg">
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold">PAYSLIP</h2>
                <p className="text-gray-600">
                  {payslip.month} {payslip.year}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="font-semibold">Employee ID:</p>
                  <p>{employee.staffId}</p>
                </div>
                <div>
                  <p className="font-semibold">Employee Name:</p>
                  <p>{employee.name}</p>
                </div>
                <div>
                  <p className="font-semibold">Department:</p>
                  <p>{employee.department}</p>
                </div>
                <div>
                  <p className="font-semibold">Date of Issue:</p>
                  <p>{new Date(payslip.dateOfIssue).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="font-semibold border-b border-gray-300 pb-2 mb-2">Earnings</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Basic Salary:</span>
                      <span>{payslip.earnings.basic.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>HRA:</span>
                      <span>{payslip.earnings.hra.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>DA:</span>
                      <span>{payslip.earnings.da.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Special Allowance:</span>
                      <span>{payslip.earnings.specialAllowance.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Bonus:</span>
                      <span>{payslip.earnings.bonus.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-semibold border-t border-gray-300 pt-2 mt-2">
                      <span>Total Earnings:</span>
                      <span>{payslip.grossEarnings.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold border-b border-gray-300 pb-2 mb-2">Deductions</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>PF:</span>
                      <span>{payslip.deductions.pf.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>TDS:</span>
                      <span>{payslip.deductions.tds.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Loan:</span>
                      <span>{payslip.deductions.loan.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Leave:</span>
                      <span>{payslip.deductions.leave.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Other:</span>
                      <span>{payslip.deductions.other.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-semibold border-t border-gray-300 pt-2 mt-2">
                      <span>Total Deductions:</span>
                      <span>{payslip.totalDeductions.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center p-4 bg-gray-100 rounded-lg">
                <span className="font-bold text-lg">Net Salary:</span>
                <span className="font-bold text-lg">{payslip.netSalary.toFixed(2)}</span>
              </div>

              <div className="mt-4 text-right">
                <p className="text-sm text-gray-600">Payment Status: {payslip.paymentStatus}</p>
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => router.back()}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleGeneratePDF}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Done (Generate PDF)
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}