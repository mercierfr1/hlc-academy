'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { authService, User } from '@/lib/auth'

export default function TestSupabasePage() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [testResults, setTestResults] = useState<Record<string, any>>({})

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      setIsLoading(true)
      const result = await authService.getCurrentUser()
      if (result.user) {
        setUser(result.user)
      }
    } catch (error) {
      setError('Failed to check authentication')
      console.error('Auth check error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const testAPI = async (endpoint: string, method: string = 'GET', body?: any) => {
    try {
      const options: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      }

      if (body) {
        options.body = JSON.stringify(body)
      }

      const response = await fetch(endpoint, options)
      const data = await response.json()

      setTestResults(prev => ({
        ...prev,
        [endpoint]: {
          status: response.status,
          success: response.ok,
          data: data
        }
      }))

      return data
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        [endpoint]: {
          status: 'ERROR',
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      }))
    }
  }

  const runAllTests = async () => {
    setTestResults({})
    
    // Test API endpoints
    await testAPI('/api/courses')
    await testAPI('/api/stats')
    await testAPI('/api/trades')
    await testAPI('/api/goals')
    
    if (user) {
      await testAPI('/api/auth/user')
    }
  }

  const handleSignOut = async () => {
    try {
      await authService.signOut()
      setUser(null)
      setTestResults({})
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Supabase Backend Test</h1>

        {/* Authentication Status */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Authentication Status</CardTitle>
          </CardHeader>
          <CardContent>
            {user ? (
              <div className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h3 className="font-semibold text-green-800">✅ Authenticated</h3>
                  <p className="text-green-700">User: {user.email}</p>
                  <p className="text-green-700">Plan: {user.plan}</p>
                  <p className="text-green-700">Level: {user.level} ({user.xp_points} XP)</p>
                </div>
                <Button onClick={handleSignOut} variant="secondary">
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h3 className="font-semibold text-yellow-800">⚠️ Not Authenticated</h3>
                  <p className="text-yellow-700">Please sign in to test authenticated endpoints.</p>
                </div>
                <Button onClick={() => window.location.href = '/login'}>
                  Go to Login
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* API Tests */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>API Endpoint Tests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button onClick={runAllTests} className="w-full">
                Run All Tests
              </Button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button onClick={() => testAPI('/api/courses')} variant="secondary">
                  Test Courses API
                </Button>
                <Button onClick={() => testAPI('/api/stats')} variant="secondary">
                  Test Stats API
                </Button>
                <Button onClick={() => testAPI('/api/trades')} variant="secondary">
                  Test Trades API
                </Button>
                <Button onClick={() => testAPI('/api/goals')} variant="secondary">
                  Test Goals API
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Test Results */}
        {Object.keys(testResults).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(testResults).map(([endpoint, result]) => (
                  <div key={endpoint} className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2">{endpoint}</h3>
                    <div className={`inline-flex items-center px-2 py-1 rounded text-sm ${
                      result.success 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {result.success ? '✅ SUCCESS' : '❌ FAILED'}
                    </div>
                    {result.status && (
                      <p className="text-sm text-gray-600 mt-1">
                        Status: {result.status}
                      </p>
                    )}
                    <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                      {JSON.stringify(result.data || result.error, null, 2)}
                    </pre>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Environment Check */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Environment Check</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span>Supabase URL:</span>
                <span className={`px-2 py-1 rounded text-sm ${
                  process.env.NEXT_PUBLIC_SUPABASE_URL 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Supabase Anon Key:</span>
                <span className={`px-2 py-1 rounded text-sm ${
                  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="mt-8 flex space-x-4">
          <Button onClick={() => window.location.href = '/'}>
            Back to Home
          </Button>
          <Button onClick={() => window.location.href = '/trading-dashboard'} variant="secondary">
            Go to Dashboard
          </Button>
        </div>
      </div>
    </div>
  )
}
