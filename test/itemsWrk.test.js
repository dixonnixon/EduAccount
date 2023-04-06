process.env.NODE_ENV = 'test';


import {expect} from 'chai';
import request from 'supertest';
import basicSetup from './basicSetup.js';
import app from '../app.js';

import { faker } from '@faker-js/faker/locale/uk';

let testEduc;

async function insertEduc() {
    let token = await loginAdmin();
    if(!testEduc) {
        const res =  await request(app).post('/educators')  
            .set({ Authorization: `Bearer ${token}` })   
            .send({
                firstName: "Nevidomiy",  
                lastName: "Korisuvach",
                surName:  "Sistemy",
                user: "",
                age: 34,
            });

     
        expect(res.status).to.equal(200);
        expect(res.body).not.to.be.empty;
        expect(res.body).to.be.an('object');
        testEduc = res.body;
        return testEduc;
    } else return testEduc;
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

    it('should insert Workplace without Items for Educator', async () => {
        const testEduc = await insertEduc();
        let token = await loginAdmin();

        // fixEduc  = res.body;
        console.log(testEduc);

        //make some values
        //make some items

        const res =  await request(app).post('/workplaces')  
            .set({ Authorization: `Bearer ${token}` })   
            .send({
                wpNo: faker.random.numeric(10)
            });

     
        expect(res.status).to.equal(200);
        expect(res.body).not.to.be.empty;
        expect(res.body).to.be.an('object');
    });

    

    //:TODO instead lookup after all method
    it('all things should be deleted', async function() {
        let token = await loginAdmin();

        let r  = await request(app).delete('/educators')  
            .set({ Authorization: `Bearer ${token}` }).send();

        console.log(r.body)
        r = await request(app).delete('/workplaces')  
            .set({ Authorization: `Bearer ${token}` }).send();

        console.log(r.body)
    });
    
});