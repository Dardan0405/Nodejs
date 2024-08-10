const express = require('express');

const authController = require('../controllers/auth');
const {check, body} = require("express-validator/check");
const router = express.Router();
const User = require("../models/user")

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post('/login', authController.postLogin);

router.post('/signup',check('email').isEmail().withMessage('Please enter Valide Email').trim().custom((value, {req}) =>{
    // if(value === 'test@.com'){
    //     throw new Error("This email address is not right")
       
    // }
    // return true
 return   User.findOne({email: value}.then(userDoc =>{
        if(userDoc){
         return Promise.reject('Email'

         );
    
        }
    }));
}),
body('password').isLength({min: 5}).isAlphaNumeric().withMessage("Pls Write a pass with only numbers and char"),
body('confirmpassword').custom((value,{req})=>{
    if(value !== req.body.passwod){
        throw new Error("Pass not match")
    }
    return true
}).trim() , authController.postSignup);

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset)

router.post('/reset', authController.postReset)

router.get('/reset/:token', authController.getNewPasswrod)


module.exports = router;