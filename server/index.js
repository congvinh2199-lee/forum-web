const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const app = express();
const authRouter = require('./router/auth');
const userRouter = require('./router/user');
const topicRouter = require('./router/topic');
const questionRouter = require('./router/question');
const postRouter = require('./router/post');
const infoRouter = require('./router/info');
const tagRouter = require('./router/tag');
const helperRouter = require('./router/helper');
const contactRouter = require('./router/contact');
const cors = require('cors')

app.use(cookieSession({
  name: 'session',
  keys: [process.env.COOKIE_KEY || 'DOAN'],
  maxAge: 4 * 7 * 24 * 60 * 60 * 1000
}));

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

app.use(cors())


require("dotenv").config();

app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/topic', topicRouter);
app.use('/api/question', questionRouter);
app.use('/api/post', postRouter);
app.use('/api/info', infoRouter);
app.use('/api/tag', tagRouter);
app.use('/api/helper', helperRouter);
app.use('/api/contact', contactRouter);

let PORT = process.env.PORT || 5005
app.listen(PORT, () => console.log(`App running on port: ${PORT}`))