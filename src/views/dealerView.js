const dealerView = {
    renderDealer(res, dealer, token) {
        const { dealer_id, dealer_fullname } = dealer;

        const data = {
            dealer_fullname,
            dealer_id,
            token
        }

        res.send(data);
    },
};

module.exports = dealerView;
