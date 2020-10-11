var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
require('./models');
var bcrypt = require('bcrypt');
var expressSession = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var dotenv = require('dotenv');
dotenv.config();

var Product = mongoose.model('Product');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Use body-parser to retrieve the raw body as a buffer
const bodyParser = require('body-parser');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect("mongodb://localhost:27017/bynogameDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

app.get('/', function (req, res, next) {
        Product.find(function(err,products){
          if(err){
            console.log(err);
            console.log("hata");
          }else{
            res.render("index",{product:products});
          }
        });
       // res.render("index");
  });
  
  app.get("/product-add", function (req, res, next) {
        res.render("product-add");
  });
  
  app.post("/product-add", function (req, res, next) {
    Product.findOne({
      name: req.body.name,
       },
       function (err, data) {
         if (err){ 
             return next(err);}
  
         if (data) {
             return next({ message: "category var" });}
   console.log("err : "+err);
         let productdata = new Product({
            product_id: req.body.product_id,
          name: req.body.name,
          stock: req.body.stock,
          create_date: req.body.create_date,        
         });
         productdata.save(function(err){
           if(err) return next(err);
           res.redirect('/');
         });
         console.log("Ürün eklendi \n " +"product_id : " + req.body.product_id+"\n"+
         "Name : "+ req.body.name+"\n" +
         "stock : " + req.body.stock +"\n" +
         "create_date : "+ req.body.create_date );
       }
     );
  });
  


app.get('/logout', function(req, res, next) {
    req.logout();
    res.redirect('/');
});


app.get('/main', function (req, res, next) {
    res.render('main')
});

app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
