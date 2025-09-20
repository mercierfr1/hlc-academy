-- Insert sample courses
INSERT INTO public.courses (id, title, description, thumbnail_url, duration_minutes, difficulty_level, xp_reward, is_premium, required_plan, order_index) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Introduction to Supply & Demand', 'Learn the fundamentals of institutional supply and demand zones in trading.', '/images/courses/supply-demand-intro.jpg', 45, 1, 100, false, 'Kickstart', 1),
('550e8400-e29b-41d4-a716-446655440002', 'Market Structure Analysis', 'Deep dive into market structure and how institutions move price.', '/images/courses/market-structure.jpg', 60, 2, 150, false, 'Kickstart', 2),
('550e8400-e29b-41d4-a716-446655440003', 'Advanced Order Flow', 'Master reading order flow and understanding institutional behavior.', '/images/courses/order-flow.jpg', 90, 3, 200, true, 'Scale Up', 3),
('550e8400-e29b-41d4-a716-446655440004', 'Psychology & Bias Management', 'Overcome cognitive biases and develop a trader''s mindset.', '/images/courses/psychology.jpg', 75, 2, 175, false, 'Kickstart', 4),
('550e8400-e29b-41d4-a716-446655440005', 'Risk Management Mastery', 'Advanced risk management techniques used by professional traders.', '/images/courses/risk-management.jpg', 120, 4, 250, true, 'Mastery', 5),
('550e8400-e29b-41d4-a716-446655440006', 'Algorithmic Trading Concepts', 'Understanding algorithmic trading and market microstructure.', '/images/courses/algorithmic.jpg', 150, 5, 300, true, 'Mastery', 6);

-- Insert course sections for the first course
INSERT INTO public.course_sections (course_id, title, description, content, video_url, duration_minutes, order_index) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'What is Supply & Demand?', 'Understanding the basic concepts', 'Supply and demand zones are areas where price has previously reversed or paused significantly. These zones represent areas of institutional interest where large players have placed orders.', 'https://example.com/videos/supply-demand-1.mp4', 15, 1),
('550e8400-e29b-41d4-a716-446655440001', 'Identifying Supply Zones', 'How to spot supply zones on charts', 'Supply zones are areas where selling pressure is strong. Look for areas where price has previously rejected and moved lower multiple times.', 'https://example.com/videos/supply-demand-2.mp4', 15, 2),
('550e8400-e29b-41d4-a716-446655440001', 'Identifying Demand Zones', 'How to spot demand zones on charts', 'Demand zones are areas where buying pressure is strong. Look for areas where price has previously bounced and moved higher multiple times.', 'https://example.com/videos/supply-demand-3.mp4', 15, 3);

-- Insert course sections for the second course
INSERT INTO public.course_sections (course_id, title, description, content, video_url, duration_minutes, order_index) VALUES
('550e8400-e29b-41d4-a716-446655440002', 'Market Structure Basics', 'Understanding market structure', 'Market structure refers to the way price moves and creates highs and lows. Understanding structure helps predict future price movements.', 'https://example.com/videos/structure-1.mp4', 20, 1),
('550e8400-e29b-41d4-a716-446655440002', 'Higher Highs and Higher Lows', 'Uptrend structure', 'In an uptrend, we see higher highs and higher lows. This indicates bullish market structure and continuation of the trend.', 'https://example.com/videos/structure-2.mp4', 20, 2),
('550e8400-e29b-41d4-a716-446655440002', 'Lower Highs and Lower Lows', 'Downtrend structure', 'In a downtrend, we see lower highs and lower lows. This indicates bearish market structure and continuation of the downtrend.', 'https://example.com/videos/structure-3.mp4', 20, 3);

-- Insert sample quizzes
INSERT INTO public.quizzes (course_id, title, description, questions, passing_score, time_limit_minutes) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Supply & Demand Quiz', 'Test your understanding of supply and demand concepts', 
'[
  {
    "id": 1,
    "question": "What is a supply zone?",
    "type": "multiple_choice",
    "options": [
      "An area where buying pressure is strong",
      "An area where selling pressure is strong",
      "An area with no trading activity",
      "An area with high volatility"
    ],
    "correct_answer": 1,
    "explanation": "A supply zone is an area where selling pressure is strong, typically where price has previously rejected and moved lower."
  },
  {
    "id": 2,
    "question": "What should you look for when identifying a demand zone?",
    "type": "multiple_choice",
    "options": [
      "Areas where price has bounced multiple times",
      "Areas with high volume",
      "Areas with low volatility",
      "Areas with no price action"
    ],
    "correct_answer": 0,
    "explanation": "Demand zones are typically areas where price has bounced and moved higher multiple times, indicating strong buying interest."
  },
  {
    "id": 3,
    "question": "True or False: Supply and demand zones are always exact price levels.",
    "type": "true_false",
    "options": ["True", "False"],
    "correct_answer": 1,
    "explanation": "Supply and demand zones are areas or ranges, not exact price levels. They represent zones of interest rather than specific prices."
  }
]', 70, 10),

('550e8400-e29b-41d4-a716-446655440002', 'Market Structure Quiz', 'Test your knowledge of market structure analysis',
'[
  {
    "id": 1,
    "question": "What characterizes an uptrend in market structure?",
    "type": "multiple_choice",
    "options": [
      "Lower highs and lower lows",
      "Higher highs and higher lows",
      "Equal highs and equal lows",
      "No clear pattern"
    ],
    "correct_answer": 1,
    "explanation": "An uptrend is characterized by higher highs and higher lows, indicating bullish market structure."
  },
  {
    "id": 2,
    "question": "What does a break of market structure indicate?",
    "type": "multiple_choice",
    "options": [
      "Continuation of the current trend",
      "Potential trend reversal",
      "No change in market direction",
      "Increased volatility only"
    ],
    "correct_answer": 1,
    "explanation": "A break of market structure often indicates a potential trend reversal or significant change in market direction."
  }
]', 70, 8);

-- Insert sample trade journal entries (these will be associated with actual users when they sign up)
-- Note: These are just examples and will be replaced with real user data

-- Insert sample trading goals (these will be associated with actual users when they sign up)
-- Note: These are just examples and will be replaced with real user data
