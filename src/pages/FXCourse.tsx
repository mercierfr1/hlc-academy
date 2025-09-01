import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { fxCourse } from '@/data/fxCourseData';

export default function FXCourse() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">{fxCourse.title}</h1>
        <p className="text-muted-foreground mb-8">{fxCourse.description}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {fxCourse.modules.map((module) => (
            <Card key={module.id}>
              <CardHeader>
                <CardTitle>{module.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{module.description}</p>
                <p className="text-sm">{module.lessons.length} lessons</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
