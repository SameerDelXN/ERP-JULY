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
  const router = useRouter();
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
    const re =
      /^(?=.*[a-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,}$/;
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
      setPasswordError(
        "Password must be at least 8 characters"
      );
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

  // const handelForgotPassword = () =>{
  //   router.push('/forgot-password')
  // }

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await login(email, password, selectedRole);
      console.log(result);

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
          <div
            className="absolute top-0 left-0 w-full h-full"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>
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
              <div
                className="absolute -bottom-2 -left-4 w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg animate-bounce"
                style={{ animationDelay: "0.5s" }}
              >
                <Users className="w-6 h-6 text-white" />
              </div>
              <div
                className="absolute top-8 -left-8 w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center shadow-lg animate-bounce"
                style={{ animationDelay: "1s" }}
              >
                <Database className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-gray-800 mb-3">
            Enterprise Resource Planning
          </h1>
          <p className="text-gray-600 leading-relaxed text-sm">
            Streamline your business operations with our comprehensive ERP
            solution. Manage everything from inventory to finance in one
            integrated platform.
          </p>

          {/* Feature Points */}
          <div className="mt-6 space-y-2 text-left">
            {[
              "Real-time business insights",
              "Integrated workflow management",
              "Advanced security & compliance",
              "24/7 technical support",
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
            <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Access Level
              </label>

              <div className="grid grid-cols-3 gap-2">
                {[
                  {
                    role: "admin",
                    label: "Administrator",
                    icon: Settings,
                  },
                  // {
                  //   role: "hod",
                  //   label: "HOD",
                  //   icon: UserCheck,
                  // },
                  {
                    role: "staff",
                    label: "Staff Member",
                    icon: UserCheck,
                  },
                  {
                    role: "teacher",
                    label: "Teacher Member",
                    icon: User,
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
                <User
                  className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                    focusedField === "email" ? "text-blue-500" : "text-gray-400"
                  }`}
                />
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
                <Lock
                  className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                    focusedField === "password"
                      ? "text-blue-500"
                      : "text-gray-400"
                  }`}
                />
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
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {passwordError && (
                <p className="mt-1 text-sm text-red-600">{passwordError}</p>
              )}
            </div>

            {/* Login Button */}
            <button
              type="submit"
              
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
            </form>

            {/* Additional Options */}
            <div className="text-center pt-3">
              <a
                href="/forgot-password"
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
