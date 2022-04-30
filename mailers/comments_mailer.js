const nodeMailer = require('../config/nodeMailer')

exports.newComment = (comment) => {

    let htmlString = nodeMailer.renderTemplate({comment:comment},'/comments/new_comment.ejs');

    nodeMailer.transporter.sendMail({
        from: 'shouvikbarman20@gmail.com',
        to: comment.user.email,
        subject: 'New comment published',
        html: htmlString
    },(err,info) => {
        if (err) {
            console.log(err);
            return
        }
        console.log('Message sent');
        return
    })
}