const errors = require('restify-errors');
const Customer = require('../models/Customer');
module.exports = (server) => {
    //GET Customers
    server.get('/customers', async (req, res, next) => {
        try {
            const Customers = await Customer.find({});
            return res.json(Customers);
        } catch (err) {
            return next(new errors.InvalidContentError(err));
        }
    });

    //GET Single Customer

    server.get('/customers/:id', async (req, res, next) => {
        try {
            const Customers = await Customer.findById(req.params.id);
            res.send(Customers);
            next();
        } catch (err) {
            return next(new errors.ResourceNotFoundError(`There is no Customer with the id of ${req.params.id} `));
        }
    });

    //Add Customer
    server.post('/customers', async (req, res, next) => {
        //Chech for JSON
        if (!req.is('application/json')) {
            return next(new errors.InvalidContentError("Expects 'application/json'"));
        } else {
            const {
                name,
                email,
                balance
            } = req.body;
            const customer = new Customer({
                name,
                email,
                balance
            });

            try {
                const newCustomer = await customer.save();
                res.send(201);
                next();
            } catch (err) {
                return next(new errors.InternalError(err.message));
            }
        }
    });

    //UPDATE Customer
    server.put('/customers/:id', async (req, res, next) => {
        //Chech for JSON
        if (!req.is('application/json')) {
            return next(new errors.InvalidContentError("Expects 'application/json'"));
        }
        try {
            const customer = await Customer.findOneAndUpdate({
                    _id: req.params.id
                },
                req.body, {
                    new: true
                }
            );
            res.send(200);
            next();
        } catch (err) {
            return next(new errors.ResourceNotFoundError(`There is no Customer with the id of ${req.params.id} `));
        }
    });

    //DELETE Customer
    server.del('/customers/:id', async (req, res, next) => {
        try {
            const customer = await Customer.findOneAndDelete({
                _id: req.params.id
            });
            res.send(204);
            next();
        } catch (err) {
            return next(new errors.ResourceNotFoundError(`There is no Customer with the id of ${req.params.id} `));
        }
    })
};