const express = require("express");
const User = require("../models/user");
const { protectRoute, restrictTo } = require("../middlewares/protect");
const {
    purchaseTicket,
    verifyPayment,
    validateTicket
 } = require("./../controllers/ticket");

const router = express.Router();

router.use(protectRoute);


// Purchase and verify tickets
router.post('/purchase', purchaseTicket);
router.get('/verify-payment', verifyPayment);


router.use(restrictTo("admin"));
// Validate ticket
router.post('/validate', validateTicket);

module.exports = router;
