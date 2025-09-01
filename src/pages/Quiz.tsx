import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Quiz() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Trading Quiz</h1>
        <Card>
          <CardHeader>
            <CardTitle>Test Your Knowledge</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Take quizzes to test your understanding of trading concepts</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
