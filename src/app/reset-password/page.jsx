// 'use client';

// import { useState } from 'react';
// import { useRouter, useSearchParams } from 'next/navigation';
// import { Lock, Loader2, CheckCircle } from 'lucide-react';

// export default function ResetPasswordConfirmPage() {
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [message, setMessage] = useState({ text: '', type: '' });
//   const [success, setSuccess] = useState(false);
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const token = searchParams.get('token');

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (password !== confirmPassword) {
//       setMessage({ text: 'Passwords do not match', type: 'error' });
//       return;
//     }

//     setIsLoading(true);
//     setMessage({ text: '', type: '' });

//     try {
//       // Simulate API call
//       await new Promise(resolve => setTimeout(resolve, 1500));
      
//       setSuccess(true);
//       setMessage({
//         text: 'Password reset successfully! Redirecting to login...',
//         type: 'success'
//       });
      
//       // Redirect after 3 seconds
//       setTimeout(() => router.push('/login'), 3000);
//     } catch (error) {
//       setMessage({
//         text: 'Failed to reset password. The link may have expired.',
//         type: 'error'
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   if (success) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
//         <div className="sm:mx-auto sm:w-full sm:max-w-md">
//           <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10 text-center">
//             <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
//             <h2 className="text-2xl font-bold text-gray-900 mb-2">Password Updated!</h2>
//             <p className="text-gray-600 mb-6">You can now login with your new password</p>
//             <div className="bg-green-50 text-green-800 p-4 rounded-md">
//               {message.text}
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
//       <div className="sm:mx-auto sm:w-full sm:max-w-md">
//         <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
//           Set New Password
//         </h2>
//         <p className="mt-2 text-center text-sm text-gray-600">
//           Create a new password for your account
//         </p>
//       </div>

//       <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
//         <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
//           <form className="space-y-6" onSubmit={handleSubmit}>
//             <input type="hidden" name="token" value={token} />
            
//             <div>
//               <label htmlFor="password" className="block text-sm font-medium text-gray-700">
//                 New Password
//               </label>
//               <div className="mt-1 relative rounded-md shadow-sm">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <Lock className="h-5 w-5 text-gray-400" />
//                 </div>
//                 <input
//                   id="password"
//                   name="password"
//                   type="password"
//                   required
//                   minLength={8}
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                   placeholder="Minimum 8 characters"
//                 />
//               </div>
//             </div>

//             <div>
//               <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
//                 Confirm Password
//               </label>
//               <div className="mt-1 relative rounded-md shadow-sm">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <Lock className="h-5 w-5 text-gray-400" />
//                 </div>
//                 <input
//                   id="confirmPassword"
//                   name="confirmPassword"
//                   type="password"
//                   required
//                   value={confirmPassword}
//                   onChange={(e) => setConfirmPassword(e.target.value)}
//                   className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                   placeholder="Re-enter your password"
//                 />
//               </div>
//             </div>

//             {message.text && (
//               <div
//                 className={`rounded-md p-4 ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}
//               >
//                 <p className="text-sm">{message.text}</p>
//               </div>
//             )}

//             <div>
//               <button
//                 type="submit"
//                 disabled={isLoading}
//                 className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
//               >
//                 {isLoading ? (
//                   <>
//                     <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
//                     Updating...
//                   </>
//                 ) : 'Reset Password'}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

// 'use client';
// import { Suspense, useState } from 'react';
// import { useRouter, useSearchParams } from 'next/navigation';
// import { Lock, Loader2, CheckCircle } from 'lucide-react';
// export const dynamic = 'force-dynamic';
// export default function ResetPasswordConfirmPage() {
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [message, setMessage] = useState({ text: '', type: '' });
//   const [success, setSuccess] = useState(false);
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const token = searchParams.get('token');
//   const userId = searchParams.get('id')

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     console.log("token",token);
    
//     // Client-side validation
//     if (!password || !confirmPassword) {
//       setMessage({ text: 'Please fill in all fields', type: 'error' });
//       return;
//     }
    
//     if (password.length < 8) {
//       setMessage({ text: 'Password must be at least 8 characters', type: 'error' });
//       return;
//     }

//     if (password !== confirmPassword) {
//       setMessage({ text: 'Passwords do not match', type: 'error' });
//       return;
//     }

//     setIsLoading(true);
//     setMessage({ text: '', type: '' });

//     try {
//       const response = await fetch('/api/auth/reset-password', {
//         method: 'PUT',
//         headers: { 
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ 
//           token, 
//           newPassword: password ,
//           userId
//         }),
//       });

//       console.log("Body",JSON.stringify({ 
//           token, 
//           newPassword: password 
//         }));
    
//       const data = await response.json();

//       console.log(data);
      
//       if (!response.ok) {
//         throw new Error(data.message || 'Failed to reset password');
//       }

//       setSuccess(true);
//       setMessage({
//         text: data.message || 'Password reset successfully! Redirecting to login...',
//         type: 'success'
//       });
      
//       // Redirect after 3 seconds
//       setTimeout(() => router.push('/login'), 3000);
//     } catch (error) {
//       console.error('Password reset error:', error);
//       setMessage({
//         text: error.message || 'Failed to reset password. Please try again.',
//         type: 'error'
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   if (!token) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white flex items-center justify-center p-4">
//         <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md text-center">
//           <h2 className="text-2xl font-bold text-gray-900 mb-2">Invalid Token</h2>
//           <p className="text-gray-600 mb-6">The password reset link is invalid or has expired.</p>
//           <button
//             onClick={() => router.push('/login')}
//             className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
//           >
//             Return to Login
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (success) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white flex items-center justify-center p-4">
//         <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md text-center">
//           <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
//           <h2 className="text-2xl font-bold text-gray-900 mb-2">Password Updated!</h2>
//           <p className="text-gray-600 mb-6">You can now login with your new password</p>
//           <div className="bg-green-50 text-green-800 p-4 rounded-md">
//             {message.text}
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <Suspense fallback={<div>Loading...</div>}>
//     <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white flex items-center justify-center p-4">
//       <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
//         <h1 className="text-2xl font-bold text-gray-800 mb-2 text-center">Set New Password</h1>
//         <p className="text-gray-600 text-center mb-6">Create a strong, memorable password</p>

//         <form className="space-y-6" onSubmit={handleSubmit}>
//           <div>
//             <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
//               New Password
//             </label>
//             <div className="relative">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <Lock className="h-5 w-5 text-gray-400" />
//               </div>
//               <input
//                 id="password"
//                 name="password"
//                 type="password"
//                 required
//                 minLength={8}
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
//                 placeholder="At least 8 characters"
//               />
//             </div>
//           </div>

//           <div>
//             <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
//               Confirm Password
//             </label>
//             <div className="relative">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <Lock className="h-5 w-5 text-gray-400" />
//               </div>
//               <input
//                 id="confirmPassword"
//                 name="confirmPassword"
//                 type="password"
//                 required
//                 value={confirmPassword}
//                 onChange={(e) => setConfirmPassword(e.target.value)}
//                 className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
//                 placeholder="Re-enter your password"
//               />
//             </div>
//           </div>

//           {message.text && (
//             <div className={`rounded-lg p-4 ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
//               <p className="text-sm">{message.text}</p>
//             </div>
//           )}

//           <button
//             type="submit"
//             disabled={isLoading}
//             className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
//           >
//             {isLoading ? (
//               <>
//                 <Loader2 className="animate-spin h-5 w-5" />
//                 Updating...
//               </>
//             ) : (
//               'Reset Password'
//             )}
//           </button>
//         </form>
//       </div>
//     </div></Suspense>
//   );
// }
import React from 'react'

const page = () => {
  return (
    <div>page</div>
  )
}

export default page
//sample2
