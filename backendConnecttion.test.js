// backendConnection.test.js
const { fetch } = require('undici');

describe('Backend Connection Test', () => {
  it('should successfully connect to the backend and receive a response', async () => {
    const response = await fetch('https://schedulesooner-backend.onrender.com/api/user-input/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: 'test connection' }),
    });

    expect(response.ok).toBe(true);
    const data = await response.json();
    expect(data).toBeDefined();
  });
});

