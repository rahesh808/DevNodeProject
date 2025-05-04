const express = require('express');
const paymentRouter = express.Router();

const { userAuth } = require('../middlewares/auth');
const { razorpayInstance } = require('../utils/razorpay');
const { membershipTypes } = require('../utils/constants');
paymentRouter.post('/payment/create', userAuth, async (req, res) => {
    try {

        const user = req.user;
        const membershipType = req.body.membershipType;
        const amount = membershipTypes(membershipType) * 100;
        if (!user) return res.status(401).send('User not found');
        if (!membershipType) return res.status(400).send('Membership type is required');
        var options = {
            amount: amount,
            currency: "INR",
            receipt: "order_rcptid_11",
            notes: {
                firstName: user.firstName,
                lastName: user.lastName,
                membershipType: membershipType
    
            }
          };
        const order = await razorpayInstance.orders.create(options);
        if (!order) return res.status(500).send('Some error occured');

        const payment = new Payment({
            userId: user._id,
            orderId: order.id,
            amount: order.amount,
            status: order.status,
            currency: order.currency,
            receipt: order.receipt,
            notes: {
                firstName: user.firstName,
                lastName: user.lastName,
                emailId: user.emailId,
                membershipType: membershipType
            }
        });
        const savedPayment = await payment.save();
        res.json({
            ... savedPayment.toJSON(),
            key: process.env.RAZORPAY_KEY_ID
        });
    } catch(err) {
        res.status(500).send('Error creating payment: ' + err.message);
    }
})

module.exports = paymentRouter;