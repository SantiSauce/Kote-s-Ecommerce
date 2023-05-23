import {Router} from 'express'
import __dirname from '../dirname.js'
import { transport } from '../consts/resetPassword'
const router = Router()

router.get('/ESTOSECAMBIA', async(req, res) => {
    const result = await transport.sendMail({
        from: 'santiagosaucedo66@gmail.com',
        to: 'TENGO QUE VER COMO SE HACE',
        subject: 'Password Reset',
        html: `ACa tengo que poner el boton para
        redirigir al middleware para resetear password`,
        attachments: [ {
            filename: 'something',
            path: __dirname + 'something/something',
            cid: 'something'
        }]
    })
    res.send('mail sent')
})


export default router