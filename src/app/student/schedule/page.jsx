
"use client"

import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  Bell,
  BookOpen,
  MapPin,
  User,
  Plus
} from 'lucide-react';

const SchedulePage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('week'); // 'week' or 'day'
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Sample timetable data
  const timetable = [
    {
      id: 1,
      courseCode: 'CS-401',
      courseName: 'Advanced Algorithms',
      instructor: 'Dr. Smith',
      location: 'Science Bldg, Room 203',
      days: ['Mon', 'Wed'],
      startTime: '10:00',
      endTime: '11:30',
      type: 'Lecture'
    },
    {
      id: 2,
      courseCode: 'MATH-310',
      courseName: 'Discrete Mathematics',
      instructor: 'Prof. Johnson',
      location: 'Math Bldg, Room 105',
      days: ['Tue', 'Thu'],
      startTime: '13:00',
      endTime: '14:30',
      type: 'Lecture'
    },
    {
      id: 3,
      courseCode: 'CS-401',
      courseName: 'Advanced Algorithms',
      instructor: 'TA Rodriguez',
      location: 'CS Lab, Room 312',
      days: ['Fri'],
      startTime: '14:00',
      endTime: '15:30',
      type: 'Lab'
    }
  ];

  // Sample events data
  const events = [
    {
      id: 101,
      title: 'Midterm Exam - Algorithms',
      date: '2023-06-15',
      time: '09:00-11:00',
      location: 'Exam Hall A',
      type: 'exam'
    },
    {
      id: 102,
      title: 'Project Submission Deadline',
      date: '2023-06-20',
      time: '23:59',
      location: 'Online',
      type: 'deadline'
    },
    {
      id: 103,
      title: 'Guest Lecture: AI Ethics',
      date: '2023-06-18',
      time: '16:00-17:30',
      location: 'Auditorium',
      type: 'event'
    }
  ];

  // Get current week's dates
  const getWeekDates = (date) => {
    const startDate = new Date(date);
    startDate.setDate(date.getDate() - date.getDay());
    
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      weekDates.push(day);
    }
    return weekDates;
  };

  const weekDates = getWeekDates(currentDate);
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Navigate weeks
  const prevWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const nextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  // Get today's classes
  const getTodaysClasses = () => {
    const today = weekDays[currentDate.getDay()];
    return timetable.filter(item => item.days.includes(today));
  };

  // Format time for display
  const formatTime = (timeStr) => {
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    return `${hour > 12 ? hour - 12 : hour}:${minutes} ${hour >= 12 ? 'PM' : 'AM'}`;
  };

  // Get upcoming events (next 7 days)
  const upcomingEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return eventDate >= today;
  }).sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">My Schedule</h1>
            <p className="text-gray-600">
              {viewMode === 'week' ? 'Weekly timetable' : 'Daily schedule'}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setViewMode(viewMode === 'week' ? 'day' : 'week')}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              {viewMode === 'week' ? 'Day View' : 'Week View'}
            </button>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={prevWeek}
                className="p-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                <ChevronLeft size={18} />
              </button>
              
              <div className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-center">
                {viewMode === 'week' ? (
                  <span className="font-medium text-gray-800">
                    {weekDates[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} -{' '}
                    {weekDates[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                ) : (
                  <span className="font-medium text-gray-800">
                    {currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                  </span>
                )}
              </div>
              
              <button 
                onClick={nextWeek}
                className="p-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                <ChevronRight size={18} />
              </button>
            </div>
            
            <button className="p-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
              <Plus size={18} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Schedule */}
          <div className="lg:col-span-2">
            {viewMode === 'week' ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Weekday headers */}
                <div className="grid grid-cols-7 border-b border-gray-200">
                  {weekDates.map((date, index) => {
                    const isToday = date.toDateString() === new Date().toDateString();
                    return (
                      <div 
                        key={index}
                        className={`py-3 text-center ${isToday ? 'bg-blue-50' : 'bg-white'}`}
                      >
                        <div className="text-sm text-gray-500">{weekDays[index]}</div>
                        <div className={`text-lg font-medium ${
                          isToday ? 'text-blue-600' : 'text-gray-800'
                        }`}>
                          {date.getDate()}
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {/* Time slots */}
                <div className="divide-y divide-gray-200">
                  {Array.from({ length: 14 }, (_, i) => {
                    const hour = 8 + i; // From 8:00 AM to 9:00 PM
                    const timeLabel = `${hour > 12 ? hour - 12 : hour}:00 ${hour >= 12 ? 'PM' : 'AM'}`;
                    
                    return (
                      <div key={hour} className="grid grid-cols-7 min-h-16">
                        <div className="flex items-start justify-center pt-2 text-xs text-gray-500 border-r border-gray-200">
                          {timeLabel}
                        </div>
                        
                        {weekDates.map((date, dayIndex) => {
                          const dayName = weekDays[date.getDay()];
                          const hourStart = `${hour.toString().padStart(2, '0')}:00`;
                          const hourEnd = `${(hour + 1).toString().padStart(2, '0')}:00`;
                          
                          // Find classes that occur on this day and overlap with this hour
                          const classesInSlot = timetable.filter(item => {
                            if (!item.days.includes(dayName)) return false;
                            
                            // Simplified overlap check
                            return (
                              (item.startTime <= hourStart && item.endTime >= hourStart) ||
                              (item.startTime >= hourStart && item.startTime < hourEnd)
                            );
                          });
                          
                          return (
                            <div 
                              key={dayIndex}
                              className="relative border-r border-gray-200 last:border-r-0"
                              onClick={() => classesInSlot.length > 0 && setSelectedEvent(classesInSlot[0])}
                            >
                              {classesInSlot.map((classItem, idx) => {
                                // Calculate duration in hours
                                const startHour = parseInt(classItem.startTime.split(':')[0]);
                                const startMin = parseInt(classItem.startTime.split(':')[1]);
                                const endHour = parseInt(classItem.endTime.split(':')[0]);
                                const endMin = parseInt(classItem.endTime.split(':')[1]);
                                
                                const duration = (endHour - startHour) + (endMin - startMin) / 60;
                                const position = (startHour - 8) + (startMin / 60);
                                
                                return (
                                  <div
                                    key={idx}
                                    className={`absolute left-0 right-0 mx-1 rounded-lg p-2 text-xs cursor-pointer ${
                                      classItem.type === 'Lab' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                                    }`}
                                    style={{
                                      top: `${position * 100}%`,
                                      height: `${duration * 100}%`,
                                    }}
                                  >
                                    <div className="font-medium truncate">{classItem.courseCode}</div>
                                    <div className="truncate">{classItem.type}</div>
                                  </div>
                                );
                              })}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  {currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </h2>
                
                {getTodaysClasses().length > 0 ? (
                  <div className="space-y-4">
                    {getTodaysClasses().map(classItem => (
                      <div 
                        key={classItem.id}
                        className={`p-4 rounded-lg border cursor-pointer ${
                          classItem.type === 'Lab' ? 'border-purple-200 bg-purple-50' : 'border-blue-200 bg-blue-50'
                        }`}
                        onClick={() => setSelectedEvent(classItem)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-gray-800">{classItem.courseCode} - {classItem.courseName}</h3>
                            <p className="text-sm text-gray-600">{classItem.type} with {classItem.instructor}</p>
                          </div>
                          <div className="text-sm font-medium text-gray-700">
                            {formatTime(classItem.startTime)} - {formatTime(classItem.endTime)}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-3 text-sm text-gray-600">
                          <MapPin size={14} />
                          <span>{classItem.location}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No classes scheduled for today
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Events */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Upcoming Events</h2>
              
              {upcomingEvents.length > 0 ? (
                <div className="space-y-4">
                  {upcomingEvents.map(event => (
                    <div 
                      key={event.id}
                      className={`p-3 rounded-lg border cursor-pointer ${
                        event.type === 'exam' ? 'border-red-200 bg-red-50' :
                        event.type === 'deadline' ? 'border-orange-200 bg-orange-50' :
                        'border-green-200 bg-green-50'
                      }`}
                      onClick={() => setSelectedEvent(event)}
                    >
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium text-gray-800">{event.title}</h3>
                        <div className="text-xs font-medium text-gray-600">
                          {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-2 text-xs text-gray-600">
                        <Clock size={12} />
                        <span>{event.time}</span>
                        <MapPin size={12} />
                        <span>{event.location}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  No upcoming events
                </div>
              )}
            </div>
            
            {/* Event Details */}
            {selectedEvent && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-2">{selectedEvent.title || selectedEvent.courseName}</h2>
                
                {'courseCode' in selectedEvent ? (
                  <>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                      <BookOpen size={14} />
                      <span>{selectedEvent.courseCode} - {selectedEvent.type}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                      <User size={14} />
                      <span>{selectedEvent.instructor}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                      <Clock size={14} />
                      <span>
                        {selectedEvent.days?.join(', ')} {formatTime(selectedEvent.startTime)} - {formatTime(selectedEvent.endTime)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin size={14} />
                      <span>{selectedEvent.location}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                      <Calendar size={14} />
                      <span>
                        {new Date(selectedEvent.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                      <Clock size={14} />
                      <span>{selectedEvent.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin size={14} />
                      <span>{selectedEvent.location}</span>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchedulePage;
