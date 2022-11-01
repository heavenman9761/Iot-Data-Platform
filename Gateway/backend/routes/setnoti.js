const express = require('express');
const Device = require('../models/device')
const SetNoti = require('../models/setnoti')
const { isLoggedIn } = require('./middlewares');
const gValue = require('../globalv');

const router = express.Router();

router.get('/', isLoggedIn, async (req, res, next) => {
  try {
    const setNoti = await SetNoti.findAll({
      where: { deletedAt: null }
    });
    res.status(200).json(setNoti);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.post('/', isLoggedIn, async (req, res, next) => {
  try {
    var notiInfo = [];
    const item = await SetNoti.findAll({});
    if (item) {
      item.forEach((value, index) => {
        const noti = {
          datakey: value.datakey,
          threshold: value.threshold,
          morethan: value.morethan,
          action: value.action,
          realchart: value.realchart,
          realdata: 0
        }

        const findIndex = notiInfo.findIndex(x => x.device === value.device);
        if (findIndex === -1) {
          const obj = {
            device: value.device,
            noti: [noti]
          }
          notiInfo.push(obj);
        } else {
          notiInfo[findIndex].noti.push(noti);
        }
      });
    }
    // console.log("notiInfo", notiInfo);
    res.status(200).json(notiInfo);
  } catch (err) {
    console.error(err);
  }
});

router.post('/addnoti', isLoggedIn, async (req, res, next) => {
  const { device, datakey, threshold, morethan, action, realchart } = req.body;
  try {
    const setNoti = await SetNoti.create({
      device: device,
      datakey: datakey,
      threshold: threshold,
      morethan: morethan,
      action: action,
      realchart: realchart,
    });
    res.status(200).json(setNoti);

  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.put('/editNoti', isLoggedIn, async (req, res, next) => {
  try {
    const { id, device, datakey, threshold, morethan, action, realchart } = req.body;

    const setNoti = await SetNoti.update({
      device: device,
      datakey: datakey,
      threshold: threshold,
      morethan: morethan,
      action: action,
      realchart: realchart,
    }, {
      where: { id: id }
    });
    res.status(200).json(setNoti);

  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.delete('/remove/:setnotiid', isLoggedIn, async (req, res, next) => {
  const id = req.params.setnotiid;
  try {
    const setNoti = await SetNoti.destroy({ where: { id: id } });
    
    res.status(200).json(setNoti);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;