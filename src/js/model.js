import { async } from 'regenerator-runtime';
import { API_URL, RES_PER_PAGE, key } from './config.js';
import { getJSON, sendJSON } from './helper.js';
export const state = {
  recipe: {},
  search: {
    query: '',
    resaults: [],
    resaultsPerPgae: RES_PER_PAGE,
    page: 1,
  },
  bookmark: [],
};

const createRecipeObject = function (data) {
  const { recipe } = data.data;
  console.log(recipe, state);
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};
export const loadRecipe = async function (id) {
  try {
    const data = await getJSON(`${API_URL}${id}?key=${key}`);
    state.recipe = createRecipeObject(data);
    if (state.bookmark.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    console.error(`${err}💥`);
    throw err;
  }
};
export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    const data = await getJSON(`${API_URL}?search=${query}&key=${key}`);
    state.search.resaults = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });
    state.search.page = 1;
  } catch (err) {
    console.error(`${err}💥💥💥💥💥`);
    throw err;
  }
};

export const getSearchResualtsPage = function (page = state.search.page) {
  state.search.page = page;
  let start = (page - 1) * state.search.resaultsPerPgae; //0;
  let end = page * state.search.resaultsPerPgae; //9;
  return state.search.resaults.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    //new qt = oldqt * newServings / old servings
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });
  state.recipe.servings = newServings;
};

const presistBookMarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmark));
};

export const addBookmark = function (recipe) {
  // add bookmark
  state.bookmark.push(recipe);

  //mark current recipe as bookmark
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  presistBookMarks();
};

export const deleteBookmark = function (id) {
  const index = state.bookmark.findIndex(el => el.id === id);
  state.bookmark.splice(index, 1);

  //mark current recipe as not bookmark
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  presistBookMarks();
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmark = JSON.parse(storage);
};
init();
console.log(state.bookmark);

export const uploadRecipe = async function (newRecipe) {
  try {
    console.log(Object.entries(newRecipe));
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].split(',').map(el => el.trim(''));
        if (ingArr.length !== 3)
          throw new Error(
            'Wrong ingredient format please use the correct format'
          );
        console.log(ingArr);
        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };
    console.log(recipe, state);
    const data = await sendJSON(`${API_URL}?key=${key}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};
// const clearBookmarks = function () {
//   localStorage.clear('bookmarks');
// };
