const request = require('supertest');
const mongoose = require('mongoose');
const {app,server} = require('../app.js');

const {dbCreateUser, dbFindUser ,dbDeleteUser} = require('../services/userServices.js');
const {saveToken,cleanToken} = require('../services/tokenServices.js');
const {genToken} = require('../utils/jwtAuth.js');

const Message = require('../models/Message.js');

const agent = request.agent(app);

describe('TEST OF USER PRIVACY END ROUTES',()=>{

    const user0 = {name:"Random22",email:"www.random@probe.com",pswd:"12wABCabc!"};
    const user1 = {name:"Jhon117",email:"www.spartan@probe.com",pswd:"12wABCabc!"};
    
    let user0Id;
    let user1Id;

    let message;
    let toBlock;
    let toUnBlock;
    
    let tokenAuth0;
    let tokenAuth1;

    beforeAll(async () => {
        await dbCreateUser(user0);
        await dbCreateUser(user1);

        const user0Obj = await dbFindUser(user0.email);
        const user1Obj = await dbFindUser(user1.email);

        user0Id = user0Obj._id;
        user1Id = user1Obj._id;

        message = {payload:{recep:user0Id,message:"Hello Master Chief"}};
        toBlock = {payload:{blockUser:user1Id}};
        toUnBlock = {payload:{unblockUser:user1Id}};

        tokenAuth0 = genToken(user0Id);
        tokenAuth1 = genToken(user1Id);
        
        await saveToken(user0Id,tokenAuth0);
        await saveToken(user1Id,tokenAuth1);
    });
            
    it('BLOCK : Should block an user', async ()=>{

        await agent
            .post('/api/privacy/block')
            .set('Authorization', tokenAuth0)
            .send(toBlock)
            .expect(200)
            .expect ((res)=>{
                expect(res.body.message).toBeDefined();
            })        
    })

    it('LIST : Should read the blocked list',async ()=>{

        await agent
            .get('/api/privacy/block')
            .set('Authorization', tokenAuth0)
            .expect(200)
            .expect ((res)=>{
                expect(res.body.blockedUsers).toBeDefined();
            })    
    })

    it('SEND BLOCKED : Should block send a message', async ()=>{

        await agent
            .post('/api/chat/send')
            .set('Authorization', tokenAuth1)
            .send(message)
            .expect(500)
            .expect ((res)=>{
                expect(res.body.messageErr).toBeDefined();
            })       
    })

    it('UNBLOCK : Should unblock an user', async ()=>{

        await agent
            .post('/api/privacy/unblock')
            .set('Authorization', tokenAuth0)
            .send(toUnBlock)
            .expect(200)
            .expect ((res)=>{
                expect(res.body.message).toBeDefined();
            })        
    })

    //Server and DB connection closure
    afterAll(async () => {

        await dbDeleteUser(user0Id);
        await dbDeleteUser(user1Id);
        await cleanToken(user0Id);
        await cleanToken(user1Id);

        await Message.findOneAndDelete({remit:user1Id});

        await mongoose.connection.close();
        server.close();
    });
})