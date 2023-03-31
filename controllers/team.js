'use strict'

const controller = {

    test: (req, res) => {
        return res.status(200).send({
            message: 'Test'
        });
    }
};

module.exports = controller;