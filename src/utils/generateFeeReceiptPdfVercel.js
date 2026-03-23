import Handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';

// Register Handlebars helpers
Handlebars.registerHelper('add', function(value, addition) {
  return parseInt(value) + parseInt(addition);
});

Handlebars.registerHelper('len', function(array) {
  return array ? array.length : 0;
});

export async function generateFeeReceiptPDFVercel(receiptData) {
  try {
    console.log('Generating VERCEL PDF for receipt:', receiptData);
    
    // Format the data for template
    console.log('Raw receipt data:', JSON.stringify(receiptData, null, 2));
    
    const formattedData = {
      receiptNumber: receiptData.receiptNumber || 'N/A',
      date: receiptData.date ? new Date(receiptData.date).toLocaleDateString('en-IN') : new Date().toLocaleDateString('en-IN'),
      amountPaid: receiptData.amountPaid || 0,
      paymentMode: receiptData.paymentMode || 'N/A',
      remarks: receiptData.remarks || '-',
      amountInWords: numberToWords(receiptData.amountPaid || 0),
      componentPayments: receiptData.componentPayments || {},
      student: {
        fullName: receiptData.student?.fullName || 'N/A',
        studentId: receiptData.student?.studentId || 'N/A',
        programType: receiptData.student?.programType || 'N/A',
        branch: receiptData.student?.branch || 'N/A',
        currentYear: receiptData.student?.currentYear || 'N/A',
        prn: receiptData.student?.prn || 'N/A',
        gender: receiptData.student?.gender || 'N/A',
        dateOfBirth: receiptData.student?.dateOfBirth ? new Date(receiptData.student.dateOfBirth).toLocaleDateString('en-IN') : 'N/A',
        mobileNumber: receiptData.student?.mobileNumber || 'N/A',
        email: receiptData.student?.email || 'N/A',
        admissionYear: receiptData.student?.admissionYear || 'N/A',
        admissionType: receiptData.student?.admissionType || 'N/A',
        feesCategory: receiptData.student?.feesCategory || 'N/A',
        division: receiptData.student?.division || 'N/A'
      },
      feeStructure: receiptData.feeStructure || null
    };
    
    console.log('Formatted data for template:', JSON.stringify(formattedData, null, 2));
    
    // Calculate total due amount and balance
    const totalDueAmount = formattedData.feeStructure?.totalFees || 0;
    const amountPaid = formattedData.amountPaid || 0;
    const balanceAmount = Math.max(0, totalDueAmount - amountPaid);
    const paymentStatus = balanceAmount === 0 ? 'Paid' : 'Partial';
    
    // Add payment status information
    const formattedDataWithStatus = {
      ...formattedData,
      totalDueAmount: totalDueAmount,
      balanceAmount: balanceAmount,
      paymentStatus: paymentStatus
    };
    
    // Read DUAL HTML template - Use dynamic import for Vercel compatibility
    let templateContent;
    try {
      // Try to read from file system first
      const templatePath = path.join(process.cwd(), 'src', 'templates', 'feeReceiptDual.html');
      templateContent = fs.readFileSync(templatePath, 'utf8');
    } catch (error) {
      console.error('Template file not found, using fallback HTML template');
      templateContent = getFallbackTemplate();
    }
    
    console.log('Template content length:', templateContent.length);
    
    // Manual template replacement for debugging
    let html = templateContent;
    
    // For component-wise payments, show only paid components
    if (formattedDataWithStatus.feeStructure && formattedDataWithStatus.componentPayments) {
      console.log('Processing component-wise payments...');
      console.log('Fee structure:', formattedDataWithStatus.feeStructure);
      console.log('Component payments:', formattedDataWithStatus.componentPayments);
      let feeRows = '';
      let serialNumber = 1;
      let hasWelfareFees = false;
      let welfareTotal = 0;
      
      // Process student fees - only show paid ones
      if (formattedDataWithStatus.feeStructure.feesFromStudent && formattedDataWithStatus.feeStructure.feesFromStudent.length > 0) {
        formattedDataWithStatus.feeStructure.feesFromStudent.forEach((fee, index) => {
          console.log(`Checking student fee: ${fee.componentName}, paid: ${formattedDataWithStatus.componentPayments[fee.componentName]}`);
          // Only include this component if it was paid (amount > 0)
          if (formattedDataWithStatus.componentPayments[fee.componentName] > 0) {
            console.log(`Including paid student fee: ${fee.componentName} - ${formattedDataWithStatus.componentPayments[fee.componentName]}`);
            feeRows += `<tr>
                <td>${serialNumber++}</td>
                <td>${fee.componentName}</td>
                <td class="amount">${formattedDataWithStatus.componentPayments[fee.componentName]}</td>
            </tr>`;
          }
        });
      }
      
      // Process student welfare fees - only show paid ones
      if (formattedDataWithStatus.feeStructure.feesFromSocialWelfare && formattedDataWithStatus.feeStructure.feesFromSocialWelfare.length > 0) {
        formattedDataWithStatus.feeStructure.feesFromSocialWelfare.forEach((fee, index) => {
          console.log(`Checking welfare fee: ${fee.componentName}, paid: ${formattedDataWithStatus.componentPayments[fee.componentName]}`);
          // Only include this component if it was paid (amount > 0)
          if (formattedDataWithStatus.componentPayments[fee.componentName] > 0) {
            console.log(`Including paid welfare fee: ${fee.componentName} - ${formattedDataWithStatus.componentPayments[fee.componentName]}`);
            hasWelfareFees = true;
            welfareTotal += parseFloat(formattedDataWithStatus.componentPayments[fee.componentName] || 0);
            feeRows += `<tr>
                <td>${serialNumber++}</td>
                <td>${fee.componentName} (Student Welfare)</td>
                <td class="amount">${formattedDataWithStatus.componentPayments[fee.componentName]}</td>
            </tr>`;
          }
        });
      }
      
      console.log('Generated component-wise fee rows:', feeRows);
      console.log('Has welfare fees:', hasWelfareFees, 'Total:', welfareTotal);
      
      // Replace placeholder with actual rows - Replace BOTH copies
      html = html.replace(/<!-- FEE_ROWS_PLACEHOLDER -->/g, feeRows);
      
      // Replace total with actual amount paid - Replace BOTH copies
      html = html.replace(/<!-- TOTAL_FEES_PLACEHOLDER -->/g, formattedDataWithStatus.amountPaid);
      
    } else if (formattedDataWithStatus.feeStructure) {
      console.log('Processing fee structure...');
      let feeRows = '';
      let serialNumber = 1;
      let hasWelfareFees = false;
      let welfareTotal = 0;
      
      // Process student fees
      if (formattedDataWithStatus.feeStructure.feesFromStudent && formattedDataWithStatus.feeStructure.feesFromStudent.length > 0) {
        formattedDataWithStatus.feeStructure.feesFromStudent.forEach((fee, index) => {
          console.log(`Processing student fee ${index + 1}:`, fee);
          feeRows += `<tr>
              <td>${serialNumber++}</td>
              <td>${fee.componentName}</td>
              <td class="amount">${fee.amount}</td>
          </tr>`;
        });
      }
      
      // Process student welfare fees
      if (formattedDataWithStatus.feeStructure.feesFromSocialWelfare && formattedDataWithStatus.feeStructure.feesFromSocialWelfare.length > 0) {
        hasWelfareFees = true;
        formattedDataWithStatus.feeStructure.feesFromSocialWelfare.forEach((fee, index) => {
          console.log(`Processing welfare fee ${index + 1}:`, fee);
          welfareTotal += parseFloat(fee.amount || 0);
          feeRows += `<tr>
              <td>${serialNumber++}</td>
              <td>${fee.componentName} (Student Welfare)</td>
              <td class="amount">${fee.amount}</td>
          </tr>`;
        });
      }
      
      console.log('Generated fee rows:', feeRows);
      console.log('Has welfare fees:', hasWelfareFees, 'Total:', welfareTotal);
      
      // Replace placeholder with actual rows - Replace BOTH copies
      html = html.replace(/<!-- FEE_ROWS_PLACEHOLDER -->/g, feeRows);
      
      // Replace total with total fees - Replace BOTH copies
      html = html.replace(/<!-- TOTAL_FEES_PLACEHOLDER -->/g, formattedDataWithStatus.feeStructure.totalFees);
      
    } else {
      console.log('No fee structure found, using fallback...');
      
      // Fallback - Replace BOTH copies
      html = html.replace(/<!-- FEE_ROWS_PLACEHOLDER -->/g, `<tr>
        <td>1</td>
        <td>Fee Payment</td>
        <td class="amount">${formattedData.amountPaid}</td>
      </tr>`);
      html = html.replace(/<!-- TOTAL_FEES_PLACEHOLDER -->/g, formattedData.amountPaid);
    }
    
    console.log('Generated HTML length:', html.length);
    
    // Compile template with data (for other replacements)
    const template = Handlebars.compile(html);
    html = template(formattedDataWithStatus);
    
    // For Vercel, we'll return HTML and let the frontend handle PDF generation
    // or use a service like Puppeteer Cloud
    return {
      html: html,
      filename: `receipt-${receiptData.receiptNumber || 'unknown'}-dual.html`
    };
    
  } catch (error) {
    console.error('Error generating VERCEL PDF:', error);
    throw error;
  }
}

