const Sequelize = require('sequelize');
const moment = require('moment') 

module.exports = class DeviceData extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            saupjaid: {
                type: Sequelize.STRING(12),
                allowNull: false,
                require: true,
            },
            saupjaname: {
                type: Sequelize.STRING(50),
                allowNull: false,
                require: true,
            },
            devicename: {
                type: Sequelize.STRING(50),
                allowNull: false,
                require: true,
            },
            address: {
                type: Sequelize.STRING(17),
                allowNull: false,
                require: true,
            },
            field: {
                type: Sequelize.STRING(20),
                allowNull: false,
                require: true,
            },
            data: {
                type: Sequelize.STRING(20),
                allowNull: false,
                require: true,
            },
            createdAt: {
              type: Sequelize.DATE,
              get() {
                return moment(this.getDataValue('createdAt'), 'YYYY-MM-DD HH:mm:ss').add(9, 'h').format('YYYY-MM-DD HH:mm:ss')
              }
            },
            updatedAt: {
                type: Sequelize.DATE,
                get() {
                  return moment(this.getDataValue('updatedAt'), 'YYYY-MM-DD HH:mm:ss').add(9, 'h').format('YYYY-MM-DD HH:mm:ss')
                }
            }
        }, {
            sequelize,
            timestamps: true,//createdAt, updateAt 칼럼도 생성됨
            underscored: false,
            modelName: 'DeviceData',
            tableName: 'DevicesDatas',
            paranoid: false,//true면  deletedAt 칼럼 생성됨
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }

    static associate(db) {

    }
};