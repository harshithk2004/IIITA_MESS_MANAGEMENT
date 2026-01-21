const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const userRoutes = require("./Routes/userRoutes");
const forgotPasswordRoutes=require("./Routes/forgotPasswordRoutes");
const db = require("./connection");
const messMenuRoutes=require('./Routes/messMenuRoutes');
const profileRoutes=require('./Routes/profileRoutes');
const inventoryRoutes=require('./Routes/inventoryRoutes');
const mealFeedbackRoutes=require('./Routes/mealFeedbackRoutes');
const expenditureRoutes=require('./Routes/expenditureRoutes');
const messrebareRoutes=require('./Routes/messrebateRoutes')
const app = express();
app.use(express.json());

app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"], 
    credentials: true,
}));

app.use(bodyParser.json());

app.use("/api",userRoutes);
app.use("/api",forgotPasswordRoutes);
app.use('/api',messMenuRoutes);
app.use('/api',profileRoutes);
app.use('/api',mealFeedbackRoutes);
app.use('/api',inventoryRoutes);
app.use('/api',expenditureRoutes);
app.use('/api',messrebareRoutes);

async function startServer() {
  try {
      await db.connectDB();
      PORT=5000;
      app.listen(PORT, () => {
          console.log(`Server running on port ${PORT}`);
      });
  } catch (error) {
      console.error("Failed to start server due to DB error:", error);
      process.exit(1);
  }
}

startServer();