// Number to Words Function for Indian Currency
function numberToWords(num) {
  const a = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten'];
  const b = ['', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const c = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  
  if (num === 0) return 'Zero';
  
  if (num < 10) return a[num];
  if (num < 20) return b[num - 10];
  if (num < 100) {
    const tens = Math.floor(num / 10);
    const ones = num % 10;
    return c[tens] + (ones > 0 ? ' ' + a[ones] : '');
  }
  
  if (num < 1000) {
    const hundreds = Math.floor(num / 100);
    const remainder = num % 100;
    return a[hundreds] + ' Hundred' + (remainder > 0 ? ' ' + numberToWords(remainder) : '');
  }
  
  if (num < 100000) {
    const thousands = Math.floor(num / 1000);
    const remainder = num % 1000;
    return numberToWords(thousands) + ' Thousand' + (remainder > 0 ? ' ' + numberToWords(remainder) : '');
  }
  
  if (num < 10000000) {
    const lakhs = Math.floor(num / 100000);
    const remainder = num % 100000;
    return numberToWords(lakhs) + ' Lakh' + (remainder > 0 ? ' ' + numberToWords(remainder) : '');
  }
  
  return num.toString();
}

// Fallback template for Vercel when file system is not available
function getFallbackTemplate() {
  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Fee Receipt - Dual Copy</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            margin: 0; 
            padding: 20px; 
            background: #fff;
        }
        .receipt-container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 20px;
            border: 2px solid #333;
        }
        .header { 
            text-align: center; 
            margin-bottom: 20px; 
            border-bottom: 2px solid #333;
            padding-bottom: 10px;
        }
        .header h2 { 
            margin: 0; 
            color: #333;
            font-size: 24px;
        }
        .receipt-info { 
            margin-bottom: 15px; 
            display: flex;
            justify-content: space-between;
        }
        .student-info { 
            margin-bottom: 15px; 
        }
        .fee-table { 
            width: 100%; 
            border-collapse: collapse; 
            margin-bottom: 15px; 
        }
        .fee-table th, .fee-table td { 
            border: 1px solid #333; 
            padding: 8px; 
            text-align: left; 
        }
        .fee-table th { 
            background-color: #f2f2f2; 
            font-weight: bold;
        }
        .amount { 
            text-align: right; 
            font-weight: bold;
        }
        .total { 
            font-weight: bold; 
            background-color: #f2f2f2;
        }
        .footer { 
            margin-top: 20px; 
            border-top: 1px solid #333;
            padding-top: 10px;
        }
        .copy-separator {
            border-top: 3px dashed #333;
            margin: 30px 0;
            padding-top: 20px;
        }
        .copy-label {
            text-align: center;
            font-weight: bold;
            margin-bottom: 10px;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="receipt-container">
        <!-- Copy 1 -->
        <div class="copy-label">OFFICE COPY</div>
        <div class="header">
            <h2>FEE RECEIPT</h2>
        </div>
        
        <div class="receipt-info">
            <div>
                <p><strong>Receipt Number:</strong> {{receiptNumber}}</p>
                <p><strong>Date:</strong> {{date}}</p>
                <p><strong>Payment Mode:</strong> {{paymentMode}}</p>
            </div>
            <div>
                <p><strong>Student ID:</strong> {{student.studentId}}</p>
                <p><strong>PRN:</strong> {{student.prn}}</p>
            </div>
        </div>
        
        <div class="student-info">
            <p><strong>Student Name:</strong> {{student.fullName}}</p>
            <p><strong>Program:</strong> {{student.programType}} - {{student.branch}}</p>
            <p><strong>Year:</strong> {{student.currentYear}}</p>
        </div>
        
        <table class="fee-table">
            <thead>
                <tr>
                    <th>Sr. No.</th>
                    <th>Particulars</th>
                    <th class="amount">Amount (₹)</th>
                </tr>
            </thead>
            <tbody>
                <!-- FEE_ROWS_PLACEHOLDER -->
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="2" class="total">Total Amount Paid:</td>
                    <td class="amount total">₹<!-- TOTAL_FEES_PLACEHOLDER --></td>
                </tr>
            </tfoot>
        </table>
        
        <div class="footer">
            <p><strong>Amount in Words:</strong> {{amountInWords}} Rupees Only</p>
            <p><strong>Remarks:</strong> {{remarks}}</p>
        </div>
        
        <!-- Copy 2 -->
        <div class="copy-separator"></div>
        <div class="copy-label">STUDENT COPY</div>
        <div class="header">
            <h2>FEE RECEIPT</h2>
        </div>
        
        <div class="receipt-info">
            <div>
                <p><strong>Receipt Number:</strong> {{receiptNumber}}</p>
                <p><strong>Date:</strong> {{date}}</p>
                <p><strong>Payment Mode:</strong> {{paymentMode}}</p>
            </div>
            <div>
                <p><strong>Student ID:</strong> {{student.studentId}}</p>
                <p><strong>PRN:</strong> {{student.prn}}</p>
            </div>
        </div>
        
        <div class="student-info">
            <p><strong>Student Name:</strong> {{student.fullName}}</p>
            <p><strong>Program:</strong> {{student.programType}} - {{student.branch}}</p>
            <p><strong>Year:</strong> {{student.currentYear}}</p>
        </div>
        
        <table class="fee-table">
            <thead>
                <tr>
                    <th>Sr. No.</th>
                    <th>Particulars</th>
                    <th class="amount">Amount (₹)</th>
                </tr>
            </thead>
            <tbody>
                <!-- FEE_ROWS_PLACEHOLDER -->
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="2" class="total">Total Amount Paid:</td>
                    <td class="amount total">₹<!-- TOTAL_FEES_PLACEHOLDER --></td>
                </tr>
            </tfoot>
        </table>
        
        <div class="footer">
            <p><strong>Amount in Words:</strong> {{amountInWords}} Rupees Only</p>
            <p><strong>Remarks:</strong> {{remarks}}</p>
        </div>
    </div>
</body>
</html>
  `;
}
