// Based on Postman collection - the API expects: name, price, stock, category
const generateProductData = (overrides = {}) => ({
  name: `Test Product ${Date.now()}`,
  price: 99.99,
  stock: 10,
  category: 'Test Category',
  ...overrides
});

const generateValidProductExamples = () => [
  {
    name: "Wireless Earbuds",
    price: 89.99,
    stock: 150,
    category: "Electronics"
  },
  {
    name: "Coffee Mug",
    price: 12.99,
    stock: 50,
    category: "Home"
  }
];

const generateInvalidProductData = () => [
  { description: 'Missing name field' }, // Missing name
  { name: '', price: 10, stock: 5, category: 'Test' }, // Empty name
  { name: 'Test', price: -10, stock: 5, category: 'Test' }, // Negative price
  { name: 'Test', price: 'invalid', stock: 5, category: 'Test' }, // Invalid price type
  { name: 'Test', price: 10, stock: -5, category: 'Test' }, // Negative stock
  { name: 'Test', price: 10, stock: 'invalid', category: 'Test' }, // Invalid stock type
  { name: 'A'.repeat(1000), price: 10, stock: 5, category: 'Test' }, // Very long name
  { name: 'Test', price: 10, stock: 5 }, // Missing category
  { name: 'Test', price: 10, stock: 5, category: '' }, // Empty category
];

module.exports = {
  generateProductData,
  generateValidProductExamples,
  generateInvalidProductData
};