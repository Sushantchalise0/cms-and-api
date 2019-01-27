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
const tests = require('./routes/admin/tests');
const blogs = require('./routes/admin/blogs');
const sponsers = require('./routes/admin/sponsers');
const details = require('./routes/admin/details');
const progresses = require('./routes/admin/porgresses');
const leaderboards = require('./routes/admin/leaderboards');
const coupons = require('./routes/admin/coupons');
const subprogress = require('./routes/admin/subprogress');
const vendors = require('./routes/admin/vendors');
const category = require('./routes/admin/category');

//USE ROUTES
app.use('/', home);
app.use('/admin', admin);
app.use('/admin/blogs', blogs);
app.use('/admin/tests', tests);
app.use('/admin/sponsers', sponsers);
app.use('/admin/details', details);
app.use('/admin/progresses', progresses);
app.use('/admin/leaderboards', leaderboards);
app.use('/admin/coupons', coupons);
app.use('/admin/subprogress',subprogress);
app.use('/admin/vendors',vendors);
app.use('/admin/category',category);

//REQUIRE FOR API
const Blog = require('./models/Blogs');
const Sponser = require('./models/Sponsers');
const Detail = require('./models/Detail');
const Progress = require('./models/Progress');
const Coupon = require('./models/Coupon');
const Test = require('./models/tests');
const Subprogress = require('./models/Subprogress');
const Vendor = require('./models/Vendors');
const Category = require('./models/Category');

//API CUOPNS
app.get('/coupons', function(req, res) {
    Coupon.find({}).sort({_id: -1})
        //.populate("detail")
        //.populate("sponser")
        .exec(function(err, coupon) {
            if(err) {
                res.json(err);
            } else {
                res.json({coupon});
            }
        });
   });

//API VERIFIED
app.post('/verified', (req, res) => {
    var qrKey = req.body.qrKey;
    Coupon.find({qrKey}).then((available) => {
    
        if(isEmptyObject(available)){
            res.send("not available")
        } else{
            Coupon.findOneAndUpdate({qrKey: qrKey}, {$set:{v_status:"true"}}, {new: true}, (err, doc) => {
                if (err) {
                    res.send("0");
                }
                else{
                    res.send("Verified");
                }
                });
}
    });
});

//API REEDEM
app.post('/getCoupons', (req, res) => {
    var detail = req.body.detail;
    Coupon.find({detail})
    .populate("sponser")
    .then((redeem) => {
        if(isEmptyObject(redeem)) {
            return res.send('NO COUPONS');
    } else{
        res.send({redeem});
    }
    }, (e) => {
        res.status(400).send(e);
    });
});   

app.post('/redeem/set', (req, res) => {
    var p_coins = req.body.p_coins;
    var u_coins = req.body.u_coins;
    var detail = req.body.detail;
    var coup = new Coupon({
        detail: req.body.detail,
        qrKey: req.body.qrKey,
        sponser: req.body.sponser
    });
    
    var new_coins = u_coins - p_coins;
    Coupon.find({detail})
        // .populate("progress")
        .populate("sponser")
        .exec(function(err, cupon) {
            Progress.findOneAndUpdate({detail: detail}, {$set:{coins:new_coins}}, {new: true}, (err, doc) => {
                if (err) {
                    res.send("0");
                }
                else{
                    coup.save().then((doc) => {
                    res.send("1");
                }, (e) => {
                    res.status(400).send(e);
                });
            }
            });
        });
});

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
    Blog.find().sort({date: 1})
    .then((blogs) => {
        res.send({blogs});
    }, (e) => {
        res.status(400).send(e);
    });
});
//API GET ALL tests
app.get('/tests',function(req, res){
    Test.find().sort({date: 1})
    .exec(function(err, tests) {
        if(err) {
            res.json(err);
        } else {
            res.json({tests});
        }
    });

 
});


//API GET ALL SPONSERS
app.get('/sponsers', (req, res) => {
    Sponser.find().sort({coins: 1})
    .then((sponsers) => {
        res.send({sponsers});
    }, (e) => {
        res.send(400).send(e);
    });
});

//API GET USER 
app.get('/details', (req, res) => {
    Detail.find().then((details) => {
        res.send({details});
    }, (e) => {
        res.send(400).send(e);
    });
});

//API GET USER PROGRESS
app.get('/progress', (req, res) => {
    Progress.find().then((docs) => {
        res.send({docs});
    }, (e) => {
        res.send(400).send(e);
    });
});

//API FOR LEADERBOARD TOP 5
app.get('/leaderboard', function(req, res) {
    Progress.find({}, "distance").sort({distance: -1}).limit(15)
        .populate("detail")
        .exec(function(err, users) {
            if(err) {
                res.json(err);
            } else {
                res.json({users});
            }
        });
   });

