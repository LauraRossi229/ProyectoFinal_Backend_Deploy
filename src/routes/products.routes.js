import { Router } from "express";
import passport from "passport";
import {
  getProducts,
  getProduct,
  deleteProduct,
  putProduct,
  postProduct,
} from "../controllers/products.controllers.js";
import { passportError, authorization } from "../utils/messageError.js";


const productosRouter = Router();

productosRouter.get("/", getProducts);

productosRouter.get("/:id", getProduct);

productosRouter.put(
  "/:id",
  passportError("jwt"),
  authorization("admin"),
  putProduct
);

productosRouter.delete(
  "/:id",
  passportError("jwt"),
  authorization("admin", "premium"),
  deleteProduct
);

productosRouter.post(
  "/",
passportError("jwt"),
authorization("admin", "premium"),
  postProduct
);

export default productosRouter;
