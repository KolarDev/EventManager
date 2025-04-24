const express = require('express');
const User = require('../models/user');
const { protectRoute, restrictTo } = require('../middlewares/protect');
const { paystackWebhook } = require('./../controllers/paystackWebhook');
const {
  purchaseTicket,
  verifyPayment,
  validateTicket,
  getAllTickets,
} = require('./../controllers/ticket');

const router = express.Router();

router.post(
  '/paystack-webhook',
  // #swagger.tags = ['Webhooks']
  // #swagger.description = 'Webhooks endpoint to listen for events from paystack'
  paystackWebhook,
);

router.use(protectRoute);

// Purchase and verify tickets
router.post(
  '/purchase',
  // #swagger.tags = ['Tickets']
  // #swagger.description = 'User purchases ticket by initializing paystack payment gateway'
  purchaseTicket,
);
// router.get('/verify-payment', verifyPayment);

router.use(restrictTo('admin'));

// Validate ticket
router.post(
  '/validate',
  // #swagger.tags = ['Tickets']
  // #swagger.description = 'Admin validates tickets manually'
  validateTicket,
);

router.get(
  '/all-tickets',
  // #swagger.tags = ['Tickets']
  // #swagger.description = 'Get all tickets'
  getAllTickets,
);

module.exports = router;
