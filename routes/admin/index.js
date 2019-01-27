const express = require('express');
const router = express.Router();
const Sponser = require('../../models/Sponsers');
const faker = require('faker');
const Blog = require('../../models/Blogs');
const User = require('../../models/Detail');
const {userAuth} = require('../../helpers/authen');


router.all('/*', userAuth, (req, res, next) => {

    req.app.locals.layout = 'admin';
    next();
});

router.get('/', (req, res) => {

   
            Sponser.count({}).then(sponserCount => {
                Blog.count({}).then(blogCount => {
                    User.count({}).then(userCount => {
                        res.render('admin/index', { sponserCount: sponserCount, blogCount:blogCount, userCount:userCount});
                    });
                });
            });
        });

router.post('/generate-fake-posts', (req, res) => {

    for(let i=0; i<req.body.amount; i++){

        let post = new POST();
        post.file = faker.image.nature();
        post.title = faker.name.title();
        post.status = 'public';
        post.allowComments = faker.random.boolean();
        post.body = faker.lorem.sentence;

        post.save(function(err){

            if(err) throw err;
        });
    }
    res.redirect('/admin/posts');
});


module.exports = router;