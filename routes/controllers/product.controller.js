const Product = require("../../models/product.model.js");

const createProduct = async (req, res) => {
  try {
    const products = await Product.create(req.body);
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProducts = async(req,res) => {
    try {
        const products = await Product.find({});
        return res.status(200).json(products);
        // res.status(200).json(products);
    } catch (error) {
        res.status(500).json({message:error.message});
       
    }
};


const getOnlyProduct = async(req,res) => {
    try {
   const {id} = req.params;
   const product = await Product.findById(id);
   res.status(200).json(product); 
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndUpdate(id, req.body);

    if (!product) {
      return res.status(404).json({ message: "Product cant found" });
    }

    const updatedProduct = await Product.findById(id);
    res
      .status(200)
      .json({ name: updatedProduct.name, quantity: updatedProduct.quantity });
    // res.status(200).json({name : updatedProduct.name, quantity: updatedProduct.quantity, fullProduct: updatedProduct});

    // res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({ message: "product cant found" });
    }

    res.status(200).json({ message: "product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getProducts,
  getOnlyProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
