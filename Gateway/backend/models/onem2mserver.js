const Sequelize = require('sequelize');

module.exports = class Onem2mServer extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            host: {
              type: Sequelize.STRING(50),
              require: true,
              unique: true,
              allowNull: false,
            },
            port: {
              type: Sequelize.INTEGER,
              require: true,
              allowNull: false,
            },
            name: {
              type: Sequelize.STRING(50),
              require: true,
              allowNull: false,
            },
            cseid: {
              type: Sequelize.STRING(50),
              require: true,
              allowNull: false,
          },
        }, {
            sequelize,
            timestamps: true,//createdAt, updateAt, deletedAt 칼럼도 생성됨
            underscored: false,
            modelName: 'Onem2mServer',
            tableName: 'Onem2mServers',
            paranoid: false,//true면 deletedAt 생성됨
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }

    static associate(db) {

    }
};