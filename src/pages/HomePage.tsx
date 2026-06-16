import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { ArrowRight, TrendingUp, Zap, Shield, Smartphone, Lock, ChevronDown } from 'lucide-react';

export function HomePage() {
  const { user } = useAuth();
  const [openFAQ, setOpenFAQ] = React.useState<number | null>(0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-20 overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Trade Smarter.
            <br />
            <span className="bg-gradient-to-r from-amber-400 to-amber-500 bg-clip-text text-transparent">
              Move Faster.
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Multi-asset trading platform for crypto, stocks, and commodities. Real-time options trading with bank-grade security.
          </p>

          {/* Stats */}
          <div className="flex justify-center gap-8 mb-12 flex-wrap">
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-400">$2.8B+</div>
              <div className="text-slate-400">Daily Volume</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-400">50K+</div>
              <div className="text-slate-400">Active Traders</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">24/7</div>
              <div className="text-slate-400">Market Access</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              to="/register"
              className="px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              Start Trading <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/login"
              className="px-8 py-4 bg-slate-700/50 hover:bg-slate-700 text-white font-bold rounded-lg transition-all duration-200 border border-slate-600"
            >
              Sign In
            </Link>
          </div>

          {/* Live Markets Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full">
            <Zap className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span className="text-emerald-400 font-semibold">Live Markets</span>
          </div>
        </div>
      </section>

      {/* Market Ticker */}
      <section className="py-12 bg-slate-800/50 border-y border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-white mb-8">Live Markets</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { symbol: 'BTC', name: 'Bitcoin', price: 65432.10, change: 5.23, icon: '₿' },
              { symbol: 'ETH', name: 'Ethereum', price: 3450.80, change: 3.45, icon: 'Ξ' },
              { symbol: 'AAPL', name: 'Apple', price: 150.25, change: 2.15, icon: '🍎' },
              { symbol: 'GOLD', name: 'Gold', price: 2045.50, change: -1.23, icon: '🏆' },
              { symbol: 'TSLA', name: 'Tesla', price: 242.10, change: 4.87, icon: '⚡' },
              { symbol: 'OIL', name: 'Crude Oil', price: 78.45, change: -2.34, icon: '🛢️' },
            ].map((asset) => (
              <Link
                key={asset.symbol}
                to={user ? `/trade/${asset.symbol}` : '/login'}
                className="p-6 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 hover:border-amber-500/30 rounded-lg transition-all group cursor-pointer"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="text-2xl">{asset.icon}</div>
                  <span className={`text-sm font-bold px-2 py-1 rounded ${
                    asset.change >= 0
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {asset.change >= 0 ? '+' : ''}{asset.change}%
                  </span>
                </div>
                <h3 className="font-bold text-white text-lg">{asset.symbol}</h3>
                <p className="text-slate-400 text-sm mb-2">{asset.name}</p>
                <p className="text-2xl font-bold text-amber-400">${asset.price.toFixed(2)}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-4 text-center">Why Choose TradeVault?</h2>
          <p className="text-xl text-slate-400 text-center mb-16 max-w-2xl mx-auto">
            Industry-leading platform for modern traders
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: TrendingUp,
                title: 'Real-Time Analytics',
                description: 'Live market data, advanced charting, and predictive insights at your fingertips.',
              },
              {
                icon: Shield,
                title: 'Bank-Grade Security',
                description: 'Enterprise-level encryption, multi-factor authentication, and cold storage wallets.',
              },
              {
                icon: Smartphone,
                title: 'Trade Anywhere',
                description: 'Seamless experience across desktop, tablet, and mobile. Never miss a trade.',
              },
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="p-8 bg-slate-800/50 border border-slate-700/50 rounded-xl hover:border-amber-500/30 transition-all group"
                >
                  <div className="w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-amber-500/30 transition-colors">
                    <Icon className="w-6 h-6 text-amber-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-slate-400">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Platform Overview */}
      <section className="py-20 px-4 bg-slate-800/30">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-16 text-center">One Platform. Infinite Possibilities.</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">Unified Trading</h3>
              <ul className="space-y-4">
                {[
                  '🔹 Crypto: Bitcoin, Ethereum, and 6+ altcoins',
                  '🔹 Stocks: Blue-chip and growth stocks',
                  '🔹 Commodities: Gold, oil, agriculture futures',
                  '🔹 Options: Binary options with 15s-60s expiry',
                ].map((item, i) => (
                  <li key={i} className="text-slate-300 flex items-center gap-3">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gradient-to-br from-amber-500/10 to-emerald-500/10 rounded-xl p-8 border border-slate-700/50">
              <p className="text-slate-300 mb-4">
                Trade everything from a single, unified interface. No need to juggle multiple platforms. Switch between asset classes with a single click.
              </p>
              <div className="h-40 bg-slate-900/50 rounded-lg flex items-center justify-center border border-slate-700/30">
                <p className="text-slate-500">Live Trading Dashboard</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-16 text-center">Trusted by Traders</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: 'Alex Chen',
                role: 'Day Trader',
                text: 'TradeVault changed my trading game. The options interface is intuitive and the execution is lightning-fast.',
              },
              {
                name: 'Sarah Williams',
                role: 'Portfolio Manager',
                text: 'Best multi-asset platform I\'ve used. Real-time analytics and settlement tracking are phenomenal.',
              },
              {
                name: 'Marcus Johnson',
                role: 'Crypto Enthusiast',
                text: 'The combination of spot and options trading with live P&L tracking is exactly what I needed.',
              },
              {
                name: 'Emma Rodriguez',
                role: 'Swing Trader',
                text: 'Security is top-notch and the dashboard gives me everything I need to make informed decisions.',
              },
              {
                name: 'James Wilson',
                role: 'Options Trader',
                text: 'Binary options settlement is instant and transparent. Love the settlement modal notifications.',
              },
              {
                name: 'Lisa Anderson',
                role: 'Commodity Trader',
                text: 'Finally a platform that takes commodities seriously. Charts and data are outstanding.',
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="p-6 bg-slate-800/50 border border-slate-700/50 rounded-xl hover:border-amber-500/30 transition-all"
              >
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-amber-400">★</span>
                  ))}
                </div>
                <p className="text-slate-300 mb-4">&quot;{testimonial.text}&quot;</p>
                <div>
                  <p className="font-bold text-white">{testimonial.name}</p>
                  <p className="text-sm text-slate-400">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-emerald-500/20 blur-3xl" />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Trade Smart?</h2>
          <p className="text-xl text-slate-300 mb-8">
            Join thousands of traders using TradeVault. Sign up now and get started.
          </p>
          <Link
            to="/register"
            className="inline-block px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Create Account <ArrowRight className="w-5 h-5 inline ml-2" />
          </Link>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-4 bg-slate-800/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-16 text-center">Frequently Asked Questions</h2>

          <div className="space-y-4">
            {[
              {
                question: 'Is my account secure?',
                answer: 'Yes. We use bank-grade AES-256 encryption, multi-factor authentication, and cold storage wallets. Your funds and data are protected by industry-leading security standards.',
              },
              {
                question: 'What trading fees apply?',
                answer: 'We offer competitive spreads starting at 0.1% for spot trading and 2-5% for options trading depending on your tier. No hidden fees or commissions.',
              },
              {
                question: 'Can I trade on mobile?',
                answer: 'Absolutely. TradeVault is fully responsive and works seamlessly on all devices. Download our mobile app or trade directly from your browser.',
              },
              {
                question: 'How fast is options settlement?',
                answer: 'Options settle instantly when the timer expires. Payouts are credited to your balance within seconds, and you\'ll see a settlement notification immediately.',
              },
              {
                question: 'What assets can I trade?',
                answer: 'You can trade 8 cryptocurrencies (BTC, ETH, SOL, XRP, ADA, DOT, AVAX, MATIC), 8 stocks (AAPL, TSLA, MSFT, GOOGL, AMZN, NVDA, META, JPM), and 8 commodities (Gold, Silver, Oil, Gas, Copper, Corn, Soybeans, Wheat).',
              },
              {
                question: 'Is there a minimum deposit?',
                answer: 'No minimum deposit required. Start trading with as little as $10. Most traders start with $100-$1,000 to have adequate buying power.',
              },
            ].map((faq, index) => (
              <div
                key={index}
                className="bg-slate-800/50 border border-slate-700/50 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-700/50 transition-colors"
                >
                  <h3 className="font-bold text-white text-left">{faq.question}</h3>
                  <ChevronDown
                    className={`w-5 h-5 text-amber-400 transition-transform ${
                      openFAQ === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {openFAQ === index && (
                  <div className="px-6 py-4 border-t border-slate-700/50 bg-slate-900/50">
                    <p className="text-slate-300">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900/50 border-t border-slate-700/50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-500" />
                TradeVault
              </h4>
              <p className="text-slate-400 text-sm">Multi-asset trading platform for the modern trader.</p>
            </div>

            <div>
              <h4 className="font-bold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Disclaimer</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-700/50 pt-8">
            <p className="text-center text-slate-400 text-sm">
              © 2024 TradeVault. All rights reserved. | Risk Disclaimer: Trading involves substantial risk of loss. Options trading is highly risky. Past performance does not guarantee future results.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
