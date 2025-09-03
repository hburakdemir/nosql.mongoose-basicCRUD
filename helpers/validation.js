const validateEmail = (email) => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.com$/;
  return emailPattern.test(email);
};

// Password kuralları: en az 8 karakter, 1 büyük harf, 1 sayı, 1 özel karakter
const validatePassword = (password) => {
  const passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
  return passwordPattern.test(password);
};

module.exports = { validateEmail, validatePassword };