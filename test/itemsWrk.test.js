process.env.NODE_ENV = 'test';


import {expect} from 'chai';
import request from 'supertest';
import basicSetup from './basicSetup.js';
import app from '../app.js';

import { faker } from '@faker-js/faker/locale/uk';
import { array } from 'yup';

let testEduc;
let testUser;

async function insertEduc() {
    let user = getRandomUser();
    let token = await loginAdmin();
    if(!testEduc) {
        const res =  await request(app).post('/educators')  
            .set({ Authorization: `Bearer ${token}` })   
            .send({
                firstName: "Nevidomiy",  
                lastName: "Korisuvach",
                surName:  "Sistemy",
                user: user._id,
                age: 34,
            });
            console.log("insertEduc", res.body);
        expect(res.status).to.equal(200);
        expect(res.body).not.to.be.empty;
        expect(res.body).to.be.an('object');
        testEduc = res.body;

       

        return testEduc;
    } else return testEduc;
}

async function getRandomUser() {
    let token = await loginAdmin();
    if(!testUser) {
        const res =  await request(app).get('/users')  
            .set({ Authorization: `Bearer ${token}` }).send();

        // console.log("getRandomUser", res.body);
        testUser = res.body[Math.floor(Math.random() * res.body.length) + 1];
        // console.log("testUser", testUser);
        return testUser;
    } else return testUser;
}

let cred;
async function loginAdmin() { //:TODO extract method
    if (!cred) {
        const a = await request(app).post('/users/login').send({
            "username": "su", 
            "password":"su",
        });
        cred = a.body.token;
        return cred;

    } else return cred;
}
async function loginEduc() { //:TODO extract method
    if (!cred) {
        const a = await request(app).post('/users/login').send({
            "username": "su", 
            "password":"su",
        });
        cred = a.body.token;
        return cred;

    } else return cred;
}



describe('work with items and workplaces',  () => {
    console.log("NODE_ENV", process.env.NODE_ENV);
    basicSetup();  
    const itemData = {  
        name: "",
        cap: "",
        workplace: "",
        values: "",
    }

    var fixEduc;
    var fixWp;

    it('should insert Workplace without Items for Educator', async () => {
        const testEduc = await insertEduc();
        let token = await loginAdmin();

        // fixEduc  = res.body;
        console.log("testEduc!!!!!!!!!", testEduc);

        //make some values
        //make some items

        const res =  await request(app).post('/workplaces')  
            .set({ Authorization: `Bearer ${token}` })   
            .send({
                wpNo: faker.random.numeric(10)
            });

        fixWp = res.body;

        console.log("Workplace", res.body);
        expect(res.status).to.equal(200);
        expect(res.body).not.to.be.empty;
        expect(res.body).to.be.an('object');
    });

    it('Educator should insert Item with KeyValues', async () => {
        console.log("KV", fixWp);
        let token = await loginAdmin();
    });

    

    //:TODO instead lookup after all method
    it('all things should be deleted', async function() {
        let token = await loginAdmin();

        let r  = await request(app).delete('/educators')  
            .set({ Authorization: `Bearer ${token}` }).send();

        // console.log(r.body)
        r = await request(app).delete('/workplaces')  
            .set({ Authorization: `Bearer ${token}` }).send();

        // console.log(r.body)
    });
    
});