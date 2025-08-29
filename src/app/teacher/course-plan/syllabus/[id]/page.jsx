// import React from 'react';

// const AddUnitToCourse = () => {
//   return (
//     <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
//       <h1 className="text-2xl font-bold mb-6 text-gray-800">
//        {` Add Unit to Course :`}
//       </h1>

//       <form className="space-y-4">
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Unit NO*:
//           </label>
//           <input
//             type="text"
//             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             placeholder="Enter unit number"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Unit Name*:
//           </label>
//           <input
//             type="text"
//             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             placeholder="Enter unit name"
//           />
//         </div>


//         <button
//           type="submit"
//           className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
//         >
//           SAVE
//         </button>
//       </form>
//     </div>
//   );
// };

// export default AddUnitToCourse;

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { ArrowLeft, Loader2, CheckCircle } from 'lucide-react';

const AddUnitToCourse = ({ courseId }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    unitNo: '',
    unitName: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setIsSuccess(false);

    if (!formData.unitNo.trim() || !formData.unitName.trim()) {
      toast.error('Please fill in all required fields');
      setIsSubmitting(false);
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Success state
      setIsSuccess(true);
      toast.success('Unit added successfully!');
      
      // Reset form after 2 seconds
      setTimeout(() => {
        setFormData({
          unitNo: '',
          unitName: '',
        });
        setIsSuccess(false);
        if (courseId) router.refresh();
      }, 2000);
    } catch (error) {
      toast.error('Failed to add unit. Please try again.');
      console.error('Error adding unit:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          {courseId ? 'Add Unit to Course' : 'Create New Unit'}
        </h1>
        {courseId && (
          <button
            onClick={() => router.back()}
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        )}
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="unitNo" className="block text-sm font-medium text-gray-700 mb-1">
            Unit Number*
          </label>
          <input
            id="unitNo"
            name="unitNo"
            type="text"
            value={formData.unitNo}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter unit number (e.g., 1, 2, 3)"
            disabled={isSubmitting || isSuccess}
          />
        </div>

        <div>
          <label htmlFor="unitName" className="block text-sm font-medium text-gray-700 mb-1">
            Unit Name*
          </label>
          <input
            id="unitName"
            name="unitName"
            type="text"
            value={formData.unitName}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter unit name"
            disabled={isSubmitting || isSuccess}
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting || isSuccess}
            className={`w-full flex justify-center items-center py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              isSuccess
                ? 'bg-green-100 text-green-800 focus:ring-green-500'
                : isSubmitting
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500'
            }`}
          >
            {isSuccess ? (
              <>
                <CheckCircle className="w-5 h-5 mr-2" />
                Success!
              </>
            ) : isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Unit'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddUnitToCourse;