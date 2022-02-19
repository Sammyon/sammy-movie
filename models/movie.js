'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Movie extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Movie.belongsTo(models.User, {foreignKey: "authorId"})
      Movie.belongsTo(models.Genre, {foreignKey: "genreId"})
      Movie.hasMany(models.History, {foreignKey: "entityId"})
      // Movie.belongsToMany(models.User, {through: models.WatchList})
    }
  }
  Movie.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "Title Cannot be Null" },
        notEmpty: { msg: "Title is Required" },
      }
    },
    synopsis: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: { msg: "Synopsis Cannot be Null" },
        notEmpty: { msg: "Synopsis is Required" },
      }
    },
    trailerUrl: DataTypes.STRING,
    imgUrl: DataTypes.STRING,
    rating: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        notNull: { msg: "Rating Cannot be Null" },
        notEmpty: { msg: "Rating is Required" },
        min: {
          args: 1,
          msg: "Rating Can't be Less than 1"
        }
      }
    },
    genreId: DataTypes.INTEGER,
    authorId: DataTypes.INTEGER,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Movie',
  });
  return Movie;
};