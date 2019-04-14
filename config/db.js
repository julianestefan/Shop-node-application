"use strict";
const mongoose = require('mongoose');

const User = require('../models/user');

const connectDB = (callback) => {
    const uri = "mongodb+srv://" + process.env.MONGO_USER + ":" + process.env.MONGO_PASSWORD + "@" + process.env.MONGO_HOST + "?retryWrites=true";

    mongoose.connect(uri, { useNewUrlParser: true })
        .then(client => {
            User.findOne().then(user => {
                if (!user) {
                    const user = new User({
                        name: 'Julian',
                        email: 'julian.y.estefan@gmail.com',
                        cart: {
                            items: []
                        }
                    });
                    user.save();
                }
            });
            callback();
            console.log('Database connection established');
        })
        .catch(err => {
            console.log(err);
        });
}

module.exports = connectDB;

