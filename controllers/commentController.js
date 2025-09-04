const Comment = require("../models/commentModel");

// Yorum ekleme
const addComment = async (req, res) => {

  try {
    const { productId, text } = req.body;
    const userId = req.user.id; // auth middleware'den geliyor
      console.log("req.user:", req.user);       // token decode kontrolü
  console.log("req.body:", req.body);  

    if (!text) {
      return res.status(400).json({ success: false, message: "Yorum boş olamaz" });
    }

    // Kullanıcı daha önce bu ürüne yorum yaptıysa hata döndür
    const existingComment = await Comment.findOne({ user: userId, product: productId });
    if (existingComment) {
      return res.status(400).json({ success: false, message: "Zaten bu ürüne yorum yapmışsınız" });
    }

    const comment = await Comment.create({
      user: userId,
      product: productId,
      text,
    });

    res.status(201).json({ success: true, message: "Yorum başarıyla eklendi", comment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Yorum eklenirken bir hata oluştu" });
  }
};

const getCommentsByProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({ success: false, message: "Product ID gerekli" });
    }

    const comments = await Comment.find({ product: productId })
      .populate("user", "name email") // sadece name ve email gelsin
      .sort({ createdAt: -1 }); // en yeni yorum en başta

    res.status(200).json({
      success: true,
      count: comments.length,
      comments,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Yorumlar alınırken bir hata oluştu" });
  }
};

const deleteComment = async (req, res) => {
  console.log("commentId param:", req.params.commentId);

  try {
    const { commentId } = req.params;
    const userId = req.user.id; 
    
   

    // Yorumu bul
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ success: false, message: "Yorum bulunamadı" });
    }

    // Kullanıcı kendi yorumunu ya da admin ise silebilir
    if (comment.user.toString() !== userId && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Bu yorumu silme yetkiniz yok" });
    }

    await Comment.findByIdAndDelete(commentId);

    res.status(200).json({ success: true, message: "Yorum başarıyla silindi" });
  } catch (error) {
    console.error("delete comment error",error);
    res.status(500).json({ success: false, message: "Yorum silinirken bir hata oluştu" });
  }
};

module.exports = { addComment, getCommentsByProduct,deleteComment };
