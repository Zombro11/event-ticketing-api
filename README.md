# Event Ticketing System REST API

## Short Description

This project is a Node.js REST API for an Event Ticketing System. It allows users to register, log in, view events, book tickets, and view only their own bookings. Admin users can create, update, and delete events. The API uses MongoDB, Mongoose, JWT authentication, password hashing, validation, and protected routes.

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- express-validator
- qrcode
- dotenv
- cors

## Project Structure

```txt
event-ticketing-api/
├── config/
│   └── db.js
├── controllers/
│   ├── authController.js
│   ├── bookingController.js
│   └── eventController.js
├── middleware/
│   ├── adminMiddleware.js
│   ├── authMiddleware.js
│   ├── errorHandler.js
│   ├── notFound.js
│   └── validateRequest.js
├── models/
│   ├── Booking.js
│   ├── Event.js
│   └── User.js
├── routes/
│   ├── authRoutes.js
│   ├── bookingRoutes.js
│   └── eventRoutes.js
├── utils/
│   └── generateToken.js
├── .env.example
├── .gitignore
├── package.json
├── README.md
└── server.js
```

## Installation Steps

1. Clone the repository.

```bash
git clone https://github.com/your-username/event-ticketing-api.git
cd event-ticketing-api
```

2. Install dependencies.

```bash
npm install
```

3. Create a `.env` file in the root folder.

```bash
cp .env.example .env
```

4. Add my environment variables to `.env`.

```env
PORT=5050
MONGO_URI=mongodb+srv://mndiaye_db_user:Barcelone11%40@studentdb.vxannrl.mongodb.net/event_ticketing?retryWrites=true&w=majority&appName=StudentDB
JWT_SECRET=eventTicketingSecret2026
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

5. Run the project locally.

```bash
npm run dev
```

Or run with Node:

```bash
npm start
```

## Environment Variables Used

| Variable | Description |
| --- | --- |
| `PORT` | The local server port. Example: `5050` |
| `MONGO_URI` | MongoDB Atlas or local MongoDB connection string |
| `JWT_SECRET` | Secret key used to sign JWT tokens |
| `JWT_EXPIRES_IN` | Token expiration time. Example: `7d` |
| `NODE_ENV` | App environment. Example: `development` or `production` |

## Deployed API Link

Replace this with your Render deployment link:

```txt
https://your-project-name.onrender.com/
```

API root:

```txt
https://your-project-name.onrender.com/api/
```

## Important Notes

- Do not push the `.env` file to GitHub.
- The `.env.example` file is included so another developer can see which environment variables are required.
- Passwords are hashed before being stored in MongoDB.
- JWT tokens are required for protected routes.
- Admin-only routes are protected using authorization middleware.
- Users can only access their own bookings.
- If an event already has bookings, it cannot be deleted.

## Endpoint List

### Root Routes

| Method | Endpoint | Description | Access |
| --- | --- | --- | --- |
| GET | `/` | HTML welcome page | Public |
| GET | `/api` | API information | Public |

### Authentication Routes

| Method | Endpoint | Description | Access |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | Register a new user | Public |
| POST | `/api/auth/login` | Log in and receive JWT token | Public |

#### Register Example Body

```json
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "password123",
  "role": "admin"
}
```

#### Login Example Body

```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

### Event Routes

| Method | Endpoint | Description | Access |
| --- | --- | --- | --- |
| GET | `/api/events` | Return all events | Public |
| GET | `/api/events/:id` | Return one event by ID | Public |
| GET | `/api/events?category=music` | Filter events by category | Public |
| GET | `/api/events?date=2026-05-07` | Filter events by date | Public |
| GET | `/api/events?category=music&date=2026-05-07` | Filter by category and date | Public |
| POST | `/api/events` | Create a new event | Admin only |
| PUT | `/api/events/:id` | Update an event | Admin only |
| DELETE | `/api/events/:id` | Delete an event if it has no bookings | Admin only |
| GET | `/api/events/dashboard/admin` | Bonus admin dashboard route | Admin only |

#### Create Event Example Body

```json
{
  "title": "Spring Music Festival",
  "description": "A live music event on campus.",
  "category": "music",
  "venue": "Main Auditorium",
  "date": "2026-05-20",
  "time": "7:00 PM",
  "seatCapacity": 200,
  "price": 25
}
```

### Booking Routes

| Method | Endpoint | Description | Access |
| --- | --- | --- | --- |
| GET | `/api/bookings` | Return bookings for the logged-in user only | Authenticated user |
| GET | `/api/bookings/:id` | Return one booking only if it belongs to the logged-in user | Authenticated user |
| POST | `/api/bookings` | Create a booking and generate QR code | Authenticated user |
| GET | `/api/bookings/validate/:qr` | Bonus ticket validation endpoint | Admin only |

#### Create Booking Example Body

```json
{
  "event": "replace_with_event_id",
  "quantity": 2
}
```

## Authentication Header Format

For protected routes, include the token in the request header:

```txt
Authorization: Bearer your_jwt_token_here
```

## Validation Implemented

The API validates important inputs, including:

- required fields
- valid email format
- password presence and minimum length
- seat capacity greater than 0
- price not negative
- quantity greater than 0
- booking quantity cannot exceed available seats
- booked seats cannot be negative
- event capacity cannot be updated below already booked seats

## 404 Handling

For non-existent routes:

- If the request accepts HTML, the API returns an HTML 404 page.
- If the request accepts JSON, the API returns:

```json
{ "error": "404 Not Found" }
```

## Deployment Notes for Render

1. Push the project to GitHub.
2. Go to Render and create a new Web Service.
3. Connect your GitHub repository.
4. Use the following settings:
   - Build command: `npm install`
   - Start command: `npm start`
5. Add environment variables in the Render dashboard:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `JWT_EXPIRES_IN`
   - `NODE_ENV`
6. Deploy the app.

## Testing Checklist

Before submitting, test these in Postman or Thunder Client:

- Register a user
- Register an admin
- Log in and copy the JWT token
- Create an event as admin
- Try creating an event as a regular user and confirm it is blocked
- Get all events
- Get one event by ID
- Filter events by category
- Filter events by date
- Book tickets as a logged-in user
- Confirm bookedSeats increases after booking
- Confirm quantity cannot exceed available seats
- Confirm a user can only view their own bookings
- Confirm admin cannot delete an event that already has bookings
- Confirm 404 HTML and JSON responses work
