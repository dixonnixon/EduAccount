process.env.NODE_ENV = 'test';


import {expect} from 'chai';
import request from 'supertest';
import basicSetup from './basicSetup.js';
import app from '../app.js';

import { faker } from '@faker-js/faker/locale/uk';


let firstUserIdTest = ''; // will later hold a value returned by our API
const firstUserBody = {
    email: faker.internet.email(),
    password: 'Sup3rSecret!23',
    username: faker.internet.userName()
};


describe('POST: /save route to insert data', () => {
    console.log("NODE_ENV", process.env.NODE_ENV);
    basicSetup();   

    

    it('should allow a POST to /users', async function () {
        const a0 = await request(app).post('/users/signup').send({
            "username": "nickname", 
            "password":"secret12345",
            "email":"reader@gmail.com",
            "admin": true
        });
        console.log("signup.", a0.body);

       


        const a = await request(app).post('/users/login').send({
            "username": "nickname", 
            "password":"secret12345",
        });
        console.log("Login.", a.body);

        let accessToken = a.body.token;



        const res = await request(app).post('/users')
            .set({ Authorization: `Bearer ${accessToken}` })    
            .send(firstUserBody);


        console.log(res.body);

        expect(res.status).to.equal(201);
        expect(res.body).not.to.be.empty;
        expect(res.body).to.be.an('object');
        expect(res.body.id).to.be.a('string');
        firstUserIdTest = res.body.id;
    
});

});