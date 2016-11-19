//import neccesary modules
var express = require('express');
var bodyParser = require('body-parser');
var $ = require('jquery');
var pgp = require('pg-promise')();

//use express and connect to database
var app = express();
var db = pgp('postgres://postgres:iheartcode@localhost:5432/blogs');

//assign ejs engine
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

//set up body parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//set public folder
app.use(express.static(__dirname + '/public'));

//render the home page
app.get('/', function(req, res, next){
  db.any('SELECT * FROM blog')
    .then(function(data){
      return res.render('index', {data: data});
  })
  .catch(function(err){
    return next(err);
  })
});

//render the new blog post page
app.get('/new', function(req, res, next){
  db.any('SELECT * FROM blog')
    .then(function(data){
      return res.render('new', {data: data});
  })
  .catch(function(err){
    return next(err);
  })
});

//send new post to database and redirect to homepage
app.post('/new', function(req, res, next){
  db.none('insert into blog(title, date, post)' +
      'values(${blogTitle}, ${postDate}, ${blogPost})',
    req.body)
    .then(function () {
      res.redirect('/');
    })
    .catch(function (err) {
      return next(err);
    });
});


//listsen at port 3000 for pages, server
app.listen(3000, function(){
  console.log('Application running on localhost on port 3000');
});
