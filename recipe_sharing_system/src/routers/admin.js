const express = require('express');
const { adminAdd , recipeAdd } = require('../contollers/admin.js');
const { Admin , Recipe } = require('../models/admin.js');
const bcrypt = require('bcrypt');
const otp = require('../middleware/admin')
const router = express.Router();
let userData = {};
let loginData ;
router.post('/signin', async (req, res) => {
  try {
    const { user, pass,call } = req.body;
    console.log(user + ' ' + pass+' '+call);
    const send = otp.otp(call)
    res.send('OTP sent successfully');
    const salts = 10;
    const hashedPass = await bcrypt.hash(pass, salts);
    userData = {
      user: user,
      hashedPass: hashedPass,
      call: call
    };
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/addRecipe', (req, res) => {
    const { recipeName, Ingredients, Procedure, Tips } = req.body;
    const img = req.files.img;
    console.log(recipeName + " " + Ingredients + " " + Procedure + " " + Tips + " " + img);
    recipeAdd(recipeName, Ingredients, Procedure, Tips, img);
    res.send("recipe added successfully !!");
});

router.get('/fetch/:recipeName', async (req, res) => {
  try {
      const recipeName = req.params.recipeName;
      const recipe = await Recipe.findOne({ recipeName: recipeName });
      if (!recipe) {
          return res.status(404).json({ error: 'Recipe not found' });
      }
      res.status(200).json(recipe);
  } catch (error) {
      console.error('Error finding recipe:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/login', async (req, res) => {
    const { user, pass } = req.body;
    AddAd.username[0] = user;
    const foundUser = await database.Admin.findOne({ username: user });
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
router.post('/passCheck',async (req,res)=>{
  const {user,pass}=req.body;
    const check=await database.Admin.findOne({username:user});
    if(!check){
      res.send("user name cannot found");
    }
    const ispassMatch= await bcrypt.compare(pass,check.password);
    if(ispassMatch){
      res.send("Login Successful")
    }
    else{
      res.send("wrong password")
    }
})
router.post('/otp', async (req,res)=>{
   const userOtp=req.body;
   const re = await otp.verifyOtp(userOtp);
   const user = userData.user;
    const hashedPass = userData.hashedPass;
    const call = userData.call;
    console.log(user+" "+hashedPass+" "+call);
   if(re){
    const result = await AddAd.AddAdmin(user,hashedPass,call);
    res.send("user added succesfully")
   }
   else{
    res.send("wrong OTP")
   }
})
module.exports = { router , loginData };

