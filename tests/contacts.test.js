const request = require('supertest');
const mongoose = require('mongoose');
const {app,server} = require('../app.js');

const {dbCreateUser, dbFindUser ,dbDeleteUser} = require('../services/userServices.js');
const {getContactList,deleteContactList,dbCreateContactDocument} = require('../services/contactsServices.js')
const {addBlockedUser} = require('../services/privacyServices.js');
const {saveToken,cleanToken} = require('../services/tokenServices.js');
const {genToken} = require('../utils/jwtAuth.js');

const agent = request.agent(app);

describe('TEST OF CONTACTS END ROUTES',()=>{

    const user0 = {name:"Random22",email:"www.random@probe.com",pswd:"12wABCabc!"};
    const user1 = {name:"Jhon117",email:"www.spartan@probe.com",pswd:"12wABCabc!"};
    const user2 = {name:"Covenant",email:"www.covenant@probe.com",pswd:"12wABCabc!"};
    
    let user0Id;
    let user1Id;
    let user2Id;

    let toRequest;
    let toRequest1;
    let toAdd;
    let toDecline;
    let toRemove;

    let tokenAuth;
    let tokenAuth1;
    let tokenAuth2;

    beforeAll(async () => {
        await dbCreateUser(user0);
        await dbCreateUser(user1);
        await dbCreateUser(user2);

        const user0Obj = await dbFindUser(user0.email);
        const user1Obj = await dbFindUser(user1.email);
        const user2Obj = await dbFindUser(user2.email);

        user0Id = user0Obj._id;
        user1Id = user1Obj._id;
        user2Id = user2Obj._id;

        toRequest = {payload:{newContact:user0Id}};
        toRequest1 = {payload:{newContact:user2Id}};
        toAdd = {payload:{newContact:user1Id}};
        toDecline = {payload:{newContact:user1Id,decline:true}};
        toRemove = {payload:{removeContact:user1Id}};

        tokenAuth = genToken(user0Id);
        tokenAuth1 = genToken(user1Id);
        tokenAuth2 = genToken(user2Id);
        
        await saveToken(user0Id,tokenAuth);
        await saveToken(user1Id,tokenAuth1);
        await saveToken(user2Id,tokenAuth2);

        await addBlockedUser(user0Id,user2Id);

        await dbCreateContactDocument(user0Id);
        await dbCreateContactDocument(user1Id);
        await dbCreateContactDocument(user2Id);
        
    });
     
    it('REQUEST : Should send a contact request to an user', async ()=>{

        await agent
            .patch('/api/contacts/request')
            .set('Authorization', tokenAuth1)
            .send(toRequest)
            .expect(200)
            .expect ((res)=>{
                expect(res.body.message).toBeDefined();
            })

        await agent
            .patch('/api/contacts/request')
            .set('Authorization', tokenAuth1)
            .send(toRequest1)
            .expect(200)
            .expect ((res)=>{
                expect(res.body.message).toBeDefined();
            })

    })

    it('BLOCKED REQUEST : Should send a contact request to an user but fail', async ()=>{

        await agent
            .patch('/api/contacts/request')
            .set('Authorization', tokenAuth2)
            .send(toRequest)
            .expect(500)
            .expect ((res)=>{
                expect(res.body.messageErr).toBeDefined();
            })

    })

    it('ADD : Should add new contact user', async ()=>{

        await agent
            .patch('/api/contacts/add')
            .set('Authorization', tokenAuth)
            .send(toAdd)
            .expect(200)
            .expect ((res)=>{
                expect(res.body.message).toBeDefined();
            })

        const contactList = await getContactList(user0Id);

        expect(contactList).toBeDefined(); 
        expect(contactList.requests.length).toBe(0);
        expect(contactList.contacts.length).toBeGreaterThan(0);
        expect(contactList.contacts[0].contactId).toEqual(user1Id);
    })

    it('DECLINE : Should decline contact request', async ()=>{

        await agent
            .patch('/api/contacts/add')
            .set('Authorization', tokenAuth2)
            .send(toDecline)
            .expect(200)
            .expect ((res)=>{
                expect(res.body.message).toBeDefined();
            })

        const contactList = await getContactList(user2Id);

        expect(contactList).toBeDefined(); 
        expect(contactList.requests.length).toBe(0);
        expect(contactList.contacts.length).toBe(0);

    })

    it('LIST : Should get the contacts list',async ()=>{

        await agent
            .get('/api/contacts/list')
            .set('Authorization', tokenAuth)
            .expect(200)
            .expect((res)=>{
                expect(res.body.contactsList).toBeDefined();
                expect(res.body.contactsList.contacts.length).toBe(1);
                expect(res.body.contactsList.contacts[0].contactId).toBeDefined();
            });
    })

    it('REMOVE : Should remove a user from contacts', async ()=>{

        await agent
            .patch('/api/contacts/remove')
            .set('Authorization', tokenAuth)
            .send(toRemove)
            .expect(200)
            .expect ((res)=>{
                expect(res.body.message).toBeDefined();
            })

        const contactList = await getContactList(user0Id);
        expect(contactList.contacts.length).toBe(0);
        expect(contactList.solicitations.length).toBe(0);
        expect(contactList.requests.length).toBe(0);         
    })

    //Server and DB connection closure
    afterAll(async () => {

        await dbDeleteUser(user0Id);
        await dbDeleteUser(user1Id);
        await dbDeleteUser(user2Id);

        await cleanToken(user0Id);
        await cleanToken(user1Id);
        await cleanToken(user2Id);

        await deleteContactList(user0Id);
        await deleteContactList(user1Id);
        await deleteContactList(user2Id);

        await mongoose.connection.close();
        server.close();
    });
})