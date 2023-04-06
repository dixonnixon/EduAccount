process.env.NODE_ENV = 'test';


import {expect} from 'chai';
import request from 'supertest';
import basicSetup from './basicSetup.js';
import app from '../app.js';

import { faker } from '@faker-js/faker/locale/uk';


async function login() {
    const a = await request(app).post('/users/login').send({
        "username": "su", 
        "password":"su",
    });
    return a.body.token;
}




describe('POST: /addresses route to store addresses',  () => {
    console.log("NODE_ENV", process.env.NODE_ENV);
    basicSetup();   


    
    it('should allow a POST to /addresses',  async function () {
        let token = await login();
        const res =  await request(app).post('/addresses')  
            .send({
                "username": "nickname", 
                "password":"secret12345",
                "email":"reader@gmail.com",
                "admin": true
            });

        console.log("signup.", token, res.body, res.status);
        expect(res.status).to.equal(400);
        expect(res.body.errors[0].msg).to.equal('E-mail already in use');
        expect(res.body).not.to.be.empty;
        expect(res.body).to.be.an('object');;
    });
});
