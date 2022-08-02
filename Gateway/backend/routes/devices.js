const express = require('express');
const Device = require('../models/device')
const { isLoggedIn } = require('./middlewares');
const gValue = require('../globalv');

const router = express.Router();
// router.use((req, res, next) => {
//   res.locals.user = req.user;
// });

router.get('/', isLoggedIn, async (req, res, next) => {
  try {
    const devices = await Device.findAll({
      where: {deletedAt: null}
    });
    res.status(200).json(devices);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.post('/addDevice', isLoggedIn, async (req, res, next) => {
  const { devicetype, name, address, datakeys, onem2mkeys } = req.body;
    try {
      const device = await Device.create({
        devicetype: devicetype,
        name: name,
        address: address,
        datakeys: datakeys,
        onem2mkeys: onem2mkeys,
        owner: req.user.id
      });
      gValue.setDeviceAddrs();
      res.status(200).json(device);

    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.put('/editDevice', isLoggedIn, async (req, res, next) => {
  try {
    const { id, devicetype, name, address, datakeys, onem2mkeys } = req.body;
    const device = await Device.update({
      devicetype: devicetype,
      name: name,
      address: address,
      datakeys: datakeys,
      onem2mkeys: onem2mkeys
    }, {
      where: { id: id }
    });
    gValue.setDeviceAddrs();
    res.status(200).json(device);

  } catch (err) {
      console.error(err);
      next(err);
  }
});

router.delete('/remove/:deviceID', isLoggedIn, async (req, res, next) => {
  const id = req.params.deviceID;
  try {
    const device = await Device.destroy({ where: { id: id } });
    gValue.setDeviceAddrs();
    res.status(200).json(device);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;