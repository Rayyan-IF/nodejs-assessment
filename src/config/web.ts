import express from "express";
import cookieParser from "cookie-parser";
import {publicRouter} from "../route/public-api.js";
import { errorMiddleware } from "../middleware/error-middleware.js";
import { notFoundMiddleware } from "../middleware/not-found-middleware.js";
import { requestLoggingMiddleware } from "../middleware/request-logging-middleware.js";

export const web = express();

web.use(express.json());
web.use(cookieParser());
web.use(requestLoggingMiddleware);
web.use(publicRouter);
web.use(notFoundMiddleware);
web.use(errorMiddleware);