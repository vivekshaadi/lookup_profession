const axios = require('axios');

export default async function handler(req, res) {
	// Enable CORS
	res.setHeader('Access-Control-Allow-Credentials', true);
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader(
		'Access-Control-Allow-Methods',
		'GET,OPTIONS,PATCH,DELETE,POST,PUT'
	);
	res.setHeader(
		'Access-Control-Allow-Headers',
		'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
	);

	if (req.method === 'OPTIONS') {
		res.status(200).end();
		return;
	}

	if (req.method !== 'GET') {
		return res.status(405).json({ error: 'Method not allowed' });
	}

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
}
