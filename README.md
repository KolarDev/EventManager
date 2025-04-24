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

### Events
- `POST /api/v1/events` – Create event (admin)
- `GET /api/v1/events` – Get all events
- `GET /api/v1/events/:id` – Get single event

### Tickets
- `POST /api/v1/tickets/purchase` – Purchase ticket (Paystack initialization)
- `POST /webhook/paystack` – Handle Paystack webhook for payment verification
- `POST /api/v1/tickets/validate` – Validate QR code ticket

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

## 📌 Notes

- Use tools like **Postman** or **Insomnia** for testing endpoints.
- Ensure webhook endpoint is publicly accessible (use [ngrok](https://ngrok.com/) during development).

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first.

---

## 🧑‍💻 Author

Developed by [Your Name](https://github.com/your-username) 💡

---

## 📜 License

[MIT](LICENSE)
