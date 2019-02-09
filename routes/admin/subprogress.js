const express = require('express');
const router = express.Router();
const Progress = require('../../models/Progress');
const Detail = require('../../models/Detail');
const Subprogress = require('../../models/Subprogress');


//GO TO EDIT
router.get('/edit/:id', (req, res) => {

    Progress.findOne({_id: req.params.id}).then(progress => {
        Detail.find({}).then(details => {
            res.render('admin/subprogress/edit', {progress: progress, subprogress: subprogress}); 
        });

        //res.render('admin/posts/edit', {post: post});
    }); 
});


//READ DATA
router.get('/', (req, res) => {

    Subprogress.find({}).sort({date:-1})
    .populate('detail')
    .then(subprogress => {

        res.render('admin/subprogress', {subprogress: subprogress});
    });  
});
// details
router.get('/detail/:id', (req, res) => {

    Subprogress.find({detail:req.params.id})
    .populate('progress').populate('detail')
    .then(subprogress => {

        res.render('admin/subprogress/detail', {subprogress: subprogress});
    });  
});

router.get('/create', (req, res) => {

    Detail.find({}).then(details => {
        res.render('admin/subprogress/create', {details: details}); 
    });
 
});


//CREATE DATA
router.post('/create', (req, res) => {
    
    let errors = [];
    if(!req.body.distance){

        errors.push({message: 'please add a distance'});
    }

    

    if(errors.length > 0){

        res.render('admin/subprogress/create', {
            errors: errors
        })
    } else {



    const newProgress = new Subprogress({

        distance: req.body.distance,
        date: req.body.date,
        //coins: req.body.coins,
        detail: req.body.detail
   });
    
    newProgress.save().then(savedProgress => {

        req.flash('success_message', `Post ${savedProgress.distance} was successfully created`);

        res.redirect('/admin/subprogress');
    }).catch(error => {

        console.log('couldnot save post');
    });
}
});



//DELETE DATA
router.delete('/:id', (req, res) => {

    Subprogress.findOne({_id: req.params.id})
    .then(subprogress =>{

            subprogress.remove().then(updatedBlogs => {
            req.flash('success_message', `Progress successfully deleted`);
            res.redirect('/admin/subprogress');
            });
    });
});
module.exports = router;