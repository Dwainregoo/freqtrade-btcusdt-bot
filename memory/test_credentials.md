# Freqtrade Bot Test Credentials

## Dashboard Login
- **URL**: https://trade-bot-algo.preview.emergentagent.com
- **Username**: `freqtrader`
- **Password**: `SuperSecurePassword123`

## API Authentication
The API uses HTTP Basic Auth for the login endpoint:
```bash
curl -X POST https://trade-bot-algo.preview.emergentagent.com/api/v1/token/login \
  -u "freqtrader:SuperSecurePassword123"
```

## Configuration File
- Path: `/app/user_data/config.json`
- Mode: Dry Run (paper trading)
- Virtual Balance: 1000 USDT
