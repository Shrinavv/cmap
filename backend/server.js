const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const connectDB = require('./config/db.js');
const authRoutes = require('./routes/auth.js');
const cookieRoutes = require('./routes/cookies.js');
const consentRoutes = require('./routes/consent.js');

const app = express();
app.use(cors({ origin: true }));           // allows extension + localhost:5173
app.use(express.json());

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/cookies', cookieRoutes);
app.use('/api/consent', consentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Backend running on http://localhost:${PORT}`));