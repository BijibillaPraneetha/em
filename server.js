const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config(); 
const app = express();
const API_KEY = process.env.GOOGLE_API_KEY;
;  // Replace with your actual API key
const GOOGLE_BOOKS_API = 'https://www.googleapis.com/books/v1/volumes';

app.use(express.json());
app.use(cors()); // Enable CORS

app.use(express.static('public')); // Serve frontend files

// Route to fetch books from Google Books API
app.get('/api/books', async (req, res) => {
    const { query } = req.query;

    if (!query) {
        return res.status(400).json({ error: 'Query parameter is required' });
    }

    try {
        const response = await axios.get(GOOGLE_BOOKS_API, {
            params: {
                q: query,
                key: API_KEY,
            },
        });

        if (!response.data.items) {
            return res.status(404).json({ message: 'No books found' });
        }

        res.json(response.data.items); // Return books
    } catch (error) {
        console.error('Error fetching books:', error);
        res.status(500).json({ error: 'Error fetching books from Google API.' });
    }
});

// Start the Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
