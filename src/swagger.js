import swaggerJSDoc from 'swagger-jsdoc'
import __dirname from './dirname.js'

const swaggerOptions = {
    definition: {
        openapi: "3.0.1",
        info: {
            title: "Documentation",
            description: 
                "Project documentation",
        },
    },
    apis: [`${__dirname}/./docs/**/*.yaml`],
}

const initSwagger = () => {
    const specs = swaggerJSDoc(swaggerOptions)
    return specs
}

export default initSwagger