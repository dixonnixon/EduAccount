process.env.NODE_ENV = 'test';


import {expect} from 'chai';
import request from 'supertest';
import basicSetup from './basicSetup.js';
import app from '../app.js';

import { faker } from '@faker-js/faker/locale/uk';

var testUser;
async function login() {
    const a = await request(app).post('/users/login').send({
        "username": "su", 
        "password":"su",
    });
    return a.body.token;
}

//duplication in tests
async function getRandomUser() {
    let token = await login();
    if(!testUser) {
        const res =  await request(app).get('/users')  
            .set({ Authorization: `Bearer ${token}` }).send();

        // console.log("getRandomUser", res.body);
        testUser = res.body[Math.floor(Math.random() * res.body.length) + 1];
        // console.log("testUser", testUser);
        return testUser;
    } else return testUser;
}



describe('/educators route should able POST by admin',  () => {
    console.log("NODE_ENV", process.env.NODE_ENV);
    basicSetup();  

    var fixEduc;

    it('should allow an Educator to be inserted with no user',  async function () {
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

        console.log("signup.",  token, res.body, res.status);
        fixEduc = res.body;
        expect(res.status).to.equal(200);
        expect(res.body).not.to.be.empty;
        expect(res.body).to.be.an('object');
        //Validate objectIdHere
    });


    it('should allow Admin to assign Educator to user', async function() {
        let token = await login();
        let user =  await getRandomUser();
        console.log("fixEduc", fixEduc, user);
        let userPart = {
            user: user._id,
        };

        console.log("userPart", userPart);
        
        const res =  await request(app).put('/educators/' + fixEduc.insertedId)  
            .set({ Authorization: `Bearer ${token}` })   
            .send(userPart);

        console.log("assigned", res.body);
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