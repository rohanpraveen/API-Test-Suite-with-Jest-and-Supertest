
// Valid test data for products
const validProducts = {
  basic: {
    name: 'Basic Test Product',
    price: 29.99,
    stock: 100,
    category: 'Electronics',
    description: 'A basic test product for API testing'
  },
  
  minimal: {
    name: 'Minimal Product',
    price: 9.99,
    category: 'Test'
  },
  
  withLongDescription: {
    name: 'Product with Long Description',
    price: 49.99,
    stock: 50,
    category: 'Books',
    description: 'This is a very detailed product description that contains multiple sentences and provides comprehensive information about the product features, specifications, and benefits.'
  },
  
  electronics: {
    name: 'Gaming Laptop',
    price: 1299.99,
    stock: 25,
    category: 'Electronics',
    description: 'High-performance gaming laptop with latest GPU'
  },
  
  clothing: {
    name: 'Cotton T-Shirt',
    price: 19.99,
    stock: 200,
    category: 'Clothing',
    description: 'Comfortable cotton t-shirt in various sizes'
  }
};

// Invalid test data for validation testing
const invalidProducts = {
  emptyName: {
    name: '',
    price: 29.99,
    stock: 100,
    category: 'Electronics'
  },
  
  missingName: {
    price: 29.99,
    stock: 100,
    category: 'Electronics'
  },
  
  nullName: {
    name: null,
    price: 29.99,
    stock: 100,
    category: 'Electronics'
  },
  
  invalidPriceString: {
    name: 'Test Product',
    price: 'invalid-price',
    stock: 100,
    category: 'Electronics'
  },
  
  negativePric: {
    name: 'Test Product',
    price: -10.50,
    stock: 100,
    category: 'Electronics'
  },
  
  invalidStockString: {
    name: 'Test Product',
    price: 29.99,
    stock: 'invalid-stock',
    category: 'Electronics'
  },
  
  negativeStock: {
    name: 'Test Product',
    price: 29.99,
    stock: -5,
    category: 'Electronics'
  },
  
  nameArray: {
    name: ['array', 'name'],
    price: 29.99,
    stock: 100,
    category: 'Electronics'
  },
  
  priceObject: {
    name: 'Test Product',
    price: { amount: 29.99, currency: 'USD' },
    stock: 100,
    category: 'Electronics'
  },
  
  tooLongName: {
    name: 'a'.repeat(256),
    price: 29.99,
    stock: 100,
    category: 'Electronics'
  },
  
  tooLongDescription: {
    name: 'Test Product',
    price: 29.99,
    stock: 100,
    category: 'Electronics',
    description: 'a'.repeat(1001)
  }
};

// Malicious/Security test data
const maliciousData = {
  sqlInjection: {
    name: "'; DROP TABLE products; --",
    price: 29.99,
    stock: 100,
    category: 'Electronics'
  },
  
  xssScript: {
    name: '<script>alert("xss")</script>',
    price: 29.99,
    stock: 100,
    category: 'Electronics'
  },
  
  xssImage: {
    description: '<img src=x onerror=alert("xss")>',
    name: 'XSS Test',
    price: 29.99,
    category: 'Test'
  }
};

// Update data for PUT tests
const updateData = {
  fullUpdate: {
    name: 'Updated Product Name',
    price: 39.99,
    stock: 150,
    category: 'Updated Category',
    description: 'Updated description'
  },
  
  partialUpdate: {
    name: 'Partially Updated Name',
    price: 49.99
  },
  
  nameOnly: {
    name: 'Name Only Update'
  },
  
  priceOnly: {
    price: 99.99
  },
  
  withExtraFields: {
    name: 'Updated Name',
    unexpectedField: 'should be ignored',
    admin: true,
    password: 'secret'
  },
  
  withIdAttempt: {
    id: 999999,
    name: 'Name with ID attempt'
  },
  
  decimal: {
    price: 99.999
  },
  
  unicode: {
    name: 'Product with émojis 🔥✨'
  }
};

// Edge case data
const edgeCases = {
  maxSafeInteger: {
    stock: Number.MAX_SAFE_INTEGER
  },
  
  largeDescription: {
    description: 'x'.repeat(10000000) // 10MB string
  },
  
  emptyObject: {},
  
  onlyUndefined: {
    name: 'Valid Name',
    price: undefined
  }
};

// Concurrent test data
const concurrentData = {
  updates: Array(5).fill().map((_, i) => ({
    name: `Concurrent Update ${i}`,
    price: 10 + i
  })),
  
  rapidUpdates: [
    { name: 'Update 1', price: 10.00 },
    { name: 'Update 2', price: 20.00 },
    { name: 'Update 3', price: 30.00 }
  ]
};

// Test categories for grouping
const categories = [
  'Electronics',
  'Books',
  'Clothing',
  'Home & Garden',
  'Sports',
  'Toys',
  'Automotive'
];

// Common test values
const testValues = {
  validPrices: [0.01, 9.99, 29.99, 99.99, 999.99],
  invalidPrices: [-1, 'string', null, undefined, [], {}],
  validStocks: [0, 1, 50, 100, 999],
  invalidStocks: [-1, 'string', null, [], {}],
  longString: 'a'.repeat(500),
  veryLongString: 'a'.repeat(2000),
  specialCharacters: '!@#$%^&*()[]{}|;:,.<>?',
  unicodeCharacters: 'émojis 🔥✨ñáéíóú'
};

module.exports = {
  validProducts,
  invalidProducts,
  maliciousData,
  updateData,
  edgeCases,
  concurrentData,
  categories,
  testValues
};