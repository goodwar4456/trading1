import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { OptionSettlementModal } from './components/OptionSettlementModal';
import { ArrowUp, ArrowDown, Zap, TrendingUp, TrendingDown, Clock } from 'lucide-react';

interface ActiveOption {
  id: string;
  symbol: string;
  direction: 'call' | 'put';
  entryPrice: number;
  stake: number;
  payoutAmount: number;
  expiryTime: number;
  createdAt: number;
  duration: number;
}

interface SettlementResult {
  id: string;
  symbol: string;
  direction: 'call' | 'put';
  entryPrice: number;
  settlementPrice: number;
  stake: number;
  payoutAmount: number;
  won: boolean;
  duration: number;
}

interface MarketPrice {
  [key: string]: number;
}

const MARKET_PRICES: MarketPrice = {
  'BTC': 65432.10,
  'ETH': 3450.80,
  'SOL': 178.50,
  'XRP': 2.45,
  'ADA': 1.05,
  'DOT': 8.20,
  'AVAX': 45.30,
  'MATIC': 0.85,
  'AAPL': 150.25,
  'TSLA': 242.10,
  'MSFT': 380.50,
  'GOOGL': 140.80,
};

const PAYOUT_RATES: { [key: number]: number } = {
  15: 0.10,
  30: 0.25,
  45: 0.40,
  60: 0.65,
};

