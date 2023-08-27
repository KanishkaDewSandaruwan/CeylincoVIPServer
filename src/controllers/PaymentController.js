const PaymentModel = require('../models/PaymentModel');

const getPaymentById = (req, res) => {
    const { paymentid } = req.params;

    PaymentModel.getPaymentById(paymentid, (error, results) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching payment data' });
            return;
        }

        if (results.length === 0) {
            res.status(404).send({ error: 'Payment not found' });
            return;
        }

        res.status(200).send(results);
    });
};

const updatePaymentStatus = (req, res) => {
    const { paymentid } = req.params;
    const { status } = req.body;

    PaymentModel.getPaymentById(paymentid, (error, results) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching payment data' });
            return;
        }

        if (results.length === 0) {
            res.status(404).send({ error: 'Payment not found' });
            return;
        }

        PaymentModel.updatePaymentStatus(paymentid, status, (error) => {
            if (error) {
                res.status(500).send({ error: 'Error updating payment status' });
                return;
            }

            res.status(200).send({ message: 'Payment status updated successfully' });
        });
    });
};

const deletePayment = (req, res) => {
    const { paymentid } = req.params;

    PaymentModel.getPaymentById(paymentid, (error, results) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching payment data' });
            return;
        }

        if (results.length === 0) {
            res.status(404).send({ error: 'Payment not found' });
            return;
        }

        PaymentModel.deletePayment(paymentid, (error) => {
            if (error) {
                res.status(500).send({ error: 'Error deleting payment' });
                return;
            }

            res.status(200).send({ message: 'Payment deleted successfully' });
        });
    });
};

const updatedeletePayment = (req, res) => {
    const { paymentid } = req.params;

    PaymentModel.getPaymentById(paymentid, (error, results) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching payment data' });
            return;
        }

        if (results.length === 0) {
            res.status(404).send({ error: 'Payment not found' });
            return;
        }

        PaymentModel.updatedeletePayment(paymentid, (error) => {
            if (error) {
                res.status(500).send({ error: 'Error deleting payment' });
                return;
            }

            res.status(200).send({ message: 'Payment deleted successfully' });
        });
    });
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

const getPaymentsCompleted = (req, res) => {
    PaymentModel.getPaymentsCompleted((error, results) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        res.status(200).send(results); // Modify the response as per your requirement
    });
};
const getPaymentsPending = (req, res) => {
    PaymentModel.getPaymentsPending((error, results) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        res.status(200).send(results); // Modify the response as per your requirement
    });
};

const updatePaidAmount = (req, res) => {
    const { paymentid } = req.params;
    const { paid_amount } = req.body;

    PaymentModel.getPaymentById(paymentid, (error, results) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        if (results.length === 0) {
            res.status(404).send({ error: 'Payment not found' });
            return;
        }

        PaymentModel.updatePaidAmount(paymentid, paid_amount, (error, updateResults) => {
            if (error) {
                res.status(500).send({ error: 'Error updating paid amount' });
                return;
            }

            res.status(200).send({ message: 'Paid amount updated successfully' });
        });
    });
};

const updatePayment = (req, res) => {
    const { paymentid } = req.params;
    const { commition_amount } = req.body;

    PaymentModel.getPaymentById(paymentid, (error, results) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        if (results.length === 0) {
            res.status(404).send({ error: 'Payment not found' });
            return;
        }

        const { commition_amount } = req.body;

        PaymentModel.updatePayment(paymentid, commition_amount, (error, updateResults) => {
            if (error) {
                res.status(500).send({ error: 'Error updating paid amount' });
                return;
            }

            res.status(200).send({ message: 'Update successfully Completed!' });
        });
    });
};



module.exports = {
    getPaymentById,
    updatePaymentStatus,
    deletePayment,
    getPayments,
    updatePaidAmount,
    updatePayment,
    updatedeletePayment,
    getPaymentsPending,
    getPaymentsCompleted
};
