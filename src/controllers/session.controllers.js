import { generateToken, authToken } from "../utils/jwt.js";

export const postLogin = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).send({ mensaje: "Usuario invalido" });
    }
      
    
    // Actualiza last_connection al momento del login
      req.user.last_connection = new Date();
      await req.user.save();
  

    const token = generateToken(
      req.user
    ); /* esto para trabajar la sesion con jwt */

    /*     res.cookie("jwtCookie", token, {
      maxAge: 43200000, //12horas en ms
    }); */

    res.status(200).send({ token });
  } catch (error) {
    res.status(500).send({ mensaje: `Error al iniciar sesion ${error}` });
  }
};

export const postRegister = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(400).send({ mensaje: "Usuario ya existente" });
    }

    res.status(200).send({ mensaje: "Usuario registrado" });
  } catch (error) {
    res.status(500).send({ mensaje: `Error al registrar usuario ${error}` });
  }
};

export const getGithub = async (req, res) => {
  res.status(200).send({ mensaje: "Usuario registrado" });
};

export const getGihubCallback = async (req, res) => {
  req.session.user = req.user;
  res.status(200).send({ mensaje: "Usuario logueado" });
};

export const getLogout = async (req, res) => {
  try {
    // Verifica si req.user está definido antes de acceder a la propiedad
    if (req.user) {
      req.user.last_connection = new Date();
      await req.user.save();

      res.clearCookie("jwtCookie");
      res.status(200).send({ resultado: "Usuario deslogueado" });
    } else {
      // Si req.user no está definido, devuelve un error
      res.status(401).send({ mensaje: "Usuario no autenticado" });
    }
  } catch (error) {
    res.status(500).send({ mensaje: `Error al desloguear usuario ${error}` });
  }
};

