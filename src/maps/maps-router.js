'use strict';
const express = require('express');
const {requireAuth} = require('../middleware/jwt-auth');

const mapsRouter = express.Router();
const jsonBodyParser = express.json();
const path = require('path');
const fetch = require("node-fetch");

mapsRouter.route('/')
    .all(requireAuth)
    .post(jsonBodyParser, (req, res, next) => {
        const {zipcode} = req.body;
        console.log(zipcode);
        fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${zipcode}&type=bar&key=AIzaSyCG_FMdGssqTRG7tGSvu24UYFopSWQY_-g`)
            .then((obj) => obj.json()).then(
                (obj)=>{
            if(obj.results.length > 0) {
                let {lat, lng} = obj.results[0].geometry.location;
                fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=20000&name=bar&key=AIzaSyCG_FMdGssqTRG7tGSvu24UYFopSWQY_-g`)
                    .then((bars)=> bars.json()).then((bars)=>{
                    fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=20000&name=brewery&key=AIzaSyCG_FMdGssqTRG7tGSvu24UYFopSWQY_-g`)
                        .then((breweries)=> breweries.json()).then((breweries)=> res.json({results: obj.results[0].geometry.location, breweries: breweries.results, bars: bars.results}))

                });

            } else {
                res.status(404).json({error: 'Location Not Found'})
            }
                });
    });


module.exports = mapsRouter;
