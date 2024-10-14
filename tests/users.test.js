const request = require('supertest');
const mongoose = require('mongoose');
const {app,server} = require('../app.js');

const {dbFindUser,dbDeleteUser} = require('../services/userServices.js');
const {dbFindPreUserMail,dbDeletePreUser} = require('../services/preUserServices.js')
const {dbDeleteProfile} = require('../services/profileServices.js');
const {deleteContactList} = require('../services/contactsServices.js');
const {cleanToken} = require('../services/tokenServices.js');

const agent = request.agent(app);

describe('TEST OF CRUD AND LOGIN USERS END ROUTES',()=>{

    //Change email for one of ur own
    const payload = {payload:{name:"Random22",email:"probatin7@gmail.com",pswd:"12wABCabc!"}};
    const payloadUpdt = {payload:{name:"Jhon117"}};

    let tokenAuth;
    let userKey;
    let preUserDocId;
            
    it('REGISTER : Should create a pre user and send key', async ()=>{

        await agent
            .post('/api/user/new')
            .send(payload)
            .expect(200)
            .expect ((res)=>{
                expect(res.body.message).toBeDefined();
            })
        
        const preUser = await dbFindPreUserMail(payload.payload.email);
        expect(preUser).toBeDefined();

        userKey = String(preUser.key);
        preUserDocId = preUser._id;

    })

    it('VERIFY : Should create a new verified user', async ()=>{

        await agent
            .get(`/api/user/verify/${userKey}`)
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
                expect(res.body.message).toBeDefined();
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
        const preUser = await dbFindPreUserMail(payload.payload.email);
        if (user) {
            await dbDeleteUser(user._id);
            await dbDeleteProfile(user._id);
            await deleteContactList(user._id);
            await cleanToken(user._id);
        }
        if (preUser) await dbDeletePreUser(preUser._id);

        await mongoose.connection.close();
        server.close();
    });
})