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
  .post(cors.cors, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
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
      // let prop = new Property(body);


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
router.route('/:itemId')
.options(cors.configureWithOptions, (req, res) => { res.sendStatus(200); })
.patch(cors.cors, authenticate.verifyUser, authenticate.verifyAdmin,  (req, res, next) => {
  Item.findByIdAndUpdate(req.params.itemId, {
      $set: req.body
  }, {new: true})
  .populate({ path: 'values', select: 'name' })
  .exec(function(err, item) {
    // console.log("populate", err, item, item.populated('values'));
      if (err) {
          // ...
          res.json(err);
      } else {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(item);
      }
      
    })


 
})
.delete(cors.cors, authenticate.verifyUser, authenticate.verifyAdmin,  async (req, res, next) => {
  // let result = ;
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json(await Item.deleteOne({ _id: req.params.itemId} ) );
})


export default router;
