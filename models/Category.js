const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = new Schema({

    
    cat_name: {
        type: String,
        default: 'empty'
    },

    img: {
        type: String,
        default: 'empty'
    }
});

module.exports = mongoose.model('Category', CategorySchema);