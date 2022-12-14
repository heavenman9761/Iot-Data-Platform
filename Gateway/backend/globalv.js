var request = require('request');
require('date-utils');

const DomainInfo = require('./models/domaininfo')
const DeviceType = require('./models/devicetype');
const Device = require('./models/device');
const Onem2mServer = require('./models/onem2mserver')
const SetNoti = require('./models/setnoti')

var Promise = require('promise');

var saupjaId = '';
var saupjaName = '';
var deviceTypes = [];
var deviceInfos = [];
var notiInfos = [];
var onem2mInfo = null;
var requestNr = 0;

async function setOneM2MInfo(async) {
  try {
    onem2mInfo = null;
    const item = await Onem2mServer.findAll({});
    if (item.length > 0) {
      onem2mInfo = {
        cse_host: item[0].dataValues.host,
        cse_port: item[0].dataValues.port,
        cse_name: item[0].dataValues.name,
        cse_cseid: item[0].dataValues.cseid,
        cse_wsport: '7577',
        cse_URL: `http://${item[0].dataValues.host}:${item[0].dataValues.port}`,
        api: 'esct.co.kr',
        cseRelease: 1,
        acp_required: false,
        ctnPrepared: false,
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
    if (domainInfo.length > 0) {
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

async function setDeviceInfos(async) {
  try {
    deviceInfos = [];
    const device = await Device.findAll({});
    if (device) {
      device.forEach((value, index, item) => {
        const d = {
          name: device[index].dataValues.name,
          addr: device[index].dataValues.address,
          datakeys: device[index].dataValues.datakeys,
          onem2mkeys: device[index].dataValues.onem2mkeys,
          ae_name: device[index].dataValues.ae_name,
        }
        deviceInfos.push(d);
      });
    }
    
    console.log('setDeviceInfos()', deviceInfos);
  } catch (err) {
    console.error(err);
  }
}

function getDeviceInfos() {
  return deviceInfos;
}

function getNotiInfo() {
  return notiInfos;
}

async function setNotiInfo(async) {
  try {
    notiInfos = [];
    const noti = await SetNoti.findAll({});
    if (noti) {
      noti.forEach((value, index, item) => {
        const d = {
          device: noti[index].dataValues.device,
          datakey: noti[index].dataValues.datakey,
          threshold: noti[index].dataValues.threshold,
          action: noti[index].dataValues.action,
          realchart: noti[index].dataValues.realchart,
        }
        notiInfos.push(d);
      });
    }
    
    console.log('setNotiInfo()', notiInfos);
  } catch (err) {
    console.error(err);
  }
}

function createAE(name) {
  if (name != '') {
    conf = getOneM2MInfo();
    if (conf) {
      console.log("createAE()");
      var options = {
        uri: conf.cse_URL + "/" + conf.cse_name,
        method: "POST",
        headers: {
          "X-M2M-Origin": "S" + name,
          "X-M2M-RI": "req" + requestNr,
          "Content-Type": "application/vnd.onem2m-res+json;ty=2"
        },
        json: {
          "m2m:ae": {
            "rn": name,
            "api": conf.api,
            "rr": false
          }
        }
      };

      var rr = "false";
      var poa = "";
      console.log(options.method + " " + options.uri);
      console.log(options.json);

      if (conf.cseRelease != "1") {
        options.headers = Object.assign(options.headers, { "X-M2M-RVI": conf.cseRelease });
        options.json["m2m:ae"] = Object.assign(options.json["m2m:ae"], { "srv": ["2a"] });
      }

      requestNr += 1;
      request(options, function (err, resp, body) {
        if (err) {
          console.log("createAE() : " + err);
        } else {
          console.log("createAE() :" + resp.statusCode);
          if (resp.statusCode == 409) {
            console.log("createAE() [RESPONSE] - failure");
            resetAE(name);
          } else {
            console.log("createAE() [RESPONSE] - success:" + resp.statusCode);
            if (conf.acp_required) {
              console.log("createAccessControlPolicy()")
              //createAccessControlPolicy(name);
            } else {
              console.log("createDataContainer()")
              createDataContainer(name);
            }
          }
        }
      });
    }
  }
}

function resetAE(name) {
  if (name != '') {
    console.log("resetAE()");
    conf = getOneM2MInfo();
    if (conf) {
      var options = {
        uri: conf.cse_URL + "/" + conf.cse_name + "/" + name,
        method: "DELETE",
        headers: {
          "X-M2M-Origin": "S" + name,
          "X-M2M-RI": "req" + requestNr,
        }
      };
      console.log(options);

      if (conf.cseRelease != "1") {
        options.headers = Object.assign(options.headers, { "X-M2M-RVI": conf.cseRelease });
      }

      requestNr += 1;
      request(options, function (error, response, body) {
        if (error) {
          console.log("resetAE() [RESPONSE] - failure");
          console.log(error);
        } else {
          console.log("resetAE() [RESPONSE] - success");
          console.log(response.statusCode);
          console.log(body);
          createAE(name);
        }
      });
    }
  }
}

function deleteAE(name) {
  if (name != '') {
    conf = getOneM2MInfo();
    if (conf) {
      var options = {
        uri: conf.cseURL + "/" + conf.cse_name + "/" + name,
        method: "DELETE",
        headers: {
          "X-M2M-Origin": "S" + name,
          "X-M2M-RI": "req" + requestNr,
        }
      };
    
      if (conf.cseRelease != "1") {
        options.headers = Object.assign(options.headers, { "X-M2M-RVI": conf.cseRelease });
      }
      
      requestNr += 1;
      request(options, function (error, response, body) {
        if (error) {
          console.log(error);
        } else {
          console.log(response.statusCode);
          console.log(body);
    
        }
      });
    }
  }
}

function createDataContainer(name) {
  if (name != '') {
    console.log("createDataContainer()");
    conf = getOneM2MInfo();
    if (conf) {
      var options = {
        uri: conf.cse_URL + "/" + conf.cse_name + "/" + name,
        method: "POST",
        headers: {
          "X-M2M-Origin": "S" + name,
          "X-M2M-RI": "req" + requestNr,
          "Content-Type": "application/json;ty=3"
        },
        json: {
          "m2m:cnt": {
            "rn": "DATA",
            "mni": 10000
          }
        }
      };

      options.json["m2m:cnt"] = Object.assign(options.json["m2m:cnt"], {});

      console.log(options.method + " " + options.uri);
      console.log(options.json);

      if (conf.cseRelease != "1") {
        options.headers = Object.assign(options.headers, { "X-M2M-RVI": conf.cseRelease });
      }

      requestNr += 1;
      request(options, function (error, response, body) {
        if (error) {
          console.log("createDataContainer() [RESPONSE] - failure", error);
          conf.ctnPrepared = false;
        } else {
          console.log("createDataContainer() [RESPONSE] - success", response.statusCode);
          console.log(body);
          createContentInstance(name, '')
          conf.ctnPrepared = true;
        }
      });
    }
  }
}

function createContentInstance(name, data) {
  if (name != '') {
    console.log("createContentInstance()", name, data);
    conf = getOneM2MInfo();
    if (conf) {
      var options = {
        uri: conf.cse_URL + "/" + conf.cse_name + "/" + name + "/DATA",
        method: "POST",
        headers: {
          "X-M2M-Origin": "S" + name,
          "X-M2M-RI": "req" + requestNr,
          "Content-Type": "application/json;ty=4"
        },
        json: {
          "m2m:cin": {
            "con": data
          }
        }
      };

      console.log(options.method + " " + options.uri);
      console.log(options.json);

      if (conf.cseRelease != "1") {
        options.headers = Object.assign(options.headers, { "X-M2M-RVI": conf.cseRelease });
      }

      requestNr += 1;
      request(options, function (error, response, body) {
        if (error) {
          console.log("createContentInstance() - failure", error);
        } else {
          console.log("createContentInstance() - success", response.statusCode, requestNr);
          console.log(body);
        }
      });
    }
  }
}

module.exports = {
  saupjaId,
  saupjaName,
  deviceInfos,
  deviceTypes,
  onem2mInfo,
  notiInfos,
  setDomainInfo,
  setDeviceTypes,
  setDeviceInfos,
  getSaupjaId,
  getSaupjaName,
  getDeviceInfos,
  getDeviceTypes,
  setOneM2MInfo,
  getOneM2MInfo,
  createAE,
  resetAE,
  deleteAE,
  createContentInstance,
  getNotiInfo,
  setNotiInfo,
}
