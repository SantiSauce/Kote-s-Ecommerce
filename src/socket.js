import messageModel from './dao/mongo/models/messagges.model.js'

export default (io) => {
    io.on('connection', (socket) => {
        console.log(`New client connected, id: ${socket.id}`)
        socket.on('message',async data =>{
            console.log(data);  
            let messagesDB = await messageModel.find().lean().exec()
        
            
            messagesDB.push(data) 
            io.emit('messageLogs', messagesDB)
        })        
    })
}