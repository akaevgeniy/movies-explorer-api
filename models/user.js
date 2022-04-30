const validator = require('validator');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const Unauthorized = require('../errors/unauth');
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
// метод мангуста для авторизации пользователя
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new Unauthorized('Неправильные почта или пароль');
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new Unauthorized('Неправильные почта или пароль');
          }

          return user; // теперь user доступен
        });
    });
};


module.exports = mongoose.model('user', userSchema);