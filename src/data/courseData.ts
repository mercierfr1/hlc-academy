import { Module } from "@/types/course";

export const SUPPLY_DEMAND_COURSE: Module[] = [
  {
    id: "fundamentals",
    title: "Supply & Demand Fundamentals",
    description: "Learn the basic principles of supply and demand analysis",
    icon: "📊",
    lessons: [
      {
        id: "intro-supply-demand",
        title: "Introduction to Supply & Demand",
        duration: 12,
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        quizzes: [
          {
            id: "q1",
            question: "What happens to price when demand increases and supply stays constant?",
            options: ["Price decreases", "Price increases", "Price stays the same", "Price becomes volatile"],
            correctAnswer: 1,
            timeInVideo: 480 // 8 minutes
          }
        ],
        completed: false,
        watchedPercentage: 0,
        quizzesCompleted: 0
      },
      {
        id: "market-structure",
        title: "Understanding Market Structure",
        duration: 15,
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
        quizzes: [
          {
            id: "q2",
            question: "Which of these indicates strong demand in the market?",
            options: ["Multiple rejection at resistance", "Break of key support", "Higher highs and higher lows", "Ranging price action"],
            correctAnswer: 2,
            timeInVideo: 600
          }
        ],
        completed: false,
        watchedPercentage: 0,
        quizzesCompleted: 0
      }
    ],
    completedLessons: 0,
    totalLessons: 2,
    progress: 0
  },
  {
    id: "price-action",
    title: "Price Action Analysis",
    description: "Master reading price movements and market psychology",
    icon: "📈",
    lessons: [
      {
        id: "candlestick-patterns",
        title: "Candlestick Patterns & Market Psychology",
        duration: 18,
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        quizzes: [
          {
            id: "q3",
            question: "A doji candlestick pattern typically indicates:",
            options: ["Strong bullish momentum", "Strong bearish momentum", "Market indecision", "High volatility"],
            correctAnswer: 2,
            timeInVideo: 720
          }
        ],
        completed: false,
        watchedPercentage: 0,
        quizzesCompleted: 0
      },
      {
        id: "support-resistance",
        title: "Support & Resistance Levels",
        duration: 20,
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        quizzes: [
          {
            id: "q4",
            question: "What makes a support or resistance level more significant?",
            options: ["The number of times it's been tested", "How recent it was formed", "The volume at that level", "All of the above"],
            correctAnswer: 3,
            timeInVideo: 900
          }
        ],
        completed: false,
        watchedPercentage: 0,
        quizzesCompleted: 0
      }
    ],
    completedLessons: 0,
    totalLessons: 2,
    progress: 0
  },
  {
    id: "zones",
    title: "Supply & Demand Zones",
    description: "Identify and trade high-probability zones",
    icon: "🎯",
    lessons: [
      {
        id: "zone-identification",
        title: "Identifying Supply & Demand Zones",
        duration: 22,
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        quizzes: [
          {
            id: "q5",
            question: "A fresh supply zone is characterized by:",
            options: ["Multiple touches without breaking", "A sharp move away from the zone", "High volume consolidation", "Long-term price respect"],
            correctAnswer: 1,
            timeInVideo: 840
          }
        ],
        completed: false,
        watchedPercentage: 0,
        quizzesCompleted: 0
      },
      {
        id: "zone-quality",
        title: "Assessing Zone Quality & Strength",
        duration: 16,
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        quizzes: [
          {
            id: "q6",
            question: "Which factor makes a demand zone stronger?",
            options: ["The zone is very wide", "Multiple previous rejections from the zone", "The zone is very narrow", "The zone is old"],
            correctAnswer: 2,
            timeInVideo: 660
          }
        ],
        completed: false,
        watchedPercentage: 0,
        quizzesCompleted: 0
      }
    ],
    completedLessons: 0,
    totalLessons: 2,
    progress: 0
  },
  {
    id: "trading-strategies",
    title: "Trading Strategies",
    description: "Develop profitable trading strategies using S&D",
    icon: "💡",
    lessons: [
      {
        id: "entry-techniques",
        title: "Entry Techniques & Timing",
        duration: 25,
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        quizzes: [
          {
            id: "q7",
            question: "The best entry signal at a demand zone is:",
            options: ["Immediate buy at zone touch", "Wait for bullish confirmation", "Enter on volume spike", "Use limit orders only"],
            correctAnswer: 1,
            timeInVideo: 1080
          }
        ],
        completed: false,
        watchedPercentage: 0,
        quizzesCompleted: 0
      },
      {
        id: "risk-management",
        title: "Risk Management & Position Sizing",
        duration: 19,
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
        quizzes: [
          {
            id: "q8",
            question: "What should your maximum risk per trade be?",
            options: ["10% of account", "5% of account", "1-2% of account", "No limit if confident"],
            correctAnswer: 2,
            timeInVideo: 780
          }
        ],
        completed: false,
        watchedPercentage: 0,
        quizzesCompleted: 0
      }
    ],
    completedLessons: 0,
    totalLessons: 2,
    progress: 0
  },
  {
    id: "advanced-concepts",
    title: "Advanced Concepts",
    description: "Advanced supply and demand trading techniques",
    icon: "🚀",
    lessons: [
      {
        id: "multi-timeframe",
        title: "Multi-Timeframe Analysis",
        duration: 28,
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
        quizzes: [
          {
            id: "q9",
            question: "When trading daily zones, which timeframe should you use for entries?",
            options: ["Daily chart", "4-hour chart", "1-hour or lower", "Weekly chart"],
            correctAnswer: 2,
            timeInVideo: 1200
          }
        ],
        completed: false,
        watchedPercentage: 0,
        quizzesCompleted: 0
      },
      {
        id: "market-context",
        title: "Market Context & News Impact",
        duration: 21,
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
        quizzes: [
          {
            id: "q10",
            question: "During high-impact news, supply and demand zones:",
            options: ["Become more reliable", "May be invalidated quickly", "Should be traded aggressively", "Are not affected"],
            correctAnswer: 1,
            timeInVideo: 900
          }
        ],
        completed: false,
        watchedPercentage: 0,
        quizzesCompleted: 0
      }
    ],
    completedLessons: 0,
    totalLessons: 2,
    progress: 0
  },
  {
    id: "psychology",
    title: "Trading Psychology",
    description: "Master the mental game of trading",
    icon: "🧠",
    lessons: [
      {
        id: "emotional-control",
        title: "Emotional Control & Discipline",
        duration: 17,
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4",
        quizzes: [
          {
            id: "q11",
            question: "The biggest enemy of a supply and demand trader is:",
            options: ["Market volatility", "Lack of patience", "Technical indicators", "High spreads"],
            correctAnswer: 1,
            timeInVideo: 720
          }
        ],
        completed: false,
        watchedPercentage: 0,
        quizzesCompleted: 0
      },
      {
        id: "building-confidence",
        title: "Building Trading Confidence",
        duration: 14,
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4",
        quizzes: [
          {
            id: "q12",
            question: "Confidence in trading comes from:",
            options: ["Large winning trades", "Consistent execution of your plan", "Following other traders", "Using many indicators"],
            correctAnswer: 1,
            timeInVideo: 600
          }
        ],
        completed: false,
        watchedPercentage: 0,
        quizzesCompleted: 0
      }
    ],
    completedLessons: 0,
    totalLessons: 2,
    progress: 0
  }
];