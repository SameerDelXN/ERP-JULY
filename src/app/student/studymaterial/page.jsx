'use client';

import { BookOpen, Download, Search, Filter, Calendar, FileText, X, ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function StudyMaterialPage() {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    // Enhanced dummy data
    const dummyStudyMaterials = [
      {
        _id: '1',
        title: 'Introduction to Programming',
        description: 'Comprehensive slides covering the basics of programming concepts including variables, data types, and control structures.',
        subject: 'Programming in C',
        fileUrl: 'https://example.com/materials/intro-to-programming.pdf',
        createdAt: '2025-07-01T10:30:00Z',
        fileSize: '2.4 MB',
        downloads: 145,
        type: 'PDF'
      },
      {
        _id: '2',
        title: 'Loops and Functions',
        description: 'Detailed PDF notes with practical examples on loops and user-defined functions with coding exercises.',
        subject: 'Programming in C',
        fileUrl: 'https://example.com/materials/loops-functions.pdf',
        createdAt: '2025-07-05T14:45:00Z',
        fileSize: '1.8 MB',
        downloads: 98,
        type: 'PDF'
      },
      {
        _id: '3',
        title: 'Data Communication Basics',
        description: 'Interactive lecture slides covering OSI model, TCP/IP stack, and fundamental networking protocols.',
        subject: 'Computer Networks',
        fileUrl: 'https://example.com/materials/data-comm.pdf',
        createdAt: '2025-07-10T09:00:00Z',
        fileSize: '3.2 MB',
        downloads: 234,
        type: 'PDF'
      },
      {
        _id: '4',
        title: 'CN Lab Manual',
        description: 'Complete lab experiments and practical exercises for Computer Networks with step-by-step instructions.',
        subject: 'Computer Networks',
        fileUrl: 'https://example.com/materials/cn-lab-manual.pdf',
        createdAt: '2025-07-12T08:15:00Z',
        fileSize: '5.1 MB',
        downloads: 187,
        type: 'PDF'
      },
      {
        _id: '5',
        title: 'Digital Logic - Number Systems',
        description: 'Comprehensive notes on binary, octal, hexadecimal systems with conversion techniques and practice problems.',
        subject: 'Digital Logic Design',
        fileUrl: 'https://example.com/materials/dld-number-systems.pdf',
        createdAt: '2025-07-08T13:20:00Z',
        fileSize: '2.9 MB',
        downloads: 156,
        type: 'PDF'
      },
      {
        _id: '6',
        title: 'Boolean Algebra & Logic Gates',
        description: 'Visual guide to Boolean algebra, truth tables, and logic gate implementations with circuit diagrams.',
        subject: 'Digital Logic Design',
        fileUrl: 'https://example.com/materials/boolean-algebra.pdf',
        createdAt: '2025-07-15T16:30:00Z',
        fileSize: '4.3 MB',
        downloads: 203,
        type: 'PDF'
      }
    ];

    setMaterials(dummyStudyMaterials);
    setLoading(false);
  }, []);

  const getUniqueSubjects = () => {
    return [...new Set(materials.map(m => m.subject))];
  };

  const filteredAndSortedMaterials = () => {
    let filtered = materials.filter(material => {
      const matchesSearch = material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           material.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSubject = selectedSubject === 'all' || material.subject === selectedSubject;
      return matchesSearch && matchesSubject;
    });

    // Sort materials
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'popular':
          return b.downloads - a.downloads;
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    return filtered;
  };

  const groupBySubject = (materials) => {
    const grouped = {};
    materials.forEach((material) => {
      const subject = material.subject || 'Unknown Subject';
      if (!grouped[subject]) grouped[subject] = [];
      grouped[subject].push(material);
    });
    return grouped;
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedSubject('all');
    setSortBy('newest');
  };

  const getFileTypeColor = (type) => {
    switch (type) {
      case 'PDF': return 'bg-red-100 text-red-800';
      case 'DOC': return 'bg-blue-100 text-blue-800';
      case 'PPT': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const processedMaterials = filteredAndSortedMaterials();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="p-4 sm:p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-600 rounded-lg">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Study Materials</h1>
          </div>
          <p className="text-gray-600">Access your course materials, notes, and resources</p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search materials..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            {/* Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <Filter className="w-4 h-4" />
              Filters
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Expandable Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex flex-wrap gap-4">
                {/* Subject Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="all">All Subjects</option>
                    {getUniqueSubjects().map(subject => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </select>
                </div>

                {/* Sort By */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="popular">Most Downloaded</option>
                    <option value="title">Title A-Z</option>
                  </select>
                </div>

                {/* Clear Filters */}
                {(searchTerm || selectedSubject !== 'all' || sortBy !== 'newest') && (
                  <div className="flex items-end">
                    <button
                      onClick={clearFilters}
                      className="flex items-center gap-1 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                      Clear
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-gray-600">
            {processedMaterials.length} material{processedMaterials.length !== 1 ? 's' : ''} found
            {selectedSubject !== 'all' && ` in ${selectedSubject}`}
            {searchTerm && ` matching "${searchTerm}"`}
          </p>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-500">Loading materials...</span>
          </div>
        ) : processedMaterials.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No materials found</h3>
            <p className="text-gray-600">
              {searchTerm || selectedSubject !== 'all' 
                ? 'Try adjusting your search or filters' 
                : 'No study materials are available at the moment'}
            </p>
          </div>
        ) : (
          Object.entries(groupBySubject(processedMaterials)).map(([subject, items]) => (
            <div key={subject} className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-xl font-semibold text-gray-800">{subject}</h2>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                  {items.length} item{items.length !== 1 ? 's' : ''}
                </span>
              </div>
              
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((material) => (
                  <div
                    key={material._id}
                    className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-5 group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-blue-600" />
                        <span className={`px-2 py-1 text-xs font-medium rounded ${getFileTypeColor(material.type)}`}>
                          {material.type}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">{material.fileSize}</span>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {material.title}
                    </h3>
                    
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                      {material.description}
                    </p>

                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(material.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </div>
                      <span>{material.downloads} downloads</span>
                    </div>

                    <a
                      href={material.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors font-medium"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </a>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}