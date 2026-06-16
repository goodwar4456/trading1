import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, X, Trophy, AlertCircle } from 'lucide-react';

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

interface OptionSettlementModalProps {
  result: SettlementResult | null;
  onDismiss: () => void;
}

export function OptionSettlementModal({ result, onDismiss }: OptionSettlementModalProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (result) {
      setIsVisible(true);
      // Auto-dismiss after 8 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onDismiss, 300); // Wait for fade out animation
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [result, onDismiss]);

  if (!result || !isVisible) return null;

  const priceChanged = result.settlementPrice > result.entryPrice;
  const directionCorrect = (result.direction === 'call' && priceChanged) || 
                          (result.direction === 'put' && !priceChanged);
  const pnl = result.won ? result.payoutAmount - result.stake : -result.stake;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => {
          setIsVisible(false);
          setTimeout(onDismiss, 300);
        }}
      />

      {/* Modal */}
      <div
        className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 transition-all duration-300 ${
          isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      >
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border-2 border-slate-700/50 shadow-2xl max-w-md w-full mx-4 overflow-hidden">
          {/* Result Header - Win/Loss */}
          <div
            className={`px-8 py-12 text-center relative overflow-hidden ${
              result.won
                ? 'bg-gradient-to-b from-green-500/20 to-green-500/5'
                : 'bg-gradient-to-b from-red-500/20 to-red-500/5'
            }`}
          >
            {/* Animated background circles */}
            <div
              className={`absolute inset-0 opacity-10 ${
                result.won ? 'bg-green-500' : 'bg-red-500'
              }`}
            />

            {/* Trophy/Loss Icon */}
            <div className="relative z-10 mb-4">
              {result.won ? (
                <div className="flex justify-center">
                  <Trophy className="w-16 h-16 text-amber-400 drop-shadow-lg animate-bounce" />
                </div>
              ) : (
                <div className="flex justify-center">
                  <AlertCircle className="w-16 h-16 text-red-400 drop-shadow-lg animate-pulse" />
                </div>
              )}
            </div>

            {/* Result Text */}
            <h2
              className={`text-3xl font-bold mb-2 ${
                result.won ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {result.won ? 'YOU WON! 🎉' : 'YOU LOST 📉'}
            </h2>
            <p className="text-slate-400">Option Settled</p>
          </div>

          {/* Content */}
          <div className="px-8 py-8 space-y-6">
            {/* Trade Details */}
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg border border-slate-600/50">
                <div>
                  <p className="text-slate-400 text-sm">Asset</p>
                  <p className="text-white font-bold text-lg">{result.symbol}</p>
                </div>
                <div
                  className={`px-4 py-2 rounded-lg font-bold text-sm ${
                    result.direction === 'call'
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}
                >
                  {result.direction.toUpperCase()}
                </div>
              </div>

              {/* Price Comparison */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-700/30 rounded-lg border border-slate-600/50">
                  <p className="text-slate-400 text-xs mb-1">Entry Price</p>
                  <p className="text-white font-bold text-lg">${result.entryPrice.toFixed(2)}</p>
                </div>
                <div className="p-4 bg-slate-700/30 rounded-lg border border-slate-600/50">
                  <p className="text-slate-400 text-xs mb-1">Settlement Price</p>
                  <p className="text-white font-bold text-lg">${result.settlementPrice.toFixed(2)}</p>
                </div>
              </div>

              {/* Price Direction Indicator */}
              <div
                className={`p-4 rounded-lg border flex items-center gap-3 ${
                  priceChanged
                    ? 'bg-green-500/10 border-green-500/30'
                    : 'bg-red-500/10 border-red-500/30'
                }`}
              >
                {priceChanged ? (
                  <TrendingUp className="w-5 h-5 text-green-400" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-red-400" />
                )}
                <p className={priceChanged ? 'text-green-400 font-semibold' : 'text-red-400 font-semibold'}>
                  Price moved {priceChanged ? 'UP' : 'DOWN'} {result.settlementPrice > result.entryPrice ? '+' : ''}{((result.settlementPrice - result.entryPrice) / result.entryPrice * 100).toFixed(2)}%
                </p>
              </div>
            </div>

            {/* Timeframe Badge */}
            <div className="text-center">
              <p className="text-slate-400 text-sm mb-2">Timeframe</p>
              <div className="inline-block px-4 py-2 bg-amber-500/20 text-amber-400 rounded-lg font-bold border border-amber-500/30">
                {result.duration}s
              </div>
            </div>

            {/* P&L Summary */}
            <div className="space-y-3 pt-4 border-t border-slate-600/50">
              <div className="flex items-center justify-between">
                <p className="text-slate-400">Stake</p>
                <p className="text-white font-semibold">${result.stake.toFixed(2)}</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-slate-400">Payout</p>
                <p className={`font-semibold ${result.won ? 'text-green-400' : 'text-slate-400'}`}>
                  ${result.payoutAmount.toFixed(2)}
                </p>
              </div>
              <div
                className={`flex items-center justify-between p-4 rounded-lg border-2 ${
                  result.won
                    ? 'bg-green-500/10 border-green-500/30'
                    : 'bg-red-500/10 border-red-500/30'
                }`}
              >
                <p className="font-bold">Net P&L</p>
                <p
                  className={`text-2xl font-bold ${
                    result.won ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  {pnl >= 0 ? '+' : ''}${pnl.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* Close Button */}
          <div className="px-8 py-4 border-t border-slate-600/50 flex gap-3">
            <button
              onClick={() => {
                setIsVisible(false);
                setTimeout(onDismiss, 300);
              }}
              className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <X className="w-4 h-4" />
              Close
            </button>
            <button
              onClick={() => {
                setIsVisible(false);
                setTimeout(onDismiss, 300);
              }}
              className={`flex-1 px-4 py-3 font-semibold rounded-lg transition-colors ${
                result.won
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-amber-600 hover:bg-amber-700 text-white'
              }`}
            >
              {result.won ? 'Keep Trading 🚀' : 'Try Again'}
            </button>
          </div>

          {/* Auto-dismiss hint */}
          <div className="px-8 py-2 text-center text-xs text-slate-500 bg-slate-900/50">
            Closes automatically in 8 seconds
          </div>
        </div>
      </div>
    </>
  );
}
