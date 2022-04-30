const Movie = require('../models/movie');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-req-err');
const NoRightError = require('../errors/right-err');

// контроллер получения всех карточек
module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .populate(['owner'])
    .then((movies) => res.send({ data: movies }))
    .catch(next);
};
// создание новой карточки
module.exports.createMovie = (req, res, next) => {
  const { country, director, duration, year, description, image, trailer, nameRU, nameEN, thumbnail, movieId } = req.body;
  const owner = req.user._id;
  Movie.create({ country, director, duration, year, description, image, trailer, nameRU, nameEN, thumbnail, movieId, owner })
    .then((movie) => res.send({ data: movie }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Переданы некорректные данные');
      }
      next(err);
    })
    .catch(next);
};
// удаление карточки по ид
module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .orFail(new NotFoundError('Карточка по заданному id отсутствует в базе'))
    .then((movie) => {
      if (req.user._id !== movie.owner.toString()) {
        throw new NoRightError('Нет прав для удаления данной карточки');
      }

      return Movie.findByIdAndRemove(req.params.movieId)
        .orFail(new NotFoundError('Карточка по заданному id отсутствует в базе'))
        .then(() => res.send({ message: 'Пост был удален' }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Невалидный id ');
      }
      next(err);
    })
    .catch(next);
};
