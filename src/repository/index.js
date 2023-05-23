import {Product, Cart, User, Ticket} from '../dao/factory.js'

import ProductRepository from "./products.repository.js"
import CartRespository from "./cart.repository.js"
import UsersRepository from "./users.repository.js"
import TicketRepository from "./ticket.repository.js"

export const ProductService = new ProductRepository(new Product())
export const CartService = new CartRespository(new Cart())
export const UserService = new UsersRepository(new User()) 
export const TicketService = new TicketRepository(new Ticket())