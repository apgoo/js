import Search from './models/Search';
import * as SearchView from './view/SearchView';
import * as RecipeView from './view/RecipeView';
import * as ListView from './view/ListView';
import * as LikeView from './view/LikeView';
import { htmlElements, renderLoader, clearLoader } from './view/base';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Like';


/**
 * -- Global State
 */
const state = {};


/**
 * --- SEARCH Controller
 */
const controllSearch = async () => {
    const query = SearchView.getInput();

    if(query) { 

       // 2) new object create and add to state 
        state.search = new Search(query);

       // 3) preper  ui for result
       SearchView.clearInputField();
       SearchView.clearResultField();
       renderLoader(htmlElements.searchPage);

       try {
           // 4) Search from recipe data
            await state.search.getSearchResult();
           
           // 5) Render result on Ui
           clearLoader();
           SearchView.renderResult(state.search.result);
           //console.log(state.search.result);

        } catch(error) {
            alert('error found on index search controller');
            clearLoader();
        }

    }
}
 
htmlElements.searchForm.addEventListener('submit', event => {
    event.preventDefault();
    controllSearch();
});



htmlElements.searchReslistPages.addEventListener('click', event => {
    const button = event.target.closest('.btn-inline');
  
    if(button) {
        const gotoPage = parseInt(button.dataset.goto, 10);
        SearchView.clearResultField();
        SearchView.renderResult(state.search.result, gotoPage);
       
    }  
});


/**
* -- Recipe Controller 
*/
const controllRecipe = async () => {
    //Get id from url
    const id = window.location.hash.replace('#', '');
    
    if(id) {
        // preparing ui for change
        RecipeView.clearRecipe();
        renderLoader(htmlElements.recipe);

        //Add new data to object
        state.recipe = new Recipe(id);
        
        try {
            //get Data from recipe and parse ingrediants
            await state.recipe.putRecipeSearch();
            state.recipe.parseIngrediant();
            
            //
            if(state.search) SearchView.highlightSelect(id);

            //calculate time and serving
            state.recipe.calcTime();
            state.recipe.calcServings();

            //render recipe
            console.log(state.recipe);
            clearLoader();
            RecipeView.renderRecipe(state.recipe, state.likes.isLike(id));

        } catch(error) {
            alert('error found on index recipe controller');
            console.log(error);
        }    
    }
};


// window.addEventListener('hashchange', controllRecipe);
// window.addEventListener('load', controllRecipe);
['hashchange', 'load'].forEach(event => window.addEventListener(event, controllRecipe));



/**
 * --LIST CONTROLLER
 * 
 */
const controllList = () => {
    // create a new list if there is no list
    if(!state.list) state.list = new List();

    // Add each ingrediant to the list and ui
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingree);
        ListView.renderItem(item);
    });
}
// handle event for delete and update
htmlElements.shoppingList.addEventListener('click', e => {

    const id = e.target.closest('.shopping__item').dataset.itemid;

    // handle the delete button
    if(e.target.matches('.shopping__delete, .shopping__delete *')) {
        // delete from state
        state.list.deleteItem(id);

        //delete from ui
        ListView.deleteItem(id);
    }
    else if(e.target.matches('.shopping__count--value')) {
        
        const val = parseFloat(e.target.value, 10);

        state.list.updateItem(id, val);
    }
});


/**
 * --LIKES CONTROLLER
 * 
 */

state.likes = new Likes;
LikeView.toggleLikeMenu(state.likes.getNumlike());

const controllLike = () => {
    if(!state.likes) state.likes = new Likes;

    const currentId = state.recipe.id;
    //user not uet to liked current recipe

    if(!state.likes.isLike(currentId)) {
        //Add like to the state
        const newLike = state.likes.addLikes(currentId, state.recipe.title, state.recipe.author, state.recipe.img);
    
        LikeView.toggleBtn(true);
        
        //add like to ui
        LikeView.renderLike(newLike);
        
    } else {
        //remove like to the state
        state.likes.deleteLike(currentId);
        
        LikeView.toggleBtn(false);

        //remove likes from list
        LikeView.deleteLike(currentId)
    }
    
LikeView.toggleLikeMenu(state.likes.getNumlike());
};


window.addEventListener('load', () => {
    state.likes = new Likes;

    //resotre likes
    state.likes.readStorag();
    
    // toggle like menu button
    LikeView.toggleLikeMenu(state.likes.getNumlike());

    // render the exist like
    state.likes.likes.forEach(like => LikeView.renderLike(like));
});
 

//update recipe serving btn click

htmlElements.recipe.addEventListener('click', e => {
            
    if(e.target.matches('.btn-decrease, .btn-decrease *')) {
        // Decress button is clicked
        if(state.recipe.serving > 1) {
            state.recipe.updateServing('dec');
            RecipeView.updateServingIngre(state.recipe);
        }
        
    } else if (e.target.matches('.btn-increment, .btn-increment *')) {
        // increasae button  is clicked
            state.recipe.updateServing('inc');
            RecipeView.updateServingIngre(state.recipe);

    } else if(e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        // add ingredients to shoppingList
        controllList();
    } else if(e.target.matches('.recipe__love, .recipe__love *')) {
        controllLike();
    }

     
    
});


