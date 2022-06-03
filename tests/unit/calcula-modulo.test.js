const CalculoModuloService = require("../../src/services/calculo-modulo-service")
const BoletoTituloService = require("../../src/services/boleto-titulo-service")
const BoletoConvenioService = require("../../src/services/boleto-convenio-service")
const calculoModulo = new CalculoModuloService()

describe("Cálculos dos Módulos", () => {
    
    it("Cálculo do Módulo 10", () => {
        const bloco = "82640000001"
        const digitoVerificador = "2"

        const dvCalculado = calculoModulo.calcularModulo10(bloco)

        expect(dvCalculado).toBe(parseInt(digitoVerificador))
    })

    it("Cálculo do DV do Código de Barras (Módulo 11) - Título Bancário", () => {
        const linhaDigitavel = "00190000090073104603310001851178568780000082772"
        const codigoBarras = new BoletoTituloService().converterLinhaDigitavelEmCodigoBarras(linhaDigitavel)
        const digitoVerificador = codigoBarras.substring(4,5)
        const excecao = 1
        const bloco = codigoBarras.substring(0,4) + codigoBarras.substring(5)
        const dvCalculado = calculoModulo.calcularModulo11(bloco, excecao)

        expect(dvCalculado).toBe(parseInt(digitoVerificador))
    })

    it("Cálculo do DV do Código de Barras (Módulo 10) - Convênio", () => {
        // Para a validação do boleto no módulo 10, é necessário que a 3ª posição do primeiro bloco seja 6 ou 7
        const linhaDigitavelPorBloco = [
            { 'bloco': '81770000000', 'dv': '0' },
            { 'bloco': '01093659970', 'dv': '2' },
            { 'bloco': '41131079703', 'dv': '9' },
            { 'bloco': '00143370831', 'dv': '8' }
        ]
        const codigoBarras = new BoletoConvenioService().gerarCodigoDeBarras(linhaDigitavelPorBloco)
        const dvGeral = codigoBarras.substring(3,4)
        const codigoBarrasSemDV = codigoBarras.substring(0,3) + codigoBarras.substring(4,44)

        const dvCalculado = calculoModulo.calcularModulo10(codigoBarrasSemDV)

        expect(dvCalculado).toBe(parseInt(dvGeral))
    })

    it("Cálculo do DV do Código de Barras (Módulo 11) - Convênio", () => {
        // Para a validação do boleto no módulo 10, é necessário que a 3ª posição do primeiro bloco seja 8 ou 9
        const linhaDigitavelPorBloco = [
            { 'bloco': '85890000001', 'dv': '8' },
            { 'bloco': '42150002202', 'dv': '8' },
            { 'bloco': '20429000000', 'dv': '4' },
            { 'bloco': '09312915719', 'dv': '8' }
        ]
        const codigoBarras = new BoletoConvenioService().gerarCodigoDeBarras(linhaDigitavelPorBloco)
        const dvGeral = codigoBarras.substring(3,4)
        const excecao = 0
        const codigoBarrasSemDV = codigoBarras.substring(0,3) + codigoBarras.substring(4,44)

        const dvCalculado = calculoModulo.calcularModulo11(codigoBarrasSemDV, excecao)

        expect(dvCalculado).toBe(parseInt(dvGeral))
    })
})