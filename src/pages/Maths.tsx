import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Maths() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Mathematics for Trading</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Math</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Fundamental mathematical concepts for trading</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
