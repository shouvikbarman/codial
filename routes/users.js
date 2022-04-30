const express = require('express');
const router = express.Router();
const userController = require('../controllers/users_controller');
const passport = require('passport');

router.get('/profile/:id',passport.checkAuthentication,userController.profile);
router.get('/signup',userController.signup);
router.get('/signin',userController.signin);
router.get('/sign-out',userController.destroySession);
router.post('/create',userController.create)
router.post('/update/:id',userController.update);
router.post('/create-session',passport.authenticate(
    'local',
    {failureRedirect:'/users/signin'}
),userController.createSession);
router.get('/auth/google',passport.authenticate('google', {scope:['profile','email']}));
router.get('/auth/google/callback',
    passport.authenticate('google',{failureRedirect:'/users/sign-in'}),
    userController.createSession
)

module.exports = router