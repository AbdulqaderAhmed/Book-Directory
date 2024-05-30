import { Elysia } from "elysia";
import { login, logout, register } from "../controller/auth.controller";

export const authRoute = new Elysia({ prefix: "api/auth" })
  .post("/register", register)
  .post("/login", login)
  .get("/logout", logout);
