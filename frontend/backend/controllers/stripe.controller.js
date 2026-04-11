import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET || "");

export const createCheckoutSession = async (req, res) => {
  try {
    const {
      hostelId,
      roomId,
      startDate,
      endDate,
      bedsBooked,
      amount,
      currency = "INR",
    } = req.body;
    if (!amount) return res.status(400).json({ message: "Amount is required" });

    const qty = Number(bedsBooked) > 0 ? Number(bedsBooked) : 1;
    // compute per-unit amount so Stripe displays per-bed price if qty > 1
    const perUnit = Math.round((Number(amount) / qty) * 100);

    // allow passing richer product info from frontend
    const { productName, productDescription, productImages } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency,
            product_data: {
              name: productName || `Room ${roomId || "-"}`,
              description: productDescription || undefined,
              images:
                Array.isArray(productImages) && productImages.length
                  ? productImages
                  : undefined,
            },
            unit_amount: perUnit,
          },
          quantity: qty,
        },
      ],
      metadata: { hostelId, roomId, startDate, endDate, bedsBooked },
      success_url: `${process.env.CLIENT_URL || "http://localhost:5173"}/booking-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL || "http://localhost:5173"}/`,
    });

    res.json({ id: session.id, url: session.url });
  } catch (err) {
    console.error("createCheckoutSession error:", err);
    res.status(500).json({ message: "Failed to create checkout session" });
  }
};

export const handleStripeWebhook = (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || "",
    );
  } catch (err) {
    console.error("Webhook signature verification failed.", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (
    event.type === "checkout.session.completed" ||
    event.type === "payment_intent.succeeded"
  ) {
    const session = event.data.object;
    console.log(
      "Payment confirmed for session:",
      session.id,
      "metadata:",
      session.metadata,
    );
    // TODO: create booking in DB using session.metadata
  }

  res.json({ received: true });
};
