"use client";
import { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Pencil,
  ChevronDown,
  ChevronUp,
  Clock,
  CheckCircle,
  XCircle,
  ArrowLeft,
} from "lucide-react";

export default function CoursePlanEditor({ initialPlan, onCancel, onSave }) {
  const [plan, setPlan] = useState({
    title: "",
    description: "",
    modules: [],
  });
  const [originalPlan, setOriginalPlan] = useState(null);
  const [editingModuleId, setEditingModuleId] = useState(null);
  const [expandedModules, setExpandedModules] = useState({});

  // Initialize with sample data if no initial plan
  useEffect(() => {
    if (initialPlan) {
      setPlan(JSON.parse(JSON.stringify(initialPlan)));
      setOriginalPlan(JSON.parse(JSON.stringify(initialPlan)));
    } else {
      const samplePlan = {
        title: "New Course Plan",
        description: "Describe your course here",
        modules: [
          {
            id: Date.now(),
            title: "Introduction",
            duration: 60,
            resources: [],
            lessons: [
              {
                id: Date.now(),
                title: "Welcome to the Course",
                duration: 15,
                completed: false,
                description: "Overview of what you will learn",
              },
            ],
          },
        ],
      };
      setPlan(samplePlan);
      setOriginalPlan(JSON.parse(JSON.stringify(samplePlan)));
    }
  }, [initialPlan]);

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      setPlan(JSON.parse(JSON.stringify(originalPlan)));
    }
  };

  const handleSave = () => {
    if (onSave) {
      onSave(plan);
    }
    // Update original plan to current state
    setOriginalPlan(JSON.parse(JSON.stringify(plan)));
  };

  const toggleModule = (moduleId) => {
    setExpandedModules((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId],
    }));
  };

  const addModule = () => {
    const newModule = {
      id: Date.now(),
      title: "New Module",
      duration: 0,
      resources: [],
      lessons: [],
    };
    setPlan((prev) => ({
      ...prev,
      modules: [...prev.modules, newModule],
    }));
    setEditingModuleId(newModule.id);
    setExpandedModules((prev) => ({ ...prev, [newModule.id]: true }));
  };

  const updateModule = (moduleId, updates) => {
    setPlan((prev) => ({
      ...prev,
      modules: prev.modules.map((module) =>
        module.id === moduleId ? { ...module, ...updates } : module
      ),
    }));
  };

  const deleteModule = (moduleId) => {
    setPlan((prev) => ({
      ...prev,
      modules: prev.modules.filter((module) => module.id !== moduleId),
    }));
  };

  const addLesson = (moduleId) => {
    const module = plan.modules.find((m) => m.id === moduleId);
    if (!module) return;

    const newLesson = {
      id: Date.now(),
      title: "New Lesson",
      duration: 0,
      completed: false,
      description: "",
    };
    updateModule(moduleId, {
      lessons: [...module.lessons, newLesson],
    });
  };

  const updateLesson = (moduleId, lessonId, updates) => {
    const module = plan.modules.find((m) => m.id === moduleId);
    if (!module) return;

    updateModule(moduleId, {
      lessons: module.lessons.map((lesson) =>
        lesson.id === lessonId ? { ...lesson, ...updates } : lesson
      ),
    });
  };

  const deleteLesson = (moduleId, lessonId) => {
    const module = plan.modules.find((m) => m.id === moduleId);
    if (!module) return;

    updateModule(moduleId, {
      lessons: module.lessons.filter((lesson) => lesson.id !== lessonId),
    });
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            {onCancel && (
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                <ArrowLeft size={20} />
                Back
              </button>
            )}
            <h1 className="text-3xl font-bold text-indigo-900">
              Course Plan Editor
            </h1>
          </div>
          <p className="text-indigo-700">
            Create and organize your course content
          </p>
        </div>

        {/* Course Info */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="mb-4">
            <label className="block text-indigo-800 font-medium mb-1">
              Course Title
            </label>
            <input
              type="text"
              value={plan.title}
              onChange={(e) => setPlan({ ...plan, title: e.target.value })}
              className="w-full p-3 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Enter course title"
            />
          </div>
          <div>
            <label className="block text-indigo-800 font-medium mb-1">
              Description
            </label>
            <textarea
              value={plan.description}
              onChange={(e) => setPlan({ ...plan, description: e.target.value })}
              className="w-full p-3 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent min-h-[100px]"
              placeholder="Describe your course"
            />
          </div>
        </div>

        {/* Modules */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-indigo-900">Modules</h2>
            <button
              onClick={addModule}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Plus size={18} />
              Add Module
            </button>
          </div>

          {plan.modules.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-6 text-center text-indigo-700">
              No modules yet. Add your first module to get started.
            </div>
          ) : (
            plan.modules.map((module) => (
              <div
                key={module.id}
                className="bg-white rounded-xl shadow-md overflow-hidden"
              >
                <div className="p-4 border-b border-indigo-100 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleModule(module.id)}
                      className="text-indigo-500 hover:text-indigo-700"
                    >
                      {expandedModules[module.id] ? (
                        <ChevronUp size={20} />
                      ) : (
                        <ChevronDown size={20} />
                      )}
                    </button>
                    {editingModuleId === module.id ? (
                      <input
                        type="text"
                        value={module.title}
                        onChange={(e) =>
                          updateModule(module.id, { title: e.target.value })
                        }
                        className="font-medium text-indigo-900 border-b border-indigo-300 focus:outline-none focus:border-indigo-500"
                        autoFocus
                        onBlur={() => setEditingModuleId(null)}
                        onKeyDown={(e) =>
                          e.key === "Enter" && setEditingModuleId(null)
                        }
                      />
                    ) : (
                      <h3
                        className="font-medium text-indigo-900 cursor-pointer"
                        onClick={() => setEditingModuleId(module.id)}
                      >
                        {module.title}
                      </h3>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 text-sm text-indigo-600">
                      <Clock size={16} />
                      {module.duration} min
                    </span>
                    <button
                      onClick={() => deleteModule(module.id)}
                      className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                {expandedModules[module.id] && (
                  <div className="p-4 space-y-4">
                    {/* Module Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-indigo-800 mb-1">
                          Duration (minutes)
                        </label>
                        <input
                          type="number"
                          value={module.duration}
                          onChange={(e) =>
                            updateModule(module.id, {
                              duration: parseInt(e.target.value) || 0,
                            })
                          }
                          className="w-full p-2 border border-indigo-200 rounded-lg"
                          min="0"
                        />
                      </div>
                    </div>

                    {/* Lessons */}
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-medium text-indigo-800">Lessons</h4>
                        <button
                          onClick={() => addLesson(module.id)}
                          className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800"
                        >
                          <Plus size={16} />
                          Add Lesson
                        </button>
                      </div>

                      {module.lessons.length === 0 ? (
                        <div className="text-center text-indigo-500 py-4">
                          No lessons in this module yet.
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {module.lessons.map((lesson) => (
                            <div
                              key={lesson.id}
                              className="bg-indigo-50 rounded-lg p-3"
                            >
                              <div className="flex justify-between items-start">
                                <div className="flex items-start gap-3">
                                  <button
                                    onClick={() =>
                                      updateLesson(module.id, lesson.id, {
                                        completed: !lesson.completed,
                                      })
                                    }
                                    className={`mt-1 ${
                                      lesson.completed
                                        ? "text-green-500"
                                        : "text-indigo-300"
                                    }`}
                                  >
                                    {lesson.completed ? (
                                      <CheckCircle size={18} />
                                    ) : (
                                      <XCircle size={18} />
                                    )}
                                  </button>
                                  <div>
                                    <h5 className="font-medium text-indigo-900">
                                      {lesson.title}
                                    </h5>
                                    <p className="text-sm text-indigo-700">
                                      {lesson.description}
                                    </p>
                                    <div className="flex items-center gap-2 mt-1 text-xs text-indigo-600">
                                      <Clock size={14} />
                                      <span>{lesson.duration} min</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex gap-1">
                                  <button
                                    onClick={() =>
                                      deleteLesson(module.id, lesson.id)
                                    }
                                    className="text-red-400 hover:text-red-600 p-1"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-end gap-4">
          <button
            onClick={handleCancel}
            className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors border border-indigo-300 text-indigo-700 hover:bg-indigo-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-md"
          >
            Save Course Plan
          </button>
        </div>
      </div>
    </div>
  );
}