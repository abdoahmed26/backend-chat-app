# Chat App API

A Chat App APIs implemented with (Node.js, Express.js, MongoDB)




## Follow Me
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue?style=flat&logo=linkedin&labelColor=blue)](https://www.linkedin.com/in/abdo-ahmed-67185a28a?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app)
 [![GitHub](https://img.shields.io/badge/GitHub-Follow-black?style=flat&logo=github&labelColor=black)](https://github.com/abdoahmed26)





## Table of content
- [Installation](#Installation)
- [Usage](#Usage)
- [Tech Stack](#Tech-Stack)
- [Features](#Features)

## Installation

1-Clone the repo 

```bash
git clone https://github.com/abdoahmed26/backend-chat-app.git
cd backend-chat-app
```
2-Install dependencies

```bash
  npm install
```
3- Setup environment variables
```env
DATABASE_URL = your database url

JWT_SCRET_KEY = random value

PORT = your port ex(5000)

FRONT_END_URL = your base url ex (http://localhost:5173)

USER = your user account gmail for sending emails

PASS = your password account gmail for sending emails

```
## Usage

```bash
npm run dev
```


## Tech Stack
- **Node.js**: JavaScript runtime built on Chrome's V8 JavaScript engine.
- **Express**: Web application framework for Node.js.
- **MongoDB**: NoSQL database.
- **Mongoose**: ODM for MongoDB and Node.js.
- **Multer**: Middleware for handling multipart/form-data,   primarily used for file uploads.
- **Dotenv**: Module to load environment variables from a .env file.
- **CORS**: Middleware to enable CORS.
- **Bcrypt**: Library to hash passwords.
- **Nodemailer**: Library for sending email
- **Jsonwebtoken**: Library for sign and verify token 
- **Socket io**: Library that enables real-time, bidirectional communication between clients.


## Features

- **User Management** 
    - user can register new account or use  his google account
    - user can login 
    - user can update his (personal infos, email, profile image, password)
    - user can reset his password in case of forgotten 
- **Messages**
    - user cant send message to other users
    - message can be text or photo or video
    - user can see online users
    - user can know whether the other user saw his message or not
    - user can know the time when the message was sent
    - user can get all his previous messages