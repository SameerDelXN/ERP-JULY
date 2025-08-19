'use client';
import { useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Lock, Loader2, CheckCircle } from 'lucide-react';

export default function ResetPasswordConfirmPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const Params = useParams();
  // const searchParams = useSearchParams();
  // const token = searchParams.get('token');
  // const userId = searchParams.get('id')
  const token = Params.token
  const userId = Params.id

  console.log(token, userId);
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log("token",token);
    
    // Client-side validation
    if (!password || !confirmPassword) {
      setMessage({ text: 'Please fill in all fields', type: 'error' });
      return;
    }
    
    if (password.length < 8) {
      setMessage({ text: 'Password must be at least 8 characters', type: 'error' });
      return;
    }

    if (password !== confirmPassword) {
      setMessage({ text: 'Passwords do not match', type: 'error' });
      return;
    }

    setIsLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          token, 
          newPassword: password ,
          userId
        }),
      });

      console.log("Body",JSON.stringify({ 
          token, 
          newPassword: password 
        }));
    
      const data = await response.json();

      console.log(data);
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to reset password');
      }

      setSuccess(true);
      setMessage({
        text: data.message || 'Password reset successfully! Redirecting to login...',
        type: 'success'
      });
      
      // Redirect after 3 seconds
      setTimeout(() => router.push('/login'), 3000);
    } catch (error) {
      console.error('Password reset error:', error);
      setMessage({
        text: error.message || 'Failed to reset password. Please try again.',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Invalid Token</h2>
          <p className="text-gray-600 mb-6">The password reset link is invalid or has expired.</p>
          <button
            onClick={() => router.push('/login')}
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md text-center">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Password Updated!</h2>
          <p className="text-gray-600 mb-6">You can now login with your new password</p>
          <div className="bg-green-50 text-green-800 p-4 rounded-md">
            {message.text}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-2 text-center">Set New Password</h1>
        <p className="text-gray-600 text-center mb-6">Create a strong, memorable password</p>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                placeholder="At least 8 characters"
              />
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                placeholder="Re-enter your password"
              />
            </div>
          </div>

          {message.text && (
            <div className={`rounded-lg p-4 ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
              <p className="text-sm">{message.text}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin h-5 w-5" />
                Updating...
              </>
            ) : (
              'Reset Password'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

// 'use client';
// import { useState } from 'react';
// import { useRouter, useParams } from 'next/navigation';
// import { Lock, Loader2, CheckCircle } from 'lucide-react';

// export default function ResetPasswordConfirmPage() {
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [message, setMessage] = useState({ text: '', type: '' });
//   const [success, setSuccess] = useState(false);
//   const router = useRouter();
//   const params = useParams();
//   const token = params.token;
//   const userId = params.id;

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     console.log("token", token);
    
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
//           newPassword: password,
//           userId
//         }),
//       });

//       console.log("Body", JSON.stringify({ 
//         token, 
//         newPassword: password 
//       }));
    
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
//     </div>
//   );
// }