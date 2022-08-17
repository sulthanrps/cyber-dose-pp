'use strict';
const bcryptjs = require('bcryptjs')
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
      User.hasOne(models.Profile)
      User.hasMany(models.Post)
    }
  }
  User.init({
    email: {
      type: DataTypes.STRING,
      allowNull : false,
      unique : true,
      validate : {
        notNull : {
          msg : "Email can't be null !"
        },
        notEmpty : {
          msg : "Email can't be empty !"
        },
        isEmail : {
          msg : "Email should be in email format !"
        }
      }
    },
    password: {
      type : DataTypes.STRING,
      allowNull: false,
      validate : {
        notNull: {
          msg: "Password can't be null !"
        },
        notEmpty : {
          msg : "Password can't be empty !"
        },
        len: {
          args: [8, 16],
          msg: "Minimum password length is 8 characters, and maximum password length is 16 characters !"
        }
      }
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      validate : {
        notNull: {
          msg: "role can't be null"
        },
        notEmpty : {
          msg: "role can't be empty"
        }
      }
    },
    username : {
      type : DataTypes.STRING,
      allowNull: false,
      validate : {
        notNull: {
          msg : "Username can't be null !"
        },
        notEmpty: {
          msg: "Username can't be empty !"
        }
      }
    }
  }, {
    hooks : {
      beforeCreate(user, option){
        const salt = bcryptjs.genSaltSync(10)
        const hash = bcryptjs.hashSync(user.password, salt)

        user.password = hash
      }
    },
    sequelize,
    modelName: 'User',
  });
  return User;
};