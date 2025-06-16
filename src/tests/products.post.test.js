const request = require('supertest');
const config = require('../config/api.config');
const {
  getAuthHeaders
} = require('../helpers/auth.helper');

describe('Products API', () => {
  describe('POST /api/products - Product Creation', () => {
    const validProduct = {
      name: 'Test Product',
      price: 29.99,
      stock: 100,
      category: 'Electronics',
      description: 'A test product for API testing'
    };

    // Valid product creation
    test('should create product with valid data', async () => {
      const response = await request(config.baseURL)
        .post('/api/products')
        .set(getAuthHeaders())
        .send(validProduct)
        .expect(201);

      expect(response.body.product).toHaveProperty('id');
      expect(response.body.product.name).toBe(validProduct.name);
      expect(response.body.product.price).toBe(validProduct.price);
      expect(response.body.product.stock).toBe(validProduct.stock);
      expect(response.body.product.category).toBe(validProduct.category);
    });

    test('should create product with minimum required fields only', async () => {
      const minProduct = {
        name: 'Min Product',
        price: 10.00,
        category: 'Test'
      };

      const response = await request(config.baseURL)
        .post('/api/products')
        .set(getAuthHeaders())
        .send(minProduct)
        .expect(201);

      expect(response.body.product).toHaveProperty('id');
      expect(response.body.product.name).toBe(minProduct.name);
    });

    // Required field validation
    test('should return 400 when name is missing', async () => {
      const product = { ...validProduct };
      delete product.name;

      await request(config.baseURL)
        .post('/api/products')
        .set(getAuthHeaders())
        .send(product)
        .expect(400);
    });

    test('should return 400 when price is missing', async () => {
      const product = { ...validProduct };
      delete product.price;

      await request(config.baseURL)
        .post('/api/products')
        .set(getAuthHeaders())
        .send(product)
        .expect(400);
    });

    test('should return 400 when category is missing', async () => {
      const product = { ...validProduct };
      delete product.category;

      await request(config.baseURL)
        .post('/api/products')
        .set(getAuthHeaders())
        .send(product)
        .expect(400);
    });

    // Data type validation
    test('should return 400 for invalid price type (string)', async () => {
      const product = { ...validProduct, price: 'invalid' };

      await request(config.baseURL)
        .post('/api/products')
        .set(getAuthHeaders())
        .send(product)
        .expect(400);
    });

    test('should return 400 for invalid stock type (string)', async () => {
      const product = { ...validProduct, stock: 'invalid' };

      await request(config.baseURL)
        .post('/api/products')
        .set(getAuthHeaders())
        .send(product)
        .expect(400);
    });

    test('should return 400 for invalid price type (negative)', async () => {
      const product = { ...validProduct, price: -10.50 };

      await request(config.baseURL)
        .post('/api/products')
        .set(getAuthHeaders())
        .send(product)
        .expect(400);
    });

    test('should return 400 for invalid stock (negative)', async () => {
      const product = { ...validProduct, stock: -5 };

      await request(config.baseURL)
        .post('/api/products')
        .set(getAuthHeaders())
        .send(product)
        .expect(400);
    });

    // Field length validation
    test('should return 400 for name too long', async () => {
      const product = { ...validProduct, name: 'a'.repeat(256) };

      await request(config.baseURL)
        .post('/api/products')
        .set(getAuthHeaders())
        .send(product)
        .expect(400);
    });

    test('should return 400 for empty name', async () => {
      const product = { ...validProduct, name: '' };

      await request(config.baseURL)
        .post('/api/products')
        .set(getAuthHeaders())
        .send(product)
        .expect(400);
    });

    test('should return 400 for description too long', async () => {
      const product = { ...validProduct, description: 'a'.repeat(1001) };

      await request(config.baseURL)
        .post('/api/products')
        .set(getAuthHeaders())
        .send(product)
        .expect(400);
    });

    // SQL injection and XSS attempts
    test('should return 400 for SQL injection in name', async () => {
      const product = { ...validProduct, name: "'; DROP TABLE products; --" };

      await request(config.baseURL)
        .post('/api/products')
        .set(getAuthHeaders())
        .send(product)
        .expect(400);
    });

    test('should return 400 for XSS script in name', async () => {
      const product = { ...validProduct, name: '<script>alert("xss")</script>' };

      await request(config.baseURL)
        .post('/api/products')
        .set(getAuthHeaders())
        .send(product)
        .expect(400);
    });

    test('should return 400 for XSS script in description', async () => {
      const product = { ...validProduct, description: '<script>alert("xss")</script>' };

      await request(config.baseURL)
        .post('/api/products')
        .set(getAuthHeaders())
        .send(product)
        .expect(400);
    });

    // Invalid JSON and malformed requests
    test('should return 400 for malformed JSON', async () => {
      await request(config.baseURL)
        .post('/api/products')
        .set(getAuthHeaders())
        .set('Content-Type', 'application/json')
        .send('{"name": "test", "price":}')
        .expect(400);
    });

    test('should return 400 for empty request body', async () => {
      await request(config.baseURL)
        .post('/api/products')
        .set(getAuthHeaders())
        .send({})
        .expect(400);
    });

    // Unexpected fields handling
    test('should ignore unexpected fields gracefully', async () => {
      const product = { 
        ...validProduct, 
        unexpectedField: 'should be ignored',
        admin: true,
        id: 999 // should not set custom ID
      };

      const response = await request(config.baseURL)
        .post('/api/products')
        .set(getAuthHeaders())
        .send(product)
        .expect(201);

      expect(response.body.product).not.toHaveProperty('unexpectedField');
      expect(response.body.product).not.toHaveProperty('admin');
      expect(response.body.product.id).not.toBe(999); // should be auto-generated
    });

    // Edge cases for numeric values
    test('should handle maximum safe integer for stock', async () => {
      const product = { ...validProduct, stock: Number.MAX_SAFE_INTEGER };

      await request(config.baseURL)
        .post('/api/products')
        .set(getAuthHeaders())
        .send(product)
        .expect(400); // likely to fail due to business logic limits
    });

    test('should handle decimal prices correctly', async () => {
      const product = { ...validProduct, price: 99.999 };

      const response = await request(config.baseURL)
        .post('/api/products')
        .set(getAuthHeaders())
        .send(product)
        .expect(201);

      // Should round to 2 decimal places
      expect(response.body.product.price).toBe(100.00);
    });

    test('should return 400 for price with too many decimal places', async () => {
      const product = { ...validProduct, price: 29.99999 };

      await request(config.baseURL)
        .post('/api/products')
        .set(getAuthHeaders())
        .send(product)
        .expect(400);
    });

    // Duplicate product handling
    test('should return 409 for duplicate product name', async () => {
      // Create first product
      await request(config.baseURL)
        .post('/api/products')
        .set(getAuthHeaders())
        .send(validProduct)
        .expect(201);

      // Try to create duplicate
      await request(config.baseURL)
        .post('/api/products')
        .set(getAuthHeaders())
        .send(validProduct)
        .expect(409);
    });

    // Content-Type validation
    test('should return 400 for wrong content type', async () => {
      await request(config.baseURL)
        .post('/api/products')
        .set(getAuthHeaders())
        .set('Content-Type', 'text/plain')
        .send('not json')
        .expect(400);
    });

    // Array and object injection attempts
    test('should return 400 for array in name field', async () => {
      const product = { ...validProduct, name: ['array', 'values'] };

      await request(config.baseURL)
        .post('/api/products')
        .set(getAuthHeaders())
        .send(product)
        .expect(400);
    });

    test('should return 400 for nested object in price', async () => {
      const product = { ...validProduct, price: { amount: 29.99 } };

      await request(config.baseURL)
        .post('/api/products')
        .set(getAuthHeaders())
        .send(product)
        .expect(400);
    });

    // Special characters and unicode
    test('should handle unicode characters in product name', async () => {
      const product = { ...validProduct, name: 'Product with émojis 🚀✨' };

      const response = await request(config.baseURL)
        .post('/api/products')
        .set(getAuthHeaders())
        .send(product)
        .expect(201);

      expect(response.body.product.name).toBe(product.name);
    });

    test('should return 400 for null values in required fields', async () => {
      const product = { ...validProduct, name: null };

      await request(config.baseURL)
        .post('/api/products')
        .set(getAuthHeaders())
        .send(product)
        .expect(400);
    });

    // Large payload handling
    test('should return 413 for payload too large', async () => {
      const largeProduct = {
        ...validProduct,
        description: 'x'.repeat(10000000) // 10MB string
      };

      await request(config.baseURL)
        .post('/api/products')
        .set(getAuthHeaders())
        .send(largeProduct)
        .expect(413);
    });
  });

  describe('POST /api/products - Authentication', () => {
    const validProduct = {
      name: 'Auth Test Product',
      price: 19.99,
      stock: 50,
      category: 'Test'
    };

    test('should require authentication', async () => {
      await request(config.baseURL)
        .post('/api/products')
        .send(validProduct)
        .expect(401);
    });

    test('should return 401 for invalid token', async () => {
      await request(config.baseURL)
        .post('/api/products')
        .set('Authorization', 'Bearer invalid-token')
        .send(validProduct)
        .expect(401);
    });

    test('should return 401 for expired token', async () => {
      await request(config.baseURL)
        .post('/api/products')
        .set('Authorization', 'Bearer expired.token.here')
        .send(validProduct)
        .expect(401);
    });
  });

  describe('POST /api/products - Rate Limiting & Performance', () => {
    const validProduct = {
      name: 'Rate Limit Test',
      price: 15.99,
      stock: 25,
      category: 'Test'
    };

    test('should handle concurrent requests properly', async () => {
      const requests = Array(5).fill().map((_, i) => 
        request(config.baseURL)
          .post('/api/products')
          .set(getAuthHeaders())
          .send({ ...validProduct, name: `Concurrent Product ${i}` })
      );

      const responses = await Promise.all(requests);
      
      // At least some should succeed
      const successCount = responses.filter(r => r.status === 201).length;
      expect(successCount).toBeGreaterThan(0);
    });

    test('should return 429 when rate limit exceeded', async () => {
      // Rapidly send many requests
      const requests = Array(100).fill().map((_, i) => 
        request(config.baseURL)
          .post('/api/products')
          .set(getAuthHeaders())
          .send({ ...validProduct, name: `Rate Test ${i}` })
      );

      const responses = await Promise.allSettled(requests);
      
      // Some should be rate limited
      const rateLimited = responses.some(r => 
        r.status === 'fulfilled' && r.value.status === 429
      );
      expect(rateLimited).toBe(true);
    });
  });
});