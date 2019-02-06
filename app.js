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
//start for secure api
// const morgan = require('morgan'),
// jwt    = require('jsonwebtoken'),
// config = require('./config/config');

//end for secure api

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
let home = require('./routes/home/index');
let admin = require('./routes/admin/index');
let tests = require('./routes/admin/tests');
let blogs = require('./routes/admin/blogs');
let sponsers = require('./routes/admin/sponsers');
let details = require('./routes/admin/details');
let progresses = require('./routes/admin/porgresses');
let leaderboards = require('./routes/admin/leaderboards');
let coupons = require('./routes/admin/coupons');
let subprogress = require('./routes/admin/subprogress');
let vendors = require('./routes/admin/vendors');
let category = require('./routes/admin/category');
let vendorlog = require('./routes/admin/vendorlog');
let products = require('./routes/admin/products');
let featured = require('./routes/admin/featured');
//for secure api
// const  ProtectedRoutes = express.Router(); 

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
app.use('/admin/vendorlog',vendorlog);
app.use('/admin/products',products);
app.use('/admin/featured',featured);
//for secure api
// app.use('/api', ProtectedRoutes)

//********************************************************************* */json secure api starts
//set secret
// app.set('Secret', config.secret);

// // use morgan to log requests to the console
// app.use(morgan('dev'));

// // parse application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({ extended: true }));

// // parse application/json
// app.use(bodyParser.json());


// app.post('/authenticate',(req,res)=>{

//     if(req.body.username==="walkman"){

//         if(req.body.password==="walk9843089925"){
//              // create token starts

//         const payload = {

//             check:  true

//           };

//           var token = jwt.sign(payload, app.get('Secret'), {
//                 expiresIn: 1440 // expires in 24 hours

//           });


//           res.json({
//             message: 'authentication done ',
//             token: token
//           });

//         }else{
//             res.json({message:"please check your password !"})
//         }

//     }else{

//         res.json({message:"user not found !"})

//     }

// })

// ProtectedRoutes.use((req, res, next) =>{


//     // check header for the token
//     var token = req.headers['access-token'];

//     // decode token
//     if (token) {

//       // verifies secret and checks if the token is expired
//       jwt.verify(token, app.get('Secret'), (err, decoded) =>{      
//         if (err) {
//           return res.json({ message: 'invalid token' });    
//         } else {
//           // if everything is good, save to request for use in other routes
//           req.decoded = decoded;    
//           next();
//         }
//       });

//     } else {

//       // if there is no token  

//       res.send({ 

//           message: 'No token provided.' 
//       });

//     }
//   });

  //REQUIRE FOR API
const Blog = require('./models/Blogs');
const Sponser = require('./models/Sponsers');
const Detail = require('./models/Detail');
const Progress = require('./models/Progress');
const Coupon = require('./models/Coupon');
const Test = require('./models/tests');
const Subprogress = require('./models/Subprogress');
const Vendor = require('./models/Vendors');
const Vendorlog = require('./models/Vendorlog');
const Category = require('./models/Category');
const Products = require('./models/Products');
const Featured = require('./models/Featured');

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
    var redeemed_dates=Date.now();
    Coupon.find({qrKey}).then((available) => {
    
        if(isEmptyObject(available)){
            res.send({available})
        } else{
            Coupon.findOneAndUpdate({qrKey: qrKey}, {$set:{v_status:"true",redeemed_date:redeemed_dates}}, {new: true}, (err, doc) => {
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
    .populate("productID")
    .populate("vendorID")
    .then((redeem) => {
        if(isEmptyObject(redeem)) {
            return res.send({redeem});
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
        productID: req.body.productID,
        vendorID:req.body.vendorID
    });
    
    var new_coins = u_coins - p_coins;
    Coupon.find({detail})
        // .populate("progress")
        .populate("productID")
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

// //API ADD USER SUB PROGRESS daily
//need detail id, date and distance
app.post('/subprogress', (req, res) => {
    var subprogress = new Subprogress({
        detail: req.body.detail,
        date: req.body.date,
        distance:req.body.distance
    });
// //systemdate
// var datetime = new Date();
// var dateSystem=datetime.toISOString().slice(0,10);
// //systemdate
    var date= req.body.date;
    var detail= req.body.detail;
    var distance= req.body.distance;
        Subprogress.findOneAndUpdate({date:date, detail:detail}, {$set:{distance:distance}}, {new: true}, (err, doc) => {

            if(isEmptyObject(doc)) {
                subprogress.save().then((docs) => {
                            res.send(docs);
                        }, (e) => {
                            res.status(400).send(e);
                        });
                 }
            else{
                res.send("updated");
             }
         });
});
//vendor login and get details
app.post('/vendorlogin', (req, res) => {
        var username= req.body.username;
        var password= req.body.password;
        Vendorlog.find({username,password}).then( 
            (vendorlog)  => {
                if(isEmptyObject(vendorlog)) {
                    return res.send({vendorlog:{}});
            } else{
                var rama=vendorlog[0].vendor_id;
                Vendor.findOne({_id:rama}).then( 
                    (vendors)  => {
                        if(isEmptyObject(vendors)) {
                            return res.send({vendors:{}});
                    } else{
                             res.send({vendors:vendors
            });
            }
        }
                , (e) => {
                    res.status(400).send(e);
                });
        }
    }
        , (e) => {
            res.status(400).send(e);
        });
});

//API categories=>vendor
// app.get('/categories', function(req, res) {
// Category.aggregate([
//         { $lookup:
//            {
//              from: 'vendors',
//              localField: '_id',
//              foreignField: 'cat_id',
//              as: 'vendors'
//            }
//         }
//     ])
// .then(category => {
//     if (!category) {
//         return res.status(404).send();
//     }
//     res.json({category});
// }).catch((e) => {
//     res.status(400).send();
// });
// });
//API vendor=>products
// app.get('/vendors', function(req, res) {
//  Vendor.aggregate([
//     { $lookup:
//        {
//          from: 'products',
//          localField: '_id',
//          foreignField: 'vendor_id',
//          as: 'products'
//        }
//      }
//     ])
// .then(vendors => {
// if (!vendors) {
//     return res.status(404).send();
// }
// res.json({vendors});
// }).catch((e) => {
// res.status(400).send();
// });

       // });
//API FEATURED
app.get('/featured', function(req, res) {
    Featured.find({}).sort({_id: -1})
        //.populate("detail")
        //.populate("sponser")
        .exec(function(err, featured) {
            if(err) {
                res.json(err);
            } else {
                res.json({featured});
            }
        });
   });
//API CATEGORY
app.get('/categories', function(req, res) {
    Category.find({})
        .exec(function(err, categories) {
            if(err) {
                res.json(err);
            } else {
                res.json({categories});
            }
        });
   });  
//API VENDORS
app.get('/vendors', function(req, res) {
    Vendor.find({})
        .exec(function(err, vendors) {
            if(err) {
                res.json(err);
            } else {
                res.json({vendors});
            }
        });
   });
   //API VENDORS
app.get('/products', function(req, res) {
    Products.find({})
        .exec(function(err, products) {
            if(err) {
                res.json(err);
            } else {
                res.json({products});
            }
        });
   });
//******************************************** */json secure api ends
const port = process.env.PORT || 4500;

app.listen(port, () => {

    console.log(`listening on port ${port}`);

});