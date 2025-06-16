const request = require('supertest');
const config = require('../config/api.config');
const {
  getAuthHeaders
} = require('../helpers/auth.helper');

describe('Products API', () => {
  let testProductId;

  // Setup - Create a test product before running PUT tests
  beforeAll(async () => {
    const testProduct = {
      name: 'Test Product for PUT',
      price: 29.99,
      stock: 100,
      category: 'Electronics',
      description: 'Original test product'
    };

    const response = await request(config.baseURL)
      .post('/api/products')
      .set(getAuthHeaders())
      .send(testProduct);

    testProductId = response.body.product.id;
  });

  describe('PUT /api/products/:id - Product Update', () => {
    const validUpdate = {
      name: 'Updated Product Name',
      price: 39.99,
      stock: 150,
      category: 'Updated Category',
      description: 'Updated description'
    };

    // Valid update operations
    test('should update product with all fields', async () => {
      const response = await request(config.baseURL)
        .put(`/api/products/${testProductId}`)
        .set(getAuthHeaders())
        .send(validUpdate)
        .expect(200);

      expect(response.body.product.id).toBe(testProductId);
      expect(response.body.product.name).toBe(validUpdate.name);
      expect(response.body.product.price).toBe(validUpdate.price);
      expect(response.body.product.stock).toBe(validUpdate.stock);
      expect(response.body.product.category).toBe(validUpdate.category);
      expect(response.body.product.description).toBe(validUpdate.description);
    });

    test('should update product with partial fields only', async () => {
      const partialUpdate = {
        name: 'Partially Updated Name',
        price: 49.99
      };

      const response = await request(config.baseURL)
        .put(`/api/products/${testProductId}`)
        .set(getAuthHeaders())
        .send(partialUpdate)
        .expect(200);

      expect(response.body.product.name).toBe(partialUpdate.name);
      expect(response.body.product.price).toBe(partialUpdate.price);
      // Other fields should remain unchanged
      expect(response.body.product.id).toBe(testProductId);
    });

    test('should update only name field', async () => {
      const nameUpdate = {
        name: 'Name Only Update'
      };

      const response = await request(config.baseURL)
        .put(`/api/products/${testProductId}`)
        .set(getAuthHeaders())
        .send(nameUpdate)
        .expect(200);

      expect(response.body.product.name).toBe(nameUpdate.name);
    });

    test('should update only price field', async () => {
      const priceUpdate = {
        price: 99.99
      };

      const response = await request(config.baseURL)
        .put(`/api/products/${testProductId}`)
        .set(getAuthHeaders())
        .send(priceUpdate)
        .expect(200);

      expect(response.body.product.price).toBe(priceUpdate.price);
    });

    // ID validation
    test('should return 404 for non-existent product ID', async () => {
      await request(config.baseURL)
        .put('/api/products/999999')
        .set(getAuthHeaders())
        .send(validUpdate)
        .expect(404);
    });

    test('should return 400 for invalid ID format', async () => {
      await request(config.baseURL)
        .put('/api/products/invalid-id')
        .set(getAuthHeaders())
        .send(validUpdate)
        .expect(400);
    });

    test('should return 400 for special characters in ID', async () => {
      await request(config.baseURL)
        .put('/api/products/@#$%')
        .set(getAuthHeaders())
        .send(validUpdate)
        .expect(400);
    });

    test('should return 400 for array/object in ID', async () => {
      await request(config.baseURL)
        .put('/api/products/["123"]')
        .set(getAuthHeaders())
        .send(validUpdate)
        .expect(400);

      await request(config.baseURL)
        .put('/api/products/{"id":123}')
        .set(getAuthHeaders())
        .send(validUpdate)
        .expect(400);
    });

    // Data validation
    test('should return 400 for invalid price type (string)', async () => {
      const invalidUpdate = {
        price: 'invalid-price'
      };

      await request(config.baseURL)
        .put(`/api/products/${testProductId}`)
        .set(getAuthHeaders())
        .send(invalidUpdate)
        .expect(400);
    });

    test('should return 400 for negative price', async () => {
      const invalidUpdate = {
        price: -10.50
      };

      await request(config.baseURL)
        .put(`/api/products/${testProductId}`)
        .set(getAuthHeaders())
        .send(invalidUpdate)
        .expect(400);
    });

    test('should return 400 for invalid stock type', async () => {
      const invalidUpdate = {
        stock: 'invalid-stock'
      };

      await request(config.baseURL)
        .put(`/api/products/${testProductId}`)
        .set(getAuthHeaders())
        .send(invalidUpdate)
        .expect(400);
    });

    test('should return 400 for negative stock', async () => {
      const invalidUpdate = {
        stock: -5
      };

      await request(config.baseURL)
        .put(`/api/products/${testProductId}`)
        .set(getAuthHeaders())
        .send(invalidUpdate)
        .expect(400);
    });

    test('should return 400 for empty name', async () => {
      const invalidUpdate = {
        name: ''
      };

      await request(config.baseURL)
        .put(`/api/products/${testProductId}`)
        .set(getAuthHeaders())
        .send(invalidUpdate)
        .expect(400);
    });

    test('should return 400 for name too long', async () => {
      const invalidUpdate = {
        name: 'a'.repeat(256)
      };

      await request(config.baseURL)
        .put(`/api/products/${testProductId}`)
        .set(getAuthHeaders())
        .send(invalidUpdate)
        .expect(400);
    });

    test('should return 400 for description too long', async () => {
      const invalidUpdate = {
        description: 'a'.repeat(1001)
      };

      await request(config.baseURL)
        .put(`/api/products/${testProductId}`)
        .set(getAuthHeaders())
        .send(invalidUpdate)
        .expect(400);
    });

    // Null and undefined handling
    test('should return 400 for null values in fields', async () => {
      const invalidUpdate = {
        name: null
      };

      await request(config.baseURL)
        .put(`/api/products/${testProductId}`)
        .set(getAuthHeaders())
        .send(invalidUpdate)
        .expect(400);
    });

    test('should handle undefined values gracefully', async () => {
      const updateWithUndefined = {
        name: 'Valid Name',
        price: undefined // should be ignored or handled gracefully
      };

      const response = await request(config.baseURL)
        .put(`/api/products/${testProductId}`)
        .set(getAuthHeaders())
        .send(updateWithUndefined)
        .expect(200);

      expect(response.body.product.name).toBe(updateWithUndefined.name);
    });

    // Security tests
    test('should return 400 for SQL injection in name', async () => {
      const maliciousUpdate = {
        name: "'; DROP TABLE products; --"
      };

      await request(config.baseURL)
        .put(`/api/products/${testProductId}`)
        .set(getAuthHeaders())
        .send(maliciousUpdate)
        .expect(400);
    });

    test('should return 400 for XSS script in name', async () => {
      const maliciousUpdate = {
        name: '<script>alert("xss")</script>'
      };

      await request(config.baseURL)
        .put(`/api/products/${testProductId}`)
        .set(getAuthHeaders())
        .send(maliciousUpdate)
        .expect(400);
    });

    test('should return 400 for XSS script in description', async () => {
      const maliciousUpdate = {
        description: '<img src=x onerror=alert("xss")>'
      };

      await request(config.baseURL)
        .put(`/api/products/${testProductId}`)
        .set(getAuthHeaders())
        .send(maliciousUpdate)
        .expect(400);
    });

    // ID immutability
    test('should ignore ID field in update payload', async () => {
      const updateWithId = {
        id: 999999,
        name: 'Name with ID attempt'
      };

      const response = await request(config.baseURL)
        .put(`/api/products/${testProductId}`)
        .set(getAuthHeaders())
        .send(updateWithId)
        .expect(200);

      expect(response.body.product.id).toBe(testProductId); // Should remain original ID
      expect(response.body.product.id).not.toBe(999999);
    });

    // Unexpected fields
    test('should ignore unexpected fields', async () => {
      const updateWithExtra = {
        name: 'Updated Name',
        unexpectedField: 'should be ignored',
        admin: true,
        password: 'secret'
      };

      const response = await request(config.baseURL)
        .put(`/api/products/${testProductId}`)
        .set(getAuthHeaders())
        .send(updateWithExtra)
        .expect(200);

      expect(response.body.product.name).toBe(updateWithExtra.name);
      expect(response.body.product).not.toHaveProperty('unexpectedField');
      expect(response.body.product).not.toHaveProperty('admin');
      expect(response.body.product).not.toHaveProperty('password');
    });

    // Empty body handling
    test('should handle empty update body', async () => {
      const response = await request(config.baseURL)
        .put(`/api/products/${testProductId}`)
        .set(getAuthHeaders())
        .send({})
        .expect(200); // Should return unchanged product

      expect(response.body.product.id).toBe(testProductId);
    });

    // Malformed requests
    test('should return 400 for malformed JSON', async () => {
      await request(config.baseURL)
        .put(`/api/products/${testProductId}`)
        .set(getAuthHeaders())
        .set('Content-Type', 'application/json')
        .send('{"name": "test", "price":}')
        .expect(400);
    });

    test('should return 400 for wrong content type', async () => {
      await request(config.baseURL)
        .put(`/api/products/${testProductId}`)
        .set(getAuthHeaders())
        .set('Content-Type', 'text/plain')
        .send('not json')
        .expect(400);
    });

    // Array/object injection
    test('should return 400 for array in primitive fields', async () => {
      const invalidUpdate = {
        name: ['array', 'name']
      };

      await request(config.baseURL)
        .put(`/api/products/${testProductId}`)
        .set(getAuthHeaders())
        .send(invalidUpdate)
        .expect(400);
    });

    test('should return 400 for object in primitive fields', async () => {
      const invalidUpdate = {
        price: {
          amount: 29.99,
          currency: 'USD'
        }
      };

      await request(config.baseURL)
        .put(`/api/products/${testProductId}`)
        .set(getAuthHeaders())
        .send(invalidUpdate)
        .expect(400);
    });

    // Decimal precision
    test('should handle decimal prices correctly', async () => {
      const updateWithDecimal = {
        price: 99.999
      };

      const response = await request(config.baseURL)
        .put(`/api/products/${testProductId}`)
        .set(getAuthHeaders())
        .send(updateWithDecimal)
        .expect(200);

      // Should round to 2 decimal places
      expect(response.body.product.price).toBe(100.00);
    });

    test('should return 400 for price with too many decimals', async () => {
      const invalidUpdate = {
        price: 29.99999
      };

      await request(config.baseURL)
        .put(`/api/products/${testProductId}`)
        .set(getAuthHeaders())
        .send(invalidUpdate)
        .expect(400);
    });

    // Edge cases
    test('should handle maximum safe integer values', async () => {
      const edgeUpdate = {
        stock: Number.MAX_SAFE_INTEGER
      };

      await request(config.baseURL)
        .put(`/api/products/${testProductId}`)
        .set(getAuthHeaders())
        .send(edgeUpdate)
        .expect(400); // Should fail business validation
    });

    test('should handle unicode characters', async () => {
      const unicodeUpdate = {
        name: 'Product with émojis 🔥✨'
      };

      const response = await request(config.baseURL)
        .put(`/api/products/${testProductId}`)
        .set(getAuthHeaders())
        .send(unicodeUpdate)
        .expect(200);

      expect(response.body.product.name).toBe(unicodeUpdate.name);
    });

    // Duplicate handling
    test('should return 409 for duplicate name with different product', async () => {
      // Create another product first
      const anotherProduct = {
        name: 'Another Product',
        price: 19.99,
        category: 'Test'
      };

      const createResponse = await request(config.baseURL)
        .post('/api/products')
        .set(getAuthHeaders())
        .send(anotherProduct);

      const anotherProductId = createResponse.body.product.id;

      // Try to update testProduct with the same name as anotherProduct
      const duplicateUpdate = {
        name: 'Another Product'
      };

      await request(config.baseURL)
        .put(`/api/products/${testProductId}`)
        .set(getAuthHeaders())
        .send(duplicateUpdate)
        .expect(409);
    });

    // Large payload
    test('should return 413 for payload too large', async () => {
      const largeUpdate = {
        description: 'x'.repeat(10000000) // 10MB string
      };

      await request(config.baseURL)
        .put(`/api/products/${testProductId}`)
        .set(getAuthHeaders())
        .send(largeUpdate)
        .expect(413);
    });

    // Concurrent updates
    test('should handle concurrent updates properly', async () => {
      const updates = Array(5).fill().map((_, i) => ({
        name: `Concurrent Update ${i}`,
        price: 10 + i
      }));

      const requests = updates.map(update =>
        request(config.baseURL)
        .put(`/api/products/${testProductId}`)
        .set(getAuthHeaders())
        .send(update)
      );

      const responses = await Promise.allSettled(requests);

      // At least one should succeed
      const successCount = responses.filter(r =>
        r.status === 'fulfilled' && r.value.status === 200
      ).length;
      expect(successCount).toBeGreaterThan(0);
    });

    // Idempotency test
    test('should be idempotent - same update twice should yield same result', async () => {
      const idempotentUpdate = {
        name: 'Idempotent Test',
        price: 77.77
      };

      const response1 = await request(config.baseURL)
        .put(`/api/products/${testProductId}`)
        .set(getAuthHeaders())
        .send(idempotentUpdate)
        .expect(200);

      const response2 = await request(config.baseURL)
        .put(`/api/products/${testProductId}`)
        .set(getAuthHeaders())
        .send(idempotentUpdate)
        .expect(200);

      expect(response1.body.product.name).toBe(response2.body.product.name);
      expect(response1.body.product.price).toBe(response2.body.product.price);
    });
  });

  describe('PUT /api/products/:id - Authentication', () => {
    const updateData = {
      name: 'Auth Test Update',
      price: 25.99
    };

    test('should require authentication', async () => {
      await request(config.baseURL)
        .put(`/api/products/${testProductId}`)
        .send(updateData)
        .expect(401);
    });

    test('should return 401 for invalid token', async () => {
      await request(config.baseURL)
        .put(`/api/products/${testProductId}`)
        .set('Authorization', 'Bearer invalid-token')
        .send(updateData)
        .expect(401);
    });

    test('should return 401 for expired token', async () => {
      await request(config.baseURL)
        .put(`/api/products/${testProductId}`)
        .set('Authorization', 'Bearer expired.token.here')
        .send(updateData)
        .expect(401);
    });

    test('should return 401 for malformed auth header', async () => {
      await request(config.baseURL)
        .put(`/api/products/${testProductId}`)
        .set('Authorization', 'InvalidFormat token')
        .send(updateData)
        .expect(401);
    });
  });

  describe('PUT /api/products/:id - HTTP Method Validation', () => {
    test('should return 405 for unsupported methods on product endpoint', async () => {
      await request(config.baseURL)
        .patch(`/api/products/${testProductId}`)
        .set(getAuthHeaders())
        .send({
          name: 'Patch Test'
        })
        .expect(405);
    });

    test('should handle OPTIONS request properly', async () => {
      const response = await request(config.baseURL)
        .options(`/api/products/${testProductId}`)
        .set(getAuthHeaders());

      expect(response.status).toBeOneOf([200, 204]);
      expect(response.headers['allow']).toContain('PUT');
    });
  });

  describe('PUT /api/products/:id - Race Conditions & Consistency', () => {
    test('should handle rapid successive updates', async () => {
      const updates = [{
          name: 'Update 1',
          price: 10.00
        },
        {
          name: 'Update 2',
          price: 20.00
        },
        {
          name: 'Update 3',
          price: 30.00
        }
      ];

      // Send updates in rapid succession
      for (const update of updates) {
        await request(config.baseURL)
          .put(`/api/products/${testProductId}`)
          .set(getAuthHeaders())
          .send(update)
          .expect(200);
      }

      // Final state should be consistent
      const finalResponse = await request(config.baseURL)
        .get(`/api/products/${testProductId}`)
        .set(getAuthHeaders())
        .expect(200);

      expect(finalResponse.body.product.name).toBe('Update 3');
      expect(finalResponse.body.product.price).toBe(30.00);
    });
  });
});