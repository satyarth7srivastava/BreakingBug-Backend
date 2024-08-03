const bcrypt = require('bcrypt');
const Customer = require('../models/customerSchema.js');
const { createNewToken } = require('../utils/token.js');

const customerRegister = async (req, res) => { //async function to register a customer is now fixed
    try {
        const reqBody = req.body;
        const {name, email, password } = reqBody; //defining the required fields


        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password, salt);

        const customer = new Customer({
            ...reqBody,
            password: hashedPass
        });

        const existingcustomerByEmail = await Customer.findOne({ email: email });

        if (existingcustomerByEmail) {
            res.send({ message: 'Email already exists' });
        }
        else {
            let result = await customer.save();
            console.log(result);
            result.password = undefined;
            
            const token = createNewToken(result._id)

            result = {
                ...result._doc,
                token: token
            };

            res.status(200).send(result);
        }
    } catch (err) {
        res.status(400).json(err.message); //error handling updated
    }
};

const customerLogIn = async (req, res) => {
    if (req.body.email && req.body.password) {
        let customer = await Customer.findOne({ email: req.body.email });
        if (customer) { //small change from !customer to customer
            const validated = await bcrypt.compare(req.body.password, customer.password);
            if (validated) { //small change from !validated to validated
                customer.password = undefined;

                const token = createNewToken(customer._id)

                customer = {
                    ...customer._doc,
                    token: token
                };

                res.send(customer);
            } else {
                res.send({ message: "Invalid password" });
            }
        } else {
            res.send({ message: "User not found" });
        }
    } else {
        res.send({ message: "Email and password are required" });
    }
};

const getCartDetail = async (req, res) => {//working while cart is empty and when cart is not empty it is not tested yet
    try {
        let customer = await Customer.findById(req.params.id) // change from findOne to findById
        if (customer) {
            res.json(customer.cartDetails); //change from send to json
        }
        else {
            res.send({ message: "No customer found" });
        }
    } catch (err) {
        res.status(500).json(err.message);
    }
}

const cartUpdate = async (req, res) => {
    try {

        let customer = await Customer.findByIdAndUpdate(req.params.id, req.body,
            { new: false })

        return res.send(customer.cartDetails);

    } catch (err) {
        res.status(500).json(err.message);
    }
}

module.exports = {
    customerRegister,
    customerLogIn,
    getCartDetail,
    cartUpdate,
};
