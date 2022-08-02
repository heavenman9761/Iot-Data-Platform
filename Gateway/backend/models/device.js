const Sequelize = require('sequelize');

module.exports = class Device extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            devicetype: {
                type: Sequelize.STRING(40),
                allowNull: false,
                require: true
            },
            name: {
                type: Sequelize.STRING(40),
                allowNull: false,
                require: true
            },
            address: {
                type: Sequelize.STRING(17),
                unique: true,
                allowNull: false,
                require: true
            },
            datakeys: {
                type: Sequelize.STRING(100),
                allowNull: false,
                require: true
            },
            onem2mkeys: {
                type: Sequelize.STRING(100),
                allowNull: true,
            },
            owner: {
                type: Sequelize.STRING(40),
                allowNull: false,
            },
        }, {
            sequelize,
            timestamps: true,//createdAt, updateAt, deletedAt 칼럼도 생성됨
            underscored: false,
            modelName: 'Device',
            tableName: 'Devices',
            paranoid: true,//createdAt, updateAt, deletedAt 칼럼도 생성됨
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }

    static associate(db) {

    }
};