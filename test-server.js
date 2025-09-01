const express = require('express');
const app = express();

app.use(express.json());

// Test health endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Test Stripe endpoint
app.post('/create-checkout-session', (req, res) => {
  res.json({ 
    id: 'test_session_123',
    message: 'Test checkout session created' 
  });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🧪 Test server running on port ${PORT}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/health`);
});
