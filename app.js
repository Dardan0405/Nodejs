const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const flash = require("connect-flash")

const errorController = require('./controllers/error');
const User = require('./models/user');
const csrf = require('csurf');

const MONGODB_URI =
  'mongodb+srv://maximilian:9u4biljMQc4jjqbe@cluster0-ntrwp.mongodb.net/';

const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});
const csrfProtection = csrf();
app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const multer = require("multer");
const fileFilter = (req, file, cb) =>{
  if(file.mimetype === 'image/png' || file.mimetype == 'image/jpg' || file.mimetype === 'image/svg' ){
    cb(null,true);
  }
else{
  cb(null, false)
}
}
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) =>{
    cb(null, 'images');

  }, 
  filename:(req, file, cb )=>{
    cb(null,new Date().toISOString() + '-' + file.originalname);
  }
})

app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({storage: fileStorage, fileFilter: fileFilter}).single('image'))
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store
  })
);
app.use(csrfProtection);
app.use(flash())
app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});
app.use((req,res,next) =>{
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.crsfToken = req.csrfToken();
  next()
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose
  .connect(MONGODB_URI)
  .then(result => {
    app.listen(3001);
  })
  .catch(err => {
    console.log(err);
  });
