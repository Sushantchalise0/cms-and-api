const express = require('express');
const router = express.Router(); 
const POST = require('../../models/Post');
const Comment = require('../../models/Comment');
const Tbl_user_details = require('../../models/tbl_user_details');



//SHOW USERS
router.get('/', (req, res) => {

    Tbl_user_details.find({})
    .then(tbl_user_details => {

        res.render('admin/tbl_user_details', {tbl_user_details: tbl_user_details});
    });  
});


//DELETE DATA
router.delete('/:id', (req, res) => {

    Tbl_user_details.findOne({_id: req.params.id})
    .then(tbl_user_details =>{

        tbl_user_details.remove().then(updatedBlogs => {
            req.flash('success_message', `Category successfully deleted`);
            res.redirect('/admin/tbl_user_details');
            });
    });
});


module.exports = router;