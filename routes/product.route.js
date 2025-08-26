const express = require("express");
const Product = require("../models/product.model.js");
const router = express.Router();
const {
  getProducts,
  getOnlyProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../routes/controllers/product.controller.js");

router.post("/", createProduct);
router.get("/", getProducts);
router.get("/:id", getOnlyProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);


module.exports = router;