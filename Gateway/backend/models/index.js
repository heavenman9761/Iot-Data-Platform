const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const User = require('./user');
const Device = require('./device');
const DeviceData = require('./devicedata');
const DeviceType = require('./devicetype');
const DomainInfo = require('./domaininfo');

const db = {};
const sequelize = new Sequelize(
  config.database, config.username, config.password, config,
);

db.sequelize = sequelize;
db.User = User;
db.Device = Device;
db.DeviceType = DeviceType;
db.DomainInfo = DomainInfo;

User.init(sequelize);
Device.init(sequelize);
DeviceData.init(sequelize);
DeviceType.init(sequelize);
DomainInfo.init(sequelize);

User.associate(db);
Device.associate(db);
DeviceData.associate(db);
DeviceType.associate(db);
DomainInfo.associate(db);

module.exports = db;