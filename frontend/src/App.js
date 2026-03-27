import { useEffect, useState, useCallback } from "react";
import "@/App.css";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(null);
  const [username, setUsername] = useState("freqtrader");
  const [password, setPassword] = useState("");
  const [botStatus, setBotStatus] = useState(null);
  const [trades, setTrades] = useState([]);
  const [balance, setBalance] = useState(null);
  const [profit, setProfit] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState(null);

  const login = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // Freqtrade uses HTTP Basic Auth for token endpoint
      const response = await axios.post(`${API}/v1/token/login`, null, {
        auth: {
          username,
          password,
        },
      });
      setToken(response.data.access_token);
      setIsLoggedIn(true);
      localStorage.setItem("ft_token", response.data.access_token);
    } catch (err) {
      setError("Login failed. Check credentials.");
      console.error(err);
    }
    setLoading(false);
  };

  const fetchData = useCallback(async () => {
    if (!token) return;
    const headers = { Authorization: `Bearer ${token}` };
    
    try {
      const [statusRes, tradesRes, balanceRes, profitRes, configRes] = await Promise.all([
        axios.get(`${API}/v1/show_config`, { headers }).catch(() => null),
        axios.get(`${API}/v1/status`, { headers }).catch(() => null),
        axios.get(`${API}/v1/balance`, { headers }).catch(() => null),
        axios.get(`${API}/v1/profit`, { headers }).catch(() => null),
        axios.get(`${API}/v1/show_config`, { headers }).catch(() => null),
      ]);
      
      if (statusRes) setBotStatus(statusRes.data);
      if (tradesRes) setTrades(tradesRes.data || []);
      if (balanceRes) setBalance(balanceRes.data);
      if (profitRes) setProfit(profitRes.data);
      if (configRes) setConfig(configRes.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  }, [token]);

  useEffect(() => {
    const savedToken = localStorage.getItem("ft_token");
    if (savedToken) {
      setToken(savedToken);
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn && token) {
      fetchData();
      const interval = setInterval(fetchData, 10000);
      return () => clearInterval(interval);
    }
  }, [isLoggedIn, token, fetchData]);

  const logout = () => {
    setToken(null);
    setIsLoggedIn(false);
    localStorage.removeItem("ft_token");
    setBotStatus(null);
    setTrades([]);
    setBalance(null);
    setProfit(null);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800 rounded-2xl p-8 w-full max-w-md shadow-2xl border border-gray-700">
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-2xl flex items-center justify-center">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white">Freqtrade Bot</h1>
            <p className="text-gray-400 mt-2">Login to your trading bot</p>
          </div>
          
          <form onSubmit={login} className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="freqtrader"
                data-testid="username-input"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="Enter password"
                data-testid="password-input"
              />
            </div>
            {error && (
              <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-2 rounded-lg text-sm" data-testid="error-message">
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-semibold py-3 rounded-lg hover:opacity-90 transition disabled:opacity-50"
              data-testid="login-button"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
          
          <div className="mt-6 text-center text-gray-500 text-sm">
            <p>Default: freqtrader / SuperSecurePassword123</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold">Freqtrade Dashboard</h1>
              <p className="text-gray-400 text-sm">{config?.bot_name || "Trading Bot"}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${config?.dry_run ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'}`} data-testid="mode-badge">
              {config?.dry_run ? "DRY RUN" : "LIVE"}
            </span>
            <button
              onClick={logout}
              className="text-gray-400 hover:text-white transition"
              data-testid="logout-button"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Balance Card */}
          <div className="bg-gray-800 rounded-xl p-5 border border-gray-700" data-testid="balance-card">
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-400 text-sm">Total Balance</span>
              <svg className="w-5 h-5 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-2xl font-bold text-white">
              {balance?.total?.toFixed(2) || config?.dry_run_wallet || "1000.00"} {config?.stake_currency || "USDT"}
            </p>
          </div>

          {/* Profit Card */}
          <div className="bg-gray-800 rounded-xl p-5 border border-gray-700" data-testid="profit-card">
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-400 text-sm">Total Profit</span>
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <p className={`text-2xl font-bold ${(profit?.profit_all_coin || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {profit?.profit_all_coin?.toFixed(4) || "0.0000"} {config?.stake_currency || "USDT"}
            </p>
          </div>

          {/* Open Trades Card */}
          <div className="bg-gray-800 rounded-xl p-5 border border-gray-700" data-testid="trades-card">
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-400 text-sm">Open Trades</span>
              <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <p className="text-2xl font-bold text-white">
              {trades.length} / {config?.max_open_trades || 3}
            </p>
          </div>

          {/* Exchange Card */}
          <div className="bg-gray-800 rounded-xl p-5 border border-gray-700" data-testid="exchange-card">
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-400 text-sm">Exchange</span>
              <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
            </div>
            <p className="text-2xl font-bold text-white capitalize">
              {config?.exchange?.name || "Binance"}
            </p>
          </div>
        </div>

        {/* Configuration */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700" data-testid="config-section">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Bot Configuration
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-gray-400">Strategy</p>
              <p className="font-medium">{config?.strategy || "SampleStrategy"}</p>
            </div>
            <div>
              <p className="text-gray-400">Timeframe</p>
              <p className="font-medium">{config?.timeframe || "5m"}</p>
            </div>
            <div>
              <p className="text-gray-400">Stake Amount</p>
              <p className="font-medium">{config?.stake_amount || "unlimited"}</p>
            </div>
            <div>
              <p className="text-gray-400">Trading Mode</p>
              <p className="font-medium capitalize">{config?.trading_mode || "spot"}</p>
            </div>
          </div>
        </div>

        {/* Trading Pairs */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700" data-testid="pairs-section">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            Trading Pairs
          </h2>
          <div className="flex flex-wrap gap-2">
            {(config?.exchange?.pair_whitelist || ["BTC/USDT", "ETH/USDT", "BNB/USDT"]).map((pair, i) => (
              <span key={i} className="px-3 py-1 bg-gray-700 rounded-lg text-sm font-medium">
                {pair}
              </span>
            ))}
          </div>
        </div>

        {/* Open Trades Table */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700" data-testid="open-trades-section">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Open Trades
          </h2>
          {trades.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p>No open trades</p>
              <p className="text-sm mt-1">The bot is monitoring for entry signals</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-gray-400 text-sm border-b border-gray-700">
                    <th className="text-left py-2">Pair</th>
                    <th className="text-left py-2">Amount</th>
                    <th className="text-left py-2">Entry Price</th>
                    <th className="text-left py-2">Current Price</th>
                    <th className="text-right py-2">Profit</th>
                  </tr>
                </thead>
                <tbody>
                  {trades.map((trade, i) => (
                    <tr key={i} className="border-b border-gray-700/50">
                      <td className="py-3 font-medium">{trade.pair}</td>
                      <td className="py-3">{trade.amount?.toFixed(4)}</td>
                      <td className="py-3">{trade.open_rate?.toFixed(4)}</td>
                      <td className="py-3">{trade.current_rate?.toFixed(4)}</td>
                      <td className={`py-3 text-right font-medium ${(trade.profit_ratio || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {((trade.profit_ratio || 0) * 100).toFixed(2)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Go Live Guide */}
        <div className="bg-gradient-to-r from-cyan-500/10 to-teal-500/10 rounded-xl p-6 border border-cyan-500/30" data-testid="go-live-section">
          <h2 className="text-lg font-semibold mb-3 text-cyan-400">Ready to Go Live?</h2>
          <p className="text-gray-300 mb-4">
            You're currently in <strong>dry-run mode</strong> with a virtual balance of {config?.dry_run_wallet || 1000} {config?.stake_currency || "USDT"}.
            To trade with real money:
          </p>
          <ol className="list-decimal list-inside space-y-2 text-gray-400 text-sm">
            <li>Get API keys from {config?.exchange?.name || "Binance"} (enable trading, disable withdrawals)</li>
            <li>Edit <code className="bg-gray-700 px-2 py-0.5 rounded">/app/user_data/config.json</code></li>
            <li>Set <code className="bg-gray-700 px-2 py-0.5 rounded">"dry_run": false</code> and add your API keys</li>
            <li>Restart the bot</li>
          </ol>
          <p className="mt-4 text-yellow-400 text-sm">
            ⚠️ Always test strategies thoroughly in dry-run before using real money!
          </p>
        </div>
      </main>
    </div>
  );
}

export default App;
