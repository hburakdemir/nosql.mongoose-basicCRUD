const express = require("express");
const router = express.Router();
const { addComment,getCommentsByProduct,deleteComment,getCommentsByUser} = require("../controllers/commentController");
const authMiddleware = require("../middleware/authMiddleware");

// POST /api/comments
router.post("/add", authMiddleware, addComment);
router.get("/:productId", getCommentsByProduct);
router.delete("/:commentId",authMiddleware, deleteComment);
router.get("/user/:userId", authMiddleware, getCommentsByUser);

module.exports = router;
