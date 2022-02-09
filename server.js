const apicache = require('apicache');
const axios = require('axios');
const express = require('express');

const app = express();

// Set up routes
const { route1, route2 } = require('./routes/blogPosts.js')

// Set up caching for bonus objective
const cache = apicache.middleware;

// Allow server to accept json
app.use(express.json());

// Step 1
app.get('/api/ping', cache('30 minutes'), route1)

// Step 2
// sortBy and direction are optional params. If left blank, they will default to id and asc, respectively
app.get('/api/posts/:tags/:sortBy?/:direction?', cache('30 minutes'), route2);

app.listen(3000, () => console.log('Server started on: http://localhost:3000'))