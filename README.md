# VRV Security RBAC Project

This project implements a Role-Based Access Control (RBAC) system using Node.js, Express, and MongoDB. It includes user authentication, authorization, and role management. The system ensures that users can be authenticated properly, assigned roles, and granted access based on those roles.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [API Endpoints](#api-endpoints)
- [Database Models](#database-models)
- [Middleware](#middleware)
- [Testing](#testing)
- [License](#license)

## Features

- **User Registration and Login:** Securely register and log in users.
- **Role-Based Access Control (RBAC):** Manage user roles and permissions.
- **JSON Web Token (JWT) Authentication:** Secure user sessions using JWTs.
- **Secure Password Hashing:** Passwords are hashed using bcrypt.

## Installation

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/yourusername/vrv-security-rbac.git
   cd rbac-dashboard-backend
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Set Up Environment Variables:**
   Create a `.env` file in the root directory with the following content:
   ```env
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/vrv-security
   JWT_SECRET=your_generated_jwt_secret_key
   ```

4. **Run the Application:**
   ```bash
   npm start
   ```
   Alternatively, for development with automatic restarts:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication

- **POST /api/auth/register**
  - **Description:** Register a new user.
  - **Request Body:**
    ```json
    {
        "username": "testuser",
        "password": "testpassword",
        "roles": ["User"]
    }
    ```
  - **Response:**
    ```json
    {
        "_id": "user_id",
        "username": "testuser",
        "roles": ["role_id"],
        "__v": 0
    }
    ```

- **POST /api/auth/login**
  - **Description:** Log in and get a JWT token.
  - **Request Body:**
    ```json
    {
        "username": "testuser",
        "password": "testpassword"
    }
    ```
  - **Response:**
    ```json
    {
        "token": "your_jwt_token"
    }
    ```

### User Routes

- **GET /api/user/profile**
  - **Description:** Get user profile (requires authentication).
  - **Headers:**
    - `Authorization: Bearer your_jwt_token`
  - **Response:**
    ```json
    {
        "_id": "user_id",
        "username": "testuser",
        "roles": ["role_id"],
        "__v": 0
    }
    ```

- **GET /api/user/admin-only**
  - **Description:** Admin-only route (requires Admin role).
  - **Headers:**
    - `Authorization: Bearer your_jwt_token`
  - **Response (if authorized):**
    ```json
    {
        "message": "Welcome Admin"
    }
    ```
  - **Response (if not authorized):**
    ```json
    {
        "error": "Access denied"
    }
    ```

## Database Models

### Role Model

Defines the structure of roles in the database.

```javascript
const RoleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    permissions: [{
        type: String,
        required: true,
    }],
});
```

### User Model

Defines the structure of users in the database.

```javascript
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    roles: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role',
    }],
});
```

## Middleware

### Authentication Middleware

Ensures that users are authenticated and their roles are populated.

```javascript
const auth = async (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).populate('roles');
        if (!user) {
            throw new Error();
        }
        req.user = user;
        req.token = token;
        next();
    } catch (err) {
        res.status(401).send({ error: 'Please authenticate.' });
    }
};
```

## Testing

You can test the API endpoints using tools like Postman or cURL. Here are some example cURL commands:

1. **Register a New User:**
   ```bash
   curl -X POST http://localhost:3000/api/auth/register -H "Content-Type: application/json" -d '{"username": "testuser", "password": "testpassword", "roles": ["User"]}'
   ```

2. **Login and Get a JWT Token:**
   ```bash
   curl -X POST http://localhost:3000/api/auth/login -H "Content-Type: application/json" -d '{"username": "testuser", "password": "testpassword"}'
   ```

3. **Get User Profile:**
   ```bash
   curl -X GET http://localhost:3000/api/user/profile -H "Authorization: Bearer your_jwt_token"
   ```

4. **Admin-Only Route:**
   ```bash
   curl -X GET http://localhost:3000/api/user/admin-only -H "Authorization: Bearer your_jwt_token"
   ```
