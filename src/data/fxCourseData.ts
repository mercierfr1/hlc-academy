export interface Lesson {
  id: string;
  title: string;
  slug: string;
  duration: number;
  xpValue: number;
  isLocked: boolean;
  description: string;
  videoUrl?: string;
}

export interface Module {
  id: string;
  title: string;
  slug: string;
  description: string;
  lessons: Lesson[];
}

export const fxCourse = {
  id: 'fx-trading',
  title: 'Forex Trading Mastery',
  description: 'Master supply and demand trading in the forex market',
  modules: [
    {
      id: 'module-1',
      title: 'Introduction to Supply & Demand',
      slug: 'introduction-supply-demand',
      description: 'Learn the fundamentals of supply and demand trading',
      lessons: [
        {
          id: 'lesson-1-1',
          title: 'What is Supply and Demand?',
          slug: 'what-is-supply-demand',
          duration: 15,
          xpValue: 10,
          isLocked: false,
          description: 'Understanding the basic concepts of supply and demand in trading'
        },
        {
          id: 'lesson-1-2',
          title: 'Identifying Supply Zones',
          slug: 'identifying-supply-zones',
          duration: 20,
          xpValue: 15,
          isLocked: false,
          description: 'How to identify and mark supply zones on your charts'
        },
        {
          id: 'lesson-1-3',
          title: 'Identifying Demand Zones',
          slug: 'identifying-demand-zones',
          duration: 20,
          xpValue: 15,
          isLocked: false,
          description: 'How to identify and mark demand zones on your charts'
        }
      ]
    },
    {
      id: 'module-2',
      title: 'Advanced Supply & Demand Concepts',
      slug: 'advanced-supply-demand',
      description: 'Advanced techniques for supply and demand trading',
      lessons: [
        {
          id: 'lesson-2-1',
          title: 'Zone Quality Assessment',
          slug: 'zone-quality-assessment',
          duration: 25,
          xpValue: 20,
          isLocked: true,
          description: 'How to assess the quality of supply and demand zones'
        },
        {
          id: 'lesson-2-2',
          title: 'Multiple Timeframe Analysis',
          slug: 'multiple-timeframe-analysis',
          duration: 30,
          xpValue: 25,
          isLocked: true,
          description: 'Using multiple timeframes to confirm supply and demand zones'
        }
      ]
    }
  ]
};
