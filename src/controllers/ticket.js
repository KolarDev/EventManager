const crypto = require("crypto");
const User = require("./../models/user");
const Event = require("./../models/event");
const Ticket = require("./../models/ticket");
const QRCode = require("qrcode");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const paystack = require("../utils/paystack");

// Purchase ticket
const purchaseTicket = catchAsync(async (req, res, next) => {
  const { eventId, ticketType } = req.body;

  // Fetch event and ticket type
  const event = await Event.findById(eventId);
  if (!event) return next(new AppError("Event not found", 404));

  const ticket = event.ticketTypes.find((t) => t.type === ticketType);
  if (!ticket || ticket.quantity - ticket.sold <= 0) {
    return next(
      new AppError(`Sorry! ${ticketType} ticket unavailable or sold out`, 404)
    );
  }

  // Create Paystack payment
  const amountInKobo = ticket.price * 100; // Paystack works in Kobo
  const payment = await paystack.transaction.initialize({
    email: req.user.email,
    amount: amountInKobo,
    callback_url: `${process.env.BASE_URL}`,
  });

  res.status(200).json({
    status: "success",
    authorization_url: payment.data.authorization_url,
  });
});

// Verify payment and issue ticket
const verifyPayment = catchAsync(async (req, res, next) => {
  const { reference, eventId, ticketType } = req.query;

  // Verify Paystack payment
  const verification = await paystack.transaction.verify({ reference });
  if (verification.data.status !== "success") {
    return next(new AppError("Payment verification failed", 400));
  }
  // Update event and ticket
  const event = await Event.findById(eventId);
  const ticket = event.ticketTypes.find((t) => t.type === ticketType);
  ticket.sold += 1;
  await event.save();

  // Generate QR code for the ticket
  const qrData = `event=${event.title}&type=${ticketType}&user=${req.user._id}&${Date.now()}`;
  const qrCode = await QRCode.toDataURL(qrData);

  // Create ticket in database
  const issuedTicket = await Ticket.create({
    event: eventId,
    user: req.user._id,
    type: ticketType,
    qrCode,
  });

  res.status(201).json({
    status: "success",
    ticket: issuedTicket,
  });
});

const paystackWebhook = catchAsync(async (req, res) => {
  const paystackSecret = process.env.PAYSTACK_SECRET_KEY;
  const hash = crypto
    .createHmac("sha512", paystackSecret)
    .update(JSON.stringify(req.body))
    .digest("hex");

  if (hash !== req.headers["x-paystack-signature"]) {
    return next(new AppError("Invalid signature", 400));
  }

  const event = req.body.event;
  if (event === "charge.success") {
    const { reference, customer, metadata, amount } = req.body.data;

    // Get event & ticket details from metadata
    const { eventId, ticketType, userId } = metadata;

    const event = await Event.findById(eventId);
    if (!event) next(new AppError("Event not found", 404));

    // Check ticket type
    const ticket = event.ticketTypes.find((t) => t.type === ticketType);
    if (!ticket || ticket.quantity - ticket.sold <= 0) {
      return next(new AppError("Ticket Type not available", 400));
    }

    // Mark ticket as sold
    ticket.sold += 1;
    await event.save();

    // Generate ticket with QR Code
    const QRCode = require("qrcode");
    const qrData = `event=${eventId}&type=${ticketType}&user=${userId}`;
    const qrCode = await QRCode.toDataURL(qrData);

    // Save ticket in database
    const newTicket = await Ticket.create({
      event: eventId,
      user: userId,
      type: ticketType,
      qrCode,
      status: "valid",
    });

    console.log("✅ Ticket Issued:", newTicket);

    return res.status(200).json({
      status: "success",
      message: "Payment successful, ticket issued",
      ticket: newTicket,
    });
  }

  res.status(200).send("Webhook received");
});

// Validate ticket using QR code
const validateTicket = catchAsync(async (req, res, next) => {
  const { qrCode } = req.body;

  // Find ticket by QR code
  const ticket = await Ticket.findOne({ qrCode });
  if (!ticket) return next(new AppError("Invalid ticket", 404));

  // Check if ticket has not been used before
  if (ticket.status === "used") {
    return next(new AppError("Ticket already used !", 400));
  }

  // Mark ticket as used
  ticket.status = "used";
  await ticket.save();

  res.status(200).json({
    status: "success",
    message: "Ticket validated successfully",
    ticket,
  });
});

module.exports = {
  purchaseTicket,
  verifyPayment,
  validateTicket,
  paystackWebhook,
};
