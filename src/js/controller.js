import * as model from './model.js';
import recipeView from './view/recipeView.js';
import searchview from './view/searchview.js';
import resultsView from './view/resultsView.js';
import paginationView from './view/paginationView.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import bookmarkView from './view/bookmarkView.js';
import addRecipeView from './view/addRecipeView.js';
import { MODAL_CLOSE_SEC } from './config.js';
if (module.hot) {
  module.hot.accept();
}

const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpiner();
    // 0) update results view to mark selected search result

    resultsView.update(model.getSearchResualtsPage());
    bookmarkView.update(model.state.bookmark);
    //1) loading recipe

    await model.loadRecipe(id);

    //2)rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

const contronSearchReasults = async function () {
  try {
    //1) get search query
    const query = searchview.getQuery();
    if (!query) return;

    // 2) Load search resaults
    resultsView.renderSpiner();
    await model.loadSearchResults(query);
    //3) render resaults
    resultsView.render(model.getSearchResualtsPage());
    // 4)render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};
contronSearchReasults();

const controlPagination = function (goToPage) {
  console.log(goToPage);
  //1) render New resaults
  resultsView.render(model.getSearchResualtsPage(goToPage));
  // 2)render New pagination buttons
  paginationView.render(model.state.search);
};

const controlServeing = function (newServings) {
  // update the recipe serving (in state)
  model.updateServings(newServings);
  // update the recipe view
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  //1) add/remove bookmarks
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  //2) update recipe view
  recipeView.update(model.state.recipe);
  //3) render bookmarks
  bookmarkView.render(model.state.bookmark);
};

const controlBookmarks = function () {
  bookmarkView.render(model.state.bookmark);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // render waiting spener
    addRecipeView.renderSpiner();
    // upload the new recipe data
    await model.uploadRecipe(newRecipe);
    //render recipe
    recipeView.render(model.state.recipe);
    // success message
    addRecipeView.renderMessage();
    // render bookmark view
    bookmarkView.render(model.state.bookmark);
    // change id in url
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    //close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    addRecipeView.renderError(err.message);
  }
};
// publisher-subscriber pattern
const init = function () {
  bookmarkView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerServings(controlServeing);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchview.addHandlerSearch(contronSearchReasults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
