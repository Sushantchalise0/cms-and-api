const express = require('express');
const router = express.Router();
const Featured = require('../../models/Featured');
const { isEmpty, uploadDir } = require('../../helpers/upload-helper');
const fs = require('fs');


//READ DATA
router.get('/', (req, res) => {

    Featured.find({})
    .then(featured => {

        res.render('admin/featured', {featured: featured});
    });  
});


//CREATE 
router.get('/create', (req, res) => {

    Featured.find({})
    .then(featured => {
        res.render('admin/featured/create', {featured: featured});
    });
 
});


router.post('/create', (req, res) => {

    let errors = [];
    if(!req.body.url){

        errors.push({message: 'please add URL'});
    }
    if(!req.body.name){

        errors.push({message: 'please add name'});
    }

    if(errors.length > 0){

        res.render('admin/featured/create', {
            errors: errors
        })
    } else {

    let filename = "";
    if(!isEmpty(req.files)){

    let file = req.files.img;
    filename = Date.now() + '-'  + file.name;

    file.mv('./public/uploads/featured/' + filename, (err) => {

        if (err) throw err;
    });
    }

    const newFeatured = new Featured({
        url: req.body.url,
        img: '/uploads/featured/' + filename,
        name:req.body.name
   });

   newFeatured.save().then(SavednewFeatured => {
    req.flash('success_message', `Featured was successfully created`);

        res.redirect('/admin/featured');
    }).catch(error => {

        console.log('couldnot save post');
    });
}
});


//DELETE DATA
router.delete('/:id', (req, res) => {

    Featured.findOne({_id: req.params.id})
    .then(featured =>{

        fs.unlink(uploadDir + featured.img, (err) => {

            featured.remove().then(vendorRemoved => {

                req.flash('success_message', `Featured was successfully deleted`);
                res.redirect('/admin/featured');

            });
        });
    });
});


//GO TO EDIT
router.get('/edit/:id', (req, res) => {

    Featured.findOne({_id: req.params.id}).then(featured => {
            res.render('admin/featured/edit', {featured: featured}); 
}); 
});

 //UPDATE DATA
 router.put('/edit/:id', (req, res) => {

    Featured.findOne({_id: req.params.id}).then(featured => {
        featured.url = req.body.url;
        featured.name=req.body.name;
        

        if(!isEmpty(req.files)){

            let file = req.files.img;
            filename = +Date.now() + '-'  + file.name;
            featured.img = '/uploads/featured/' + filename;
        
            file.mv('./public/uploads/featured/' + filename, (err) => {
        
                if (err) throw err;
            });
            }

            featured.save().then(updatedFeatured => {

            req.flash('success_message', `Featured was successfully updated`);
            res.redirect('/admin/featured');
        });
    });   
});
module.exports = router;