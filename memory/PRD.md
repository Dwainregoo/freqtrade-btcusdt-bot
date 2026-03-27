# Freqtrade Bot - PRD

## Original Problem Statement
Clone freqtrade repository and configure with sample config for going live.

## Project Overview
Freqtrade is a free, open-source crypto trading bot written in Python. Supports backtesting, strategy optimization via ML, and multiple exchanges.

## What's Been Implemented (Jan 2026)

### Completed
- ✅ Cloned freqtrade repository to /app
- ✅ Installed freqtrade package with dependencies
- ✅ Created sample configuration (`/app/user_data/config.json`)
- ✅ Set up SampleStrategy in `/app/user_data/strategies/`
- ✅ Created comprehensive Go Live Guide (`/app/GO_LIVE_GUIDE.md`)
- ✅ Configured for Binance exchange (dry-run mode)
- ✅ Enabled API server with FreqUI support
- ✅ Built custom React dashboard connecting to Freqtrade API
- ✅ Dashboard shows balance, profit, open trades, config, trading pairs

### Configuration Details
- **Mode**: Dry Run (paper trading with $1000 virtual)
- **Exchange**: Binance
- **Timeframe**: 5m
- **Strategy**: SampleStrategy (RSI + TEMA + Bollinger Bands)
- **Pairs**: BTC, ETH, BNB, SOL, XRP, ADA, AVAX, DOGE, DOT, LINK
- **API Port**: 8001

### Dashboard Credentials
- **Username**: freqtrader
- **Password**: SuperSecurePassword123

## User Personas
1. **Crypto Trader**: Wants automated trading bot
2. **Developer**: Wants to customize strategies

## Core Requirements
- [x] Clone repository
- [x] Install dependencies
- [x] Sample configuration
- [x] Go-live documentation

## Next Steps / Backlog

### P0 (Required for Live)
- [ ] Get exchange API keys from user
- [ ] Run backtesting to validate strategy
- [ ] Configure Telegram notifications (optional)

### P1 (Recommended)
- [ ] Download historical data for backtesting
- [ ] Run hyperopt to optimize strategy parameters
- [ ] Set up as systemd service for production

### P2 (Nice to Have)
- [ ] Custom strategy development
- [ ] FreqAI machine learning integration
- [ ] Multi-exchange support

## Key Files
- Config: `/app/user_data/config.json`
- Strategy: `/app/user_data/strategies/SampleStrategy.py`
- Guide: `/app/GO_LIVE_GUIDE.md`

## Commands Reference
```bash
# Start dry-run trading
freqtrade trade --config user_data/config.json --strategy SampleStrategy

# Download data for backtesting
freqtrade download-data --config user_data/config.json --days 30

# Run backtest
freqtrade backtesting --config user_data/config.json --strategy SampleStrategy
```
