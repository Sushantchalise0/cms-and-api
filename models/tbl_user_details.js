const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const tbl_user_detailsSchema = new Schema({

    user_name: {
        type: String,
        default: 'empty'
    },

   user_img: {
    type: String,
    default: 'empty'
   }
   
});

module.exports = mongoose.model('tbl_user_details', tbl_user_detailsSchema);