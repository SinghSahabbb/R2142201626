const express = require('express');
const axios = require('axios');
const app = express();
const port = 7006;

app.use((req, res, next) => {
  req.setTimeout(500);
  res.setTimeout(500);
  next();
});

app.get('/numbers', async (req, res) => {
  const urls = req.query.url;

  if (!urls || !Array.isArray(urls)) {
    return res.status(400).json({ error: 'Invalid or missing "url" parameter(s)"' });
  }

  const uniqueNumbers = new Set();

  try {
    const responses = await Promise.all(urls.map(async (url) => {
      try {
        const response = await axios.get(url);
        if (response.status === 200) {
          const data = response.data;

          if (data && Array.isArray(data.numbers)) {
            data.numbers.forEach((number) => uniqueNumbers.add(number));
          }
        }
      } catch (error) {
       console.error('Error fetching data:', error.message);
      }
    }));
    const sortedNumbers = Array.from(uniqueNumbers).sort((a, b) => a - b);

    res.json({ numbers: sortedNumbers });
  } catch (error) {
    console.error('Error fetching data:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
