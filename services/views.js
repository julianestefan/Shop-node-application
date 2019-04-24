"use strict";

const setViewEngine = (app, engine, folder ) => {
    app.set('view engine', engine);
    app.set('views', folder);
};

module.exports = setViewEngine;