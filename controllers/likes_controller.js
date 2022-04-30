const Like = require('../models/like');
const Post = require('../models/post');
const Comment = require('../models/comments');
const User = require('../models/user');

module.exports.toggleLike = async function(req, res) {
    
    try {

        //likes/toggle/?id=abcde&type=post
        let likeable;
        let userLike;
        let deleted = false;
        let user = await User.findById(req.user._id);

        if (req.query.type == 'Post'){
            likeable = await Post.findById(req.query.id).populate('likes');
            userLike = 'posts'
        }else{
            likeable = await Comment.findById(req.query.id).populate('likes');
            userLike = 'comments'
        }

        // check if like exists

        let existingLike = await Like.findOne({
            user: req.user._id,
            likeable: req.query.id,
            onModel: req.query.type
        })

        // if a like already exists then delete it

        if(existingLike){
            user.likes[userLike].pull(req.query.id)
            likeable.likes.pull(existingLike.id);
            user.save()
            likeable.save();
            existingLike.remove();
            deleted = true;
        }else{
            let newLike = await Like.create({
                user: req.user._id,
                likeable: req.query.id,
                onModel: req.query.type
            })

            likeable.likes.push(newLike);
            user.likes[userLike].push(req.query.id);
            user.save()
            likeable.save();
        }

        return res.status(200).json({
            message: 'request successfull',
            data:{
                deleted:deleted
            }
        })

    }catch(err) {
        console.error(err);
        return res.status(500).json({
            message: 'internal server error'
        });
    }
}