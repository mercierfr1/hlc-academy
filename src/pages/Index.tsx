import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-background rounded flex items-center justify-center">
                <span className="text-primary font-bold text-lg">HLC</span>
              </div>
              <span className="font-bold text-xl">ACADEMY</span>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <Link to="#" className="hover:text-primary-foreground/80 transition-colors">Traders</Link>
              <Link to="#" className="hover:text-primary-foreground/80 transition-colors">Investors</Link>
              <Link to="#" className="hover:text-primary-foreground/80 transition-colors">Institutions</Link>
              <Link to="/pricing" className="hover:text-primary-foreground/80 transition-colors">Pricing</Link>
              <Link to="#" className="hover:text-primary-foreground/80 transition-colors">Resources</Link>
              <Button variant="secondary" size="sm" asChild>
                <Link to="/auth">Sign Up</Link>
              </Button>
              <Button variant="outline" size="sm" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
                <Link to="/auth">Login</Link>
              </Button>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-muted py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-primary font-semibold mb-4 uppercase tracking-wide">MASTER SUPPLY & DEMAND TRADING</p>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Profitable trading guaranteed or your money back
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              HLC Academy provides everything you need to master supply and demand trading strategies and achieve consistent profitability. No need for Expensive courses or mentors.
            </p>
            <Button size="lg" className="text-lg px-8 py-3" asChild>
              <Link to="/pricing">Start free 3-day trial</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <h3 className="text-4xl font-bold text-primary mb-2">92%</h3>
              <p className="text-muted-foreground">The proportion of traders that achieve consistent profitability after completing HLC Academy</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold text-primary mb-2">1 in 4</h3>
              <p className="text-muted-foreground">Retail traders using HLC Academy to master supply and demand</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold text-primary mb-2">50+</h3>
              <p className="text-muted-foreground">Trading firms using HLC Academy to train their traders</p>
            </div>
          </div>
        </div>
      </section>

      {/* GCSE Chemistry Banner */}
      <section className="bg-muted py-8">
        <div className="container mx-auto px-4">
          <Card className="border-l-4 border-l-primary">
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Advanced Supply & Demand Training:</h3>
                  <p className="text-muted-foreground">Now available from £30/week</p>
                </div>
                <Button variant="outline" asChild>
                  <Link to="/pricing">Learn More</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Press Section */}
      <section className="py-8 bg-background">
        <div className="container mx-auto px-4">
          <p className="text-center text-muted-foreground text-sm mb-6 uppercase tracking-wide">AS SEEN IN</p>
          <div className="flex justify-center items-center space-x-8 opacity-60">
            <span className="text-lg font-bold">Forbes</span>
            <span className="text-lg font-bold">Evening Standard</span>
            <span className="text-lg font-bold">THE TIMES</span>
            <span className="text-lg font-bold">FT</span>
            <span className="text-lg font-bold">SCHOOLS WEEK</span>
            <span className="text-lg font-bold">METRO</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-primary font-semibold mb-4 uppercase tracking-wide">WHAT YOU GET</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Learning made simple</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-950 rounded-lg flex items-center justify-center mb-4">
                  <div className="w-8 h-8 bg-blue-500 rounded"></div>
                </div>
                <h3 className="text-xl font-semibold mb-3">Professional Trading Content</h3>
                <p className="text-muted-foreground mb-4">
                  Our interactive videos cover all supply and demand concepts in bite-sized lessons, designed for maximum retention and practical application.
                </p>
                <p className="text-sm text-muted-foreground">
                  Each video is created by professional traders with over 10 years of market experience.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-950 rounded-lg flex items-center justify-center mb-4">
                  <div className="w-8 h-8 bg-primary rounded"></div>
                </div>
                <h3 className="text-xl font-semibold mb-3">Trading Performance Analytics</h3>
                <p className="text-muted-foreground">
                  Track your understanding of supply and demand concepts, monitor practice trades, and see detailed analytics on your trading performance and areas for improvement.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-orange-100 dark:bg-orange-950 rounded-lg flex items-center justify-center mb-4">
                  <div className="w-8 h-8 bg-orange-500 rounded"></div>
                </div>
                <h3 className="text-xl font-semibold mb-3">Personalized Trading Plans</h3>
                <p className="text-muted-foreground">
                  Our AI-powered system identifies your trading weaknesses and creates personalized study plans to improve your supply and demand analysis skills.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-950 rounded-lg flex items-center justify-center mb-4">
                  <div className="w-8 h-8 bg-purple-500 rounded"></div>
                </div>
                <h3 className="text-xl font-semibold mb-3">Market-Specific Strategies</h3>
                <p className="text-muted-foreground">
                  Our courses cover specific supply and demand strategies for Forex, Stocks, Crypto, and Commodities - everything you need, nothing you don't.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-teal-100 dark:bg-teal-950 rounded-lg flex items-center justify-center mb-4">
                  <div className="w-8 h-8 bg-teal-500 rounded"></div>
                </div>
                <h3 className="text-xl font-semibold mb-3">Live Market Analysis</h3>
                <p className="text-muted-foreground">
                  Practice with real market scenarios and get step-by-step walkthroughs of live trades, showing you exactly how to identify and trade supply and demand zones.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-pink-100 dark:bg-pink-950 rounded-lg flex items-center justify-center mb-4">
                  <div className="w-8 h-8 bg-pink-500 rounded"></div>
                </div>
                <h3 className="text-xl font-semibold mb-3">24/7 Trading Mentor Support</h3>
                <p className="text-muted-foreground">
                  Get unlimited access to professional trading mentors via chat to help with market analysis, trade setups, and risk management questions.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Guarantee Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <p className="text-primary-foreground/80 font-semibold mb-4 uppercase tracking-wide">OUR PROFITABILITY GUARANTEE</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Every trader is guaranteed to achieve consistent profitability or your money back, regardless of experience level.
          </h2>
          <Button variant="secondary" size="lg" asChild>
            <Link to="/pricing">Learn More</Link>
          </Button>
        </div>
      </section>

      {/* Subjects Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-primary font-semibold mb-4 uppercase tracking-wide">WHAT WE COVER</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Trading Markets</h2>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              Master supply and demand trading across all major markets. Our strategies work on any timeframe and market condition, from scalping to swing trading.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-950 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-10 h-10 bg-green-500 rounded-full"></div>
                </div>
                <h3 className="text-xl font-semibold mb-2">Forex Trading</h3>
                <p className="text-muted-foreground mb-4">Major, Minor & Exotic Pairs</p>
                <Button variant="outline" className="w-full">Explore Forex</Button>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-20 h-20 bg-red-100 dark:bg-red-950 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-10 h-10 bg-red-500 rounded-full"></div>
                </div>
                <h3 className="text-xl font-semibold mb-2">Stock Trading</h3>
                <p className="text-muted-foreground mb-4">NYSE, NASDAQ, LSE & International Markets</p>
                <Button className="w-full" asChild>
                  <Link to="/dashboard">Explore Stocks</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-20 h-20 bg-orange-100 dark:bg-orange-950 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-10 h-10 bg-orange-500 rounded-full"></div>
                </div>
                <h3 className="text-xl font-semibold mb-2">Cryptocurrency</h3>
                <p className="text-muted-foreground mb-4">Bitcoin, Ethereum & Altcoins</p>
                <Button variant="outline" className="w-full">Explore Crypto</Button>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-20 h-20 bg-purple-100 dark:bg-purple-950 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-10 h-10 bg-purple-500 rounded-full"></div>
                </div>
                <h3 className="text-xl font-semibold mb-2">Commodities</h3>
                <p className="text-muted-foreground mb-4">Gold, Oil, Silver & Agricultural</p>
                <Button variant="outline" className="w-full">Explore Commodities</Button>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-20 h-20 bg-blue-100 dark:bg-blue-950 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-10 h-10 bg-blue-500 rounded-full"></div>
                </div>
                <h3 className="text-xl font-semibold mb-2">Indices Trading</h3>
                <p className="text-muted-foreground mb-4">S&P 500, FTSE, DAX & More</p>
                <Button variant="outline" className="w-full">Explore Indices</Button>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-950 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-10 h-10 bg-green-600 rounded-full"></div>
                </div>
                <h3 className="text-xl font-semibold mb-2">Options Trading</h3>
                <p className="text-muted-foreground mb-4">Calls, Puts & Advanced Strategies</p>
                <Button variant="outline" className="w-full">Explore Options</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Sign Up Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <Card className="max-w-md mx-auto bg-background text-foreground">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-center mb-6">Start your trading journey</h2>
              <div className="space-y-4">
                <Input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full"
                />
                <div className="flex items-center space-x-2 text-sm">
                  <input type="checkbox" id="age-confirm" className="rounded" />
                  <label htmlFor="age-confirm" className="text-muted-foreground">
                    I confirm I am at least 18 years old and understand trading risks
                  </label>
                </div>
                <Button className="w-full" size="lg" asChild>
                  <Link to="/pricing">Sign up now</Link>
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  HLC Academy will never share your details with third parties. Trading involves risk.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-lg">HLC</span>
                </div>
                <span className="font-bold text-xl">ACADEMY</span>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Trading Markets</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/pricing" className="hover:text-background">Pricing</Link></li>
                <li><Link to="#" className="hover:text-background">Forex Trading</Link></li>
                <li><Link to="#" className="hover:text-background">Stock Trading</Link></li>
                <li><Link to="#" className="hover:text-background">Cryptocurrency</Link></li>
                <li><Link to="/dashboard" className="hover:text-background">Supply & Demand Course</Link></li>
                <li><Link to="#" className="hover:text-background">Commodities</Link></li>
                <li><Link to="#" className="hover:text-background">Options Trading</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Working at HLC Academy</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="#" className="hover:text-background">Careers</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="#" className="hover:text-background">Terms & Conditions</Link></li>
                <li><Link to="#" className="hover:text-background">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-muted mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>Copyright © HLC Academy Limited 2024. Registered company in England and Wales. Trading involves substantial risk and is not suitable for all investors.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
