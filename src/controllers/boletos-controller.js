const BoletoService = require('../services/boleto-service')
const { TratadorDeErros } = require('../utils/errors');

class BoletosController {
    static async consultarLinhaDigitavel(req, res){
        const {linhaDigitavel} = req.params
        try{
            const resposta = await new BoletoService().buscarBoleto(linhaDigitavel)
            return res.status(200).json(resposta)
        }catch(error){
            return TratadorDeErros.retornarErro(error, res)
        }
    }
}

module.exports = BoletosController