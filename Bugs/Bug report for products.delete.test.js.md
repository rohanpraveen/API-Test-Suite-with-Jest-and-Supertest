
# Bug Report — API: `DELETE /api/products/:id`

## Bug #1: Should delete existing product successfully

**Severity:** Medium  
**Endpoint:** `DELETE /api/products/:id`  
**Description:** API should respond with 204 "No Content", but instead it’s sending back 200 "OK".  
**Steps to Reproduce:**

-   Perform delete with a valid product IDs and authentication
    
-   API responds with 200 instead of 204  
    **Expected Result:** 204 No Content  
    **Actual Result:** 200 OK  
    **Test Case:** src/tests/products.delete.test.js (line 66)
    

----------

## Bug #2: Should return deleted product details in response body (alternative implementation)

**Severity:** Medium  
**Endpoint:** `DELETE /api/products/:id`  
**Description:** API should include the deleted product details, but instead it’s missing or undefined.  
**Steps to Reproduce:**

-   Perform delete with a valid product IDs
    
-   API responds without proper product details  
    **Expected Result:** Product details in response  
    **Actual Result:** TypeError (undefined)  
    **Test Case:** src/tests/products.delete.test.js (line 84)
    

----------

## Bug #3: Should return 400 for SQL injection in ID

**Severity:** Medium  
**Endpoint:** `DELETE /api/products/:id`  
**Description:** API should return 400 Bad Request when injection script is present in IDs, but instead it’s sending back 204.  
**Steps to Reproduce:**

-   Provide injection script in IDs
    
-   API responds with 204 instead of 400  
    **Expected Result:** 400 Bad Request  
    **Actual Result:** 204 No Content  
    **Test Case:** src/tests/products.delete.test.js (line 138)
    

----------

## Bug #4: Should return 400 for XSS attempt in ID

**Severity:** Medium  
**Endpoint:** `DELETE /api/products/:id`  
**Description:** API should return 400 Bad Request when script tag is present in IDs, but instead it’s sending back 404.  
**Steps to Reproduce:**

-   Provide script tag in IDs
    
-   API responds with 404 instead of 400  
    **Expected Result:** 400 Bad Request  
    **Actual Result:** 404 Not Found  
    **Test Case:** src/tests/products.delete.test.js (line 145)
    

----------

## Bug #5: Should handle negative ID

**Severity:** Medium  
**Endpoint:** `DELETE /api/products/:id`  
**Description:** API should return 400 Bad Request when a negatif IDs are provided, but instead it’s sending back 404.  
**Steps to Reproduce:**

-   Provide a negatif IDs
    
-   API responds with 404 instead of 400  
    **Expected Result:** 400 Bad Request  
    **Actual Result:** 404 Not Found  
    **Test Case:** src/tests/products.delete.test.js (line 160)
    

----------

## Bug #6: Should handle decimal ID

**Severity:** Medium  
**Endpoint:** `DELETE /api/products/:id`  
**Description:** API should return 400 Bad Request for decimal IDs, but instead it’s sending back 200 OK.  
**Steps to Reproduce:**

-   Provide decimal IDs
    
-   API responds with 200 instead of 400  
    **Expected Result:** 400 Bad Request  
    **Actual Result:** 200 OK  
    **Test Case:** src/tests/products.delete.test.js (line 174)
    

----------

## Bug #7: Should return 404 when trying to delete already deleted product

**Severity:** Medium  
**Endpoint:** `DELETE /api/products/:id`  
**Description:** API should return 404 Not Found when attempting to delete a product that's already gone, but instead it’s sending back 200 OK.  
**Steps to Reproduce:**

-   Delete the product
    
-   Repeat delete
    
-   API responds with 200 instead of 404  
    **Expected Result:** 404 Not Found  
    **Actual Result:** 200 OK  
    **Test Case:** src/tests/products.delete.test.js (line 183)
    

----------

## Bug #8: Should ignore request body if present

**Severity:** Medium  
**Endpoint:** `DELETE /api/products/:id`  
**Description:** API should ignore the request body and return 204, but instead it’s sending back 200 OK.  
**Steps to Reproduce:**

-   Provide a request body while sending delete
    
-   API parses instead of ignoring  
    **Expected Result:** 204 No Content  
    **Actual Result:** 200 OK  
    **Test Case:** src/tests/products.delete.test.js (line 198)
    

----------

## Bug #9: Should handle malformed JSON in body gracefully

**Severity:** Medium  
**Endpoint:** `DELETE /api/products/:id`  
**Description:** API should gracefully ignore invalid JSON in delete requests, but instead it’s sending back 400.  
**Steps to Reproduce:**

-   Provide invalid JSON
    
-   API responds with 400 instead of gracefully ignoring  
    **Expected Result:** 204 No Content  
    **Actual Result:** 400 Bad Request  
    **Test Case:** src/tests/products.delete.test.js (line 213)
    

