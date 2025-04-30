async function fetchWithRetry(url, options = {}, retries = 2, delay = 500) {
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response = await fetch(url, options);
        if (response.ok) {
          return await response.json();
        }
        throw new Error(`Fetch failed with status ${response.status}`);
      } catch (err) {
        if (attempt === retries) {
          return { error: 'Failed after retries' };
        }
        await new Promise((res) => setTimeout(res, delay));
      }
    }
  }
  
  module.exports = { fetchWithRetry };
  