const express = require('express')
const rotas = require('./src/routes')
const app = express()

app.use(express.json())
rotas(app)

module.exports = app