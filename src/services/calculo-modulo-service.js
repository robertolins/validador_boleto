const {MODULOS} = require('../utils/constantes')

class CalculoModuloService {
    calcularModulo10 = (campo) => {
        let multiplicador = 2

        const linhaPosMultiplicacao = Object.values(campo).reverse()
            .map(digito => {
                let multiplicacao = parseInt(digito) * multiplicador
                
                multiplicacao = (multiplicacao > 9) ? somarDigitos(multiplicacao) : multiplicacao

                multiplicador = (multiplicador == 1) ? 2 : 1  // Alterna o multiplicador
                
                return multiplicacao
            })
            
        const soma = linhaPosMultiplicacao
            .reduce((prev, current) => parseInt(prev) + parseInt(current), 0)
        
        const modulo = MODULOS.MODULO_10
        const resto = soma % modulo

        return (resto != 0) ? (modulo-resto) : 0
    }

    calcularModulo11 = (bloco, valorExcecao) => {
        let multiplicador = 2

        const linhaPosMultiplicacao = Object.values(bloco).reverse()
            .map(digito => {
                let multiplicacao = parseInt(digito) * multiplicador

                multiplicador = (multiplicador != 9) ? (multiplicador+1) : 2 // Alterna o multiplicador
                
                return multiplicacao
            })

        const soma = linhaPosMultiplicacao
            .reduce((prev, current) => parseInt(prev) + parseInt(current), 0)

        const modulo = MODULOS.MODULO_11
        const resto = soma % modulo
        let digitoVerificador = modulo - resto

        if(digitoVerificador == 10 || digitoVerificador == 11){
            digitoVerificador = valorExcecao
        }

        return digitoVerificador
    }
}

const somarDigitos = (digito) => {
    return Object.values(String(digito))
        .reduce((prev, current) => parseInt(prev) + parseInt(current), 0)
}

module.exports = CalculoModuloService