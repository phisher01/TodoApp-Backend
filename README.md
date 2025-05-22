📝 MERN Stack To-Do App
A full-stack To-Do List application built using MongoDB, Express.js, React.js, and Node.js.

🚀 Live Demo
🔗 Frontend (Vercel): https://todo-app-frontend-drab.vercel.app

🧑‍💻 How to Run the App Locally
1️⃣ Clone the repositories
Frontend
bash
Copy
Edit
git clone https://github.com/your-username/todo-app-frontend.git
cd todo-app-frontend
Backend
bash
Copy
Edit
git clone https://github.com/your-username/todo-app-backend.git
cd todo-app-backend
2️⃣ Install dependencies
Run the following in both folders:

bash
Copy
Edit
npm install
3️⃣ .env Files
You don’t need to create .env manually — it’s already included in the repositories.

Just ensure:

Backend .env contains:

env
Copy
Edit
PORT=3000
MONGO_URI=your_mongo_uri
JWT_SECRET=your_jwt_secret
Frontend .env contains:

env
Copy
Edit
VITE_API_BASE_URL=http://localhost:3000
4️⃣ Run the applications
Backend
bash
Copy
Edit
npm run dev
Runs at: http://localhost:3000

Frontend
bash
Copy
Edit
npm run dev
Runs at: http://localhost:5173
