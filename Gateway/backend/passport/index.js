const passport = require('passport');
const local = require('./localStrategy');
const User = require('../models/user');
const { deserializeUser } = require('passport');

module.exports = () => {//로그인시 실행
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {//매 요청시 실행
        console.log(done);
        User.findOne({ where: { id } })
            .then(user => done(null, user))
            .catch(err => done(err));
        // const u = User.findOne({ _id: id });
        // if (u) {
        //     console.log('find user');
        //     user => done(null, user);
        // } else {
        //     err => done(err);
        // }
    });

    local();
}