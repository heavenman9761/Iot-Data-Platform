const express = require('express');
const DomainInfo = require('../models/domaininfo')
const { isLoggedIn } = require('./middlewares');
const gValue = require('../globalv');

const router = express.Router();

router.get('/', isLoggedIn, async (req, res, next) => {
  try {
        const domainInfo = await DomainInfo.findAll({});
        res.json(domainInfo);
  } catch (err) {
        console.error(err);
        next(err);
  }
});

router.post('/setdomain', isLoggedIn, async (req, res, next) => {
    console.log(req.body.saupjaid)
    const { id, saupjaid, saupjaname, addr, tel, fax } = req.body;
    try {
        const exData = await DomainInfo.findOne({
            where: {id:id}
        });
        if (exData) {
            try {
                const domainInfo = await DomainInfo.update({
                    saupjaid: saupjaid,
                    saupjaname: saupjaname,
                    addr: addr,
                    tel: tel,
                    fax:fax
                }, {
                    where: {id:id}
                });
                console.log(domainInfo);
                gValue.setDomainInfo();
                res.status(201).json(domainInfo);
            } catch(err) {
                console.error(err);
                next(err);
            }
        } else {
            try {
                const domainInfo = await DomainInfo.create({
                    saupjaid: saupjaid,
                    saupjaname: saupjaname,
                    addr: addr,
                    tel: tel,
                    fax:fax
                });
                console.log(domainInfo);
                gValue.setDomainInfo();
                res.status(201).json(domainInfo);
          
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