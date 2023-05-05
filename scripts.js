
import { BOOKS_PER_PAGE, authors, genres, books } from '/data.js';
document.addEventListener('DOMContentLoaded', function() {



    //Function to search for books
    function searchBooks(books, query) {
        const matchingBooks = [];
        for (let book of books) {
            const titleMatch = book.title.toLowerCase().includes(query.toLowerCase());
            const authorMatch = book.author.toLowerCase().includes(query.toLowerCase());
            const summaryMatch = book.summary.toLowerCase().includes(query.toLowerCase());
            if (titleMatch || authorMatch || summaryMatch) {
                matchingBooks.push(book);
            }
        }
        return matchingBooks;
    }

    //Function to show book previews
    function displayBookPreviews(books) {
        const previewsContainer = document.getElementById("previews-container");

        // Clear existing previews
        previewsContainer.innerHTML = "";

        // Create a preview element for each book
        for (let book of books) {
            const preview = document.createElement("div");
            preview.classList.add("preview");

            const title = document.createElement("h2");
            title.innerText = book.title;
            preview.appendChild(title);

            const author = document.createElement("h3");
            author.innerText = book.author;
            preview.appendChild(author);

            const image = document.createElement("img");
            image.src = book.image;
            preview.appendChild(image);

            previewsContainer.appendChild(preview);
        }
    }

    //Function to show book summary
    function displayBookSummary(book) {
        const summaryContainer = document.getElementById("summary-container");
        summaryContainer.innerHTML = "";

        const title = document.createElement("h2");
        title.innerText = book.title;
        summaryContainer.appendChild(title);

        const author = document.createElement("h3");
        author.innerText = book.author;
        summaryContainer.appendChild(author);

        const summary = document.createElement("p");
        summary.innerText = book.summary;
        summaryContainer.appendChild(summary);
    }

    //Function to show published date
    function displayPublishedDate(book) {
        const publishedDateContainer = document.getElementById("published-date-container");
        publishedDateContainer.innerHTML = "";

        const title = document.createElement("h2");
        title.innerText = book.title;
        publishedDateContainer.appendChild(title);

        const author = document.createElement("h3");
        author.innerText = book.author;
        publishedDateContainer.appendChild(author);

        const publishedDate = document.createElement("p");
        publishedDate.innerText = book.publishedDate;
        publishedDateContainer.appendChild(publishedDate);
    }

    //Function to show books filtered by author
    function filterBooksByAuthor(books, author) {
        const matchingBooks = [];
        for (let book of books) {
            if (book.author.toLowerCase() === author.toLowerCase()) {
                matchingBooks.push(book);
            }
        }
        return matchingBooks;
    }

    //Function to filter books by genre

    function filterBooksByGenre(books, genre) {
        const matchingBooks = [];
        for (let book of books) {
            if (book.genre.toLowerCase() === genre.toLowerCase()) {
                matchingBooks.push(book);
            }
        }
        return matchingBooks;
    }

    // Function to toggle between light and dark mode

    function generateThemeElements() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const themeColors = {
            light: {
                primary: '#0096ff',
                secondary: '#f0f0f0',
                text: '#333',
            },
            dark: {
                primary: '#161b22',
                secondary: '#0a0a14',
                text: '#f0f0f0',
            },
        };

        // Create new elements for light/dark theme
        const header = document.createElement('header');
        header.classList.add('header', 'theme-element');
        header.style.backgroundColor = themeColors[currentTheme].primary;

        const footer = document.createElement('footer');
        footer.classList.add('footer', 'theme-element');
        footer.style.backgroundColor = themeColors[currentTheme].secondary;

        const bodyText = document.createElement('p');
        bodyText.classList.add('body-text', 'theme-element');
        bodyText.style.color = themeColors[currentTheme].text;
        bodyText.textContent = 'This is some body text.';

        return [header, footer, bodyText];
    }

});


