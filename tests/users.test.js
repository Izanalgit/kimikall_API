const request = require('supertest');
const mongoose = require('mongoose');
const {app,server} = require('../app.js');

const {dbFindUser,dbDeleteUser} = require('../services/userServices.js');
const {cleanToken} = require('../services/tokenServices.js');

const agent = request.agent(app);

describe('TEST OF CRUD AND LOGIN USERS END ROUTES',()=>{

    const payload = {payload:{name:"Random22",email:"www.random@probe.com",pswd:"12wABCabc!"}};
    const payloadUpdt = {payload:{name:"Jhon117"}};

    let tokenAuth;
            
    it('REGISTER : Should create a new user', async ()=>{

        await agent
            .post('/api/user/new')
            .send(payload)
            .expect(201)
            .expect ((res)=>{
                expect(res.body.name).toBe(payload.payload.name);
                expect(res.body.email).toBe(payload.payload.email);
            })        
    })

    it('LOGIN : Should log in the user',async ()=>{

        const response = await agent
            .post('/api/user/login')
            .send(payload)
            .expect(200)
            .expect((res)=>{
                expect(res.headers['authorization']).toBeDefined();
                expect(res.body.user).toBe(payload.payload.name);
                expect(res.body.message).toBeDefined();
            });
        
        tokenAuth = response.headers['authorization'];
    })

    it('UPDATE : Should update the user ',async ()=>{

        await agent
            .patch('/api/user/update')
            .set('Authorization', tokenAuth)
            .send(payloadUpdt)
            .expect(200)
            .expect ((res)=>{
                expect(res.body.name).toBe(payloadUpdt.payload.name);
                expect(res.body.email).toBe(payload.payload.email);
            });     

    })

    it('LOGOUT : Should log out the user',async ()=>{

        await agent
            .post('/api/user/logout')
            .set('Authorization', tokenAuth)
            .expect(200);

    })

    it('REMOVE : Should remove the user',async ()=>{

        const response = await agent
            .post('/api/user/login')
            .send(payload)
            .expect(200);
        
        tokenAuth = response.headers['authorization'];

        await agent
            .del('/api/user/delete')
            .set('Authorization', tokenAuth)
            .send(payload)
            .expect(200);

        const user = await dbFindUser(payload.payload.email);
        expect(user).toBe(null);
        
    })

    //Server and DB connection closure
    afterAll(async () => {
        const user = await dbFindUser(payload.payload.email);
        if (user) {
            await dbDeleteUser(user._id);
            await cleanToken(user._id);
        }

        await mongoose.connection.close();
        server.close();
    });
})