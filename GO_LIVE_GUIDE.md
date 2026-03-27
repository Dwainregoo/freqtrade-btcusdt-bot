# Freqtrade: Go Live Guide

## 📁 Current Setup

Your freqtrade bot is configured with:
- **Config**: `/app/user_data/config.json`
- **Strategy**: `/app/user_data/strategies/SampleStrategy.py`
- **Mode**: DRY RUN (paper trading) - No real money at risk

---

## 🚀 Step-by-Step: Going Live

### Step 1: Test with Dry Run (Current State)

```bash
# Start bot in dry-run mode (paper trading)
cd /app
freqtrade trade --config user_data/config.json --strategy SampleStrategy
```

This simulates trading with $1000 virtual balance. Monitor for a few days to validate your strategy.

---

### Step 2: Get Exchange API Keys

#### Binance (Default)
1. Go to https://www.binance.com/en/my/settings/api-management
2. Create new API key
3. Enable **"Enable Spot & Margin Trading"**
4. **DO NOT** enable withdrawals
5. Optionally restrict to your IP address

#### Other Supported Exchanges
| Exchange | API Setup URL |
|----------|---------------|
| Bybit | https://www.bybit.com/app/user/api-management |
| OKX | https://www.okx.com/account/my-api |
| Kraken | https://www.kraken.com/u/security/api |
| Gate.io | https://www.gate.io/myaccount/apikeys |
| Kucoin | https://www.kucoin.com/account/api |

---

### Step 3: Configure for Live Trading

Edit `/app/user_data/config.json`:

```json
{
    "dry_run": false,  // ⚠️ CHANGE TO FALSE FOR LIVE
    "exchange": {
        "name": "binance",
        "key": "YOUR_API_KEY_HERE",
        "secret": "YOUR_API_SECRET_HERE"
    }
}
```

**Security Best Practice**: Use environment variables instead:
```json
{
    "exchange": {
        "key": "${EXCHANGE_KEY}",
        "secret": "${EXCHANGE_SECRET}"
    }
}
```

Then set:
```bash
export EXCHANGE_KEY="your_api_key"
export EXCHANGE_SECRET="your_api_secret"
```

---

### Step 4: Backtest Your Strategy

Before going live, always backtest:

```bash
# Download historical data (last 30 days)
freqtrade download-data --config user_data/config.json --days 30

# Run backtest
freqtrade backtesting --config user_data/config.json --strategy SampleStrategy

# View results
freqtrade backtesting-show --config user_data/config.json
```

---

### Step 5: Start Live Trading

```bash
# Start the bot
freqtrade trade --config user_data/config.json --strategy SampleStrategy

# Or run in background
nohup freqtrade trade --config user_data/config.json --strategy SampleStrategy &
```

---

## 📱 Optional: Telegram Notifications

1. Create bot via @BotFather on Telegram
2. Get your chat_id via @userinfobot
3. Update config:

```json
"telegram": {
    "enabled": true,
    "token": "YOUR_BOT_TOKEN",
    "chat_id": "YOUR_CHAT_ID"
}
```

---

## 🖥️ Web UI (FreqUI)

Access the trading dashboard:

```bash
# Install FreqUI
freqtrade install-ui

# Start with webserver
freqtrade trade --config user_data/config.json --strategy SampleStrategy
```

Access at: http://localhost:8080
- Username: `freqtrader`
- Password: `SuperSecurePassword123`

---

## ⚠️ Important Safety Tips

1. **Start Small**: Begin with minimum stake amounts
2. **Test First**: Always dry-run for at least 1 week
3. **No Withdrawal**: Never enable withdrawal on API keys
4. **IP Whitelist**: Restrict API to your server's IP
5. **Monitor**: Check bot status daily initially
6. **Understand Strategy**: Know what your strategy does before risking real money

---

## 📊 Useful Commands

```bash
# Check bot status
freqtrade show-trades --config user_data/config.json

# List available exchanges
freqtrade list-exchanges

# Test your pair list
freqtrade test-pairlist --config user_data/config.json

# Show current config
freqtrade show-config --config user_data/config.json

# Optimize strategy (hyperopt)
freqtrade hyperopt --config user_data/config.json --strategy SampleStrategy --hyperopt-loss SharpeHyperOptLoss -e 100
```

---

## 🔄 Running as a Service (Production)

Create systemd service for auto-restart:

```bash
sudo cp /app/freqtrade.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable freqtrade
sudo systemctl start freqtrade
```

---

## 📚 Resources

- Documentation: https://www.freqtrade.io
- Discord: https://discord.gg/p7nuUNVfP7
- Strategy Examples: https://github.com/freqtrade/freqtrade-strategies
