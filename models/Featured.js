const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const FeaturedSchema = new Schema({


   file: {
    type: String,
    default: 'empty'
   }

    // comments: [{
    //     type: Schema.Types.ObjectId,
    //     ref: 'comments'
    // }] 
});

module.exports = mongoose.model('featured', FeaturedSchema);