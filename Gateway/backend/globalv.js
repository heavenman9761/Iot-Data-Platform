const DomainInfo = require('./models/domaininfo')
const DeviceType = require('./models/devicetype');
const Device = require('./models/device');

var saupjaId = '';
var saupjaName = '';
var deviceTypes = [];
var deviceAddrs = [];

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
    setDomainInfo,
    setDeviceTypes,
    setDeviceAddrs,
    getSaupjaId,
    getSaupjaName,
    getDeviceAddrs,
    getDeviceTypes
}
