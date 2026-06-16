import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { LogOut, TrendingUp, TrendingDown, Wallet, History, Target, Eye, EyeOff } from 'lucide-react';

interface Profile {
  id: string;
  display_name: string;
  email: string;
  balance: number;
}

interface Portfolio {
  id: string;
  asset_symbol: string;
  asset_type: string;
  quantity: number;
  avg_price: number;
}

interface Trade {
  id: string;
  asset_symbol: string;
  trade_type: 'buy' | 'sell';
  quantity: number;
  price: number;
  total: number;
  created_at: string;
}

interface AssetPrice {
  [key: string]: number;
}

const ASSET_PRICES: AssetPrice = {
  'AAPL': 150.25,
  'GOOGL': 140.80,
  'MSFT': 380.50,
  'TSLA': 242.10,
  'AMZN': 175.30,
  'META': 320.40,
  'NVDA': 875.20,
  'BTC': 65432.10,
  'ETH': 3450.80,
  'SPY': 445.30,
};

export function DashboardPage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [portfolio, setPortfolio] = useState<Portfolio[]>([]);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBalance, setShowBalance] = useState(true);
  const [filter, setFilter] = useState<'all' | 'buy' | 'sell'>('all');

  useEffect(() => {
    if (!user) return;

    const loadDashboardData = async () => {
      try {
        // Load profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) throw profileError;
        setProfile(profileData);

        // Load portfolio
        const { data: portfolioData, error: portfolioError } = await supabase
          .from('portfolios')
          .select('*')
          .eq('user_id', user.id);

        if (portfolioError) throw portfolioError;
        setPortfolio(portfolioData || []);

        // Load recent trades
        const { data: tradesData, error: tradesError } = await supabase
          .from('trade_history')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(50);

        if (tradesError) throw tradesError;
        setTrades(tradesData || []);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const calculatePortfolioMetrics = () => {
    let totalValue = 0;
    let totalCost = 0;

    portfolio.forEach((item) => {
      const currentPrice = ASSET_PRICES[item.asset_symbol] || item.avg_price;
      const value = item.quantity * currentPrice;
      const cost = item.quantity * item.avg_price;
      totalValue += value;
      totalCost += cost;
    });

    const investedCash = profile?.balance ? profile.balance : 0;
    const totalPortfolioValue = totalValue + investedCash;
    const realizedPnL = trades
      .filter((t) => t.trade_type === 'sell')
      .reduce((sum, t) => sum + (t.total - t.quantity * t.price), 0);
    const unrealizedPnL = totalValue - totalCost;
    const totalPnL = realizedPnL + unrealizedPnL;

    return {
      totalValue,
      investedCash,
      totalPortfolioValue,
      realizedPnL,
      unrealizedPnL,
      totalPnL,
      totalReturn: totalPortfolioValue > 0 ? ((totalPnL / totalPortfolioValue) * 100).toFixed(2) : '0.00',
    };
  };

  const metrics = calculatePortfolioMetrics();
  const filteredTrades = filter === 'all' ? trades : trades.filter((t) => t.trade_type === filter);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8">
      <div className="max-w-7xl mx-auto px-4 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Welcome, {profile?.display_name}
            </h1>
            <p className="text-slate-400">{profile?.email}</p>
          </div>
          <button
            onClick={handleSignOut}
            className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg flex items-center gap-2 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>

        {/* Main Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Portfolio Value */}
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700/50 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Wallet className="w-5 h-5 text-amber-500" />
              <p className="text-slate-400 text-sm">Total Portfolio</p>
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold text-white">
                {showBalance ? `$${metrics.totalPortfolioValue.toFixed(2)}` : '••••••'}
              </p>
              <button
                onClick={() => setShowBalance(!showBalance)}
                className="text-slate-400 hover:text-slate-300"
              >
                {showBalance ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Cash Balance */}
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700/50 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-5 h-5 text-green-500" />
              <p className="text-slate-400 text-sm">Cash Available</p>
            </div>
            <p className="text-3xl font-bold text-white">${metrics.investedCash.toFixed(2)}</p>
          </div>

          {/* Holdings Value */}
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700/50 p-6">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              <p className="text-slate-400 text-sm">Holdings Value</p>
            </div>
            <p className="text-3xl font-bold text-white">${metrics.totalValue.toFixed(2)}</p>
          </div>

          {/* Total P&L */}
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700/50 p-6">
            <div className="flex items-center gap-3 mb-4">
              {metrics.totalPnL >= 0 ? (
                <TrendingUp className="w-5 h-5 text-green-500" />
              ) : (
                <TrendingDown className="w-5 h-5 text-red-500" />
              )}
              <p className="text-slate-400 text-sm">Total P&L</p>
            </div>
            <div>
              <p className={`text-3xl font-bold ${metrics.totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                ${Math.abs(metrics.totalPnL).toFixed(2)}
              </p>
              <p className={`text-sm mt-1 ${metrics.totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {metrics.totalPnL >= 0 ? '+' : ''}{metrics.totalReturn}%
              </p>
            </div>
          </div>
        </div>

        {/* Holdings */}
        {portfolio.length > 0 && (
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700/50 p-6">
            <h2 className="text-xl font-bold text-white mb-4">Your Holdings</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-slate-400 border-b border-slate-700/50">
                  <tr>
                    <th className="text-left py-3 px-4">Symbol</th>
                    <th className="text-right py-3 px-4">Qty</th>
                    <th className="text-right py-3 px-4">Avg Cost</th>
                    <th className="text-right py-3 px-4">Current Price</th>
                    <th className="text-right py-3 px-4">Total Value</th>
                    <th className="text-right py-3 px-4">P&L</th>
                    <th className="text-right py-3 px-4">Return</th>
                    <th className="text-center py-3 px-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {portfolio.map((item) => {
                    const currentPrice = ASSET_PRICES[item.asset_symbol] || item.avg_price;
                    const totalValue = item.quantity * currentPrice;
                    const totalCost = item.quantity * item.avg_price;
                    const pnl = totalValue - totalCost;
                    const returnPct = totalCost > 0 ? ((pnl / totalCost) * 100).toFixed(2) : '0.00';

                    return (
                      <tr key={item.id} className="border-b border-slate-700/30 hover:bg-slate-700/20">
                        <td className="py-3 px-4 text-white font-semibold">{item.asset_symbol}</td>
                        <td className="py-3 px-4 text-right text-slate-300">{item.quantity}</td>
                        <td className="py-3 px-4 text-right text-slate-300">${item.avg_price.toFixed(2)}</td>
                        <td className="py-3 px-4 text-right text-slate-300">${currentPrice.toFixed(2)}</td>
                        <td className="py-3 px-4 text-right text-amber-400 font-semibold">${totalValue.toFixed(2)}</td>
                        <td className={`py-3 px-4 text-right font-semibold ${pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {pnl >= 0 ? '+' : ''}${pnl.toFixed(2)}
                        </td>
                        <td className={`py-3 px-4 text-right font-semibold ${pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {pnl >= 0 ? '+' : ''}{returnPct}%
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => navigate(`/trade/${item.asset_symbol}`)}
                            className="text-amber-500 hover:text-amber-400 font-semibold text-sm"
                          >
                            Trade
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Trade History */}
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <History className="w-5 h-5" />
              Trade History
            </h2>
            <div className="flex gap-2">
              {(['all', 'buy', 'sell'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    filter === type
                      ? 'bg-amber-500 text-white'
                      : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {filteredTrades.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-slate-400 border-b border-slate-700/50">
                  <tr>
                    <th className="text-left py-3 px-4">Date</th>
                    <th className="text-left py-3 px-4">Symbol</th>
                    <th className="text-left py-3 px-4">Type</th>
                    <th className="text-right py-3 px-4">Quantity</th>
                    <th className="text-right py-3 px-4">Price</th>
                    <th className="text-right py-3 px-4">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTrades.map((trade) => (
                    <tr key={trade.id} className="border-b border-slate-700/30 hover:bg-slate-700/20">
                      <td className="py-3 px-4 text-slate-300">
                        {new Date(trade.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-white font-semibold">{trade.asset_symbol}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            trade.trade_type === 'buy'
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}
                        >
                          {trade.trade_type.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right text-slate-300">{trade.quantity}</td>
                      <td className="py-3 px-4 text-right text-slate-300">${trade.price.toFixed(2)}</td>
                      <td className="py-3 px-4 text-right text-amber-400 font-semibold">
                        ${trade.total.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-slate-400">No trades yet. Start trading to see your history!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
