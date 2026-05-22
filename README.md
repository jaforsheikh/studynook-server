# 🚀 StudyNook Server – Backend API

StudyNook Server is the backend service for the StudyNook Library Room Booking Platform.  
This server handles authentication, room management, booking operations, database communication, and API security.

---

# 🌐 Live Server

🔗 https://studynook-server-beta.vercel.app

---

# 📌 Features

## 🔐 Authentication & Authorization
- JWT Authentication
- Google Login Support
- Secure Protected Routes
- Token Verification Middleware
- User Authorization

---

## 👤 User Management
- Create User
- Store User Information
- Manage User Roles
- User Booking History

---

## 📚 Room Management API
- Get All Study Rooms
- Get Single Room Details
- Add New Rooms
- Update Room Information
- Delete Rooms

---

## 📅 Booking System API
- Create Booking
- Prevent Double Booking
- Booking Availability Check
- Cancel Booking
- User Booking Records

---

## 🛡️ Security Features
- JWT Security
- Environment Variable Protection
- MongoDB Secure Connection
- Error Handling Middleware
- API Validation

---

# 🛠️ Technologies Used

## Backend Technologies
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT (JSON Web Token)
- Cors
- Dotenv

---

# 📂 Folder Structure

```bash
studynook-server/
│
├── config/
├── controllers/
├── routes/
├── services/
├── utils/
│
├── auth.js
├── index.js
├── server.js
├── package.json
└── vercel.json
```

---

# ⚙️ Installation & Setup

## 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/studynook-server.git
```

---

## 2️⃣ Navigate to Project Folder

```bash
cd studynook-server
```

---

## 3️⃣ Install Dependencies

```bash
npm install
```

---

## 4️⃣ Create Environment File

Create a `.env` file in the root directory and add:

```env
PORT=5000

MONGODB_URI=your_mongodb_uri

JWT_SECRET=your_jwt_secret

CLIENT_URL=http://localhost:3000
```

---

## 5️⃣ Run Development Server

```bash
npm run dev
```

---

# 📡 API Endpoints

## Authentication Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/jwt` | Generate JWT Token |
| POST | `/google-login` | Google Authentication |

---

## Room Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/rooms` | Get All Rooms |
| GET | `/rooms/:id` | Get Single Room |
| POST | `/rooms` | Add New Room |
| PATCH | `/rooms/:id` | Update Room |
| DELETE | `/rooms/:id` | Delete Room |

---

## Booking Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/bookings` | Create Booking |
| GET | `/bookings` | Get All Bookings |
| GET | `/bookings/user/:email` | User Booking History |
| DELETE | `/bookings/:id` | Cancel Booking |

---

# 🚀 Deployment

This backend server is deployed using:

- Vercel
- MongoDB Atlas

---

# 🔧 Scripts

```json
{
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```

---

# 🧪 Testing

To run tests:

```bash
npm test
```

---

# 👨‍💻 Developer

### Jafor Sheikh

Full Stack Web Developer

---

# 📄 License

This project is licensed under the MIT License.

---

# ⭐ Support

If you like this project:

- Give this repository a ⭐
- Fork the repository
- Contribute to improve the backend

---

# 🙌 Acknowledgements

Special thanks to:
- Node.js
- Express.js
- MongoDB
- Vercel

---

# 📬 Contact

For any queries or collaboration:

📧 Email: your-email@example.com

---

# 🚀 Thank You

Thank you for checking out StudyNook Server 💙
