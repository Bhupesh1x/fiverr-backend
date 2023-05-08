import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.routes.js";
import gigRoutes from "./routes/gig.routes.js";
import reviewRoutes from "./routes/review.routes.js";
import orderRoutes from "./routes/order.routes.js";
import conversationRoutes from "./routes/conversation.routes.js";
import messageRoutes from "./routes/message.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import cors from "cors";

dotenv.config();

const app = express();

async function connectToMongo() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected To Mongo!");
  } catch (error) {
    console.log(error);
  }
}
connectToMongo();

app.use(express.json());
app.use(cookieParser());
const whitelist = ["http://localhost:3000"];
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};
app.use(cors(corsOptions));

app.use("/api/users", userRoutes);
app.use("/api/gigs", gigRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/category", categoryRoutes);

app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || 500;

  return res.status(errorStatus).send(errorMessage);
});

const PORT = process.env.PORT || 8800;

app.listen(PORT, () => {
  console.log("Server is running !");
});
