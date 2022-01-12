const mongoose = require('mongoose')
const Tweet = new mongoose.Schema({
        Date: { type: String, required: true},
        Text: { type: String, required: true},
        StockId: { type: String, required: true,},
       
    },
    {collection: 'TwitterReal'}
)

const model = mongoose.model('Tweets', Tweet)

module.exports = model