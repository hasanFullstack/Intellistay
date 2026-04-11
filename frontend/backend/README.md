Local backend to support Stripe Checkout for frontend

1. Copy `.env.example` → `.env` and set `STRIPE_SECRET`, `STRIPE_WEBHOOK_SECRET`, `CLIENT_URL`.

2. Install deps and start:

```bash
cd backend
npm install
npm start
```

3. Test endpoint:

```bash
curl -X POST http://localhost:5000/api/payments/create-checkout-session \
  -H "Content-Type: application/json" \
  -d '{"amount":1500, "hostelId":"h1", "roomId":"r1"}'
```

4. For webhooks during local testing use Stripe CLI:

```bash
stripe listen --forward-to localhost:5000/api/payments/webhook
```
