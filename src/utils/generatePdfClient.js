// Client-side PDF generation for Vercel deployment
export async function generatePdfClient(htmlContent, filename) {
  try {
    // Option 1: Use window.print() for simple PDF generation
    if (typeof window !== 'undefined') {
      // Create a new window with the HTML content
      const printWindow = window.open('', '_blank');
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      
      // Wait for the content to load, then print
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
        }, 500);
      };
      
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Client-side PDF generation failed:', error);
    return false;
  }
}

// Alternative: Use jsPDF with html2canvas (requires additional dependencies)
export async function generatePdfWithJsPDF(htmlContent, filename) {
  try {
    // This would require installing: npm install jspdf html2canvas
    // For now, return the HTML for manual processing
    if (typeof window !== 'undefined') {
      // Create a blob and download as HTML file
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename || 'receipt.html';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('HTML download failed:', error);
    return false;
  }
}

// Function to detect if we're on Vercel deployment
export function isVercelDeployment() {
  return typeof window !== 'undefined' && 
         (window.location.hostname.includes('vercel.app') || 
          window.location.hostname.includes('.vercel.app'));
}

// Main function that chooses the appropriate PDF generation method
export async function generateReceiptPdf(receiptData, options = {}) {
  const { useClientSide = false, filename = 'receipt.html' } = options;
  
  if (useClientSide || isVercelDeployment()) {
    try {
      // Call the API to get HTML content
      const response = await fetch('/api/fee/receipts/pdf/vercel-route', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ receipt: receiptData }),
      });
      
      const result = await response.json();
      
      if (result.success && result.html) {
        // Generate PDF on client side
        const success = await generatePdfClient(result.html, result.filename);
        
        if (success) {
          return { success: true, message: 'PDF generated successfully' };
        } else {
          // Fallback to HTML download
          await generatePdfWithJsPDF(result.html, result.filename);
          return { success: true, message: 'HTML downloaded successfully' };
        }
      } else {
        throw new Error(result.error || 'Failed to generate PDF content');
      }
    } catch (error) {
      console.error('Client-side PDF generation failed:', error);
      return { success: false, error: error.message };
    }
  } else {
    // Use server-side PDF generation (for local development)
    try {
      const response = await fetch('/api/fee/receipts/pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ receipt: receiptData }),
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename || 'receipt.pdf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        return { success: true, message: 'PDF downloaded successfully' };
      } else {
        throw new Error('PDF generation failed');
      }
    } catch (error) {
      console.error('Server-side PDF generation failed:', error);
      return { success: false, error: error.message };
    }
  }
}