----------

## Bug #10: Should work regardless of Content-Type header

**Severity:** Medium  
**Endpoint:** `DELETE /api/products/:id`  
**Description:** API should ignore Content-Type and still process delete, but instead it’s sending back 200 OK instead of 204.  
**Steps to Reproduce:**

-   Provide invalid content-type
    
-   API responds with 200 instead of 204  
    **Expected Result:** 204 No Content  
    **Actual Result:** 200 OK  
    **Test Case:** src/tests/products.delete.test.js (line 222)
    

----------

## Bug #11: Should ignore query parameters

**Severity:** Medium  
**Endpoint:** `DELETE /api/products/:id`  
**Description:** API should ignore additional query parameters, but instead it’s sending back 200 instead of 204.  
**Steps to Reproduce:**

-   Provide additional query parameters
    
-   API responds with 200 instead of 204  
    **Expected Result:** 204 No Content  
    **Actual Result:** 200 OK  
    **Test Case:** src/tests/products.delete.test.js (line 230)
    

----------

## Bug #12: Should ignore malicious query parameters

**Severity:** Medium  
**Endpoint:** `DELETE /api/products/:id`  
**Description:** API should ignore injection attacks through query parameters, but instead it’s sending back 200 instead of 204.  
**Steps to Reproduce:**

-   Provide injection attack in query parameters
    
-   API responds with 200 instead of 204  
    **Expected Result:** 204 No Content  
    **Actual Result:** 200 OK  
    **Test Case:** src/tests/products.delete.test.js (line 237)
    

----------

## Bug #13: Should handle concurrent deletion attempts

**Severity:** Medium  
**Endpoint:** `DELETE /api/products/:id`  
**Description:** API should gracefully handle concurrent delete requests — there should be only 1 delete — but instead it's failing.  
**Steps to Reproduce:**

-   Perform multiple delete requests in a short period
    
-   The API fails or hangs  
    **Expected Result:** 1 successfully deleted, rest should 404  
    **Actual Result:** Failed or hangs  
    **Test Case:** src/tests/products.delete.test.js (line 258)
    

----------

## Bug #14: Should prevent path traversal attacks

**Severity:** Medium  
**Endpoint:** `DELETE /api/products/:id`  
**Description:** API should prohibit path traversal attacks with IDs, but instead it’s sending back 404 (Not Found) instead of 400.  
**Steps to Reproduce:**

-   Provide IDs with path traversal
    
-   API responds with 404 instead of 400  
    **Expected Result:** 400 Bad Request  
    **Actual Result:** 404 Not Found  
    **Test Case:** src/tests/products.delete.test.js (line 275)
    

----------

## Bug #15: Should handle extremely long ID

**Severity:** Medium  
**Endpoint:** `DELETE /api/products/:id`  
**Description:** API should gracefully handle IDs that are exceptionally long, but instead it’s sending back 414 (URI Too Long) instead of 400.  
**Steps to Reproduce:**

-   Provide a very long IDs
    
-   API responds with 414 instead of 400  
    **Expected Result:** 400 Bad Request  
    **Actual Result:** 414 URI Too Long  
    **Test Case:** src/tests/products.delete.test.js (line 306)
    

----------

## Bug #16: Should return 401 for invalid token

**Severity:** Medium  
**Endpoint:** `DELETE /api/products/:id`  
**Description:** API should return 401 Unauthorized when invalid authorization is provided, but instead it’s sending back 403.  
**Steps to Reproduce:**

-   Provide invalid authorization
    
-   API responds with 403 instead of 401  
    **Expected Result:** 401 Unauthorized  
    **Actual Result:** 403 Forbidden  
    **Test Case:** src/tests/products.delete.test.js (line 355)
    

----------

## Bug #17: Should return 401 for expired token

**Severity:** Medium  
**Endpoint:** `DELETE /api/products/:id`  
**Description:** API should return 401 Unauthorized when expiration occurs, but instead it’s sending back 403.  
**Steps to Reproduce:**

-   Provide an expired authorization
    
-   API responds with 403 instead of 401  
    **Expected Result:** 401 Unauthorized  
    **Actual Result:** 403 Forbidden  
    **Test Case:** src/tests/products.delete.test.js (line 362)
    

----------

## Bug #18: Should return 401 for malformed auth header

**Severity:** Medium  
**Endpoint:** `DELETE /api/products/:id`  
**Description:** API should return 401 Unauthorized when authorization header is invalid, but instead it’s sending back 403.  
**Steps to Reproduce:**

-   Provide invalid authorization format
    
-   API responds with 403 instead of 401  
    **Expected Result:** 401 Unauthorized  
    **Actual Result:** 403 Forbidden  
    **Test Case:** src/tests/products.delete.test.js (line 369)
    

