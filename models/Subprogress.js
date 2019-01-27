const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const SubProgressSchema = new Schema({


   detail: {
    type: Schema.Types.ObjectId,
    ref: 'details'
   },

   distance: {
        type: Number,
        default: 0    },

    date: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('Subprogress', SubProgressSchema);