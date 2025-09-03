const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./db/connect");
const productRoute = require("./routes/productRoute");
const cartRoutes = require("./routes/cartRoutes");
const authRoutes = require("./routes/authRoutes");

dotenv.config();
connectDB();



const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => res.send("Hello from API"));

app.use("/api/products", productRoute);
app.use("/api/carts", cartRoutes);
app.use("/api/auth", authRoutes);


const PORT = process.env.PORT || 3406;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
