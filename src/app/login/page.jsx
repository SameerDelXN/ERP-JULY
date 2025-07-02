
"use client";

// import React, { useState } from "react";
// import {
//   User,
//   Lock,
//   Eye,
//   EyeOff,
//   Settings,
//   UserCheck,
//   ArrowRight,
//   Sparkles,
//   Shield,
//   Zap,
// } from "lucide-react";
// import Image from "next/image";
// import { useRouter } from "next/navigation";

// const Login = () => {
//   const [focusedField, setFocusedField] = useState("");
//   const [selectedRole, setSelectedRole] = useState("Admin");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();

//   const handleLogin = async (e) => {
//     setLoading(true);
//     e.preventDefault();
//     console.log("Login attempt:", { role: selectedRole, email, password });
//     setError("");

//     try {
//       const res = await fetch("/api/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           role: selectedRole.toLowerCase(),
//           email,
//           password,
//         }),
//       });
//       const data = await res.json();

//       if (res.ok) {
//         if (data.user.role !== selectedRole.toLowerCase()) {
//           console.log(data.user.role);

//           console.log(selectedRole.toLowerCase());

//           setError("Role mismatch. Please select the correct role.");
//           return;
//         }
//         router.push(`/${data.user.role}`);
//       } else {
//         setError(data.message || "Login failed.");
//       }
//     } catch (err) {
//       console.error("Login Error:", err);
//       setError("Something went wrong.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading)
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <Image
//           src="/loading.svg"
//           alt="Loading..."
//           width={300}
//           height={300}
//           className="mb-4"
//         />
//         {/* <Loader/> */}
//       </div>
//     );

//   if (error)
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="p-6 text-red-600">Error: {error}</div>
//       </div>
//     );

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 relative overflow-hidden">
//       {/* Animated Background Elements */}
//       <div className="absolute inset-0 overflow-hidden">
//         <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
//         <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
//         <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
//       </div>

//       {/* Floating particles */}
//       <div className="absolute inset-0">
//         {[...Array(20)].map((_, i) => (
//           <div
//             key={i}
//             className="absolute w-2 h-2 bg-white rounded-full opacity-20 animate-float"
//             style={{
//               left: `${Math.random() * 100}%`,
//               top: `${Math.random() * 100}%`,
//               animationDelay: `${Math.random() * 5}s`,
//               animationDuration: `${3 + Math.random() * 4}s`,
//             }}
//           />
//         ))}
//       </div>

//       <div className="relative z-10 flex min-h-screen">
//         {/* Left Panel - Login Form */}
//         <div className="flex-1 flex items-center justify-center p-8">
//           <div className="w-full max-w-md">
//             {/* Glassmorphism container */}
//             <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl">
//               {/* Logo/Title */}
//               <div className="text-center mb-8">
//                 <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl mb-4 shadow-lg">
//                   <Shield className="w-8 h-8 text-white" />
//                 </div>
//                 <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
//                   Welcome Back
//                 </h1>
//                 <p className="text-purple-200/80 text-sm">
//                   Sign in to access your dashboard
//                 </p>
//               </div>

//               {error && (
//                 <div className="mb-6 p-4 bg-red-500/20 border border-red-400/30 rounded-xl text-red-200 text-sm animate-shake">
//                   {error}
//                 </div>
//               )}

//               <div className="space-y-6">
//                 {/* Role Selection */}
//                 <div>
//                   <label className="block text-sm font-medium text-purple-200/80 mb-3">
//                     Select Role
//                   </label>
//                   <div className="grid grid-cols-2 gap-3">
//                     {[
//                       {
//                         role: "Admin",
//                         icon: Settings,
//                         color: "from-purple-500 to-indigo-600",
//                       },
//                       {
//                         role: "Staff",
//                         icon: UserCheck,
//                         color: "from-pink-500 to-purple-600",
//                       },
//                     ].map(({ role, icon: Icon, color }) => (
//                       <button
//                         key={role}
//                         type="button"
//                         onClick={() => setSelectedRole(role.toLowerCase())}
//                         className={`group relative p-4 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
//                           selectedRole === role.toLowerCase()
//                             ? `bg-gradient-to-br ${color} border-white/30 text-white shadow-xl`
//                             : "border-white/20 text-white/70 hover:border-white/40 hover:bg-white/5"
//                         }`}
//                       >
//                         <Icon className="w-6 h-6 mx-auto mb-2" />
//                         <span className="font-medium text-sm">{role}</span>
//                         {selectedRole === role.toLowerCase() && (
//                           <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/20 to-transparent opacity-50"></div>
//                         )}
//                       </button>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Email Field */}
//                 <div className="space-y-2">
//                   <label className="block text-sm font-medium text-purple-200/80">
//                     Email Address
//                   </label>
//                   <div className="relative group">
//                     <User
//                       className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-200 ${
//                         focusedField === "email"
//                           ? "text-purple-300"
//                           : "text-purple-400/60"
//                       }`}
//                     />
//                     <input
//                       type="email"
//                       value={email}
//                       onChange={(e) => setEmail(e.target.value)}
//                       onFocus={() => setFocusedField("email")}
//                       onBlur={() => setFocusedField("")}
//                       placeholder={`Enter ${selectedRole.toLowerCase()} email`}
//                       className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-purple-300/60 focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 outline-none transition-all duration-200 backdrop-blur-sm hover:bg-white/15"
//                       required
//                     />
//                     <div
//                       className={`absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-400/20 to-pink-400/20 opacity-0 transition-opacity duration-200 pointer-events-none ${
//                         focusedField === "email" ? "opacity-100" : ""
//                       }`}
//                     ></div>
//                   </div>
//                 </div>

