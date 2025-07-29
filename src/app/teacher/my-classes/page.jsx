"use client"
import { useSession } from '@/context/SessionContext';
import { BookOpen, Plus } from 'lucide-react';
import React, { useState, useEffect } from 'react'


const Classes = ({ teacherId }) => {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const {user} = useSession();

    useEffect(() => {
      const fetchClasses = async () => {
        try {
          const response = await fetch(`/api/teachers/${user.id}/dashboard`);
          if (!response.ok) {
            throw new Error('Failed to fetch classes');
          }
          const data = await response.json();

          console.log(data);
          
          
          // Transform the API data to match our frontend structure
          const transformedClasses = data.mySubjects.flatMap(subjectGroup => 
            subjectGroup.subjects.map((subjectName, index) => ({
              id: `${subjectGroup.year}-${subjectGroup.semester}-${subjectGroup.division}-${index}`,
              name: subjectName,
              students: Math.floor(Math.random() * 30) + 10, // Random student count for demo
              nextClass: getNextClassTime(subjectGroup.year, subjectGroup.semester)
            }))
          );
          
          setClasses(transformedClasses);
        } catch (err) {
          setError(err.message || 'An unknown error occurred');
        } finally {
          setLoading(false);
        }
      };

      fetchClasses();
    }, [teacherId]);

    // Helper function to generate next class time (mock)
    const getNextClassTime = (year, semester) => {
      const days = ['Today', 'Tomorrow'];
      const times = ['9:00 AM', '10:00 AM', '2:00 PM', '3:00 PM'];
      const randomDay = days[Math.floor(Math.random() * days.length)];
      const randomTime = times[Math.floor(Math.random() * times.length)];
      return `${randomDay} ${randomTime}`;
    };

    if (loading) {
      return <div className="flex justify-center items-center h-64">Loading classes...</div>;
    }

    if (error) {
      return <div className="text-red-500 p-4">Error: {error}</div>;
    }

    if (classes.length === 0) {
      return <div className="text-gray-500 p-4">No classes found</div>;
    }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((cls) => (
          <div key={cls.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">{cls.name}</h3>
              <BookOpen className="h-5 w-5 text-blue-600" />
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Students:</span>
                <span className="text-sm font-medium">{cls.students}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Next Class:</span>
                <span className="text-sm font-medium text-blue-600">{cls.nextClass}</span>
              </div>
            </div>

            <div className="flex space-x-2 mt-4">
              <button className="flex-1 bg-blue-100 text-blue-600 py-2 px-3 rounded-lg hover:bg-blue-200 text-sm">
                View Class
              </button>
              <button className="flex-1 bg-gray-100 text-gray-600 py-2 px-3 rounded-lg hover:bg-gray-200 text-sm">
                Manage
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Classes;

