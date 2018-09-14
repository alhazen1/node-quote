const MAX_RECORDS = 10;
const extraPayload = {};

const express = require('express');
const router = express.Router();
const utils = require('../../utils');


// get quote model
const Quote = require('../../models/quote');
const mongoose = require('mongoose');


const reconcileParams = ({paths},{ query}) =>{
    const pathKeys = Object.keys(paths);
    pathKeys.splice(pathKeys.indexOf('__v'), 1);

    console.log(pathKeys)
    delete query.__v;
    
}


const processRequest = (req, res, next) => {

    const parameters = Object.assign(req.params, req.query);
    //console.log(parameters)
    //console.log(Object.keys(Quote.schema.paths))
    reconcileParams(Quote.schema, req);
    
    
    if(req.query.quantity > 10){
        extraPayload.warning = "Maximum 10 quotes per request"
    }
    
    Quote.aggregate([
            {
                $match: utils.getMatch(req.query)
            },
            {
                $sample: {
                    size: utils.validateQuantity(req.query.quantity)
                }
            }
        ])
        .exec()
        .then(doc => {
            if (doc.length === 0) {
                throw 'No matching records found'
            }
            //const payload = formatResponse(doc);
            res.status(200).json(utils.formatResponse(doc, extraPayload));
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



router.get('/',processRequest);

router.get('/jsonp', (req,res,next)=>{
    Quote.findOne()
    .exec()
    .then(doc =>{
        res.status(200).jsonp(doc)
    })
})


module.exports = router;