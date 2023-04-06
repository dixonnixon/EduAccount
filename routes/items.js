import express from 'express';
import bodyParser from 'body-parser';
import Item from '../models/item.js';
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

  .post(cors.cors, authenticate.verifyUser,  (req, res, next) => {
    const { body } = req;
    body.user = req.user._id;
    console.log("addr usr", req.user._id);
    //---------------------------------vaidate : TODO later
    // try {
    //     const errorVal = registerEducatorsSchema.validateSync(body,
    //         { abortEarly: false, stripUnknown: true }
    //     );
    // } catch (e) {
    //     const error = e ;
    //     console.log(e);
    //     return res.status(422).json({ errors: error.errors });
    // }
     //---------------------------------vaidate
      let item = new Item(body);
      item.save()
      .then((item) => {
          console.log("item created", item);
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(item);
      }, (err) => next(err));
  })
;


export default router;
