const express = require("express");
const User = require("../models/user");
const { protectRoute, restrictTo } = require("../middlewares/protect");
const { paystackWebhook } = require("./../controllers/paystackWebhook");
const {
  purchaseTicket,
  verifyPayment,
  validateTicket,
  getAllTickets,
} = require("./../controllers/ticket");

const router = express.Router();

router.post("/paystack-webhook", paystackWebhook);

router.use(protectRoute);

// Purchase and verify tickets
router.post("/purchase", purchaseTicket);
// router.get('/verify-payment', verifyPayment);

router.get("/all-tickets", getAllTickets);

router.use(restrictTo("admin"));
// Validate ticket
router.post("/validate", validateTicket);

module.exports = router;
