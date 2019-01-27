const express = require('express');
const router = express.Router();
const {userAuth} = require('../../helpers/authen');
const Test = require('../../models/tests');
const Detail = require('../../models/Detail');
const fs = require('fs');
const app = express();


//READ Blogs
router.get('/', (req, res) => {
    var mysort = {title : -1}
  
    Test.find({}).sort(mysort).populate("detail").then(tests => {

        res.render('admin/tests', {tests: tests});
    }); 
});

//CREATE BLOGS
router.get('/create', (req, res) => {

    // Test.find({}).then(tests => {
    //     res.render('admin/tests/create', {tests: tests}); 
    // });

    Test.find({})
    .then(tests => {
        Detail.find({})
        .then(details => {
        res.render('admin/tests/create', {tests: tests, details: details}); 
        });
    });
 
});

router.post('/create', (req, res) => {

    let errors = [];
    if(!req.body.title){

        errors.push({message: 'please add a title'});
    }

    if(!req.body.description){

        errors.push({message: 'please add a description'});
    }

    
    if(errors.length > 0){

        res.render('admin/tests/create', {
            errors: errors
        })
    } else {


    const newTest = new Test({

        user: req.user.id,
        detail: req.body.detail,
        title: req.body.title,
        description: req.body.description,
        link: req.body.link
   });
    
   newTest.save().then(savedBlog => {

        req.flash('success_message', `Post ${savedBlog.title} was successfully created`);

        res.redirect('/admin/tests');
    }).catch(error => {

        console.log('couldnot save post');
    });
}
});

//DELETE BLOG
router.delete('/:id', (req, res) => {

    Test.findOne({_id: req.params.id})
    .then(tests =>{

            tests.remove().then(updatedBlogs => {
            req.flash('success_message', `Category successfully deleted`);
            res.redirect('/admin/tests');
            });
    });
});

//GO TO EDIT
router.get('/edit/:id', (req, res) => {

    Test.findOne({_id: req.params.id}).then(tests => {
        

        res.render('admin/tests/edit', {tests: tests});
    }); 
});

//UPDATE BLOG
router.put('/edit/:id', (req, res) => {

    Test.findOne({_id: req.params.id}).then(test => {


        // blog.user = req.user.id;
        test.title = req.body.title;
        test.description = req.body.description;
        test.link = req.body.link;

        test.save().then(updatedBlog => {

            req.flash('success_message', `Blog was successfully updated`);
            res.redirect('/admin/tests');
        });
    });   
});


module.exports = router;