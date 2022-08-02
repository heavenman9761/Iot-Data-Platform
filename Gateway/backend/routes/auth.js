const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const User = require('../models/user');
const mingsUtil = require('../util');

const router = express.Router();

router.post('/join', isNotLoggedIn, async (req, res, next) => {  //회원가입
  const { email, name, password } = req.body;
  const createAt = mingsUtil.getCurrentTime();

  try {
    // const exUser = await Users.findOne({ email: email });
    const exUser = await User.findOne({ where: { email } });
    if (exUser) {
      return res.status(201).json('이미 가입된 이메일입니다.');
    }

    const hash = await bcrypt.hash(password, 12);
    const user = await User.create({
      email: email,
      name: name,
      password: hash,
    });
    res.status(200).json(user);

  } catch (err) {
    console.error(err);
    return next(err);
  }
});

router.post('/login', isNotLoggedIn, (req, res, next) => {
  passport.authenticate('local', (authError, user, info) => {
    if (authError) {
      console.error(authError);
      return next(authError);
    }

    if (!user) {
      return res.status(201).json(info.message);
    }

    return req.login(user, async (loginError) => {
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }

      try {
        const u = await User.findOne({
          where: { email: user.email }
        });
        return res.status(200).json(u);
      } catch (err) {
        console.error(err);
        next(err);
      }
    });
  })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙입니다.
});

router.get('/logout', (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    } else {
      req.session.destroy(() => {
        res.cookie('connect.sid', '', { maxAge: 0 });
        res.redirect('/');
      });
      // res.send(200).json('logout success');
    }
  });
});

// router.get('/kakao', passport.authenticate('kakao'));

// router.get('/kakao/callback', passport.authenticate('kakao', {
//   failureRedirect: '/',
// }), (req, res) => {
//   res.redirect('/');
// });

module.exports = router;