const request = require('supertest');
const mongoose = require('mongoose');
const {app,server} = require('../app.js');

const {dbCreateUser, dbFindUser ,dbDeleteUser} = require('../services/userServices.js');
const {dbCreatePremyDocument,addMessageToken,dbDeletePremyDocument} = require('../services/premyServices.js');
const {saveToken,cleanToken} = require('../services/tokenServices.js');
const {genToken} = require('../utils/jwtAuth.js');

const Message = require('../models/Message.js');

const agent = request.agent(app);

describe('TEST OF MESSAGES END ROUTES',()=>{

    const user0 = {name:"Random22",email:"www.random@probe.com",pswd:"12wABCabc!"};
    const user1 = {name:"Jhon117",email:"www.spartan@probe.com",pswd:"12wABCabc!"};
    
    let user0Id;
    let user1Id;

    let message;
    let messageNT;

    let tokenAuth;

    beforeAll(async () => {
        await dbCreateUser(user0);
        await dbCreateUser(user1);

        const user0Obj = await dbFindUser(user0.email);
        const user1Obj = await dbFindUser(user1.email);

        user0Id = user0Obj._id;
        user1Id = user1Obj._id;

        message = {payload:{recep:user1Id,message:"Hello Master Chief"}};
        messageNT = {payload:{recep:user1Id,message:"Hello again Master Chief"}};

        tokenAuth = genToken(user0Id);
        
        await saveToken(user0Id,tokenAuth);
        await dbCreatePremyDocument(user0Id);
        await addMessageToken(user0Id);
    });
            
    it('SEND : Should send a message', async ()=>{

        await agent
            .post('/api/chat/send')
            .set('Authorization', tokenAuth)
            .send(message)
            .expect(200)
            .expect ((res)=>{
                expect(res.body.message).toBeDefined();
            })        
    })

    it('SEND WITHOUT TOKENS : Should not send the message', async ()=>{

        await agent
            .post('/api/chat/send')
            .set('Authorization', tokenAuth)
            .send(messageNT)
            .expect(402)
            .expect ((res)=>{
                expect(res.body.message).toBeDefined();
            })        
    })

    it('READ : Should read the messages',async ()=>{

        await agent
            .get(`/api/chat/read/${user1Id}`)
            .set('Authorization', tokenAuth)
            .expect(200)
            .expect((res)=>{
                expect(res.body.messages.length).toBe(1);
            });
    })

    //Server and DB connection closure
    afterAll(async () => {

        await dbDeleteUser(user0Id);
        await dbDeleteUser(user1Id);
        await dbDeletePremyDocument(user0Id);
        await cleanToken(user0Id);

        await Message.findOneAndDelete({remit:user0Id});

        await mongoose.connection.close();
        server.close();
    });
})