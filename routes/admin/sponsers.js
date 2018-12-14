const express = require('express');
const router = express.Router();
const Sponser = require('../../models/Sponsers');
const { isEmpty, uploadDir } = require('../../helpers/upload-helper');
const fs = require('fs');
const path = require('path');
const {userAuth} = require('../../helpers/authen');




//READ DATA
router.get('/', (req, res) => {

    Sponser.find({})
    .then(sponsers => {

        res.render('admin/sponsers', {sponsers: sponsers});
    });  
});


//CREATE DATA
router.get('/create', (req, res) => {

    Sponser.find({}).then(sponsers => {
        res.render('admin/sponsers/create', {sponsers: sponsers}); 
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

        res.render('admin/sponsers/create', {
            errors: errors
        })
    } else {

    let filename = "";
    if(!isEmpty(req.files)){

    let file = req.files.file;
    filename = Date.now() + '-'  + file.name;

    file.mv('./public/uploads/' + filename, (err) => {

        if (err) throw err;
    });
    }

    let status = true;

    if(req.body.status){
        status = true;
    } else {
        status = false;
    }

    const newSponser = new Sponser({

      
        title: req.body.title,
        status: status,
        description: req.body.description,
        offer: req.body.offer,
        file: '/uploads/' + filename,
        coins: req.body.coins
   });
    
    newSponser.save().then(savedSponser => {

        req.flash('success_message', `Sponser ${savedSponser.title} was successfully created`);

        res.redirect('/admin/sponsers');
    }).catch(error => {

        console.log('couldnot save post');
    });
}
});


//DELETE DATA
router.delete('/:id', (req, res) => {

    Sponser.findOne({_id: req.params.id})
    .then(sponser =>{

        fs.unlink(uploadDir + sponser.file, (err) => {

            sponser.remove().then(sponserRemoved => {

                req.flash('success_message', `Sponser was successfully deleted`);
                res.redirect('/admin/sponsers');

            });
        });
    });
});

//GO TO EDIT
router.get('/edit/:id', (req, res) => {

    Sponser.findOne({_id: req.params.id}).then(sponser => {
        
            res.render('admin/sponsers/edit', {sponser: sponser}); 
       

        //res.render('admin/posts/edit', {post: post});
    }); 
});


 //UPDATE DATA
 router.put('/edit/:id', (req, res) => {

    Sponser.findOne({_id: req.params.id}).then(sponser => {

        if(req.body.status){
            status = true;
        } else {
            status = false;
        }

        sponser.title = req.body.title;
        sponser.status= status;
        sponser.description = req.body.description;
        sponser.offer = req.body.offer;
        sponser.coins = req.body.coins;
        

        if(!isEmpty(req.files)){

            let file = req.files.file;
            filename = +Date.now() + '-'  + file.name;
            sponser.file = '/uploads/' + filename;
        
            file.mv('./public/uploads/' + filename, (err) => {
        
                if (err) throw err;
            });
            }

        sponser.save().then(updatedSponser => {

            req.flash('success_message', `Sponser was successfully updated`);
            res.redirect('/admin/sponsers');
        });
    });   
});

module.exports = router;