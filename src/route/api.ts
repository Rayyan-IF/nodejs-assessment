import express from "express";
import {authMiddleware} from "../middleware/auth-middleware.js";
import { CategoryController } from "../controller/category-controller.js";
import { ProductController } from "../controller/product-controller.js";

export const apiRouter = express.Router();
apiRouter.use(authMiddleware);

// Category routes
apiRouter.get("/categories", CategoryController.getAll);
apiRouter.get("/categories/:id", CategoryController.getById);
apiRouter.post("/categories", CategoryController.create);
apiRouter.put("/categories/:id", CategoryController.update);
apiRouter.delete("/categories/:id", CategoryController.delete);

// Product routes
apiRouter.get("/products", ProductController.getAll);
apiRouter.get("/products/:id", ProductController.getById);
apiRouter.post("/products", ProductController.create);
apiRouter.put("/products/:id", ProductController.update);
apiRouter.delete("/products/:id", ProductController.delete);


