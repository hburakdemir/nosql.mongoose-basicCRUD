const Favorite = require("../models/favoriteModel");

// Favori ekleme veya çıkarma (toggle)
const favoriteToggle = async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = req.params.productId;

    // Daha önce favorilenmiş mi kontrol et
    const existing = await Favorite.findOne({ user: userId, product: productId });

    if (existing) {
      // Varsa sil
      await Favorite.deleteOne({ _id: existing._id });
      return res.json({ message: "Removed from favorites", removed: true });
    } else {
      // Yoksa ekle
      const favorite = new Favorite({ user: userId, product: productId });
      await favorite.save();
      return res.json({ message: "Added to favorites", favorite, added: true });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Kullanıcının favorilerini listeleme
const getFavorites = async (req, res) => {
  try {
    const userId = req.user.id;

    const favorites = await Favorite.find({ user: userId })
      .populate("product")
      .sort({ createdAt: -1 });

    res.json({ favorites });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { favoriteToggle, getFavorites };
