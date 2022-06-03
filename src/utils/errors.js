class ArgumentoInvalido extends Error {
    constructor(mensagem) {
      super(mensagem);
    }
}

class TratadorDeErros {
    static retornarErro (err, res) {
        if (err instanceof ArgumentoInvalido) {
            return res.status(400).json({ erro: err.message });
        } else {
            return res.status(500).json({ erro: err.message });
        }
    }
}
  
module.exports = {
    TratadorDeErros: TratadorDeErros,
    ArgumentoInvalido: ArgumentoInvalido
}