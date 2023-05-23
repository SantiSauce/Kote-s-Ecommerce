import chai from 'chai'
import supertest from 'supertest'

const expect = chai.expect
const requester = supertest('http://localhost:8082')

describe('Testing ecommerce', () => {
    describe('Test de productos', () => {
        it('El endpoint POST /api/products/create debe crear un producto correctamente', async() => {
            const productMock = {
                title: 'Remera',
                descripition: 'Color azul',
                price: 1500,
                code: '1a2s3d',
                stock: 450,
                category: 'ropa'
            }
            const {
                statusCode,
                ok,
                _body
            } = await requester.post('/api/products/create').send(productMock)
            console.log(satisfies);
            console.log(ok);
            console.log(_body);
            expect(_body.payload).to.have.property('_id')
        } )
    })
})