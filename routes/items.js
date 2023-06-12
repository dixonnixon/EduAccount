import express from 'express';
import bodyParser from 'body-parser';
import Item from '../models/item.js';
import Property from '../models/property.js';
import authenticate from "../authenticate.js";
import cors from './cors.js';
import debug from 'debug';

import { ObjectId } from "mongodb";

const log = debug('app:users-routes-config');


var router = express.Router();
router.use(bodyParser.json());
let properties = null;
log(cors)

async function replacePropertyWithObjectId(body) {
  /**chnages the name into ID */
  const newItemId = new ObjectId();
  if(!properties) {
    properties = await Property.find({});
  }
  
  body._id = newItemId;

  if(body.values) {
    body.values = body.values.map((v, i)=> {
    
      let newV = null;
      
      if(!v.item) {
        // newV = Object.assign({ item: newItemId}, v);
        newV = { ... v, item: newItemId };
      }
      let lookup = properties.filter((v) => {return v.name.toLowerCase() === newV.property.toLowerCase()});
      if(lookup.length > 0) {
        // console.log("VVV", lookup[0]._id, v, newV);
        newV.property = lookup[0]._id
      }
      return newV;
    })
  }
  // console.log("Body repl", body, properties);
  return body;
};

router.options('*', cors.configureWithOptions, (req, res) => { res.sendStatus(200); })

/* GET users listing. */
// router.get('/', cors.cors, authenticate.verifyAdmin, function(req, res, next) {
router.route('/')
.options(cors.configureWithOptions, (req, res) => { res.sendStatus(200); })
  .post(cors.cors, authenticate.verifyUser, authenticate.verifyAdmin, async (req, res, next) => {
    const { body } = req;
    body.user = req.user._id;

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
    if(Array.isArray(body)) { //: TODO multiple insertions (multiple Items) )))))))))))!!!!!!!!
      // const inserted = await Item.insertMany(body, (err) => (err) ? res.json({err: true, reason: err}) : "") // it is idempotent 
      let newBody = await Promise.all(body.map(async (item, i, items) => {
        return await replacePropertyWithObjectId(item);
      }));

      console.log("REEEEEEEplaced", newBody, newBody[0].values);
      
      try {
        console.log(body[0].values);
        const inserted = await Item.insertMany(newBody) // it is idempotent 

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({inserted: true, documents: inserted});
        // res.json({error: true, message: "not Implemented"});
        return;
      }
      catch (err) {
        return next({err, message: "bad items"});
      }
    }
    
    // let item = new Item(body);
    let item = new Item(await replacePropertyWithObjectId(body));
    const saved = await item.save((err) => { if (err) next(err)})
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(item);
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
