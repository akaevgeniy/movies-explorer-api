const moviesRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
// импортируем контроллеры и добавляем их в качестве колбэков в методы роутов карточек
const {
  getMovies,
  createMovie,
  createCard,
  dislikeCard,
  likeCard,
} = require('../controllers/cards');

const validateURL = (value) => {
  if (!validator.isURL(value, { require_protocol: true })) {
    throw new Error('Неправильный формат ссылки');
  }
  return value;
};

moviesRouter.get('/movies', getMovies);

moviesRouter.delete('/movies/:_id', celebrate({
  params: Joi.object().keys({
    _id: Joi.number().required(),
  }),
}), deleteMovie);

// валидируем приходящие на сервер данные
// Если тело запроса не пройдёт валидацию, контроллеры не запустятся
moviesRouter.post('/movies', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().custom(validateURL).required(),
    trailerLink: Joi.string().custom(validateURL).required(),
    thumbnail: Joi.string().custom(validateURL).required(),
    owner: Joi.string().required().length(24).hex(),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), createMovie);


module.exports = moviesRouter;
