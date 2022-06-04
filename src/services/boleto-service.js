const BoletoTituloService = require('./boleto-titulo-service')
const BoletoConvenioService = require('./boleto-convenio-service')
const { ArgumentoInvalido } = require('../utils/errors');
const {TAMANHO_LINHA_DIGITAVEL} = require('../utils/constantes')

class BoletoService {
    buscarBoleto = async (linhaDigitavel) => {
        validarLinhaDigitavel(linhaDigitavel)

        if(linhaDigitavel.length == TAMANHO_LINHA_DIGITAVEL.TITULO){
            return new BoletoTituloService().retornarDadosBoleto(linhaDigitavel)
        }else if(linhaDigitavel.length == TAMANHO_LINHA_DIGITAVEL.CONVENIO){
            return new BoletoConvenioService().retornarDadosBoleto(linhaDigitavel)
        }
    }
}

validarLinhaDigitavel = (linhaDigitavel) => {
    linhaDigitavel = linhaDigitavel.replaceAll('.', '').replaceAll(' ', '')
    
    if(isNaN(linhaDigitavel) || linhaDigitavel == ""){  // Lançará o erro caso o conteúdo da linha digitável não seja numérico 
        throw new ArgumentoInvalido('Linha Digitável inválida!')
    }else if(linhaDigitavel.length != TAMANHO_LINHA_DIGITAVEL.TITULO && 
        linhaDigitavel.length != TAMANHO_LINHA_DIGITAVEL.CONVENIO){
        throw new ArgumentoInvalido('Tipo de Boleto não identificado ou Linha Digitável inválida!')
    }
}

module.exports = BoletoService