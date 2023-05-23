import chai from 'chai'
import supertest from 'supertest'
import dotenv from 'dotenv'
dotenv.config()

const expect = chai.expect
const requester = supertest('http://localhost:8082')
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjY0NjQxMDBkNjIwMjBmMmFiMWQyMGQ1ZiIsImZpcnN0X25hbWUiOiJTYW50aWFnbyIsImxhc3RfbmFtZSI6IlNhdWNlZG8iLCJlbWFpbCI6InNhbnRpYWdvc2F1Y2VkbzY2QGdtYWlsLmNvbSIsInBhc3N3b3JkIjoiJDJiJDEwJEQ5ckl2UU1XSHNQN1QxOUcyQmU4U3ViUThqYktKOUxOT1BLWHJha3pmSVRoaGN3SUoxdzBDIiwiY2FydCI6eyJfaWQiOiI2NDY0MTAwYzYyMDIwZjJhYjFkMjBkNTUiLCJwcm9kdWN0cyI6W10sIl9fdiI6MH0sInJvbCI6ImFkbWluIiwibGFzdF9jb25uZWN0aW9uIjoiTW9uIE1heSAyMiAyMDIzIDIwOjM5OjA3IEdNVC0wMzAwIChob3JhIGVzdMOhbmRhciBkZSBBcmdlbnRpbmEpIiwiZG9jdW1lbnRzIjpbXSwiX192IjowfSwiaWF0IjoxNjg0Nzk5NDY3LCJleHAiOjE2ODQ4ODU4Njd9._0eoRPTE9-O6vgIBqnkvcJPmzolRGqKyEYxS7li6lm0'

describe('Testing ecommerce', () => {
    describe('Testing products', () => {
        describe('POST /api/products/create', () => {
            it('should create a product successfully', async () => {
                const productMock = {
                    title: 'Remera',
                    description: 'Color azul',
                    price: 1500,
                    thumbnail: ['image1.jpg', 'image2.jpg'],
                    code: '18dd2sfgds3d',
                    stock: 450,
                    category: 'ropa',
                };

                const response = await requester
                    .post('/api/products/create')
                    .set('Authorization', `Bearer ${token}`) // Agrega el encabezado de autorización con el token
                    .send(productMock);

                expect(response.status).to.equal(200);
                expect(response.body).to.be.a('string');
                expect(response.body).to.equal(`Product ${productMock.title} successfully created`);
            });

            it('should return an error if required fields are missing', async () => {
                const invalidProductMock = {
                    // Proporciona un objeto sin los campos requeridos
                };

                const response = await requester
                    .post('/api/products/create')
                    .set('Authorization', `Bearer ${token}`)
                    .send(invalidProductMock);
                // console.log('ACA LA INFP', response)

                expect(response.status).to.equal(400);
                //   expect(response.body).to.be.an('object');
                //   expect(response.body.message).to.equal('Invalid input');
                //   expect(response.body.details).to.be.an('array');
                //   expect(response.body.details).to.have.lengthOf.above(0);
            });

            it('should return an error if the product code already exists', async () => {
                const existingProductMock = {
                    title: 'Remera',
                    description: 'Color azul',
                    price: 1500,
                    thumbnail: ['image1.jpg', 'image2.jpg'],
                    code: '18dd2xs3d', // Proporciona un código que ya existe en la base de datos
                    stock: 450,
                    category: 'ropa',
                };

                const response = await requester
                    .post('/api/products/create')
                    .set('Authorization', `Bearer ${token}`)
                    .send(existingProductMock);

                expect(response.status).to.equal(400);
                //   expect(response.body).to.be.an('object');
                //   expect(response.body.message).to.equal('Product code already exists');
            });
        });
    })
    describe('Testing carts', () => {
        describe('POST /api/carts/:cid/product/:pid', () => {

            it('should add a product to the cart', async () => {
                // Define los datos de prueba
                const cid = 'cart_id'; // Reemplaza con el ID del carrito existente
                const pid = 'product_id'; // Reemplaza con el ID del producto existente

                // Realiza la solicitud al endpoint
                const response = await requester
                    .post(`/api/carts/${cid}/product/${pid}`)
                    .set('Authorization', `Bearer ${token}`)
                    .redirects(1)

                // Verifica la respuesta
                expect(response.status).to.equal(200); // Cambia a 200 si no hay redirección
                // Agrega más expectativas según los requisitos del test
            });
        });
    });


})





// describe('Registro, Login and Current', () => {

//     let cookie;

//     const userMock = {
//         first_name: "Santiago",
//         last_name: "Saucedo",
//         email: "santiagosaucedo66@gmail.com",
//         password: 'santisauce'
//     }

//     it('Debe registrar un usuario', async () => {
//         const { _body } = await requester.post('/session/register').send(userMock)

//         expect(_body).to.be.ok
//     })

//     it('Debe loguear un user y DEVOLVER UNA COOKIE', async () => {
//         console.log('funciona');
//         const result = await requester.post('/session/login').send({
//             email: userMock.email, password: userMock.password
//         })

//         //COOKIE_NAME=COOKIE_VALUE
//         const cookieResult = result.headers['set-cookie'][0]
//         expect(cookieResult).to.be.ok 
//         cookie = {
//             name: cookieResult.split('=')[0],
//             value: cookieResult.split('=')[1]
//         }

//         expect(cookie.name).to.be.ok.and.eql('santiCookieToken')
//         expect(cookie.value).to.be.ok

//     })

//     it('enviar cookie para ver el contenido del usuario', async () => {
//         const {_body} = await requester.get('/api/session/current').set('Cookie', [`${cookie.name}=${cookie.value}`])

//         expect(_body.payload.email).to.be.eql(mockUser.email)
//     })
// })