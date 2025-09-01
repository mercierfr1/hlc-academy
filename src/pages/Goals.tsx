import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Goals() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Trading Goals</h1>
        <Card>
          <CardHeader>
            <CardTitle>Set Your Goals</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Set and track your trading goals</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
