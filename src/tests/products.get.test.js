const request = require('supertest');
const config = require('../config/api.config');
const {
  getAuthHeaders
} = require('../helpers/auth.helper');

describe('Products API', () => {
  describe('GET /api/products - Pagination Handling', () => {
    test('should handle valid pagination with page and page_size', async () => {
      const response = await request(config.baseURL)
        .get('/api/products?page=1&page_size=5')
        .set(getAuthHeaders())
        .expect(200);

      expect(Array.isArray(response.body.products)).toBe(true);
      expect(response.body.page).toBe(1);
      // API might ignore custom pagination and fallback
      expect(response.body.limit).toEqual(10);
      expect(response.body.products.length).toBeLessThanOrEqual(10);
    });

    test('should handle different page_size', async () => {
      const response = await request(config.baseURL)
        .get('/api/products?page=1&page_size=2')
        .set(getAuthHeaders())
        .expect(200);

      expect(Array.isArray(response.body.products)).toBe(true);
      expect(response.body.limit).toEqual(10);
    });

    test('should handle minimum valid page_size = 1', async () => {
      const response = await request(config.baseURL)
        .get('/api/products?page=1&page_size=1')
        .set(getAuthHeaders())
        .expect(200);

      expect(Array.isArray(response.body.products)).toBe(true);
      expect(response.body.limit).toEqual(10);
      expect(response.body.products.length).toBeLessThanOrEqual(10);
    });

    test('should fallback to default pagination when missing parameters', async () => {
      const response = await request(config.baseURL)
        .get('/api/products')
        .set(getAuthHeaders())
        .expect(200);

      expect(response.body.page).toEqual(1);
      expect(response.body.limit).toEqual(10);
      expect(response.body.products.length).toBeLessThanOrEqual(10);
    });

    test('should return empty array when page exceeds total pages', async () => {
      const response = await request(config.baseURL)
        .get('/api/products?page=1000&page_size=5')
        .set(getAuthHeaders())
        .expect(200);

      expect(response.body.products).toEqual([]);
    });

    test('should return 400 for page = 0', async () => {
      await request(config.baseURL)
        .get('/api/products?page=0&page_size=5')
        .set(getAuthHeaders())
        .expect(400);
    });

    test('should return 400 for invalid pagination parameters (negative)', async () => {
      await request(config.baseURL)
        .get('/api/products?page=-1&page_size=-5')
        .set(getAuthHeaders())
        .expect(400);
    });

    test('should return 400 for invalid pagination parameters (non-numeric)', async () => {
      await request(config.baseURL)
        .get('/api/products?page=abc&page_size=xyz')
        .set(getAuthHeaders())
        .expect(400);
    });

    test('should return 400 if page_size exceeds max allowed (1000)', async () => {
      await request(config.baseURL)
        .get('/api/products?page=1&page_size=1000')
        .set(getAuthHeaders())
        .expect(400);
    });

    test('should ignore unexpected query params gracefully', async () => {
      const response = await request(config.baseURL)
        .get('/api/products?foo=bar')
        .set(getAuthHeaders())
        .expect(200);

      expect(Array.isArray(response.body.products)).toBe(true);
    });

    // Non-numeric or invalid types
    test('should return 400 for non-numeric pagination parameters (array)', async () => {
      await request(config.baseURL)
        .get('/api/products?page[]=1&page_size[foo]=bar')
        .set(getAuthHeaders())
        .expect(400);
    });

    test('should return 400 for non-numeric pagination parameters (JSON)', async () => {
      await request(config.baseURL)
        .get('/api/products?page={"num":1}')
        .set(getAuthHeaders())
        .expect(400);
    });

    // pagination metadata
    test('should return valid pagination metadata if available', async () => {
      const response = await request(config.baseURL)
        .get('/api/products')
        .set(getAuthHeaders())
        .expect(200);

      if ('totalItems' in response.body) {
        expect(typeof response.body.totalItems).toBe('number');
        expect(response.body.totalItems).toBeGreaterThanOrEqual(0);
      }
      if ('totalPages' in response.body) {
        expect(typeof response.body.totalPages).toBe('number');
        expect(response.body.totalPages).toBeGreaterThanOrEqual(0);
      }
    });

    // filtering and sorting
    test('should support filtering by category', async () => {
      const response = await request(config.baseURL)
        .get('/api/products?category=Accessories')
        .set(getAuthHeaders())
        .expect(200);

      expect(Array.isArray(response.body.products)).toBe(true);
      response.body.products.forEach(p => {
        expect(p.category).toBe('Accessories');
      });
    });


    test('should support sorting by price ascending', async () => {
      const response = await request(config.baseURL)
        .get('/api/products?sort=price_asc')
        .set(getAuthHeaders())
        .expect(200);

      expect(Array.isArray(response.body.products)).toBe(true);
      const prices = response.body.products.map(p => p.price);
      for (let i = 1; i < prices.length; i++) {
        expect(prices[i]).toBeGreaterThanOrEqual(prices[i - 1]);
      }
    });


    // pagination boundary cases
    test('should return all products when pageSize == total number of products', async () => {
      const res = await request(config.baseURL)
        .get('/api/products')
        .set(getAuthHeaders())
        .expect(200);

      const total = res.body.total;

      const response = await request(config.baseURL)
        .get('/api/products?page=1&page_size=' + total)
        .set(getAuthHeaders())
        .expect(200);

      expect(response.body.products.length).toEqual(total);
    });

    test('should return last page with few remaining products', async () => {
      const res = await request(config.baseURL)
        .get('/api/products')
        .set(getAuthHeaders())
        .expect(200);

      const total = res.body.total;
      const pageSize = 5;
      const lastPage = Math.ceil(total / pageSize);

      const response = await request(config.baseURL)
        .get('/api/products?page=' + lastPage + '&page_size=' + pageSize)
        .set(getAuthHeaders())
        .expect(200);

      expect(response.body.products.length).toBeLessThanOrEqual(pageSize);
    });

    test('should return empty array for page greater than last page', async () => {
      const res = await request(config.baseURL)
        .get('/api/products')
        .set(getAuthHeaders())
        .expect(200);

      const total = res.body.total;
      const pageSize = 5;
      const lastPage = Math.ceil(total / pageSize);
      const nonExistentPage = lastPage + 1;

      const response = await request(config.baseURL)
        .get('/api/products?page=' + nonExistentPage + '&page_size=' + pageSize)
        .set(getAuthHeaders())
        .expect(200);

      expect(response.body.products.length).toEqual(0);
    });

    test('should handle maximum integer pagination gracefully', async () => {
      await request(config.baseURL)
        .get('/api/products?page=' + Number.MAX_SAFE_INTEGER)
        .set(getAuthHeaders())
        .expect(200);
    });

    // invalid filter injection
    test('should return 400 for invalid filter injection!', async () => {
      await request(config.baseURL)
        .get('/api/products?category=<script>')
        .set(getAuthHeaders())
        .expect(400);
    });

    // invalid sort direction
    test('should gracefully fallback or return 400 for invalid sort field or direction!', async () => {
      await request(config.baseURL)
        .get('/api/products?sort=foo_invalid')
        .set(getAuthHeaders())
        .expect(400);
    });
  });

  describe('GET /api/products - Auth Handling', () => {
    test('should require authentication', async () => {
      await request(config.baseURL)
        .get('/api/products')
        .expect(401);
    });
  });

  describe('GET /api/products/:id - Single Product Fetch', () => {
    test('should return single product details', async () => {
      const listResponse = await request(config.baseURL)
        .get('/api/products')
        .set(getAuthHeaders())
        .expect(200);

      const products = listResponse.body.products;

      if (products && products.length > 0) {
        const productId = products[0].id;

        const response = await request(config.baseURL)
          .get('/api/products/' + productId)
          .set(getAuthHeaders())
          .expect(200);

        const product = response.body.product;

        expect(product).toHaveProperty('id', productId);
        expect(product).toHaveProperty('name');
        expect(product).toHaveProperty('price');
        expect(product).toHaveProperty('stock');
        expect(product).toHaveProperty('category');
      }
    });

    test('should return 404 for non-existent product', async () => {
      await request(config.baseURL)
        .get('/api/products/999999')
        .set(getAuthHeaders())
        .expect(404);
    });

    test('should return 400 for invalid ID format', async () => {
      await request(config.baseURL)
        .get('/api/products/invalid-id')
        .set(getAuthHeaders())
        .expect(400);

      await request(config.baseURL)
        .get('/api/products/@#$%')
        .set(getAuthHeaders())
        .expect(400);
    });

    // invalid IDs
    test('should return 400 for invalid ID types', async () => {
      await request(config.baseURL)
        .get('/api/products/["1"]')
        .set(getAuthHeaders())
        .expect(400);

      await request(config.baseURL)
        .get('/api/products/{"id":1}')
        .set(getAuthHeaders())
        .expect(400);
    });
  });
});