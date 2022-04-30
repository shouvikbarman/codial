const Posts = require('../models/post')
const User = require('../models/user')

module.exports.home = async function(req,res){

    try{
        let posts = await Posts.find({})
        .sort('-createdAt')
        .populate('user')
        .populate('likes')
        .populate({
            path:'comments',
                populate:{
                    path:'likes',
                },
                populate:{
                    path:'user'
            }
    })
    let users = await User.find({})

    return res.render('home',{
        title:'Codial | Home',
        posts: posts,
        all_users:users
        })
    }catch(err){
        console.log(err);
    }
    
    
};