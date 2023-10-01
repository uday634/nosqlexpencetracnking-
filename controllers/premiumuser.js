const Razorpay = require('razorpay');
const User = require('../models/User');
const Order = require('../models/orders');
const Expense = require('../models/Expense');
const Sequelize = require('sequelize');
const sequelize = require('../util/sqlconfig') // Import Sequelize

exports.premimumpending = async (req, res, next) => {
    try {
        const rzp = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });

        const user = req.user;
        const amount = 2500;

        rzp.orders.create({ amount, currency: "INR" }, (err, order) => {
            if (err) {
                console.error(err); // Log the error
                return res.status(403).json({ message: 'Not able to process the payment' });
            }

            Order.create({
                orderid: order.id,
                status: 'PENDING',
                UserId: user.userId // Corrected user id field
            }).then(() => {
                return res.status(201).json({ order, key_id: rzp.key_id });
            }).catch((err) => {
                console.error(err); // Log the error
                return res.status(403).json({ message: 'Not able to process the payment' });
            });
        });
    } catch (err) {
        console.log(err);
        res.status(403).json({ message: 'Not able to process the payment' });
    }
}

exports.premimumverfication = async (req, res, next) => {
    let t;
    try {
        console.log('Request Body:', req.body);
        const { payment_id, order_id } = req.body;

        const orderPromise = Order.findOne({ where: { orderid: order_id } });
        const userPromise = User.findByPk(req.user.userId);

        t = await sequelize.transaction()

        const [order, user] = await Promise.all([orderPromise, userPromise]);

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        await order.update({ paymentid: payment_id, status: "SUCCESSFUL" }, {transaction: t});
        await user.update({ ispremiumuser: true }, {transaction: t});

        return res.status(202).json({ success: true, message: "Transaction successful" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}



