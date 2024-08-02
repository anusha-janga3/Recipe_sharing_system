const { Admin , Recipe , saved } = require('../models/admin.js');
const fs = require('fs');
const recipeAdd = (recipeName, ingredients, procedure, tips, img) => {
    const newRecipe = new Recipe({
        recipeName: recipeName,
        Ingredients: ingredients,
        Procedure: procedure,
        Tips: tips
    });
    if (img && img.length > 0) {
        const imgPath = img[0].path; 
        newRecipe.img = fs.readFileSync(imgPath); 
    }
    newRecipe.save();
};
const adminAdd = (user, pass) => {
    console.log(user + " " + pass);
    const newAdmin = new Admin({
        username: user,
        password: pass
    });
    newAdmin.save();
};
const saveRecepie = (recipeName, ingredients, procedure, tips, file) => {
    
    if (!file || !file.path) {
        throw new Error('Image file is missing or invalid');
    }

    console.log('Received file:', file);

    const imageData = fs.readFileSync(file.path);

    const newRecipe = new Recipe({
        recipeName: recipeName,
        Ingredients: ingredients,
        Procedure: procedure,
        Tips: tips,
        img: {
            data: imageData, 
            contentType: file.mimetype 
        }
    });

    newRecipe.save()
        .then(() => {
            console.log('Recipe saved successfully');
        })
        .catch(error => {
            console.error('Error saving recipe:', error);
            throw error; 
        });
};

module.exports = { adminAdd , recipeAdd ,saveRecepie };
