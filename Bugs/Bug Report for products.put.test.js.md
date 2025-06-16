
# Bug Report — API: `PUT /api/products/:id`

---

## Bug #1: Should update product with all fields

**Severity:** Medium
**Endpoint:** `PUT /api/products/:id`
**Description:** API should return 200 with updated product, but instead we’re seeing a TypeError — product is undefined.
**Steps to Reproduce:**

* Provide all fields in update
* Perform PUT with a valid product IDs and authentication
  **Expected Result:** 200 OK with updated product
  **Actual Result:** TypeError — response.body.product is undefined
  **Test Case:** src/tests/products.put.test.js (line 45)

---

## Bug #2: Should update only name field

**Severity:** Medium
**Endpoint:** `PUT /api/products/:id`
**Description:** API should return 200 with updated product’s name, but instead we’re seeing TypeError.
**Steps to Reproduce:**

* Provide only `name` in update
* Perform PUT with a valid product IDs and authentication
  **Expected Result:** 200 OK with updated product
  **Actual Result:** TypeError — response.body.product is undefined
  **Test Case:** src/tests/products.put.test.js (line 80)

---

## Bug #3: Should return 400 for invalid price type (string)

**Severity:** Medium
**Endpoint:** `PUT /api/products/:id`
**Description:** API should return 400 Bad Request when price is invalid (string), but instead it’s sending back 200 OK.
**Steps to Reproduce:**

* Provide invalid price (string)
* Perform PUT with a valid product IDs and authentication
  **Expected Result:** 400 Bad Request
  **Actual Result:** 200 OK
  **Test Case:** src/tests/products.put.test.js (line 142)

---

## Bug #4: Should return 400 for negative price

**Severity:** Medium
**Endpoint:** `PUT /api/products/:id`
**Description:** API should return 400 Bad Request when price is invalid (negative), but instead it’s sending back 200 OK.
**Steps to Reproduce:**

* Provide price < 0
* Perform PUT with a valid product IDs and authentication
  **Expected Result:** 400 Bad Request
  **Actual Result:** 200 OK
  **Test Case:** src/tests/products.put.test.js (line 152)

---

## Bug #5: Should return 400 for invalid stock type

**Severity:** Medium
**Endpoint:** `PUT /api/products/:id`
**Description:** API should return 400 Bad Request when stock is invalid (string), but instead it’s sending back 200 OK.
**Steps to Reproduce:**

* Provide invalid stock (string)
* Perform PUT with a valid product IDs and authentication
  **Expected Result:** 400 Bad Request
  **Actual Result:** 200 OK
  **Test Case:** src/tests/products.put.test.js (line 162)

---

## Bug #6: Should return 400 for negative stock

**Severity:** Medium
**Endpoint:** `PUT /api/products/:id`
**Description:** API should return 400 Bad Request when stock is invalid (negative), but instead it’s sending back 200 OK.
**Steps to Reproduce:**

* Provide a negative number for `stock`
* Perform PUT with a valid product IDs and authentication
  **Expected Result:** 400 Bad Request
  **Actual Result:** 200 OK
  **Test Case:** src/tests/products.put.test.js (line 172)

---

## Bug #7: Should return 400 for empty name

**Severity:** Medium
**Endpoint:** `PUT /api/products/:id`
**Description:** API should return 400 Bad Request when `name` is empty, but instead it’s sending back 200 OK.
**Steps to Reproduce:**

* Provide an empty `name`
* Perform PUT with a valid product IDs and authentication
  **Expected Result:** 400 Bad Request
  **Actual Result:** 200 OK
  **Test Case:** src/tests/products.put.test.js (line 182)

---

## Bug #8: Should return 400 for name too long

**Severity:** Medium
**Endpoint:** `PUT /api/products/:id`
**Description:** API should return 400 Bad Request when `name` is too long, but instead it’s sending back 200 OK.
**Steps to Reproduce:**

* Provide a name exceeding maximum length
* Perform PUT with a valid product IDs and authentication
  **Expected Result:** 400 Bad Request
  **Actual Result:** 200 OK
  **Test Case:** src/tests/products.put.test.js (line 192)

---

## Bug #9: Should return 400 for description too long

**Severity:** Medium
**Endpoint:** `PUT /api/products/:id`
**Description:** API should return 400 Bad Request when `description` is too long, but instead it’s sending back 200 OK.
**Steps to Reproduce:**

* Provide a description exceeding maximum length
* Perform PUT with a valid product IDs and authentication
  **Expected Result:** 400 Bad Request
  **Actual Result:** 200 OK
  **Test Case:** src/tests/products.put.test.js (line 202)

---

## Bug #10: Should return 400 for null values in fields

**Severity:** Medium
**Endpoint:** `PUT /api/products/:id`
**Description:** API should return 400 Bad Request when fields are explicitly set to null, but instead it’s sending back 200 OK.
**Steps to Reproduce:**

