const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    quantity: { type: Number, default: 0 },
    price: { type: Number, required: true },
    images: { type: [String], default: [] }, // Cloudinary url saklama
    section: { type: String, required: true },
    material: { type: String, required: false },
    baseType: { type: String,  enum: ["clothing", "shoes", "accessory"], required: false },
    size: {
      type: String,
      enum: ["XS","S", "M", "L", "XL", "2XL","3XL"],
      required: false,
    },
    shoeSize: {
      type: Number,
      min: 36,
      max: 50,
      required: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