//                 {/* Password Field */}
//                 <div className="space-y-2">
//                   <label className="block text-sm font-medium text-purple-200/80">
//                     Password
//                   </label>
//                   <div className="relative group">
//                     <Lock
//                       className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-200 ${
//                         focusedField === "password"
//                           ? "text-purple-300"
//                           : "text-purple-400/60"
//                       }`}
//                     />
//                     <input
//                       type={showPassword ? "text" : "password"}
//                       value={password}
//                       onChange={(e) => setPassword(e.target.value)}
//                       onFocus={() => setFocusedField("password")}
//                       onBlur={() => setFocusedField("")}
//                       placeholder="Enter your password"
//                       className="w-full pl-12 pr-12 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-purple-300/60 focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 outline-none transition-all duration-200 backdrop-blur-sm hover:bg-white/15"
//                       required
//                     />
//                     <button
//                       type="button"
//                       onClick={() => setShowPassword(!showPassword)}
//                       className="absolute right-4 top-1/2 transform -translate-y-1/2 text-purple-400/60 hover:text-purple-300 transition-colors duration-200"
//                     >
//                       {showPassword ? (
//                         <EyeOff className="w-5 h-5" />
//                       ) : (
//                         <Eye className="w-5 h-5" />
//                       )}
//                     </button>
//                     <div
//                       className={`absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-400/20 to-pink-400/20 opacity-0 transition-opacity duration-200 pointer-events-none ${
//                         focusedField === "password" ? "opacity-100" : ""
//                       }`}
//                     ></div>
//                   </div>
//                 </div>

//                 {/* Login Button */}
//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="group relative w-full py-4 px-6 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 hover:from-purple-600 hover:via-pink-600 hover:to-purple-700 text-white font-semibold rounded-2xl shadow-xl transform transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none overflow-hidden"
//                 >
//                   <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//                   <div className="relative flex items-center justify-center">
//                     {loading ? (
//                       <>
//                         <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
//                         Authenticating...
//                       </>
//                     ) : (
//                       <>
//                         Sign In
//                         <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
//                       </>
//                     )}
//                   </div>
//                 </button>

//                 {/* Additional Options */}
//                 <div className="text-center pt-4">
//                   <a
//                     href="#"
//                     className="text-sm text-purple-300/80 hover:text-white transition-colors duration-200 hover:underline"
//                   >
//                     Forgot your password?
//                   </a>
//                 </div>
//               </div>
//               {/* Login Form */}
//             </div>
//           </div>
//         </div>

//         {/* Right Panel - Feature Showcase */}
//         <div className="hidden lg:flex flex-1 items-center justify-center p-8">
//           <div className="max-w-lg text-center">
//             <Image src="/login6.jpg" alt="login" width={900} height={900} />
//           </div>
//         </div>
//       </div>

//       <style jsx>{`
//         @keyframes blob {
//           0% {
//             transform: translate(0px, 0px) scale(1);
//           }
//           33% {
//             transform: translate(30px, -50px) scale(1.1);
//           }
//           66% {
//             transform: translate(-20px, 20px) scale(0.9);
//           }
//           100% {
//             transform: translate(0px, 0px) scale(1);
//           }
//         }
//         @keyframes float {
//           0%,
//           100% {
//             transform: translateY(0px);
//           }
//           50% {
//             transform: translateY(-20px);
//           }
//         }
//         @keyframes shake {
//           0%,
//           100% {
//             transform: translateX(0);
//           }
//           25% {
//             transform: translateX(-5px);
//           }
//           75% {
//             transform: translateX(5px);
//           }
//         }
//         .animate-blob {
//           animation: blob 7s infinite;
//         }
//         .animation-delay-2000 {
//           animation-delay: 2s;
//         }
//         .animation-delay-4000 {
//           animation-delay: 4s;
//         }
//         .animate-float {
//           animation: float 3s ease-in-out infinite;
//         }
//         .animate-shake {
//           animation: shake 0.5s ease-in-out;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default Login;

