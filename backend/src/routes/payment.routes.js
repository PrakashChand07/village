const express = require('express');
const router = express.Router();
const { createOrder, verifyPayment, getMyPurchases, checkAccess } = require('../controllers/paymentController');
const { protectUser } = require('../middleware/userAuth');

router.post('/create-order', protectUser, createOrder);
router.post('/verify', protectUser, verifyPayment);
router.get('/my-purchases', protectUser, getMyPurchases);
router.get('/check-access/:seriesId', protectUser, checkAccess);

module.exports = router;
