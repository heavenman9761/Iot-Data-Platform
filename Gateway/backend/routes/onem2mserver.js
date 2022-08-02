const express = require('express');
const Onem2mServer = require('../models/onem2mserver')
const { isLoggedIn } = require('./middlewares');

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
    const { id, address } = req.body;
    try {
        const exData = await Onem2mServer.findOne({
            where: {id:id}
        });
        if (exData) {
            try {
                const item = await Onem2mServer.update({
                    address: address,
                }, {
                    where: {id:id}
                });
                console.log(item);
                res.status(200).json(item);
            } catch(err) {
                console.error(err);
                next(err);
            }
        } else {
            try {
                const item = await Onem2mServer.create({
                  address: address,
                });
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