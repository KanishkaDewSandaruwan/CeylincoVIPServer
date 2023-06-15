const userView = {
    renderUser(res, user, token) {
        const { userid, fullname, username, email, phone, address } = user;

        const data = {
            userData: {
                fullname,
                email,
                username,
                phone,
                address
            },
            userid,
            token
        }

        res.send(data);
    },
};

module.exports = userView;
