const BoletoTituloService = require('./boleto-titulo-service')
const BoletoConvenioService = require('./boleto-convenio-service')
const { ArgumentoInvalido } = require('../utils/errors');

class BoletoService {
    buscarBoleto = async (linhaDigitavel) => {
        validarLinhaDigitavel(linhaDigitavel)

        if(linhaDigitavel.length == 47){
            return new BoletoTituloService().retornarDadosBoleto(linhaDigitavel)
        }else if(linhaDigitavel.length == 48){
            return new BoletoConvenioService().retornarDadosBoleto(linhaDigitavel)
        }
    }
}

validarLinhaDigitavel = (linhaDigitavel) => {
    if(isNaN(linhaDigitavel.replaceAll('.', '')) || linhaDigitavel == ""){  // Lançará o erro caso o conteúdo da linha digitável não seja numérico 
        throw new ArgumentoInvalido('Linha Digitável inválida!')
    }else if(linhaDigitavel.length != 47 && linhaDigitavel.length != 48){
        throw new ArgumentoInvalido('Tipo de Boleto não identificado ou Linha Digitável inválida!')
    }
}

module.exports = BoletoService