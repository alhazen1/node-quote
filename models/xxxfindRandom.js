module.exports = function (schema) {
    // maybe set some defaults here???

    schema.statics.findRandom = function(match, qty) {
        _this = this;
        return _this.aggregate([
            {
                $match: match
            },
            {
                $sample: {
                    size: parseInt(qty)
                }
            }
    ]);
    }
}
