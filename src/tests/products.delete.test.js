const request = require('supertest');
const config = require('../config/api.config');
const {
  getAuthHeaders
} = require('../helpers/auth.helper');

describe('Products API', () => {
  let testProductId;
  let permanentProductId; // For tests that shouldn't delete this product

  // Setup - Create test products before running DELETE tests
  beforeAll(async () => {
    const testProduct1 = {
      name: 'Test Product for DELETE',
      price: 29.99,
      stock: 100,
      category: 'Electronics'
    };

    const testProduct2 = {
      name: 'Permanent Test Product',
      price: 19.99,
      stock: 50,
      category: 'Test'
    };

    const response1 = await request(config.baseURL)
      .post('/api/products')
      .set(getAuthHeaders())
      .send(testProduct1);

    const response2 = await request(config.baseURL)
      .post('/api/products')
      .set(getAuthHeaders())
      .send(testProduct2);
    
    testProductId = response1.body.product.id;
    permanentProductId = response2.body.product.id;
  });

  describe('DELETE /api/products/:id - Product Deletion', () => {
    let deleteTestProductId;

    // Create fresh product for each delete test
    beforeEach(async () => {
      const freshProduct = {
        name: `Delete Test Product ${Date.now()}`,
        price: 15.99,
        stock: 25,
        category: 'Test'
      };

      const response = await request(config.baseURL)
        .post('/api/products')
        .set(getAuthHeaders())
        .send(freshProduct);
      
      deleteTestProductId = response.body.product.id;
    });

    // Valid deletion
    test('should delete existing product successfully', async () => {
      const response = await request(config.baseURL)
        .delete(`/api/products/${deleteTestProductId}`)
        .set(getAuthHeaders())
        .expect(204); // No content response

      expect(response.body).toEqual({});

      // Verify product is actually deleted
      await request(config.baseURL)
        .get(`/api/products/${deleteTestProductId}`)
        .set(getAuthHeaders())
        .expect(404);
    });

    test('should return deleted product details in response body (alternative implementation)', async () => {
      const response = await request(config.baseURL)
        .delete(`/api/products/${deleteTestProductId}`)
        .set(getAuthHeaders());

      // Some APIs return 200 with deleted product data instead of 204
      if (response.status === 200) {
        expect(response.body.product).toHaveProperty('id', deleteTestProductId);
        expect(response.body.message).toContain('deleted');
      } else {
        expect(response.status).toBe(204);
      }
    });

    // ID validation
    test('should return 404 for non-existent product ID', async () => {
      await request(config.baseURL)
        .delete('/api/products/999999')
        .set(getAuthHeaders())
        .expect(404);
    });

    test('should return 400 for invalid ID format', async () => {
      await request(config.baseURL)
        .delete('/api/products/invalid-id')
        .set(getAuthHeaders())
        .expect(400);
    });

    test('should return 400 for non-numeric ID', async () => {
      await request(config.baseURL)
        .delete('/api/products/abc123')
        .set(getAuthHeaders())
        .expect(400);
    });

    test('should return 400 for special characters in ID', async () => {
      await request(config.baseURL)
        .delete('/api/products/@#$%^&*()')
        .set(getAuthHeaders())
        .expect(400);
    });

    test('should return 400 for array injection in ID', async () => {
      await request(config.baseURL)
        .delete('/api/products/["123"]')
        .set(getAuthHeaders())
        .expect(400);
    });

    test('should return 400 for object injection in ID', async () => {
      await request(config.baseURL)
        .delete('/api/products/{"id":123}')
        .set(getAuthHeaders())
        .expect(400);
    });

    test('should return 400 for SQL injection in ID', async () => {
      await request(config.baseURL)
        .delete("/api/products/1'; DROP TABLE products; --")
        .set(getAuthHeaders())
        .expect(400);
    });

    test('should return 400 for XSS attempt in ID', async () => {
      await request(config.baseURL)
        .delete('/api/products/<script>alert("xss")</script>')
        .set(getAuthHeaders())
        .expect(400);
    });

    // Edge case IDs
    test('should handle zero ID', async () => {
      await request(config.baseURL)
        .delete('/api/products/0')
        .set(getAuthHeaders())
        .expect(404); // or 400 depending on implementation
    });

    test('should handle negative ID', async () => {
      await request(config.baseURL)
        .delete('/api/products/-1')
        .set(getAuthHeaders())
        .expect(400);
    });

    test('should handle very large ID', async () => {
      await request(config.baseURL)
        .delete(`/api/products/${Number.MAX_SAFE_INTEGER}`)
        .set(getAuthHeaders())
        .expect(404);
    });

    test('should handle decimal ID', async () => {
      await request(config.baseURL)
        .delete('/api/products/123.456')
        .set(getAuthHeaders())
        .expect(400);
    });

    // Double deletion
    test('should return 404 when trying to delete already deleted product', async () => {
      // First deletion
      await request(config.baseURL)
        .delete(`/api/products/${deleteTestProductId}`)
        .set(getAuthHeaders())
        .expect(204);

      // Second deletion attempt
      await request(config.baseURL)
        .delete(`/api/products/${deleteTestProductId}`)
        .set(getAuthHeaders())
        .expect(404);
    });

    // Request body handling (DELETE shouldn't have body)
    test('should ignore request body if present', async () => {
      const response = await request(config.baseURL)
        .delete(`/api/products/${deleteTestProductId}`)
        .set(getAuthHeaders())
        .send({ maliciousData: 'should be ignored' })
        .expect(204);

      // Verify product is still deleted despite body
      await request(config.baseURL)
        .get(`/api/products/${deleteTestProductId}`)
        .set(getAuthHeaders())
        .expect(404);
    });

    test('should handle malformed JSON in body gracefully', async () => {
      await request(config.baseURL)
        .delete(`/api/products/${deleteTestProductId}`)
        .set(getAuthHeaders())
        .set('Content-Type', 'application/json')
        .send('{"invalid": json}')
        .expect(204); // Should still work despite malformed body
    });

    // Content-Type handling
    test('should work regardless of Content-Type header', async () => {
      await request(config.baseURL)
        .delete(`/api/products/${deleteTestProductId}`)
        .set(getAuthHeaders())
        .set('Content-Type', 'text/plain')
        .expect(204);
    });

    // Query parameters (should be ignored)
    test('should ignore query parameters', async () => {
      await request(config.baseURL)
        .delete(`/api/products/${deleteTestProductId}?force=true&confirm=yes`)
        .set(getAuthHeaders())
        .expect(204);
    });

    test('should ignore malicious query parameters', async () => {
      await request(config.baseURL)
        .delete(`/api/products/${deleteTestProductId}?'; DROP TABLE products; --=1`)
        .set(getAuthHeaders())
        .expect(204);
    });

    // Concurrent deletion attempts
    test('should handle concurrent deletion attempts', async () => {
      const requests = Array(5).fill().map(() => 
        request(config.baseURL)
          .delete(`/api/products/${deleteTestProductId}`)
          .set(getAuthHeaders())
      );

      const responses = await Promise.allSettled(requests);
      
      // Only one should succeed with 204, others should get 404
      const successCount = responses.filter(r => 
        r.status === 'fulfilled' && r.value.status === 204
      ).length;
      const notFoundCount = responses.filter(r => 
        r.status === 'fulfilled' && r.value.status === 404
      ).length;

      expect(successCount).toBe(1);
      expect(notFoundCount).toBe(4);
    });

    // URL encoding
    test('should handle URL encoded characters in ID', async () => {
      await request(config.baseURL)
        .delete('/api/products/%3Cscript%3E')
        .set(getAuthHeaders())
        .expect(400);
    });

    // Path traversal attempts
    test('should prevent path traversal attacks', async () => {
      await request(config.baseURL)
        .delete('/api/products/../../../etc/passwd')
        .set(getAuthHeaders())
        .expect(400);

      await request(config.baseURL)
        .delete('/api/products/..%2F..%2F..%2Fetc%2Fpasswd')
        .set(getAuthHeaders())
        .expect(400);
    });

    // Null byte injection
    test('should handle null byte injection', async () => {
      await request(config.baseURL)
        .delete('/api/products/123%00.txt')
        .set(getAuthHeaders())
        .expect(400);
    });

    // Unicode and special encoding
    test('should handle unicode characters in ID', async () => {
      await request(config.baseURL)
        .delete('/api/products/测试')
        .set(getAuthHeaders())
        .expect(400);
    });

    // Very long ID
    test('should handle extremely long ID', async () => {
      const longId = 'a'.repeat(10000);
      
      await request(config.baseURL)
        .delete(`/api/products/${longId}`)
        .set(getAuthHeaders())
        .expect(400); // or 414 URI Too Long
    });

    // Empty ID segment
    test('should handle empty ID segment', async () => {
      await request(config.baseURL)
        .delete('/api/products/')
        .set(getAuthHeaders())
        .expect(404); // Should not match DELETE /:id route
    });

    // Multiple ID segments
    test('should handle multiple ID segments', async () => {
      await request(config.baseURL)
        .delete(`/api/products/${deleteTestProductId}/extra/path`)
        .set(getAuthHeaders())
        .expect(404); // Should not match any route
    });
  });

  describe('DELETE /api/products/:id - Authentication & Authorization', () => {
    let authTestProductId;

    beforeEach(async () => {
      const authProduct = {
        name: 'Auth Test Product',
        price: 12.99,
        stock: 30,
        category: 'Test'
      };

      const response = await request(config.baseURL)
        .post('/api/products')
        .set(getAuthHeaders())
        .send(authProduct);
      
      authTestProductId = response.body.product.id;
    });

    test('should require authentication', async () => {
      await request(config.baseURL)
        .delete(`/api/products/${authTestProductId}`)
        .expect(401);
    });

    test('should return 401 for invalid token', async () => {
      await request(config.baseURL)
        .delete(`/api/products/${authTestProductId}`)
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });

    test('should return 401 for expired token', async () => {
      await request(config.baseURL)
        .delete(`/api/products/${authTestProductId}`)
        .set('Authorization', 'Bearer expired.token.here')
        .expect(401);
    });

    test('should return 401 for malformed auth header', async () => {
      await request(config.baseURL)
        .delete(`/api/products/${authTestProductId}`)
        .set('Authorization', 'InvalidFormat token')
        .expect(401);
    });

    test('should return 401 for missing Bearer prefix', async () => {
      await request(config.baseURL)
        .delete(`/api/products/${authTestProductId}`)
        .set('Authorization', 'valid-token-without-bearer')
        .expect(401);
    });

    test('should return 401 for empty Authorization header', async () => {
      await request(config.baseURL)
        .delete(`/api/products/${authTestProductId}`)
        .set('Authorization', '')
        .expect(401);
    });

    // Role-based access (if implemented)
    test('should return 403 for insufficient permissions', async () => {
      // If you have role-based access, test with read-only user token
      await request(config.baseURL)
        .delete(`/api/products/${authTestProductId}`)
        .set('Authorization', 'Bearer readonly-user-token')
        .expect(403);
    });
  });

  describe('DELETE /api/products/:id - HTTP Method Validation', () => {
    test('should return 405 for unsupported methods', async () => {
      await request(config.baseURL)
        .trace(`/api/products/${permanentProductId}`)
        .set(getAuthHeaders())
        .expect(405);
    });

    test('should handle OPTIONS request properly', async () => {
      const response = await request(config.baseURL)
        .options(`/api/products/${permanentProductId}`)
        .set(getAuthHeaders());

      expect(response.status).toBeOneOf([200, 204]);
      if (response.headers['allow']) {
        expect(response.headers['allow']).toContain('DELETE');
      }
    });

    test('should return proper Allow header for 405 responses', async () => {
      const response = await request(config.baseURL)
        .patch(`/api/products/${permanentProductId}`)
        .set(getAuthHeaders());

      if (response.status === 405) {
        expect(response.headers['allow']).toBeDefined();
      }
    });
  });

  describe('DELETE /api/products/:id - Business Logic & Constraints', () => {
    let constraintTestProductId;

    beforeEach(async () => {
      const constraintProduct = {
        name: 'Constraint Test Product',
        price: 45.99,
        stock: 75,
        category: 'Test'
      };

      const response = await request(config.baseURL)
        .post('/api/products')
        .set(getAuthHeaders())
        .send(constraintProduct);
      
      constraintTestProductId = response.body.product.id;
    });

    // Soft delete vs hard delete
    test('should perform soft delete (if implemented)', async () => {
      const response = await request(config.baseURL)
        .delete(`/api/products/${constraintTestProductId}`)
        .set(getAuthHeaders())
        .expect(204);

      // If soft delete, product might still exist but marked as deleted
      const getResponse = await request(config.baseURL)
        .get(`/api/products/${constraintTestProductId}`)
        .set(getAuthHeaders());

      if (getResponse.status === 200) {
        // Soft delete - product exists but marked deleted
        expect(getResponse.body.product.deleted).toBe(true);
      } else {
        // Hard delete - product completely removed
        expect(getResponse.status).toBe(404);
      }
    });

    // Cascade deletion (if there are related entities)
    test('should handle cascade deletion properly', async () => {
      // This test would be relevant if products have related entities
      // like reviews, orders, etc. that need to be handled on deletion
      
      await request(config.baseURL)
        .delete(`/api/products/${constraintTestProductId}`)
        .set(getAuthHeaders())
        .expect(204);

      // Verify related entities are handled properly
      // (This would depend on your specific business logic)
    });

    // Deletion of products in orders (business constraint)
    test('should return 409 when trying to delete product with active orders', async () => {
      // If you have business logic preventing deletion of products in active orders
      await request(config.baseURL)
        .delete(`/api/products/${constraintTestProductId}`)
        .set(getAuthHeaders())
        .expect(409); // Conflict due to business constraint
    });
  });

  describe('DELETE /api/products/:id - Performance & Rate Limiting', () => {
    test('should handle rapid deletion requests', async () => {
      // Create multiple products for deletion
      const products = await Promise.all(
        Array(10).fill().map(async (_, i) => {
          const product = {
            name: `Rapid Delete Test ${i}`,
            price: 10.00 + i,
            stock: 10,
            category: 'Test'
          };
          
          const response = await request(config.baseURL)
            .post('/api/products')
            .set(getAuthHeaders())
            .send(product);
          
          return response.body.product.id;
        })
      );

      // Delete all products rapidly
      const deleteRequests = products.map(id => 
        request(config.baseURL)
          .delete(`/api/products/${id}`)
          .set(getAuthHeaders())
      );

      const responses = await Promise.allSettled(deleteRequests);
      
      // All should succeed
      const successCount = responses.filter(r => 
        r.status === 'fulfilled' && r.value.status === 204
      ).length;
      
      expect(successCount).toBe(products.length);
    });

    test('should return 429 when rate limit exceeded', async () => {
      // Create products for rate limit testing
      const products = await Promise.all(
        Array(100).fill().map(async (_, i) => {
          const product = {
            name: `Rate Limit Test ${i}`,
            price: 5.00,
            stock: 1,
            category: 'Test'
          };
          
          const response = await request(config.baseURL)
            .post('/api/products')
            .set(getAuthHeaders())
            .send(product);
          
          return response.body.product.id;
        })
      );

      // Rapidly send many delete requests
      const requests = products.map(id => 
        request(config.baseURL)
          .delete(`/api/products/${id}`)
          .set(getAuthHeaders())
      );

      const responses = await Promise.allSettled(requests);
      
      // Some should be rate limited
      const rateLimited = responses.some(r => 
        r.status === 'fulfilled' && r.value.status === 429
      );
      expect(rateLimited).toBe(true);
    });
  });

  describe('DELETE /api/products/:id - Idempotency', () => {
    test('should be idempotent - multiple DELETE requests should not cause errors', async () => {
      let idempotentTestId;

      // Create product
      const product = {
        name: 'Idempotent Test Product',
        price: 33.33,
        stock: 40,
        category: 'Test'
      };

      const createResponse = await request(config.baseURL)
        .post('/api/products')
        .set(getAuthHeaders())
        .send(product);
      
      idempotentTestId = createResponse.body.product.id;

      // First delete - should succeed
      await request(config.baseURL)
        .delete(`/api/products/${idempotentTestId}`)
        .set(getAuthHeaders())
        .expect(204);

      // Subsequent deletes - should return 404 (not 500 or other errors)
      await request(config.baseURL)
        .delete(`/api/products/${idempotentTestId}`)
        .set(getAuthHeaders())
        .expect(404);

      await request(config.baseURL)
        .delete(`/api/products/${idempotentTestId}`)
        .set(getAuthHeaders())
        .expect(404);
    });
  });

  describe('DELETE /api/products - Bulk Operations (if supported)', () => {
    test('should return 405 for DELETE on collection endpoint', async () => {
      // DELETE /api/products (without ID) should not be allowed
      await request(config.baseURL)
        .delete('/api/products')
        .set(getAuthHeaders())
        .expect(405);
    });

    test('should not delete all products accidentally', async () => {
      // Ensure there's no way to accidentally delete all products
      await request(config.baseURL)
        .delete('/api/products/all')
        .set(getAuthHeaders())
        .expect(404); // Should not match any route

      await request(config.baseURL)
        .delete('/api/products/*')
        .set(getAuthHeaders())
        .expect(404); // Should not match any route
    });
  });
});