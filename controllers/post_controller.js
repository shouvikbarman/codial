const Post = require('../models/post');
const Comment = require('../models/comments');
const Like = require('../models/like');

module.exports.create = function(req, res) {
    Post.create({
        content: req.body.content,
        user: req.user._id
    },function(err,post){
        if(err) {
            req.flash('error', 'Error in creating post');
            return res.redirect('back')
        }
        if(req.xhr){
            return res.status(200).json({
                data:{
                    post: post,
                    user_name:req.user.name,
                    user_id:req.user.id,
                    noty_text:'Post published successfully'
                },
                message: 'Post created '
            })
        }
    })
}

module.exports.destroy = async function(req, res) {

    try{
        let post = await Post.findById(req.params.id)
        if(post.user == req.user.id) {
        
            await Like.deleteMany({likeable:req.params.id,onModel:'Post'})
            await Like.deleteMany({_id:{$in:post.comments}})
            await Comment.deleteMany({post:req.params.id})
            post.deleteOne();

            if(req.xhr){
                return res.status(200).json({
                    data:{
                        post_id: req.params.id,
                        noty_text:'Post and associated comments deleted successfully'
                    },
                    message: 'Post deleted'
                })
            }
        }
        else {
            req.flash('error', 'You cannot delete this post');
            return res.redirect('back');
        };
    }catch(err){
        req.flash('error',err)
        return res.redirect('back');
    }
    
};