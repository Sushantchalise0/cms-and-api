const express = require('express');
const router = express.Router();
const Progress = require('../../models/Progress');
const Detail = require('../../models/Detail');


router.get('/', (req, res) => {
    var mysort = {distance: -1};
    Progress.find({}).sort(mysort).limit(15)
    .populate('detail')
    .then(progresses => {

        res.render('admin/leaderboards', {progresses: progresses});
    }); 
    
});





module.exports = router;

 