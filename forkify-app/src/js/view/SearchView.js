import { htmlElements } from "./base";


export const getInput = () => htmlElements.searchInput.value;

export const clearInputField = () => {
    htmlElements.searchInput.value = '';
};

export const clearResultField = () => {
    htmlElements.searchResult.innerHTML = '';
    htmlElements.searchReslistPages.innerHTML = '';
};

export const highlightSelect = id => {
    const arrayResult = Array.from(document.querySelectorAll('.results__link'));
    arrayResult.forEach(el => {
        el.classList.remove('results__link--active');
    });
 
    document.querySelector(`a[href*="${id}"]`).classList.add('results__link--active');
};

export const limitTitle = (title, limit = 17) => {
    const newTitle = [];
    if(title.length > limit) {
        title.split('').reduce((acc, cur) => {
            if(acc + cur.length <= limit) {
                newTitle.push(cur);
            }
            return acc + cur.length;
        }, 0);
        //retutn the result from reducer build in function
        return `${newTitle.join('')} ...`;

    }
    return title;
};

const recipeRender = recipe => {
    const markup = `
        <li>
            <a class="results__link" href="#${recipe.recipe_id}">
                <figure class="results__fig">
                    <img src="${recipe.image_url}" alt="${recipe.title}">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${limitTitle(recipe.title)}</h4>
                    <p class="results__author">${recipe.publisher}</p>
                </div>
            </a>
        </li>
    `;

    htmlElements.searchResult.insertAdjacentHTML('beforeend', markup);
};

const createButton = (page, type) => `
    <button class="btn-inline results__btn--${type}" data-goto="${type === 'prev' ? page - 1 : page + 1}">
        <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
        </svg>
    </button>
`;


const renderButton = (page, numofRes, resultPerPage) => {
    const pages = Math.ceil(numofRes / resultPerPage);
    
    let button;

    if(page === 1 && pages > 1) {
        button = createButton(page, 'next');
    }
    else if (page < pages ) {
        button = 
        `${createButton(page, 'prev')},
         ${createButton(page, 'next')}`
    }
    else if(page === pages && pages > 1) {
        button = createButton(page, 'prev');
    }

    htmlElements.searchReslistPages.insertAdjacentHTML('afterbegin', button);

}; 

export const renderResult = (recipes, page = 1, resultPerPage = 10) => {
    const start = (page - 1) * resultPerPage;
    const end = page * resultPerPage;
    recipes.slice(start, end).forEach(recipeRender);

    //render page button
    renderButton(page, recipes.length, resultPerPage);
};