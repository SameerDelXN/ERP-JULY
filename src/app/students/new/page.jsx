'use client';

import { useState } from 'react';

export default function AddStudentPage() {
  const [form, setForm] = useState({
    name: '',
    studentId: '',
    email: '',
    rollNumber: '',
    course: '',
    semester: '',
    department: '',
    phone: ''
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('/api/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (data.success) {
      setMessage('✅ Student added successfully');
      setForm({
        name: '',
        studentId: '',
        email: '',
        rollNumber: '',
        course: '',
        semester: '',
        department: '',
        phone: ''
      });
    } else {
      setMessage('❌ Error: ' + data.error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <h1 className="text-2xl font-bold mb-4">Add New Student</h1>
      {message && <p className="mb-4 text-sm">{message}</p>}
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        {[
          { label: 'Name', name: 'name' },
          { label: 'Student ID', name: 'studentId' },
          { label: 'Email', name: 'email' },
          { label: 'Roll Number', name: 'rollNumber' },
          { label: 'Course', name: 'course' },
          { label: 'Semester', name: 'semester' },
          { label: 'Department', name: 'department' },
          { label: 'Phone', name: 'phone' },
        ].map((field) => (
          <div key={field.name}>
            <label className="block text-sm font-medium mb-1">{field.label}</label>
            <input
              type="text"
              name={field.name}
              value={form[field.name]}
              onChange={handleChange}
              required={['name', 'studentId', 'email', 'rollNumber'].includes(field.name)}
              className="w-full border rounded p-2 text-sm"
            />
          </div>
        ))}
        <div className="col-span-2 mt-4">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
