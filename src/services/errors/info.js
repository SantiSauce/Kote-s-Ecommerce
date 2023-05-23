export const generateUserErrorInfo = (user) => {
    const message = `One or more properties were incompleted or not valid. List of required properties:
    *first_name : needs to be a String, received ${user.first_name}
    *last_name : needs to be a String, received ${user.last_name}
    *email: needs to be a String, received ${user.email}`
    return message.replace(/\n/g, ' ')
}

export const generateProductErrorInfo = (product) => {
    const message = `One or more properties were incompleted or not valid. List of required properties:
    *title: needs to be a String, received ${product.title || undefined}
    *description: needs to be a String, received ${product.description || undefined}
    *price: needs to be a Number, received ${product.price || undefined}
    *thumbnail: needs to be an Arrray, received ${product.thumbnail || undefined}
    *code: needs to be a String, received ${product.code || undefined}
    *stock: needs to be a Number, received ${product.stock || undefined}
    *category: needs to be a String, received ${product.category || undefined}`
    return message.replace(/\n/g, ' ')
}