const path = require('path');
const mongoose = require('mongoose')
const express = require('express');
const bodyParser = require('body-parser');
const session = require("express-session")

const errorController = require('./controllers/error');
// const db = require("./util/databse")//Pool

const app = express();

const User = require('./models/user');
app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');



app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes)

app.use(errorController.get404);
app.use((req,res,next) =>{
    User.findById('')
    .then(user =>{
        req.user = user;
        next()
    })
    .catch(err => console.log(err));

    
})

mongoose.connect('mongodb+srv://dardan:dardan@cluster0.6yiwy8g.mongodb.net/shop?retryWrites=true&w=majority&appName=cluster0').then(result =>{
   User.findOne().then(user =>{
    if(!user){
        const user = new User({
            name:"Dardan",
            email:"Dardan@.com",
            cart:{
                items: []
            }
        })
        user.save();
    }
   })
   
    
    app.listen(3001);
}).catch(err =>{
    console.log(err)
    
})


