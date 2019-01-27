const express = require('express');
const router = express.Router();
const Category = require('../../models/Category');
const { isEmpty, uploadDir } = require('../../helpers/upload-helper');
const fs = require('fs');
const path = require('path');
const {userAuth} = require('../../helpers/authen');




//READ DATA
router.get('/', (req, res) => {
    Category.find({})
    .then(categories => {

        res.render('admin/category', {categories: categories});
    });  
});


//CREATE DATA
router.get('/create', (req, res) => {

    Category.find({}).then(categories => {
        res.render('admin/category/create', {categories: categories}); 
    });
 
});

router.post('/create', (req, res) => {

    let errors = [];
    if(!req.body.cat_name){

        errors.push({message: 'please add a category name'});
    }

    if(errors.length > 0){

        res.render('admin/category/create', {
            errors: errors
        })
    } else {

    let filename = "";
    if(!isEmpty(req.files)){

    let file = req.files.img;
    filename = Date.now() + '-'  + file.name;

    file.mv('./public/uploads/categories/' + filename, (err) => {

        if (err) throw err;
    });
    }

    const newCategory = new Category({
        cat_name: req.body.cat_name,
        img: '/uploads/categories/' + filename
   });
    
   newCategory.save().then(savedCategory => {
        req.flash('success_message', `Category ${savedCategory.cat_name} was successfully created`);
        res.redirect('/admin/category');
    }).catch(error => {
        console.log('couldnot save post');
    });
}
});


//DELETE DATA
router.delete('/:id', (req, res) => {

    Category.findOne({_id: req.params.id})
    .then(category =>{

        fs.unlink(uploadDir + category.img, (err) => {

            category.remove().then(categoryRemoved => {

                req.flash('success_message', `Category was successfully deleted`);
                res.redirect('/admin/category');

            });
        });
    });
});

//GO TO EDIT
router.get('/edit/:id', (req, res) => {

    Category.findOne({_id: req.params.id}).then(categories => {
        
            res.render('admin/category/edit', {categories: categories}); 
       

        //res.render('admin/posts/edit', {post: post});
    }); 
});


 //UPDATE DATA
 router.put('/edit/:id', (req, res) => {

    Category.findOne({_id: req.params.id}).then(categories => {
        categories.cat_name = req.body.cat_name;
        categories.img = req.body.img;
              

        if(!isEmpty(req.files)){

            let file = req.files.img;
            filename = +Date.now() + '-'  + file.name;
            categories.img = '/uploads/categories/' + filename;
        
            file.mv('./public/uploads/categories/' + filename, (err) => {
        
                if (err) throw err;
            });
            }

        categories.save().then(updatedCategory => {

            req.flash('success_message', `Category was successfully updated`);
            res.redirect('/admin/category');
        });
    });   
});

module.exports = router;