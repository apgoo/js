export const htmlElements = {
    searchInput: document.querySelector('.search__field'),
    searchForm: document.querySelector('.search'),
    searchPage: document.querySelector('.results'),
    searchResult: document.querySelector('.results__list'),
    searchReslistPages: document.querySelector('.results__pages'),
    recipe: document.querySelector('.recipe'),
    shoppingList: document.querySelector('.shopping__list'),
    likesField: document.querySelector('.likes__field'),
    likesList: document.querySelector('.likes__list'),

};

export const elementString = {
    loader: 'loader'
}

export const renderLoader = parent => {
    const loading = `
        <div class="${elementString.loader}">
            <svg>
                <use href="img/icons.svg#icon-cw"></use>
            </svg>
        </div>
    `;

    parent.insertAdjacentHTML('afterbegin', loading);

};

export const clearLoader = () => {
    const loadage = document.querySelector(`.${elementString.loader}`);

    if(loadage) loadage.parentElement.removeChild(loadage);
}
