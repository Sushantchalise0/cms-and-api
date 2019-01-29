const express = require('express');
const router = express.Router();
const Vendorlog = require('../../models/Vendorlog');
const Vendor= require('../../models/Vendors');

//READ DATA
router.get('/', (req, res) => {

    Vendorlog.find({})
    .populate('vendor_id')
    .then(vendorlogs => {

        res.render('admin/vendorlog', {vendorlogs: vendorlogs});
    });  
});


//CREATE 
router.get('/create', (req, res) => {

    Vendor.find({}).then(vendors => {
        res.render('admin/vendorlog/create', {vendors: vendors}); 
    });
 
});


//CREATE DATA
router.post('/create', (req, res) => {

    let errors = [];
    if(!req.body.username){

        errors.push({message: 'please add a username'});
    }
    if(!req.body.password){

        errors.push({message: 'please add a password'});
    }

    

    if(errors.length > 0){

        res.render('admin/vendorlog/create', {
            errors: errors
        })
    } else {

    const newVendorlog = new Vendorlog({
        
        username: req.body.username,
        password: req.body.password,
        vendor_id: req.body.vendor_id
   });
   
   newVendorlog.save().then(savedVendorlog => {

        req.flash('success_message', `Post ${savedVendorlog.username} was successfully created`);

        res.redirect('/admin/vendorlog');
    }).catch(error => {

        console.log('couldnot save post');
    });
}
});

//DELETE DATA
router.delete('/:id', (req, res) => {

    Vendorlog.findOne({_id: req.params.id})
    .then(vendorlogs =>{

        vendorlogs.remove().then(updatedVendorlogs => {
            req.flash('success_message', `Vendor login detail successfully deleted`);
            res.redirect('/admin/vendorlog');
            });
    });
});

//GO TO EDIT
router.get('/edit/:id', (req, res) => {

    Vendorlog.findOne({_id: req.params.id}).then(vendorlogs => {
        Vendor.find({}).then(vendors => {
            res.render('admin/vendorlog/edit', {vendorlogs: vendorlogs,vendors:vendors}); 
       

        //res.render('admin/posts/edit', {post: post});
 
}); 
}); 
});


 //UPDATE DATA
 router.put('/edit/:id', (req, res) => {

    Vendorlog.findOne({_id: req.params.id}).then(vendorlogs => {
        vendorlogs.username= username;
        vendorlogs.password = req.body.password;
        vendorlogs.vendor_id = req.body.vendor_id;
        vendorlogs.save().then(updatedVendor => {
            req.flash('success_message', `VendorLogin was successfully updated`);
            res.redirect('/admin/vendorlog');
        });
    });   
});
module.exports = router;