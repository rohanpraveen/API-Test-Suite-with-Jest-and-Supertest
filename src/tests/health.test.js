const request = require('supertest');
const config = require('../config/api.config');

describe('Health API', () => {
  describe('GET /health', () => {
    test('should return 200 status', async () => {
      await request(config.baseURL)
        .get('/health')
        .expect(200);
    });

    test('should not require authentication', async () => {
      await request(config.baseURL)
        .get('/health')
        .expect(200);
    });

    test('should return response with content', async () => {
      const response = await request(config.baseURL)
        .get('/health')
        .expect(200);

      // Check that we get some response content
      expect(response.text || response.body).toBeDefined();
    });

    test('should respond quickly (under 2 seconds)', async () => {
      const startTime = Date.now();
      
      await request(config.baseURL)
        .get('/health')
        .expect(200);
      
      const responseTime = Date.now() - startTime;
      expect(responseTime).toBeLessThan(2000);
    });

    test('should allow POST method', async () => {
      await request(config.baseURL)
        .post('/health')
        .expect(200);
    });
  });
});