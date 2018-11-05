const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const DetailSchema = new Schema({

    user_name: {
        type: String,
        required: true
    },

   user_img: {
    type: String,
    default: 'empty'
   }

});

module.exports = mongoose.model('details', DetailSchema);