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
   },

   fb_id: {
       type: String,
       default: '0',
       unique: true
   },

   gender: {
       type: String,
       default: 'none'
   }

});

module.exports = mongoose.model('details', DetailSchema);