* Provide `null` for a field in your PUT
* API responds with 200 instead of 400
  **Expected Result:** 400 Bad Request
  **Actual Result:** 200 OK
  **Test Case:** src/tests/products.put.test.js (line 213)

---

## Bug #11: Should handle undefined values gracefully

**Severity:** Medium
**Endpoint:** `PUT /api/products/:id`
**Description:** API should gracefully handle undefined values, but instead a TypeError is thrown.
**Steps to Reproduce:**

* Provide `undefined` for a field
* TypeError occurs instead of gracefully ignoring or validating
  **Expected Result:** 200 OK or proper validation messages
  **Actual Result:** TypeError
  **Test Case:** src/tests/products.put.test.js (line 228)

---

## Bug #12: Should return 400 for SQL injection in name

**Severity:** Medium
**Endpoint:** `PUT /api/products/:id`
**Description:** API should return 400 Bad Request when injection script is present in `name`.
**Steps to Reproduce:**

* Provide injection script in `name`
* API responds with 200 instead of 400
  **Expected Result:** 400 Bad Request
  **Actual Result:** 200 OK
  **Test Case:** src/tests/products.put.test.js (line 239)

---

## Bug #13: Should return 400 for XSS script in name

**Severity:** Medium
**Endpoint:** `PUT /api/products/:id`
**Description:** API should return 400 Bad Request when a script tag is present in `name`.
**Steps to Reproduce:**

* Provide script tag in `name`
* API responds with 200 instead of 400
  **Expected Result:** 400 Bad Request
  **Actual Result:** 200 OK
  **Test Case:** src/tests/products.put.test.js (line 249)

---

## Bug #14: Should return 400 for XSS script in description

**Severity:** Medium
**Endpoint:** `PUT /api/products/:id`
**Description:** API should return 400 Bad Request when a script tag is present in `description`.
**Steps to Reproduce:**

* Provide script tag in `description`
* API responds with 200 instead of 400
  **Expected Result:** 400 Bad Request
  **Actual Result:** 200 OK
  **Test Case:** src/tests/products.put.test.js (line 259)

---

## Bug #15: Should ignore ID field in update payload

**Severity:** Medium
**Endpoint:** `PUT /api/products/:id`
**Description:** API should ignore `id` field in the update payload, but instead parses or fails due to TypeError.
**Steps to Reproduce:**

* Provide a different `id` in the body
* API parses instead of ignoring
  **Expected Result:** 200 OK with the product’s IDs retaining their original IDs
  **Actual Result:** TypeError
  **Test Case:** src/tests/products.put.test.js (line 275)

---

## Bug #16: Should handle empty update body gracefully

**Severity:** Medium
**Endpoint:** `PUT /api/products/:id`
**Description:** API should gracefully handle cases where the update body is empty instead of causing a TypeError.
**Steps to Reproduce:**

* Provide an empty object in PUT body
* API parses instead of gracefully ignoring
  **Expected Result:** 200 OK with the product’s previous data
  **Actual Result:** TypeError
  **Test Case:** src/tests/products.put.test.js (line 308)

---

## Bug #17: Should return 400 for wrong content type

**Severity:** Medium
**Endpoint:** `PUT /api/products/:id`
**Description:** API should return 400 Bad Request for unsupported content-type instead of 200 OK.
**Steps to Reproduce:**

* Provide invalid content-type in your request
* API responds with 200 instead of 400
  **Expected Result:** 400 Bad Request
  **Actual Result:** 200 OK
  **Test Case:** src/tests/products.put.test.js (line 327)

---

## Bug #18: Should return 400 for array in primitive fields

**Severity:** Medium
**Endpoint:** `PUT /api/products/:id`
**Description:** API should return 400 Bad Request when array is provided for a field expecting a primitive.
**Steps to Reproduce:**

* Provide array for normally-primitive field
* API responds with 200 instead of 400
  **Expected Result:** 400 Bad Request
  **Actual Result:** 200 OK
  **Test Case:** src/tests/products.put.test.js (line 338)

---

## Bug #19: Should return 400 for object in primitive fields

**Severity:** Medium
**Endpoint:** `PUT /api/products/:id`
**Description:** API should return 400 Bad Request when object is provided for a field normally expecting a primitive.
**Steps to Reproduce:**

* Provide object for normally-primitive field
* API responds with 200 instead of 400
  **Expected Result:** 400 Bad Request
  **Actual Result:** 200 OK
  **Test Case:** src/tests/products.put.test.js (line 348)

---

## Bug #20: Should handle decimal prices correctly

**Severity:** Medium
**Endpoint:** `PUT /api/products/:id`
**Description:** API should handle decimal prices with proper rounding, but instead it’s retaining additional decimal places.
**Steps to Reproduce:**

