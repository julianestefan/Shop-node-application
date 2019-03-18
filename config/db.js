"use strict";

const fs = require('fs');
const path = require('path');

const mongoose = require('mongoose');

const User = require('../models/user');


const instancePath = path.join(
    path.dirname(process.mainModule.filename),
    'config',
    'instance.json'
);

const connectDB = (callback) => {
    fs.readFile(instancePath, (error, content) => {
        const instance = JSON.parse(content);
        const url = "mongodb+srv://" + instance.mongodb.user + ":" + instance.password + "@demo-shop-app-kpxyo.mongodb.net/test?retryWrites=true";

        mongoose.connect(
            'mongodb+srv://julian:oqEC5KHbVKq3UB50@cluster0-djpkj.mongodb.net/test?retryWrites=true',
            { useNewUrlParser: true }
        ).then(client => {
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
        }).catch(err => {
            console.log(err);
        });
    })

}

module.exports = connectDB;

