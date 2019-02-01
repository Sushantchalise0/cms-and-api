const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const FeaturedSchema = new Schema({


   img: {
    type: String,
    default: 'empty'
   },
   url: {
    type: String,
    default: 'empty'
   }

    // comments: [{
    //     type: Schema.Types.ObjectId,
    //     ref: 'comments'
    // }] 
});

module.exports = mongoose.model('featured', FeaturedSchema);