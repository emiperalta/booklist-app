class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
};

class UI {
    static displayBooks() {
        const books = Store.getBooks();

        books.forEach(book => UI.addBookToList(book));
    };

    static addBookToList(book) {
        const list = document.querySelector('#book-list');

        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href='#' class='btn btn-danger delete'>X</a></td>
        `;

        list.appendChild(row);
    }

    static deleteBook(el) {
        if (el.classList.contains('delete')) {
            el.parentElement.parentElement.remove();
        }
    }

    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert ${className}`;
        div.appendChild(document.createTextNode(message));

        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        container.insertBefore(div, form);

        setTimeout(() => div.remove(), 2000);
    }
};

class Store {
    static getBooks() {
        let books;
        if (sessionStorage.getItem('books') === null) books = [];
        else books = JSON.parse(sessionStorage.getItem('books'));

        return books;
    }

    static addBook(book) {
        const books = Store.getBooks();
        books.push(book);

        sessionStorage.setItem('books', JSON.stringify(books));
    }

    static deleteBook(isbn) {
        const books = Store.getBooks();
        books.forEach((book, index) => {
            if (book.isbn === isbn) books.splice(index, 1);
        });

        sessionStorage.setItem('books', JSON.stringify(books));
    }
};

document.addEventListener('DOMContentLoaded', UI.displayBooks);

document.querySelector('#book-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;

    if (title === '' || author === '' || isbn === '') UI.showAlert('Please fill in all fields', 'alert-danger');
    else {
        const book = new Book(title, author, isbn);
        UI.addBookToList(book);
        Store.addBook(book);

        UI.showAlert('Book Added', 'alert-success')
        document.getElementById('book-form').reset();
    }
});

document.querySelector('#book-list').addEventListener('click', e => {
    UI.deleteBook(e.target);
    Store.deleteBook(e.target.parentElement.previousElementSibling.textContent);

    UI.showAlert('Book Deleted', 'alert-warning');
});