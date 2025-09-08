const express = require("express");
const { addToCart, removeFromCart, getCart } = require("../controllers/cartController");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

router.post("/add", authMiddleware, addToCart);
router.delete("/remove", authMiddleware, removeFromCart);
router.get("/", authMiddleware, getCart);

module.exports = router;
