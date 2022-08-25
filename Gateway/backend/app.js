const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongodbconnect = require('./schemas/xindex');
const passport = require('passport');
const session = require('express-session');
const dotenv = require('dotenv');
const { sequelize } = require('./models')

dotenv.config();

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const serverInfoRouter = require('./routes/serverinfos');
const devicesRouter = require('./routes/devices');
const authRouter = require('./routes/auth');
const deviceDataRouter = require('./routes/devicedatas');
const deviceTypeRouter = require('./routes/devicetypes');
const domainInfoRouter = require('./routes/domaininfos');
const onem2mServerRouter = require('./routes/onem2mserver')

const passportConfig = require('./passport');
const gValue = require('./globalv');
// const { connect } = require('http2');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(require('connect-history-api-fallback')());

passportConfig();
app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,
    maxAge: 1000 * 60 * 60,
    rolling: true //페이지 이동이나 리로드시 기간 연장, saveUninitialized: false로 셋팅해야 함.
  },
}));

app.use(passport.initialize());
app.use(passport.session());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

sequelize.sync({ force: false })
  .then(() => {
    gValue.setDomainInfo();
    gValue.setDeviceTypes();
    gValue.setDeviceInfos();
    gValue.setOneM2MInfo();
    console.log('데이타베이스 연결 성공');
  })
  .catch((err) => {
    console.error(err);
  });

setTimeout(() => {
  const deviceInfos = gValue.getDeviceInfos()
  if (deviceInfos) {
    deviceInfos.forEach((deviceInfo, index, item) => {
      if (deviceInfo.ae_name != "") {
        gValue.createAE(deviceInfo.ae_name);
      }
    })
  }
}, 2000);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/serverinfos', serverInfoRouter);
app.use('/api/devices', devicesRouter);
app.use('/api/devicedata', deviceDataRouter);
app.use('/api/devicetypes', deviceTypeRouter);
app.use('/api/domaininfo', domainInfoRouter);
app.use('/api/onem2mserver', onem2mServerRouter);
// mongodbconnect();

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