// import React, { useState } from "react";
// import {
//   User,
//   Lock,
//   Eye,
//   EyeOff,
//   Settings,
//   UserCheck,
//   ArrowRight,
//   Sparkles,
//   Shield,
//   Zap,
//   Building2,
//   BarChart3,
//   Users,
//   Database,
// } from "lucide-react";
// import Image from "next/image";
// import { useRouter } from "next/navigation";
// const Login = () => {
//   const [focusedField, setFocusedField] = useState("");
//   const [selectedRole, setSelectedRole] = useState("Admin");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();

//   const handleLogin = async (e) => {
//     setLoading(true);
//     e.preventDefault();
//     setError("");

//     try {
//       const res = await fetch("/api/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           role: selectedRole.toLowerCase(),
//           email,
//           password,
//         }),
//       });
//       const data = await res.json();

//       if (res.ok) {
//         if (data.user.role !== selectedRole.toLowerCase()) {
//           console.log(data.user.role);

//           console.log(selectedRole.toLowerCase());

//           setError("Role mismatch. Please select the correct role.");
//           return;
//         }
//         router.push(`/${data.user.role}`);
//       } else {
//         setError(data.message || "Login failed.");
//       }
//     } catch (err) {
//       console.error("Login Error:", err);
//       setError("Something went wrong.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading)
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <Image
//           src="/loading.svg"
//           alt="Loading..."
//           width={300}
//           height={300}
//           className="mb-4"
//         />
//         {/* <Loader/> */}
//       </div>
//     );

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 relative overflow-hidden">
//       {/* Enhanced Background Elements */}
//       <div className="absolute inset-0 overflow-hidden">
//         {/* Primary gradient orbs */}
//         <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-indigo-400 to-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
//         <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-purple-500 to-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
//         <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob animation-delay-4000"></div>

//         {/* Additional accent orbs */}
//         <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-indigo-300 to-purple-400 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-pulse"></div>
//         <div className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-br from-purple-300 to-indigo-400 rounded-full mix-blend-multiply filter blur-2xl opacity-25 animate-pulse animation-delay-1000"></div>
//       </div>

//       {/* Animated grid pattern */}
//       <div className="absolute inset-0 opacity-5">
//         <div
//           className="absolute inset-0"
//           style={{
//             backgroundImage: `
//             linear-gradient(rgba(79, 70, 229, 0.1) 1px, transparent 1px),
//             linear-gradient(90deg, rgba(79, 70, 229, 0.1) 1px, transparent 1px)
//           `,
//             backgroundSize: "50px 50px",
//           }}
//         ></div>
//       </div>

//       {/* Floating particles */}
//       <div className="absolute inset-0">
//         {[...Array(30)].map((_, i) => (
//           <div
//             key={i}
//             className={`absolute rounded-full opacity-20 animate-float ${
//               i % 3 === 0
//                 ? "bg-indigo-400"
//                 : i % 3 === 1
//                 ? "bg-purple-400"
//                 : "bg-white"
//             }`}
//             style={{
//               width: `${2 + Math.random() * 4}px`,
//               height: `${2 + Math.random() * 4}px`,
//               left: `${Math.random() * 100}%`,
//               top: `${Math.random() * 100}%`,
//               animationDelay: `${Math.random() * 5}s`,
//               animationDuration: `${4 + Math.random() * 6}s`,
//             }}
//           />
//         ))}
//       </div>

//       <div className="relative z-10 flex min-h-screen">
//         {/* Left Panel - Login Form */}
//         <div className="flex-1 flex items-center justify-center p-8">
//           <div className="w-full max-w-md">
//             {/* Enhanced Glassmorphism container */}
//             <div className="backdrop-blur-2xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
//               {/* Gradient border effect */}
//               <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-indigo-500/20 opacity-50 blur-sm"></div>
//               <div className="absolute inset-[1px] rounded-3xl bg-slate-950/60 backdrop-blur-2xl"></div>

