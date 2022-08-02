const express = require('express');
const DeviceData = require('../models/devicedata');
const gValue = require('../globalv');

const router = express.Router();

router.post('/data', async (req, res, next) => {
    // console.log(req.body);
    if (gValue.getDeviceTypes().indexOf(req.body.type) > -1 && gValue.getSaupjaId() != '' && gValue.getSaupjaName() != '') {
        const datas = req.body.devices;
        datas.forEach(async (data) => {
            try {
                gValue.getDeviceAddrs().forEach((value, index, array) => {
                    if (value.addr === data.id) {
                        const dataKeys = value.datakeys;
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
                    }
                });
            } catch (err) {
                console.error(err);
                next(err);
            }
        })
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

router.post('/attr', (req, res, next) => {
    // console.log("===============");
    // console.log('/attr', req.body);
    res.sendStatus(200);
});

module.exports = router;