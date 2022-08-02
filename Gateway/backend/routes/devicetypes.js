const express = require('express');
const DeviceType = require('../models/devicetype')
const { isLoggedIn } = require('./middlewares');
const gValue = require('../globalv');

const router = express.Router();
// router.use((req, res, next) => {
//   res.locals.user = req.user;
// });

router.get('/', isLoggedIn, async (req, res, next) => {
    try {
        const deviceType = await DeviceType.findAll({
            // where: { deletedAt: null }
        });
        console.log(deviceType)
        res.status(200).json(deviceType);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.post('/addType', isLoggedIn, async (req, res, next) => {
    const devicetype = req.body.devicetype;
    try {
        const deviceType = await DeviceType.create({
            devicetype: devicetype,
        });
        gValue.setDeviceTypes();
        res.status(200).json(deviceType);

    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.put('/editType', isLoggedIn, async (req, res, next) => {
    try {
        const { id, devicetype } = req.body;
        const deviceType = await DeviceType.update({
            devicetype: devicetype,
        }, {
            where: { id: id }
        });
        gValue.setDeviceTypes();
        res.status(200).json(deviceType);

    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.delete('/remove/:deviceID', isLoggedIn, async (req, res, next) => {
    const id = req.params.deviceID;
    console.log("device delete", id);
    try {
        const device = await DeviceType.destroy({ where: { id: id } });
        gValue.setDeviceTypes();
        res.status(200).json(device);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

module.exports = router;