// app/admin/courses/page.jsx
"use client";
import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Save, X } from "lucide-react";
import LoadingComponent from "@/components/Loading";
export default function CourseManagement() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newCourse, setNewCourse] = useState({
    name: "",
    description: "",
    category: "Engineering",
    duration: "",
    isActive: true
  });
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/courses");
      if (!response.ok) throw new Error("Failed to fetch courses");
      const data = await response.json();
      setCourses(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCourse = async () => {
    try {
      const response = await fetch("/api/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCourse),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add course");
      }

      const addedCourse = await response.json();
      setCourses([...courses, addedCourse]);
      setNewCourse({
        name: "",
        description: "",
        category: "Engineering",
        duration: "",
        isActive: true
      });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (course) => {
    setEditingId(course._id);
    setEditData({
      name: course.name,
      description: course.description,
      category: course.category,
      duration: course.duration,
      isActive: course.isActive
    });
  };

  const handleUpdate = async (id) => {
    try {
      const response = await fetch(`/api/admin/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editData),
      });

      if (!response.ok) throw new Error("Failed to update course");

      const updatedCourse = await response.json();
      setCourses(courses.map(c => c._id === id ? updatedCourse : c));
      setEditingId(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this course?")) return;
    
    try {
      const response = await fetch(`/api/courses/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete course");

      setCourses(courses.filter(course => course._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const response = await fetch(`/api/admin/courses/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (!response.ok) throw new Error("Failed to update course status");

      const updatedCourse = await response.json();
      setCourses(courses.map(c => c._id === id ? updatedCourse : c));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <LoadingComponent/>;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Course Management</h1>
      
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Add New Course Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Add New Course</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name*</label>
            <input
              type="text"
              value={newCourse.name}
              onChange={(e) => setNewCourse({...newCourse, name: e.target.value})}
              className="w-full p-2 border rounded"
              placeholder="Course name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              value={newCourse.category}
              onChange={(e) => setNewCourse({...newCourse, category: e.target.value})}
              className="w-full p-2 border rounded"
            >
              <option value="Engineering">Engineering</option>
              <option value="Management">Management</option>
              <option value="Diploma">Diploma</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Duration</label>
            <input
              type="text"
              value={newCourse.duration}
              onChange={(e) => setNewCourse({...newCourse, duration: e.target.value})}
              className="w-full p-2 border rounded"
              placeholder="e.g., 4 Years"
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={newCourse.description}
            onChange={(e) => setNewCourse({...newCourse, description: e.target.value})}
            className="w-full p-2 border rounded"
            rows="2"
            placeholder="Course description"
          />
        </div>
        <button
          onClick={handleAddCourse}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={!newCourse.name}
        >
          <Plus size={16} /> Add Course
        </button>
      </div>

      {/* Courses List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {courses.map((course) => (
                <tr key={course._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingId === course._id ? (
                      <input
                        type="text"
                        value={editData.name}
                        onChange={(e) => setEditData({...editData, name: e.target.value})}
                        className="w-full p-1 border rounded"
                      />
                    ) : (
                      <div className="font-medium">{course.name}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingId === course._id ? (
                      <select
                        value={editData.category}
                        onChange={(e) => setEditData({...editData, category: e.target.value})}
                        className="w-full p-1 border rounded"
                      >
                        <option value="Engineering">Engineering</option>
                        <option value="Management">Management</option>
                        <option value="Diploma">Diploma</option>
                        <option value="Other">Other</option>
                      </select>
                    ) : (
                      course.category
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingId === course._id ? (
                      <input
                        type="text"
                        value={editData.duration}
                        onChange={(e) => setEditData({...editData, duration: e.target.value})}
                        className="w-full p-1 border rounded"
                      />
                    ) : (
                      course.duration
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleToggleStatus(course._id, course.isActive)}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        course.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {course.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {editingId === course._id ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdate(course._id)}
                          className="text-green-600 hover:text-green-900"
                        >
                          <Save size={18} />
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(course)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(course._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}