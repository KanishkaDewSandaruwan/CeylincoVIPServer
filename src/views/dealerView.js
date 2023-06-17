const dealerView = {
    renderDealer(res, dealer, token) {
        const { dealer_id } = dealer;

        const data = {
            dealer_id,
            token
        }

        res.send(data);
    },
};

module.exports = dealerView;
