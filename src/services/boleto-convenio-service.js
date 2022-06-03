const moment = require('moment')
const { ArgumentoInvalido } = require('../utils/errors')

const CalculoModuloService = require('./calculo-modulo-service')

class BoletoConvenioService {
    retornarDadosBoleto = (linhaDigitavel) => {
        validarLinhaDigitavel(linhaDigitavel)

        let linhaDigitavelPorBloco = desestruturarPorBloco(linhaDigitavel)
        validarBlocos(linhaDigitavelPorBloco)

        const codigoBarras = this.gerarCodigoDeBarras(linhaDigitavelPorBloco)
        validarDVGeral(codigoBarras)
        
        const valor = extrairValor(codigoBarras)
        const dataVencimento = extrairDataVencimento(codigoBarras) // Passando como parâmetro o fator de vencimento

        return {
            barCode: codigoBarras,
            amount: valor,
            expirationDate: dataVencimento
        }
    }

    gerarCodigoDeBarras = (linhaDigitPorBloco) => {
        const codigoBarras = linhaDigitPorBloco
            .reduce((prev, current) => prev + current.bloco, "")
    
        return codigoBarras
    }
}

const validarLinhaDigitavel = (linhaDigitavel) => {
    
    if(linhaDigitavel.substring(0,1) != 8) // Arrecadação
        throw new ArgumentoInvalido('A Linha Digitável não corresponde a uma arrecadação!')
    else if(linhaDigitavel.substring(1,2) == 0 || linhaDigitavel.substring(1,2) == 8)
        throw new ArgumentoInvalido('Identificador do segmento inválido!')
    else if(!['6','7','8','9'].includes(linhaDigitavel.substring(2,3))) 
        throw new ArgumentoInvalido('Identificador do Valor Efetivo ou Referência inválido!')
}

const desestruturarPorBloco = (linhaDigitavel) => {
    let codigoDesestruturado = []

    codigoDesestruturado[0] = {
        'bloco': linhaDigitavel.substring(0,11),
        'dvBloco': linhaDigitavel.substring(11,12)
    }

    codigoDesestruturado[1] = {
        'bloco': linhaDigitavel.substring(12,23),
        'dvBloco': linhaDigitavel.substring(23,24)
    }

    codigoDesestruturado[2] = {
        'bloco': linhaDigitavel.substring(24,35),
        'dvBloco': linhaDigitavel.substring(35,36)
    }

    codigoDesestruturado[3] = {
        'bloco': linhaDigitavel.substring(36,47),
        'dvBloco': linhaDigitavel.substring(47,48)
    }

    return codigoDesestruturado
}

const validarBlocos = (linhaDigitPorBloco) => {
    const valorReferencia = linhaDigitPorBloco[0].bloco.substring(2,3)

    const calculoModulo = new CalculoModuloService()
    
    if(valorReferencia == 6 || valorReferencia == 7){
        linhaDigitPorBloco.forEach((bloco, indice) => {
            if(bloco.dvBloco != calculoModulo.calcularModulo10(bloco.bloco)){ // Valida se os DVs dos blocos batem com o cálculo do Módulo 10 
                throw new ArgumentoInvalido(`Dígito Validador do bloco ${indice+1} inválido`)
            }
        })
    }else if(valorReferencia == 8 || valorReferencia == 9){
        linhaDigitPorBloco.forEach((bloco, indice) => {
            // Valida se os DVs dos blocos batem com o cálculo do Módulo 11
            // O segundo parâmetro é passado com 0, pois será o valor do cálculo caso entre na exceção
            if(bloco.dvBloco != calculoModulo.calcularModulo11(bloco.bloco, 0)){ 
                throw new ArgumentoInvalido(`Dígito Validador do bloco ${indice+1} inválido`)
            }
        })
    }
}

const validarDVGeral = (codigoBarras) => {

    const valorReferencia = codigoBarras.substring(2,3)
    const dvGeral = codigoBarras.substring(3,4)
    const codigoBarrasSemDV = codigoBarras.substring(0,3) + codigoBarras.substring(4,44)
    
    const calculoModulo = new CalculoModuloService()

    if(valorReferencia == 6 || valorReferencia == 7){
        if(dvGeral != calculoModulo.calcularModulo10(codigoBarrasSemDV)){ // Valida se o DV Geral bate com o cálculo do Módulo 10 
            throw new ArgumentoInvalido(`Dígito Validador Geral inválido!`)
        }
    }else if(valorReferencia == 8 || valorReferencia == 9){
        // Valida se o DV Geral bate com o cálculo do Módulo 11 
        // O segundo parâmetro é passado com 0, pois será o valor do cálculo caso entre na exceção
        if(dvGeral != calculoModulo.calcularModulo11(codigoBarrasSemDV, 0)){ 
            throw new ArgumentoInvalido(`Dígito Validador Geral inválido!`)
        }
    }
}

const extrairValor = (codigoBarras) => {
    const valorReferencia = codigoBarras.substring(2,3)
    let valor = ""

    if(valorReferencia == 6 || valorReferencia == 8){ // Valor Efetivo
        valor = codigoBarras.substring(4,15)
    }else if(valorReferencia == 7 || valorReferencia == 9){ // Valor Referência
        // TODO: Não entendi como extrair o valor dessa situação, sendo assim, retorna o valor normal
        valor = codigoBarras.substring(4,15)
    }

    return (valor != "00000000000") 
        ? converterValorStringParaDecimal(valor) 
        : undefined
}

const converterValorStringParaDecimal = (valorString) => {
    return (parseFloat(valorString) / 100).toFixed(2)
}

const extrairDataVencimento = (codigoBarras) => {
    const segmento = codigoBarras.substring(1,2)
    const camposLivres = (segmento == 6) ? codigoBarras.substring(23,44) : codigoBarras.substring(19,44)
    
    if(camposLivres.substring(0,8) == "00000000") return undefined

    let dataVencimento = moment(camposLivres.substring(0,8), "YYYYMMDD")

    return (dataVencimento.isValid()) 
        ? dataVencimento.format('YYYY-MM-DD') 
        : undefined
}

module.exports = BoletoConvenioService