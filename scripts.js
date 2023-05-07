import { BOOKS_PER_PAGE,
    authors,
    genres,
    books }
    from './data.js'

// Show the book previews.
const details = (event) => {

    // Query selectors to create variables to be used for HTML code

    const overlay = document.querySelector('[data-list-active]')
    const bookName = document.querySelector('[data-list-title]')
    const subtitle = document.querySelector('[data-list-subtitle]')
    const description = document.querySelector('[data-list-description]')
    const image = document.querySelector('[data-list-image]')
    const blurEffect = document.querySelector('[data-list-blur]')

    event.target.dataset.id ? overlay.style.display = 'block' : undefined;
    event.target.dataset.title ? bookName.innerHTML = event.target.dataset.title : undefined;
    event.target.dataset.subtitle ? subtitle.innerHTML = event.target.dataset.subtitle : undefined;
    event.target.dataset.description ? description.innerHTML = event.target.dataset.description : undefined;
    event.target.dataset.image ? image.setAttribute('src', event.target.dataset.image) : undefined;
    event.target.dataset.image ? blurEffect.setAttribute('src', event.target.dataset.image) : undefined;
}

// Add event listeners for behaviour on click

document.querySelector('[data-list-items]').addEventListener('click', details)
document.querySelector('[data-list-close]').addEventListener('click', (event) => {
    document.querySelector('[data-list-active]').style.display = 'none'
})


// Show more books after page end

const matches = books
const page = 1;
const seeMore = document.querySelector('[data-list-button]');
const showMore = page * BOOKS_PER_PAGE;
seeMore.disabled = !(matches.length - showMore > 0);
seeMore.innerHTML = /* html */ `
    <span>Show more</span>
    <span class="list__remaining">${matches.length - showMore > 0 ? matches.length - showMore : 0}</span>
`;
seeMore.addEventListener('click', () => {
    event.preventDefault(); // Prevent the default action of the button when clicked
    seeMore.focus();
});

// Load Number of books per page

let [start, end] = [0, BOOKS_PER_PAGE]

// Create HTML for showing books with cover image, author, title, description and publication date
seeMore.addEventListener('click', () => {
    const extracted = books.slice(start, end);

    const fragment = document.createDocumentFragment();
    for (const { author, image, title, id, description, published } of extracted) {
        const element = document.createElement('button');
        element.classList.add('preview');
        element.dataset.id = id;
        element.dataset.title = title;
        element.dataset.description = description;
        element.dataset.image = image;
        element.dataset.subtitle = `${authors[author]} (${new Date(published).getFullYear()})`;
        element.setAttribute('data-preview', id);
        element.innerHTML = /* html */ `
      <div>
        <img class="preview__image" src="${image} alt="Cover of ${title}"/>
      </div>
      <div class="preview__info">
        <h3 class="preview__title">${title}</h3>
        <div class="preview__author">${authors[author]}</div>
      </div>
    `;
        fragment.appendChild(element);
    }
    document.querySelector('[data-list-items]').appendChild(fragment);
    start += 36;
    end += 36;
});


// Define objects for light and dark theme

const day = {
    dark: '10, 10, 20',
    light: '255, 255, 255',
}

const night = {
    dark: '255, 255, 255',
    light: '10, 10, 20',
}

// Show an overlay element with the selected id

const headerSettingsOverlay = document.querySelector('[data-header-settings]')
headerSettingsOverlay.addEventListener('click', () => {
    document.querySelector('[data-settings-overlay]').style.display = 'block'
})

// Show the selected theme colours

const dataSettingsTheme = document.querySelector('[data-settings-theme]')
const saveButton = document.querySelector("body > dialog:nth-child(5) > div > div > button.overlay__button.overlay__button_primary")
saveButton.addEventListener('click', (event) => {
    event.preventDefault() //prevent the default behavior of the button
    if (dataSettingsTheme.value === 'day') {
        document.querySelector('body').style.setProperty('--color-dark', day.dark)
        document.querySelector('body').style.setProperty('--color-light', day.light)
        document.querySelector('[data-settings-overlay]').style.display = 'none'
    }
    if (dataSettingsTheme.value === 'night') {
        document.querySelector('body').style.setProperty('--color-dark', night.dark)
        document.querySelector('body').style.setProperty('--color-light', night.light)
        document.querySelector('[data-settings-overlay]').style.display = 'none'
    }
});

// Create search button functionality

const searchButton = document.querySelector('[data-header-search]');
const searchOverlay = document.querySelector('[data-search-overlay]');
const searchTitle = document.querySelector('[data-search-title]');
const searchCancel = document.querySelector('[data-search-cancel]');

// Create event listener for the search button to create functionality on click
searchButton.addEventListener('click', () => {
    searchCancel.addEventListener('click', () => { //cancel button not working yet.
        searchCancel.open = false;
    });
    searchOverlay.open = true;
    searchTitle.focus();
});


const genresElement = document.querySelector('[data-search-genres]');
const authorsElement = document.querySelector('[data-search-authors]');
const optionElement = document.createElement('option');

optionElement.innerText = 'All Genres';
genresElement.appendChild(optionElement);

for (const [id, names] of Object.entries(genresElement)) {
    const element = document.createElement('option')
    element.value = id
    element.innerText = names
    genresElement.appendChild(element)

    const authorsOption = document.createElement('option');
    authorsOption.innerText = 'All Authors';
    authorsElement.appendChild(authorsOption);
    for (const [id, names] of Object.entries(authorsElement)) {
        const element = document.createElement('option')
        element.value = id
        element.innerText = names
        authorsElement.appendChild(element)
    }
}

// Destructuring to create an array to loop through
let [bookStart, bookEnd] = [0, 36];
const itemsElement = document.querySelector('[data-list-items]')
const extracted = books.slice(bookStart, bookEnd)

// Create DocumentFragment object

const fragment = document.createDocumentFragment()
for (const { author, image, title, id, description, published } of extracted) {

    let element = document.createElement('button')

    //Elements - Used to populate the book details in the overlay.

    element.classList = 'preview'
    element.dataset.id = id
    element.dataset.title = title
    element.dataset.description = description
    element.dataset.image = image
    element.dataset.subtitle = (`${authorsElement[author]} (${(new Date(published)).getFullYear()})`)
    element.setAttribute('data-preview', id)

    element.innerHTML = /* html content*/ `
            <div><img
                class ="preview__image"
                src="${image}"
             alt="Cover of ${title}"/></div>
            
            <div class="preview__info">
                <h3 class="preview__title">${title}</h3>
                <div class="preview__author">${authorsElement[author]}</div>
            </div>
        `
    fragment.appendChild(element)
}
itemsElement.appendChild(fragment) /* Add all books into the DOM */
