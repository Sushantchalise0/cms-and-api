const express = require('express');
const router = express.Router();
const Coupon = require('../../models/Coupon');
const Detail = require('../../models/Detail');
const Sponser = require('../../models/Sponsers');


//READ DATA
router.get('/', (req, res) => {

    Coupon.find({})
    .populate('detail')
    .populate('sponser')
    .then(coupons => {

        res.render('admin/coupons', {coupons: coupons});
    });  
});


//CREATE 
router.get('/create', (req, res) => {

    Detail.find({})
    .then(details => {
        Sponser.find({})
        .then(sponsers => {
        res.render('admin/coupons/create', {details: details, sponsers: sponsers}); 
        });
    });
 
});


//CREATE DATA
router.post('/create', (req, res) => {

    let errors = [];
    if(!req.body.qrKey){

        errors.push({message: 'please add a qr'});
    }

    

    if(errors.length > 0){

        res.render('admin/coupons/create', {
            errors: errors
        })
    } else {

        let v_status = true;

        if(req.body.v_status){
            v_status = true;
        } else {
            v_status = false;
        }

    const newCoupon = new Coupon({
        
        detail: req.body.detail,
        sponser: req.body.sponser,
        qrKey: req.body.qrKey,
        v_status: v_status
   });
   
    newCoupon.save().then(savedCoupon => {

        req.flash('success_message', `Post ${savedCoupon.detail} was successfully created`);

        res.redirect('/admin/coupons');
    }).catch(error => {

        console.log('couldnot save post');
    });
}
});

//DELETE DATA
router.delete('/:id', (req, res) => {

    Coupon.findOne({_id: req.params.id})
    .then(coupons =>{

            coupons.remove().then(updatedBlogs => {
            req.flash('success_message', `Coupon successfully deleted`);
            res.redirect('/admin/coupons');
            });
    });
});

module.exports = router;