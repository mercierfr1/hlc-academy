import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, BookOpen, Users, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Success() {
  const [searchParams] = useSearchParams();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = searchParams.get('session_id');
    setSessionId(session);
    
    // Simulate loading
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Processing your subscription...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-background rounded flex items-center justify-center">
              <span className="text-primary font-bold text-lg">HLC</span>
            </div>
            <span className="font-bold text-xl">ACADEMY</span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>

          {/* Success Message */}
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Welcome to HLC Academy!
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Your subscription is now active. You have full access to all premium features and content.
          </p>

          {/* Session Info */}
          {sessionId && (
            <div className="bg-muted rounded-lg p-4 mb-8">
              <p className="text-sm text-muted-foreground">
                Session ID: <code className="bg-background px-2 py-1 rounded text-xs">{sessionId}</code>
              </p>
            </div>
          )}

          {/* Next Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-lg">Start Learning</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Access all premium courses and trading strategies
                </p>
                <Button asChild className="w-full">
                  <Link to="/dashboard">
                    Go to Dashboard
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle className="text-lg">Join Community</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Connect with other traders and get support
                </p>
                <Button variant="outline" asChild className="w-full">
                  <Link to="/trading">
                    Trading Dashboard
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle className="text-lg">Track Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Monitor your learning and trading performance
                </p>
                <Button variant="outline" asChild className="w-full">
                  <Link to="/progress">
                    View Progress
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Additional Info */}
          <div className="bg-muted rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold mb-2">What's Next?</h3>
            <ul className="text-left text-muted-foreground space-y-2">
              <li>• Check your email for a welcome message and getting started guide</li>
              <li>• Complete your profile setup in the dashboard</li>
              <li>• Join our Discord community for real-time support</li>
              <li>• Schedule your first 1-on-1 coaching session (Premium plans)</li>
            </ul>
          </div>

          {/* Support */}
          <div className="text-center">
            <p className="text-muted-foreground mb-4">
              Need help getting started? We're here to support you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" asChild>
                <Link to="/dashboard">Get Started</Link>
              </Button>
              <Button variant="ghost" asChild>
                <a href="mailto:support@hlcacademy.com">Contact Support</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
