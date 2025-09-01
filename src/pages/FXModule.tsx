import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { fxCourse } from '@/data/fxCourseData';

export default function FXModule() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Module Details</h1>
        <Card>
          <CardHeader>
            <CardTitle>Module Content</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Module lessons and content will be displayed here</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
