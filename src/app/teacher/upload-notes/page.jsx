// components/NoteUpload.js
"use client"
import { useState } from 'react';
import { UploadCloud, FileText, Loader2 } from 'lucide-react';

export default function NoteUpload({ onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setFileName(selectedFile ? selectedFile.name : '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setIsUploading(true);
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('description', description);

    try {
      const response = await fetch('/api/upload-note', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        onUploadSuccess(data);
        setFile(null);
        setTitle('');
        setDescription('');
        setFileName('');
      }
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <div className="flex items-center mb-6">
        <div className="p-3 rounded-full bg-indigo-50 mr-4">
          <UploadCloud className="h-6 w-6 text-indigo-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Upload Notes</h2>
          <p className="text-gray-500">Share your study materials with the community</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            placeholder="Enter a descriptive title"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition min-h-[100px]"
            placeholder="Add a brief description of your notes"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            File
          </label>
          <label
            htmlFor="file"
            className={`flex flex-col items-center justify-center w-full p-6 border-2 border-dashed rounded-lg cursor-pointer ${file ? 'border-indigo-300 bg-indigo-50' : 'border-gray-300 hover:border-indigo-300 hover:bg-indigo-50'} transition`}
          >
            {file ? (
              <div className="flex items-center text-indigo-600">
                <FileText className="h-5 w-5 mr-2" />
                <span className="font-medium">{fileName}</span>
              </div>
            ) : (
              <div className="text-center">
                <UploadCloud className="mx-auto h-8 w-8 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">
                  <span className="font-medium text-indigo-600">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">
                  PDF, DOC, DOCX, TXT, PPT, PPTX (MAX. 10MB)
                </p>
              </div>
            )}
            <input
              id="file"
              type="file"
              onChange={handleFileChange}
              className="hidden"
              accept=".pdf,.doc,.docx,.txt,.ppt,.pptx"
              required
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={isUploading}
          className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${isUploading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition`}
        >
          {isUploading ? (
            <>
              <Loader2 className="animate-spin mr-2 h-4 w-4" />
              Uploading...
            </>
          ) : (
            'Upload Note'
          )}
        </button>
      </form>
    </div>
  );
}


// // components/NoteUpload.js
// "use client"
// import { useState } from 'react';
// import { UploadCloud, FileText, Loader2, Link2 } from 'lucide-react';

// export default function NoteUpload({ onUploadSuccess }) {
//   const [file, setFile] = useState(null);
//   const [title, setTitle] = useState('');
//   const [description, setDescription] = useState('');
//   const [link, setLink] = useState('');
//   const [isUploading, setIsUploading] = useState(false);
//   const [fileName, setFileName] = useState('');

//   const handleFileChange = (e) => {
//     const selectedFile = e.target.files[0];
//     setFile(selectedFile);
//     setFileName(selectedFile ? selectedFile.name : '');
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!file && !link) return;

//     setIsUploading(true);
    
//     const formData = new FormData();
//     if (file) formData.append('file', file);
//     formData.append('title', title);
//     formData.append('description', description);
//     formData.append('link', link);

//     try {
//       const response = await fetch('/api/upload-note', {
//         method: 'POST',
//         body: formData,
//       });

//       if (response.ok) {
//         const data = await response.json();
//         onUploadSuccess(data);
//         setFile(null);
//         setTitle('');
//         setDescription('');
//         setLink('');
//         setFileName('');
//       }
//     } catch (error) {
//       console.error('Upload failed:', error);
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   return (
//     <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md">
//       <div className="flex items-center mb-6">
//         <div className="p-3 rounded-full bg-indigo-50 mr-4">
//           <UploadCloud className="h-6 w-6 text-indigo-600" />
//         </div>
//         <div>
//           <h2 className="text-2xl font-bold text-gray-800">Upload Notes</h2>
//           <p className="text-gray-500">Share your study materials with the community</p>
//         </div>
//       </div>

//       <form onSubmit={handleSubmit} className="space-y-6">
//         <div className="space-y-2">
//           <label htmlFor="title" className="block text-sm font-medium text-gray-700">
//             Title
//           </label>
//           <input
//             id="title"
//             type="text"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
//             placeholder="Enter a descriptive title"
//             required
//           />
//         </div>

//         <div className="space-y-2">
//           <label htmlFor="description" className="block text-sm font-medium text-gray-700">
//             Description
//           </label>
//           <textarea
//             id="description"
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition min-h-[100px]"
//             placeholder="Add a brief description of your notes"
//           />
//         </div>

//         <div className="space-y-4">
//           <div className="space-y-2">
//             <label className="block text-sm font-medium text-gray-700">
//               File (or link)
//             </label>
//             <p className="text-xs text-gray-500 mb-2">
//               Upload a file or provide a link to Google Drive/Classroom
//             </p>
            
//             <div className="grid gap-4 md:grid-cols-2">
//               <div>
//                 <label
//                   htmlFor="file"
//                   className={`flex flex-col items-center justify-center w-full p-4 border-2 border-dashed rounded-lg cursor-pointer ${file ? 'border-indigo-300 bg-indigo-50' : 'border-gray-300 hover:border-indigo-300 hover:bg-indigo-50'} transition h-full`}
//                 >
//                   {file ? (
//                     <div className="flex items-center text-indigo-600">
//                       <FileText className="h-5 w-5 mr-2" />
//                       <span className="font-medium text-sm">{fileName}</span>
//                     </div>
//                   ) : (
//                     <div className="text-center">
//                       <UploadCloud className="mx-auto h-6 w-6 text-gray-400 mb-1" />
//                       <p className="text-sm text-gray-600">
//                         <span className="font-medium text-indigo-600">Upload file</span>
//                       </p>
//                     </div>
//                   )}
//                   <input
//                     id="file"
//                     type="file"
//                     onChange={handleFileChange}
//                     className="hidden"
//                     accept=".pdf,.doc,.docx,.txt,.ppt,.pptx"
//                   />
//                 </label>
//               </div>

//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <Link2 className="h-4 w-4 text-gray-400" />
//                 </div>
//                 <input
//                   type="url"
//                   value={link}
//                   onChange={(e) => setLink(e.target.value)}
//                   className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
//                   placeholder="https://drive.google.com/..."
//                 />
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="pt-2">
//           <button
//             type="submit"
//             disabled={isUploading || (!file && !link)}
//             className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${isUploading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition ${(!file && !link) ? 'opacity-50 cursor-not-allowed' : ''}`}
//           >
//             {isUploading ? (
//               <>
//                 <Loader2 className="animate-spin mr-2 h-4 w-4" />
//                 Uploading...
//               </>
//             ) : (
//               'Share Notes'
//             )}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }