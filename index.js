const express = require("express");
const cors = require("cors");

const { initializeDatabase } = require("./db/db.connect");

const Recipe = require("./models/recipes.models");


const app = express();
const PORT = 4000;


const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

initializeDatabase();

// data seeding...

/*
const fs = require("fs");

const jsonData = fs.readFileSync("recipes.json", "utf8");
const recipes = JSON.parse(jsonData);


function seedData(){
    try{
        for(const recipeData of recipes){
            const newRecipe = new Recipe({
                name: recipeData.name,
                cuisineType: recipeData.cuisineType,
                imageLink: recipeData.imageLink,
                ingredients: recipeData.ingredients,
                cookingInstructions: recipeData.cookingInstructions,
            });
            newRecipe.save();
        }
    }catch(error){
        console.log("Error seeding data", error);
    }
}


seedData();

*/

async function getRecipeData() {
  try {
    const recipe = await Recipe.find();
    return recipe;
  } catch (error) {
    return { error: "Error While Getting Recipe Data" };
  }
}

app.get("/recipes", async (req, res) => {
  try {
    const recipe = await getRecipeData();
    if (recipe.length != 0) {
      res.json(recipe);
    } else {
      res.status(404).json({ message: "No Recipes Found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Error getting Recipes" });
  }
});

async function addRecipe(recipeData) {
  try {
    const recipe = new Recipe(recipeData);
    const savedRecipe = await recipe.save();
    return savedRecipe;
  } catch (error) {
    throw error;
  }
}

app.post("/recipes", async (req, res) => {
  try {
    const savedRecipe = await addRecipe(req.body);
    res
      .status(201)
      .json({ message: "Recipe Added Successfully!!! Thank You." });
  } catch (error) {
    res.status(500).json({ error: "Error while Adding Recipe" });
  }
});

async function getRecipeById(recipeId) {
  try {
    const recipe = await Recipe.findById(recipeId);
    return recipe;
  } catch (error) {
    throw error;
  }
}

app.get("/recipes/:id", async (req, res) => {
  try {
    const recipe = await getRecipeById(req.params.id);
    if (recipe) {
      res.json(recipe);
    } else {
      res.status(404).json({ message: "No Recipe found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error getting recipe" });
  }
});


async function searchRecipeByType(recipeType) {
  try {
    const recipes = await Recipe.find({
      cuisineType: { $regex: recipeType, $options: "i" },
    });
    return recipes;
  } catch (error) {
    console.error("Error while searching recipes for type:", recipeType, error);
    throw new Error("Error while searching recipes");
  }
}

app.get("/recipes/search/:type", async (req, res) => {
  const { type } = req.params;
  if (!type) {
    return res.status(400).json({ message: "Please provide a recipe type to search for" });
  }

  try {
    const recipes = await searchRecipeByType(type);
    if (recipes.length !== 0) {
      res.status(200).json(recipes);
    } else {
      res.status(404).json({ message: `No recipes found for type "${type}"` });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


async function removeRecipe(recipeId) {
  try {
    const recipeItem = await Recipe.findByIdAndDelete(recipeId);
    if (!recipeItem) {
      throw new Error("Recipe Not Found!!!");
    }
    return recipeItem;
  } catch (error) {
    throw error;
  }
}

app.delete("/recipes/:id", async (req, res) => {
  try {
    const removedRecipe = await removeRecipe(req.params.id);
    res.status(200).json(removedRecipe);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
