const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
  try {
    // Token'i header'dan veya session'dan al
    let token = null;
    
    // 1. Authorization header'dan token kontrol et
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    // 2. Session'dan token kontrol et
    if (!token && req.session && req.session.token) {
      token = req.session.token;
    }

    // Token yoksa hata döndür
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Giriş yapmış kullanıcı gerekli. Token bulunamadı.'
      });
    }

    // Token'i doğrula
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-jwt-secret');
    } catch (jwtError) {
      // JWT hatası durumunda session'ı temizle
      if (req.session) {
        req.session.destroy();
      }
      
      return res.status(401).json({
        success: false,
        message: 'Oturum süreniz dolmuştur, lütfen tekrar giriş yapın'
      });
    }

    // Kullanıcı bilgilerini request'e ekle
    req.user = {
      id: decoded.userId || decoded.id,
      username: decoded.username,
      email: decoded.email
    };

    // Session'da kullanıcı bilgileri yoksa ekle
    if (req.session && !req.session.userId) {
      req.session.userId = req.user.id;
      req.session.username = req.user.username;
    }

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    
    // Session'ı temizle
    if (req.session) {
      req.session.destroy();
    }
    
    return res.status(500).json({
      success: false,
      message: 'Kimlik doğrulama sırasında bir hata oluştu'
    });
  }
};



module.exports = authMiddleware;
