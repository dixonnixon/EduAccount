
import {dbConnect, dbClose} from '../helpers/dbConnect.js';
import mongoose from 'mongoose';

let basicSetup = () => {
    before((done)=> {              // runs before the first test case
        dbConnect()   // connection to the data base
                .once('open', ()=>done())
                .on('error',(error) => done(error))
        

    })
    beforeEach(async (done)=>{          // runs before each test case
    //     "password":"secret12345",
    // "username": "nickname"
        // const res = await request(app).post('/users/login').send({
        //     "username": "nickname", 
        //     "password":"secret12345",
        // });
        // console.log("Login.", res);

        done();
    })

    after((done)=>{                       // runs after the last test case
        dbClose()
                .then(()=>done())
                .catch((err)=>done(err))
    })
}

export  default basicSetup;