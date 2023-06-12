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
  //get all workspaces by admin
  .get(cors.cors, authenticate.verifyUser, authenticate.verifyAdmin,  async (req, res, next) => {
    const wss = await Workplace.find({});
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    // res.end('Will send all the dishes to you!');

    res.json(wss);
  })
  .delete(cors.cors, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Workplace.deleteMany({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err));
  })
  .post(cors.cors, authenticate.verifyUser, authenticate.verifyAdmin, async (req, res, next) => {
    const { body } = req;
    body.user = req.user._id;
    // console.log("addr wrk", req.user._id);

    //if wp already exists
    const exists = await Workplace.findOne(body)
    // console.log(exists);
    if(exists) {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      // let err = new Error("FAvorites not Exists!");
      // err.status = 403;
       
      // return next(err);
      return res.json({"exists": true, "status": "workplace already exists!"}); 
    }

    let wp = new Workplace(body);
    wp.save()
      .then((wp) => {
          console.log("Workplace created", wp, wp.wpnumber);

          
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(wp);
      }, (err) => next(err));
  });


router.route('/:workplaceId')
  .options(cors.configureWithOptions, (req, res) => { res.sendStatus(200); })
  .patch(cors.configureWithOptions,  authenticate.verifyUser, authenticate.verifyAdmin, async (req, res) => { 
    
    Workplace.findByIdAndUpdate(req.params.workplaceId, {
      // $set: req.body
      $addToSet: req.body
    }, {new: true})
    .populate({ path: 'items'})
    // .populate({ path: 'items', populate: { path: 'values.Value', model: 'Value'} })
    .exec(function(err, wp) {
      // console.log("populate", err, item, item.populated('values'));
        if (err) {
            // ...
            res.json(err);
        } else {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(wp);
        }
    })
    
  })
  .get(cors.cors, async (req,res,next) => {
    const Wp = await Workplace.findById(req.params.workplaceId).populate('items');
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(Wp);
  })

router.route('/wpnumber/:wpnumber')
  .options(cors.configureWithOptions, (req, res) => { res.sendStatus(200); })
  .get(cors.cors, async (req,res,next) => {
    let struct = req.params.wpnumber.split("_");
    let wpNum = {
        wpNo: struct[2],
        floor: struct[1],
        cabinet: struct[0]
    };
    const Wp = await Workplace.findOne(wpNum);
    if(!Wp) {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      // let err = new Error("FAvorites not Exists!");
      // err.status = 403;
       
      // return next(err);
       return res.json({"exists": false, "status": "workplace absent!"}); 

    }
    // console.log("wpnumber", Wp, wpNum, req.params);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({"exists": true, "status": "workplace exists!", wp: Wp});
  })
export default router;
