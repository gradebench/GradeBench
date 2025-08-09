import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { PORT } from "./config/env.js";

const app = new Hono<{
  Variables: {
    mesage: string;
  };
}>();

app.get("/", (c) => {
  return c.json({});
});

app.notFound((c) => {
  return c.text("Custom 404 message", 404);
});

app.onError((err, c) => {
  console.log(err.name);
  return c.json(
    {
      error: {
        message: err.message,
        cause: err.cause!,
        name: err.name,
      },
    },
    500
  );
});

const server = serve(
  {
    fetch: app.fetch,
    port: PORT as unknown as number,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);

process.on("SIGINT", () => {
  server.close();
  process.exit(0);
});

process.on("SIGTERM", () => {
  server.close((err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    process.exit(0);
  });
});

export default app;
