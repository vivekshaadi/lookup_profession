const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from React build
app.use(express.static(path.join(__dirname, 'client/build')));

// API proxy endpoint to handle the profession lookup
app.get('/api/professions', async (req, res) => {
	try {
		const { search_term } = req.query;

		const response = await axios({
			method: 'GET',
			url: 'http://lookup-service.us-east-1.staging.shaadi.internal/lookup/v1/data',
			headers: {
				'Content-Type': 'application/json',
			},
			data: {
				data: {
					search_term: search_term || '',
					type: 'professions',
				},
			},
		});

		res.json(response.data);
	} catch (error) {
		console.error('API Error:', error.message);
		res.status(500).json({
			error: 'Failed to fetch professions',
			message: error.message,
		});
	}
});

// Serve React app for all other routes
app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
	console.log(`Open http://localhost:${PORT} to view the app`);
});
