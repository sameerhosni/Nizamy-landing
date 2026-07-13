import path from "node:path";
import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

// When STATIC_DIR is set (e.g. in the Docker image), serve the built web
// frontend and fall back to index.html for client-side routing.
const staticDir = process.env["STATIC_DIR"];
if (staticDir) {
  const staticRoot = path.resolve(staticDir);
  app.use(express.static(staticRoot));
  app.get(/^\/(?!api(\/|$)).*/, (_req, res) => {
    res.sendFile(path.join(staticRoot, "index.html"));
  });
}

export default app;
