const express = require('express');
const Onem2mServer = require('../models/onem2mserver')
const { isLoggedIn } = require('./middlewares');
const gValue = require('../globalv');
const router = express.Router();

router.get('/', isLoggedIn, async (req, res, next) => {
  try {
        const item = await Onem2mServer.findAll({});
        res.status(200).json(item);
  } catch (err) {
        console.error(err);
        next(err);
  }
});

router.post('/setonem2mserver', isLoggedIn, async (req, res, next) => {
    const { id, host, port, name, cseid } = req.body;
    try {
        const exData = await Onem2mServer.findOne({
            where: {id:id}
        });
        if (exData) {
            try {
                const item = await Onem2mServer.update({
                  host: host,
                  port: parseInt(port),
                  name: name,
                  cseid, cseid
                }, {
                    where: {id:id}
                });
                gValue.setOneM2MInfo();
                console.log(item);
                res.status(200).json(item);
            } catch(err) {
                console.error(err);
                next(err);
            }
        } else {
            try {
                const item = await Onem2mServer.create({
                  host: host,
                  port: parseInt(port),
                  name: name,
                  cseid, cseid
                });
                gValue.setOneM2MInfo();
                console.log(item);
                res.status(200).json(item);
          
            } catch (err) {
                console.error(err);
                next(err);
            }
        }
      
    } catch (err) {
        console.error(err);
        next(err);
    }
});

module.exports = router;