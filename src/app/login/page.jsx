"use client";
import React, { useState } from "react";
import { User, Lock, UserCheck, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
const page = () => {

  const router = useRouter();

  const [selectedRole, setSelectedRole] = useState("Admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Login attempt:", { role: selectedRole, email, password });
    setError("");

     try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: selectedRole.toLowerCase(), email, password }),
      });
       const data = await res.json();
        
      if (res.ok) {
         if (data.user.role !== selectedRole.toLowerCase()) {
          console.log(data.user.role);
          
          console.log(selectedRole.toLowerCase());
          
          setError("Role mismatch. Please select the correct role.");
          return;
        }
        router.push(`/${data.user.role}`);
      } else {
        setError(data.message || "Login failed.");
      }
    } catch (err) {
      console.error("Login Error:", err);
      setError("Something went wrong.");
    }
  };    
  return (
    <>
      <div className="min-h-screen lg:flex bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600">
        {/* Left Side - Illustration */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="bg-white rounded-3xl p-8 max-w-md shadow-2xl">
            <div className="text-center mb-6">
              <div className="relative">
                {/* Illustration Background */}
                <div className="bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl p-8 mb-4">
                  {/* School Building */}
                  <div className="relative">
                    <div className="bg-indigo-600 w-32 h-20 mx-auto rounded-lg mb-4 relative overflow-hidden">
                      {/* Windows */}
                      <div className="absolute top-2 left-2 w-4 h-4 bg-yellow-300 rounded-sm"></div>
                      <div className="absolute top-2 right-2 w-4 h-4 bg-yellow-300 rounded-sm"></div>
                      <div className="absolute bottom-2 left-2 w-4 h-4 bg-yellow-300 rounded-sm"></div>
                      <div className="absolute bottom-2 right-2 w-4 h-4 bg-yellow-300 rounded-sm"></div>
                      {/* Door */}
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-8 bg-amber-600 rounded-t-lg"></div>
                    </div>

                    {/* People */}
                    <div className="flex justify-center space-x-4">
                      {/* Teacher */}
                      <div className="relative">
                        <div className="w-8 h-8 bg-purple-500 rounded-full mb-1"></div>
                        <div className="w-6 h-8 bg-gray-700 mx-auto rounded-sm"></div>
                      </div>
                      {/* Student */}
                      <div className="relative">
                        <div className="w-6 h-6 bg-pink-500 rounded-full mb-1"></div>
                        <div className="w-5 h-6 bg-indigo-500 mx-auto rounded-sm"></div>
                      </div>
                    </div>

                    {/* Documents floating */}
                    <div className="absolute -top-2 -right-4 transform rotate-12">
                      <div className="w-8 h-6 bg-white shadow-md rounded-sm border-l-4 border-purple-500"></div>
                    </div>
                    <div className="absolute top-8 -left-3 transform -rotate-12">
                      <div className="w-6 h-8 bg-white shadow-md rounded-sm border-l-4 border-indigo-500"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                SchoolERP Pro
              </h1>
              <p className="text-gray-600 text-sm">
                Smart, Efficient, Comprehensive School Management System
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Welcome Back
              </h2>
              <p className="text-gray-600">Select your access level</p>
            </div>

            {/* Role Selection */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <button
                onClick={() => setSelectedRole("Admin")}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  selectedRole === "Admin"
                    ? "bg-indigo-500 border-indigo-500 text-white shadow-lg"
                    : "border-gray-200 text-gray-600 hover:border-indigo-300"
                }`}
              >
                <Settings className="w-6 h-6 mx-auto mb-2" />
                <span className="font-medium">Admin</span>
              </button>

              <button
                onClick={() => setSelectedRole("Staff")}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  selectedRole === "Staff"
                    ? "bg-indigo-500 border-indigo-500 text-white shadow-lg"
                    : "border-gray-200 text-gray-600 hover:border-indigo-300"
                }`}
              >
                <UserCheck className="w-6 h-6 mx-auto mb-2" />
                <span className="font-medium">Staff</span>
              </button>
            </div>

            {/* Login Form */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Id
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-500 w-5 h-5" />
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={`${
                      selectedRole === "Admin" ? "Admin" : "Staff"
                    } Email Id`}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-500 w-5 h-5" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-gray-600">Remember me</span>
                </label>
                <a
                  href="#"
                  className="text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  Forgot Password?
                </a>
              </div>
               {error && <p className="text-red-600 text-sm text-center mb-3">{error}</p>}
              <button
                onClick={handleLogin}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold py-3 px-4 rounded-xl hover:from-indigo-600 hover:to-purple-700 transform hover:scale-[1.02] transition-all duration-200 shadow-lg"
              >
                Sign In
                <span className="ml-2">→</span>
              </button>
            </div>
            
            <div className="mt-6 text-center text-sm text-gray-600">
            Don't Have an account?{" "}
            <a
              href="/register"
              className="text-blue-600 hover:underline font-medium"
            >
              Sign up
            </a>
          </div>

            <div className="mt-6 text-center">
              <p className="text-gray-600 text-sm">
                Need help? Contact{" "}
                <a
                  href="#"
                  className="text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  IT Support
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default page;
