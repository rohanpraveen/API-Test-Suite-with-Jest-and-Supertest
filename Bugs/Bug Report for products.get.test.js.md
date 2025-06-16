
## Bug Report - API: `GET /api/products`


## Bug #1: Should return 400 for page = 0

**Severity**: Medium  
**Endpoint**: GET /api/products  
**Description**: API should return 400 Bad Request when pagination page is 0, but it’s currently sending back 200 OK.  
**Steps to Reproduce**:

-   Send a GET request to `/api/products?page=0&page_size=5`.  
    **Expected Result**: 400 Bad Request  
    **Actual Result**: 200 OK  
    **Test Case**: src/tests/products.get.test.js (line 67)
    

----------

## Bug #2: Should return 400 for invalid pagination parameters (negative)

**Severity**: Medium  
**Endpoint**: GET /api/products  
**Description**: API should return 400 for invalid (negative) pagination parameters, but instead it’s sending back 200 OK.  
**Steps to Reproduce**:

-   Send a GET request to `/api/products?page=-1&page_size=-5`.  
    **Expected Result**: 400 Bad Request  
    **Actual Result**: 200 OK  
    **Test Case**: src/tests/products.get.test.js (line 74)
    

----------

## Bug #3: Should return 400 for invalid pagination parameters (non-numeric)

**Severity**: Medium  
**Endpoint**: GET /api/products  
**Description**: API should return 400 for non-numeric pagination parameters, but instead it’s sending back 200 OK.  
**Steps to Reproduce**:

-   Send a GET request to `/api/products?page=abc&page_size=xyz`.  
    **Expected Result**: 400 Bad Request  
    **Actual Result**: 200 OK  
    **Test Case**: src/tests/products.get.test.js (line 81)
    

----------

## Bug #4: Should return 400 if page_size exceeds max allowed (1000)

**Severity**: Medium  
**Endpoint**: GET /api/products  
**Description**: API should return 400 if `page_size` exceeds maximum (1000), but instead it’s sending back 200 OK.  
**Steps to Reproduce**:

-   Send a GET request to `/api/products?page=1&page_size=1000`.  
    **Expected Result**: 400 Bad Request  
    **Actual Result**: 200 OK  
    **Test Case**: src/tests/products.get.test.js (line 88)
    

----------

## Bug #5: Should return 400 for non-numeric pagination parameters (array)

**Severity**: Medium  
**Endpoint**: GET /api/products  
**Description**: API should return 400 when pagination parameters are provided as array, but instead it’s sending back 200 OK.  
**Steps to Reproduce**:

-   Send a GET request to `/api/products?page[]=1&page_size[foo]=bar`.  
    **Expected Result**: 400 Bad Request  
    **Actual Result**: 200 OK  
    **Test Case**: src/tests/products.get.test.js (line 105)
    

----------

## Bug #6: Should return 400 for non-numeric pagination parameters (JSON)

**Severity**: Medium  
**Endpoint**: GET /api/products  
**Description**: API should return 400 when pagination parameters are provided in invalid format (JSON), but instead it’s sending back 200 OK.  
**Steps to Reproduce**:

-   Send a GET request to `/api/products?page={"num":1}`.  
    **Expected Result**: 400 Bad Request  
    **Actual Result**: 200 OK  
    **Test Case**: src/tests/products.get.test.js (line 112)
    

----------

## Bug #7: Should support filtering by category

**Severity**: Medium  
**Endpoint**: GET /api/products  
**Description**: API should filter products by specified category, but it's not honoring the filter.  
**Steps to Reproduce**:

-   Send a GET request to `/api/products?category=Accessories`.  
    **Expected Result**: All products should belong to "Accessories"  
    **Actual Result**: Some products belong to a different category (like "Electronics")  
    **Test Case**: src/tests/products.get.test.js (line 141)
    

----------

## Bug #8: Should support sorting by price ascending

**Severity**: Medium  
**Endpoint**: GET /api/products  
**Description**: API should return products in ascending price order, but it’s not honoring the ordering.  
**Steps to Reproduce**:

-   Send a GET request to `/api/products?sort=price_ascending`.  
    **Expected Result**: Each subsequent product’s price should be greater or equal to previous.  
    **Actual Result**: Some products are unordered (prices are less than previous ones)  
    **Test Case**: src/tests/products.get.test.js (line 155)
    

----------

## Bug #9: Should return 400 for invalid filter injection

**Severity**: Medium  
**Endpoint**: GET /api/products  
**Description**: API should return 400 for invalid filter injection, but instead it’s sending back 200 OK.  
**Steps to Reproduce**:

-   Send a GET request to `/api/products?category=<script>`.  
    **Expected Result**: 400 Bad Request  
    **Actual Result**: 200 OK  
    **Test Case**: src/tests/products.get.test.js (line 226)
    

----------

## Bug #10: Should gracefully fallback or return 400 for invalid sort field or direction

**Severity**: Medium  
**Endpoint**: GET /api/products  
**Description**: API should gracefully fallback or return 400 for invalid sort field or direction, but instead it’s sending back 200 OK.  
**Steps to Reproduce**:

-   Send a GET request to `/api/products?sort=foo_invalid`.  
    **Expected Result**: 400 Bad Request  
    **Actual Result**: 200 OK  
    **Test Case**: src/tests/products.get.test.js (line 234)
    

----------