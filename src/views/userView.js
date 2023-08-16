const userView = {
    renderUser(res, user, token) {
        const { userid, fullname, username, email, userrole, phone, address } = user;

        const data = {
            userData: {
                fullname,
                email,
                username,
                phone,
                address
            },
            userrole,
            userid,
            token
        }

        res.send(data);
    },
};

module.exports = userView;
