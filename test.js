// backendConnection.test.js

// Node's fetch (if you're not in a browser)
const fetch = require('node-fetch');

describe('Backend Connection Test', () => {
  it('should successfully connect to the backend and receive a response', async () => {
    const response = await fetch('https://schedulesooner-backend.onrender.com/api/user-input/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: 'test connection' }),
    });

    expect(response.ok).toBe(true); // HTTP 200 OK
    const data = await response.json();
    expect(data).toBeDefined(); // There is a response body
    // You can check specific properties if you know what backend sends
    // Example: expect(data.schedule).toBeDefined();
  });
});
