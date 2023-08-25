const PaymentModel = require('../models/PaymentModel');

const getPaymentById = (req, res) => {
    const { paymentid } = req.params;
    PaymentModel.getPaymentById(paymentid)
        .then((results) => {
            if (results.length === 0) {
                res.status(404).send({ error: 'Payment not found' });
            } else {
                res.status(200).send(results);
            }
        })
        .catch((error) => {
            res.status(500).send({ error: 'Error fetching data from the database' });
        });
};

const updatePaymentStatus = (req, res) => {
    const { paymentid } = req.params;
    const { status } = req.body;

    PaymentModel.getPaymentById(paymentid)
        .then((results) => {
            if (results.length === 0) {
                res.status(404).send({ error: 'Payment not found' });
            } else {
                PaymentModel.updatePaymentStatus(paymentid, status, (error, updateResults) => {
                    if (error) {
                        res.status(500).send({ error: 'Error updating payment status' });
                    } else {
                        res.status(200).send({ message: 'Payment status updated successfully' });
                    }
                });
            }
        })
        .catch((error) => {
            res.status(500).send({ error: 'Error fetching payment data' });
        });
};


const deletePayment = (req, res) => {
    const { paymentid } = req.params;

    PaymentModel.getPaymentById(paymentid)
        .then((results) => {
            if (results.length === 0) {
                res.status(404).send({ error: 'Payment not found' });
            } else {
                PaymentModel.deletePayment(paymentid, (error, deleteResults) => {
                    if (error) {
                        res.status(500).send({ error: 'Error deleting payment' });
                    } else {
                        res.status(200).send({ message: 'Payment deleted successfully' });
                    }
                });
            }
        })
        .catch((error) => {
            res.status(500).send({ error: 'Error fetching payment data' });
        });
};


const getPayments = (req, res) => {
    PaymentModel.getPayments((error, results) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching payments from the database' });
        } else {
            res.status(200).send(results);
        }
    });
};

const updatePaidAmount = (req, res) => {
    const { paymentid } = req.params;
    const { paid_amount } = req.body;

    PaymentModel.getPaymentById(paymentid)
        .then((results) => {
            if (results.length === 0) {
                res.status(404).send({ error: 'Payment not found' });
            } else {
                PaymentModel.updatePaidAmount(paymentid, paid_amount, (error, updateResults) => {
                    if (error) {
                        res.status(500).send({ error: 'Error updating paid amount' });
                    } else {
                        res.status(200).send({ message: 'Paid amount updated successfully' });
                    }
                });
            }
        })
        .catch((error) => {
            res.status(500).send({ error: 'Error fetching payment data' });
        });
};



module.exports = {
    getPaymentById,
    updatePaymentStatus,
    deletePayment,
    getPayments,
    updatePaidAmount,

};
