'use strict';
const express = require('express');
const {requireAuth} = require('../middleware/jwt-auth');
const  { API_KEY } = require('../config');
const mapsRouter = express.Router();
const jsonBodyParser = express.json();
const path = require('path');
const fetch = require("node-fetch");

mapsRouter.route('/')
    .all(requireAuth)
    .post(jsonBodyParser, (req, res, next) => {
        const {zipcode} = req.body;
        for (const field of [ 'zipcode']) {
            if (!(field in req.body)) {
                return res.status(400).json({
                    error: {message: `Missing ${field} in request body`}
                });
            }
        }
        fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${zipcode}&type=bar&key=${API_KEY}`)
            .then((obj) => obj.json()).then(
            (obj) => {
                if (obj.results.length > 0) {
                    let {lat, lng} = obj.results[0].geometry.location;
                    fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&name=bar&key=${API_KEY}&rankby=distance`)
                        .then((bars) => bars.json()).then((bars) => {
                        fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&name=brewery&key=${API_KEY}&rankby=distance`)
                            .then((breweries) => breweries.json()).then((breweries) => res.json({
                            results: obj.results[0].geometry.location,
                            breweries: breweries.results,
                            bars: bars.results
                        }))

                    });

                } else {
                    res.status(404).json({error: 'Location Not Found'})
                }
            });
    });


module.exports = mapsRouter;
