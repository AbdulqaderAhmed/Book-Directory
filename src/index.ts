import { Elysia } from "elysia";
import { dbConnection } from "./config/dbConnection";
import { Lucia } from "lucia";
import { User, adapter } from "./model/auth.model";
import { authRoute } from "./routes/auth.route";
import { Book } from "./model/book.model";
import { bookRoute } from "./routes/book.route";
import { cors } from "@elysiajs/cors";
import { staticPlugin } from "@elysiajs/static";

dbConnection();

const port: number = Number(Bun.env.SERVER_PORT);

const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: false,
    },
  },
  getUserAttributes: (attributes: any) => {
    return {
      username: attributes.username,
    };
  },
});

const app = new Elysia()
  .use(cors())
  .use(staticPlugin())
  .decorate("lucia", lucia)
  .decorate("User", User)
  .decorate("Book", Book)
  .use(authRoute)
  .use(bookRoute)
  .listen(port);

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);
