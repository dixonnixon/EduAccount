process.env.NODE_ENV = 'test';


import {expect} from 'chai';
import request from 'supertest';
import basicSetup from './basicSetup.js';
import app from '../app.js';

import { faker } from '@faker-js/faker/locale/uk';


let firstUserIdTest = ''; // will later hold a value returned by our API
let accessToken;
const firstUserBody = {
    email: faker.internet.email(),
    password: 'Sup3rSecret!23',
    username: faker.internet.userName(),
    admin: true
};


describe('POST: /save route to insert data', () => {
    console.log("NODE_ENV", process.env.NODE_ENV);
    basicSetup();   

    

    it('should allow a POST to /users', async function () {
        // const a0 = await request(app).post('/users/signup').send({
        //     "username": "nickname", 
        //     "password":"secret12345",
        //     "email":"reader@gmail.com",
        //     "admin": true
        // });
        const a0 = await request(app).post('/users/signup').send(firstUserBody);


        const a = await request(app).post('/users/login').send({
            "username": "su", 
            "password":"su",
        });

        accessToken = a.body.token;
    });


    it('should not post the same email with already registered user', async () => {
        const res = await request(app).post('/users')
        .set({ Authorization: `Bearer ${accessToken}` })    
        .send(firstUserBody);



        expect(res.status).to.equal(400);
        expect(res.body.errors[0].msg).to.equal('E-mail already in use');
        expect(res.body).not.to.be.empty;
        expect(res.body).to.be.an('object');;

        firstUserIdTest = res.body.id;
    });

});