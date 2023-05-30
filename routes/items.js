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

log(cors)


router.options('*', cors.configureWithOptions, (req, res) => { res.sendStatus(200); })

/* GET users listing. */
// router.get('/', cors.cors, authenticate.verifyAdmin, function(req, res, next) {
router.route('/')
.options(cors.configureWithOptions, (req, res) => { res.sendStatus(200); })
  .post(cors.cors, authenticate.verifyUser, authenticate.verifyAdmin, async (req, res, next) => {
    const { body } = req;
    body.user = req.user._id;
    console.log("addr usr", req.user._id, body);

    const newItemId = new ObjectId();
    //replce property name with _id Prop
    //add item 

    const props = await Property.find({});
    console.log("ccc", props);
    

    body._id = newItemId;
    body.values = body.values.map((v, i)=> {
      
      let newV = null;
      
      if(!v.item) {
        // newV = Object.assign({ item: newItemId}, v);
        newV = { ... v, item: newItemId };
      }
      let lookup = props.filter((v) => {return v.name.toLowerCase() === newV.property.toLowerCase()});
      if(lookup.length > 0) {
        console.log("VVV", lookup[0]._id, v, newV);
        newV.property = lookup[0]._id
      }
      return newV;
    })

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
      if(Array.isArray(body)) { //: TODO multiple insertions)))))))))))!!!!!!!!
        // const inserted = await Item.insertMany(body) // it is idempotent 
        //   .catch(function(error) {
        //     console.log(error) // Failure
        //   });
        
        // res.statusCode = 200;
        // res.setHeader('Content-Type', 'application/json');
        // res.json({inserted: true, documents: inserted});
        // return;
      }



      let item = new Item(body);

      // item.values.cursor().
      // eachAsync(async function (doc, i) {
      //   doc.foo = doc.bar + i;
      //   await doc.save();
      // })

      console.log("created new", item);
      const saved = await item.save((err) => { if (err) next(err)})
      console.log("saved", saved);
      // .then((item) => {
      //     console.log("item created1", item);
          
      // //     item.values = item.values.map((v, i)=> {
      // //       if(!v.item) {
      // //         return Object.assign({ item: item._id}, v);
      // //       }
      // //     });
      // //     item.save();
   

      // //     console.log("updValues ", item.updValues);
      // //     console.log("item created", item);
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(item);
      // }, (err) => next(err));


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
