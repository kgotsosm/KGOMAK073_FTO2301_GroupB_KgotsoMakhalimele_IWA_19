import { BOOKS_PER_PAGE,
        authors,
        genres,
        books }
    from "./data.js";

/**
 * Declare all the constants with querySelector() method to select elements from
 * the Document Object Model (DOM) using data attributes
 */

const headerSearch = document.querySelector('[data-header-search]')
const headerSettings = document.querySelector('[data-header-settings]')
const listItems = document.querySelector('[data-list-items]')
const listMessage = document.querySelector('[data-list-message]')
const listButton = document.querySelector('[data-list-button]')
const listActive = document.querySelector('[data-list-active]')
const listBlur = document.querySelector('[data-list-blur]')
const listImage = document.querySelector('[data-list-image]')
const listTitle = document.querySelector('[data-list-title]')
const listSubtitle = document.querySelector('[data-list-subtitle]')
const listDescription = document.querySelector('[data-list-description]')
const listClose = document.querySelector('[data-list-close]')
const searchOverlay = document.querySelector('[data-search-overlay]')
const searchForm = document.querySelector('[data-search-form]')
const searchTitle = document.querySelector('[data-search-title]')
const searchGenres = document.querySelector('[data-search-genres]')
const searchAuthors = document.querySelector('[data-search-authors]')
const searchCancel = document.querySelector('[data-search-cancel]')
const settingsOverlay = document.querySelector('[data-settings-overlay]')
const settingsTheme = document.querySelector('[data-settings-theme]')

// Display 36 books per page by default and set the page to 1

let matches = books
let page = 1;
const range = [0, BOOKS_PER_PAGE]

if (!books && !Array.isArray(books)) {
    throw new Error('Source required')
}

if (!range && range.length === 2) {
    throw new Error('Range must be an array with two numbers')
}

/**
 * The createPreview() function takes a book preview object and returns
 * a button element containing the book preview information in HTML form
 */
function createPreview(preview) {
    const { author: authorId, id, image, title } = preview

    const showPreview = document.createElement('button')
    showPreview.classList = 'preview'
    showPreview.setAttribute('data-preview', id)

    showPreview.innerHTML = /* html */ `
        <img
            class="preview__image"
            src="${image}"
            alt="Cover of ${title}"
        />

        <div class="preview__info">
            <h3 class="preview__title">${title}</h3>
            <div class="preview__author">${authors[authorId]}</div>
        </div>
    `

    return showPreview
}

const bookFragment = document.createDocumentFragment()

const startIndex = (page - 1) * BOOKS_PER_PAGE
const endIndex = startIndex + BOOKS_PER_PAGE

const bookExtracted = books.slice(startIndex, endIndex)

/**
 * This loop iterates over the books available to display on the current page.
 * Creates a button element for each book preview by invoking createPreview() and appends it to the bookFragment.
 */


for (const preview of bookExtracted) {
    const showPreview = createPreview(preview)
    bookFragment.appendChild(showPreview)
}

listItems.appendChild(bookFragment)

/** This code checks if there are more books to display.
 *  If there are, it enables the button and updates the text to show the number of remaining books.
 *  If there are no more books to display, it disables the button and updates the text to show 0 remaining books.
 */
listButton.addEventListener('click', () => {
    page++;

    const newStartIndex = (page - 1) * BOOKS_PER_PAGE
    const newEndIndex = newStartIndex + BOOKS_PER_PAGE

    const newBookExtracted = books.slice(newStartIndex, newEndIndex)

    const newBookFragment = document.createDocumentFragment()

    for (const preview of newBookExtracted) {
        const showPreview = createPreview(preview)
        newBookFragment.appendChild(showPreview)
    }

    listItems.appendChild(newBookFragment);

    const remaining = matches.length - page * BOOKS_PER_PAGE;
    listButton.innerHTML = /* HTML */ `
      <span>Show more</span>
      <span class="list__remaining"> (${remaining > 0 ? remaining : 0})</span>
    `;

    listButton.disabled = remaining <= 0;
})


listButton.innerHTML = /* HTML */
    `<span>Show more</span>
    <span class="list__remaining"> (${matches.length - [page * BOOKS_PER_PAGE] > 0 ? matches.length - [page * BOOKS_PER_PAGE] : 0})</span>
    `;


/**
 * BOOK SUMMARY
 */

// When dataListItems is clicked, it shows the modal by invoking showModal() on dataListActive.
listItems.addEventListener('click', (event) => {
    listActive.showModal()
    let pathArray = Array.from(event.path || event.composedPath())
    let active;

    for (const node of pathArray) {
        if (active) break;
        const id = node?.dataset?.preview

        for (const singleBook of books) {
            if (singleBook.id === id) {
                active = singleBook
                break;
            }
        }
    }

    if (!active) return;
    listImage.src = active.image;
    listBlur.src = active.image;
    listTitle.textContent = active.title;
    listSubtitle.textContent = `${authors[active.author]} (${new Date(active.published).getFullYear()})`
    listDescription.textContent = active.description;
})


