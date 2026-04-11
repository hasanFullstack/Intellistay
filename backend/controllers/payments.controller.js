import Stripe from "stripe";
import Room from "../models/Room.js";
import Hostel from "../models/Hostel.js";

const stripe = new Stripe(process.env.STRIPE_SECRET);

export const createCheckoutSession = async (req, res, next) => {
  try {
    const {
      items,
      roomId,
      quantity = 1,
      successUrl,
      cancelUrl,
      currency = "pkr",
    } = req.body;

    let line_items;

    // If a roomId is provided, fetch the real room price and use it
    if (roomId) {
      const room = await Room.findById(roomId).populate("hostelId");
      if (!room) return res.status(404).json({ message: "Room not found" });

      const hostelName =
        room.hostelId && room.hostelId.name ? room.hostelId.name : "Hostel";
      const productName = `${hostelName} - ${room.roomType} (per bed)`;
      const unitAmount = Math.round((room.pricePerBed || 0) * 100); // convert to paisa

      // Resolve image URL: prefer absolute URL, otherwise prefix with server URL
      const serverBase =
        process.env.SERVER_URL ||
        process.env.CLIENT_URL ||
        `http://localhost:${process.env.PORT || 5000}`;
      let imageUrl = null;
      if (room.images && room.images.length) {
        const first = room.images[0];
        if (typeof first === "string" && first.startsWith("http"))
          imageUrl = first;
        else
          imageUrl = `${serverBase.replace(/\/$/, "")}/${String(first).replace(/^\/+/, "")}`;
      }

      // Build a rich description with room and hostel details
      const descParts = [];
      if (room.description) descParts.push(room.description);
      descParts.push(`Type: ${room.roomType}`);
      if (room.totalBeds) descParts.push(`Total beds: ${room.totalBeds}`);
      if (room.availableBeds !== undefined)
        descParts.push(`Available: ${room.availableBeds}`);
      if (room.gender) descParts.push(`Gender: ${room.gender}`);
      const productDescription = descParts.join(" | ");

      line_items = [
        {
          price_data: {
            currency,
            product_data: {
              name: productName,
              description: productDescription,
              images: imageUrl ? [imageUrl] : [],
            },
            unit_amount: unitAmount,
          },
          quantity: parseInt(quantity, 10) || 1,
        },
      ];

      // Attach metadata for later reference (keeps full details accessible in webhooks and dashboard)
      var sessionMetadata = {
        roomId: room._id.toString(),
        hostelId: room.hostelId ? room.hostelId._id.toString() : "",
        pricePerBed: String(room.pricePerBed || ""),
        roomType: room.roomType || "",
        totalBeds: String(room.totalBeds || ""),
        availableBeds: String(room.availableBeds || ""),
        gender: room.gender || "",
      };
    } else if (items && items.length) {
      line_items = items.map((it) => ({
        price_data: {
          currency: it.currency || currency,
          product_data: { name: it.name || "Item" },
          unit_amount: Math.round((it.unit_amount || it.amount || 0) * 100),
        },
        quantity: it.quantity || 1,
      }));
    } else {
      line_items = [
        {
          price_data: {
            currency,
            product_data: { name: "Default Item" },
            unit_amount: 500 * 100,
          },
          quantity: 1,
        },
      ];
    }

    const sessionParams = {
      payment_method_types: ["card"],
      mode: "payment",
      line_items,
      success_url:
        successUrl ||
        `${process.env.CLIENT_URL || "http://localhost:5173"}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:
        cancelUrl ||
        `${process.env.CLIENT_URL || "http://localhost:5173"}/cancel`,
    };

    if (typeof sessionMetadata !== "undefined") {
      sessionParams.metadata = sessionMetadata;
      sessionParams.client_reference_id = roomId;
    }

    if (process.env.NODE_ENV !== "production") {
      console.log(
        "Stripe sessionParams:",
        JSON.stringify(sessionParams, null, 2),
      );
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    res.json({ id: session.id, url: session.url });
  } catch (err) {
    next(err);
  }
};
