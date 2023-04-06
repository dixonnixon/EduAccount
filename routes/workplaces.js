import express from 'express';
import bodyParser from 'body-parser';
import Workplace from '../models/workplace.js';
import passport from "passport";
import authenticate from "../authenticate.js";
import UsersMiddleware from '../middleware/users.middleware.js';
import UsersService from '../services/users.service.js';
import BodyValidationMiddleware from '../middleware/body.validation.middleware.js';

import cors from './cors.js';
import debug from 'debug';

import { body, param, validationResult } from "express-validator";

const log = debug('app:users-routes-config');


var router = express.Router();
router.use(bodyParser.json());

log(cors);

router.route('/')
  .options(cors.configureWithOptions, (req, res) => { res.sendStatus(200); })
  .delete(cors.cors, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Workplace.deleteMany({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err));
  })
  .post(cors.cors, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    const { body } = req;
    body.user = req.user._id;
    console.log("addr wrk", req.user._id);
    //---------------------------------vaidate :TODO later
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
      let wp = new Workplace(body);
      wp.save()
      .then((wp) => {
          console.log("Workplace created", wp);
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(wp);
      }, (err) => next(err));
  })
export default router;
