# 📈 Auth-Core Development Plan — Phased Approach

## 🧱 Phase 1: Project Setup & Structure

**Objective:** Establish project foundation, tooling, and folder structure.

### ✅ Tasks:

* Initialize NPM project with `package.json`
* Setup TypeScript or JSDoc for type safety
* Create folder structure:
  * `strategies/`
  * `middlewares/`
  * `utils/`
  * `types/`
* Setup GitHub repository and `.gitignore`
* Setup ESLint, Prettier, and commit hooks (optional)
* Add test framework (e.g., Jest or Vitest)

**Deliverables:**
* Clean, scaffolded repo with dev tooling
* Empty but structured files for core modules

---

## 🔐 Phase 2: Core Authentication Logic

**Objective:** Build internal logic for email/password and phone/OTP strategies.

### ✅ Tasks:

* Implement `emailPassword` strategy:
  * Accept injected `findUserByEmail` and password verifier
* Implement `phoneOtp` strategy:
  * Accept `onOtpRequest`, `verifyOtp` functions
  * Provide OTP generator utility (length/charset config)
* Implement configuration schema with:
  * `serializeUser`
  * `generateTokenPayload`

**Deliverables:**
* Working core strategies for login
* Basic request validation
* Configuration injection with error handling

---

## 🌐 Phase 3: Token and Cookie Handling

**Objective:** Add support for JWT and optional cookie-based sessions.

### ✅ Tasks:

* Implement token creation using injected payload builder
* Implement token verification
* Support tokens via:
  * `Authorization` header
  * Optional `HttpOnly` cookie
* Add expiration config

**Deliverables:**
* Fully working token/cookie system
* Secure default settings (e.g., `httpOnly`, `secure`)

---

## 🔄 Phase 4: Middleware Engine

**Objective:** Build dynamic middleware system to support extendable auth data layers.

### ✅ Tasks:

* Implement core `auth.middleware({ include })`
* Add `attachUser` middleware
* Add `attachRole` and `attachOrg` (as examples)
* Compose middleware based on `include` config

**Deliverables:**
* Flexible, composable middleware system
* Dynamic route protection with custom extensions

---

## 🔗 Phase 5: OAuth Strategy Integration

**Objective:** Add third-party login support using Passport.js.

### ✅ Tasks:

* Setup Passport.js
* Create reusable wrapper for strategies
* Implement:
  * Google strategy
  * GitHub strategy
  * Apple strategy (optional for later)
* Handle callback and delegate to `oauthCallbackHandler`

**Deliverables:**
* Plug-and-play third-party login
* Clear callback interface for host logic injection

---

## ⚙️ Phase 6: Final Configuration & Hook System

**Objective:** Finalize all customizable behavior.

### ✅ Tasks:

* Finalize `initialize()` method for injecting all config
* Support hook validation (required vs optional)
* Ensure backward compatibility and defaults

**Deliverables:**
* Stable configuration API
* Runtime errors for missing critical hooks
* Typed interfaces (optional in TS projects)

---

## 📘 Phase 7: Documentation & Examples

**Objective:** Create clear documentation for development and usage.

### ✅ Tasks:

* Write internal dev docs for contributors
* Write README for consumers:
  * Initialization
  * Strategy usage
  * Middleware usage
  * Configuration guide
* Add example project (optional)

**Deliverables:**
* Complete developer and user documentation
* Optional working demo for integration testing

---

## 🧪 Phase 8: Testing & Packaging

**Objective:** Validate library with unit and integration tests.

### ✅ Tasks:

* Add unit tests for:
  * Strategies
  * Token logic
  * Middleware
* Add mock tests for OAuth
* Test integration in real Express app

**Deliverables:**
* ≥80% test coverage
* Working `npm pack` or `npm publish` pipeline
* CI/CD setup (optional)