----------

## Bug #19: Should return 401 for missing Bearer prefix

**Severity:** Medium  
**Endpoint:** `DELETE /api/products/:id`  
**Description:** API should return 401 Unauthorized when "Bearer" is missing, but instead it’s sending back 403.  
**Steps to Reproduce:**

-   Provide authorization without Bearer
    
-   API responds with 403 instead of 401  
    **Expected Result:** 401 Unauthorized  
    **Actual Result:** 403 Forbidden  
    **Test Case:** src/tests/products.delete.test.js (line 376)
    

----------

## Bug #20: Should handle OPTIONS request properly

**Severity:** Medium  
**Endpoint:** `DELETE /api/products/:id`  
**Description:** API should handle OPTIONS gracefully, but instead it’s failing with TypeError.  
**Steps to Reproduce:**

-   Perform a request with `OPTIONS`
    
-   TypeError occurs instead of proper response  
    **Expected Result:** 200 or 204 with proper CORS headers  
    **Actual Result:** TypeError  
    **Test Case:** src/tests/products.delete.test.js (line 409)
    

----------

## Bug #21: Should perform soft delete (if implemented)

**Severity:** Medium  
**Endpoint:** `DELETE /api/products/:id`  
**Description:** API should perform a soft delete, but instead it’s sending back 200 instead of 204.  
**Steps to Reproduce:**

-   Perform delete with soft delete implemented
    
-   API responds with 200 instead of 204  
    **Expected Result:** 204 No Content  
    **Actual Result:** 200 OK  
    **Test Case:** src/tests/products.delete.test.js (line 450)
    

----------

## Bug #22: Should handle cascade deletion properly

**Severity:** Medium  
**Endpoint:** `DELETE /api/products/:id`  
**Description:** API should handle cascade deletion (like orphaned children) gracefully, but instead it’s sending back 200 instead of 204.  
**Steps to Reproduce:**

-   Perform delete with related entities
    
-   API responds with 200 instead of 204  
    **Expected Result:** 204 No Content  
    **Actual Result:** 200 OK  
    **Test Case:** src/tests/products.delete.test.js (line 474)
    

----------

## Bug #23: Should return 409 when trying to delete product with active orders

**Severity:** Medium  
**Endpoint:** `DELETE /api/products/:id`  
**Description:** API should prohibit deletion when there’s an active order for the product, but instead it’s sending back 200 instead of 409.  
**Steps to Reproduce:**

-   Provide a product with an active order
    
-   API responds with 200 instead of 409  
    **Expected Result:** 409 Conflict  
    **Actual Result:** 200 OK  
    **Test Case:** src/tests/products.delete.test.js (line 486)
    

----------

## Bug #24: Should handle rapid deletion requests

**Severity:** Medium  
**Endpoint:** `DELETE /api/products/:id`  
**Description:** API should gracefully handle heavy or repeated delete requests, but instead it’s failing.  
**Steps to Reproduce:**

-   Perform multiple delete requests quickly
    
-   The API fails or hangs  
    **Expected Result:** All should succeed gracefully  
    **Actual Result:** Failed or hangs  
    **Test Case:** src/tests/products.delete.test.js (line 525)
    

----------

## Bug #25: Should be idempotent - multiple delete requests should not cause errors

**Severity:** Medium  
**Endpoint:** `DELETE /api/products/:id`  
**Description:** API should be idempotent, but instead it’s sending back 429 instead of 204.  
**Steps to Reproduce:**

-   Perform multiple delete requests with the same IDs
    
-   API responds with 429 instead of 204  
    **Expected Result:** 204 No Content  
    **Actual Result:** 429 Too Many Requests  
    **Test Case:** src/tests/products.delete.test.js (line 588)
    

----------

## Bug #26: Should return 405 for DELETE on collection endpoint

**Severity:** Medium  
**Endpoint:** `DELETE /api/products`  
**Description:** API should prohibit delete operations on collection, but instead it’s sending back 404.  
**Steps to Reproduce:**

-   Perform delete without specifying IDs
    
-   API responds with 404 instead of 405  
    **Expected Result:** 405 Method Not Allowed  
    **Actual Result:** 404 Not Found  
    **Test Case:** src/tests/products.delete.test.js (line 609)
    

----------

## Bug #27: Should not delete all products accidentally

**Severity:** Medium  
**Endpoint:** `DELETE /api/products/all`  
**Description:** API should prohibit mass deletion, but instead it’s sending back 429 instead of 404.  
**Steps to Reproduce:**

-   Perform delete with `/all` route
    
-   API responds with 429 instead of 404  
    **Expected Result:** 404 Not Found  
    **Actual Result:** 429 Too Many Requests  
    **Test Case:** src/tests/products.delete.test.js (line 617)
    

----------