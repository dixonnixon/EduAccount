import express from 'express';
import debug  from "debug";

const log = debug('app:index-routes-config');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  log("index");
  res.status(200).send( { title: 'Welcome to DON SODA' });
});

export default router;