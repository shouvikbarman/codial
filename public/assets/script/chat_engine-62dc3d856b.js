class ChatEngine{constructor(e,s){this.chatBox=$(`#${e}`),this.userEmail=s,this.socket=io.connect("http://localhost:5000"),this.userEmail&&this.connectionHandler()}connectionHandler(){let e=this;this.socket.on("connect",(function(){console.log("connection established using socket"),$("#send-btn").click((function(){let s=$("#message-input").val();""!==s&&e.socket.emit("send_message",{user_email:e.userEmail,chatroom:"codial_room",msg:s})})),e.socket.on("recieve_message",(function(s){let t="other-message",n=$("<li>");s.user_email===e.userEmail&&(t="self-message"),n.append($(`<span>${s.msg}</span>`)),n.addClass(t),$("#message-list").append(n)}))}))}}