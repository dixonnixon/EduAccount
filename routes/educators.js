import express from 'express';
import bodyParser from 'body-parser';
import Educator from '../models/educator.js';
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

log(cors)


router.options('*', cors.configureWithOptions, (req, res) => { res.sendStatus(200); })

/* GET users listing. */
// router.get('/', cors.cors, authenticate.verifyAdmin, function(req, res, next) {
router
  .get('/', 
    cors.cors, 
    authenticate.verifyUser, function(req, res, next) {
  Educator.find({}).then((educators) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');

    res.json(educators);
  })
  .catch((err) => next(err));
})
  .post("/", cors.cors, authenticate.verifyUser, authenticate.verifyAdmin,
    
  )
;


export default router;
