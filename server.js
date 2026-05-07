const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();

connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Event Ticketing API</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background: #f4f4f4;
            color: #222;
            margin: 0;
            padding: 40px;
            text-align: center;
          }
          main {
            max-width: 700px;
            margin: 80px auto;
            background: white;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
          }
          code {
            background: #eee;
            padding: 4px 8px;
            border-radius: 5px;
          }
        </style>
      </head>
      <body>
        <main>
          <h1>Welcome to the Event Ticketing API</h1>
          <p>This REST API supports user registration, login, event browsing, ticket booking, and admin event management.</p>
          <p>API root: <code>/api</code></p>
        </main>
      </body>
    </html>
  `);
});

app.get('/api', (req, res) => {
  res.json({
    message: 'Event Ticketing System REST API',
    endpoints: {
      auth: '/api/auth',
      events: '/api/events',
      bookings: '/api/bookings',
    },
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/bookings', bookingRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
