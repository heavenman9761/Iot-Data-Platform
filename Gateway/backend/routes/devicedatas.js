const express = require('express');
const DeviceData = require('../models/devicedata');
const Sequelize = require('sequelize');
const gValue = require('../globalv');

const Op = Sequelize.Op

const router = express.Router();

var lastDate = new Date();

router.post('/data', async (req, res, next) => {
  const newDate = new Date();
  // const datas = req.body;
  // console.log(datas);
  if (gValue.getDeviceTypes().indexOf(req.body.type) > -1 && gValue.getSaupjaId() != '' && gValue.getSaupjaName() != '') {
    const datas = req.body.devices;
    if (newDate.getTime() - lastDate.getTime() > 2000) {
      datas.forEach(async (data) => {
        try {
          gValue.getDeviceInfos().forEach((deviceInfo, index, array) => {
            if (deviceInfo.name === data.name) {
              const dataKeys = deviceInfo.datakeys;
              const dataKeyList = dataKeys.split(';');
              dataKeyList.forEach(async (item, index, arr) => {
                if (Object.keys(data).includes(item)) {
                  try {
                    const d = await DeviceData.create({
                      saupjaid: gValue.getSaupjaId(),
                      saupjaname: gValue.getSaupjaName(),
                      devicename: data.name,
                      address: data.id,
                      field: item,
                      data: data[item]
                    });
                  } catch (err) {
                    console.error(err);
                    next(err);
                  }
                }
              });

              if (deviceInfo.onem2mKeys != '') {
                const onem2mKeys = deviceInfo.onem2mkeys;
                const onem2mKeyList = onem2mKeys.split(';');
                var obj = {};

                onem2mKeyList.forEach(async (item, index, arr) => {
                  if (Object.keys(data).includes(item)) {
                    obj[item] = data[item];
                  }
                });
                if (JSON.stringify(obj) != '{}') {
                  gValue.createContentInstance(deviceInfo.ae_name, JSON.stringify(obj))
                }
              }
            }
          });

          gValue.getNotiInfo().forEach((notiInfo) => {
            if (notiInfo.device === data.name) {
              if (Object.keys(data).includes(notiInfo.datakey)) {
                const obj = {
                  'realData': data[notiInfo.datakey],
                  'schema': notiInfo
                }
                req.io.emit('realData', obj)
              }
            }
          });
        } catch (err) {
          console.error(err);
          next(err);
        }
      });
      lastDate = new Date();
    }
  }
  res.sendStatus(200);
});

router.post('/getdata', async function (req, res, next) {
  const addr = req.body.addr;
  const count = parseInt(req.body.count);
  try {
    const d = await DeviceData.findAll({
      where: { address: addr },
      order: [['createdAt', 'DESC']],
      attributes: ['id', 'saupjaid', 'saupjaname', 'devicename', 'address', 'field', 'data', 'createdAt'],
      limit: count
    });
    res.json(d);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.post('/getdata2', async function (req, res, next) {
  const device = req.body.device;
  const datakey = req.body.datakey;
  const startDate = req.body.startDate;
  const endDate = req.body.endDate;
  const limit = req.body.limit;

  const TODAY_START = new Date().setHours(-9, 0, 0, 0)
  const NOW = new Date()

  var newStartDate = new Date(startDate + ' 15:00:00');  //Timezone??? +9 ????????? ....... bla bla
  newStartDate.setDate(newStartDate.getDate() - 1)

  const newEndDate = new Date(endDate + ' 14:59:59');

  try {
    const d = await DeviceData.findAll({
      where: {
        devicename: device,
        field: datakey,
        createdAt: {
          [Op.gte]: newStartDate,
          [Op.lte]: newEndDate
        }
      },
      order: [['createdAt', 'DESC']],
      attributes: ['createdAt', 'devicename', 'address', 'field', 'data'],
      limit: parseInt(limit)
    });
    res.json(d);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.post('/getdeviceinfo', async function (req, res, next) {
  const deviceName = req.body.deviceName;
  if (deviceName === 'all') {
    res.send(gValue.getDeviceInfos());
  }
});

router.post('/attr', (req, res, next) => {
  // console.log("===============");
  // console.log('/attr', req.body);
  res.sendStatus(200);
});

module.exports = router;
