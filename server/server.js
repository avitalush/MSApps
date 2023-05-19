const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const port = 3001;

app.use(cors());

// Endpoint to fetch images from Pixabay API with pagination
app.get('/images', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = 9;
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    const category = req.query.category || 'CATEGORY'; // Default category is 'CATEGORY'

    const response = await axios.get('https://pixabay.com/api/', {
      params: {
        key: '25540812-faf2b76d586c1787d2dd02736',
        q: category,
      },
    });

    const images = response.data.hits.slice(startIndex, endIndex);
    res.json(images);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch images' });
  }
});
//Sorting function on the images by id or date
app.get('/images/sorted', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = 9;
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    const category = req.query.category || 'flower'; // Default category is 'flower'
    const sortBy = req.query.sortBy || 'id';

    const response = await axios.get('https://pixabay.com/api/', {
      params: {
        key: '25540812-faf2b76d586c1787d2dd02736',
        q: category,
        order: sortBy === 'date' ? 'latest' : 'popular',
      },
    });

    const images = response.data.hits.slice(startIndex, endIndex);
    res.json(images);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sorted images' });
  }
});
// the relevant parameters of the image such as: views, downloads, collection etc
app.get('/images/:id', async (req, res) => {
  try {
    const imageId = req.params.id;
    const response = await axios.get(`https://pixabay.com/api/`, {
      params: {
        key: '25540812-faf2b76d586c1787d2dd02736',
        id: imageId,
      },
    });

    const imageDetails = response.data.hits[0];
    res.json(imageDetails);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch image details' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
