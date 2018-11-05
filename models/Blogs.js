const mongoose = require('mongoose');
const shortid = require('shortid');
const Schema = mongoose.Schema;
const BlogSchema = new Schema({

    // _id: {
    //     type: String,
    //     default: shortid.generate
    //   },

    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },

    title: {
        type: String
    },

    description: {
        type: String
    },

    date: {
        type: Date,
        default: Date.now()
    },

    link:{
        type: String
    }

});

module.exports = mongoose.model('Blog', BlogSchema);