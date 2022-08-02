const express = require('express');
const Users = require('../schemas/xusers')
const mingsUtil = require('../util');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const users = await Users.find({});
    console.log(users);
    res.json(users);
  } catch (err) {
    console.error(err);
    next(err);
  }
//   res.send(movies);
});

router.post('/addUser', async (req, res, next) => {
    try {
        const item = {
          email: req.body.email,
          name: req.body.name,
          password: req.body.password,
          saupja: req.body.saupja,
          saupjaname: req.body.saupjaname,
          tel: req.body.tel,
          createAt: mingsUtil.getCurrentTime()
        };
        console.log(item);
        const user = await Users.create({
            email: item.email,
            name: item.name,
            password: item.password,
            saupja: item.saupja,
            saupjaname: item.saupjaname,
            tel: item.tel,
            createAt: item.createAt,
        });
        console.log(user);
        res.status(201).json(user);

    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.put('/editUser', async (req, res, next) => {
  try {
      const item = {
          _id: req.body._id,
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
          saupja: req.body.saupja,
          saupjaname: req.body.saupjaname,
          tel: req.body.tel,
        };
      const user = await Users.updateOne({
        _id:item._id
      }, {
        name:item.name, email:item.email, password:item.password, saupja:item.saupja, saupjaname:item.saupjaname, tel:item.tel
      });
      res.status(201).json(user);

  } catch (err) {
      console.error(err);
      next(err);
  }
});

router.delete('/remove/:userID', async (req, res, next) => {
  const id = req.params.userID;
  try {
    const user = await User.deleteOne({_id: id});
    res.status(201).json(user);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;