# Chat App with AES-256 Encryption

## Overview
A modern, full-stack chat application featuring real-time messaging, robust user authentication, and end-to-end AES-256 encryption for maximum privacy. Built for both casual and professional use, it includes an admin dashboard, light/dark mode, and a beautiful, responsive UI.

## Features
- 🔒 **AES-256 End-to-End Encryption** for all messages
- 💬 Real-time chat with Socket.io
- 👤 User authentication (signup/login)
- 🛡️ Admin dashboard for user management
- 🌗 Light/Dark mode toggle
- 🖼️ Modern, responsive UI (Tailwind CSS)
- 🧑‍🤝‍🧑 Friend requests & conversations
- 🔔 Instant notifications

## Tech Stack
- **Frontend:** React, Zustand, Tailwind CSS, DaisyUI, Vite
- **Backend:** Node.js, Express, MongoDB, Mongoose
- **Real-time:** Socket.io
- **Security:** AES-256 (crypto-js), JWT, bcryptjs

## Getting Started
### Prerequisites
- Node.js & npm
- MongoDB

### Installation
```bash
# Clone the repository
git clone https://github.com/vikasJ07/Chat-app-with-AES-encryption.git
cd Chat-app-with-AES-encryption

# Install backend dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
```

### Running the App
```bash
# In the project root, start the backend:
npm run server

# In another terminal, start the frontend:
cd frontend
npm run dev
```

The backend runs on `http://localhost:5000` and the frontend on `http://localhost:5173` by default.

## Folder Structure
```
CNS/
  backend/      # Express API, models, controllers, routes
  frontend/     # React app (Vite, Tailwind, Zustand)
  screenshoots/ # App screenshots for documentation
```

## Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License
[ISC](LICENSE)

## Credits
- [Vikas J07](https://github.com/vikasJ07) - Project Author
- Open source libraries: React, Express, Socket.io, Tailwind CSS, etc. 