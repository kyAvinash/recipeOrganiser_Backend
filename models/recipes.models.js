const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  cuisineType: {
    type: String,
    required: true,
  },
  imageLink:{
    type: String,
    required: true,
  },
  ingredients:{
    type: String,
    required: true,
  },
  cookingInstructions:{
    type: String,
    required: true,
  }
},{timestamps: true});

const Recipe = mongoose.model("Recipe", recipeSchema);
module.exports = Recipe;