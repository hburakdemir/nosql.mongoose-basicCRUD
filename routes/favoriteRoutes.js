const express = require("express");
const router = express.Router();
const { favoriteToggle, getFavorites } = require("../controllers/favoriteController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/:productId", authMiddleware, favoriteToggle); 
router.get("/", authMiddleware, getFavorites);

module.exports = router;
