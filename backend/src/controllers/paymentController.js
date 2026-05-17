const crypto = require('crypto');
const Razorpay = require('razorpay');
const Purchase = require('../models/Purchase');
const TestSeries = require('../models/TestSeries');

// @desc    Create Razorpay order
// @route   POST /api/payment/create-order
const createOrder = async (req, res) => {
  try {
    const { testSeriesId } = req.body;

    const series = await TestSeries.findById(testSeriesId);
    if (!series) return res.status(404).json({ success: false, message: 'Test series not found' });

    if (series.isFree) {
      return res.status(400).json({ success: false, message: 'This test series is free. No payment needed.' });
    }

    // Check if already purchased
    const existing = await Purchase.findOne({ user: req.user._id, testSeries: testSeriesId, status: 'success' });
    if (existing) {
      return res.status(400).json({ success: false, message: 'You have already purchased this test series.' });
    }

    const amount = series.discountPrice || series.price;

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: amount * 100, // paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      notes: {
        userId: req.user._id.toString(),
        testSeriesId: testSeriesId,
        testSeriesTitle: series.title,
      },
    };

    const order = await razorpay.orders.create(options);

    // Create a pending purchase record
    await Purchase.create({
      user: req.user._id,
      testSeries: testSeriesId,
      razorpayOrderId: order.id,
      amount,
      status: 'pending',
    });

    res.status(200).json({
      success: true,
      order,
      key: process.env.RAZORPAY_KEY_ID,
      amount,
      testSeriesTitle: series.title,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Payment initiation failed', error: error.message });
  }
};

// @desc    Verify Razorpay payment
// @route   POST /api/payment/verify
const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, testSeriesId } = req.body;

    // Verify signature
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest('hex');

    if (razorpay_signature !== expectedSign) {
      await Purchase.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        { status: 'failed' }
      );
      return res.status(400).json({ success: false, message: 'Payment verification failed. Invalid signature.' });
    }

    // Update purchase record
    const purchase = await Purchase.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      {
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        status: 'success',
        purchasedAt: new Date(),
      },
      { new: true }
    );

    if (!purchase) {
      return res.status(404).json({ success: false, message: 'Purchase record not found' });
    }

    // Update enrolled count
    await TestSeries.findByIdAndUpdate(testSeriesId, { $inc: { studentsEnrolled: 1 } });

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully! You now have access.',
      purchase,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Payment verification failed', error: error.message });
  }
};

// @desc    Get user's purchased test series
// @route   GET /api/payment/my-purchases
const getMyPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.find({ user: req.user._id, status: 'success' })
      .populate('testSeries', 'title category price')
      .sort({ purchasedAt: -1 });

    const purchasedSeriesIds = purchases.map((p) => p.testSeries?._id?.toString());
    res.status(200).json({ success: true, data: purchases, purchasedSeriesIds });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Check if user has access to a specific series
// @route   GET /api/payment/check-access/:seriesId
const checkAccess = async (req, res) => {
  try {
    const series = await TestSeries.findById(req.params.seriesId);
    if (!series) return res.status(404).json({ success: false, message: 'Series not found' });

    if (series.isFree) {
      return res.status(200).json({ success: true, hasAccess: true, reason: 'free' });
    }

    const purchase = await Purchase.findOne({
      user: req.user._id,
      testSeries: req.params.seriesId,
      status: 'success',
    });

    res.status(200).json({ success: true, hasAccess: !!purchase, reason: purchase ? 'purchased' : 'not-purchased' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

module.exports = { createOrder, verifyPayment, getMyPurchases, checkAccess };
