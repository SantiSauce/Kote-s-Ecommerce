import {faker} from '@faker-js/faker'

faker.locale = 'es'

export const generateProduct = () => {
    return {
        _id: faker.database.mongodbObjectId(),
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price(),
        thumbnail: [faker.image.imageUrl()],
        code: faker.random.alphaNumeric(5),
        stock: faker.random.numeric(4),
        category: faker.commerce.department(),
        status: true 
}
}