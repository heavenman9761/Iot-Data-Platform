const express = require('express');
const DomainInfo = require('../models/domaininfo')
const { isLoggedIn } = require('./middlewares');
const gValue = require('../globalv');

const router = express.Router();

router.get('/', isLoggedIn, async (req, res, next) => {
  try {
    const domainInfo = await DomainInfo.findAll({});
    res.status(200).json(domainInfo);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.post('/setdomain', isLoggedIn, async (req, res, next) => {
  const { id, saupjaid, saupjaname, postcode, addr, extraAddr, tel, fax } = req.body;
  try {
    if (id != '') {
      const exData = await DomainInfo.findOne({
        where: { id: id }
      });
      if (exData) {
        const domainInfo = updateDomain(id, saupjaid, saupjaname, postcode, addr, extraAddr, tel, fax)
        if (domainInfo) {
          console.log(domainInfo);
          gValue.setDomainInfo();
          res.status(200).json(domainInfo);
        } else {
          console.error(err);
          next(err);
        }
      } else {
        const domainInfo = insertDomain(saupjaid, saupjaname, postcode, addr, extraAddr, tel, fax)
        if (domainInfo) {
          console.log(domainInfo);
          gValue.setDomainInfo();
          res.status(200).json(domainInfo);
        } else {
          console.error(err);
          next(err);
        }
      }
    } else {
      const domainInfo = insertDomain(saupjaid, saupjaname, postcode, addr, extraAddr, tel, fax)
      if (domainInfo) {
        console.log(domainInfo);
        gValue.setDomainInfo();
        res.status(200).json(domainInfo);
      } else {
        console.error(err);
        next(err);
      }
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
});

async function updateDomain(id, saupjaid, saupjaname, postcode, addr, extraAddr, tel, fax) {
  try {
    const domainInfo = await DomainInfo.update({
      saupjaid: saupjaid,
      saupjaname: saupjaname,
      postcode: postcode,
      addr: addr,
      extraAddr: extraAddr,
      tel: tel,
      fax: fax
    }, {
      where: { id: id }
    });
    return domainInfo;
    
  } catch (err) {
    return null;
  }
}

async function insertDomain(saupjaid, saupjaname, postcode, addr, extraAddr, tel, fax) {
  try {
    const domainInfo = await DomainInfo.create({
      saupjaid: saupjaid,
      saupjaname: saupjaname,
      postcode: postcode,
      addr: addr,
      extraAddr: extraAddr,
      tel: tel,
      fax: fax
    });
    return domainInfo;

  } catch (err) {
    return null;
  }
}

module.exports = router;