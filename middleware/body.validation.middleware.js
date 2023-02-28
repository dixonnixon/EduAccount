import express from 'express';
import { validationResult } from 'express-validator';
import debug from 'debug';

const log = debug('app:body-validation-middleware');

class BodyValidationeMiddleware {
    verifyBodyFieldsErrors(req, res, next ) {
        try {
            // log(req.params);
            const errors = validationResult(req);
            // errors.throw();
            if(!errors.isEmpty()) {
                
                return res.status(400)
                    .send({errors: errors.array() });
            }
            next();
        } catch ( err) {
            console.log(err.mapped()); // Oh noes!
          }
    }
}

export default new BodyValidationeMiddleware();