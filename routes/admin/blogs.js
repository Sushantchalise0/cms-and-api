const express = require('express');
const router = express.Router();
const {userAuth} = require('../../helpers/authen');
const Blog = require('../../models/Blogs');
const fs = require('fs');
const app = express();


//READ Blogs
router.get('/', (req, res) => {
    Blog.find({}).then(blogs => {

        res.render('admin/blogs', {blogs: blogs});
    }); 
});

//CREATE BLOGS
router.get('/create', (req, res) => {

    Blog.find({}).then(blogs => {
        res.render('admin/blogs/create', {blogs: blogs}); 
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

        res.render('admin/blogs/create', {
            errors: errors
        })
    } else {


    const newBlog = new Blog({

        user: req.user.id,
        title: req.body.title,
        description: req.body.description,
        link: req.body.link
   });
    
    newBlog.save().then(savedBlog => {

        req.flash('success_message', `Post ${savedBlog.title} was successfully created`);

        res.redirect('/admin/blogs');
    }).catch(error => {

        console.log('couldnot save post');
    });
}
});

//DELETE BLOG
router.delete('/:id', (req, res) => {

    Blog.findOne({_id: req.params.id})
    .then(blogs =>{

            blogs.remove().then(updatedBlogs => {
            req.flash('success_message', `Category successfully deleted`);
            res.redirect('/admin/blogs');
            });
    });
});

//GO TO EDIT
router.get('/edit/:id', (req, res) => {

    Blog.findOne({_id: req.params.id}).then(blogs => {
        

        res.render('admin/blogs/edit', {blogs: blogs});
    }); 
});

//UPDATE BLOG
router.put('/edit/:id', (req, res) => {

    Blog.findOne({_id: req.params.id}).then(blog => {


        // blog.user = req.user.id;
        blog.title = req.body.title;
        blog.description = req.body.description;
        blog.link = req.body.link;

        blog.save().then(updatedBlog => {

            req.flash('success_message', `Blog was successfully updated`);
            res.redirect('/admin/blogs');
        });
    });   
});


module.exports = router;