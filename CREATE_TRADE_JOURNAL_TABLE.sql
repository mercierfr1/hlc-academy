-- Create trade_journal table for storing trade data
CREATE TABLE public.trade_journal (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    
    -- Trade details
    symbol TEXT NOT NULL,
    side TEXT NOT NULL CHECK (side IN ('LONG', 'SHORT')),
    size DECIMAL(10,2) NOT NULL DEFAULT 0,
    rr DECIMAL(10,2) NOT NULL DEFAULT 0, -- risk:reward ratio
    pnl DECIMAL(10,2) NOT NULL DEFAULT 0, -- profit/loss
    
    -- Trade metadata
    entry_price DECIMAL(10,2),
    exit_price DECIMAL(10,2),
    quantity DECIMAL(10,2),
    tags TEXT[] DEFAULT '{}',
    notes TEXT,
    
    -- Emotional/learning data
    emotions TEXT[] DEFAULT '{}',
    lessons TEXT,
    
    -- Journal integration
    journal_id TEXT,
    
    -- Timestamps
    trade_date TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    UNIQUE(user_id, email, trade_date, symbol, side)
);

-- Enable Row Level Security
ALTER TABLE public.trade_journal ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own trade journal" ON public.trade_journal
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own trade journal" ON public.trade_journal
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own trade journal" ON public.trade_journal
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own trade journal" ON public.trade_journal
    FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_trade_journal_user_id ON public.trade_journal(user_id);
CREATE INDEX idx_trade_journal_email ON public.trade_journal(email);
CREATE INDEX idx_trade_journal_trade_date ON public.trade_journal(trade_date);
CREATE INDEX idx_trade_journal_symbol ON public.trade_journal(symbol);
CREATE INDEX idx_trade_journal_side ON public.trade_journal(side);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_trade_journal_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_trade_journal_updated_at
    BEFORE UPDATE ON public.trade_journal
    FOR EACH ROW
    EXECUTE FUNCTION update_trade_journal_updated_at();
