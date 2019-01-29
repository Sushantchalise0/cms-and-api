const express = require('express');
const router = express.Router();
const Vendor = require('../../models/Vendors');
const Category = require('../../models/Category');
const { isEmpty, uploadDir } = require('../../helpers/upload-helper');
const fs = require('fs');
const path = require('path');
const {userAuth} = require('../../helpers/authen');




//READ DATA
router.get('/', (req, res) => {
    Vendor.find({})
    .populate("cat_id")
    .then(vendors => {

        res.render('admin/vendors', {vendors: vendors});
    });  
});


//CREATE DATA
router.get('/create', (req, res) => {
    Category.find({}).then(categories => {
        res.render('admin/vendors/create', {categories: categories}); 
    });
});

router.post('/create', (req, res) => {

    let errors = [];
    if(!req.body.vendor_name){

        errors.push({message: 'please add a vendor name'});
    }
    if(!req.body.vendor_address){

        errors.push({message: 'please add a vendor address'});
    }

    if(errors.length > 0){

        res.render('admin/vendors/create', {
            errors: errors
        })
    } else {

    let filename = "";
    if(!isEmpty(req.files)){

    let file = req.files.vendor_ic;
    filename = Date.now() + '-'  + file.name;

    file.mv('./public/uploads/vendors/' + filename, (err) => {

        if (err) throw err;
    });
    }

    let status = true;

    if(req.body.status){
        status = true;
    } else {
        status = false;
    }

    const newVendor = new Vendor({

      
        username: req.body.username,
        password: req.body.password,
        vendor_name: req.body.vendor_name,
        cat_id: req.body.cat_id,
        vendor_address: req.body.vendor_address,
        status: status,
        vendor_ic: '/uploads/vendors/' + filename
   });
    
   newVendor.save().then(savedVendor => {

        req.flash('success_message', `Sponser ${savedVendor.vendor_name} was successfully created`);

        res.redirect('/admin/vendors');
    }).catch(error => {

        console.log('couldnot save post');
    });
}
});


//DELETE DATA
router.delete('/:id', (req, res) => {

    Vendor.findOne({_id: req.params.id})
    .then(vendor =>{

        fs.unlink(uploadDir + vendor.file, (err) => {

            vendor.remove().then(vendorRemoved => {

                req.flash('success_message', `Vendor was successfully deleted`);
                res.redirect('/admin/vendors');

            });
        });
    });
});

//GO TO EDIT
router.get('/edit/:id', (req, res) => {

    Vendor.findOne({_id: req.params.id}).then(vendors => {
        Category.find({}).then(categories => {
            res.render('admin/vendors/edit', {vendors: vendors,categories: categories}); 
       

        //res.render('admin/posts/edit', {post: post});
    }); 
}); 
});


 //UPDATE DATA
 router.put('/edit/:id', (req, res) => {

    Vendor.findOne({_id: req.params.id}).then(vendors => {

        if(req.body.status){
            status = true;
        } else {
            status = false;
        }

        vendors.status= status;
        vendors.vendor_name = req.body.vendor_name;
        vendors.cat_id = req.body.cat_id;
        vendors.username = req.body.username;
        vendors.passsword = req.body.passsword;
        vendors.vendor_address = req.body.vendor_address;
        

        if(!isEmpty(req.files)){

            let file = req.files.vendor_ic;
            filename = +Date.now() + '-'  + file.name;
            vendors.vendor_ic = '/uploads/vendors/' + filename;
        
            file.mv('./public/uploads/vendors/' + filename, (err) => {
        
                if (err) throw err;
            });
            }

        vendors.save().then(updatedVendor => {

            req.flash('success_message', `Vendor was successfully updated`);
            res.redirect('/admin/vendors');
        });
    });   
});

module.exports = router;