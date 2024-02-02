import { userModel } from "../models/users.models.js";
import {sendPasswordResetEmail, sendInactiveUserEmail} from "../utils/mails.js"; // Agrega la función de envío de correos}
import {generateResetToken} from "../utils/passwordReset.js"



export const requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      console.log('Usuario no encontrado:', email);
      return res.status(404).send({ error: "Usuario no encontrado" });
    }

    console.log('Usuario encontrado:', user);

    const resetToken = generateResetToken(user);
    console.log('Token de restablecimiento generado:', resetToken);

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // Expira en 1 hora

    await user.save();

    // Envía el correo electrónico con el enlace para restablecer la contraseña
    await sendPasswordResetEmail(user.email, resetToken);

    return res.status(200).send({ mensaje: "Correo de restablecimiento enviado con éxito" });
  } catch (error) {
    console.log('Error en la solicitud de restablecimiento de contraseña:', error.message);
    return res.status(500).send({ error: `Error en la solicitud de restablecimiento de contraseña: ${error}` });
  }
};


export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const user = await userModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).send({ error: "Enlace no válido o expirado" });
    }

    // Verificar si la nueva contraseña es diferente de la actual
    if (validatePassword(newPassword, user.password)) {
      return res.status(400).send({ error: "No puedes usar la misma contraseña" });
    }

    // Actualizar la contraseña y limpiar los campos de restablecimiento
    user.password = createHash(newPassword);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    return res.status(200).send({ mensaje: "Contraseña restablecida con éxito" });
  } catch (error) {
    return res.status(500).send({ error: `Error en el restablecimiento de contraseña: ${error}` });
  }
};

export const changeUserRole = async (req, res) => {
  const { uid } = req.params;
  const { newRole } = req.body;

  try {
    console.log("User ID:", uid);
    console.log("New Role:", newRole);

    const user = await userModel.findByIdAndUpdate(uid, { rol: newRole }, { new: true });

    if (user) {
      console.log("User Updated:", user);
      return res.status(200).send(user);
    }

    console.log("User Not Found");
    res.status(404).send({ error: "Usuario no encontrado" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({ error: `Error al cambiar el rol del usuario: ${error}` });
  }
};


export const getUsers = async (req, res) => {
  try {
    // Proyección para obtener solo los campos deseados
    const users = await userModel.find({}, 'first_name last_name email rol');

    if (users) {
      return res.status(200).json(users);
    }
    res.status(404).json({ error: "Usuarios no encontrados" });
  } catch (error) {
    res.status(500).json({ error: `Error al consultar los usuarios: ${error}` });
  }
};
export const getUserbyId = async (req, res) => {
  const { id } = req.params;

  try {
    const userId = await userModel.findById(id);

    if (userId) {
      return res.status(200).send(userId);
    }
    res.status(404).send({ error: "Usuario no encontrado" });
  } catch (error) {
    res.status(500).send({ error: `Error en consultar usuario ${error}` });
  }
};


export const putUser = async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, age, email, password } = req.body;

  try {
    const actUser = await userModel.findByIdAndUpdate(id, {
      first_name,
      last_name,
      age,
      email,
      password,
    });

    if (actUser) {
      return res.status(200).send(actUser);
    }
    res.status(404).send({ error: "Usuario no encontrado" });
  } catch (error) {
    res.status(500).send({ error: `Error en actualizar el usuario ${error}` });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await userModel.findByIdAndDelete(id);
    if (user) {
      res.status(200).send({ user });
    } else {
      res.status(404).send({ error: "Error en eliminar usuario" });
    }
  } catch (error) {
    res.status(400).send({ error: "Error en eliminar usuario" });
  }
};
export const uploadDocument = async (req, res) => {
  console.log("Entrando en la función uploadDocument");
  try {
    const { id } = req.params;
    const files = req.files;

    const user = await userModel.findById(id);

    if (!user) {
      return res.status(404).send({ message: "Usuario no encontrado" });
    }

    // Usa un bucle asíncrono para permitir el uso de 'await' dentro del bucle
    for (const file of files) {
      const newDocument = {
        name: file.originalname,
        reference: `uploads/documents/${file.filename}`,
      };

      console.log("Nuevo documento a guardar - Nombre:", newDocument.name);
  console.log("Nuevo documento a guardar - Referencia:", newDocument.reference);

      console.log("Nuevo documento a guardar:", newDocument);

      // No uses 'await' aquí porque el método 'push' no es asíncrono
      user.documents.push(newDocument);
    }

    // Guarda el usuario después de agregar documentos
    await user.save();

    res.status(200).json({ message: "Documentos subidos con éxito" });
  } catch (error) {
    console.error("Error al subir documentos:", error);
    res
      .status(500)
      .send({ message: "Error interno del servidor", error: error.message });
  }
};

export const deleteInactiveUsers = async (req, res) => {
  try {
    // Obtener la fecha actual
    const currentDate = new Date();

    // Definir el límite de inactividad (30 minutos en este ejemplo) Esto se uso para las pruebas.
   // const inactivityLimit = new Date(currentDate - 30 * 60000); 

    // Definir el límite de inactividad de 48 horas.
    const inactivityLimit = new Date(currentDate.getTime() - 2 * 24 * 60 * 60 * 1000);


    // Encontrar usuarios inactivos
    const inactiveUsers = await userModel.find({
      last_connection: { $lt: inactivityLimit },
    });

    // Enviar correos electrónicos y eliminar usuarios
    for (const user of inactiveUsers) {
      await sendInactiveUserEmail(user.email);
      await userModel.findByIdAndDelete(user._id);
    }

    res.status(200).json({ message: 'Usuarios inactivos eliminados exitosamente' });
  } catch (error) {
    res.status(500).json({ error: `Error al eliminar usuarios inactivos: ${error}` });
  }
};