* Provide price with additional decimal places
* API parses it without rounding
  **Expected Result:** price should be rounded to 2 decimal places
  **Actual Result:** retaining additional decimal places
  **Test Case:** src/tests/products.put.test.js (line 362)

---

## Bug #21: Should return 400 for price with too many decimal places

**Severity:** Medium
**Endpoint:** `PUT /api/products/:id`
**Description:** API should return 400 Bad Request when price includes more than two decimal places, but instead it’s sending back 200 OK.
**Steps to Reproduce:**

* Provide price with greater than 2 decimal places
* API responds with 200 instead of 400
  **Expected Result:** 400 Bad Request
  **Actual Result:** 200 OK
  **Test Case:** src/tests/products.put.test.js (line 372)

---

## Bug #22: Should handle maximum safe integer values

**Severity:** Medium
**Endpoint:** `PUT /api/products/:id`
**Description:** API should return 400 Bad Request when maximum-safe integer is exceeded, but instead it’s sending back 200 OK.
**Steps to Reproduce:**

* Provide a number greater than max-safe integer
* API responds with 200 instead of 400
  **Expected Result:** 400 Bad Request
  **Actual Result:** 200 OK
  **Test Case:** src/tests/products.put.test.js (line 383)

---

## Bug #23: Should return 409 for duplicate name with different product

**Severity:** Medium
**Endpoint:** `PUT /api/products/:id`
**Description:** API should prohibit duplicating names across products, but instead it’s sending back 200 OK.
**Steps to Reproduce:**

* Provide a name already used by another product
* API responds with 200 instead of 409
  **Expected Result:** 409 Conflict
  **Actual Result:** 200 OK
  **Test Case:** src/tests/products.put.test.js (line 421)

---

## Bug #24: Should return 401 for invalid token

**Severity:** Medium
**Endpoint:** `PUT /api/products/:id`
**Description:** API should return 401 Unauthorized when invalid authorization is provided, but instead it’s sending back 403 Forbidden.
**Steps to Reproduce:**

* Provide invalid authorization
* API responds with 403 instead of 401
  **Expected Result:** 401 Unauthorized
  **Actual Result:** 403 Forbidden
  **Test Case:** src/tests/products.put.test.js (line 502)

---

## Bug #25: Should return 401 for expired token

**Severity:** Medium
**Endpoint:** `PUT /api/products/:id`
**Description:** API should return 401 Unauthorized when expiration occurs, but instead it’s sending back 403 Forbidden.
**Steps to Reproduce:**

* Provide an expired authorization
* API responds with 403 instead of 401
  **Expected Result:** 401 Unauthorized
  **Actual Result:** 403 Forbidden
  **Test Case:** src/tests/products.put.test.js (line 510)

---

## Bug #26: Should return 401 for malformed auth header

**Severity:** Medium
**Endpoint:** `PUT /api/products/:id`
**Description:** API should return 401 Unauthorized when authorization header is invalid, but instead it’s sending back 403 Forbidden.
**Steps to Reproduce:**

* Provide invalid authorization format
* API responds with 403 instead of 401
  **Expected Result:** 401 Unauthorized
  **Actual Result:** 403 Forbidden
  **Test Case:** src/tests/products.put.test.js (line 518)

---

## Bug #27: Should return 405 for unsupported methods on product endpoint

**Severity:** Medium
**Endpoint:** `PUT /api/products/:id`
**Description:** API should return 405 Method Not Allowed for unsupported methods, but instead it’s sending back 404 Not Found.
**Steps to Reproduce:**

* Perform unsupported method (POST, PATCH, etc) on product endpoint
* API responds with 404 instead of 405
  **Expected Result:** 405 Method Not Allowed
  **Actual Result:** 404 Not Found
  **Test Case:** src/tests/products.put.test.js (line 528)

---

## Bug #28: Should handle OPTIONS request properly

**Severity:** Medium
**Endpoint:** `PUT /api/products/:id`
**Description:** API should handle OPTIONS gracefully, but instead it’s failing with TypeError.
**Steps to Reproduce:**

* Perform a request with `OPTIONS`
* TypeError occurs instead of proper response
  **Expected Result:** 200 or 204 with proper CORS headers
  **Actual Result:** TypeError
  **Test Case:** src/tests/products.put.test.js (line 536)

---

## Bug #29: Should handle rapid successive updates

**Severity:** Medium
**Endpoint:** `PUT /api/products/:id`
**Description:** API should gracefully handle concurrent or rapid updates, but instead the test hangs or fails due to a timeout.
**Steps to Reproduce:**

* Perform multiple requests in rapid succession
* API fails or hangs instead of gracefully processing
  **Expected Result:** 200 or proper conflict/error
  **Actual Result:** Jest hangs or times out
  **Test Case:** src/tests/products.put.test.js (line 542)

---

