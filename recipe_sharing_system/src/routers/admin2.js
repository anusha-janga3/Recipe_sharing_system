const { adminAdd , recipeAdd , saveRecepie } = require('../contollers/admin.js');
const { Admin , Recipe , saved  } = require('../models/admin.js');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
      cb(null, file.originalname); 
  }
});


const upload = multer({ storage: storage });


router.post('/recipes', upload.single('image'), async (req, res) => {
try {
  const { recipeName, ingredients, procedure, tips } = req.body;
  const file = req.file;
  
  if (!file) {
    return res.status(400).json({ error: 'Image file is required' });
  }
  
 const recipe = await saveRecepie( recipeName, ingredients, procedure, tips,file);

  res.send('Recipe added successfully');
} catch (error) {
  console.error('Error adding recipe:', error);
  res.send('Internal server error');
}
});
router.post('/save/:recipeName',async (req, res) => {
  try {
      const recipeName = req.params.recipeName;
      console.log(recipeName);

      const recipe = await Recipe.findOne({ recipeName });
      if (!recipe) {
        return res.send('Recipe not found');
    }
    console.log(recipe);
      saved.insertMany(recipe);
      res.send("saved succesfully!!");
  }
  catch (error) {
    console.error('Error fetching recipe:', error);
    res.status(500).json({ error: 'Internal server error' });
}
});




  router.post('/login', async (req, res) => {
    const { user,pass } = req.body;
    console.log(user+" "+pass);
    const foundUser = await Admin.findOne({ username: user });
    if (!foundUser) {
      return res.send("Username not found");
    }
    console.log("Found user:", foundUser);
    const isPassMatch = await bcrypt.compare(pass, foundUser.password);
    if (isPassMatch) {
      console.log("Login Successful");
      return res.send("Login Successful");
    } else {
      return res.send("Wrong password");
    }
});

router.post('/signup', async (req, res) => {
    try {
      const { user , pass } = req.body;
      console.log(user + ' ' + pass);
      const existingUser = await Admin.findOne({ username: user });
        if (existingUser) {
            res.status(400).send('User already exists');
            return; 
        }
      const salts = 10;
      const hashedPass = await bcrypt.hash(pass, salts);
      const result = await adminAdd(user,hashedPass);
      res.send('User added successfully!');
    } catch (error) {
      if (error.code === 11000 && error.keyPattern && error.keyPattern.username) {
          res.status(400).send('Username is already taken');
      } else {
          console.error('Error creating admin user:', error);
          res.status(500).send('Internal server error');
      }
  }
});

// router.get('/recipes/:recipeName', async (req, res) => {
//   try {
//       const recipeName = req.params.recipeName;
//       console.log("b"+recipeName);
//       const recipe = await Recipe.findOne({ recipeName: { $regex: new RegExp(recipeName, "i") }  });
//       if (!recipe) {
//           return res.status(404).json({ error: 'Recipe not found' });
//       }
//       res.status(200).json(recipe);
//   } catch (error) {
//       console.error('Error fetching recipe:', error);
//       res.status(500).json({ error: 'Internal server error' });
//   }
// });



const fs = require('fs');

router.get('/search', async (req, res) => {
  try {
      const recipeName = req.query.recipeName;
      if (!recipeName) {
          return res.status(400).send("Please enter the recipe name");
      }

      const recipes = await Recipe.find({ recipeName: { $regex: new RegExp(recipeName, "i") } });

      if (recipes.length === 0) {
          return res.status(404).json({ error: 'Recipe not found' });
      }

      const recipesWithImageData = recipes.map(recipe => {
          if (recipe.img && recipe.img.data) {
              const imageData = Buffer.from(recipe.img.data, 'base64');
              const imgDataUrl = `data:image/png;base64,${imageData.toString('base64')}`;
              return { ...recipe.toObject(), img: imgDataUrl };
          }
          return recipe.toObject();
      });

      res.status(200).json(recipesWithImageData);
  } catch (error) {
      console.error('Error fetching recipe:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});




router.get('/recipes/search', async (req, res) => {
  try {
      const query = req.query.query; 
      const recipes = await Recipe.find({
          $or: [
              { recipeName: { $regex: query, $options: 'i' } }, 
              { Ingredients: { $regex: query, $options: 'i' } }
          ]
      });
      if (recipes.length === 0) {
          return res.status(404).json({ error: 'No recipes found' });
      }
      res.status(200).json(recipes);
  } catch (error) {
      console.error('Error searching recipes:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});





module.exports = router;



