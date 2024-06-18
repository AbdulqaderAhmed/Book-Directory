import { error } from "elysia";
import { validateToken } from "../middleware/tokenVlidation";
import { uploadFile } from "../middleware/uploadFile";

export const getAllBook = async ({
  set,
  Book,
  query: { p, limit },
}: {
  set: any;
  Book: any;
  query: { p: number; limit: number };
}) => {
  const page = p || 0;
  const booksPerPage = limit || 0;
  try {
    const book = await Book.find()
      .sort({ createdAt: -1 })
      .skip(page * booksPerPage)
      .limit(booksPerPage)
      .exec();

    return { page, booksPerPage, books: book };
  } catch (error: any) {
    set.status = 500;
    return {
      error: error.message,
    };
  }
};

export const getBook = async ({
  set,
  Book,
  params: { id },
}: {
  set: any;
  Book: any;
  params: any;
}) => {
  try {
    const book = await Book.findById(id);
    if (!book) {
      set.status = 404;
      throw new Error("No such blog found!");
    }

    return {
      book,
    };
  } catch (error: any) {
    set.status = 500;
    return {
      error: error.message,
      stack: error.stack,
    };
  }
};

export const createBook = async ({
  set,
  Book,
  body,
  lucia,
  headers,
}: {
  set: any;
  Book: any;
  lucia: any;
  headers: any;
  body: any;
}) => {
  const {
    book_name,
    author_one,
    author_two,
    publisher,
    language,
    paperback,
    isbn_10,
    about_book,
    about_author,
    price,
    book_cover,
  } = body;
  try {
    const userToken = await validateToken(headers, lucia, set);

    if (book_cover) {
      const bookCoverName = await uploadFile(book_cover, set);

      Bun.file(
        await Bun.write("./public/uploads/" + bookCoverName, book_cover)
      );

      const newBook = await Book.create({
        user_id: userToken.session.userId,
        book_name,
        author_one,
        author_two,
        publisher,
        language,
        paperback,
        isbn_10,
        about_book,
        about_author,
        price,
        book_cover: bookCoverName,
      });

      set.status = 201;
      return {
        blog: newBook,
      };
    }

    const newBook = await Book.create({
      user_id: userToken.session.userId,
      book_name,
      author_one,
      author_two,
      publisher,
      language,
      paperback,
      isbn_10,
      about_book,
      about_author,
      price,
    });

    set.status = 201;
    return {
      blog: newBook,
    };
  } catch (error: any) {
    set.status = 500;
    return {
      error: error.message,
      stack: error.stack,
    };
  }
};

export const updateBook = async ({
  set,
  params: { id },
  Book,
  body,
  lucia,
  headers,
}: {
  set: any;
  params: any;
  body: any;
  Book: any;
  lucia: any;
  headers: any;
}) => {
  const {
    book_name,
    author_one,
    author_two,
    publisher,
    language,
    paperback,
    isbn_10,
    about_book,
    about_author,
    price,
    book_cover,
  } = body;

  try {
    const userToken = await validateToken(headers, lucia, set);

    const bookInfo = await Book.findById(id);

    if (!bookInfo && id !== bookInfo?._id) {
      set.status = 404;
      throw new Error("Blook not found!");
    }

    if (bookInfo.user_id.toString() !== userToken.user.id.toString()) {
      set.status = 401;
      throw new Error("You are not allowed to update this blog");
    }

    if (book_cover) {
      const bookCoverName = await uploadFile(book_cover, set);

      Bun.file(
        await Bun.write("./public/uploads/" + bookCoverName, book_cover)
      );

      const newBook = await Book.findByIdAndUpdate(
        id,
        {
          $set: {
            book_name,
            author_one,
            author_two,
            publisher,
            language,
            paperback,
            isbn_10,
            about_book,
            about_author,
            price,
            book_cover: bookCoverName,
          },
        },
        { new: true }
      );

      set.status = 201;
      return {
        blog: newBook,
      };
    }

    const newBook = await Book.findByIdAndUpdate(
      id,
      {
        $set: {
          book_name,
          author_one,
          author_two,
          publisher,
          language,
          paperback,
          isbn_10,
          about_book,
          about_author,
          price,
        },
      },
      { new: true }
    );

    set.status = 201;
    return {
      book: newBook,
    };
  } catch (error: any) {
    set.status = 500;
    return {
      error: error.message,
      stack: error.stack,
    };
  }
};

export const deleteBook = async ({
  set,
  params: { id },
  Book,
  lucia,
  headers,
}: {
  set: any;
  params: any;
  Book: any;
  lucia: any;
  headers: any;
}) => {
  try {
    const userToken = await validateToken(headers, lucia, set);
    const bookInfo = await Book.findById(id);

    if (!bookInfo && id !== bookInfo?._id) {
      set.status = 404;
      return {
        error: "Blog not found!",
      };
    }

    if (bookInfo.user_id.toString() !== userToken.user.id.toString()) {
      set.status = 401;
      return {
        error: "You are not allowed to delete this book",
      };
    }

    await Book.findByIdAndDelete(id);
    set.status = 202;

    const book = await Book.find();
    return {
      books: book,
    };
  } catch (error: any) {
    set.status = 500;
    return {
      error: error.message,
    };
  }
};

export const searchBook = async ({
  set,
  query: { q },
  Book,
}: {
  set: any;
  query: any;
  Book: any;
}) => {
  try {
    const book = await Book.find({
      book_name: { $regex: q, $options: "i" },
    });

    return {
      books: book,
    };
  } catch (error: any) {
    set.status = 500;
    return {
      error: error.message,
      stack: error.stack,
    };
  }
};
