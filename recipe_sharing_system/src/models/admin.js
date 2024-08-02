const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
}, { timestamps: false });

const recipeSchema = new mongoose.Schema({
    recipeName: {
        type: String,
        required: true
    },
    Ingredients: [{
        type: String,
        required: true
    }],
    Procedure: {
        type: String,
        required: true
    },
    Tips: {
        type: String,
        required: false
    },
    img: {
        data: Buffer ,
        contentType: String
        }
}, { timestamps: false });

const Recipe = mongoose.model('Recipes', recipeSchema);
const Admin = mongoose.model('adminlogin', adminSchema);
const saved = mongoose.model('saved', recipeSchema);

module.exports = { Admin , Recipe , saved };
