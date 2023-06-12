import express from 'express';
import bodyParser from 'body-parser';
import Category from '../models/category.js';
import authenticate from "../authenticate.js";
import cors from './cors.js';
import debug from 'debug';



const log = debug('app:cats-routes-config');


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
    let cat = new Category(body);
    cat.save()
    .then((category) => {
        // console.log("cat created", category);
        log("cat created", category);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(category);
    }, (err) => next(err));
  })
  .get(cors.cors, authenticate.verifyUser, async (req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json( await Category.find({}) );
  })
  .delete(cors.cors, authenticate.verifyUser, async (req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(await Category.deleteMany());
  });


router.route('/:catId')
.options(cors.configureWithOptions, (req, res) => { res.sendStatus(200); })
.post(cors.cors, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({text: "can I add value"});
})
.get(cors.cors, authenticate.verifyUser, (req, res, next) => {})


router.route('/name/:categoryName')
.options(cors.configureWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, async (req,res,next) => {
  console.log(req.params.categoryName)
  const prop = await Category.findOne({name: req.params.categoryName.toLowerCase() });
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json(prop);
});
export default router;
