import passport from "passport";
// import LocalStrategy = require("passport-local").Strategy;
import LocalStrategy from "passport-local";
import User from "./models/user.js";
// import JwtStrategy from "passport-jwt".Strategy;
// import ExtractJwt from "passport-jwt".ExtractJwt;
import PassportJwt from "passport-jwt";
import jwt from "jsonwebtoken";

const ExtractJwt = PassportJwt.ExtractJwt;
const JwtStrategy = PassportJwt.Strategy;
// var FacebookTokenStrategy = require('passport-facebook-token');

import config from "./config.js";

const local = passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


const getToken = function(user) {
    return jwt.sign(user, config.secretKey,
        { expiresIn: 3600});
};

let opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

const jwtPassport = passport.use(new JwtStrategy(opts,
    (jwt_payload, done) => {
        // console.log("JWT payload: ", jwt_payload);
        User.findOne({_id: jwt_payload._id}, (err, user) => {
            if(err) {
                return done(err, false);
            }
            else if(user) {
                return done(null, user);
            }
            else {
                return done(null, false);
            }
        });
    }    
));


const verifyUser = passport.authenticate('jwt', {session: false});
// exports.verifyAdmin = passport.authenticate('local', {session: false}, function(req, res, err) {
//     // res.redirect('/');
//     // console.log("Request: ", req, res, err);
//     if(err) {
//         err = new Error(err.message);
//         err.status = 404;
//         return false;
//     } 
// });

const verifyAdmin = function(req, res, next) {
    // console.log(req.user);
    if(req.user) {
        if(req.user.admin === true) {
            return next();
        }
    
        const err = new Error("You are not authorized to perform this operation!");
        err.status = 403;
        return next(err);
    }
    const err = new Error("You are not authorized!");
    err.status = 403;
    return next(err);
};

// const facebookPassport = passport.use(new FacebookTokenStrategy({
//     clientID: config.facebook.clientId,
//     clientSecret: config.facebook.clientSecret
// }, (accessToken, refreshToken, profile, done) => {
//     User.findOne({facebookId: profile.id}, (err, user) => {
//         if (err) {
//             return done(err, false);
//         }
//         if (!err && user !== null) {
//             return done(null, user);
//         }
//         else {
//             user = new User({ username: profile.displayName });
//             user.facebookId = profile.id;
//             user.firstname = profile.name.givenName;
//             user.lastname = profile.name.familyName;
//             user.save((err, user) => {
//                 if (err)
//                     return done(err, false);
//                 else
//                     return done(null, user);
//             })
//         }
//     });
// }));


export default {
    verifyAdmin: verifyAdmin,
    local: local,
    getToken: getToken,
    jwtPassport: jwtPassport,
    verifyUser: verifyUser,
    // facebookPassport: facebookPassport
};