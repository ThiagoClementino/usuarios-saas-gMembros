// controllers/templateController.js

exports.resetPasswordTemplate = (username, resetURL) => {
  const year = new Date().getFullYear();

  return `
  <!DOCTYPE html>
  <html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Recuperação de Senha</title>
    <style>
      body { font-family: Arial, Helvetica, sans-serif; background-color: #f4f4f7; margin:0; padding:0;}
      .container{max-width:600px;margin:30px auto;background:#fff;padding:30px;border-radius:8px;border:1px solid #e0e0e0;}
      .header{text-align:center;margin-bottom:20px;}
      .btn { background-color:#1a73e8;color:#fff;padding:12px 18px;text-decoration:none;border-radius:6px;display:inline-block;}
      .footer{font-size:13px;color:#888;margin-top:20px;text-align:center;}
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Recuperação de Senha</h1>
      </div>

      <p>Olá, <strong>${escapeHtml(username)}</strong>,</p>

      <p>Recebemos uma solicitação para redefinir sua senha. Clique no botão abaixo para criar uma nova senha:</p>

      <p style="text-align:center;margin:25px 0;">
        <a href="${resetURL}" class="btn" target="_blank" rel="noopener">Redefinir Senha</a>
      </p>

      <p>Se você não solicitou a alteração, ignore este e-mail. O link expira em X horas.</p>

      <div class="footer">
        <p>© ${year} — Sua Empresa. Todos os direitos reservados.</p>
      </div>
    </div>
  </body>
  </html>
  `;
};

// Pequena função para escapar caracteres perigosos no username
function escapeHtml(unsafe) {
  if (!unsafe && unsafe !== 0) return "";
  return String(unsafe)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