export function TradePage() {
  const { symbol } = useParams<{ symbol: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [currentPrice, setCurrentPrice] = useState(MARKET_PRICES[symbol || 'BTC'] || 0);
  const [mode, setMode] = useState<'spot' | 'options'>('options');
  const [direction, setDirection] = useState<'call' | 'put'>('call');
  const [duration, setDuration] = useState(15);
  const [stake, setStake] = useState(100);
  const [balance, setBalance] = useState(10000);
  const [activeOptions, setActiveOptions] = useState<ActiveOption[]>([]);
  const [settledOptions, setSettledOptions] = useState<SettlementResult[]>([]);
  const [showSettlementModal, setShowSettlementModal] = useState<SettlementResult | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user balance
  useEffect(() => {
    if (!user) return;

    const loadBalance = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('balance')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        setBalance(data?.balance || 0);
      } catch (error) {
        console.error('Failed to load balance:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBalance();
  }, [user]);

  // Countdown timer for active options
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveOptions((prev) => {
        const updated = prev
          .map((opt) => ({
            ...opt,
            expiryTime: opt.expiryTime - 100, // 100ms ticks
          }))
          .filter((opt) => {
            if (opt.expiryTime <= 0) {
              // Settle the option
              const currentMarketPrice =
                MARKET_PRICES[opt.symbol] || 0;
              const won =
                (opt.direction === 'call' &&
                  currentMarketPrice > opt.entryPrice) ||
                (opt.direction === 'put' &&
                  currentMarketPrice < opt.entryPrice);

              const settlement: SettlementResult = {
                id: opt.id,
                symbol: opt.symbol,
                direction: opt.direction,
                entryPrice: opt.entryPrice,
                settlementPrice: currentMarketPrice,
                stake: opt.stake,
                payoutAmount: opt.payoutAmount,
                won,
                duration: opt.duration,
              };

              setSettledOptions((prev) => [...prev, settlement]);
              setShowSettlementModal(settlement);

              // Update balance
              if (won) {
                setBalance((b) => b + opt.payoutAmount);
              } else {
                setBalance((b) => b - opt.stake);
              }

              return false; // Remove from active
            }
            return true;
          });

        return updated;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const handlePlaceOption = useCallback(() => {
    if (stake > balance) {
      alert('Insufficient balance');
      return;
    }

    const payoutRate = PAYOUT_RATES[duration] || 0.10;
    const payout = stake * (1 + payoutRate);

    const newOption: ActiveOption = {
      id: `opt-${Date.now()}`,
      symbol: symbol || 'BTC',
      direction,
      entryPrice: currentPrice,
      stake,
      payoutAmount: payout,
      expiryTime: duration * 1000, // Convert to milliseconds
      createdAt: Date.now(),
      duration,
    };

    setActiveOptions((prev) => [...prev, newOption]);
    setBalance((b) => b - stake); // Deduct stake immediately

    // Reset form
    setStake(100);
  }, [stake, balance, duration, direction, currentPrice, symbol]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              Trade {symbol}
            </h1>
            <div className="flex items-center gap-4">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-amber-400">
                  ${currentPrice.toFixed(2)}
                </span>
              </div>
              <div className="text-slate-400">Balance: ${balance.toFixed(2)}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Chart Placeholder */}
              <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700/50 p-8">
                <div className="flex items-center justify-center h-80 bg-slate-900/50 rounded-lg border border-slate-700/30">
                  <div className="text-center">
                    <TrendingUp className="w-16 h-16 text-amber-500/50 mx-auto mb-4" />
                    <p className="text-slate-400">Interactive Price Chart</p>
                    <p className="text-sm text-slate-500">Real-time price: ${currentPrice.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              {/* Active Options Panel */}
              {activeOptions.length > 0 && (
                <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-amber-500/30 p-6">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-amber-500" />
                    Active Options ({activeOptions.length})
                  </h3>

                  <div className="space-y-3">
                    {activeOptions.map((option) => {
                      const timeRemaining = Math.max(0, option.expiryTime);
                      const progress = (timeRemaining / (option.duration * 1000)) * 100;
                      const isWarning = timeRemaining < 5000; // Less than 5 seconds

                      return (
                        <div
                          key={option.id}
                          className="p-4 bg-slate-700/30 rounded-lg border border-slate-600/50 hover:border-amber-500/50 transition-colors"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div
                                className={`px-3 py-1 rounded font-bold text-sm ${
                                  option.direction === 'call'
                                    ? 'bg-green-500/20 text-green-400'
                                    : 'bg-red-500/20 text-red-400'
                                }`}
                              >
                                {option.direction.toUpperCase()}
                              </div>
                              <span className="text-white font-semibold">{option.symbol}</span>
                              <span className="text-slate-400 text-sm">Entry: ${option.entryPrice.toFixed(2)}</span>
                            </div>
                            <div className={`font-bold ${isWarning ? 'text-red-400 animate-pulse' : 'text-amber-400'}`}>
                              {(timeRemaining / 1000).toFixed(1)}s
                            </div>
                          </div>

                          {/* Progress Bar */}
                          <div className="w-full bg-slate-600/50 rounded-full h-2 overflow-hidden mb-2">
                            <div
                              className={`h-full transition-all duration-100 ${
                                isWarning ? 'bg-red-500' : 'bg-amber-500'
                              }`}
                              style={{ width: `${progress}%` }}
                            />
                          </div>

                          <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-400">
                              Stake: ${option.stake.toFixed(2)} → Payout: ${option.payoutAmount.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Settled Options */}
              {settledOptions.length > 0 && (
                <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700/50 p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Settlement History</h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {settledOptions.map((settlement) => (
                      <div
                        key={settlement.id}
                        className={`p-3 rounded-lg flex items-center justify-between text-sm ${
                          settlement.won
                            ? 'bg-green-500/10 border border-green-500/30'
                            : 'bg-red-500/10 border border-red-500/30'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {settlement.won ? (
                            <ArrowUp className="w-4 h-4 text-green-400" />
                          ) : (
                            <ArrowDown className="w-4 h-4 text-red-400" />
                          )}
                          <span className="text-white font-semibold">{settlement.symbol}</span>
                          <span className="text-slate-400">{settlement.direction.toUpperCase()}</span>
                        </div>
                        <span
                          className={`font-bold ${
                            settlement.won ? 'text-green-400' : 'text-red-400'
                          }`}
                        >
                          {settlement.won ? '+' : '-'}${Math.abs(settlement.payoutAmount - settlement.stake).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Order Form Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700/50 p-6 sticky top-8">
                <h2 className="text-xl font-bold text-white mb-6">Place Order</h2>

                {/* Mode Switcher */}
                <div className="flex gap-2 mb-6 bg-slate-700/30 p-1 rounded-lg">
                  {(['spot', 'options'] as const).map((m) => (
                    <button
                      key={m}
                      onClick={() => setMode(m)}
                      className={`flex-1 py-2 px-3 rounded font-semibold text-sm transition-all ${
                        mode === m
                          ? 'bg-amber-500 text-white'
                          : 'text-slate-400 hover:text-slate-300'
                      }`}
                    >
                      {m.charAt(0).toUpperCase() + m.slice(1)}
                    </button>
                  ))}
                </div>

                {/* Options Mode */}
                {mode === 'options' && (
                  <div className="space-y-6">
                    {/* Direction Toggle */}
                    <div className="space-y-3">
                      <p className="text-sm font-semibold text-slate-300">Direction</p>
                      <div className="flex gap-2">
                        {(['call', 'put'] as const).map((d) => (
                          <button
                            key={d}
                            onClick={() => setDirection(d)}
                            className={`flex-1 py-3 px-4 rounded-lg font-bold transition-all ${
                              direction === d
                                ? d === 'call'
                                  ? 'bg-green-600 text-white'
                                  : 'bg-red-600 text-white'
                                : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                            }`}
                          >
                            {d === 'call' ? '📈 CALL' : '📉 PUT'}
                          </button>
                        ))}
                      </div>
                      <p className="text-xs text-slate-400 text-center">
                        {direction === 'call'
                          ? 'Price will go UP'
                          : 'Price will go DOWN'}
                      </p>
                    </div>

                    {/* Duration Selector */}
                    <div className="space-y-3">
                      <p className="text-sm font-semibold text-slate-300">Timeframe</p>
                      <div className="grid grid-cols-2 gap-2">
                        {[15, 30, 45, 60].map((d) => (
                          <button
                            key={d}
                            onClick={() => setDuration(d)}
                            className={`p-3 rounded-lg text-sm font-bold transition-all ${
                              duration === d
                                ? 'bg-amber-500 text-white border-2 border-amber-600'
                                : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                            }`}
                          >
                            <div>{d}s</div>
                            <div className="text-xs opacity-75">+{(PAYOUT_RATES[d] * 100).toFixed(0)}%</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Stake Input */}
                    <div className="space-y-3">
                      <p className="text-sm font-semibold text-slate-300">Stake</p>
                      <input
                        type="number"
                        value={stake}
                        onChange={(e) => setStake(Math.max(1, Math.min(balance, Number(e.target.value))))}
                        className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />

                      {/* Quick Percentage Buttons */}
                      <div className="grid grid-cols-4 gap-2">
                        {[10, 25, 50, 100].map((pct) => (
                          <button
                            key={pct}
                            onClick={() => setStake(Math.floor((balance * pct) / 100))}
                            className="py-1 px-2 bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded text-xs font-semibold transition-colors"
                          >
                            {pct}%
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Payout Preview */}
                    <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                      <p className="text-xs text-slate-400 mb-1">If You Win</p>
                      <p className="text-2xl font-bold text-amber-400">
                        +${(stake * PAYOUT_RATES[duration]).toFixed(2)}
                      </p>
                    </div>

                    {/* Balance Check */}
                    {stake > balance && (
                      <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                        <p className="text-sm text-red-400 font-semibold">
                          ⚠️ Insufficient balance
                        </p>
                      </div>
                    )}

                    {/* Place Order Button */}
                    <button
                      onClick={handlePlaceOption}
                      disabled={stake > balance || stake < 1}
                      className={`w-full py-3 px-4 rounded-lg font-bold text-white transition-all ${
                        stake > balance || stake < 1
                          ? 'bg-slate-600/50 text-slate-400 cursor-not-allowed'
                          : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700'
                      }`}
                    >
                      <Clock className="w-4 h-4 inline mr-2" />
                      Place {duration}s Option
                    </button>
                  </div>
                )}

                {/* Spot Mode */}
                {mode === 'spot' && (
                  <div className="text-center py-8">
                    <p className="text-slate-400">Spot trading coming soon</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Settlement Modal */}
      <OptionSettlementModal
        result={showSettlementModal}
        onDismiss={() => setShowSettlementModal(null)}
      />
    </AuthGuard>
  );
}
