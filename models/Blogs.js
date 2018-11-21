const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BlogSchema = new Schema({

    
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },

    title: {
        type: String,
        default: 'empty'
    },

    description: {
        type: String,
        default: 'empty'
    },


    date: {
        type: Date,
        default: Date.now()
    },

    link:{
        type: String,
        default: 'empty'
    }
});

module.exports = mongoose.model('Blog', BlogSchema, 'blogs');