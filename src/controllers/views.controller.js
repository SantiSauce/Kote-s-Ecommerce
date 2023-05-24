import { verificarAdmin } from "../public/js/verificarAdmin.js";
import { CartService, ProductService } from "../repository/index.js";
import { UserService } from "../repository/index.js";
import jsdom from 'jsdom'


export const showOneProduct = async (req, res) => {
    let adminSession = verificarAdmin(req)
    let { activeSession, admin } = adminSession;
    const product = await ProductService.getById(req.params.pid) 
    res.render('oneProduct', {product, activeSession, admin})
}

export const getInsertProductView = async (req, res) => {
    let adminSession = verificarAdmin(req)
        let { activeSession, admin } = adminSession;
        const user = req.session?.user

    res.render('insertProduct', {activeSession, admin})
}

export const showAllProducts = async (req, res) => {
    const limit = req.query?.limit || 8
    const page = req.query?.page || 1
    const filter = req.query?.query || ''
    //const sort = req.params?.sort
    
    const search = {}
    if(filter) search['category'] = {$regex:filter}

    const options = {page, limit, lean:true}

    let products = []

    if(filter == 'stock'){
        products = await ProductService.getPaginate({stock:0}, options)
        // if(!products){
        //     throw new Error("THE DB IS EMPTY");
        // }
    }
    if(filter !== 'stock'){
        products = await ProductService.getPaginate(search, options)
        // if(!products) {
        //     throw new Error("THE DB IS EMPTY")
        // }
    } 

    products.prevLink = (products.hasPrevPage) ? `/allProducts?page=${products.prevPage}` : '' 
    products.nextLink = (products.hasNextPage) ? `/allProducts?page=${products.nextPage}` : '' 

    
    /*const user = req.session?.user
    if(user.email === 'adminCoder@coder.com'){
        req.session.user.rol = 'admin'
    }*/
    let adminSession = verificarAdmin(req)
    let { activeSession, admin } = adminSession;


    //esto es para el alert cuando recien entras 
    req.session.count = req.session.count ? req.session.count + 1 : 1
    const cuenta = req.session.count
   
    const user = req.user
    const response = {
        status: 'success', 
        payload: products.docs,
        cuenta,
        user,
        totalPages: products.totalPages,
        prevPage: products.prevPage,
        nextPage: products.nextPage,
        hasPrevPage: products.hasPrevPage,
        hasNextPage: products.hasNextPage,
        prevLink: products.prevLink,
        nextLink: products.nextLink
    }
    res.render('allProducts', {response, admin, activeSession, user})
}

export const showHomeView = async(req, res) => {
    try {
        if(req.session.user){
            let adminSession = verificarAdmin(req)
            let { activeSession, admin } = adminSession;
            const user = req.session?.user
            res.render('home', {activeSession, admin, user})
        }else{
            res.render('login')
        }
    } catch (error) {
        
    }
    
}

export const getRegister = async(req, res) => {
    try {
        res.render('register')
    } catch (error) {
        req.logger.error(error)    
    }
}

export const getLogIn = async(req, res) => {
    try {
        res.render('login')
    } catch (error) {
        req.logger.error(error)        
    }
} 

export const showAdminView = async (req, res) => {
    let adminSession = verificarAdmin(req)
    let { activeSession, admin } = adminSession;
    const users =  await UserService.get()
    res.render('admin', {users, activeSession, admin})
} 

export const showPurchasesView = async(req, res) => {
    const user = req.user.data
    res.render('myPurchases')
}

export const getCartView = async(req, res) => {
    let adminSession = verificarAdmin(req)
    let { activeSession, admin } = adminSession;    

    try {
        if(activeSession){
            const cid = req.params.cid
            const user = req.session?.user
            const cart = await CartService.getById(cid)
            res.render('cart', {user, cart,activeSession, admin}) 
      
          }
     } catch (error) {
          req.logger.error('Error when trying to show cart view: ', error)
     }
}

export const resetPasswordView = async(req, res) => {
    let adminSession = verificarAdmin(req)
    let { activeSession, admin } = adminSession;  
    
    try {
        const email = req.params.email
        res.render('resetPassword', {activeSession, admin, email, jsdom})
    } catch (error) {
        
    }
}

export const getForgotPasswordView = async(req, res) => {
    let adminSession = verificarAdmin(req)
    let { activeSession, admin } = adminSession;
    res.render('forgotPassword', {activeSession, admin})
}

export const getEditUsersView = async(req, res) => {
    const users = await UserService.getAll()
    const list = users.map(e => e._id)
    res.render('editUsers', {users})
}