//import React from 'react'

//const page = () => {
 // return (
 //   <div>Satff</div>
 // )
//}

//export default page


'use client';

import { useEffect, useState } from 'react';

export default function StaffPage() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/hr/staff')
      .then((res) => res.json())
      .then((data) => {
        setStaff(data.data || []);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Staff Directory</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {staff.map((person) => (
          <div
            key={person._id}
            className="bg-white shadow-md rounded-xl p-4 border hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold">{person.name}</h2>
            <p className="text-gray-600">Staff ID: {person.staffId}</p>
            <p className="text-gray-600">Email: {person.email}</p>
            <p className="text-gray-600">Role: {person.role}</p>
            <p className={`text-sm mt-2 ${person.isActive ? 'text-green-600' : 'text-red-500'}`}>
              {person.isActive ? 'Active' : 'Inactive'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
