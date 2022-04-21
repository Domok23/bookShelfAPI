/* eslint-disable linebreak-style */
const { nanoid } = require('nanoid');
const books = require('./books');

// Kriteria 1 : API dapat menyimpan buku
const addBookHandler = (request, h) => {
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  let finishied = false;

  if (readPage === pageCount) {
    finishied = true;
  }

  if (reading === true) {
    finishied = false;
  }

  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Nama tidak boleh kosong',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Jumlah halaman yang dibaca tidak boleh lebih besar dari jumlah halaman buku',
    });
    response.code(400);
    return response;
  }

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finishied,
    reading,
    insertedAt,
    updatedAt,
  };

  books.push(newBook);

  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};

// Kriteria 2 : API dapat menampilkan seluruh buku
const getAllBooksHandler = (request, h) => {
  const { name } = request.query;

  let filterBook = books;

  if (name) {
    filterBook = books.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));
  }

  const response = h.response({
    status: 'success',
    data: {
      books: filterBook.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      })),
    },
  });
  response.code(200);
  return response;
};

// Kriteria 3 : API dapat menampilkan detail buku
const getBookByIdHandler = (request, h) => {
  const { id } = request.params;

  const book = books.filter((b) => b.id === id)[0];

  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

// Kriteria 4 : API dapat mengubah data buku
const editBookByIdHandler = (request, h) => {
  const { id } = request.params;

  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

  const updatedAt = new Date().toISOString();
  const index = books.findIndex((book) => book.id === id);
  let finishied = false;

  if (readPage === pageCount) {
    finishied = true;
  }

  if (reading === true) {
    finishied = false;
  }

  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal mengubah buku. Nama tidak boleh kosong',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal mengubah buku. Jumlah halaman yang dibaca tidak boleh lebih besar dari jumlah halaman buku',
    });
    response.code(400);
    return response;
  }

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finishied,
      reading,
      updatedAt,
    };

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal perbaharui. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

// Kriteria 5 : API dapat menghapus buku
const deleteBookByIdHandler = (request, h) => {
  const { id } = request.params;

  const index = books.findIndex((book) => book.id === id);

  if (index !== -1) {
    books.splice(index, 1);

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
