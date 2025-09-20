const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://hlcacademy.co.uk',
    'https://www.hlcacademy.co.uk',
  ],
  credentials: true,
}));
app.use(express.json());

// Mock data
const users = [
  {
    id: '1',
    email: 'admin@hlcacademy.co.uk',
    firstName: 'Admin',
    lastName: 'User',
    role: 'SUPERADMIN',
    status: 'ACTIVE',
    createdAt: new Date(),
  },
  {
    id: '2',
    email: 'john@example.com',
    firstName: 'John',
    lastName: 'Trader',
    role: 'USER',
    status: 'ACTIVE',
    createdAt: new Date(),
  },
];

const courses = [
  {
    id: '1',
    title: 'Trading Fundamentals',
    description: 'Learn the basics of trading',
    slug: 'trading-fundamentals',
    status: 'PUBLISHED',
    createdAt: new Date(),
  },
];

const trades = [
  {
    id: '1',
    userId: '2',
    symbol: 'EURUSD',
    side: 'LONG',
    size: 1.0,
    entryPrice: 1.0850,
    exitPrice: 1.0920,
    pnl: 70,
    status: 'CLOSED',
    openedAt: new Date(),
  },
];

const payments = [
  {
    id: '1',
    userId: '2',
    amount: 97.00,
    currency: 'GBP',
    status: 'COMPLETED',
    createdAt: new Date(),
  },
];

// Routes
app.get('/api/v1/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'HLC Academy API',
    version: '1.0.0',
  });
});

app.get('/api/v1/health/detailed', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'HLC Academy API',
    version: '1.0.0',
    checks: {
      database: { status: 'healthy', message: 'Mock database connection' },
      redis: { status: 'healthy', message: 'Mock Redis connection' },
    },
  });
});

// Auth routes
app.post('/api/v1/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  if (email === 'admin@hlcacademy.co.uk' && password === 'admin123') {
    const user = users.find(u => u.email === email);
    res.json({
      accessToken: 'mock-jwt-token',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        status: user.status,
      },
    });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

app.get('/api/v1/auth/me', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (token === 'mock-jwt-token') {
    res.json(users[0]);
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
});

// Users routes
app.get('/api/v1/users', (req, res) => {
  res.json({
    users: users.map(user => ({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt,
    })),
    total: users.length,
  });
});

app.get('/api/v1/users/profile', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (token === 'mock-jwt-token') {
    res.json(users[0]);
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
});

// Courses routes
app.get('/api/v1/courses', (req, res) => {
  res.json({
    courses,
    total: courses.length,
  });
});

// Trading routes
app.get('/api/v1/trading/trades', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (token === 'mock-jwt-token') {
    res.json({
      trades,
      total: trades.length,
    });
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
});

app.get('/api/v1/trading/analytics', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (token === 'mock-jwt-token') {
    const totalPnL = trades.reduce((sum, trade) => sum + (trade.pnl || 0), 0);
    const winRate = trades.length > 0 
      ? (trades.filter(trade => (trade.pnl || 0) > 0).length / trades.length) * 100 
      : 0;

    res.json({
      totalTrades: trades.length,
      totalPnL: Math.round(totalPnL * 100) / 100,
      winRate: Math.round(winRate * 100) / 100,
    });
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
});

// Payments routes
app.get('/api/v1/payments', (req, res) => {
  res.json({
    payments,
    total: payments.length,
  });
});

// Analytics routes
app.get('/api/v1/analytics/dashboard', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (token === 'mock-jwt-token') {
    res.json({
      xp: {
        total: 150,
        today: 25,
      },
      trading: {
        totalTrades: trades.length,
        totalPnL: trades.reduce((sum, trade) => sum + (trade.pnl || 0), 0),
        winRate: 75,
      },
      goals: {
        active: 2,
      },
    });
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
});

app.get('/api/v1/analytics/admin/overview', (req, res) => {
  const totalRevenue = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const activeUsers = users.filter(user => user.status === 'ACTIVE').length;

  res.json({
    users: {
      total: users.length,
      active: activeUsers,
    },
    revenue: {
      total: Math.round(totalRevenue * 100) / 100,
      currency: 'GBP',
    },
    courses: {
      total: courses.length,
      enrollments: 0,
    },
    trading: {
      totalTrades: trades.length,
    },
  });
});

// Admin routes
app.get('/api/v1/admin/users', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (token === 'mock-jwt-token') {
    res.json({
      users: users.map(user => ({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        status: user.status,
        createdAt: user.createdAt,
      })),
      total: users.length,
    });
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 HLC Academy API running on port ${PORT}`);
  console.log(`📚 API available at http://localhost:${PORT}/api/v1`);
  console.log(`🔍 Health check: http://localhost:${PORT}/api/v1/health`);
});
