// const express = require("express");
// const bodyParser = require('body-parser');
// const authenticate = require('../authenticate');
// const multer = require('multer');
// const cors = require('./cors');
import express from 'express';
import bodyParser from 'body-parser';
import authenticate from "../authenticate.js";
import multer from 'multer';
import cors from './cors.js';


const storage = multer.diskStorage({
    destination: (req, res, cb) => {
        cb(null, 'public/images');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
});
//change
const imageFileFilter = (req, file, cb) => {
    // if(!file.originalname.match(/\.(jpg|jpeg|png|gif|csv)$/)) {
    if(!file.originalname.match(/\.(csv)$/)) {
        return cb(new Error("wrong file type: " + file.originalname), false);
    }
    cb(null, true);
};

const upload = multer({ storage: storage, fileFilter: imageFileFilter});

const router = express.Router();
router.use(bodyParser.json());

router.route('/')
    .options(cors.configureWithOptions, (req, res) => { res.sendStatus(200); })

    .get(cors.cors, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end('GET operation not supported on /imageUpload');
    })
    .post(cors.configureWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, upload.single('imageFile'),
        (req, res) => {
            // console.log(res.file);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(req.file);
        }
    )
    .put(cors.configureWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /imageUpload')
    })
    .delete(cors.configureWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end('DELETE operation not supported on /imageUpload');
    })
;

export default router;