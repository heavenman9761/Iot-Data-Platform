const Sequelize = require('sequelize');

module.exports = class DomainInfo extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      saupjaid: {
        type: Sequelize.STRING(12),
        require: true,
        unique: true,
        allowNull: false,
      },
      saupjaname: {
        type: Sequelize.STRING(50),
        require: true,
        allowNull: false,
        defaultValue: '',
      },
      postcode: {
        type: Sequelize.STRING(10),
        require: false,
        allowNull: false,
        defaultValue: '',
      },
      addr: {
        type: Sequelize.STRING(100),
        require: false,
        allowNull: false,
        defaultValue: '',
      },
      extraAddr: {
        type: Sequelize.STRING(50),
        require: false,
        allowNull: false,
        defaultValue: '',
      },
      tel: {
        type: Sequelize.STRING(15),
        require: false,
        allowNull: false,
        defaultValue: '',
      },
      fax: {
        type: Sequelize.STRING(15),
        require: false,
        allowNull: false,
        defaultValue: '',
      }
    }, {
      sequelize,
      timestamps: true,//createdAt, updateAt, deletedAt 칼럼도 생성됨
      underscored: false,
      modelName: 'DomainInfo',
      tableName: 'DomainInfos',
      paranoid: false,//true면 deletedAt 생성됨
      charset: 'utf8',
      collate: 'utf8_general_ci',
    });
  }

  static associate(db) {

  }
};