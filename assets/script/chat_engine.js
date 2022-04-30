class ChatEngine {
    constructor(chatBoxId,userEmail){
        this.chatBox = $(`#${chatBoxId}`);
        this.userEmail = userEmail;
        this.socket = io.connect('http://localhost:5000');

        if(this.userEmail){
            this.connectionHandler()
        }
    }

    connectionHandler(){

        let self = this;
        this.socket.on('connect',function(){
            console.log('connection established using socket');

            $('#send-btn').click(function(){

                let msg = $('#message-input').val();
                if(msg !== ''){
                    self.socket.emit('send_message',{
                        user_email: self.userEmail,
                        chatroom: 'codial_room',
                        msg: msg
                    })
                }
            });


            self.socket.on('recieve_message',function(data){
                let type = 'other-message';
                let newMessage = $('<li>')

                if (data.user_email === self.userEmail){
                    type = 'self-message'
                }

                newMessage.append(
                    $(`<span>${data.msg}</span>`)
                )

                newMessage.addClass(type)

                $('#message-list').append(newMessage)
            })
        })
    }
}