const Razorpay = require('razorpay');
require('dotenv').config();
const User = require('../models/User');
const Order = require('../models/orders');

const razorpay = new Razorpay({
    key_id: 'rzp_test_UadLgNNiOEmq1O',
    key_secret: 'bigN1SSWQPiReffdxEdcQ6gd'
});


exports.premiumPending = async (req, res, next) => {
    try {
        const user = req.user;
        const amount = 2500;

        // Create a Razorpay order
        const order = await razorpay.orders.create({ amount, currency: "INR" });
        console.log(order)

        if (!order) {
            return res.status(403).json({ message: 'Unable to create the payment order' });
        }

        // Create a new premium order document
        const premiumOrder = new Order({
            orderid: order.id,
            status: 'PENDING',
            userId: user.userId
        });

        // Save the premium order to the database
         await premiumOrder.save();
        

        return res.status(201).json({ order, key_id: razorpay.key_id });
    } catch (err) {
        console.log(err);
        res.status(403).json({ message: 'Unable to process the payment' });
    }
}

exports.premiumVerification = async (req, res, next) => {
    try {
        console.log('Request Body:', req.body);
        const { payment_id, order_id } = req.body;

        // Find the premium order in your database
        const order = await Order.findOne({ orderid: order_id });

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        // Update the premium order with payment information
        order.paymentid = payment_id;
        order.status = 'SUCCESSFUL';
        await order.save();

        // Update the user to indicate they are a premium user
        const user = await User.findOne({ _id: req.user.userId });
        user.ispremiumuser = true;
        await user.save();

        return res.status(202).json({ success: true, message: "Transaction successful" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}
