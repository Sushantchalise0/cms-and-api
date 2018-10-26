const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const BlogSchema = new Schema({

   
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
    }

});

module.exports = mongoose.model('Blog', BlogSchema);