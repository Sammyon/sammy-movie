'use strict';
const {encrypt} = require('../helpers/bcrypt')
const {Op} = require("sequelize")

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Movie, {foreignKey: "authorId"})
      // User.belongsToMany(models.Movie, {through: models.WatchList})
    }

    get joinDate () {
      const option = {weekday: 'long', day: '2-digit', month: 'long', year: 'numeric'}
      return new Date (this.createdAt).toLocaleDateString('en', option) 
    }
  }
  User.init({
    username: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: { msg: "Email Cannot be Null" },
        notEmpty: { msg: "Email is Required" },
        isEmail: { msg: "Must be in Email Format" },
        isUnique: async function (email, next){
          try {
            let isUnique = await User.findOne({
              where : {
                email,
                id:{[Op.ne]: this.id}
              }
            })
            if(isUnique){
              throw ('Email Already Registered')
            }
            next()
          } catch (error) {
            next(error)
          }
        } 
      },
    },
    password:  {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "Password Cannot be Null" },
        notEmpty: { msg: "Password is Required" },
        len: {
          args: [5],
          msg: 'Password Length At Least 5 Letters'
        }
      }
    },
    role: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    address: DataTypes.STRING
  }, {
    hooks: {
      beforeCreate: (data) => {
        data.password = encrypt(data.password, 10)
      },
      beforeBulkUpdate: (data) => {
        data.attributes.password = encrypt(data.attributes.password, 10)
      }
    },
    sequelize,
    modelName: 'User',
  });
  return User;
};