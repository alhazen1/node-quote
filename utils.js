// edit from working branch
//second edit from working branch
// utils.js helper functions
//const exports = module.exports = {};

const safeRegex = require("safe-regex" );

const MAX_RECORDS = 10;  // should save elsewhere!!!
const PAYLOAD_INFO = {
    "how-to": "www.test.com/api-wiki",
    "bugs": "https://github.com/xxxxxxx/test-api"
}

exports.validateQuantity = (qty) => {
    
    if(!qty) return 1;
    
    if(qty.match(/^any/i)){
        return 1;
    }
    qty = parseInt(qty)
    if (!qty){
        return 1;
    } else if (qty > MAX_RECORDS) {
        return MAX_RECORDS;
    }
    return qty;
}

exports.formatResponse = (doc, payload={}) => {
    
    payload.quotes = doc.map(el => {
        return {
            "author": el.author,
            "quote": el.quote,
            "id": el._id,
            "url": "http://www.test.com/quote/quotes/v1/id/" + el._id
        };
    });

    return Object.assign(payload, PAYLOAD_INFO);
}


exports.getMatch = (params) => {
    const match = {};

    for (let prop in params) {

        if (prop === 'quantity' || prop === 'callback') {
            //skip quantity parameter
        } else if (!Array.isArray(params[prop])) {
            if (params[prop].match(/^any/i)) {
                match[prop] = {
                    $exists: true
                }
            } else {
                if (safeRegex(params[prop])) {
                    match[prop] = RegExp(params[prop], 'i');
                }
            }
        }

    }
    return match;
}

exports.reconcileRequest = ({query,params}) => {
    if (query.__v) {
        query.splice(query.indexOf('__v', 1))
    }

    const reconciled = Object.assign(query,params);

    reconciled.quantity = this.validateQuantity(reconciled.quantity);
    return reconciled;
}


