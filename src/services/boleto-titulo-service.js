const moment = require('moment')
const { ArgumentoInvalido } = require('../utils/errors')

const CalculoModuloService = require('./calculo-modulo-service')

class BoletoTituloService {
    retornarDadosBoleto = (linhaDigitavel) => {

        validarCamposDaLinha(linhaDigitavel)

        let codigoBarras = this.converterLinhaDigitavelEmCodigoBarras(linhaDigitavel)
        validarCodigoDeBarras(codigoBarras)

        const dataVencimento = calcularDataVencimento(codigoBarras.substring(5,9)) // Passando como parâmetro o fator de vencimento
        const valor = extrairValor(codigoBarras.substring(9,19))

        return {
            barCode: codigoBarras,
            amount: valor,
            expirationDate: dataVencimento
        }
    }

    converterLinhaDigitavelEmCodigoBarras = (linhaDigitavel) => {
        return linhaDigitavel.substring(0,3) + linhaDigitavel.substring(3,4) +
            linhaDigitavel.substring(32,33) + linhaDigitavel.substring(33,37) +
            linhaDigitavel.substring(37,47) + linhaDigitavel.substring(4,9) +
            linhaDigitavel.substring(10,20) + linhaDigitavel.substring(21,31)
    }
}

const validarCamposDaLinha = (linhaDigitavel) => {
    let linhaDigitavelPorCampo = desestruturarPorCampo(linhaDigitavel)

    const calculoModulo = new CalculoModuloService()

    linhaDigitavelPorCampo.forEach((campo, indice) => {
        if(campo.dv != calculoModulo.calcularModulo10(campo.numero)){ // Valida se os DVs dos campos batem com o cálculo do Módulo 10 
            throw new ArgumentoInvalido(`Dígito Validador do campo ${indice+1} inválido`)
        }
    })
}

const desestruturarPorCampo = (linhaDigitavel) => {
    let campos = []
    campos[0] = {
        'numero': linhaDigitavel.substring(0,9),
        'dv': linhaDigitavel.substring(9,10)
    }

    campos[1] = {
        'numero': linhaDigitavel.substring(10,20),
        'dv': linhaDigitavel.substring(20,21)
    }

    campos[2] = {
        'numero': linhaDigitavel.substring(21,31),
        'dv': linhaDigitavel.substring(31,32)
    }

    return campos
}

const validarCodigoDeBarras = (codigoBarras) => {
    let codigoBarrasSemDV = codigoBarras.substring(0,4) + codigoBarras.substring(5)

    // O segundo parâmetro é passado com 1, pois será o valor do cálculo caso entre na exceção
    const dvCodigoBarras = new CalculoModuloService().calcularModulo11(codigoBarrasSemDV, 1)

    if(dvCodigoBarras != codigoBarras.substring(4,5))
        throw new ArgumentoInvalido('Dígito verificador do Código de Barras está inválido!')
}

const calcularDataVencimento = (fatorVencimento) => {
    const dataBase = "1997-10-07"

    const dataVencimento = moment(dataBase, "YYYY-MM-DD")
        .add(fatorVencimento, 'days')
        .format("YYYY-MM-DD")

    return dataVencimento
}

const extrairValor = (campoValor) => {
    return (campoValor != "0000000000")
        ? converterValorStringParaDecimal(campoValor)
        : undefined
}

const converterValorStringParaDecimal = (valorString) => {
    return (parseFloat(valorString) / 100).toFixed(2)
}

module.exports = BoletoTituloService