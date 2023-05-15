const cors = require('cors')
const express = require('express');
const { OAuth2Client } = require('google-auth-library');
const createError = require('http-errors');
const morgan = require('morgan')
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use(morgan('dev'))
app.use(cors())

const clientToken = '794606318486-l11p9bb0drpfpj6eaovmqf9msgb54gk2.apps.googleusercontent.com';
const oAuth2Client = new OAuth2Client(clientToken, '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')

async function verify(req, res, next) {
	const authHeader = req.headers.authorization;
	if (!authHeader) {
		next(createError.Unauthorized());
	}
	const token = authHeader.split(' ')[1];
	const ticket = await oAuth2Client.verifyIdToken({ idToken: token, audience: clientToken })
	const payload = ticket.getPayload();
	if (payload) {
		req.userId = payload['sub']
		next();
		return;
	}
	next(createError.Unauthorized());
}

app.get('/protected', verify, async (req, res, next) => {
	res.send({ message: 'protected route!' })
})

app.get('/', async (req, res, next) => {
	res.send({ message: "Awesome it works. 👍" })
})

app.use((req, res, next) => {
	next(createError.NotFound())
})

app.use((err, req, res, next) => {
	res.status(err.status || 500)
	res.send({
		status: err.status || 500,
		message: err.message
	})
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`App is running http://localhost:${PORT} 🚀`));