const Sequelize = require('sequelize');

module.exports = class DeviceType extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            devicetype: {
                type: Sequelize.STRING(40),
                allowNull: true,
            }
        }, {
            sequelize,
            timestamps: true,//createdAt, updateAt, deletedAt 칼럼도 생성됨
            underscored: false,
            modelName: 'DeviceType',
            tableName: 'DeviceTypes',
            paranoid: false,//createdAt, updateAt, deletedAt 칼럼도 생성됨
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }

    static associate(db) {

    }
};