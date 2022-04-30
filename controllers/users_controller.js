const User = require('../models/user');
const fs  = require('fs');
const path = require('path');

module.exports.profile = function(req,res){
    User.findById(req.params.id, function(err,user){
        return res.render('users_profile',{
            title:'profile',
            profile_user: user
        });
    })
};

module.exports.update = async function(req,res){
    if(req.user.id == req.params.id){

        try{

            let user = await User.findByIdAndUpdate(req.params.id);
            User.uploadedAvatar(req,res,function(err){
                if(err){
                    req.flash('error',err);
                }
                user.name = req.body.name;
                user.email = req.body.email;
                if(req.file){
                    if(user.avatar){
                        fs.unlinkSync(path.join(__dirname , '..' , user.avatar));
                    }
                    // this is to set file path in avatar fiels in user schema
                    user.avatar = User.avatarPath + '/' + req.file.filename;
                    req.flash('success','Profile picture updated!')
                }
                user.save()
                return res.redirect('back');
            })

        }catch(err){

            console.log(err);
        }


    }else{
        return res.status(401).send('Unauthorized');
    }
}

module.exports.signup = function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    return res.render('users_signup',{
        title:'Sign Up'
    })
}

module.exports.signin = function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    return res.render('users_signin',{
        title:'Sign In'
    })
}

// get signup data

module.exports.create = function(req,res){
    if(req.body.password != req.body.confirm_password){
        return res.redirect('back')
    }

    User.findOne({email:req.body.email},function(err,user){
        if(err){
            console.log('error in finding user while signing up');
            return
        }

        if(!user){
            User.create(req.body,function(err,user){
                if(err){
                    console.log('error creating user');
                    return
                }

                return res.redirect('/users/signin')
            })
        }
        else{
            return res.redirect('back')
        }
    })
};

module.exports.createSession = function(req,res){
    req.flash('success','Logged in successfully');
    return res.redirect('/');
}

module.exports.destroySession = function(req,res){
    req.flash('success','You have logged out')
    req.logOut();
    return res.redirect('/');
}