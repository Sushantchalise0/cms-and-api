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
const details = require('./routes/admin/details');
const progresses = require('./routes/admin/porgresses');


//USE ROUTES
app.use('/', home);
app.use('/admin', admin);
app.use('/admin/posts', posts);
app.use('/admin/categories', categories);
app.use('/admin/comments', comments);
app.use('/admin/blogs', blogs);
app.use('/admin/sponsers', sponsers);
app.use('/admin/details', details);
app.use('/admin/progresses', progresses);

//REQUIRE FOR API
const Post = require('./models/Post');
const Category = require('./models/Category');
const Blog = require('./models/Blogs');
const Sponser = require('./models/Sponsers');
const Detail = require('./models/Detail');
const Progress = require('./models/Progress');

//API POST
app.get('/posts', (req, res) => {
    Post.find().then((posts) => {
        res.send({posts});
    }, (e) => {
        res.status(400).send(e);
    });
});

//API CATEGORIES
app.get('/categories', (req, res) => {
    Category.find().then((categories) => {
        res.send({categories});
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

//API GET USER 
app.get('/details', (req, res) => {
    Detail.find().then((docs) => {
        res.send({docs});
    }, (e) => {
        res.send(400).send(e);
    });
});

// //API GET USER PROGRESS
app.get('/progress', (req, res) => {
    Progress.find().then((docs) => {
        res.send({docs});
    }, (e) => {
        res.send(400).send(e);
    });
});

// //API ADD USER PROGRESS
app.post('/progress', (req, res) => {
    var progress = new Progress({
        detail: req.body.detail
    });

    progress.save().then((docs) => {
        res.send(docs);
    }, (e) => {
        res.status(400).send(e);
    });
});

// //API ADD USERS
app.post('/details', (req, res) => {
    var details = new Detail({
        user_name: req.body.user_name
    });

    details.save().then((docs) => {
        res.send(docs);
    }, (e) => {
        res.status(400).send(e);
    });
});

//API GET PROGRESS
app.get('/getProgress/:id', (req, res) => {
    var detail = req.params.id;

    Progress.find({detail}).then((progresses) => {
        if (!progresses) {
            return res.status(404).send();
        }
        res.send({progresses});
    }).catch((e) => {
        res.status(400).send();
    });
});

//API SET PROGRESS
app.post('/progresses/setProgress', (req, res) => {
    
    var detail = req.body.detail;
    var prog = new Progress({
        detail: req.body.detail,
        distance: req.body.distance,
        calorie: req.body.calorie,
        coins: req.body.coins,
    });
    Progress.findOneAndDelete({detail}).then((progresses) => {
        
        prog.save().then((progresses) => {
            res.send(progresses);
        }, (e) => {
            res.status(400).send(e);
        });

        res.send({progresses});
    }).catch((e) => {
        res.status(400).send();
    });

});

app.listen(4500, () => {

    console.log(`listening on port 4500`);

});