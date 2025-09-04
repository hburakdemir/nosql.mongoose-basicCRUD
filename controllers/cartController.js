const Cart = require("../models/cartModel");

// Sepete ürün ekleme
const addToCart = async (req, res) => {
  const { productId } = req.body;
  const userId = req.user.id; // ✅ artık buradan geliyor

  try {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, products: [{ productId, quantity: 1 }] });
    } else {
      // Ürün sepette mi?
      const itemIndex = cart.products.findIndex(
        (p) => p.productId.toString() === productId
      );

      if (itemIndex > -1) {
        cart.products[itemIndex].quantity += 1; // adet arttır
      } else {
        cart.products.push({ productId, quantity: 1 });
      }
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Sepetten ürün çıkarma
const removeFromCart = async (req, res) => {
  const { productId } = req.body;
  const userId = req.user.id; // ✅

  try {
    let cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.products = cart.products.filter(
      (p) => p.productId.toString() !== productId
    );

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Kullanıcının sepetini getirme
const getCart = async (req, res) => {
  const userId = req.user.id; // ✅

  try {
    const cart = await Cart.findOne({ userId }).populate("products.productId");
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addToCart, removeFromCart, getCart };
