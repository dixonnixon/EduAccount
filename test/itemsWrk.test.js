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
import { ObjectId } from 'mongodb';


const items = [];

let testEduc;
let testUser;
let hardwareCatId;
let softCatId;
let storageCatId;
let inventoryCatId;

var itemFix;

//------ props
var mbProp;
var osProp;
var tableProp;

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
                wpNo: faker.random.numeric(10),
                floor: faker.random.numeric(4),
                cabinet: faker.random.numeric(39),
            });

        // fixWp = res.body;
        fixWp = res.body._id;

        console.log("Workplace", res.body);
        expect(res.status).to.equal(200);
        expect(res.body).not.to.be.empty;
        expect(res.body).to.be.an('object');
    });

    it('admin should be able to insert Category for Items (except duplicates)', async () => {
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
        
        const res2 =  await request(app).post('/categories')  
        .set({ Authorization: `Bearer ${token}` })   
        .send({
            name: 'Softweare',
            cap: "Програмне забезпечення"
        });

        expect(res2.status).to.equal(200);
        expect(res2.body).to.be.an('object');
        expect(res2.body.error).is.not.null;

        softCatId = res2.body._id;


        const res3 =  await request(app).post('/categories')  
        .set({ Authorization: `Bearer ${token}`})   
        .send({
            name: 'Storage',
            cap: "Склад"
        });

        expect(res3.status).to.equal(200);
        expect(res3.body).to.be.an('object');
        expect(res3.body.error).is.not.null;

        storageCatId = res3.body._id;


        const res4 =  await request(app).post('/categories')  
        .set({ Authorization: `Bearer ${token}`})   
        .send({
            name: 'Inventory',
            cap: "Інвентар"
        });

        expect(res4.status).to.equal(200);
        expect(res4.body).to.be.an('object');
        expect(res4.body.error).is.not.null;

        inventoryCatId = res4.body._id;
       
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

        const res3 = await request(app).post('/properties')
        .set({ Authorization: `Bearer ${token}` })   
        .send({
            name: 'OS',
            cap: "Операційнна система",
            category: softCatId
        });
        expect(res3.status).to.equal(200);
        expect(res3.body).not.to.be.empty;
        expect(isValidObjectId(res3.body._id)).to.equal(true);

        
        const res4 = await request(app).post('/properties')
        .set({ Authorization: `Bearer ${token}` })   
        .send({
            name: 'table',
            cap: "стіл",
            category: inventoryCatId
        });
        expect(res4.status).to.equal(200);
        expect(res4.body).not.to.be.empty;
        expect(isValidObjectId(res4.body._id)).to.equal(true);

        
        mbProp = res2.body._id;
        osProp = res3.body._id;
        tableProp = res4.body._id;
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
    it('Admin user should create empty Item without (without values)', async () => {
        let token = await loginAdmin();
        let req = await request(app).post('/items')
            .set({ Authorization: `Bearer ${token}`})
            
            .send({
                name: 'Andrii comp Х',
                cap: 'Компьютер Андрія №х',
                workplace: fixWp
            });

        console.log(req.body);
        itemFix = req.body._id;

        let req1 = await request(app).post('/items')
            .set({ Authorization: `Bearer ${token}`})
            
            .send({
                name: 'Ludmila comp Х',
                cap: 'Компьютер Людмили №х1',
                workplace: fixWp
            });

        items.push(req1.body._id);

        console.log(req1.body);
    });

    it('Admin user should update value/prop into item', async () => {
        let token = await loginAdmin();

        const newValueMb = {
            item: itemFix,
            name: 'Vendor',
            cap: 'Виробник',
            property: mbProp,
            value: 'Asus'
        };
        
        const newValueOs = {
            item: itemFix,
            name: 'architechture',
            cap: 'Архітектура',
            property: osProp,
            value: 'x86'
        };

        const newValueColor = {
            item: itemFix,
            name: 'color',
            cap: 'Колір',
            property: tableProp,
            value: 'жовтий'
        };

        let req = await request(app).patch('/items/' + itemFix)
        .set({ Authorization: `Bearer ${token}`})
        .send({
            values: [newValueMb, newValueOs, newValueColor]
        });

        expect(req.status).to.equal(200);
        expect(req.body.values.length).to.equal(3);

        // console.log(req.body);
    });



    it('Admin  should add items to Workplace (prevents same items?)', async () => {
        let token = await loginAdmin();
        // let anotherItem = Object.assign({}, itemFix);
        // anotherItem._id = ObjectId;

        console.log("ano", itemFix);
        const res =  await request(app).patch('/workplaces/' + fixWp)  
            .set({ Authorization: `Bearer ${token}` })   
            .send({
                items: [itemFix, itemFix, items[0], items[0]]
            });

        console.log("Items assigned", res.body);
        console.log("values Items ", res.body.items[0].values);
    });

    it('Admin should be able to fetch all items with props by workspace', async() => {
        let token = await loginAdmin();
        const res =  await request(app).get('/workplaces/' + fixWp) 
            .set({ Authorization: `Bearer ${token}` })   

        expect(res.status).to.equal(200);
        expect(res.body.items).to.be.an('array');

        res.body.items.forEach((item, i) => {
            expect(item.values).to.be.an('array');
        });
    });

    it("Educators should be able to insert the items in their Workplaces?", async () => {

    });

    

    //:TODO instead lookup after all method
    it('all things should be deleted', async function() {
        let token = await loginAdmin();

        let r  = await request(app).delete('/educators')  
            .set({ Authorization: `Bearer ${token}` }).send();

        console.log(r.body)
        // r = await request(app).delete('/workplaces')  
        //     .set({ Authorization: `Bearer ${token}` }).send();

        r = await request(app).delete('/items/' + itemFix)  
            .set({ Authorization: `Bearer ${token}` }).send();
        console.log(r.body)
    });
    
});