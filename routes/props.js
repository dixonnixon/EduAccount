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
   //insert One Property
  .post(cors.cors, authenticate.verifyUser, authenticate.verifyAdmin, async (req, res, next) => {
      const { body } = req;

      console.log("Many?", body, typeof body, Array.isArray(body))
 
      if(Array.isArray(body)) {
        const inserted = await Property.insertMany(body) // it is idempotent 
          .catch(function(error) {
            console.log(error) // Failure
          });
        
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({inserted: true, documents: inserted});
        return;
      }

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

router.route('/name/:propertyName')
.options(cors.configureWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, async (req,res,next) => {
  console.log(req.params.propertyName)
  const prop = await Property.findOne({name: req.params.propertyName.toLowerCase() });
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json(prop);
});
export default router;
