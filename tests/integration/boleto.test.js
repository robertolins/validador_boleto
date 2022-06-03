const request = require('supertest')
const app = require('../../app')

describe("Validação da linha digitável do boleto", () => {
    it("Linha digitável válida", async () => {
        const linhaDigitavel = "38390000354111000000127099581418188610000005000"

        const resposta = await request(app)
            .get('/boleto/'+linhaDigitavel)

        expect(resposta.status).toEqual(200)
        expect(resposta.body).toHaveProperty('barCode')
    })
})