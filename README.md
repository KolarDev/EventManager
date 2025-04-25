# 🎟️ Eventii API

A RESTful API built with **Node.js**, **Express.js**, and **MongoDB** for managing events, ticketing, and payments using **Paystack**.

--- 

## 🚀 Features

- User authentication & authorization (JWT)
- Event creation & management
- Ticket type configuration per event
- Ticket purchase flow with Paystack integration
- Webhook handling for payment confirmation
- Ticket issuing with QR code generation
- Ticket validation endpoint
- Admin & user roles

---

## 📦 Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT
- **Payments:** Paystack
- **QR Code:** `qrcode` npm package
- **Others:** dotenv, crypto

---

## 📁 Folder Structure

```
.
├── controllers/
├── models/
├── routes/
├── utils/
├── middleware/
├── app.js
├── server.js
└── .env
```

---

## 🔐 Environment Variables

Create a `.env` file in the root and add:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=90d
PAYSTACK_SECRET_KEY=your_paystack_secret
BASE_URL=https://yourdomain.com
```

---

## 🔄 API Endpoints

### Auth
- `POST /api/v1/auth/signup` – Register user
- `POST /api/v1/auth/login` – Login user
- `POST /api/v1/auth/google` – Initiate login user with google
- `POST /api/v1/auth/google/callback` – Get user data from google to login

### Users
- `POST /api/v1/users/profile` – Get user profile
- `POST /api/v1/users/all-users` – Admin get all users

### Events
- `POST /api/v1/events/create-event` – Create event (admin)
- `GET /api/v1/events` – Get all events
- `GET /api/v1/events/events-around` – Get events that are nearby users's location
- `GET /api/v1/events/upcoming` – Get upcoming events (event date is close)
- `GET /api/v1/events/:id` – Get single event
- `PATCH /api/v1/events/:id` – Update an event (event organizer)
- `DELETE /api/v1/events/:id` – Delete an event (event organizer)
- `GET /api/v1/events/categories` – Get categories of events
- `GET /api/v1/events/categories/:category` – Get events by category

### Tickets
- `POST /api/v1/tickets/purchase` – Purchase ticket (Paystack initialization)
- `POST /api/v1/tickets/validate` – Validate QR code ticket (Ticket organizer)
- `POST /api/v1/tickets/all-tickets` – Admin gets the list of all tickets

### Webhooks
- `POST /webhook/paystack` – Handle Paystack webhook for payment verification

### Favourites
- `POST /api/v1/favourites/add/:eventId` – Add an event to carts
- `DELETE /api/v1/favourites/remove/:eventId` – Remove an event from carts
### Favourites
- `POST /api/v1/favourites/add/:eventId` – Add an event to favourites
- `DELETE /api/v1/favourites/remove/:eventId` – Remove an event from favourites

---

## 💳 Payment Flow

1. User clicks "Buy Ticket"
2. Backend initializes Paystack payment with `callback_url`
3. Paystack redirects user to their checkout page
4. After payment, Paystack triggers the webhook to `/webhook/paystack`
5. Backend verifies signature and issues ticket with QR code

---

## ✅ To Run Locally

```bash
git clone https://github.com/your-username/event-manager-api.git
cd event-manager-api
npm install
npm run dev
```

Make sure MongoDB and Paystack keys are properly configured.

---

## 📘 API Documentation (Swagger)

Our Event Management API is documented with **Swagger UI** for easy exploration and testing of endpoints.

### 🔗 Accessing the Docs

You can access the Swagger documentation via the following endpoint: /api/docs

If you're running the app locally, visit: http://localhost:3000/api/docs


> Replace `localhost:3000` with your actual domain or IP address when deployed.

---

### 🧭 What You Can Do

- Explore all API routes including authentication, events, tickets, and payments
- View request parameters, headers, and body examples
- See response types and status codes
- Test endpoints directly using the **Try it out** button

---

### ✅ Authentication

Some endpoints are protected and require authentication via JWT. To test these endpoints:

1. Click the **Authorize** button at the top-right corner of the Swagger UI.
2. Enter your Bearer token in the following format: Bearer your_token_here


---

### 🔧 Technologies Used

Swagger is set up using:

- `swagger-autogen`: Auto-generates OpenAPI specification from comments on each route.
- `swagger-ui-express`: Serves the Swagger UI at the `/api/docs` route.

---

### 📎 Notes

- Keep your `.env` file updated with the correct `BASE_URL` for the callback to work correctly.
- Always verify payments using the Paystack webhook and ensure tickets are issued only upon `charge.success` events.




## 📌 Notes

- Use tools like **Postman** or **Insomnia** for testing endpoints.
- Ensure webhook endpoint is publicly accessible (use [ngrok](https://ngrok.com/) or VSCode port forwarding during development).

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first.

---

## 🧑‍💻 Author

Developed by [Muhyideen Abdulbasit](https://github.com/kolardev) 💡 
Developed by [Salami Abdulazeez](https://github.com/tzebasdha) 💡

---

## 📜 License

[MIT](LICENSE)