//               <div className="relative z-10">
//                 {/* Logo/Title */}
//                 <div className="text-center mb-8">
//                   <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-600 rounded-3xl mb-6 shadow-2xl relative overflow-hidden">
//                     <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
//                     <Building2 className="w-10 h-10 text-white relative z-10" />
//                   </div>
//                   <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-300 via-purple-300 to-indigo-300 bg-clip-text text-transparent mb-3 tracking-tight">
//                     Welcome Back
//                   </h1>
//                   <p className="text-slate-300 text-sm font-medium">
//                     ERP Learning Portal
//                   </p>
//                 </div>

//                 {error && (
//                   <div className="mb-6 p-4 bg-red-500/10 border border-red-400/20 rounded-2xl text-red-300 text-sm animate-shake backdrop-blur-sm">
//                     <div className="flex items-center">
//                       <div className="w-2 h-2 bg-red-400 rounded-full mr-2"></div>
//                       {error}
//                     </div>
//                   </div>
//                 )}

//                 <div className="space-y-6">
//                   {/* Role Selection */}
//                   <div>
//                     <label className="block text-sm font-semibold text-slate-300 mb-4">
//                       Access Level
//                     </label>
//                     <div className="grid grid-cols-2 gap-3">
//                       {[
//                         {
//                           role: "admin",
//                           label: "Administrator",
//                           icon: Settings,
//                           gradient: "from-indigo-500 to-purple-600",
//                         },
//                         {
//                           role: "staff",
//                           label: "Staff Member",
//                           icon: UserCheck,
//                           gradient: "from-purple-500 to-indigo-600",
//                         },
//                       ].map(({ role, label, icon: Icon, gradient }) => (
//                         <button
//                           key={role}
//                           type="button"
//                           onClick={() => setSelectedRole(role)}
//                           className={`group relative p-4 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
//                             selectedRole === role
//                               ? `bg-gradient-to-br ${gradient} border-white/20 text-white shadow-xl`
//                               : "border-white/10 text-slate-300 hover:border-white/20 hover:bg-white/5"
//                           }`}
//                         >
//                           {selectedRole === role && (
//                             <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/20 to-transparent"></div>
//                           )}
//                           <Icon className="w-6 h-6 mx-auto mb-2 relative z-10" />
//                           <span className="font-medium text-sm relative z-10">
//                             {label}
//                           </span>
//                         </button>
//                       ))}
//                     </div>
//                   </div>

//                   {/* Email Field */}
//                   <div className="space-y-2">
//                     <label className="block text-sm font-semibold text-slate-300">
//                       Email Address
//                     </label>
//                     <div className="relative group">
//                       <User
//                         className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-200 ${
//                           focusedField === "email"
//                             ? "text-indigo-400"
//                             : "text-slate-400"
//                         }`}
//                       />
//                       <input
//                         type="email"
//                         value={email}
//                         onChange={(e) => setEmail(e.target.value)}
//                         onFocus={() => setFocusedField("email")}
//                         onBlur={() => setFocusedField("")}
//                         placeholder={`Enter your ${selectedRole} email`}
//                         className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-400/50 focus:border-indigo-400/50 outline-none transition-all duration-200 backdrop-blur-sm hover:bg-white/10"
//                         required
//                       />
//                       <div
//                         className={`absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-400/10 to-purple-400/10 opacity-0 transition-opacity duration-200 pointer-events-none ${
//                           focusedField === "email" ? "opacity-100" : ""
//                         }`}
//                       ></div>
//                     </div>
//                   </div>

//                   {/* Password Field */}
//                   <div className="space-y-2">
//                     <label className="block text-sm font-semibold text-slate-300">
//                       Password
//                     </label>
//                     <div className="relative group">
//                       <Lock
//                         className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-200 ${
//                           focusedField === "password"
//                             ? "text-indigo-400"
//                             : "text-slate-400"
//                         }`}
//                       />
//                       <input
//                         type={showPassword ? "text" : "password"}
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                         onFocus={() => setFocusedField("password")}
//                         onBlur={() => setFocusedField("")}
//                         placeholder="Enter your secure password"
//                         className="w-full pl-12 pr-12 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-400/50 focus:border-indigo-400/50 outline-none transition-all duration-200 backdrop-blur-sm hover:bg-white/10"
//                         required
//                       />
//                       <button
//                         type="button"
//                         onClick={() => setShowPassword(!showPassword)}
//                         className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-indigo-400 transition-colors duration-200"
//                       >
//                         {showPassword ? (
//                           <EyeOff className="w-5 h-5" />
//                         ) : (
//                           <Eye className="w-5 h-5" />
//                         )}
//                       </button>
//                       <div
//                         className={`absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-400/10 to-purple-400/10 opacity-0 transition-opacity duration-200 pointer-events-none ${
//                           focusedField === "password" ? "opacity-100" : ""
//                         }`}
//                       ></div>
//                     </div>
//                   </div>

