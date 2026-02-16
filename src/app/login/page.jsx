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
  Shield,
  Briefcase,
  ClipboardList,
  BookOpen,
  GraduationCap,
  UsersRound,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "@/context/SessionContext";
import Image from "next/image";

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

  // Dynamic Roles State
  const [availableRoles, setAvailableRoles] = useState([
    { role: "admin", label: "Admin", icon: Settings },
    { role: "superadmin", label: "Super Admin", icon: Shield },
    { role: "hod", label: "HOD", icon: Briefcase },
    { role: "staff", label: "Staff", icon: ClipboardList },
    { role: "teacher", label: "Teacher", icon: BookOpen },
    { role: "student", label: "Student", icon: GraduationCap },
    { role: "hr", label: "HR", icon: UsersRound },
  ]);

  // Icon mapping for dynamic roles
  const ROLE_ICONS_MAP = {
    admin: Settings,
    superadmin: Shield,
    hod: Briefcase,
    staff: ClipboardList,
    teacher: BookOpen,
    student: GraduationCap,
    hr: UsersRound,
  };

  const PRIORITY_ORDER = ["admin", "superadmin", "hod", "staff", "teacher", "student", "hr"];

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await fetch('/api/admin/roles');
        const data = await res.json();

        if (data.success && Array.isArray(data.data)) {
          // API returns Newest First (createdAt: -1).
          // user wants Newest at Bottom.
          // So we reverse the API data to get Oldest First for the "others" naturally,
          // assuming standard roles were created first.

          const sortedData = [...data.data].reverse();

          // Map fetched roles to UI format
          const formattedRoles = sortedData.map(r => {
            const normalizedName = r.name.toLowerCase();
            // Use mapped icon or fallback to Shield for custom roles
            const Icon = ROLE_ICONS_MAP[normalizedName] || Shield;

            return {
              role: normalizedName,
              label: r.name,
              icon: Icon
            };
          });

          // Sort: Priority roles first, then others
          formattedRoles.sort((a, b) => {
            const indexA = PRIORITY_ORDER.indexOf(a.role);
            const indexB = PRIORITY_ORDER.indexOf(b.role);

            const rankA = indexA === -1 ? Infinity : indexA;
            const rankB = indexB === -1 ? Infinity : indexB;

            return rankA - rankB;
          });

          // Optional: Merge with default roles if you want to ensure defaults always exist 
          // even if DB is empty, or just use DB roles if you trust DB is seeded.
          // For now, let's prioritize DB roles but keep defaults if DB is empty to avoid lockout.
          if (formattedRoles.length > 0) {
            setAvailableRoles(formattedRoles);
          }
        }
      } catch (err) {
        console.error("Failed to fetch dynamic roles:", err);
      }
    };

    fetchRoles();
  }, []);

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePassword = (password) =>
    /^(?=.*[a-z])(?=.*\d).{8,}$/.test(password);

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Login button clicked, form submitting...");
    setLoading(true);
    setError("");

    try {
      const result = await login(email, password, selectedRole);
      if (!result.success) {
        setError(result.message || "Login failed");
        setLoading(false); // Only stop loading if it failed
      }
      // If success, keep loading true while redirecting
    } catch {
      setError("Something went wrong");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Authenticating...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex overflow-x-hidden">
      {/* LEFT SIDE */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-50 to-indigo-100 items-center justify-center relative">
        <div className="relative z-10 max-w-sm text-center px-8">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-64 h-40 rounded-2xl border border-gray-100 bg-white">
              <Image
                src="/TechEdu-remove-bg.png"
                alt="TechEdu Logo"
                width={600}
                height={300}
                className="w-full h-full object-contain rounded-2xl"
                priority
              />
            </div>

            <div className="absolute -top-2 -right-4 w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg animate-bounce">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div
              className="absolute -bottom-2 -left-4 w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg animate-bounce"
              style={{ animationDelay: "0.4s" }}
            >
              <Users className="w-6 h-6 text-white" />
            </div>
            <div
              className="absolute top-6 -left-8 w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center shadow-lg animate-bounce"
              style={{ animationDelay: "0.8s" }}
            >
              <Database className="w-5 h-5 text-white" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-gray-800 mb-3">
            TechEdu ERP System
          </h1>
          <p className="text-gray-600 text-sm">
            Streamline institutional operations with a unified ERP platform.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="text-center mb-6">
            {/* 🔥 MOBILE-SAFE ICON */}
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-14 sm:h-14 bg-blue-600 rounded-xl mb-4 shadow-sm">
              <Building2 className="w-8 h-8 sm:w-7 sm:h-7 text-white" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome Back
            </h2>
            <p className="text-gray-600">
              Sign in to access your ERP dashboard
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="grid grid-cols-3 gap-2">
              {availableRoles.map(({ role, label, icon: Icon }) => (
                <button
                  key={role}
                  type="button"
                  suppressHydrationWarning
                  onClick={() => setSelectedRole(role)}
                  className={`p-3 rounded-lg border-2 text-xs ${selectedRole === role
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-200 text-gray-600"
                    }`}
                >
                  <Icon className="w-4 h-4 mx-auto mb-1" />
                  {label}
                </button>
              ))}
            </div>

            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                suppressHydrationWarning
                placeholder="Enter your email or username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                suppressHydrationWarning
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="button"
                suppressHydrationWarning
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>

            <button
              type="submit"
              suppressHydrationWarning
              className="w-full py-2.5 rounded-lg flex items-center justify-center bg-blue-600 text-white hover:bg-blue-700"
            >
              Sign In <ArrowRight className="ml-2 w-5 h-5" />
            </button>
          </form>

          <div className="text-center mt-4">
            <a href="/forgot-password" className="text-blue-600 text-sm">
              Forgot your password?
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
