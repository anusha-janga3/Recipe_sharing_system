const mongoose = require("mongoose");
const connectToDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://anushajanga036:Anusha20@cluster0.jppat0p.mongodb.net/");
         console.log("Database connected ");
    } 
    catch (error) {
        console.error("ERROR in connecting!", error);
    }
};

module.exports = connectToDB;