//                   {/* Enhanced Login Button */}
//                   <button
//                     onClick={handleLogin}
//                     disabled={loading}
//                     className="group relative w-full py-4 px-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:via-purple-500 hover:to-indigo-500 text-white font-semibold rounded-2xl shadow-2xl transform transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none overflow-hidden"
//                   >
//                     <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/10 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//                     <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer"></div>
//                     <div className="relative flex items-center justify-center">
//                       {loading ? (
//                         <>
//                           <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
//                           Authenticating...
//                         </>
//                       ) : (
//                         <>
//                           <Shield className="w-5 h-5 mr-3" />
//                           Access ERP System
//                           <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform duration-200" />
//                         </>
//                       )}
//                     </div>
//                   </button>

//                   {/* Additional Options */}
//                   <div className="text-center pt-4 space-y-2">
//                     <a
//                       href="#"
//                       className="block text-sm text-slate-400 hover:text-indigo-400 transition-colors duration-200 hover:underline"
//                     >
//                       Forgot your password?
//                     </a>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Right Panel - Enhanced Feature Showcase */}
//         <div className="hidden lg:flex flex-1 items-center justify-center p-8">
//           <div className="max-w-lg"></div>
//         </div>
//       </div>

//       <style jsx>{`
//         @keyframes blob {
//           0%,
//           100% {
//             transform: translate(0px, 0px) scale(1);
//           }
//           33% {
//             transform: translate(30px, -50px) scale(1.1);
//           }
//           66% {
//             transform: translate(-20px, 20px) scale(0.9);
//           }
//         }
//         @keyframes float {
//           0%,
//           100% {
//             transform: translateY(0px) rotate(0deg);
//           }
//           50% {
//             transform: translateY(-20px) rotate(180deg);
//           }
//         }
//         @keyframes shake {
//           0%,
//           100% {
//             transform: translateX(0);
//           }
//           25% {
//             transform: translateX(-5px);
//           }
//           75% {
//             transform: translateX(5px);
//           }
//         }
//         @keyframes shimmer {
//           0% {
//             transform: translateX(-100%);
//           }
//           100% {
//             transform: translateX(100%);
//           }
//         }
//         .animate-blob {
//           animation: blob 8s infinite;
//         }
//         .animation-delay-1000 {
//           animation-delay: 1s;
//         }
//         .animation-delay-2000 {
//           animation-delay: 2s;
//         }
//         .animation-delay-4000 {
//           animation-delay: 4s;
//         }
//         .animate-float {
//           animation: float 6s ease-in-out infinite;
//         }
//         .animate-shake {
//           animation: shake 0.5s ease-in-out;
//         }
//         .animate-shimmer {
//           animation: shimmer 2s infinite;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default Login;

// "use client";

// import React, { useState, useEffect } from "react";
// import {
//   User,
//   Lock,
//   Eye,
//   EyeOff,
//   Settings,
//   UserCheck,
//   ArrowRight,
//   Shield,
//   Building2,
//   Database,
//   BarChart3,
//   Users,
// } from "lucide-react";
// import Image from "next/image";
// import { useRouter } from "next/navigation";

// const Login = () => {
//   const [focusedField, setFocusedField] = useState("");
//   const [selectedRole, setSelectedRole] = useState("admin");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [particles, setParticles] = useState([]);
//   const router = useRouter();

