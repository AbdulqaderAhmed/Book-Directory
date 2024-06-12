import { Elysia } from "elysia";
import {
  createBook,
  deleteBook,
  getAllBook,
  getBook,
  searchBook,
  updateBook,
} from "../controller/book.controller";

export const bookRoute = new Elysia({ prefix: "api/book" })
  .get("/", getAllBook)
  .post("/", createBook)
  .get("/id/:id", getBook)
  .put("/id/:id", updateBook)
  .delete("/id/:id", deleteBook)
  .get("/search", searchBook);
