const Sequelize = require('sequelize');

module.exports = class SetNoti extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      device: {
        type: Sequelize.STRING(40),
        allowNull: false,
        require: true
      },
      datakey: {
        type: Sequelize.STRING(40),
        allowNull: false,
        require: true,
      },
      threshold: {
        type: Sequelize.INTEGER,
        require: true,
        defaultValue:0,
      },
      morethan: {
        type: Sequelize.BOOLEAN,
        require: true,
        defaultValue: 1
      },
      action: {
        type: Sequelize.STRING(4),
        allowNull: false,
        defaultValue:'',
      },
      realchart: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      toserver: {
        type: Sequelize.STRING(15),
        allowNull: false,
        defaultValue: '',
        require: true
      },
    }, {
      sequelize,
      timestamps: true,//createdAt, updateAt, deletedAt 칼럼도 생성됨
      underscored: false,
      modelName: 'SetNoti',
      tableName: 'SetNotis',
      paranoid: true,//createdAt, updateAt, deletedAt 칼럼도 생성됨
      charset: 'utf8',
      collate: 'utf8_general_ci',
    });
  }

  static associate(db) {

  }
};