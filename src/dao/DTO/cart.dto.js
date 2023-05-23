export default class CartDTO {

    constructor(cart){
        this.id = cart.id
        this.products = cart.products ? cart.products : []
    }
}