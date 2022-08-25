const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      email: {
        type: Sequelize.STRING(40),
        allowNull: false,
        unique: true,
        require: true,

      },
      name: {
        type: Sequelize.STRING(40),
        allowNull: false,
        require: true,
      },
      password: {
        type: Sequelize.STRING(100),
        allowNull: false,
        require: true,
      },

    }, {
      sequelize,
      timestamps: true,
      underscored: false,
      modelName: 'User',
      tableName: 'users',
      paranoid: true,
      charset: 'utf8',
      collate: 'utf8_general_ci',
    });
  }

  static associate(db) {

  }
};