const ProductSchema = require("../models/productModel.js");
const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");
const dotenv = require("dotenv");

dotenv.config();

// Cloudinary config dotenv indexte olunca okumuyor 
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

    

// Multer memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

const createProduct = async (req, res) => {
  try {
    const { name, quantity, price,section,gender } = req.body;
    const imageUrls = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "products" },
            (err, result) => {
              if (err) reject(err);
              else resolve(result);
            }
          );
          stream.end(file.buffer);
        });
        imageUrls.push(result.secure_url);
      }
    }

    const product = new ProductSchema({
      name,
      quantity,
      price,
      section,
      images: imageUrls,
      gender,
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProducts = async (req, res) => {
   try {
    const { section } = req.query; // query param yakala
    let filter = {};

    if (section) {
      filter.section = section; // section varsa filtre uygula
    }
    
    const products = await ProductSchema.find(filter);
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOnlyProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await ProductSchema.findById(id);
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await ProductSchema.findByIdAndUpdate(id, req.body, { new: true });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await ProductSchema.findByIdAndDelete(id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  getOnlyProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  upload, // Multer middleware'i export ettik
};
