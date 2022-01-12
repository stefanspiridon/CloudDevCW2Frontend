const mongoose = require('mongoose')
const Times = new mongoose.Schema({
        Date: { type: String, required: true},
        Text: { type: String, required: true},
        StockId: { type: String, required: true,},
       
    },
    {collection: 'EconomicTimes'}
)

const model = mongoose.model('ETimes', Times)

module.exports = model