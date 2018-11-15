const express = require('express');
const router = express.Router();
const {userAuth} = require('../../helpers/authen');
const Detail = require('../../models/Detail');

//READ USERS    
router.get('/', (req, res) => {
    var mysort = { user_name: 1 };
    Detail.find({}).sort(mysort).then(details => {

        res.render('admin/details/index', {details: details});
    }); 
});

//CREATE USERS
router.post('/create', (req, res) => {

    const newDetail = Detail({
        user_name: req.body.user_name
    });

    newDetail.save(savedDetail => { 
        req.flash('success_message', `User successfully created`);
        res.redirect('/admin/details')        
    }); 
});

//DELETE CATEGORIES
router.delete('/:id', (req, res) => {

    Detail.findOne({_id: req.params.id})
    .then(details =>{

            details.remove().then(updatedDetail => {
            req.flash('success_message', `User successfully deleted`);
            res.redirect('/admin/details');
            });
    });
});



module.exports = router;


