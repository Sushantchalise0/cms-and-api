const express = require('express');
const router = express.Router();
const Featured = require('../../models/Featured');


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


//CREATE DATA
router.get('/create', (req, res) => {
    Vendor.find({})
    .then(vendors => {
        res.render('admin/products/create', {vendors: vendors}); 
    });
});

router.post('/create', (req, res) => {

    let filename = "";
    if(!isEmpty(req.files)){

    let file = req.files.img;
    filename = Date.now() + '-'  + file.name;

    file.mv('./public/uploads/featured/' + filename, (err) => {

        if (err) throw err;
    });

    const newFeatured = new Featured({

        img: '/uploads/products/' + filename
   });

   newFeatured.save().then(savednewFeatured => {
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

        fs.unlink(uploadDir + featured.file, (err) => {

            featured.remove().then(vendorRemoved => {

                req.flash('success_message', `Featured was successfully deleted`);
                res.redirect('/admin/featured');

            });
        });
    });
});

module.exports = router;