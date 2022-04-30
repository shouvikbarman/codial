const Post = require('../models/post');
const Comment = require('../models/comments');
const commentsMailer = require('../mailers/comments_mailer')
const queue = require('../config/kue')
const commentsEmailWorker = require('../workers/comments_email_worker')
const Like = require('../models/like');

module.exports.create = async function(req, res) {
    try{
        let post = await Post.findById(req.body.post)
        if(post) {
            let comment = await Comment.create({
                content: req.body.content,
                user: req.user._id,
                post:req.body.post
            })
            post.comments.push(comment);
            post.save();

            comment = await comment.populate('user','name email');
            // commentsMailer.newComment(comment);
            let job = queue.create('emails',comment).save(function(err){
                if (err){
                    console.log('error in creating queue',err);
                }

                console.log('job enqueued',job.id);
            })
            
            if(req.xhr){
                return res.status(200).json({
                    data:{
                        comment: comment,
                        user_name:req.user.name,
                        noty_text:'Comment published successfully'
                    },
                    message:'Comment created'
                })
            }
        }

    }catch(err){
        req.flash('error',err);
        return
    }
    
}

module.exports.destroy = async function(req, res) {

    try{
        let comment = await Comment.findById(req.params.id)
        if(comment){
            let postId = comment.post;
            Like.deleteMany({likeable:req.params.id,onModel:'Comment'})
            comment.deleteOne();
            await Post.findByIdAndUpdate(postId,{$pull:{comments:req.params.id}})
            if(req.xhr){
                return res.status(200).json({
                    data: {
                        comment_id: req.params.id,
                        noty_text:'Comment deleted'
                    },
                    message: 'Comment deleted'
                })
            }
        }else{
            return res.redirect('back')
        };

    }catch(err) {
        console.log(err);
    }
};