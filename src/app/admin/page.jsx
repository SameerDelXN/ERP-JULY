  "use client"

  import React, { useState, useEffect } from 'react';
  import { 
    Users, 
    UserCheck, 
    GraduationCap, 
    Building, 
    TrendingUp, 
    TrendingDown, 
    Calendar,
    Clock,
    Bell,
    Search,
    Filter,
    Download,
    Plus,
    Activity,
    Award,
    BookOpen,
    DollarSign,
    ArrowUpRight,
    ArrowDownRight,
    Icon
  } from 'lucide-react';
  import { useSession } from '@/context/SessionContext';
  const AdminDashboard = () => {
    const { user, refreshSession } = useSession();
    // console.log("user = ",user)
    useEffect(() => {
      refreshSession();
    }, []);
    const [timeframe, setTimeframe] = useState('monthly');
    
    const stats = {
      students: { total: 3000, active: 2847, growth: 12.5, trend: 'up' },
      staff: { total: 300, active: 287, growth: 5.2, trend: 'up' },
      teachers: { total: 30, active: 28, growth: -2.1, trend: 'down' },
      hr: { total: 30, active: 29, growth: 8.7, trend: 'up' }
    };

    const recentActivities = [
      { id: 1, type: 'admission', message: '15 new admission applications received', time: '2 hours ago' },
      { id: 2, type: 'staff', message: 'New teacher John Smith joined Mathematics dept', time: '4 hours ago' },
      { id: 3, type: 'system', message: 'Monthly attendance report generated', time: '6 hours ago' },
      { id: 4, type: 'payment', message: '₹2,50,000 fees collected today', time: '8 hours ago' }
    ];

    const quickActions = [
      { icon: Plus, label: 'Add Student' },
      { icon: UserCheck, label: 'Add Staff' },
      { icon: Calendar, label: 'Schedule' },
      { icon: Download, label: 'Reports' }
    ];

    const StatCard = ({ title, icon: Icon, total, active, growth, trend }) => (
      <div className="bg-white rounded-lg p-6 border border-gray-100 hover:shadow-sm transition-all duration-200">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 bg-gray-100 rounded-lg">
            <Icon className="w-5 h-5 text-gray-600" />
          </div>
        </div>
        
        <div className="space-y-3">
          <h3 className="text-gray-600 text-sm font-medium">{title}</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-semibold text-gray-900">{total.toLocaleString()}</span>
            <span className="text-sm text-gray-500">total</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-gray-100 rounded-full h-1.5">
              <div 
                className="h-1.5 rounded-full bg-blue-600 transition-all duration-300"
                style={{ width: `${(active / total) * 100}%` }}
              ></div>
            </div>
            <span className="text-xs text-gray-600">{active} active</span>
          </div>
        </div>
      </div>
    );

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="p-6">

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard 
              title="Total Students" 
              icon={Users} 
              total={stats.students.total}
              active={stats.students.active}
              growth={stats.students.growth}
              trend={stats.students.trend}
            />
            <StatCard 
              title="Total Staff" 
              icon={UserCheck} 
              total={stats.staff.total}
              active={stats.staff.active}
              growth={stats.staff.growth}
              trend={stats.staff.trend}
            />
            <StatCard 
              title="Total Teachers" 
              icon={GraduationCap} 
              total={stats.teachers.total}
              active={stats.teachers.active}
              growth={stats.teachers.growth}
              trend={stats.teachers.trend}
            />
            <StatCard 
              title="HR Personnel" 
              icon={Building} 
              total={stats.hr.total}
              active={stats.hr.active}
              growth={stats.hr.growth}
              trend={stats.hr.trend}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg p-6 border border-gray-100">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    className="flex flex-col items-center gap-2 p-4 rounded-lg border border-gray-100 hover:bg-gray-50 hover:border-gray-200 transition-all duration-200"
                  >
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <action.icon className="w-4 h-4 text-gray-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{action.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Activities */}
            <div className="lg:col-span-2 bg-white rounded-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Recent Activities</h3>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">View All</button>
              </div>
              
              <div className="space-y-3">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="p-2 bg-gray-100 rounded-lg mt-0.5">
                      {activity.type === 'admission' ? <BookOpen className="w-4 h-4 text-gray-600" /> :
                      activity.type === 'staff' ? <UserCheck className="w-4 h-4 text-gray-600" /> :
                      activity.type === 'system' ? <Activity className="w-4 h-4 text-gray-600" /> :
                      <DollarSign className="w-4 h-4 text-gray-600" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 font-medium">{activity.message}</p>
                      <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Additional Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            <div className="bg-white rounded-lg p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Award className="w-4 h-4 text-gray-600" />
                </div>
                <span className="text-sm font-medium text-gray-600">Attendance Rate</span>
              </div>
              <div className="text-xl font-semibold text-gray-900">94.2%</div>
              <div className="text-xs text-green-600 mt-1 flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3" />
                +2.1% from last month
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <BookOpen className="w-4 h-4 text-gray-600" />
                </div>
                <span className="text-sm font-medium text-gray-600">Active Courses</span>
              </div>
              <div className="text-xl font-semibold text-gray-900">127</div>
              <div className="text-xs text-blue-600 mt-1">5 new this month</div>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Calendar className="w-4 h-4 text-gray-600" />
                </div>
                <span className="text-sm font-medium text-gray-600">Events Today</span>
              </div>
              <div className="text-xl font-semibold text-gray-900">8</div>
              <div className="text-xs text-gray-600 mt-1">3 upcoming</div>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <DollarSign className="w-4 h-4 text-gray-600" />
                </div>
                <span className="text-sm font-medium text-gray-600">Revenue</span>
              </div>
              <div className="text-xl font-semibold text-gray-900">₹12.5L</div>
              <div className="text-xs text-gray-600 mt-1">This month</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  export default AdminDashboard;