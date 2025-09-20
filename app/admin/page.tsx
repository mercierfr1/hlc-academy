'use client'

import { useState } from 'react'
import { 
  Users, 
  BookOpen, 
  DollarSign, 
  BarChart3, 
  Settings, 
  FileText, 
  ShoppingCart, 
  Target, 
  HeadphonesIcon, 
  Award, 
  Shield,
  Activity,
  TrendingUp,
  UserCheck,
  GraduationCap,
  CreditCard
} from 'lucide-react'

// Mock data for demonstration
const mockStats = {
  totalUsers: 1247,
  activeUsers: 892,
  totalRevenue: 45680,
  courseCompletions: 2341,
  monthlyGrowth: 12.5,
  userRetention: 78.3
}

const mockRecentActivity = [
  { id: 1, type: 'user_signup', message: 'New user John Doe signed up', time: '2 minutes ago' },
  { id: 2, type: 'course_completion', message: 'Sarah completed "Advanced Trading Strategies"', time: '15 minutes ago' },
  { id: 3, type: 'payment', message: 'Payment of $299 received from Mike Wilson', time: '1 hour ago' },
  { id: 4, type: 'support', message: 'New support ticket #1234 created', time: '2 hours ago' }
]

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview')

  const navigationItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'content', label: 'Content', icon: FileText },
    { id: 'products', label: 'Products', icon: ShoppingCart },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'trading-tools', label: 'Trading Tools', icon: Target },
    { id: 'marketing', label: 'Marketing', icon: TrendingUp },
    { id: 'support', label: 'Support', icon: HeadphonesIcon },
    { id: 'certificates', label: 'Certificates', icon: Award },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'analytics', label: 'Analytics', icon: Activity }
  ]

  const StatCard = ({ title, value, change, icon: Icon, color = 'blue' }: {
    title: string
    value: string
    change?: number
    icon: any
    color?: string
  }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
          {change && (
            <p className={`text-sm ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change > 0 ? '+' : ''}{change}% from last month
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full bg-${color}-100`}>
          <Icon className={`h-6 w-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  )

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={mockStats.totalUsers.toLocaleString()}
          change={mockStats.monthlyGrowth}
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Active Users"
          value={mockStats.activeUsers.toLocaleString()}
          change={5.2}
          icon={UserCheck}
          color="green"
        />
        <StatCard
          title="Total Revenue"
          value={`$${mockStats.totalRevenue.toLocaleString()}`}
          change={8.7}
          icon={DollarSign}
          color="purple"
        />
        <StatCard
          title="Course Completions"
          value={mockStats.courseCompletions.toLocaleString()}
          change={15.3}
          icon={GraduationCap}
          color="orange"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">User Growth</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
            <p className="text-gray-500">Chart placeholder - User growth over time</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Breakdown</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
            <p className="text-gray-500">Chart placeholder - Revenue by product</p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {mockRecentActivity.map((activity) => (
            <div key={activity.id} className="px-6 py-4">
              <p className="text-sm text-gray-900">{activity.message}</p>
              <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Trading Academy Admin Dashboard</h1>
          <p className="text-gray-600">Manage your trading education platform</p>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg min-h-screen">
          <nav className="mt-6">
            {navigationItems.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-50 ${
                    activeTab === item.id
                      ? 'bg-blue-50 border-r-2 border-blue-500 text-blue-700'
                      : 'text-gray-700'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.label}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'users' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">User Management</h2>
              <p className="text-gray-600">User management interface will be implemented here</p>
            </div>
          )}
          {activeTab === 'courses' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Course Management</h2>
              <p className="text-gray-600">Course management interface will be implemented here</p>
            </div>
          )}
          {activeTab === 'content' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Content Management</h2>
              <p className="text-gray-600">Content management interface will be implemented here</p>
            </div>
          )}
          {activeTab === 'products' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Products & Pricing</h2>
              <p className="text-gray-600">Products and pricing management interface will be implemented here</p>
            </div>
          )}
          {activeTab === 'payments' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Payments & Orders</h2>
              <p className="text-gray-600">Payments and orders management interface will be implemented here</p>
            </div>
          )}
          {activeTab === 'trading-tools' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Trading Tools & Resources</h2>
              <p className="text-gray-600">Trading tools management interface will be implemented here</p>
            </div>
          )}
          {activeTab === 'marketing' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Marketing & Leads</h2>
              <p className="text-gray-600">Marketing and leads management interface will be implemented here</p>
            </div>
          )}
          {activeTab === 'support' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Support System</h2>
              <p className="text-gray-600">Support ticketing system will be implemented here</p>
            </div>
          )}
          {activeTab === 'certificates' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Certificates & Achievements</h2>
              <p className="text-gray-600">Certificate management interface will be implemented here</p>
            </div>
          )}
          {activeTab === 'settings' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Settings</h2>
              <p className="text-gray-600">Settings panel will be implemented here</p>
            </div>
          )}
          {activeTab === 'analytics' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Analytics & Reports</h2>
              <p className="text-gray-600">Analytics dashboard will be implemented here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
