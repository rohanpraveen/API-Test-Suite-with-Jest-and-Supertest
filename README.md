

## API Test Suite with Jest and Supertest

### Project Overview

This repository contains **API test suites for Product and Health endpoints** using Jest and Supertest.
The main aim is to validate functionality, robustness, error handling, and proper API responses under various scenarios.

---

### Features

* Comprehensive API tests (GET, PUT, DELETE)
* Validation and Error Handling (400, 405, 404, 403, 401)
* Security Tests (SQL injection, XSS)
* Business Logic Validation (conflicts, invalid IDs, invalid data)
* Rate Limit and Concurrent Operations Tests (load and robustness)

---

### Tech Stack

* Jest — testing framework
* Supertest — for making API requests
* Node.js — API under test
* JavaScript (with or without TypeScript)

---

### Installation

```bash
git clone <your-repo-name>
cd <your-repo-name>
npm install
```

---

### How To Run Tests

**To run all tests:**

```bash
npm test
```

**To watch files and rerun upon code change:**

```bash
npm test -- --watch
```

**To run a single test file:**

```bash
npm test src/tests/products.delete.test.js
```

---



### What This Tests

* Proper response codes (200, 204, 400, 401, 403, 405, 409, 414, 429)
* Security sanitization (against SQL injection, XSS)
* Validation for invalid IDs, invalid fields, invalid data, or invalid authorization
* Proper error messages, fallback handlers, and robustness under heavy load

---

