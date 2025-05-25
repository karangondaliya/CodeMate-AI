require("dotenv").config();
const express = require('express');
const connectDb = require('./config/db');
const userRoutes = require('./routes/user');
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/project');
const cors = require('cors');

const app = express(); // 👈 After this line

// ✅ Configure CORS here
app.use(cors({
  origin: 'http://localhost:3000', // Your React frontend
  credentials: true
}));

connectDb();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running");
});

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/project", projectRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
