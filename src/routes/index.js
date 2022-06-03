const router = require('express').Router();

const boletosController = require('../controllers/boletos-controller')

router.get('/boleto/:linhaDigitavel', boletosController.consultarLinhaDigitavel)

module.exports = app => {
    app.use(router)
}