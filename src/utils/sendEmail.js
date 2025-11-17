const nodemailer = require("nodemailer");
const { resetPasswordTemplate } = require("../controllers/templateController");
// Agora o template está acessível aqui se você quiser usá-lo

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE === "true", // Adicionado para configurar a segurança (TLS/SSL)
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `Equipe API <${process.env.EMAIL_FROM}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html, // Recebe o HTML montado
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
