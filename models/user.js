const validator = require('validator');
const mongoose = require('mongoose');
// схема пользователя, состоит из двух обязательных полей, остальные
// поля будут иметь дефолтное значение после создания
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: validator.isEmail,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

module.exports = mongoose.model('user', userSchema);