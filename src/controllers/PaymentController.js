const PaymentModel = require('../models/PaymentModel');

const getPaymentById = async (req, res) => {
    try {
        const { paymentid } = req.params;
        const results = await PaymentModel.getPaymentById(paymentid);

        if (results.length === 0) {
            res.status(404).send({ error: 'Payment not found' });
        } else {
            res.status(200).send(results);
        }
    } catch (error) {
        res.status(500).send({ error: 'Error fetching payment data' });
    }
};

const updatePaymentStatus = async (req, res) => {
    try {
        const { paymentid } = req.params;
        const { status } = req.body;

        const results = await PaymentModel.getPaymentById(paymentid);

        if (results.length === 0) {
            res.status(404).send({ error: 'Payment not found' });
        } else {
            await PaymentModel.updatePaymentStatus(paymentid, status);
            res.status(200).send({ message: 'Payment status updated successfully' });
        }
    } catch (error) {
        res.status(500).send({ error: 'Error updating payment status' });
    }
};

const deletePayment = async (req, res) => {
    try {
        const { paymentid } = req.params;
        const results = await PaymentModel.getPaymentById(paymentid);

        if (results.length === 0) {
            res.status(404).send({ error: 'Payment not found' });
        } else {
            await PaymentModel.deletePayment(paymentid);
            res.status(200).send({ message: 'Payment deleted successfully' });
        }
    } catch (error) {
        res.status(500).send({ error: 'Error deleting payment' });
    }
};

const getPayments = async (req, res) => {
    try {
        const results = await PaymentModel.getPayments();
        res.status(200).send(results);
    } catch (error) {
        res.status(500).send({ error: 'Error fetching payments from the database' });
    }
};

const updatePaidAmount = async (req, res) => {
    try {
        const { paymentid } = req.params;
        const { paid_amount } = req.body;

        const results = await PaymentModel.getPaymentById(paymentid);

        if (results.length === 0) {
            res.status(404).send({ error: 'Payment not found' });
        } else {
            await PaymentModel.updatePaidAmount(paymentid, paid_amount);
            res.status(200).send({ message: 'Paid amount updated successfully' });
        }
    } catch (error) {
        res.status(500).send({ error: 'Error updating paid amount' });
    }
};

module.exports = {
    getPaymentById,
    updatePaymentStatus,
    deletePayment,
    getPayments,
    updatePaidAmount,
};
