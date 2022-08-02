const mongoose = require('mongoose');

const connect = () => {
    if (process.env.NODE_ENV !== 'production') {
        mongoose.set('debug', true);
    }
    // mongoose.connect('mongodb://localhost:27017/nodejs', {
    //     dbName: 'nodejs',
    //     useNewUrlParser: true,
    //     useCreateIndex: true,
    // }, (error) => {
    //     if (error) {
    //         console.log('몽고디비 연결 에러1', error);
    //     } else {
    //         console.log('몽고디비 연결 성공');
    //     }
    // });
    // mongoose.connect('mongodb://root:Rudwns9760!@localhost:27017/nodejs');
    mongoose.connect('mongodb://localhost:27017/dataplatform_gateway');
};
mongoose.connection.on('error', (error) => {
    console.error('몽고디비 연결 에러2', error);
});

mongoose.connection.once('open', function() {
    console.log('몽고디비 연결 성공!');
});

mongoose.connection.on('disconnected', () => {
    console.error('몽고디비 연결이 끊겼습니다. 연결을 재시도 합니다.', error);
    connect();
});

module.exports = connect;
