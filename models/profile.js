'use strict';
let formatDate = require('../helper/formattedDate')
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Profile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Profile.belongsTo(models.User)
    }

    get formattedName(){
      return `${this.firstName} ${this.lastName}`;
    }

    age(){
      let present = {
        year : new Date().getFullYear(),
        month : new Date().getMonth(),
        day : new Date().getDate()
      }

      let birthDate = {
        year : this.birthDate.getFullYear(),
        month : this.birthDate.getMonth(),
        day : this.birthDate.getDate()
      }

      let age = present.year - birthDate.year
      let month = present.month - birthDate.month
      let day = present.day - present.day

      if(month < 0 || month === 0 && day < 0){
        age--
      }
      return age
    }

    get formattedDate(){
      return formatDate(this.birthDate)
    }
  }
  Profile.init({
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    birthDate: DataTypes.DATE,
    profileImgurl: DataTypes.TEXT,
    UserId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Profile',
  });
  return Profile;
};