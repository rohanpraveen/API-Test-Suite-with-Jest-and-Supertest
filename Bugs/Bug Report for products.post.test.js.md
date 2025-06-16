
## Bug Report - API: `POST /api/products`

----------

### Bug #1: Should return 400 when price is missing

**Severity:** Medium  
**Endpoint:** `POST /api/products`  
**Description:** API should return 400 Bad Request when price is missing, but instead it’s sending back 201 Created.  
**Steps to Reproduce:**

-   Send a `POST` request with missing price field
    
-   Authenticated with a valid token  
    **Expected Result:** 400 Bad Request  
    **Actual Result:** 201 Created  
    **Test Case:** src/tests/products.post.test.js (line 69)
    

----------

### Bug #2: Should return 400 when category is missing

**Severity:** Medium  
**Endpoint:** `POST /api/products`  
**Description:** API should return 400 Bad Request when category is missing, but instead it’s sending back 200 OK.  
**Steps to Reproduce:**

-   Send a `POST` request without a `category` field
    
-   Authenticated with a valid token  
    **Expected Result:** 400 Bad Request  
    **Actual Result:** 200 OK  
    **Test Case:** src/tests/products.post.test.js (line 80)
    

----------

### Bug #3: Should return 400 for invalid price type (string)

**Severity:** Medium  
**Endpoint:** `POST /api/products`  
**Description:** API should return 400 Bad Request for invalid price (string), but instead it’s sending back 200 OK.  
**Steps to Reproduce:**

-   Provide price as a string instead of a number
    
-   Authenticated with a valid token  
    **Expected Result:** 400 Bad Request  
    **Actual Result:** 200 OK  
    **Test Case:** src/tests/products.post.test.js (line 91)
    

----------

### Bug #4: Should return 400 for invalid stock type (string)

**Severity:** Medium  
**Endpoint:** `POST /api/products`  
**Description:** API should return 400 Bad Request for invalid stock (string), but instead it’s sending back 201 Created.  
**Steps to Reproduce:**

-   Provide stock as a string instead of a number
    
-   Authenticated with a valid token  
    **Expected Result:** 400 Bad Request  
    **Actual Result:** 201 Created  
    **Test Case:** src/tests/products.post.test.js (line 101)
    

----------

### Bug #5: Should return 400 for invalid price (negative)

**Severity:** Medium  
**Endpoint:** `POST /api/products`  
**Description:** API should return 400 Bad Request for invalid price (negative), but instead it’s sending back 201 Created.  
**Steps to Reproduce:**

-   Provide price with a negative number
    
-   Authenticated with a valid token  
    **Expected Result:** 400 Bad Request  
    **Actual Result:** 201 Created  
    **Test Case:** src/tests/products.post.test.js (line 111)
    

----------

### Bug #6: Should return 400 for invalid stock (negative)

**Severity:** Medium  
**Endpoint:** `POST /api/products`  
**Description:** API should return 400 Bad Request for invalid stock (negative), but instead it’s sending back 201 Created.  
**Steps to Reproduce:**

-   Provide a negatif number for stock
    
-   Authenticated with a valid token  
    **Expected Result:** 400 Bad Request  
    **Actual Result:** 201 Created  
    **Test Case:** src/tests/products.post.test.js (line 121)
    

----------

### Bug #7: Should return 400 for name too long

**Severity:** Medium  
**Endpoint:** `POST /api/products`  
**Description:** API should return 400 Bad Request when product name is too long, but instead it’s sending back 200 OK.  
**Steps to Reproduce:**

-   Provide a product with a name exceeding maximum length
    
-   Authenticated with a valid token  
    **Expected Result:** 400 Bad Request  
    **Actual Result:** 200 OK  
    **Test Case:** src/tests/products.post.test.js (line 132)
    

----------

### Bug #8: Should return 400 for description too long

**Severity:** Medium  
**Endpoint:** `POST /api/products`  
**Description:** API should return 400 Bad Request when product description is too long, but instead it’s sending back 200 OK.  
**Steps to Reproduce:**

-   Provide a product with a description exceeding maximum length
    
-   Authenticated with a valid token  
    **Expected Result:** 400 Bad Request  
    **Actual Result:** 200 OK  
    **Test Case:** src/tests/products.post.test.js (line 152)
    

----------

### Bug #9: Should return 400 for SQL injection in name

**Severity:** Medium  
**Endpoint:** `POST /api/products`  
**Description:** API should return 400 Bad Request for SQL injection in product name, but instead it’s sending back 200 OK.  
**Steps to Reproduce:**

-   Provide a product with a SQL injection attack in its name
    
-   Authenticated with a valid token  
    **Expected Result:** 400 Bad Request  
    **Actual Result:** 200 OK  
    **Test Case:** src/tests/products.post.test.js (line 163)
    

----------

### Bug #10: Should return 400 for XSS script in name

**Severity:** Medium  
**Endpoint:** `POST /api/products`  
**Description:** API should return 400 Bad Request for XSS script injection in product name, but instead it’s sending back 200 OK.  
**Steps to Reproduce:**

-   Provide a product with a script tag in its name
    
-   Authenticated with a valid token  
    **Expected Result:** 400 Bad Request  
    **Actual Result:** 200 OK  
    **Test Case:** src/tests/products.post.test.js (line 173)
    

----------

### Bug #11: Should return 400 for XSS script in description

