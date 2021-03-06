const serverless = require('serverless-http')
const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000
const Cosmic = require('cosmicjs')
const api = Cosmic()
const COSMIC_BUCKET = process.env.COSMIC_BUCKET || 'node-starter'
const COSMIC_READ_KEY = process.env.COSMIC_READ_KEY || ''
let stage_path = 'dev/'
if (process.env.STAGE === 'local')
	stage_path = ''
const bucket = api.bucket({
	slug: COSMIC_BUCKET,
	read_key: COSMIC_READ_KEY
})
app.set('view engine', 'ejs')
app.get('/:slug?', (req, res) => {
	let slug = req.params.slug
	const year = (new Date().getFullYear())
	if (!slug)
		slug = 'home'
	bucket.getObject({ slug }).then(data => {
		const page = data.object
		res.render('pages/default', { page, year, stage_path })
	}).catch(err => {
		const page = { title: 'Page not found' }
		res.render('pages/404', { page, year, stage_path })
	})
})

module.exports.handler = serverless(app);