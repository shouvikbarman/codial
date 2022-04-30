const chatLogo = $('#chat-logo')
const chatBox = $('#chat-box-container')
const crossButton = $('#cross-button')

chatLogo.click(function(){
    chatLogo.css('display','none')
    chatBox.css('display','block')

})

crossButton.click(function(){
    chatLogo.css('display','block')
    chatBox.css('display','none')
})