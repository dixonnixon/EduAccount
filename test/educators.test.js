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



describe('/educators route should able POST by admin',  () => {
    console.log("NODE_ENV", process.env.NODE_ENV);
    basicSetup();  

    it('should allow an Educator to be inserted',  async function () {
        let token = await login();
        const res =  await request(app).post('/educators')  
            .set({ Authorization: `Bearer ${token}` })   
            .send({
                firstName: "Nevidomiy",  
                lastName: "Korisuvach",
                surName:  "Sistemy",
                user: "",
                age: 34,
            });

        console.log("signup.",  res.body, res.status);
        expect(res.status).to.equal(200);
        expect(res.body).not.to.be.empty;
        expect(res.body).to.be.an('object');
        //Validate objectIdHere
    });
    it('should allow Educator to update own fields'); //:TODO
    it('should allow Educator to add workplace'); //:TODO


    it('all educators should be deleted', async function() {
        let token = await login();

        const res =  await request(app).delete('/educators')  
            .set({ Authorization: `Bearer ${token}` }).send();

        console.log(res.body);
        
        expect(res.body.acknowledged).to.equal(true);
    });
});