console.log("Iniciando la aplicación...");
import "dotenv/config";
import jwt from "jsonwebtoken";

export const generateToken = (user) => {
  const token = jwt.sign({ user }, process.env.JWT_SECRET, {
    expiresIn: "12h",
  });

  return token;
};

export const authToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("Authorization Header:", authHeader);

  if (!authHeader) {
    console.error("Error: Usuario no autenticado - No hay encabezado de autorización");
    return res.status(401).send({ error: "Usuario no autenticado" });
  }

  const token = authHeader.split(" ")[1];
  console.log("Token extraído:", token);

  jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
    if (error) {
      console.error("Error en la verificación:", error);
      return res.status(403).send({ error: "Usuario no autorizado, token inválido", details: error.message });
    }
    
    console.log("Token verificado con éxito. Usuario decodificado:", decoded.user);
    req.user = decoded.user;
    next();
  });
};
