"use strict";

const fs = require('fs');

const mongoose = require('mongoose');

const User = require('../models/user');
const instancePath = require('../util/paths').instancePath;

const connectDB = (callback) => {
    fs.readFile(instancePath, (error, content) => {
        const instance = JSON.parse(content);
        const url = "mongodb+srv://" + instance.mongodb.user + ":" + instance.mongodb.password + "@" + instance.mongodb.host + "?retryWrites=true";

        mongoose.connect(url, { useNewUrlParser: true })
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
    })
}

module.exports = connectDB;

