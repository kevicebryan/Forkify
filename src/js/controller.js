// import icons from '../img/icons.svg'; // Parcel 1

import 'core-js/stable';
import 'regenerator-runtime/runtime';

import { MODAL_CLOSE_SEC } from './config.js';

import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsViews from './views/resultsViews.js';
import bookmarksView from './views/bookmarksView.js';
import paginationView from './views/paginationView.js';
import addRecipeView from './views/addRecipeView.js';

///////////////////////////////////////

// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    // console.log(id);
    if (!id) {
      return;
    }
    recipeView.renderSpinner();

    // Update Results view to mark selected
    resultsViews.update(model.getSearchResultsPage());
    // 1) Update bookmarks view
    bookmarksView.update(model.state.bookmarks);
    // 2) Loading Recipe // From Model
    await model.loadRecipe(id);
    // 3) Rendering Recipe // From View
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
  // // Testing
  // controlServings();
};

const controlSearchResults = async function () {
  try {
    resultsViews.renderSpinner();
    // 1) Get Search Query
    const query = searchView.getQuery();
    if (!query) return;
    // 2) Load Search Results
    await model.loadSearchResult(query);
    // 3) Render Results
    resultsViews.render(model.getSearchResultsPage());
    // 4) Render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (gotoPage) {
  // 1) Render new Results
  resultsViews.render(model.getSearchResultsPage(gotoPage));
  // 2) Render new  pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // Update the servings data
  model.updateServings(newServings);
  // Update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe); ///only update text and attribute
};

const controlAddBookmark = function () {
  // Add / Remove bookmark
  if (!model.state.recipe.marked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  // Update Recipe View
  recipeView.update(model.state.recipe);
  // Render Bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Render Spinner
    addRecipeView.renderSpinner();

    await model.uploadRecipe(newRecipe);
    // console.log(model.state.recipe);
    // Render Recipe
    recipeView.render(model.state.recipe);
    // Success Message
    addRecipeView.renderMessage();
    // Render Bookmark
    bookmarksView.render(model.state.bookmarks);
    // Change ID in url
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    // Close Form Window
    setTimeout(function () {
      addRecipeView._toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.log(`❌`, err);
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarksView.addHanlderRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();
