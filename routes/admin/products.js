const express = require('express');
const router = express.Router();
const Vendor = require('../../models/Vendors');
const Products = require('../../models/Products');
const { isEmpty, uploadDir } = require('../../helpers/upload-helper');
const fs = require('fs');
const path = require('path');
const {userAuth} = require('../../helpers/authen');




//READ DATA
router.get('/', (req, res) => {
    Products.find({})
    .populate("vendor_id")
    .then(products => {
        res.render('admin/products', {products: products});
    });  
});


//CREATE DATA
router.get('/create', (req, res) => {
    Vendor.find({})
    .then(vendors => {
        res.render('admin/products/create', {vendors: vendors}); 
    });
});

router.post('/create', (req, res) => {

    let errors = [];
    if(!req.body.name){

        errors.push({message: 'please add a product name'});
    }
    if(!req.body.coins){

        errors.push({message: 'please add req. coins'});
    }
    if(!req.body.discount){

        errors.push({message: 'please add discounts'});
    }

    if(errors.length > 0){

        res.render('admin/products/create', {
            errors: errors
        })
    } else {

    let filename = "";
    if(!isEmpty(req.files)){

    let file = req.files.img;
    filename = Date.now() + '-'  + file.name;

    file.mv('./public/uploads/products/' + filename, (err) => {

        if (err) throw err;
    });
    }

    let status = true;

    if(req.body.status){
        status = true;
    } else {
        status = false;
    }

    const newProducts = new Products({

      
        vendor_id: req.body.vendor_id,
        name: req.body.name,
        coins: req.body.coins,
        desc: req.body.desc,
        discount: req.body.discount,
        date: req.body.date,
        status: status,
        img: '/uploads/products/' + filename
   });

   newProducts.save().then(savednewProducts => {
    req.flash('success_message', `Sponser ${savednewProducts.name} was successfully created`);

        res.redirect('/admin/products');
    }).catch(error => {

        console.log('couldnot save post');
    });
}
});


//DELETE DATA
router.delete('/:id', (req, res) => {

    Products.findOne({_id: req.params.id})
    .then(products =>{

        fs.unlink(uploadDir + products.file, (err) => {

            products.remove().then(vendorRemoved => {

                req.flash('success_message', `Vendor was successfully deleted`);
                res.redirect('/admin/products');

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
        vendors.vendor_address = req.body.vendor_address;
        vendors.longitude = req.body.longitude;
        vendors.lattitude = req.body.lattitude;
        

        if(!isEmpty(req.files)){

            let file = req.files.img;
            filename = +Date.now() + '-'  + file.name;
            vendors.img = '/uploads/vendors/' + filename;
        
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