import express from 'express';
import bodyParser from 'body-parser';
import User from '../models/user.js';
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
    authenticate.verifyUser,
    authenticate.verifyAdmin, function(req, res, next) {
  // res.send('respond with a resource');
  // if(!req.session.user) {
  // if(!req.user) {
  //   let err = new Error("you are not logged in!");
  //   err.status = 403;
  //   next(err);
  //   return;
  // }
  User.find({}).then((users) => {
    // // console.log(users);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    // res.end('Will send all the dishes to you!');

    res.json(users);
  })
  .catch((err) => next(err));
})
  .get('/email/:email', authenticate.verifyUser, authenticate.verifyAdmin, 
    async (req, res, next) => {
      // let acceptByEmail = req.query.getByEmail;
      // console.log("acceptByEmail", acceptByEmail)
      // if(acceptByEmail) {
        let user = await User.findOne({email: req.params.email});
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(user);
      // }

    })


  .post("/", cors.cors, authenticate.verifyUser, authenticate.verifyAdmin,
    body('email').custom(UsersMiddleware.isValidUser),
    body('email').isEmail(),
    body('password')
        .isLength({ min: 8 })
        .withMessage('Must include password (5+ characters)')
        .trim(),
    BodyValidationMiddleware.verifyBodyFieldsErrors,
    UsersService.createUser
  )
  .delete("/:userId", cors.configureWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, 
    async (req, res, next) => {
  
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(await UsersService.delete(req.params.userId));

  })
;

router
  .post('/signup',  cors.configureWithOptions, (req, res, next) => {
    // // console.log("signing UP...");
    User.register(new User({email: req.body.email, username: req.body.username}), req.body.password, 
      (err, user) => {
        console.log("register", user, req.user, req.params, req.headers, req.body, (user != null))
        if(err) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.json({err: err});
          
        }
        else {
          if(req.body.email) {
            user.email = req.body.email;
          }

          if(req.body.username) {
            user.username = req.body.username;
          } else {  user.username = "noName"} 

       
          user.save((err, user) => {
            // console.log("after user saved", user);
            if(err) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.json({err: err})
              return;
            }
            passport.authenticate('local')(req, res, () => {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json({success: true, status: 'Registration Successful!' });
            });
          });
          // passport.authenticate('local')(req, res, () => {
          //   res.statusCode = 200;
          //   res.setHeader('Content-Type', 'application/json');
          //   res.json({success: true, status: 'Registration Successful!' });
          // });
        }
      }
    );
    // User.findOne({ username: req.body.username })
    
  });

router

// .post("/login", cors.configureWithOptions, passport.authenticate('local'), (req, res, next) => {
.post("/login", cors.configureWithOptions,  (req, res, next) => {
  // console.log("login  req", req);
  // console.log("login  req", req, res.headersSent);
  passport.authenticate('local', (err, user, info) => {
  //  console.log("method: authenticate",  user, !user);
   
    if(err) {
      return next(err);
    }

    if(!user) { //case when user or pass is incorrect
      // console.log('err !user', req.body);

      res.statusCode = 401;
      res.setHeader('Content-Type', 'application/json');
      res.json({success: false,  status: 'You are failed to 10g in!', err: info });
      return res;
    }

    req.logIn(user, (err) => {
      if(err)  {
        // console.log("login  req1", req.headers, req.body, res.headersSent, err);

        res.statusCode = 401;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: false,  status: 'You are failed to 10g in!', err: "Could not login User!",
          reson: err
        });
        
      }
      // console.log(req.user);

      let token = authenticate.getToken({ _id: user._id });
      // console.log("Login:Post user", user);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json({success: true, token: token, status: 'You are successfully 10gged in!'});

    });
  }) (req, res, next);

  
  
});

router
.get('/logout', authenticate.verifyUser, cors.configureWithOptions, (req, res, next) => {
  console.log("Logging out...");
  

  if(req.session) {
    req.session.destroy();
    res.cookie('jwt', '', { maxAge: 1 })
    res.clearCookie('session-id');
    // console.log("Session destroyed. Cookies created. Redirecting to '/' ...");

    res.redirect('/');
  }
  else {
    let err = new Error("You are not logged in!");
    err.status = 403;
    next(err);
  }
});

// router.get('/facebook/token', passport.authenticate('facebook-token'), (req, res) => {
//   if (req.user) {
//     var token = authenticate.getToken({_id: req.user._id});
//     res.statusCode = 200;
//     res.setHeader('Content-Type', 'application/json');
//     res.json({success: true, token: token, status: 'You are successfully logged in!'});
//   }
// });

router.get('/checkJWTToken', cors.configureWithOptions, (req, res, next) => {
  passport.authenticate('jwt', {session: false}, (err, user, info) => {
    if(err) return next(err);
    if(!user) {
      res.statusCode = 401;
      res.setHeader('Content-Type', 'application/json');
      res.json({status: "JWT invalid!", success: false, err: info});
    }
    else {
      res.statusCode = 401;
      res.setHeader('Content-Type', 'application/json');
      res.json({status: "JWT valid!", success: true, user: user});
    }
  }) (req, res);
});
export default router;
