const express = require("express");
const mongoose = require("mongoose");
const Product = require('./models/product.model.js');
const productRoute = require("./routes/product.route.js");
const app = express();



app.use(express.json());
app.use(express.urlencoded({extended:false}))


app.get("/", (req, res) => {
  res.send("Hello from node API server");
});



app.use("/api/products", productRoute);
mongoose
  .connect(
    "mongodb+srv://burak:FzEs657cnjp8VfWD@datateam-backend.4pa5t0o.mongodb.net/?retryWrites=true&w=majority&appName=datateam-backend"
  )
  .then(() => {
    console.log("connected to db");
  })
  .catch(() => {
    console.log("not connected to db");
  });

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
