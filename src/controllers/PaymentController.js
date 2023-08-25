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


const getPayments = (req, res) => {
    PaymentModel.getPayments((error, results) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        res.status(200).send(results); // Modify the response as per your requirement
    });
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

const updatePayment = async (req, res) => {
    try {
        const { paymentid } = req.params;
        const { paid_amount, status } = req.body;

        const results = await PaymentModel.getPaymentById(paymentid);

        if (results.length === 0) {
            res.status(404).send({ error: 'Payment not found' });
        } else {
            await PaymentModel.updatePayment(paymentid, paid_amount, status);
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
    updatePayment
};
