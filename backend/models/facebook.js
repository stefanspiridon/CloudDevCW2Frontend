const mongoose = require('mongoose')
const Facebook = new mongoose.Schema({
        Date: { type: String, required: true},
        Text: { type: String, required: true},
        StockId: { type: String, required: true,},
       
    },
    {collection: 'Facebook'}
)

const model = mongoose.model('FacebookData', Facebook)

module.exports = model