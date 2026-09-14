import path from "node:path";

import express from "express";

import { PORT } from "./config.js";
import { convertRouter } from "./routes/convert.js";
import { docsRouter } from "./routes/docs.js";
import { fetchRouter } from "./routes/fetch.js";
import { searchRouter } from "./routes/search.js";
import { settingsRouter } from "./routes/settings.js";

const app = express();
app.use(express.json());
app.use(express.static(path.resolve(import.meta.dirname, "../public")));
app.use(searchRouter, docsRouter, convertRouter, fetchRouter, settingsRouter);

app.listen(PORT, "127.0.0.1");
