process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const sendPasswordResetEmail = async (user, resetToken) => {
  try {
    // Verificar que las variables de entorno estén configuradas
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD || !process.env.CLIENT_URL) {
      throw new Error('Las variables de entorno no están configuradas correctamente.');
    }

    // Verificar que user.email y resetLink estén definidos
    if (!user || !user.email || !resetToken) {
      throw new Error('Correo electrónico del usuario o enlace de restablecimiento no definidos.');
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    const mailOptions = {
      from: 'pdfcursos71@gmail.com',
      to: user.email,
      subject: 'Restablecimiento de contraseña',
      html: `
        <p>Hola ${user.first_name},</p>
        <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>Este enlace expirará en 1 hora.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('Correo de restablecimiento de contraseña enviado correctamente.');
  } catch (error) {
    console.error('Error al enviar el correo de restablecimiento de contraseña:', error.message);
    throw error;
  }
};

export { sendPasswordResetEmail };



export const sendInactiveUserEmail = async (email) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Eliminación de cuenta por inactividad',
      text: 'Tu cuenta ha sido eliminada debido a la inactividad. Puedes volver a registrarte en cualquier momento.',
    };

    await transporter.sendMail(mailOptions);
    console.log('Correo enviado con éxito.');
  } catch (error) {
    console.error('Error al enviar el correo:', error);
  }
};
