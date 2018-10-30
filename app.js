const express = require('express');
const app = express();
const path = require('path');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const upload = require('express-fileupload');
const session = require('express-session');
const flash = require('connect-flash');
const {mongoDbUrl} = require('./config/database');
const passport = require('passport');




mongoose.connect(mongoDbUrl, { useNewUrlParser: true }).then((db) => {

    console.log('MONGO connected');
}).catch(error => console.log(error));

app.use(express.static(path.join(__dirname, 'public')));

//SET VIEW ENGINE
const {select, generateTime} = require('./helpers/handlebars-helpers');
app.engine('handlebars', exphbs({defaultLayout: 'home', helpers: {select: select, generateTime: generateTime}}));
app.set('view engine', 'handlebars');

//METHOD OVERRIDE   
app.use(methodOverride('_method'));

//UPLOAD MIDDLEWARE
app.use(upload());

// BODY PARSER
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//SESSIONS
app.use(session({

    secret: 'sushantChaliseCodingCMS',
    resave: true,
    saveUninitialized: true
}));

app.use(flash());

//PASSPORT
app.use(passport.initialize());
app.use(passport.session());

//LOCAL VARIABLES USING MIDDLEWARE
app.use((req, res, next) => {

    res.locals.user = req.user || null;
    res.locals.success_message = req.flash('success_message');
    res.locals.error_message = req.flash('error_message');
    res.locals.error = req.flash('error');
    next();
});

//LOAD ROUTES
const home = require('./routes/home/index');
const admin = require('./routes/admin/index');
const posts = require('./routes/admin/posts');
const categories = require('./routes/admin/categories');
const comments = require('./routes/admin/comments');
const blogs = require('./routes/admin/blogs');
const sponsers = require('./routes/admin/sponsers');
const tbl_user_details = require('./routes/admin/tbl_user_details');


//USE ROUTES
app.use('/', home);
app.use('/admin', admin);
app.use('/admin/posts', posts);
app.use('/admin/categories', categories);
app.use('/admin/comments', comments);
app.use('/admin/blogs', blogs);
app.use('/admin/sponsers', sponsers);
app.use('/admin/tbl_user_details', tbl_user_details);

//REQUIRE FOR API
const Post = require('./models/Post');
const Blog = require('./models/Blogs');
const Sponser = require('./models/Sponsers');
const Tbl_user_details = require('./models/tbl_user_details');

//API POST
app.get('/posts', (req, res) => {
    Post.find().then((posts) => {
        res.send({posts});
    }, (e) => {
        res.status(400).send(e);
    });
});

//API GET ALL BLOG
app.get('/blogs', (req, res) => {
    Blog.find().then((blogs) => {
        res.send({blogs});
    }, (e) => {
        res.status(400).send(e);
    });
});

//API GET ALL SPONSERS
app.get('/sponsers', (req, res) => {
    Sponser.find().then((sponsers) => {
        res.send({sponsers});
    }, (e) => {
        res.send(400).send(e);
    });
});

//API GET USER DETAILS
app.get('/tbl_user_details', (req, res) => {
    Tbl_user_details.find().then((docs) => {
        res.send({docs});
    }, (e) => {
        res.send(400).send(e);
    });
});

//API ADD USERS
app.post('/tbl_user_details', (req, res) => {
    var tbl_user_details = new Tbl_user_details({
        user_name: req.body.user_name
    });

    tbl_user_details.save().then((docs) => {
        res.send(docs);
    }, (e) => {
        res.status(400).send(e);
    });
});

app.listen(4500, () => {

    console.log(`listening on port 4500`);

});