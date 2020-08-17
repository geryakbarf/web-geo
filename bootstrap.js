const express = require('express')
const app = express()
const path = require('path')
const bodyParser = require('body-parser')

//Security
app.disable('x-powered-by')

//load body parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//load template engine
app.engine('.html', require('ejs').__express)
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'html')

//load static file
app.use('/assets', express.static('public'))

//load middleware
app.use(require('./middlewares/ejs_default'))
app.use(require('./middlewares/logger'))

require('./routers')(app)

module.exports = app