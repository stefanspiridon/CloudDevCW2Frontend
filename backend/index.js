const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const User = require('./models/user')
const Tweet = require('./models/tweet')
const Facebook = require('./models/facebook')
const Times = require('./models/times')
const Investing = require('./models/investing')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

app.use(cors())
app.use(express.json())

mongoose.connect('mongodb+srv://admin:admin@clouddevcw.hc58e.mongodb.net/CloudDevCW?retryWrites=true&w=majority')

app.post('/api/login', async (req, res) => {
	const user = await User.findOne({
		email: req.body.email,
	})

	if (!user) {
		return { status: 'error', error: 'Invalid login' }
	}

	const isPasswordValid = await bcrypt.compare(
		req.body.password,
		user.password
	)

	if (isPasswordValid) {
		const token = jwt.sign(
			{
                email: user.email,
				firstName: user.firstName,
				lastName: user.lastName,
			},
			'secret123'
		)

		return res.json({ status: 'ok', user: token })
	} else {
		return res.json({ status: 'error', user: false })
	}
})

app.post('/api/register', async (req, res) => {
	console.log(req.body)
	try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
		await User.create({
			firstName: req.body.firstName,
            lastName: req.body.lastName,
			email: req.body.email,
			password: hashedPassword,
			watchlist: [
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
		})
		res.json({ status: 'ok' })
	} catch (err) {
		res.json({ status: 'error', error: 'Duplicate email' })
	}
})

app.get('/api/userinfo', async (req, res) => {
	const token = req.headers['x-access-token']

	try {
		const decoded = jwt.verify(token, 'secret123')
		const email = decoded.email
		const user = await User.findOne({ email: email })

		return res.json({ status: 'ok', firstName: user.firstName, lastName: user.lastName, list: user.watchlist })
	} catch (error) {
		console.log(error)
		res.json({ status: 'error', error: 'invalid token' })
	}
})

app.get('/api/userwatchlist', async (req, res) => {
	const token = req.headers['x-access-token']

	try {
		const decoded = jwt.verify(token, 'secret123')
		const email = decoded.email
		const user = await User.findOne({ email: email })

		return res.json({ status: 'ok', watchlist: user.watchlist})
	} catch (error) {
		console.log(error)
		res.json({ status: 'error', error: 'invalid token' })
	}
})

app.post('/api/userwatchlist', async (req, res) => {
	const token = req.headers['x-access-token']

	console.log(req.body)
	try {
		const decoded = jwt.verify(token, 'secret123')
		const email = decoded.email

		const newWatchlist = req.body.watchlist;

		const filter = { email: email };
		const update = { watchlist: newWatchlist };

		// `doc` is the document _before_ `update` was applied
		let doc = await User.findOneAndUpdate(filter, update);

		doc = await User.findOne(filter)
		res.json({ status: 'ok' })
	} catch (err) {
		res.json({ status: 'error', error: 'Stock Not Added' })
	}
})

app.get('/api/gettweets', async (req, res) => {
	const token = req.headers['x-access-token']
	const tweet = await Tweet.find({}).limit(3);
	res.json({message : tweet})
})

app.get('/api/getfacebook', async (req, res) => {
	const token = req.headers['x-access-token']
	const facebook = await Facebook.find({}).limit(3)
	res.json({message : facebook})
})

app.get('/api/gettimes', async (req, res) => {
	const token = req.headers['x-access-token']
	const times = await Times.find({}).limit(3)
	res.json({message : times})
})

app.get('/api/getinvesting', async (req, res) => {
	const token = req.headers['x-access-token']
	const investing = await Investing.find({}).limit(3)
	res.json({message : investing})
})


app.get('/', (req, res) => {
	res.send('Hello from App Engine!');
  });


  const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});