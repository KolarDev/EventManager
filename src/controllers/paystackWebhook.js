const crypto = require("crypto");
const QRCode = require("qrcode");
const Event = require("../models/event");
const Ticket = require("../models/ticket");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

// Paystack calls this endpoint after user a payment success or failed
const paystackWebhook = catchAsync(async (req, res, next) => {
  console.log("📩 Paystack webhook hit");

  const paystackSecret = process.env.PAYSTACK_SECRET_KEY;
  const signature = req.headers["x-paystack-signature"];

  const hash = crypto
    .createHmac("sha512", paystackSecret)
    .update(JSON.stringify(req.body))
    .digest("hex");

  if (hash !== signature) {
    console.warn("❌ Invalid Paystack signature");
    return res.status(400).send("Invalid signature");
  }

  const eventType = req.body.event;
  const eventData = req.body.data;

  switch (eventType) {
    case "charge.success": {
      const { reference, metadata, customer, amount } = eventData;
      const { eventId, ticketType, userId } = metadata;

      console.log("✅ Payment successful:", reference);

      const event = await Event.findById(eventId);
      if (!event) {
        console.error("❌ Event not found:", eventId);
        return res.status(404).send("Event not found");
      }

      const ticket = event.ticketTypes.find((t) => t.type === ticketType);
      if (!ticket || ticket.quantity - ticket.sold <= 0) {
        console.error("❌ Ticket not available for type:", ticketType);
        return res.status(400).send("Ticket type not available");
      }

      ticket.sold += 1;
      await event.save();

      const qrData = `event=${eventId}&type=${ticketType}&user=${userId}`;
      const qrCode = await QRCode.toDataURL(qrData);

      const newTicket = await Ticket.create({
        event: eventId,
        user: userId,
        type: ticketType,
        qrCode,
        status: "valid",
      });

      console.log("🎟️ Ticket issued:", newTicket._id);

      return res.status(200).json({
        status: "success",
        message: "Payment successful, ticket issued",
        ticket: newTicket,
      });
    }
    // Simply send a message and do nothing if charge fails 
    case "charge.failed": {
      const { reference, metadata, customer } = eventData;
      console.warn("❌ Payment failed:", reference);

      return res.status(200).json({
        status: "success",
        message: "Payment failed handled",
      });
    }

    default: {
      console.log("📬 Event received:", eventType);
      return res.status(200).send("Webhook event received");
    }
  }
});


module.exports = { paystackWebhook };
