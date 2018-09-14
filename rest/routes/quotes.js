const MAX_RECORDS = 10;
const extraPayload = {};

const express = require('express');
const router = express.Router();
const utils = require('../../utils');

// get quote model
const Quote = require('../../models/quote');
const mongoose = require('mongoose');


const processRequest = (req, res, next) => {

   // const func = 'jsonp'

    const reconciledRequest = utils.reconcileRequest(req);

    if (parseInt(req.params.quantity) > MAX_RECORDS) {
        extraPayload.warning = "Maximum " + MAX_RECORDS + " quotes per request"
    }

    Quote.aggregate([
            {
                $match: utils.getMatch(reconciledRequest)
            },
            {
                $sample: {
                    size: reconciledRequest.quantity
                }
            }
        ])
        .exec()
        .then(doc => {

            if (doc.length === 0) {
                throw 'No matching records found'
            }

            res.status(200).jsonp(utils.formatResponse(doc, extraPayload));
        })
        .catch(err => {
            res.status(404).json({
                error: {
                    message: err
                }, //right???
                "how-to": "www.test.com/api-wiki",
                "bugs": "https://github.com/xxxxxxx/test-api"
            })
        });
};

// handle GET requests
router.get('/', processRequest);
router.get('/quantity/:quantity', processRequest);
router.get('/quantity/:quantity/author/:author', processRequest);
router.get('/quantity/:quantity/author/:author/keyword/:quote', processRequest);

router.get('/quantity/:quantity/author/:author/keyword/:quote/callback/:callback', processRequest);



router.get('/id/:id/', (req, res, next) => {

    Quote.findById(req.params.id) //(req.params.id)
        .exec()
        .then(doc => {

            const docArray = []
            docArray.push(doc)

            res.status(200).jsonp(utils.formatResponse(docArray));
        })
        .catch(err => {
            res.status(404).jsonp({
                error: {
                    message: err
                }, //right???
                "how-to": "www.test.com/api-wiki",
                "bugs": "https://github.com/xxxxxxx/test-api"
            })
        })
});

router.get('/id/:id/callback/:callback', (req, res, next) => {
    
    // merges req.param into req.query
    utils.reconcileRequest(req);
    //req.query.callback = 'quoteBack'

    Quote.findById(req.params.id) //(req.params.id)
        .exec()
        .then(doc => {

            const docArray = []
            docArray.push(doc)

            res.status(200).jsonp(utils.formatResponse(docArray));
        })
        .catch(err => {
            res.status(404).jsonp({
                error: {
                    message: err
                }, //right???
                "how-to": "www.test.com/api-wiki",
                "bugs": "https://github.com/xxxxxxx/test-api"
            })
        })
});






module.exports = router;
