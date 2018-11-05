const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ProgressSchema = new Schema({


   detail: {
    type: Schema.Types.ObjectId,
    ref: 'details'
   },

   distance: {
        type: Number,
        default: 0    },

    calorie: {
        type: Number,
        default: 0
    },

    carbon_red: {
        type: Number,
        default: 0
    },

    coins: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('Progress', ProgressSchema);