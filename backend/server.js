import express from 'express';
import { getFlagImage, getFlagInformation } from './routes/api.js';
import cors from 'cors';

const corsOptions = {
    origin: [
        'http://localhost:5173',
        'https://sage-horse-40ff19.netlify.app'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};
const app = express();

app.use(cors(corsOptions));

app.get('/api/flag-info', getFlagInformation);
app.get('/api/flag-image', getFlagImage);

app.listen(3000, () => {
    console.log("Server running on Port 3000")
})