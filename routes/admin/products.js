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
    if(!req.body.act_price){

        errors.push({message: 'please add discounts'});
    }
    if(!req.body.disc_price){

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
        date: req.body.date,
        status: status,
        act_price: req.body.act_price,
        disc_price: req.body.disc_price,
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

    Products.findOne({_id: req.params.id}).then(products => {
        Vendor.find({}).then(vendors => {
            res.render('admin/products/edit', {vendors: vendors,products: products}); 
       

        //res.render('admin/posts/edit', {post: post});
    }); 
}); 
});


 //UPDATE DATA
 router.put('/edit/:id', (req, res) => {

    Products.findOne({_id: req.params.id}).then(products => {

        if(req.body.status){
            status = true;
        } else {
            status = false;
        }
        products.status= status;
        products.vendor_id = req.body.vendor_id;
        products.name = req.body.name;
        products.coins = req.body.coins;
        products.desc = req.body.desc;
        products.act_price = req.body.act_price;
        products.act_price = req.body.act_price;
        products.disc_price = req.body.disc_price;
        

        if(!isEmpty(req.files)){

            let file = req.files.img;
            filename = +Date.now() + '-'  + file.name;
            products.img = '/uploads/products/' + filename;
        
            file.mv('./public/uploads/products/' + filename, (err) => {
        
                if (err) throw err;
            });
            }

            products.save().then(updatedProduct => {

            req.flash('success_message', `product was successfully updated`);
            res.redirect('/admin/products');
        });
    });   
});

module.exports = router;