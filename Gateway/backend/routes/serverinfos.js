const express = require('express');
const ServerInfo = require('../schemas/xserverinfo');

const router = express.Router();

router.route('/')
  .get(async (req, res, next) => {
    try {
      const serverInfo = await ServerInfo.find({});
      console.log(serverInfo);
      res.json(serverInfo);
    } catch (err) {
      console.error(err);
      next(err);
    }
  })
  .post(async (req, res, next) => {
    try {
      const serverInfo = await ServerInfo.create({
        ip: req.body.ip,
        port: req.body.port,
        createdAt: req.body.createdAt,
      });
      console.log(serverInfo);
      res.status(201).json(serverInfo);
    } catch (err) {
      console.error(err);
      next(err);
    }
  });

// router.get('/:id/comments', async (req, res, next) => {
//   try {
//     const comments = await Comment.find({ commenter: req.params.id })
//       .populate('commenter');
//     console.log(comments);
//     res.json(comments);
//   } catch (err) {
//     console.error(err);
//     next(err);
//   }
// });

module.exports = router;