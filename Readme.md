# 🔐 Auth-Core — Development Documentation

## Overview

Auth-Core is a reusable authentication library built with Node.js and Express, designed to support multiple authentication strategies such as:

- Email + Password
- Phone Number + OTP
- OAuth logins like Google, Apple, GitHub

It provides token and session handling, but **does not handle database or storage logic directly**. Instead, it allows the host application to inject all storage, lookup, and formatting logic through a flexible configuration interface.

The library is **project-agnostic** and built to be reused without modification across different codebases, regardless of variations in model names (e.g., `User`, `Player`, `AdminAccount`).

---

## Goals

- Provide pluggable authentication for various strategies
- Return JWT tokens and/or set HttpOnly cookies
- Allow custom user models, token payloads, and serialization logic
- Delegate all storage and user-related logic to the consuming project
- Support multiple external login providers with Passport.js
- Offer middleware utilities to attach user data dynamically

---

## Core Features

### Authentication Strategies

- Email and password-based login
- Phone number and OTP-based login
- OAuth login via Google, Apple, GitHub (and extensible to others)
- Optional integration with Passport.js for third-party login providers

### Token & Session Handling

- Generate JWT tokens with fully customizable payloads
- Optional support for HttpOnly cookies for session management
- Token verification via Authorization headers or cookies

### Middleware System

- Middleware to attach authenticated user to request
- Extendable middleware to attach additional information like role, permissions, organization, etc.
- Middleware layers are composable and include only what is needed by the host application

### Configuration-Driven Architecture

- All project-specific logic is injected via config:

  - User lookup
  - OTP handling
  - Token structure
  - OAuth post-login handling

- No assumptions are made about user object structure or database implementation

---

## Customization Hooks

The following hooks must be implemented by the host application and passed to the library during initialization:

- `findUserByEmail`: Retrieve user by email
- `onOtpRequest`: Logic to send/store OTP
- `verifyOtp`: Logic to validate the OTP
- `serializeUser`: Define the user object structure returned from the auth library
- `generateTokenPayload`: Define the structure of the JWT payload
- `oauthCallbackHandler`: Handle user creation or lookup after OAuth login

These hooks give full control to the host project and allow complete decoupling of database logic from the library.

---

## Middleware Capabilities

The middleware system is designed to be dynamic and composable. The host project can specify what data should be included on the request object for each route:

- Attach authenticated user (`req.user`)
- Attach user role (`req.role`)
- Attach organization or tenant info (`req.org`)
- Additional fields can be added as needed in future

Only the required fields will be computed and attached, keeping performance optimal and implementation minimal per route.

---

## Token Payload Flexibility

The JWT token generated by the library will use a payload defined completely by the host project. There are no required or reserved fields like `uid`, `role`, etc. The host project can include any fields using any naming convention.

---

## OAuth Strategy Support

Auth-Core integrates with Passport.js to support multiple third-party login strategies such as Google, Apple, and GitHub. The host project is responsible for handling what happens after a successful login — such as creating or updating a user — through the `oauthCallbackHandler`.

---

## Design Principles

- The package **must not be modified per project**.
- The same package should work across projects with different user model structures.
- All logic differences are handled through injected configuration and callbacks.
- The core package contains only authentication and token/session logic.
- Data fetching, updating, storage, and interpretation are the responsibility of the host project.

---

## Benefits

- Fully decoupled and reusable across multiple codebases
- Minimal and efficient — no DB code inside the package
- Strong separation of concerns
- Easily extensible for new authentication methods or providers
- Zero hardcoded assumptions about user data or project structure

---

## Usage Summary

- Auth-Core is initialized once with a full configuration object.
- The host application defines all custom logic through injectable hooks.
- Routes use composable middlewares and authentication handlers.
- Token and cookie behavior are controlled entirely by configuration.
- OAuth strategies are plugged in without needing code changes in the core library.

---

## Installation

```bash
npm install auth-core
```

## Usage Guide

### Initializing Auth-Core

First, initialize Auth-Core with your configuration:

```javascript
import { initializeAuth } from 'auth-core';

// Initialize with your configuration
initializeAuth({
  // JWT configuration
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: '7d', // Token expiration time
    cookie: {
      enabled: true, // Set to false if you don't want to use cookies
      options: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      },
    },
    // Define what goes into your JWT token
    generateTokenPayload: (user) => ({
      id: user.id,
      email: user.email,
      role: user.role,
    }),
  },

  // Define what user data is returned to the client
  serializeUser: (user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  }),

  // Lookup function to find users by identifier
  findUser: async (identifier, context) => {
    // Your database lookup logic here
    // Example using a hypothetical User model:
    if (context?.strategy === 'emailPassword') {
      return await YourUserModel.findOne({ email: identifier });
    } else if (context?.strategy === 'phoneOtp') {
      return await YourUserModel.findOne({ phone: identifier });
    }
    return null;
  },

  // For OTP authentication
  onOtpRequest: async (phone, otp) => {
    // Your SMS sending logic here
    await YourSmsService.send(phone, `Your verification code is: ${otp}`);
  },

  verifyOtp: async (phone, otp) => {
    // Your OTP verification logic here
    return await YourOtpModel.verify(phone, otp);
  },

  // For email/password authentication
  verifyPassword: async (password, hashedPassword) => {
    // Your password verification logic here
    // Example using bcrypt:
    return await bcrypt.compare(password, hashedPassword);
  },

  // For OAuth authentication
  oauthCallbackHandler: async (profile, provider) => {
    // Your OAuth user creation/lookup logic
    let user = await YourUserModel.findOne({
      [`oauth.${provider}.id`]: profile.id,
    });

    if (!user) {
      // Create new user if not found
      user = await YourUserModel.create({
        name: profile.displayName,
        email: profile.emails[0].value,
        oauth: {
          [provider]: {
            id: profile.id,
            data: profile,
          },
        },
      });
    }

    return user;
  },
});
```

### Using Authentication Middleware

Protect your routes with the authentication middleware:

```javascript
import express from 'express';
import { authMiddleware } from 'auth-core';

const app = express();

// Route protected with authentication - only attaches user
app.get('/profile', authMiddleware({ include: ['user'] }), (req, res) => {
  res.json(req.user);
});

// Route with user and role information
app.get('/admin-dashboard', authMiddleware({ include: ['user', 'role'] }), (req, res) => {
  if (req.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }
  res.json({ message: 'Admin dashboard data' });
});

// Route with user, role, and organization information
app.get('/org-data', authMiddleware({ include: ['user', 'role', 'org'] }), (req, res) => {
  res.json({
    user: req.user,
    role: req.role,
    organization: req.org,
  });
});
```

### Email/Password Authentication

To implement email and password authentication:

```javascript
import express from 'express';
import { loginWithEmailPassword } from 'auth-core';

const app = express();
app.use(express.json());

// Email/Password login
app.post('/auth/login', loginWithEmailPassword);
```

The `loginWithEmailPassword` handler expects a request body with:

- `email`: User's email address
- `password`: User's plain text password

The handler will:

1. Find the user using your `findUser` hook with strategy 'emailPassword'
2. Verify the password using your `verifyPassword` hook
3. Issue a JWT token and return the serialized user data

Example response:

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "123",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

### Phone OTP Authentication

To implement phone number with OTP verification:

```javascript
import express from 'express';
import { sendOtp, verifyOtp } from 'auth-core';

const app = express();
app.use(express.json());

// Request OTP
app.post('/auth/otp/request', async (req, res) => {
  try {
    const { phone } = req.body;
    await sendOtp(phone);
    res.json({ message: 'OTP sent successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Verify OTP and login
app.post('/auth/otp/verify', async (req, res) => {
  try {
    const { phone, otp } = req.body;
    const { user, token } = await verifyOtp(phone, otp);
    res.json({ user, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
```

### Extending With Custom Middleware

You can create your own middleware to attach additional data:

```javascript
// Create a custom middleware in your application
const attachCustomData = (req, res, next) => {
  if (req.user) {
    // Fetch additional data based on the user
    req.customData = {
      /* your custom data */
    };
  }
  next();
};

// Use it after auth middleware
app.get('/custom-route', authMiddleware({ include: ['user'] }), attachCustomData, (req, res) => {
  res.json({
    user: req.user,
    customData: req.customData,
  });
});
```

For more detailed information and advanced use cases, please refer to the API documentation.
