const express = require("express");
const router = express.Router();
const {
  getProducts,
  getOnlyProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  upload, // multer
} = require("../controllers/productController.js");

// Resim upload ile ürün oluştur
router.post("/", upload.array("images"), createProduct);
router.get("/", getProducts);
router.get("/:id", getOnlyProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

module.exports = router;