//When dataListClose is clicked, it closes the modal by invoking close() on dataListActive.
listClose.addEventListener('click', () => {
    listActive.close()
})


/**
 * SEARCH BOOKS
 * Search by title, genre, and author name.
 */

// When dataHeaderSearch is clicked, it shows the modal by invoking showModal() on dataSearchOverlay.
headerSearch.addEventListener('click', () => {
    searchOverlay.showModal()
    searchTitle.focus()
})

//When dataSearchCancel is clicked, it closes modal by invoking close() on dataSearchOverlay
searchCancel.addEventListener('click', () => {
    searchOverlay.close()
})

const genresFragment = document.createDocumentFragment()
const genreElement = document.createElement('option')
genreElement.value = 'any'
genreElement.innerText = 'All Genres'
genresFragment.appendChild(genreElement)

for (const [id] of Object.entries(genres)) {
    const genreElement = document.createElement('option')
    genreElement.value = id
    genreElement.innerText = genres[id]
    genresFragment.appendChild(genreElement)
}

searchGenres.appendChild(genresFragment)

const authorsFragment = document.createDocumentFragment()
const authorsElement = document.createElement('option')
authorsElement.value = 'any'
authorsElement.innerText = 'All Authors'
authorsFragment.appendChild(authorsElement)

for (const [id] of Object.entries(authors)) {
    const authorsElement = document.createElement('option')
    authorsElement.value = id
    authorsElement.innerText = authors[id]
    authorsFragment.appendChild(authorsElement)
}

searchAuthors.appendChild(authorsFragment)


/**
 * FILTER BOOKS BY TITLE, GENRE AND AUTHOR
 * Set the search criteria based on the user's form input. Code sets an empty array to store the results.
 * The search is then performed on an array of books, with the search criteria based on the user's form input.
 */

searchForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const filters = Object.fromEntries(formData);
    const result = [];

    for (let x = 0; x < books.length; x++) {
        const titleState = filters.title.trim() && books[x].title.toLowerCase().includes(filters.title.toLowerCase());
        const authorState = filters.author !== 'any' && books[x].author.includes(filters.author);
        const genreState = filters.genre !== 'any' && books[x].genres.includes(filters.genre);

        if (titleState && authorState && genreState) {
            result.push(books[x]);
        }
    }

    // If there are no results, the code displays a message to the user.
    if (result.length > 0) {
        const resultFragment = createPreview(result);
        listItems.replaceChildren(resultFragment);
        listButton.innerHTML = /* html */ `
        <span>Show more</span>
        <span class="list__remaining"> (0)</span>
      `;
        listButton.disabled = true;
        listMessage.style.display = 'none';

    } else if (filters.title.trim() && filters.author !== 'any' && filters.genre !== 'any') {
        const firstElementChild = listMessage;
        listItems.innerHTML = '';
        listItems.replaceChildren(firstElementChild);
        listMessage.style.display = 'block';
        listButton.innerHTML = /* html */ `
        <span>Show more</span>
        <span class="list__remaining"> (0)</span>
      `;
        listButton.disabled = true;
    }

    // If there are results, the code displays the results to the user.
    searchOverlay.close();
    searchForm.reset();
    window.scrollTo({ top: 0, behavior: 'smooth' });
})


/**
 * SELECT A THEME
 * The code sets up a click event listener on dataHeaderSettings.
 * When the user clicks the button, the code shows the modal by invoking showModal() on dataSettingsOverlay.
 */

headerSettings.addEventListener('click', () => {
    settingsOverlay.showModal()
})

dataSettingsCancel.addEventListener('click', () => {
    settingsOverlay.close()
})

// Object defines the light and dark color values for the --color-light and --color-dark CSS variables.

const css = {
    day : ['255, 255, 255', '10, 10, 20'],
    night: ['10, 10, 20', '255, 255, 255']
}

// Check if the user's browser has a preference for dark mode. If so, set the theme to night. Otherwise, set the theme to day.

settingsTheme.value = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'night' : 'day'


/**
 * SUBMIT EVENT
 *  When the user submits the form, the code prevents the default behavior of the form submission.
 *  The code then creates a new FormData object from the form submission event target.
 *  The code then creates an object from the FormData object.
 *  The code then checks if the theme property of the object is set to night.
 *  If so, the code sets the CSS variables to the night theme. Otherwise, the code sets the CSS variables to the day theme.
 */
 
dataSettingsForm.addEventListener('submit', (event) => {
    event.preventDefault()
    const formSubmit = new FormData(event.target)
    const selected = Object.fromEntries(formSubmit)

    if (selected.theme === 'night') {
        document.documentElement.style.setProperty('--color-light', css[selected.theme][0])
        document.documentElement.style.setProperty('--color-dark', css[selected.theme][1])
    } else if (selected.theme === 'day') {
        document.documentElement.style.setProperty('--color-light', css[selected.theme][0])
        document.documentElement.style.setProperty('--color-dark', css[selected.theme][1])
    }

    settingsOverlay.close()
})
