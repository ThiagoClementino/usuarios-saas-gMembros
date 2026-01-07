# API de Autenticação e Gerenciamento de Usuários (gMembros)

Este projeto é uma **API RESTful** robusta, desenvolvida para gerenciar autenticação e dados de usuários, ideal para aplicações SaaS (Software as a Service). Ele oferece funcionalidades completas de registro, login, recuperação de senha e gerenciamento de usuários, utilizando um banco de dados **MongoDB**.

## Tecnologias Utilizadas

O projeto foi construído com as seguintes tecnologias:

*   **Node.js**: Ambiente de execução JavaScript server-side.
*   **Express.js**: Framework web para Node.js, utilizado para construir a API.
*   **Mongoose**: Biblioteca de modelagem de objetos para MongoDB, facilitando a interação com o banco de dados.
*   **MongoDB**: Banco de dados NoSQL, utilizado para armazenar os dados da aplicação.
*   **bcryptjs**: Biblioteca para hash de senhas, garantindo a segurança das credenciais dos usuários.
*   **jsonwebtoken (JWT)**: Para geração e verificação de tokens de autenticação, permitindo acesso seguro às rotas protegidas.
*   **Nodemailer**: Módulo para envio de e-mails, utilizado na funcionalidade de recuperação de senha.
*   **dotenv**: Para carregar variáveis de ambiente de um arquivo `.env`, mantendo configurações sensíveis fora do controle de versão.
*   **CORS**: Middleware para Express.js, habilitando o Cross-Origin Resource Sharing.
*   **Nodemon**: Ferramenta que ajuda no desenvolvimento de aplicações Node.js, reiniciando automaticamente o servidor a cada alteração de arquivo.

## Funcionalidades

A API oferece as seguintes funcionalidades principais:

### Autenticação e Autorização

*   **`POST /api/auth/register`**: Registra um novo usuário no sistema.
*   **`POST /api/auth/login`**: Autentica um usuário e retorna um token JWT.
*   **`POST /api/auth/forgotpassword`**: Inicia o processo de recuperação de senha, enviando um e-mail com um link de reset.
*   **`PUT /api/auth/resetpassword/:token`**: Redefine a senha do usuário usando um token de recuperação.
*   **`GET /api/auth/me`**: Retorna os dados do usuário autenticado (requer token JWT).

### Gerenciamento de Usuários

*   **`GET /api/users`**: Lista todos os usuários cadastrados (requer token JWT).

## Pré-requisitos

Antes de começar, certifique-se de ter as seguintes ferramentas instaladas em sua máquina:

*   **Node.js**: Versão 14.x ou superior. Você pode baixá-lo em [nodejs.org](https://nodejs.org/).
*   **npm** (Node Package Manager) ou **Yarn**: Gerenciadores de pacotes que vêm com o Node.js.
*   **MongoDB**: Uma instância do MongoDB (local ou via MongoDB Atlas) para o armazenamento dos dados.
*   **Git**: Para clonar o repositório.

## Instalação e Execução

Siga os passos abaixo para configurar e rodar o projeto localmente:

1.  **Clone o repositório**:

    ```bash
    git clone https://github.com/ThiagoClementino/usuarios-saas-gMembros.git
    cd usuarios-saas-gMembros
    ```

2.  **Instale as dependências**:

    ```bash
    npm install
    # ou
    yarn install
    ```

3.  **Configuração das Variáveis de Ambiente**:

    Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

    ```ini
    NODE_ENV=development
    PORT=5000
    MONGO_URI=sua_string_de_conexao_mongodb
    JWT_SECRET=seu_segredo_jwt_muito_forte
    JWT_EXPIRE=30d
    JWT_COOKIE_EXPIRE=30
    
    # Configurações para Nodemailer (exemplo com Gmail)
    EMAIL_FROM=seuemail@gmail.com
    EMAIL_PASSWORD=sua_senha_de_aplicativo_gmail
    ```

    *   Substitua `sua_string_de_conexao_mongodb` pela URL de conexão do seu banco de dados MongoDB (local ou Atlas).
    *   `seu_segredo_jwt_muito_forte` deve ser uma string complexa e única.
    *   Para `EMAIL_PASSWORD` no Gmail, você precisará gerar uma [senha de aplicativo](https://support.google.com/accounts/answer/185833?hl=pt-BR) em suas configurações de segurança do Google.

4.  **Execute a aplicação**:

    Para iniciar o servidor em modo de desenvolvimento (com `nodemon` para recarga automática):

    ```bash
    npm run dev
    ```

    Para iniciar a aplicação em modo de produção:

    ```bash
    npm start
    ```

    A API estará disponível em `http://localhost:5000` (ou na porta configurada no `.env`).

## Como Usar

A API expõe endpoints RESTful para gerenciar usuários e autenticação. Você pode usar ferramentas como Postman, Insomnia ou `curl` para interagir com a API.

### Exemplo de Endpoints (com `curl`)

#### Autenticação

*   **Registrar um novo usuário**:

    ```bash
    curl -X POST -H "Content-Type: application/json" -d \'{
        "nomeCompleto": "Fulano de Tal",
        "email": "fulano@example.com",
        "telefone": "(11) 99887-7665",
        "senha": "senhaSegura123"
    }\' http://localhost:5000/api/auth/register
    ```

*   **Login de usuário**:

    ```bash
    curl -X POST -H "Content-Type: application/json" -d \'{
        "email": "fulano@example.com",
        "senha": "senhaSegura123"
    }\' http://localhost:5000/api/auth/login
    ```

    *A resposta incluirá um token JWT que deve ser usado para acessar rotas protegidas.* 

*   **Obter dados do usuário autenticado** (requer token JWT no cabeçalho `Authorization`):

    ```bash
    curl -X GET -H "Authorization: Bearer SEU_TOKEN_JWT_AQUI" http://localhost:5000/api/auth/me
    ```

#### Gerenciamento de Usuários

*   **Listar todos os usuários** (requer token JWT no cabeçalho `Authorization`):

    ```bash
    curl -X GET -H "Authorization: Bearer SEU_TOKEN_JWT_AQUI" http://localhost:5000/api/users
    ```

## Como Contribuir

Contribuições são bem-vindas! Se você deseja contribuir para este projeto, por favor, siga os passos abaixo:

1.  Faça um fork do repositório.
2.  Crie uma nova branch (`git checkout -b feature/sua-feature`).
3.  Faça suas alterações e adicione testes, se aplicável.
4.  Commit suas alterações (`git commit -m \'feat: Adiciona nova funcionalidade\'`).
5.  Envie para a branch (`git push origin feature/sua-feature`).
6.  Abra um Pull Request, descrevendo suas alterações.

## Licença

Este projeto está licenciado sob a licença **ISC**. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---
