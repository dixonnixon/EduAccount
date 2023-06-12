import express from 'express';
import bodyParser from 'body-parser';
import Educator from '../models/educator.js';
import passport from "passport";
import authenticate from "../authenticate.js";
import UsersMiddleware from '../middleware/users.middleware.js';
import UsersService from '../services/users.service.js';
import BodyValidationMiddleware from '../middleware/body.validation.middleware.js';
import { registerEducatorsSchema } from '../helpers/validators/educator.js';
import cors from './cors.js';
import debug from 'debug';

import { body, param, validationResult } from "express-validator";

const log = debug('app:users-routes-config');


var router = express.Router();
router.use(bodyParser.json());

log(cors)


router.options('*', cors.configureWithOptions, (req, res) => { res.sendStatus(200); })

router.route('/:educatorId')
.options(cors.configureWithOptions, (req, res) => { res.sendStatus(200); })
.put(cors.configureWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    // res.write('Updating the dish: ' + req.params.dishId + '\n');
    // res.end('Will update the dish: ' + req.body.name + 
    // ' with details: ' + req.body.description);
    
    Educator.findOneAndUpdate({ _id: req.params.educatorId},
         { user: req.body.user}, {new: true})

    .then((updated) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(updated);
    });
})


/* GET users listing. */
// router.get('/', cors.cors, authenticate.verifyAdmin, function(req, res, next) {
router.route('/')
.options(cors.configureWithOptions, (req, res) => { res.sendStatus(200); })
  .delete(cors.cors, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Educator.deleteMany({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err));
  })
  .post(cors.cors, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    const { body } = req;
    //now if you logged in you Create Educ yourself.
    //but We should create Educ(Staff) By Admin and assign user to It
    // body.user = req.user._id;
    //It should be done later with update

    // console.log("addr usr", req.user._id);
    //---------------------------------vaidate
    try {
        const errorVal = registerEducatorsSchema.validateSync(body,
            { abortEarly: false, stripUnknown: true }
        );
    } catch (e) {
        const error = e ;
        console.log(e);
        return res.status(422).json({ errors: error.errors });
    }
     //---------------------------------vaidate
      let educ = new Educator(body);
      educ.collection.insertOne(educ)
      .then((educ) => {
        //   console.log("educ created", educ);
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(educ);
      }, (err) => next(err));
  })
;


export default router;
