const DomainInfo = require('./models/domaininfo')
const DeviceType = require('./models/devicetype');
const Device = require('./models/device');
const Onem2mServer = require('./models/onem2mserver')

var saupjaId = '';
var saupjaName = '';
var deviceTypes = [];
var deviceAddrs = [];
var onem2mInfo = null;

async function setOneM2MInfo(async) {
  try {
    onem2mInfo = null;
    const item = await Onem2mServer.findAll({});
    if (item) {
      onem2mInfo = {
        cse_host: item[0].dataValues.host,
        cse_port: item[0].dataValues.port,
        cse_name: item[0].dataValues.name,
        cse_cseid: item[0].dataValues.cseid,
        cse_wsport: '7577',
        cse_URL: `http://${item[0].dataValues.host}:${item[0].dataValues.port}`,
      }
    }
    console.log("setOneM2MInfo()", onem2mInfo);
  } catch (err) {
    console.error(err);
  }
}

function getOneM2MInfo() {
  return onem2mInfo;
}

async function setDomainInfo(async) {
  try {
    saupjaId = '';
    saupjaName = '';
    const domainInfo = await DomainInfo.findAll({});
    if (domainInfo) {
      saupjaId = domainInfo[0].dataValues.saupjaid;
      saupjaName = domainInfo[0].dataValues.saupjaname;
    }
    console.log('setDomainInfo()', saupjaId, saupjaName);
  } catch (err) {
    console.error(err);
  }
}

function getSaupjaId() {
  return saupjaId;
}
function getSaupjaName() {
  return saupjaName;
}

async function setDeviceTypes(async) {
  try {
    deviceTypes = [];
    const deviceType = await DeviceType.findAll({});
    if (deviceType) {
      deviceType.forEach((value, index, item) => {
        deviceTypes.push(deviceType[index].dataValues.devicetype);
      });
    }
    console.log("setDeviceTypes()", deviceTypes);
  } catch (err) {
    console.error(err);
  }
}

function getDeviceTypes() {
  return deviceTypes;
}

async function setDeviceAddrs(async) {
  try {
    deviceAddrs = [];
    const device = await Device.findAll({});
    if (device) {
      device.forEach((value, index, item) => {
        const d = {
          addr: device[index].dataValues.address,
          datakeys: device[index].dataValues.datakeys,
          onem2mkeys: device[index].dataValues.onem2mkeys
        }
        deviceAddrs.push(d);
      });
    }
    console.log('setDeviceAddrs()', deviceAddrs);
  } catch (err) {
    console.error(err);
  }
}

function getDeviceAddrs() {
  return deviceAddrs;
}

module.exports = {
  saupjaId,
  saupjaName,
  deviceAddrs,
  deviceTypes,
  onem2mInfo,
  setDomainInfo,
  setDeviceTypes,
  setDeviceAddrs,
  getSaupjaId,
  getSaupjaName,
  getDeviceAddrs,
  getDeviceTypes,
  setOneM2MInfo,
  getOneM2MInfo
}