//API FOR TEST LEADERBOARD
app.get('/test', (req, res) => {
    Progress.find().exec(function(err, prog) {
        if (err) {
          console.log('Error : ' + err);
        } else {
          if (prog != null) {
              var obj1 = {meta: prog};
            console.log(prog[1].detail);

            Detail.find({})
            // .then((details) => {
            //     res.send({details});
            // });
            .exec(function(err, det) {
                var obj2 = {data: det};
                if (det != null) {
                 res.send([obj1, obj2]);
                  //res.send([prog[1], det]);
                } 
                else {
                  console.log('No jobs');
                }
            });
          } else {
            console.log('No posts found');
          }
        }
      });
//     Promise.all([
//         Progress.find().exec(), // returns a promise
//         Detail.find().exec() // returns a promise
//       ]).then(function(results) {
//         // results is [devDocs, jobs]
//           console.log(results);
        
        
        
//         res.send(results);
    
//       }).catch(function(err) {
//         res.send(err);
//       });
//   });
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

//FUNCTION TO CHECK IF OBJECT IS EMPTY
function isEmptyObject(obj) {
    return !Object.keys(obj).length;
  }
  
  // This should work both there and elsewhere.
  function isEmptyObject(obj) {
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        return false;
      }
    }
    return true;
  }


//API ADD USERS
app.post('/details', (req, res) => {
    var user_img = req.body.user_img;
    var fb_id = req.body.fb_id;

    var details = new Detail({
        user_name: req.body.user_name,
        user_img: user_img,
        fb_id: fb_id,
        gender: req.body.gender
    });

    Detail.find({fb_id}).then((data) => {
        //console.log((data));
            details.save().then((docs) => {
               // console.log(details._id);
                var progresses = new Progress({
                    detail: details._id,
                    distance: 0,
                    coins: 50
                });
                progresses.save().then((done) => {
                res.send(docs);
            });
            }, (e) => {
                res.status(400).send(e);
            });
    });
});

//API TO CHECK IS USER EXISTS
app.post('/status', (req, res) => {
    var fb_id = req.body.fb_id;

    Detail.find({fb_id}).then((data) => {
        console.log((data));
        if(isEmptyObject(data)) {
                return res.send('false');
        }
        else{
            return res.send('true');
        }
    });
});

//API GET ONES POSITION
app.get('/position/:id', (req, res) => {

    var detail = req.params.id;
    Progress.find({detail}).then((progresses) => {
        
        var obj = JSON.stringify(progresses);
         console.log(obj)
        // console.log(obj.substring(13, 14));
        var dis = parseInt(obj.substring(13, 15));
        console.log(dis);
    Progress.find({ distance : { $gt : dis } }).count(function (err, count) {
        count = count + 1;
        if (!progresses) {
            return res.status(404).send();
        } 
              res.send('your position is ' + count);
        
        
        //console.log('your position is  %d', count);
      //});
    }).catch((e) => {
        res.status(400).send()
    });
});
});

//API GET PROGRESS
app.post('/progresses/getProgress', (req, res) => {
    var detail = req.body.detail;

    Progress.find({detail}).then(progresses => {
        console.log(detail);
        if (!progresses) {
            return res.status(404).send();
        }
        res.json({progresses});
    }).catch((e) => {
        res.status(400).send();
    });
});

//API TO GETDETAIL  
app.post('/details/getDetails', (req, res) => {
    var fb_id = req.body.fb_id;

    Detail.find({fb_id}).then((data) => {
        if(isEmptyObject(data)) {
                return res.send('nodata');
        }
        else{
            return res.send({data});
        }
    }, (e) => {
        res.status(400).send(e);
    });
});

//API SET PROGRESS
app.post('/progresses/setProgress', (req, res) => {
    
    var detail = req.body.detail;
    var distance= req.body.distance;
    var calorie= req.body.calorie;
    var coins= req.body.coins;
    var prog = new Progress({
        detail: req.body.detail,
        distance: req.body.distance,
        calorie: req.body.calorie,
        coins: req.body.coins,
    });
    Progress.findOneAndUpdate({detail: detail}, { "$set": { "coins": coins, "distance": distance, "calorie":calorie}}, {new: true}, (err, doc) => {
        if(err){
            res.send('error');
        }
        res.send(doc);
    //     prog.save().then((progresses) => {
    //         res.send(progresses);
    //     }, (e) => {
    //         res.status(400).send(e);
    //     });

    //     res.send('updated');
    // }).catch((e) => {
    //     res.status(400).send(e);
    });

});

// //API ADD USER SUB PROGRESS
app.post('/subprogress', (req, res) => {
    var subprogress = new Subprogress({
        detail: req.body.detail,
        date: req.body.date,
        distance:req.body.distance
    });

    var date= req.body.date;
    var detail= req.body.detail;
    var distance= req.body.distance;
    if (date==Date.now)
    {
        Subprogress.find({}, ['distance'], function (err, docs) {
           console.log(docs);
          });
        Subprogress.findOneAndUpdate({detail: detail, date: date}, { "$set": {"distance": distance}}, {new: true}, (err, doc) => {
            if(err){
                res.send('error');
            }
            res.send(doc);
        });
    }
   else{
    subprogress.save().then((docs) => {
        res.send(docs);
    }, (e) => {
        res.status(400).send(e);
    });
   }
});
//vendor login and get details
app.post('/vendors', (req, res) => {
        var username= req.body.username;
        var password= req.body.password;
        Vendor.find({username,password}).then( 
            (vendors)  => {

                if(isEmptyObject(vendors)) {
                    return res.send({vendors:{}});
            } else{
                res.send({vendors:

                    {   vendor_ic:vendors[0].vendor_ic,
                        vendor_address:vendors[0].vendor_address,
                        vendor_name:vendors[0].vendor_name,
                        status:vendors[0].status
                    }
            });
        }}
        , (e) => {
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

const port = process.env.PORT || 4500;

app.listen(port, () => {

    console.log(`listening on port ${port}`);

});