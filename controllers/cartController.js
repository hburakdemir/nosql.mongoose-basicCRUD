const Cart = require("../models/cartModel");

// Kullanıcıya ait cart getir
const getCart = async (req, res) => {
  try {
    const userId = req.user.id;

const cart = await Cart.findOne({ userId }).populate("products.productId");
    if (!cart) return res.status(200).json({ success: true, cart: { products: [] } });

    res.status(200).json({ success: true, cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Ürünü sepete ekle
const addToCart = async (req, res) => {
  const { productId } = req.body;
  const userId = req.user.id;

  try {
    let cart = await Cart.findOne({ userId });

    if (cart) {
      // cart varsa ve ürün listesinde null product varsa temizle
      cart.products = cart.products.filter(p => p.productId !== null);

      // ürünü bul
      const itemIndex = cart.products.findIndex(p => p.productId.toString() === productId);
      if (itemIndex > -1) {
        // zaten varsa quantity artır
        cart.products[itemIndex].quantity += 1;
      } else {
        // yoksa yeni ürün ekle
        cart.products.push({ productId, quantity: 1 });
      }
    } else {
      // cart yoksa yeni cart oluştur
      cart = new Cart({
        userId,
        products: [{ productId, quantity: 1 }]
      });
    }

    await cart.save();
    const populatedCart = await cart.populate("products.productId");
    res.status(200).json({ success: true, cart: populatedCart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Ürünü azalt / sil
const removeFromCart = async (req, res) => {
  const { productId } = req.body;
  const userId = req.user.id;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

    const itemIndex = cart.products.findIndex(p => p.productId.toString() === productId);

    if (itemIndex > -1) {
      if (cart.products[itemIndex].quantity > 1) {
        cart.products[itemIndex].quantity -= 1;
      } else {
        cart.products.splice(itemIndex, 1);
      }
    }

    await cart.save();
    const populatedCart = await cart.populate("products.productId");
    res.status(200).json({ success: true, cart: populatedCart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getCart, addToCart, removeFromCart };
