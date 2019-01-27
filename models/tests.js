const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TestSchema = new Schema({

    
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    detail: {
        type: Schema.Types.ObjectId,
        ref: 'details'
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

module.exports = mongoose.model('tests', TestSchema);