//   // Initialize particles on client side only
//   useEffect(() => {
//     setParticles(
//       Array.from({ length: 30 }, () => ({
//         width: 2 + Math.random() * 4,
//         height: 2 + Math.random() * 4,
//         left: Math.random() * 100,
//         top: Math.random() * 100,
//         delay: Math.random() * 5,
//         duration: 4 + Math.random() * 6,
//         color: ["bg-indigo-400", "bg-purple-400", "bg-white"][Math.floor(Math.random() * 3)],
//       }))
//     );
//   }, []);

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     try {
//       const res = await fetch("/api/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           role: selectedRole,
//           email,
//           password,
//         }),
//       });
//       const data = await res.json();

//       if (res.ok) {
//         if (data.user.role !== selectedRole) {
//           setError("Role mismatch. Please select the correct role.");
//           return;
//         }
//         router.push(`/${data.user.role}`);
//       } else {
//         setError(data.message || "Login failed.");
//       }
//     } catch (err) {
//       console.error("Login Error:", err);
//       setError("Something went wrong.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <Image
//           src="/loading.svg"
//           alt="Loading..."
//           width={300}
//           height={300}
//           className="mb-4"
//         />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 relative overflow-hidden">
//       {/* Background Elements */}
//       <div className="absolute inset-0 overflow-hidden">
//         <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-indigo-400 to-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
//         <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-purple-500 to-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
//         <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob animation-delay-4000"></div>
//       </div>

//       {/* Floating particles - rendered only on client */}
//       {particles.length > 0 && (
//         <div className="absolute inset-0">
//           {particles.map((particle, i) => (
//             <div
//               key={i}
//               className={`absolute rounded-full opacity-20 animate-float ${particle.color}`}
//               style={{
//                 width: `${particle.width}px`,
//                 height: `${particle.height}px`,
//                 left: `${particle.left}%`,
//                 top: `${particle.top}%`,
//                 animationDelay: `${particle.delay}s`,
//                 animationDuration: `${particle.duration}s`,
//               }}
//             />
//           ))}
//         </div>
//       )}

//       <div className="relative z-10 flex min-h-screen">
//         {/* Login Form */}
//         <div className="flex-1 flex items-center justify-center p-8">
//           <div className="w-full max-w-md">
//             <div className="backdrop-blur-2xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
//               <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-indigo-500/20 opacity-50 blur-sm"></div>
//               <div className="absolute inset-[1px] rounded-3xl bg-slate-950/60 backdrop-blur-2xl"></div>

//               <div className="relative z-10">
//                 {/* Header */}
//                 <div className="text-center mb-8">
//                   <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-600 rounded-3xl mb-6 shadow-2xl relative overflow-hidden">
//                     <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
//                     <Building2 className="w-10 h-10 text-white relative z-10" />
//                   </div>
//                   <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-300 via-purple-300 to-indigo-300 bg-clip-text text-transparent mb-3 tracking-tight">
//                     Welcome Back
//                   </h1>
//                   <p className="text-slate-300 text-sm font-medium">
//                     ERP Learning Portal
//                   </p>
//                 </div>

//                 {error && (
//                   <div className="mb-6 p-4 bg-red-500/10 border border-red-400/20 rounded-2xl text-red-300 text-sm animate-shake backdrop-blur-sm">
//                     <div className="flex items-center">
//                       <div className="w-2 h-2 bg-red-400 rounded-full mr-2"></div>
//                       {error}
//                     </div>
//                   </div>
//                 )}

//                 <form onSubmit={handleLogin} className="space-y-6">
//                   {/* Role Selection */}
//                   <div>
//                     <label className="block text-sm font-semibold text-slate-300 mb-4">
//                       Access Level
//                     </label>
//                     <div className="grid grid-cols-2 gap-3">
//                       {[
//                         {
//                           role: "admin",
//                           label: "Administrator",
//                           icon: Settings,
//                           gradient: "from-indigo-500 to-purple-600",
//                         },
//                         {
//                           role: "staff",
//                           label: "Staff Member",
//                           icon: UserCheck,
//                           gradient: "from-purple-500 to-indigo-600",
//                         },
//                       ].map(({ role, label, icon: Icon, gradient }) => (
//                         <button
//                           key={role}
//                           type="button"
//                           onClick={() => setSelectedRole(role)}
//                           className={`group relative p-4 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
//                             selectedRole === role
//                               ? `bg-gradient-to-br ${gradient} border-white/20 text-white shadow-xl`
//                               : "border-white/10 text-slate-300 hover:border-white/20 hover:bg-white/5"
//                           }`}
//                         >
//                           {selectedRole === role && (
//                             <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/20 to-transparent"></div>
//                           )}
//                           <Icon className="w-6 h-6 mx-auto mb-2 relative z-10" />
//                           <span className="font-medium text-sm relative z-10">
//                             {label}
//                           </span>
//                         </button>
//                       ))}
//                     </div>
//                   </div>

//                   {/* Email Field */}
//                   <div className="space-y-2">
//                     <label className="block text-sm font-semibold text-slate-300">
//                       Email Address
//                     </label>
//                     <div className="relative group">
//                       <User
//                         className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-200 ${
//                           focusedField === "email"
//                             ? "text-indigo-400"
//                             : "text-slate-400"
//                         }`}
//                       />
//                       <input
//                         type="email"
//                         value={email}
//                         onChange={(e) => setEmail(e.target.value)}
//                         onFocus={() => setFocusedField("email")}
//                         onBlur={() => setFocusedField("")}
//                         placeholder={`Enter your ${selectedRole} email`}
//                         className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-400/50 focus:border-indigo-400/50 outline-none transition-all duration-200 backdrop-blur-sm hover:bg-white/10"
//                         required
//                       />
//                       <div
//                         className={`absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-400/10 to-purple-400/10 opacity-0 transition-opacity duration-200 pointer-events-none ${
//                           focusedField === "email" ? "opacity-100" : ""
//                         }`}
//                       ></div>
//                     </div>
//                   </div>

//                   {/* Password Field */}
//                   <div className="space-y-2">
//                     <label className="block text-sm font-semibold text-slate-300">
//                       Password
//                     </label>
//                     <div className="relative group">
//                       <Lock
//                         className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-200 ${
//                           focusedField === "password"
//                             ? "text-indigo-400"
//                             : "text-slate-400"
//                         }`}
//                       />
//                       <input
//                         type={showPassword ? "text" : "password"}
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                         onFocus={() => setFocusedField("password")}
//                         onBlur={() => setFocusedField("")}
//                         placeholder="Enter your secure password"
//                         className="w-full pl-12 pr-12 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-400/50 focus:border-indigo-400/50 outline-none transition-all duration-200 backdrop-blur-sm hover:bg-white/10"
//                         required
//                       />
//                       <button
//                         type="button"
//                         onClick={() => setShowPassword(!showPassword)}
//                         className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-indigo-400 transition-colors duration-200"
//                       >
//                         {showPassword ? (
//                           <EyeOff className="w-5 h-5" />
//                         ) : (
//                           <Eye className="w-5 h-5" />
//                         )}
//                       </button>
//                       <div
//                         className={`absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-400/10 to-purple-400/10 opacity-0 transition-opacity duration-200 pointer-events-none ${
//                           focusedField === "password" ? "opacity-100" : ""
//                         }`}
//                       ></div>
//                     </div>
//                   </div>

//                   {/* Login Button */}
//                   <button
//                     type="submit"
//                     disabled={loading}
//                     className="group relative w-full py-4 px-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:via-purple-500 hover:to-indigo-500 text-white font-semibold rounded-2xl shadow-2xl transform transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none overflow-hidden"
//                   >
//                     <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/10 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//                     <div className="relative flex items-center justify-center">
//                       {loading ? (
//                         <>
//                           <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
//                           Authenticating...
//                         </>
//                       ) : (
//                         <>
//                           <Shield className="w-5 h-5 mr-3" />
//                           Access ERP System
//                           <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform duration-200" />
//                         </>
//                       )}
//                     </div>
//                   </button>

//                   {/* Additional Options */}
//                   <div className="text-center pt-4 space-y-2">
//                     <a
//                       href="#"
//                       className="block text-sm text-slate-400 hover:text-indigo-400 transition-colors duration-200 hover:underline"
//                     >
//                       Forgot your password?
//                     </a>
//                   </div>
//                 </form>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <style jsx>{`
//         @keyframes blob {
//           0%,
//           100% {
//             transform: translate(0px, 0px) scale(1);
//           }
//           33% {
//             transform: translate(30px, -50px) scale(1.1);
//           }
//           66% {
//             transform: translate(-20px, 20px) scale(0.9);
//           }
//         }
//         @keyframes float {
//           0%,
//           100% {
//             transform: translateY(0px);
//           }
//           50% {
//             transform: translateY(-20px);
//           }
//         }
//         @keyframes shake {
//           0%,
//           100% {
//             transform: translateX(0);
//           }
//           25% {
//             transform: translateX(-5px);
//           }
//           75% {
//             transform: translateX(5px);
//           }
//         }
//         .animate-blob {
//           animation: blob 8s infinite;
//         }
//         .animation-delay-2000 {
//           animation-delay: 2s;
//         }
//         .animation-delay-4000 {
//           animation-delay: 4s;
//         }
//         .animate-float {
//           animation: float 6s ease-in-out infinite;
//         }
//         .animate-shake {
//           animation: shake 0.5s ease-in-out;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default Login;

"use client";

import React, { useState, useEffect } from "react";
import {
  User,
  Lock,
  Eye,
  EyeOff,
  Settings,
  UserCheck,
  ArrowRight,
  Building2,
  BarChart3,
  Users,
  Database,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "@/context/SessionContext";

const Login = () => {
  const router = useRouter()
  const { login } = useSession();
  const [focusedField, setFocusedField] = useState("");
  const [selectedRole, setSelectedRole] = useState("admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [formValid, setFormValid] = useState(false);

  // Validate email format
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  // Validate password (minimum 8 characters, at least one letter and one number)
  const validatePassword = (password) => {
    const re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return re.test(password);
  };

  // Validate form whenever email or password changes
  useEffect(() => {
    if (email && !validateEmail(email)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }

    if (password && !validatePassword(password)) {
      setPasswordError("Password must be at least 8 characters with at least one letter and one number");
    } else {
      setPasswordError("");
    }

    setFormValid(
      validateEmail(email) &&
      validatePassword(password) &&
      email.trim() !== "" &&
      password.trim() !== ""
    );
  }, [email, password]);

    const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
    const result = await login(email, password, selectedRole);
    console.log(result)
     
      if (!result.success) {
      setError(result.message || "Login failed.");
      setLoading(false);
    }
      
    } catch (err) {
      console.error("Login Error:", err);
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };


  if (loading) {
    return (
      <div className="h-screen bg-gray-50 flex items-center justify-center overflow-hidden">
        <div className="text-center">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Authenticating...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-white flex overflow-hidden">
      {/* Left Side - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-50 to-indigo-100 items-center justify-center relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full" 
               style={{
                 backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
               }}>
          </div>
        </div>

        <div className="relative z-10 max-w-sm text-center px-8">
          {/* Main Illustration */}
          <div className="mb-6">
            <div className="relative">
              {/* Central Building Icon */}
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-2xl shadow-lg mb-4 border border-gray-100">
                <Building2 className="w-10 h-10 text-blue-600" />
              </div>
              
              {/* Floating Icons */}
              <div className="absolute -top-2 -right-4 w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg animate-bounce">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -bottom-2 -left-4 w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg animate-bounce" style={{animationDelay: '0.5s'}}>
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="absolute top-8 -left-8 w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center shadow-lg animate-bounce" style={{animationDelay: '1s'}}>
                <Database className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-gray-800 mb-3">
            Enterprise Resource Planning
          </h1>
          <p className="text-gray-600 leading-relaxed text-sm">
            Streamline your business operations with our comprehensive ERP solution. 
            Manage everything from inventory to finance in one integrated platform.
          </p>

          {/* Feature Points */}
          <div className="mt-6 space-y-2 text-left">
            {[
              "Real-time business insights",
              "Integrated workflow management", 
              "Advanced security & compliance",
              "24/7 technical support"
            ].map((feature, index) => (
              <div key={index} className="flex items-center text-gray-700">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                <span className="text-xs">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-8 overflow-y-auto">
        <div className="w-full max-w-sm">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-600 rounded-xl mb-4 shadow-sm">
              <Building2 className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome Back
            </h2>
            <p className="text-gray-600">
              Sign in to access your ERP dashboard
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                {error}
              </div>
            </div>
          )}

          <div className="space-y-5">
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Access Level
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  {
                    role: "admin",
                    label: "Administrator",
                    icon: Settings,
                  },
                  {
                    role: "staff",
                    label: "Staff Member",
                    icon: UserCheck,
                  },
                ].map(({ role, label, icon: Icon }) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setSelectedRole(role)}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 text-center ${
                      selectedRole === role
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="w-4 h-4 mx-auto mb-1" />
                    <span className="font-medium text-xs">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <User className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                  focusedField === "email" ? "text-blue-500" : "text-gray-400"
                }`} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField("")}
                  placeholder={`Enter your ${selectedRole} email`}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                  required
                />
              </div>
              {emailError && (
                <p className="mt-1 text-sm text-red-600">{emailError}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                  focusedField === "password" ? "text-blue-500" : "text-gray-400"
                }`} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField("")}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-12 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors duration-200"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {passwordError && (
                <p className="mt-1 text-sm text-red-600">{passwordError}</p>
              )}
            </div>

            {/* Login Button */}
            <button
              onClick={handleLogin}
              disabled={!formValid || loading}
              className={`w-full py-2.5 px-4 bg-blue-600 text-white font-medium rounded-lg shadow-sm transition-all duration-200 flex items-center justify-center ${
                formValid && !loading
                  ? "hover:bg-blue-700 hover:shadow-md"
                  : "opacity-50 cursor-not-allowed"
              }`}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  Signing In...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </button>

            {/* Additional Options */}
            <div className="text-center pt-3">
              <a
                href="#"
                className="text-sm text-blue-600 hover:text-blue-700 hover:underline transition-colors duration-200"
              >
                Forgot your password?
              </a>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-gray-200 text-center text-xs text-gray-500">
            © 2025 ERP Learning Portal. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;