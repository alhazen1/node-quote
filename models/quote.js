const mongoose = require('mongoose');
//const random = require('./findRandom');

const quoteSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    author: {
        type: String,
    },
    quote: {
        type: String,
        required: true
    }
});

// testing my randomizing package
//quoteSchema.plugin(random);

module.exports = mongoose.model("Quote", quoteSchema);
