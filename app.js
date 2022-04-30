require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const auth = require('./middlewares/auth');
const userRouter = require('./routes/users');
const moviesRouter = require('./routes/movies');
const errorsMiddleware = require('./middlewares/errors');
const {
  createUser,
  login,
} = require('./controllers/users');
const NotFoundError = require('./errors/not-found-err');
const { requestLogger, errorLogger } = require('./middlewares/logger');
// Слушаем 3000 порт
const { PORT = 3000 } = process.env;

const validateURL = (value) => {
  if (!validator.isURL(value, { require_protocol: true })) {
    throw new Error('Неправильный формат ссылки');
  }
  return value;
};

const app = express();
app.use(express.json());

app.use(requestLogger); // подключаем логгер запросов

app.use(cors());

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.use(auth);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/bitfilmsdb', (err) => {
  if (err) throw err;
  console.log('connected to MongoDB');
});

app.use(userRouter);
app.use(moviesRouter);
// если ни один из маршрутов не отвечает, то передаем ошибку 404
app.use(() => {
  throw new NotFoundError('Ошибка 404 - Неправильный путь');
});

app.use(errorLogger); // подключаем логгер ошибок

app.use(errors());
app.use(errorsMiddleware);

app.listen(PORT, () => {
    // Если всё работает, консоль покажет, какой порт приложение слушает
    console.log(`App listening on port ${PORT}`)
})