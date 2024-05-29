// main.js

// CONSTANTS
const RECIPE_URLS = [
  'https://adarsh249.github.io/Lab8-Starter/recipes/1_50-thanksgiving-side-dishes.json',
  'https://adarsh249.github.io/Lab8-Starter/recipes/2_roasting-turkey-breast-with-stuffing.json',
  'https://adarsh249.github.io/Lab8-Starter/recipes/3_moms-cornbread-stuffing.json',
  'https://adarsh249.github.io/Lab8-Starter/recipes/4_50-indulgent-thanksgiving-side-dishes-for-any-holiday-gathering.json',
  'https://adarsh249.github.io/Lab8-Starter/recipes/5_healthy-thanksgiving-recipe-crockpot-turkey-breast.json',
  'https://adarsh249.github.io/Lab8-Starter/recipes/6_one-pot-thanksgiving-dinner.json',
];

// Run the init() function when the page has loaded
window.addEventListener('DOMContentLoaded', init);

// Starts the program, all function calls trace back here
async function init() {
// initialize ServiceWorker
initializeServiceWorker();
// Get the recipes from localStorage
let recipes;
try {
  recipes = await getRecipes();
} catch (err) {
  console.error(err);
}
// Add each recipe to the <main> element
addRecipesToDocument(recipes);
}

/**
* Detects if there's a service worker, then loads it and begins the process
* of installing it and getting it running
*/
function initializeServiceWorker() {
// Check if 'serviceWorker' is supported in the current browser
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Register './sw.js' as a service worker
    navigator.serviceWorker.register('./sw.js')
      .then(registration => {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      })
      .catch(error => {
        console.log('ServiceWorker registration failed: ', error);
      });
  });
}
}

/**
* Reads 'recipes' from localStorage and returns an array of
* all of the recipes found (parsed, not in string form). If
* nothing is found in localStorage, network requests are made to all
* of the URLs in RECIPE_URLs, an array is made from those recipes, that
* array is saved to localStorage, and then the array is returned.
* @returns {Array<Object>} An array of recipes found in localStorage
*/
async function getRecipes() {
// Check local storage to see if there are any recipes
const recipesFromStorage = localStorage.getItem('recipes');
if (recipesFromStorage) {
  return JSON.parse(recipesFromStorage);
}

// Create an empty array to hold the recipes that you will fetch
let recipes = [];

// Return a new Promise
return new Promise(async (resolve, reject) => {
  try {
    // Loop through each recipe in the RECIPE_URLS array constant
    for (const url of RECIPE_URLS) {
      // Fetch the URL
      const response = await fetch(url);
      // Retrieve the JSON from it
      const recipe = await response.json();
      // Add the new recipe to the recipes array
      recipes.push(recipe);
    }
    // Save the recipes to localStorage
    saveRecipesToStorage(recipes);
    // Resolve the Promise with the recipes array
    resolve(recipes);
  } catch (error) {
    // Log any errors
    console.error(error);
    // Reject the Promise with the error
    reject(error);
  }
});
}

/**
* Takes in an array of recipes, converts it to a string, and then
* saves that string to 'recipes' in localStorage
* @param {Array<Object>} recipes An array of recipes
*/
function saveRecipesToStorage(recipes) {
localStorage.setItem('recipes', JSON.stringify(recipes));
}

/**
* Takes in an array of recipes and for each recipe creates a
* new <recipe-card> element, adds the recipe data to that card
* using element.data = {...}, and then appends that new recipe
* to <main>
* @param {Array<Object>} recipes An array of recipes
*/
function addRecipesToDocument(recipes) {
if (!recipes) return;
let main = document.querySelector('main');
recipes.forEach((recipe) => {
  let recipeCard = document.createElement('recipe-card');
  recipeCard.data = recipe;
  main.append(recipeCard);
});
}
