const request = require('supertest');
const mongoose = require('mongoose');
const {app,server} = require('../app.js');

const {dbCreateUser, dbFindUser ,dbDeleteUser} = require('../services/userServices.js');
const {saveToken,cleanToken} = require('../services/tokenServices.js');
const {genToken} = require('../utils/jwtAuth.js');

const Message = require('../models/Message.js');

const agent = request.agent(app);

describe('TEST OF MESSAGES END ROUTES',()=>{

    const user0 = {name:"Random22",email:"www.random@probe.com",pswd:"12wABCabc!"};
    const user1 = {name:"Jhon117",email:"www.spartan@probe.com",pswd:"12wABCabc!"};
    const message = {payload:{recep:"www.spartan@probe.com",message:"Hello Master Chief"}};

    let user0Id;
    let user1Id;
    let tokenAuth;

    beforeAll(async () => {
        await dbCreateUser(user0);
        await dbCreateUser(user1);

        const user0Obj = await dbFindUser(user0.email);
        const user1Obj = await dbFindUser(user1.email);

        user0Id = user0Obj._id;
        user1Id = user1Obj._id;

        tokenAuth = genToken(user0Id);
        
        await saveToken(user0Id,tokenAuth);
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

    it('READ : Should read the messages',async ()=>{

        await agent
            .get(`/api/chat/read/${user1.email}`)
            .set('Authorization', tokenAuth)
            .expect(200)
            .expect((res)=>{
                expect(res.body.messages).toBeDefined();
            });
    })

    //Server and DB connection closure
    afterAll(async () => {

        await dbDeleteUser(user0Id);
        await dbDeleteUser(user1Id);
        await cleanToken(user0Id);

        await Message.findOneAndDelete({remit:user0Id});

        await mongoose.connection.close();
        server.close();
    });
})