**Severity:** Medium  
**Endpoint:** `POST /api/products`  
**Description:** API should return 400 Bad Request for XSS script injection in product description, but instead it’s sending back 201 Created.  
**Steps to Reproduce:**

-   Provide a product with a script tag in its description
    
-   Authenticated with a valid token  
    **Expected Result:** 400 Bad Request  
    **Actual Result:** 201 Created  
    **Test Case:** src/tests/products.post.test.js (line 183)
    

----------

 **Bug #12: Should handle maximum safe integer for stock**

**Severity:** Medium  
**Endpoint:** POST /api/products  
**Description:** API should validate maximum safe integer for stock. Currently, it’s not.  
**Steps to Reproduce:**

1.  Provide a maximum-safe integer for stock.
2.  API responds with 200 instead of 400.  
    **Expected Result:** 400 Bad Request  
    **Actual Result:** 200 OK  
    **Test Case:** src/tests/products.post.test.js (line 232)

  

**Bug #13: Should handle decimal prices correctly**

**Severity:** Medium  
**Endpoint:** POST /api/products  
**Description:** API should create a product with price rounding to 2 decimal places. Currently, it’s not honoring this.  
**Steps to Reproduce:**

1.  Provide a price with more than 2 decimal places.
2.  API responds with 200 instead of 201, ignoring rounding.  
    **Expected Result:** 201 Created with price = 100.00  
    **Actual Result:** 200 OK with price retaining excess decimal places  
    **Test Case:** src/tests/products.post.test.js (line 242)

  

 **Bug #14: Should return 400 for price with too many decimal places**

**Severity:** Medium  
**Endpoint:** POST /api/products  
**Description:** API should validate price format. Currently, it accepts invalid decimal places.  
**Steps to Reproduce:**

1.  Provide price with more than 2 decimal places.
2.  API responds with 200 instead of 400.  
    **Expected Result:** 400 Bad Request  
    **Actual Result:** 200 OK  
    **Test Case:** src/tests/products.post.test.js (line 255)

  
 **Bug #15: Should return 409 for duplicate product name**

**Severity:** Medium  
**Endpoint:** POST /api/products  
**Description:** API should prohibit duplicates by name. Currently, it allows them.  
**Steps to Reproduce:**

1.  Create a product with a unique name.
2.  Repeat with the SAME name — it should conflict, but it doesn’t.  
    **Expected Result:** 409 Conflict  
    **Actual Result:** 200 OK  
    **Test Case:** src/tests/products.post.test.js (line 265)

  

 **Bug #16: Should return 400 for array in name field**

**Severity:** Medium  
**Endpoint:** POST /api/products  
**Description:** API should prohibit array-type for name. Currently, it parses it.  
**Steps to Reproduce:**

1.  Provide a product with name as array.
2.  API responds with 201 instead of 400.  
    **Expected Result:** 400 Bad Request  
    **Actual Result:** 201 Created  
    **Test Case:** src/tests/products.post.test.js (line 293)

  

**Bug #17: Should return 400 for nested object in price**

**Severity:** Medium  
**Endpoint:** POST /api/products  
**Description:** API should prohibit object-type for price. Currently, it parses it.  
**Steps to Reproduce:**

1.  Provide a product with price as an object.
2.  API responds with 201 instead of 400.  
    **Expected Result:** 400 Bad Request  
    **Actual Result:** 201 Created  
    **Test Case:** src/tests/products.post.test.js (line 303)

  

 **Bug #18: Should handle unicode characters in product name**

**Severity:** Medium  
**Endpoint:** POST /api/products  
**Description:** API should create product with Unicode names gracefully. Currently, it responds with 200 instead of 201.  
**Steps to Reproduce:**

1.  Provide a product with Unicode name.
2.  API responds with 200 instead of 201.  
    **Expected Result:** 201 Created  
    **Actual Result:** 200 OK  
    **Test Case:** src/tests/products.post.test.js (line 314)

  

 **Bug #19: Should return 401 for invalid token**

**Severity:** Medium  
**Endpoint:** POST /api/products  
**Description:** API should respond with 401 Unauthorized for invalid tokens. Currently, it responds with 403 Forbidden instead.  
**Steps to Reproduce:**

1.  Provide invalid authorization token.
2.  API responds with 403 instead of 401.  
    **Expected Result:** 401 Unauthorized  
    **Actual Result:** 403 Forbidden  
    **Test Case:** src/tests/products.post.test.js (line 364)

  

**Bug #20: Should return 401 for expired token**

**Severity:** Medium  
**Endpoint:** POST /api/products  
**Description:** API should respond with 401 Unauthorized for expired tokens instead of 403 Forbidden.  
**Steps to Reproduce:**

1.  Provide an expired authorization token.
2.  API responds with 403 instead of 401.  
    **Expected Result:** 401 Unauthorized  
    **Actual Result:** 403 Forbidden  
    **Test Case:** src/tests/products.post.test.js (line 372)

  

 **Bug #21: Should return 429 when rate limit exceeded**

**Severity:** Medium  
**Endpoint:** POST /api/products  
**Description:** API should respond with 429 Too Many Requests after rate limit exceeded. Currently, it doesn’t.  
**Steps to Reproduce:**

1.  Loop requests until rate limit is surpassed.
2.  API fails to respond with 429.  
    **Expected Result:** 429 Too Many Requests  
    **Actual Result:** Did not respond with 429  
    **Test Case:** src/tests/products.post.test.js (line 414)

  


