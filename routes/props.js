import express from 'express';
import bodyParser from 'body-parser';
import Property from '../models/property.js';
import authenticate from "../authenticate.js";
import cors from './cors.js';
import debug from 'debug';



const log = debug('app:users-routes-config');


var router = express.Router();
router.use(bodyParser.json());

log(cors)


router.options('*', cors.configureWithOptions, (req, res) => { res.sendStatus(200); })

/* GET users listing. */
// router.get('/', cors.cors, authenticate.verifyAdmin, function(req, res, next) {
router.route('/')
.options(cors.configureWithOptions, (req, res) => { res.sendStatus(200); })
  .post(cors.cors, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    const { body } = req;

 
      let prop = new Property(body);

      prop.save()
      .then((prop) => {
          console.log("prop created", prop);
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(prop);
      }, (err) => next(err));
  })
  .delete(cors.cors, authenticate.verifyUser, async (req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(await Property.deleteMany());
  })
;


export default router;
