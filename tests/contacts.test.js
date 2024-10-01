const request = require('supertest');
const mongoose = require('mongoose');
const {app,server} = require('../app.js');

const {dbCreateUser, dbFindUser ,dbDeleteUser} = require('../services/userServices.js');
const {getContactList,deleteContactList,dbCreateContactDocument} = require('../services/contactsServices.js')
const {saveToken,cleanToken} = require('../services/tokenServices.js');
const {genToken} = require('../utils/jwtAuth.js');

const agent = request.agent(app);

describe('TEST OF CONTACTS END ROUTES',()=>{

    const user0 = {name:"Random22",email:"www.random@probe.com",pswd:"12wABCabc!"};
    const user1 = {name:"Jhon117",email:"www.spartan@probe.com",pswd:"12wABCabc!"};
    
    let user0Id;
    let user1Id;

    let toAdd;
    let toRemove;

    let tokenAuth;

    beforeAll(async () => {
        await dbCreateUser(user0);
        await dbCreateUser(user1);

        const user0Obj = await dbFindUser(user0.email);
        const user1Obj = await dbFindUser(user1.email);

        user0Id = user0Obj._id;
        user1Id = user1Obj._id;

        toAdd = {payload:{newContact:user1Id}};
        toRemove = {payload:{removeContact:user1Id}};

        tokenAuth = genToken(user0Id);
        
        await saveToken(user0Id,tokenAuth);
        await dbCreateContactDocument(user0Id);
        
    });
            
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
        expect(contactList.length).toBeGreaterThan(0);
        expect(contactList[0].contactId).toEqual(user1Id);
    })

    it('LIST : Should get the contacts list',async ()=>{

        await agent
            .get('/api/contacts/list')
            .set('Authorization', tokenAuth)
            .expect(200)
            .expect((res)=>{
                expect(res.body.contactsList).toBeDefined();
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
        expect(contactList.length).toBe(0);         
    })

    //Server and DB connection closure
    afterAll(async () => {

        await dbDeleteUser(user0Id);
        await dbDeleteUser(user1Id);
        await cleanToken(user0Id);
        await deleteContactList(user0Id);

        await mongoose.connection.close();
        server.close();
    });
})