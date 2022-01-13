const mongoose = require('mongoose')
const Investing = new mongoose.Schema({
        Date: { type: String, required: true},
        Text: { type: String, required: true},
        StockId: { type: String, required: true,},
       
    },
    {collection: 'Investing.com'}
)

const model = mongoose.model('Inv', Investing)

module.exports = model