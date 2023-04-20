import express from 'express';
import bodyParser from 'body-parser';
import User from '../models/user.js';
import Address from '../models/address.js';
import passport from "passport";
import authenticate from "../authenticate.js";
import UsersMiddleware from '../middleware/users.middleware.js';
import UsersService from '../services/users.service.js';
import BodyValidationMiddleware from '../middleware/body.validation.middleware.js';
import { registerAddressSchema } from '../helpers/validators/address.js';
import { ValidationError } from 'yup';


import cors from './cors.js';
import debug from 'debug';

import { body, param, validationResult } from "express-validator";

const log = debug('app:users-routes-config');

import { Collection, ObjectId } from "mongodb";//do it somwhere else and import here

var router = express.Router();
router.use(bodyParser.json());

router.route('/:addressId')
    .options(cors.configureWithOptions, (req, res) => { res.sendStatus(200); })

    .delete(cors.configureWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        // res.end('Deleting dish: ' + req.params.dishId);
        Address.findByIdAndRemove(req.params.addressId) 
        .then((address) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(address);
        }, (err) => next(err))
        .catch((err) => next(err));
    })
    .put(cors.configureWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {

        Address.findByIdAndUpdate(req.params.addressId, {
            $set: req.body
        }, {new: true})

        .then((address) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(address);
        });
    })
    .post(cors.configureWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation not supported on /addresses/'+ req.params.dishId);
        
    })
    .get(cors.cors, (req, res, next) => {
        // // res.end('Will send details of the dish: ' + req.params.dishId +' to you!');
        // Address.findById(req.params.dishId)
        // .populate('educator.owner') 
        // .then((dish) => {
        //     res.statusCode = 200;
        //     res.setHeader('Content-Type', 'application/json');
        //     res.json(dish);
        // }, (err) => next(err))
        // .catch((err) => next(err));                     
    });



router.route('/')
    .options(cors.configureWithOptions, (req, res) => { res.sendStatus(200); })

    .get(cors.cors, (req,res,next) => {
     
        Address.find(req.query)
            // .populate('comments.author')
        .then((address) => {
                console.log(address);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                // res.end('Will send all the dishes to you!');

                res.json(address);
        }, (err) => next(err))
        .catch((err) => next(err));
    })
    
    .post(cors.configureWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        const { body } = req;

        console.log(req.user, req.body, req.body.street);
        const addrId = new ObjectId();

         //---------------------------------vaidate
        try {
            const errorVal = registerAddressSchema.validateSync(body, 
                {abortEarly: false, stripUnknown: true }
            );
        } catch (e) {
            const error = e ;
            return res.status(422).json({ errors: error.errors });
        }
         //---------------------------------vaidate
       
        const streets =  req.body.street.map((val, idx) => {
            return Object.assign(val, { address: addrId});
        });

        let address = new Address({
            street: streets,
            city: req.body.city,
            postIndex: req.body.postIndex,
            _id: addrId
        });
        console.log("aaaaa", addrId, streets, address);
    
        address.save()
        .then((address) => {
            console.log("Address created", address);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(address);
        }, (err) => next(err));
    })
    .put(cors.configureWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /addresses');
    })
    .delete(cors.configureWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    // .delete(authenticate.verifyUser,  (req, res, next) => {
        // res.end('Deleting all dishes');
        Address.deleteMany({})
        .then((resp) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(resp);
        }, (err) => next(err));
    });
export default router;

