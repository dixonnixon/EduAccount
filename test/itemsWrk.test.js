process.env.NODE_ENV = 'test';


import {expect} from 'chai';
import request from 'supertest';
import basicSetup from './basicSetup.js';
import app from '../app.js';

import { faker } from '@faker-js/faker/locale/uk';
import { array } from 'yup';
import pkg from 'winston';
const { log } = pkg;
import { isValidObjectId } from 'mongoose';


let testEduc;
let testUser;
let hardwareCatId;

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
            // console.log("insertEduc", res.body);
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
    // console.log("NODE_ENV", process.env.NODE_ENV);
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
        // console.log("testEduc!!!!!!!!!", testEduc);

        //make some values
        //make some items

        const res =  await request(app).post('/workplaces')  
            .set({ Authorization: `Bearer ${token}` })   
            .send({
                wpNo: faker.random.numeric(10)
            });

        fixWp = res.body;

        // console.log("Workplace", res.body);
        expect(res.status).to.equal(200);
        expect(res.body).not.to.be.empty;
        expect(res.body).to.be.an('object');
    });

    it('admin should be able to insert Category for Items', async () => {
        let token = await loginAdmin();
        const res0 =  await request(app).delete('/categories')  
        .set({ Authorization: `Bearer ${token}` }) ;

        const res01 =  await request(app).delete('/properties')  
        .set({ Authorization: `Bearer ${token}` }) ;



        const res =  await request(app).post('/categories')  
        .set({ Authorization: `Bearer ${token}` })   
        .send({
            name: 'Hardware',
            cap: "Обладняння"
        });
       
        expect(res.status).to.equal(200);
        expect(res.body).not.to.be.empty;
        expect(isValidObjectId(res.body._id)).to.equal(true);

        hardwareCatId = res.body._id;

        //but it should not be happened
        const res1 =  await request(app).post('/categories')  
        .set({ Authorization: `Bearer ${token}` })   
        .send({
            name: 'Hardware',
            cap: "Обладняння"
        });

        expect(res1.status).to.equal(500);
        expect(res1.body).to.be.an('object');
        expect(res1.body.error).is.not.null;

       
    });


    it('admin should be able to insert category Props for Items', async () => {
        let token = await loginAdmin();

        const res2 = await request(app).post('/properties')
        .set({ Authorization: `Bearer ${token}` })   
        .send({
            name: 'Motherboard',
            cap: "Материнська Плата",
            category: hardwareCatId
        });
        expect(res2.status).to.equal(200);
        expect(res2.body).not.to.be.empty;
        expect(isValidObjectId(res2.body._id)).to.equal(true);
        
    });

    it('admin should be able to insert Values for Items', async () => {
        let token = await loginAdmin();

       
        
    });

    /** 1. create item obj:
     * {
     *  name: "PC",
        cap: "<PC name>",
        workplace: <ObjectId>, 
     * }
    1.1. Create category oobject
        {
            name: 'Hardware',
            cap: 'Обладнання'
        }

    2. create prop object
    {
        name: "Motherboard",
        cap: "Материнська плата",
        category: <ID>
    }
    2. assign Values to prop;
    3. insert Value

    */
    it('Admin user should insert Item with KeyValues', async () => {
        // console.log("KV", fixWp);
       


        let token = await loginAdmin();

        let req = await request(app).post('/items')
            .set({ Authorization: `Bearer ${token}`})
            
            .send({
                
            });

    });

    it("Educators should be able to insert the items in their Workplaces", async () => {

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