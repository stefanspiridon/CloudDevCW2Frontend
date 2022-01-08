const mongoose = require('mongoose')
const User = new mongoose.Schema({
        firstName: { type: String, required: true},
        lastName: { type: String, required: true},
        email: { type: String, required: true, unique: true},
        password: { type: String, required: true},
        watchlist: { type: [Object], required: true, default: 
            [
                {
                    'symbol': 'TSLA',
                    'name': 'Tesla'
                }, 
                {
                    'symbol': 'MSFT',
                    'name': 'Microsoft'
                }, 
                {
                    'symbol': 'AAPL',
                    'name': 'Apple'
                }
            ]
        }
    },
    {collection: 'Users'}
)

const model = mongoose.model('UserData', User)

module.exports = model