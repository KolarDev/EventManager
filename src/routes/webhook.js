const express = require("express");
const User = require("../models/user");
const { paystackWebhook } = require("../controllers/paystackWebhook");

const router = express.Router();

router.post("/paystack-webhook", paystackWebhook);


module.exports = router;
