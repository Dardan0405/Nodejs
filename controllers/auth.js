const User = require('../models/user');
const bcrypt = require("bcryptjs")
const nodemailer = require('nodemailer')
const sendgridTransport = require("nodemailer-sendgrid-transport")
const crypto = require('crypto')
let resetuser
const User = require("../models/user");
const { ExclusionConstraintError } = require('sequelize');
const { ReturnDocument } = require('mongodb');
const path = require('path');
const { errorMonitor } = require('events');
const transporter = nodemailer.createTransport(sendgridTransport({
  auth:{
    api_key: 'aoaiaia',
  }
}));
const {validationResult} = require('express-validator/check');
exports.getLogin = (req, res, next) => {
  const message = req.flash('error');
  if(message.length > 0){
    message = message[0];
  } else{
    message = null;
  }
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage: req.flash('error'),
    errorMessage: message
   
  });
};

exports.getSignup = (req, res, next) => {
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage: message,
    oldInput : {
      email: "",
      password: "",
      confirmPassword:""
    },
    validationErros: []
    
  });
};

exports.postLogin = (req, res, next) => {
 const email = req.body.email;
 const password = req.body.password;
 const errors = validationResult(req)

 if(!errors.isEmpty()){

  return res.status(422).render('auth/login',{
    path:'/login',
    pageTitle: 'Login',
    errorMessage: errors.array()[0].msg,
    oldInput :{
      email:email,
      password: password
    }
  })
 }
 User.findOne({email: email})
 .then(user =>{
  if(!user){
    
    return res.status(422).render('auth/login',{
      path:'/login',
      pageTitle: 'Login',
      errorMessage: "Invalid Email or Pass.",
      oldInput :{
        email:email,
        password: password
      },
      validationErros: [ ]
    })
  }
  bcrypt
  .compare(password, user.password)
  .then(doMatch =>{
    if(doMatch){
      req.session.isLoggedIn = true;
      req.session.isLoggedIn = user;
      return req.session.save(err =>{
        console.log(err);
        res.redirect("/")
      });
    }
    req.flash("error",'Invalid Email');
    res.redirect("/login");
  })
  .catch(err =>{
    console.log(err);
    res.redirect('/login')
  });
 })
 .catch(err => console.log(err))
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req);
  if (!errors.isEmpty()){
    console.log(errors.array());
    return res.status(422).render('auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      errorMessage: errors.array()[0].msg,
      oldInput : {
        email: email, 
        password: password, 
        confirmPassword: req.body.confirmPassword

      },
      validationErros: errors.array()
      
    });
  }
  
    return bcrypt.hash(password, 12)
    .then(hashedPassword =>{
      const user = new User({
        email: email,
        password: hashedPassword,
        cart: {items: []}
      });
      return user.save();
    })
    .then(result =>{
       return transporter.sendMail({to:email,
        from:"DardanLlugani1",
        subject:"Message success",
        html:"<h1>Hi</h1>"
      })
   
    .catch(err =>{console.log(err)})
    
  })
  

  
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};
exports.getReset = (req,res,next) =>{
  let message = req.flash('error');
  if(message.length > 0){
    message = message[0];
  }
  else{
    message = null;
  }
  res.render('auth/reset',{
    path:"/reset",
    pageTitle:"Reset Password",
    errorMessage: message
  })
}
exports.postReset = (req,res,next) =>{
crypto.randomBytes(32, (err, buffer) =>{
  if(err){
    console.log(err)
    return res.redirect('/reset')
  }
  const token = buffer.toString('hex');
  User.findOne({email: req.body.email}).then(
    user =>{
      if(!user){
        req.flash("error", 'No Account');
        return res.redirect('/reset');
      }
      user.resetToken = token;
      user.resetTokenExpiration = Date.now() + 3600000;
      return user.save();
    }
  )
  .then(result =>{
    transporter.sendMail({
      to:req.body.email,
      from:'Dardan@gmail.com',
      subject:"Succesfull Reset",
      html:"<h1>Reset your Password</h1>"
    })
  }).catch(err =>{
    console.log(err)
  });
});
}
exports.getNewPasswrod =(req,res,next) =>{
const token = req.params.token;
User.findOne({resetToken: token, resetTokenExpiration:{$gt: Date.now()}}).then(user =>{
  let message = req.flash('error');
  if(message.length > 0){
    message = message[0];
  } else{
    message = null;
  }
  res.render("auth/new-password",{
    path:'/new-password',
    pageTitle:"New Password",
    errorMessage: message,
    userId: user._id.toString(),
    passwordToken: token
    
  })
})
.catch(err =>{
  console.log(err)
})

  
}
exports.postNewPassword = (req,res,next) =>{
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;

  User.findOne({resetToken: passwordToken, resetTokenExpiration: {$gt: Date.now()}, _id: userId})
  .then(user =>{
    resetuser = user;
    return bcrypt.hash(newPassword, 12)
  })
  .then(
    hashedPassword =>{
     resetuser.password = hashedPassword;
     resetuser.resetToken = undefined;
     resetuser.resetTokenExpiration = undefined
     return resetuser.save()
    } )
    .then(
      result =>{
        res.redirect("/login");

      }
    )
  .catch(err =>{
    console.log(err)
  })


}