
const socket = io()


let user;
let chatBox = document.getElementById('chatBox')

Swal.fire({
    title: 'Email',
    input: 'text',
    inputValidator: value => {
        return !value && 'Por favor, ingrese su correo electrónico'
    },
    allowOutsideClick: false,
    confirmButtonText: 'send'
}).then(result => {
    user=result.value
    socket.emit('authenticated', user)
})

chatBox.addEventListener('keyup', event => {
    if(event.key == 'Enter'){
        if(chatBox.value.trim().length > 0){
            socket.emit('message', {
                user,
                message: chatBox.value
            })
            const mensaje = {user, message:chatBox.value}
            fetch('/api/messages', {
                body: JSON.stringify(mensaje),
                method: 'POST',
                headers: {
                    'Content-Type': "application/json"
                }
            })
            chatBox.value = ''
        }
    }
})
socket.on('messageLogs', data =>{
    let log = document.getElementById('messageLogs')
    let messages = ''

    data.forEach(message =>{
        messages += `<b>${message.user}</b>: ${message.message}<br>`
    } )

    log.innerHTML = messages
})


