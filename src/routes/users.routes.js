import { resetPassword } from '../controllers/users.controllers.js';
import { changeUserRole, deleteInactiveUsers } from '../controllers/users.controllers.js';


import { Router } from "express";
import {
  getUsers,
  getUserbyId,
  putUser,
  deleteUser,
  uploadDocument,
} from "../controllers/users.controllers.js";
import { requestPasswordReset } from "../controllers/users.controllers.js";
import { authorization, passportError } from "../utils/messageError.js";
import multer from "multer";


const userRouter = Router();

userRouter.get("/", passportError("jwt"), authorization("admin"), getUsers);

userRouter.get(
  "/:id",
  passportError("jwt"),
  authorization("admin","user"),
  getUserbyId
);

userRouter.put("/:id", passportError("jwt"), authorization("admin"), putUser);

userRouter.delete(
  "/:id",
  passportError("jwt"),
  authorization("admin"),
  deleteUser
);

userRouter.delete(
  "/",
  passportError("jwt"),
  authorization("admin"),
  deleteInactiveUsers
);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { type } = req.body;

    let folder;
    if (type === "profile") {
      folder = "profiles";
    } else if (type === "product") {
      folder = "products";
    } else {
      folder = "documents";
    }

    cb(null, `uploads/${folder}`);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

// Middleware de carga con manejo de errores
const uploadMiddleware = upload.array("files");
userRouter.post("/:id/documents", (req, res, next) => {
  uploadMiddleware(req, res, (err) => {
    if (err) {
      return res.status(500).send({ error: "Error al subir archivos", details: err.message });
    }
    next();
  });
}, uploadDocument);




userRouter.post("/:id/documents", upload.array("files"), uploadDocument);

userRouter.post("/reset-password", requestPasswordReset);
userRouter.post("/reset-password/:token", resetPassword);
//userRouter.put("/premium/:uid", changeUserRole);//


export default userRouter;
