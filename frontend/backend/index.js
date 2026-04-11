import express from "express";
import dotenv from "dotenv";
import paymentsRouter from "./routes/payments.route.js";
import { handleStripeWebhook } from "./controllers/stripe.controller.js";

dotenv.config();
const app = express();

app.use(require("cors")());
app.use(express.json());

// Mount create-checkout-session and related JSON routes
app.use("/api/payments", paymentsRouter);

// Webhook needs raw body
app.post(
  "/api/payments/webhook",
  express.raw({ type: "application/json" }),
  handleStripeWebhook,
);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Backend listening on http://localhost:${PORT}`),
);
