import mongoose from "mongoose";

export const Book = mongoose.model(
  "books",
  new mongoose.Schema(
    {
      user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
      },
      book_name: {
        type: String,
        required: true,
      },
      author_one: {
        type: String,
        required: true,
      },
      author_two: {
        type: String,
      },
      publisher: {
        type: String,
        required: true,
      },
      language: {
        type: String,
        required: true,
      },
      paperback: {
        type: String,
        required: true,
      },
      isbn_10: {
        type: String,
        required: true,
      },
      about_book: {
        type: String,
        required: true,
      },
      about_author: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      book_cover: {
        type: String,
        default:
          "https://i.pinimg.com/564x/dd/67/97/dd67971d934cd5c9ad01887b5486481e.jpg",
      },
    },
    { timestamps: true }
  )
);
