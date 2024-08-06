const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const db = require("./util/databse")//Pool

const app = express();
const mongoConnect = require("./util/databse").MongoConnect;
const User = require('./models/user');
app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');



app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);
app.use((req,res,next) =>{
    User.findById('66b2b63a0b81175cc0675a4b')
    .then(user =>{
        req.user = user;
        next()
    })
    .catch(err => console.log(err));
    next()
    
})

mongoConnect(() =>{
app.listen(3001)
})


